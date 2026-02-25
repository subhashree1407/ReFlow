const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    address: { type: String, required: true },
    capacity: { type: Number, required: true, default: 1000 },
    currentLoad: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'maintenance', 'full'], default: 'active' },
    manager: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    demandScore: { type: Number, default: 50 }
}, { timestamps: true });

warehouseSchema.virtual('loadPercentage').get(function () {
    return Math.round((this.currentLoad / this.capacity) * 100);
});

warehouseSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Warehouse', warehouseSchema);
