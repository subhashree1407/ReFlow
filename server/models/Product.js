const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    category: {
        type: String,
        enum: ['Clothes', 'Footwear', 'Apparel', 'Fashion Accessories'],
        required: true
    },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String, default: '' },
    sku: { type: String, required: true, unique: true },
    allowLocalWarehouse: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
