const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 },
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ['placed', 'confirmed', 'shipped', 'out-for-delivery', 'delivered', 'return-initiated', 'returned'],
        default: 'placed'
    },
    fulfilledFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    fulfilledFromLocal: { type: Boolean, default: false },
    deliveryLocation: {
        lat: { type: Number },
        lng: { type: Number }
    },
    deliveryAddress: { type: String },
    estimatedDelivery: { type: Date },
    actualDelivery: { type: Date },
    timeline: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String
    }],
    sellerWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    costSaved: { type: Number, default: 0 },
    timeSaved: { type: Number, default: 0 } // in hours
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
