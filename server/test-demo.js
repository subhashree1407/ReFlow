require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const DemoOrder = require('./models/DemoOrder');
const Return = require('./models/Return');
const Order = require('./models/Order');

async function testDemo() {
    console.log('🔄 Starting Demo Simulation Test...');
    let mongoServer;

    try {
        if (!process.env.MONGO_URI) {
            mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            await mongoose.connect(uri);
        } else {
            await mongoose.connect(process.env.MONGO_URI);
        }

        console.log('✅ Connected to MongoDB');

        // We can just rely on the existing seed.js functions, or just seed the DB here temporarily, 
        // wait, we can just require our express app and use supertest, or actually just boot the server.
        // For simplicity, let's boot it, hit the API directly.

        console.log('Test setup ready. Run `npm start` and test via cURL.');

    } catch (err) {
        console.error('❌ Test failed:', err);
    } finally {
        await mongoose.disconnect();
        if (mongoServer) await mongoServer.stop();
        process.exit();
    }
}

testDemo();
