const express = require('express');
const router = express.Router();
const Warehouse = require('../models/Warehouse');
const Inventory = require('../models/Inventory');
const { protect, authorize } = require('../middleware/auth');
const { findNearestWarehouse } = require('../utils/geo');

// Get all warehouses
router.get('/', protect, async (req, res) => {
    try {
        const warehouses = await Warehouse.find();
        res.json(warehouses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get nearest warehouse
router.get('/nearest', protect, async (req, res) => {
    try {
        const { lat, lng } = req.query;
        const result = await findNearestWarehouse(parseFloat(lat), parseFloat(lng));
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get warehouse dashboard stats
router.get('/stats', protect, authorize('admin'), async (req, res) => {
    try {
        const warehouses = await Warehouse.find();
        const inventory = await Inventory.find();

        const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
        const totalLoad = warehouses.reduce((sum, w) => sum + w.currentLoad, 0);
        const pendingInspection = inventory.filter(i => i.inspectionStatus === 'pending').length;
        const repackagingQueue = inventory.filter(i => i.repackagingStatus === 'pending' || i.repackagingStatus === 'in-progress').length;
        const localPoolItems = inventory.filter(i => i.isLocalPool).length;

        res.json({
            totalWarehouses: warehouses.length,
            activeWarehouses: warehouses.filter(w => w.status === 'active').length,
            totalCapacity,
            totalLoad,
            utilizationRate: totalCapacity > 0 ? Math.round((totalLoad / totalCapacity) * 100) : 0,
            pendingInspection,
            repackagingQueue,
            localPoolItems,
            warehouses: warehouses.map(w => ({
                _id: w._id, name: w.name, code: w.code, status: w.status,
                loadPercentage: w.loadPercentage, currentLoad: w.currentLoad, capacity: w.capacity,
                location: w.location, demandScore: w.demandScore
            }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create warehouse
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const warehouse = await Warehouse.create(req.body);
        res.status(201).json(warehouse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update warehouse
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(warehouse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
