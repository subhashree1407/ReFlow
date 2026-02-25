const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const Warehouse = require('../models/Warehouse');
const { protect, authorize } = require('../middleware/auth');
const { findNearestWarehouse, haversineDistance, calculateDeliveryTime, calculateCostSaving } = require('../utils/geo');

// Create order with smart local inventory matching
router.post('/', protect, async (req, res) => {
    try {
        const { productId, quantity, deliveryLocation, deliveryAddress } = req.body;
        const userLat = deliveryLocation?.lat || req.user.location.lat;
        const userLng = deliveryLocation?.lng || req.user.location.lng;

        // Step 1: Check local inventory pool nearest to user
        const { warehouse: nearestWH, distance: nearDist } = await findNearestWarehouse(userLat, userLng);
        let fulfilledFrom = null;
        let fromLocal = false;
        let costSaved = 0;
        let timeSaved = 0;

        if (nearestWH) {
            const localInventory = await Inventory.findOne({
                product: productId, warehouse: nearestWH._id,
                isLocalPool: true, quantity: { $gte: quantity || 1 },
                inspectionStatus: 'passed', repackagingStatus: 'done', labelGenerated: true
            });

            if (localInventory) {
                fulfilledFrom = nearestWH._id;
                fromLocal = true;
                localInventory.quantity -= (quantity || 1);
                if (localInventory.quantity <= 0) await Inventory.findByIdAndDelete(localInventory._id);
                else await localInventory.save();

                // Calculate savings vs original warehouse
                const allWarehouses = await Warehouse.find();
                const farthest = allWarehouses.reduce((max, wh) => {
                    const d = haversineDistance(userLat, userLng, wh.location.lat, wh.location.lng);
                    return d > max.d ? { wh, d } : max;
                }, { wh: null, d: 0 });
                costSaved = calculateCostSaving(farthest.d, nearDist);
                timeSaved = Math.round((calculateDeliveryTime(farthest.wh?.location.lat || 0, farthest.wh?.location.lng || 0, userLat, userLng) - calculateDeliveryTime(nearestWH.location.lat, nearestWH.location.lng, userLat, userLng)) * 10) / 10;
            }
        }

        // Step 2: fallback to seller warehouse (first available warehouse with stock)
        if (!fulfilledFrom) {
            const anyInventory = await Inventory.findOne({ product: productId, quantity: { $gte: quantity || 1 } }).populate('warehouse');
            if (anyInventory) {
                fulfilledFrom = anyInventory.warehouse._id;
                anyInventory.quantity -= (quantity || 1);
                if (anyInventory.quantity <= 0) await Inventory.findByIdAndDelete(anyInventory._id);
                else await anyInventory.save();
            } else {
                fulfilledFrom = nearestWH?._id;
            }
        }

        const orderCount = await Order.countDocuments();
        const order = await Order.create({
            orderNumber: `ORD-${String(orderCount + 1).padStart(5, '0')}`,
            user: req.user._id,
            product: productId,
            quantity: quantity || 1,
            totalPrice: req.body.totalPrice || 0,
            fulfilledFrom,
            fulfilledFromLocal: fromLocal,
            deliveryLocation: { lat: userLat, lng: userLng },
            deliveryAddress: deliveryAddress || req.user.address,
            sellerWarehouse: fulfilledFrom,
            costSaved,
            timeSaved,
            estimatedDelivery: new Date(Date.now() + (fromLocal ? 4 : 24) * 60 * 60 * 1000),
            timeline: [{ status: 'placed', timestamp: new Date(), note: fromLocal ? 'Fulfilled from local warehouse' : 'Fulfilled from seller warehouse' }]
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all orders (admin)
router.get('/', protect, async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'user') filter.user = req.user._id;
        const orders = await Order.find(filter)
            .populate('product', 'name price image sku')
            .populate('fulfilledFrom', 'name code')
            .populate('user', 'name email')
            .sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single order
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('product').populate('fulfilledFrom').populate('user', 'name email');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update order status
router.patch('/:id/status', protect, authorize('admin'), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        order.status = req.body.status;
        order.timeline.push({ status: req.body.status, timestamp: new Date(), note: req.body.note || '' });
        if (req.body.status === 'delivered') order.actualDelivery = new Date();
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
