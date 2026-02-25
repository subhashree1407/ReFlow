const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
    returnNumber: { type: String, required: true, unique: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    category: { type: String, required: true },
    reason: { type: String, required: true },
    status: {
        type: String,
        enum: ['initiated', 'pickup-scheduled', 'picked-up', 'received', 'inspecting', 'repackaging', 'relabeled', 'in-local-pool', 'sent-back', 'transferred', 'rejected'],
        default: 'initiated'
    },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    // Intelligent Scoring System Fields
    returnScore: { type: Number, default: 0 },
    recommendationStatus: {
        type: String,
        enum: ['approve', 'manual-review', 'reject', 'pending'],
        default: 'pending'
    },

    originalDeliveryLocation: {
        lat: { type: Number },
        lng: { type: Number },
        address: { type: String, default: '' }
    },
    returnPickupLocation: {
        lat: { type: Number },
        lng: { type: Number },
        address: { type: String, default: '' }
    },
    assignedWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    originalWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    sellerDecision: {
        type: String,
        enum: ['pending', 'keep-local', 'return-original', 'transfer-high-demand'],
        default: 'pending'
    },

    // Condition Classification
    inspectionResult: {
        type: String,
        enum: ['pending', 'passed', 'failed', 'Like New', 'Good', 'Damaged', 'Reject'],
        default: 'pending'
    },
    resaleDecision: {
        type: String,
        enum: ['pending', 'local-resale', 'discounted-resale', 'return-to-seller', 'non-resellable'],
        default: 'pending'
    },

    timeline: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String
    }],

    // CO2 and Distance tracking
    distanceSaved: { type: Number, default: 0 }, // km to assigned warehouse
    distanceBetweenLocations: { type: Number, default: 0 }, // km between original delivery and pickup
    co2Saved: { type: Number, default: 0 } // in kg
}, { timestamps: true });

module.exports = mongoose.model('Return', returnSchema);
