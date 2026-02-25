const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Return = require('../models/Return');
const Product = require('../models/Product');
const Warehouse = require('../models/Warehouse');
const DemoOrder = require('../models/DemoOrder');
const { protect, authorize } = require('../middleware/auth');
const { haversineDistance } = require('../utils/geo');

// Run HyperLocal Demo Simulation
router.post('/simulate', protect, authorize('admin'), async (req, res) => {
    try {
        const product = await Product.findOne({ category: { $in: ['Clothes', 'clothes'] } }) || await Product.findOne();
        if (!product) return res.status(400).json({ message: 'No product available' });

        const User = require('../models/User');
        const user1 = await User.findOne({ role: 'user' }) || req.user;

        let bangaloreWH = await Warehouse.findOne({ name: /Bangalore/i }) || await Warehouse.findOne();
        let delhiWH = await Warehouse.findOne({ name: /Delhi/i }) || await Warehouse.findOne();

        if (!bangaloreWH || !delhiWH) {
            return res.status(400).json({ message: 'Warehouses not found for simulation. Please ensure DB is seeded.' });
        }

        const delhiLocation = { lat: 28.7041, lng: 77.1025, address: 'Delhi, India' };
        const bangaloreLocation = bangaloreWH.location;

        const distanceBangaloreToDelhi = Math.round(haversineDistance(bangaloreLocation.lat, bangaloreLocation.lng, delhiLocation.lat, delhiLocation.lng) * 100) / 100;
        const distanceDelhiToDelhiWH = Math.round(haversineDistance(delhiLocation.lat, delhiLocation.lng, delhiWH.location.lat, delhiWH.location.lng) * 100) / 100;
        const distanceReduced = Math.round((distanceBangaloreToDelhi - distanceDelhiToDelhiWH) * 100) / 100;
        const co2Saved = Math.round(distanceReduced * 0.2 * 10) / 10;
        const costSaved = Math.round(distanceReduced * 2.5);

        // Create DemoOrder record
        const demoRun = await DemoOrder.create({
            orderNumber: `DEMO-${Date.now()}`,
            product: product._id,
            originalSourceWarehouse: bangaloreWH._id,
            originalDeliveryLocation: delhiLocation,
            returnPickupLocation: delhiLocation,
            storedWarehouse: delhiWH._id,
            localDispatchUsed: true,
            distanceReduced: distanceReduced,
            deliveryTimeSaved: 4, // 5 days vs 1 day
            co2Saved: co2Saved,
            timeline: [
                { status: 'Order 1 Placed', note: 'Product ordered from Bangalore to Delhi' },
                { status: 'Order 1 Delivered', note: 'Traveled ' + distanceBangaloreToDelhi + ' km (5 Days)' },
                { status: 'Return Initiated', note: 'User returning product from Delhi' },
                { status: 'Target Node Identified', note: `Routing to Delhi Warehouse (${distanceDelhiToDelhiWH} km away)` },
                { status: 'Local Inspection', note: 'Condition: Like New. Added to local pool.' },
                { status: 'Order 2 Placed', note: 'New user in Delhi ordered same product' },
                { status: 'Smart Dispatch', note: 'Fulfilled locally from Delhi Warehouse. Delivery time: 1 Day.' }
            ]
        });

        // Create actual Order/Return docs to affect the main dashboard analytics
        const order1 = await Order.create({
            orderNumber: `SIM-O1-${Date.now()}`,
            user: user1._id,
            product: product._id,
            totalPrice: product.price,
            fulfilledFrom: bangaloreWH._id,
            fulfilledFromLocal: false,
            deliveryLocation: delhiLocation,
            status: 'delivered'
        });

        await Return.create({
            returnNumber: `SIM-R-${Date.now()}`,
            order: order1._id,
            user: user1._id,
            product: product._id,
            category: product.category,
            reason: 'Demo Returns',
            returnScore: 95,
            recommendationStatus: 'approve',
            approvalStatus: 'approved',
            status: 'in-local-pool',
            inspectionResult: 'Like New',
            resaleDecision: 'local-resale',
            assignedWarehouse: delhiWH._id,
            distanceSaved: distanceDelhiToDelhiWH,
            distanceBetweenLocations: distanceBangaloreToDelhi,
            co2Saved: co2Saved,
            originalDeliveryLocation: delhiLocation,
            returnPickupLocation: delhiLocation
        });

        const order2 = await Order.create({
            orderNumber: `SIM-O2-${Date.now()}`,
            user: user1._id,
            product: product._id,
            totalPrice: product.price,
            fulfilledFrom: delhiWH._id,
            fulfilledFromLocal: true,
            deliveryLocation: delhiLocation,
            status: 'delivered',
            timeSaved: 96, // 4 days saved -> 96 hours
            costSaved: costSaved
        });

        res.json({
            message: 'Simulation completed successfully',
            demoRecord: demoRun,
            metrics: {
                timeSaved: '4 Days',
                distanceReduced: distanceReduced,
                co2Saved: co2Saved,
                costSaved: costSaved,
                bangaloreWH: bangaloreWH.name,
                delhiWH: delhiWH.name
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
