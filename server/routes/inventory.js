const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const { protect, authorize } = require('../middleware/auth');

// Get inventory by warehouse
router.get('/', protect, async (req, res) => {
    try {
        const filter = {};
        if (req.query.warehouse) filter.warehouse = req.query.warehouse;
        if (req.query.isLocalPool) filter.isLocalPool = req.query.isLocalPool === 'true';
        if (req.query.inspectionStatus) filter.inspectionStatus = req.query.inspectionStatus;

        const inventory = await Inventory.find(filter)
            .populate('product', 'name price sku image category')
            .populate('warehouse', 'name code')
            .sort('-createdAt');
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Check local availability for a product
router.get('/check-local/:productId', protect, async (req, res) => {
    try {
        const localItems = await Inventory.find({
            product: req.params.productId,
            isLocalPool: true,
            inspectionStatus: 'passed',
            repackagingStatus: 'done',
            labelGenerated: true,
            quantity: { $gt: 0 }
        }).populate('warehouse', 'name code location');
        res.json({ available: localItems.length > 0, items: localItems });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update inspection status
router.patch('/:id/inspection', protect, authorize('admin'), async (req, res) => {
    try {
        const inv = await Inventory.findById(req.params.id);
        if (!inv) return res.status(404).json({ message: 'Inventory item not found' });
        inv.inspectionStatus = req.body.inspectionStatus;
        if (req.body.inspectionStatus === 'passed' && inv.repackagingStatus === 'not-needed') {
            inv.repackagingStatus = 'pending';
        }
        await inv.save();
        res.json(inv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update repackaging status
router.patch('/:id/repackaging', protect, authorize('admin'), async (req, res) => {
    try {
        const inv = await Inventory.findById(req.params.id);
        if (!inv) return res.status(404).json({ message: 'Inventory item not found' });
        inv.repackagingStatus = req.body.repackagingStatus;
        if (req.body.repackagingStatus === 'done') inv.labelGenerated = true;
        await inv.save();
        res.json(inv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
