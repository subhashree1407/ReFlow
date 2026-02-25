const express = require('express');
const router = express.Router();
const Return = require('../models/Return');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const { protect, authorize } = require('../middleware/auth');
const { findNearestWarehouse, haversineDistance } = require('../utils/geo');

const ALLOWED_RETURN_CATEGORIES = ['clothes', 'footwear', 'apparel', 'fashion accessories'];

function normalizeCategory(category) {
    return String(category || '').trim().toLowerCase();
}

function isAllowedCategory(category) {
    return ALLOWED_RETURN_CATEGORIES.includes(normalizeCategory(category));
}

// Initiate a return
router.post('/', protect, async (req, res) => {
    try {
        const { orderId, reason, returnPickupLocation, returnPickupAddress } = req.body;
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (req.user.role === 'user' && String(order.user) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to return this order' });
        }

        const product = await Product.findById(order.product);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (!isAllowedCategory(product.category)) {
            return res.status(400).json({ message: 'Only clothes, footwear, apparel, and fashion accessories can be returned.' });
        }

        const pickupLat = Number(returnPickupLocation?.lat);
        const pickupLng = Number(returnPickupLocation?.lng);
        if (!Number.isFinite(pickupLat) || !Number.isFinite(pickupLng)) {
            return res.status(400).json({ message: 'Return pickup location is required.' });
        }

        const originalLat = order.deliveryLocation?.lat;
        const originalLng = order.deliveryLocation?.lng;

        const distanceBetweenLocations = (Number.isFinite(originalLat) && Number.isFinite(originalLng))
            ? Math.round(haversineDistance(originalLat, originalLng, pickupLat, pickupLng) * 100) / 100
            : 0;

        // Detect nearest warehouse from pickup location
        const { warehouse, distance } = await findNearestWarehouse(pickupLat, pickupLng);

        // --- Calculate Return Eligibility Score ---
        let returnScore = 20; // Base score

        // 1. Distance factor (Closer is better for local reuse)
        if (warehouse) {
            if (distance < 20) returnScore += 40;
            else if (distance < 50) returnScore += 30;
            else if (distance < 100) returnScore += 15;
            else returnScore += 5;
        }

        // 2. Category factor
        if (isAllowedCategory(product.category)) {
            returnScore += 20;
        }

        // 3. User return frequency factor
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const pastReturns = await Return.countDocuments({ user: req.user._id, createdAt: { $gt: thirtyDaysAgo } });
        if (pastReturns === 0) returnScore += 20;
        else if (pastReturns < 3) returnScore += 10;
        else returnScore -= 20; // Penalize for frequent returns

        returnScore = Math.max(0, Math.min(100, returnScore)); // Cap between 0-100

        let recommendationStatus = 'pending';
        if (returnScore > 70) recommendationStatus = 'approve';
        else if (returnScore >= 40) recommendationStatus = 'manual-review';
        else recommendationStatus = 'reject';

        const returnCount = await Return.countDocuments();
        const co2Saved = Math.round(distance * 0.2 * 10) / 10; // 0.2kg CO2 saved per km not traveled to source hub

        const returnDoc = await Return.create({
            returnNumber: `RET-${String(returnCount + 1).padStart(5, '0')}`,
            order: order._id,
            user: req.user._id,
            product: order.product,
            category: product.category,
            reason,
            approvalStatus: 'pending',
            returnScore,
            recommendationStatus,
            co2Saved,
            originalDeliveryLocation: {
                lat: originalLat,
                lng: originalLng,
                address: order.deliveryAddress || ''
            },
            returnPickupLocation: {
                lat: pickupLat,
                lng: pickupLng,
                address: returnPickupAddress || ''
            },
            assignedWarehouse: warehouse?._id,
            originalWarehouse: order.fulfilledFrom,
            distanceSaved: distance,
            distanceBetweenLocations,
            timeline: [{ status: 'initiated', timestamp: new Date(), note: `Score: ${returnScore}, Nearest node: ${warehouse?.name || 'N/A'} (${distance} km)` }]
        });

        order.status = 'return-initiated';

        order.timeline.push({ status: 'return-initiated', timestamp: new Date(), note: `Return ${returnDoc.returnNumber} initiated` });
        await order.save();

        res.status(201).json(returnDoc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all returns
router.get('/', protect, async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'user') filter.user = req.user._id;
        const productPopulate = {
            path: 'product',
            select: 'name price sku image category seller',
            ...(req.user.role === 'seller' ? { match: { seller: req.user._id } } : {})
        };
        const returns = await Return.find(filter)
            .populate(productPopulate)
            .populate('assignedWarehouse', 'name code location address')
            .populate('user', 'name email')
            .populate('order', 'orderNumber')
            .sort('-createdAt');

        const filteredReturns = req.user.role === 'seller'
            ? returns.filter(r => r.product)
            : returns;
        res.json(filteredReturns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Seller approval / rejection
router.patch('/:id/approval', protect, authorize('seller', 'admin'), async (req, res) => {
    try {
        const { decision, note } = req.body;
        const ret = await Return.findById(req.params.id).populate('product', 'name category seller');
        if (!ret) return res.status(404).json({ message: 'Return not found' });

        if (req.user.role === 'seller' && String(ret.product?.seller) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to approve this return' });
        }

        const isAllowed = isAllowedCategory(ret.category || ret.product?.category);
        if (!isAllowed) {
            ret.approvalStatus = 'rejected';
            ret.status = 'rejected';
            ret.timeline.push({ status: 'rejected', timestamp: new Date(), note: 'Rejected: Electronics not allowed' });
            await ret.save();
            return res.json(ret);
        }

        if (!['approved', 'rejected'].includes(decision)) {
            return res.status(400).json({ message: 'Decision must be approved or rejected.' });
        }

        ret.approvalStatus = decision;
        if (decision === 'approved') {
            ret.status = 'pickup-scheduled';
        } else {
            ret.status = 'rejected';
        }
        ret.timeline.push({ status: `approval-${decision}`, timestamp: new Date(), note: note || '' });

        // If approved but warehouse missing, assign nearest from pickup location
        if (decision === 'approved' && !ret.assignedWarehouse && ret.returnPickupLocation?.lat && ret.returnPickupLocation?.lng) {
            const { warehouse, distance } = await findNearestWarehouse(ret.returnPickupLocation.lat, ret.returnPickupLocation.lng);
            ret.assignedWarehouse = warehouse?._id;
            ret.distanceSaved = distance;
        }

        await ret.save();
        res.json(ret);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Re-assign nearest warehouse
router.patch('/:id/assign-warehouse', protect, authorize('admin'), async (req, res) => {
    try {
        const ret = await Return.findById(req.params.id);
        if (!ret) return res.status(404).json({ message: 'Return not found' });
        if (!ret.returnPickupLocation?.lat || !ret.returnPickupLocation?.lng) {
            return res.status(400).json({ message: 'Pickup location missing' });
        }

        const { warehouse, distance } = await findNearestWarehouse(ret.returnPickupLocation.lat, ret.returnPickupLocation.lng);
        ret.assignedWarehouse = warehouse?._id;
        ret.distanceSaved = distance;
        ret.timeline.push({ status: 'warehouse-assigned', timestamp: new Date(), note: `Assigned ${warehouse?.name || 'N/A'} (${distance} km)` });
        await ret.save();
        res.json(ret);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update return status / pipeline stage
router.patch('/:id/status', protect, authorize('admin'), async (req, res) => {
    try {
        const ret = await Return.findById(req.params.id);
        if (!ret) return res.status(404).json({ message: 'Return not found' });

        ret.status = req.body.status;
        ret.timeline.push({ status: req.body.status, timestamp: new Date(), note: req.body.note || '' });

        if (req.body.status === 'inspecting') ret.inspectionResult = 'pending';
        if (req.body.inspectionResult) ret.inspectionResult = req.body.inspectionResult;

        // When relabeled → add to local pool
        if (req.body.status === 'in-local-pool') {
            await Inventory.create({
                product: ret.product,
                warehouse: ret.assignedWarehouse,
                quantity: 1,
                condition: 'like-new',
                inspectionStatus: 'passed',
                repackagingStatus: 'done',
                labelGenerated: true,
                isLocalPool: true,
                source: 'return',
                returnRef: ret._id
            });
        }

        await ret.save();
        res.json(ret);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Product Condition Classification (Inspection)
router.patch('/:id/inspect', protect, authorize('admin'), async (req, res) => {
    try {
        const { condition, note } = req.body;
        const ret = await Return.findById(req.params.id);
        if (!ret) return res.status(404).json({ message: 'Return not found' });

        if (!['Like New', 'Good', 'Damaged', 'Reject'].includes(condition)) {
            return res.status(400).json({ message: 'Invalid condition classification' });
        }

        ret.inspectionResult = condition;

        let resaleDecision = 'pending';
        if (condition === 'Like New') resaleDecision = 'local-resale';
        else if (condition === 'Good') resaleDecision = 'discounted-resale';
        else if (condition === 'Damaged') resaleDecision = 'return-to-seller';
        else if (condition === 'Reject') resaleDecision = 'non-resellable';

        ret.resaleDecision = resaleDecision;

        ret.timeline.push({
            status: 'inspection-completed',
            timestamp: new Date(),
            note: `Condition: ${condition}. Decision: ${resaleDecision}. ${note || ''}`
        });

        await ret.save();
        res.json(ret);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Seller decision
router.patch('/:id/seller-decision', protect, authorize('seller', 'admin'), async (req, res) => {
    try {
        const ret = await Return.findById(req.params.id);
        if (!ret) return res.status(404).json({ message: 'Return not found' });
        if (ret.approvalStatus !== 'approved') {
            return res.status(400).json({ message: 'Return must be approved before routing decisions.' });
        }
        ret.sellerDecision = req.body.decision;
        ret.timeline.push({ status: `seller-decision: ${req.body.decision}`, timestamp: new Date(), note: req.body.note || '' });

        if (req.body.decision === 'return-original') ret.status = 'sent-back';
        if (req.body.decision === 'transfer-high-demand') ret.status = 'transferred';
        if (req.body.decision === 'keep-local') ret.status = 'in-local-pool';

        await ret.save();
        res.json(ret);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
