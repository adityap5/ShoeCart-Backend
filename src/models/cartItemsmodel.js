const mongoose = require('mongoose');

const cartItemsSchema = new mongoose.Schema({
    cart:{type:mongoose.Schema.ObjectId, ref: 'cart',required: true},
    product: { type: mongoose.Schema.ObjectId, ref: 'products', required: true,},
    size: { type: String, required: true},
    quantity: { type:Number,required: true, default: 1},
    price: { type: Number, required: true},
    userId: {type:mongoose.Schema.ObjectId, ref: 'users',required: true},

   
})
const CartItem = mongoose.model("cartItems",cartItemsSchema);
module.exports= CartItem;