const User = require ('../models/usermodel')
const Address = require ('../models/address')
const category = require ('../models/category');
const address = require('../models/address');

const loadAddress = async (req, res) => {
    try {
        if(req.session.user){
          const listedCategory = await category.find({is_listed:true})
        const userdata = await User.findById({_id:req.session.user._id})
        const addressList = await Address.findOne({userId:req.session.user._id}) || null

        res.render('address',{listedCategory,userdata,login:req.session.user,addressList})   
        }else{
            res.redirect('/login')
        }
       
    } catch (error) {
        
    }
}


const addAddress = async ( req , res ) => {
    try {
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

// delete Address
const deleteAddress = async ( req , res ) => {
    try {
        const  user = req.query.id
        const addres = req.query.address
       const remove = await Address.updateOne({userId:user},{$pull:{addresss:{_id:addres}}}) 
        res.send({seleted:true})
    } catch (error) {
        
    }
}










module.exports ={
loadAddress,
addAddress,
deleteAddress
}