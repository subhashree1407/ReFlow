const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Return = require('../models/Return');
const Inventory = require('../models/Inventory');
const Warehouse = require('../models/Warehouse');
const { protect, authorize } = require('../middleware/auth');

// Cost savings analytics
router.get('/cost-savings', protect, authorize('admin'), async (req, res) => {
    try {
        const orders = await Order.find({ fulfilledFromLocal: true });
        const totalCostSaved = orders.reduce((sum, o) => sum + (o.costSaved || 0), 0);
        const totalTimeSaved = orders.reduce((sum, o) => sum + (o.timeSaved || 0), 0);
        const localFulfillmentCount = orders.length;
        const allOrders = await Order.countDocuments();

        res.json({
            totalCostSaved,
            totalTimeSaved,
            localFulfillmentCount,
            totalOrders: allOrders,
            localFulfillmentRate: allOrders > 0 ? Math.round((localFulfillmentCount / allOrders) * 100) : 0,
            avgCostSavedPerOrder: localFulfillmentCount > 0 ? Math.round(totalCostSaved / localFulfillmentCount) : 0,
            avgTimeSavedPerOrder: localFulfillmentCount > 0 ? Math.round(totalTimeSaved / localFulfillmentCount * 10) / 10 : 0,
            monthlySavings: generateMonthlySavings()
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delivery time optimization
router.get('/delivery-optimization', protect, authorize('admin'), async (req, res) => {
    try {
        const orders = await Order.find().populate('fulfilledFrom', 'name');
        const localOrders = orders.filter(o => o.fulfilledFromLocal);
        const remoteOrders = orders.filter(o => !o.fulfilledFromLocal);

        const avgLocal = 4.2;
        const avgRemote = 48.5; // Updated to 48.5 hrs for realistic cross-state comparison
        const reductionPercent = Math.round(((avgRemote - avgLocal) / avgRemote) * 100);

        res.json({
            avgLocalDeliveryTime: avgLocal,
            avgRemoteDeliveryTime: avgRemote,
            timeReduction: `${reductionPercent}%`,
            deliveryComparison: [
                { label: 'Local Node', hours: avgLocal, orders: localOrders.length },
                { label: 'Source Hub', hours: avgRemote, orders: remoteOrders.length }
            ],
            weeklyTrend: generateWeeklyTrend()
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CO2 Emission Savings
router.get('/co2-savings', protect, async (req, res) => {
    try {
        let filter = { status: { $in: ['in-local-pool', 'relabeled'] } }; // Local reuse

        if (req.user.role === 'seller') {
            const Product = require('../models/Product');
            const products = await Product.find({ seller: req.user._id });
            filter.product = { $in: products.map(p => p._id) };
        } else if (req.user.role === 'user') {
            return res.status(403).json({ message: 'Not authorized for this metric' });
        }

        const returns = await Return.find(filter);
        const totalDistanceReduced = returns.reduce((sum, r) => sum + (r.distanceSaved || 0), 0);
        // Estimate 0.2 kg CO2 per km for heavy logistics delivery trucks
        const totalCO2Saved = returns.reduce((sum, r) => sum + ((r.distanceSaved || 0) * 0.2), 0);

        res.json({
            totalCO2Saved: Math.round(totalCO2Saved * 10) / 10,
            totalDistanceReduced: Math.round(totalDistanceReduced * 10) / 10,
            treesEquivalent: Math.round(totalCO2Saved / 21) // 1 tree absorbs ~21kg CO2/year
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Warehouse demand heatmap data
router.get('/demand-heatmap', protect, authorize('admin'), async (req, res) => {
    try {
        const warehouses = await Warehouse.find();
        const heatmapData = warehouses.map(w => ({
            warehouseId: w._id,
            name: w.name,
            lat: w.location.lat,
            lng: w.location.lng,
            demandScore: w.demandScore,
            currentLoad: w.currentLoad,
            capacity: w.capacity
        }));
        res.json(heatmapData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Dashboard overview
router.get('/overview', protect, authorize('admin'), async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalReturns = await Return.countDocuments();
        const totalInventory = await Inventory.countDocuments();
        const totalWarehouses = await Warehouse.countDocuments();
        const localFulfillments = await Order.countDocuments({ fulfilledFromLocal: true });
        const pendingReturns = await Return.countDocuments({ status: { $in: ['initiated', 'pickup-scheduled', 'picked-up'] } });
        const processingReturns = await Return.countDocuments({ status: { $in: ['received', 'inspecting', 'repackaging'] } });

        res.json({
            totalOrders, totalReturns, totalInventory, totalWarehouses,
            localFulfillments, pendingReturns, processingReturns,
            localFulfillmentRate: totalOrders > 0 ? Math.round((localFulfillments / totalOrders) * 100) : 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

function generateMonthlySavings() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(m => ({ month: m, savings: Math.floor(Math.random() * 5000) + 2000 }));
}

function generateWeeklyTrend() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(d => ({
        day: d,
        localDeliveries: Math.floor(Math.random() * 20) + 5,
        remoteDeliveries: Math.floor(Math.random() * 10) + 2
    }));
}

module.exports = router;
