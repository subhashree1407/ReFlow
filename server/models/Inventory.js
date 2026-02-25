const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    quantity: { type: Number, default: 1 },
    condition: { type: String, enum: ['new', 'like-new', 'good', 'fair'], default: 'new' },
    inspectionStatus: { type: String, enum: ['pending', 'inspecting', 'passed', 'failed'], default: 'pending' },
    repackagingStatus: { type: String, enum: ['not-needed', 'pending', 'in-progress', 'done'], default: 'not-needed' },
    labelGenerated: { type: Boolean, default: false },
    isLocalPool: { type: Boolean, default: false },
    source: { type: String, enum: ['original', 'return'], default: 'original' },
    returnRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Return' }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
