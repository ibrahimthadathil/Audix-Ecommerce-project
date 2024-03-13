const Cart = require ('../models/cart')
const category = require ('../models/category')
const PRODUCTS = require ('../models/product')
const User = require ('../models/usermodel')


// load cart
const cart = async ( req ,res ) => {

    try {
        const listedCategory = await category.find({is_listed:true})
        const userdata = await User.findById({_id:req.session.user._id})
        const userProduct = await Cart.findOne({userId:req.session.user._id}).populate('product.productId')
        console.log(userProduct);
        

        if(req.session.user){
            res.render('cart',{login:req.session.user,listedCategory,userProduct,userdata})
        }else{
            res.redirect('/login')
        }
        
    } catch (error) {
        

    }

}

// cart add 
const addCart = async ( req , res ) => {
    try {
        if(req.session.user){
        const cartProduct = await PRODUCTS.findOne({_id:req.params.id})
        const exist= await Cart.findOne ({userId:req.session.user._id,product:{$elemMatch:{productId:req.params.id}}})
        if(!exist){
           await Cart.findOneAndUpdate({userId:req.session.user},
            {$addToSet:{
                product:{productId:req.params.id,
                price:cartProduct.price}
            }},{new:true ,upsert:true})

            res.send({success:true})

        }else{

            res.send({exist:true})
        }
        }else{
            
            res.send({failed:true})
        }
        
    } catch (error) {
        
    }
}
 

module.exports = {
    cart,
    addCart
}