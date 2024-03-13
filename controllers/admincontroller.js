const User = require ('../models/usermodel')
const category = require ('../models/category')

const bcrypt = require ('bcrypt')
const Brand = require('../models/Brand')

// hashig password

const securepassword = async(password)=>{
    try {

        const passwordHash = await bcrypt.hash(password,8)
        return passwordHash
    } catch (error) {
        
        console.log(error.message);

    }
}

// loading admin login

const loadLogin = async (req,res) =>{
  
    try {
        const flash = req.flash('flash')
        res.render('login',{msg:flash})
        
    } catch (error) {
        
        console.log(error.message);

    }

}

// verifyAdmin 

const verifyAdmin = async ( req , res ) => {

    try {

        const bodyEmail = req.body.email
        const passsword = req.body.password

        
        const adminCheck = await User.findOne({email:bodyEmail,is_admin:1})
        

        if(adminCheck){

            const passwordMatch = await bcrypt.compare(passsword,adminCheck.password)

            if(passwordMatch){
                req.session.admin = adminCheck._id
                res.redirect('/admin/dashboard')
            }else{
                req.flash('flash','Incorrect password')
                res.redirect('/admin')
            }
        }else{
            req.flash('flash','You are not admin')
            res.redirect('/admin')
        }
        

       
        
    } catch (error) {
        
        console.log(error.message);

    }

}
//load dashboard

const loadDashboard = async ( req , res) => {
    try {

        res.render('dashboard')
        
    } catch (error) {
        console.log(error.message);

    }
}


// load orders 

const loadOrders = async ( req , res) => {
    try {


        res.render('orders')
        
    } catch (error) {
        


    }
}




const loadUsers = async (req, res) => {
    
    try {

        //  Page Navigation :-

        const limit = 4;
        const page = parseInt(req.query.page) || 1
        const skip = (page - 1) * limit;

        const totaluserCount = await User.countDocuments({ is_admin :0  });
        const totalPages = Math.ceil(totaluserCount / limit);

        const userData = await User.find({ is_admin: false })
            
            .skip(skip)
            .limit(limit);

            res.render('usersList', { clint: userData, currentPage: page, totalPages });      //  Fetch UserData in dbs and passing to userList ejs
        
        // res.render('admin/userList', { admin: req.session.admin, use, user: 'user' , currentPage: page, totalPages})

        // const userData = await Admin.find({ is_admin: false });    
        
    } catch (error) {

        console.log(error.message);
        
    }

};

// load category

const adminCategory = async (req, res) => {

    try {

        

        const limit = 5;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const brands = await Brand.find()
        const totalCatCount = await category.countDocuments();
        const totalPages = Math.ceil(totalCatCount / limit);

        const categoryData = await category.find()

        .skip(skip)
        .limit(limit);

        res.render("category" , {category : categoryData ,  currentPage: page, totalPages ,brands});
        
    } catch (error) {
        
        console.log(error.message);

    }

};


//


// admin logou

const adminLogout =async ( req , res ) => {
    
    try {
        console.log('gh');
        req.session.admin = undefined

        req.flash('flash','logout succcessfully...')
        res.redirect('/admin')

        
    } catch (error) {
        
    }
} 


// user action

const userAction = async ( req, res) =>{
    
    try {
        
        const userId =req.params.id
        //    const user=await User.findOne({_id:userId});
        //    user.is_blocked=!user.is_blocked;
        const blockedUser = await User.findOne({_id:userId,is_blocked:true})
        const activeUser = await User.findOne({_id:userId,is_blocked:false})

        if(activeUser){

            const useraction = await User.findByIdAndUpdate({_id:userId},{$set:{is_blocked:true}})
           
        }else{

            const useraction = await User.findByIdAndUpdate({_id:userId},{$set:{is_blocked:false}})
           
        }

        
    } catch (error) {
        
        console.log(error.message);

    }
}



module.exports = {
   loadLogin,
   verifyAdmin,
   loadDashboard,
   adminLogout,
   loadOrders,
   loadUsers,
   adminCategory,
   
   userAction

}