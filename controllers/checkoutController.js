const User = require('../models/usermodel')
const Address = require ('../models/address')
const category = require ('../models/category')

//load checkout

const loadcheckout = async ( req , res ) => {

    const listedCategory = await category.find({is_listed:true})

    if(req.session.user){
        
        const userdata = await User.findById({_id:req.session.user._id})

        const addressList = await Address.findOne({userId:req.session.user._id}) || null

        res.render('checkout',{listedCategory,login:req.session.user,userdata,addressList})

    }else{

        res.redirect('/login')


    }
}

const addAddresscheckout = async ( req , res ) => {

    try {

        console.log("hahahahah");

        const user = req.query.id
        
        const getAddress = req.body.address
        const exist = await Address.findOne({userId:user,addresss:{$elemMatch:{name:getAddress.address}}})
        if(!exist){
         const   newAddress = await Address.findOneAndUpdate( {userId:user},
           { $addToSet:{
            addresss:{ userName:req.session.user.fullname ,
                     name:getAddress.address , 
                     city:getAddress.city , 
                     state:getAddress.state ,
                     phone:getAddress.phone ,
                     pincode:getAddress.pincode }      
            }},
             {new:true ,upsert:true}
        )
        if(newAddress){
            res.send({success:true})
        }    
        }else{
            res.status(400).send({failed:true})
        }
        } catch (error) {
        
    }
}
module.exports ={
    loadcheckout,
    addAddresscheckout
}