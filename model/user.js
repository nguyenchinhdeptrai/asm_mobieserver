const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    img: {
        type: String, required: true
    }, status: {
        type: Number,
        default: 1,
    }, password: {
        type: String,
        required: true,
    }
});
//
const userModel = new mongoose.model('user', user);
module.exports = userModel;