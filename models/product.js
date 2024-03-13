const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    price:{
        type:Number,
        required: true
    },
    offer_price:{
        type :Number,
        required :true,
        default:0
    },
    stock: {
        type: Number,
        required: true,
    },
    category:{type :mongoose.Schema.Types.ObjectId, required:true , ref : 'category'},
    description:{
        type:String,
        required:true
    },
    brand:{
        type :String,
        required :true
    },
    image:{
        type:Array,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        required:true
    },

});

module.exports = Products = mongoose.model('Products',productSchema);

