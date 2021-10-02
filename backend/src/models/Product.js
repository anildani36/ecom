const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
    productID : {
        type: String,
        required: true,
        unique: true
    },
    productName : {
        type: String,
        required: true
        
    },
    
    price :{
        type:String,
        required:true
    },
    availableUnits :{
        type:String,
        required:true
    },
})
const Product = new mongoose.model("Product", productSchema);
module.exports = Product;