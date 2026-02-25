const mongoose = require('mongoose');

const demoOrderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    originalSourceWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    originalDeliveryLocation: {
        lat: { type: Number },
        lng: { type: Number },
        address: { type: String, default: 'Delhi' }
    },
    returnPickupLocation: {
        lat: { type: Number },
        lng: { type: Number },
        address: { type: String, default: 'Delhi' }
    },
    storedWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    localDispatchUsed: { type: Boolean, default: false },
    deliveryTimeSaved: { type: Number, default: 0 }, // in hours or days
    distanceReduced: { type: Number, default: 0 }, // in km
    co2Saved: { type: Number, default: 0 }, // in kg
    timeline: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('DemoOrder', demoOrderSchema);
