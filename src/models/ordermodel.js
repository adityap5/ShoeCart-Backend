const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
   
    user:{type: mongoose.Schema.ObjectId, ref: 'users'},
    orderItems:{type: mongoose.Schema.ObjectId, ref: 'orderItems'},
    orderDate: { type: Date, required: true},
    deliveryDate: { type: Date}, 
    shippingAddress: { type: mongoose.Schema.ObjectId ,ref:'addresses'}, 
    paymentDetails: {
        paymentMethod:{ type:String},
        transactionId:{ type:String},
        paymentId:{ type:String},
        paymentStatus:{ type:String, default:"PENDING"},
    } ,
    totalPrice: { type: Number,required: true}, 
    totalDisscontedPrice: { type: Number,required: true}, 
    disscount: { type: Number,required: true}, 
    orderStatus: { type: String,required: true}, 
    totalItem: { type: String,required: true}, 
    createdAt: { type: Date, default:Date.now}, 
});
const Order = mongoose.model("orders",orderSchema);
module.exports= Order;