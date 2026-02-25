const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/returns', require('./routes/returns'));
app.use('/api/warehouses', require('./routes/warehouses'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/demo', require('./routes/demo'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5001;

async function startServer() {
    let mongoUri = process.env.MONGO_URI;

    // Try connecting to local MongoDB first, fallback to in-memory
    try {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
        console.log('MongoDB connected (local)');
    } catch (err) {
        console.log('Local MongoDB not available, starting in-memory MongoDB...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        mongoUri = mongod.getUri();
        await mongoose.connect(mongoUri);
        console.log('In-memory MongoDB connected');

        // Auto-seed the in-memory database
        console.log('Auto-seeding database...');
        await seedDatabase();
        console.log('Database seeded successfully!');
    }

    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

async function seedDatabase() {
    const bcrypt = require('bcryptjs');
    const User = require('./models/User');
    const Warehouse = require('./models/Warehouse');
    const Product = require('./models/Product');
    const Inventory = require('./models/Inventory');
    const Order = require('./models/Order');
    const Return = require('./models/Return');

    // Users
    const admin = await User.create({ name: 'Admin User', email: 'admin@hyperlocal.com', password: 'admin123', role: 'admin', location: { lat: 28.6139, lng: 77.2090 }, address: 'New Delhi' });
    const seller1 = await User.create({ name: 'Indie Apparel Co.', email: 'seller@hyperlocal.com', password: 'seller123', role: 'seller', location: { lat: 19.0760, lng: 72.8777 }, address: 'Mumbai' });
    const seller2 = await User.create({ name: 'Urban Footwear', email: 'seller2@hyperlocal.com', password: 'seller123', role: 'seller', location: { lat: 12.9716, lng: 77.5946 }, address: 'Bangalore' });
    const user1 = await User.create({ name: 'Rahul Sharma', email: 'user@hyperlocal.com', password: 'user123', role: 'user', location: { lat: 28.5355, lng: 77.3910 }, address: 'Noida, UP' });
    const user2 = await User.create({ name: 'Priya Patel', email: 'priya@hyperlocal.com', password: 'user123', role: 'user', location: { lat: 28.4595, lng: 77.0266 }, address: 'Gurgaon, Haryana' });

    // Warehouses
    const warehouses = await Warehouse.insertMany([
        { name: 'Delhi Hub', code: 'WH-DEL', location: { lat: 28.6139, lng: 77.2090 }, address: 'Connaught Place, New Delhi', capacity: 1000, currentLoad: 420, manager: 'Amit Verma', demandScore: 85 },
        { name: 'Noida Fulfillment Center', code: 'WH-NOI', location: { lat: 28.5355, lng: 77.3910 }, address: 'Sector 62, Noida', capacity: 800, currentLoad: 310, manager: 'Sanjay Kumar', demandScore: 72 },
        { name: 'Gurgaon Warehouse', code: 'WH-GUR', location: { lat: 28.4595, lng: 77.0266 }, address: 'Cyber City, Gurgaon', capacity: 1200, currentLoad: 550, manager: 'Vikram Singh', demandScore: 90 },
        { name: 'Mumbai Central', code: 'WH-MUM', location: { lat: 19.0760, lng: 72.8777 }, address: 'Andheri East, Mumbai', capacity: 1500, currentLoad: 780, manager: 'Rajesh Patil', demandScore: 95 },
        { name: 'Bangalore Tech Park', code: 'WH-BLR', location: { lat: 12.9716, lng: 77.5946 }, address: 'Electronic City, Bangalore', capacity: 900, currentLoad: 400, manager: 'Deepa Rao', demandScore: 78 },
    ]);

    // Products
    const products = await Product.insertMany([
        { name: 'Cotton Crewneck Tee', description: 'Breathable everyday tee', price: 799, category: 'Clothes', seller: seller1._id, sku: 'APP-TEE-001', image: '👕' },
        { name: 'Slim Fit Denim Jeans', description: 'Stretch denim with tapered fit', price: 1899, category: 'Clothes', seller: seller1._id, sku: 'APP-JNS-002', image: '👖' },
        { name: 'Linen Summer Shirt', description: 'Lightweight linen button-down', price: 1499, category: 'Apparel', seller: seller1._id, sku: 'APP-SHR-003', image: '🧵' },
        { name: 'Running Sneakers', description: 'Cushioned sole for daily runs', price: 2499, category: 'Footwear', seller: seller2._id, sku: 'FTW-RUN-001', image: '👟' },
        { name: 'Leather Ankle Boots', description: 'Classic boot with soft lining', price: 3299, category: 'Footwear', seller: seller2._id, sku: 'FTW-BOT-002', image: '🥾' },
        { name: 'Wool Blend Hoodie', description: 'Warm hoodie with kangaroo pocket', price: 2199, category: 'Apparel', seller: seller2._id, sku: 'APP-HOD-003', image: '🧥' },
        { name: 'Canvas Tote Bag', description: 'Reusable tote with zip pocket', price: 599, category: 'Fashion Accessories', seller: seller1._id, sku: 'ACC-TOT-004', image: '👜' },
        { name: 'Silk Scarf', description: 'Printed scarf with soft sheen', price: 899, category: 'Fashion Accessories', seller: seller2._id, sku: 'ACC-SCF-005', image: '🧣' },
        { name: 'Polo Shirt', description: 'Smart-casual polo with rib collar', price: 1299, category: 'Clothes', seller: seller1._id, sku: 'APP-POL-006', image: '👕' },
        { name: 'Athleisure Joggers', description: 'Stretch joggers for travel', price: 1599, category: 'Apparel', seller: seller2._id, sku: 'APP-JOG-007', image: '🩳' },
    ]);

    // Inventory
    const inventoryItems = [];
    for (const product of products) {
        for (const wh of warehouses) {
            inventoryItems.push({ product: product._id, warehouse: wh._id, quantity: Math.floor(Math.random() * 20) + 5, condition: 'new', inspectionStatus: 'passed', repackagingStatus: 'not-needed', labelGenerated: true, isLocalPool: false, source: 'original' });
        }
    }
    for (let i = 0; i < 8; i++) {
        inventoryItems.push({ product: products[i % products.length]._id, warehouse: warehouses[i % warehouses.length]._id, quantity: Math.floor(Math.random() * 3) + 1, condition: 'like-new', inspectionStatus: 'passed', repackagingStatus: 'done', labelGenerated: true, isLocalPool: true, source: 'return' });
    }
    for (let i = 0; i < 5; i++) {
        inventoryItems.push({ product: products[i]._id, warehouse: warehouses[i % warehouses.length]._id, quantity: 1, condition: 'good', inspectionStatus: i < 3 ? 'pending' : 'inspecting', repackagingStatus: 'pending', labelGenerated: false, isLocalPool: false, source: 'return' });
    }
    await Inventory.insertMany(inventoryItems);

    // Orders
    const orderData = [
        { orderNumber: 'ORD-00001', user: user1._id, product: products[0]._id, quantity: 1, totalPrice: 799, status: 'delivered', fulfilledFrom: warehouses[1]._id, fulfilledFromLocal: true, deliveryLocation: { lat: 28.5355, lng: 77.3910 }, deliveryAddress: 'Noida, UP', costSaved: 120, timeSaved: 14.3, estimatedDelivery: new Date(Date.now() - 86400000), actualDelivery: new Date(Date.now() - 86400000), timeline: [{ status: 'placed', timestamp: new Date(Date.now() - 259200000), note: 'Fulfilled from local warehouse' }, { status: 'confirmed', timestamp: new Date(Date.now() - 244800000) }, { status: 'shipped', timestamp: new Date(Date.now() - 172800000), note: 'From WH-NOI' }, { status: 'out-for-delivery', timestamp: new Date(Date.now() - 100800000) }, { status: 'delivered', timestamp: new Date(Date.now() - 86400000), note: 'Delivered to customer' }] },
        { orderNumber: 'ORD-00002', user: user2._id, product: products[3]._id, quantity: 1, totalPrice: 2499, status: 'shipped', fulfilledFrom: warehouses[2]._id, fulfilledFromLocal: false, deliveryLocation: { lat: 28.4595, lng: 77.0266 }, deliveryAddress: 'Gurgaon, Haryana', estimatedDelivery: new Date(Date.now() + 86400000), timeline: [{ status: 'placed', timestamp: new Date(Date.now() - 172800000), note: 'From seller warehouse' }, { status: 'confirmed', timestamp: new Date(Date.now() - 158400000) }, { status: 'shipped', timestamp: new Date(Date.now() - 86400000), note: 'From WH-GUR' }] },
        { orderNumber: 'ORD-00003', user: user1._id, product: products[5]._id, quantity: 1, totalPrice: 2199, status: 'delivered', fulfilledFrom: warehouses[0]._id, fulfilledFromLocal: true, deliveryLocation: { lat: 28.5355, lng: 77.3910 }, deliveryAddress: 'Noida, UP', costSaved: 95, timeSaved: 12.1, estimatedDelivery: new Date(Date.now() - 172800000), actualDelivery: new Date(Date.now() - 172800000), timeline: [{ status: 'placed', timestamp: new Date(Date.now() - 432000000), note: 'Fulfilled from local pool' }, { status: 'delivered', timestamp: new Date(Date.now() - 172800000) }] },
        { orderNumber: 'ORD-00004', user: user2._id, product: products[1]._id, quantity: 1, totalPrice: 1899, status: 'return-initiated', fulfilledFrom: warehouses[2]._id, fulfilledFromLocal: false, deliveryLocation: { lat: 28.4595, lng: 77.0266 }, deliveryAddress: 'Gurgaon, Haryana', timeline: [{ status: 'placed', timestamp: new Date(Date.now() - 604800000) }, { status: 'delivered', timestamp: new Date(Date.now() - 345600000) }, { status: 'return-initiated', timestamp: new Date(Date.now() - 86400000), note: 'Size issue' }] },
        { orderNumber: 'ORD-00005', user: user1._id, product: products[8]._id, quantity: 2, totalPrice: 2598, status: 'out-for-delivery', fulfilledFrom: warehouses[1]._id, fulfilledFromLocal: true, deliveryLocation: { lat: 28.5355, lng: 77.3910 }, deliveryAddress: 'Noida, UP', costSaved: 80, timeSaved: 10.0, estimatedDelivery: new Date(Date.now() + 14400000), timeline: [{ status: 'placed', timestamp: new Date(Date.now() - 86400000), note: 'Fulfilled from local warehouse' }, { status: 'shipped', timestamp: new Date(Date.now() - 43200000) }, { status: 'out-for-delivery', timestamp: new Date(Date.now() - 3600000) }] },
    ];
    const orders = await Order.insertMany(orderData);

    // Returns
    await Return.insertMany([
        {
            returnNumber: 'RET-00001',
            order: orders[3]._id,
            user: user2._id,
            product: products[1]._id,
            category: products[1].category,
            reason: 'Size mismatch',
            status: 'inspecting',
            approvalStatus: 'approved',
            originalDeliveryLocation: { lat: 28.4595, lng: 77.0266, address: 'Gurgaon, Haryana' },
            returnPickupLocation: { lat: 28.4632, lng: 77.0212, address: 'DLF Phase 2, Gurgaon' },
            assignedWarehouse: warehouses[2]._id,
            originalWarehouse: warehouses[2]._id,
            sellerDecision: 'pending',
            inspectionResult: 'pending',
            distanceSaved: 8.5,
            distanceBetweenLocations: 1.1,
            timeline: [{ status: 'initiated', timestamp: new Date(Date.now() - 86400000), note: 'Nearest warehouse: WH-GUR (8.5 km)' }, { status: 'pickup-scheduled', timestamp: new Date(Date.now() - 72000000) }, { status: 'picked-up', timestamp: new Date(Date.now() - 43200000) }, { status: 'received', timestamp: new Date(Date.now() - 21600000), note: 'Received at WH-GUR' }, { status: 'inspecting', timestamp: new Date(Date.now() - 7200000), note: 'Quality check in progress' }]
        },
        {
            returnNumber: 'RET-00002',
            order: orders[2]._id,
            user: user1._id,
            product: products[5]._id,
            category: products[5].category,
            reason: 'Changed my mind',
            status: 'in-local-pool',
            approvalStatus: 'approved',
            originalDeliveryLocation: { lat: 28.5355, lng: 77.3910, address: 'Noida, UP' },
            returnPickupLocation: { lat: 28.5309, lng: 77.3875, address: 'Sector 61, Noida' },
            assignedWarehouse: warehouses[1]._id,
            originalWarehouse: warehouses[0]._id,
            sellerDecision: 'keep-local',
            inspectionResult: 'passed',
            distanceSaved: 15.2,
            distanceBetweenLocations: 0.7,
            timeline: [{ status: 'initiated', timestamp: new Date(Date.now() - 604800000) }, { status: 'received', timestamp: new Date(Date.now() - 518400000) }, { status: 'inspecting', timestamp: new Date(Date.now() - 432000000) }, { status: 'repackaging', timestamp: new Date(Date.now() - 345600000), note: 'Passed inspection' }, { status: 'relabeled', timestamp: new Date(Date.now() - 259200000) }, { status: 'in-local-pool', timestamp: new Date(Date.now() - 172800000), note: 'Added to local inventory' }]
        },
        {
            returnNumber: 'RET-00003',
            order: orders[0]._id,
            user: user1._id,
            product: products[0]._id,
            category: products[0].category,
            reason: 'Color not as expected',
            status: 'repackaging',
            approvalStatus: 'approved',
            originalDeliveryLocation: { lat: 28.5355, lng: 77.3910, address: 'Noida, UP' },
            returnPickupLocation: { lat: 28.5392, lng: 77.3991, address: 'Sector 63, Noida' },
            assignedWarehouse: warehouses[1]._id,
            originalWarehouse: warehouses[1]._id,
            sellerDecision: 'keep-local',
            inspectionResult: 'passed',
            distanceSaved: 3.2,
            distanceBetweenLocations: 1.0,
            timeline: [{ status: 'initiated', timestamp: new Date(Date.now() - 259200000) }, { status: 'received', timestamp: new Date(Date.now() - 172800000) }, { status: 'inspecting', timestamp: new Date(Date.now() - 86400000) }, { status: 'repackaging', timestamp: new Date(Date.now() - 43200000), note: 'Good condition, repackaging' }]
        }
    ]);

    console.log('Login credentials:');
    console.log('  Admin:  admin@hyperlocal.com / admin123');
    console.log('  Seller: seller@hyperlocal.com / seller123');
    console.log('  User:   user@hyperlocal.com / user123');
}

startServer().catch(err => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
});
