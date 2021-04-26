const { Schema, model } = require("mongoose");

const orders = Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    count: {
        type: Number,
        required: true,
        trim: true
    },

    price: {
        type: Number,
        required: true,
        trim: true
    },
    deliveryFee: {
        type: Number,
        default: 0
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: "./buyer"
    }
    // number: { type: Object, trim: true }
});

module.exports.orders = model("orders", orders);