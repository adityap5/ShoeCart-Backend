const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
   
    title:{type:String,required: true},
    description:{type:String,required: true},
    price: { type: Number, required: true}, 
    disscountedPrice:  { type: Number},
    disscountPercent:  { type: Number},
    quantity: { type: Number , required: true},
    brand: { type: String , required: true},
    color: { type: String , required: true},
    sizes:[ { 
       name: { type: String},
       quantity: { type: String},
    }],
    imageUrl: { type:String}, 
    ratings:[{type: mongoose.Schema.ObjectId, ref: 'ratings'}],
    reviews:[{type: mongoose.Schema.ObjectId, ref: 'reviews'}],
    numRatings: { type: Number , default: 0},
    category:{type: mongoose.Schema.ObjectId, ref: 'categories'},
    createdAt:{type:Date,default:Date.now}


});
const Product = mongoose.model("products",productSchema);
module.exports= Product;