const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    color: { type: String },
    type: { type: String, required: true }
})
const ProductModel = new mongoose.model('product', productSchema);
module.exports = ProductModel;