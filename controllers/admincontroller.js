const User = require ('../models/usermodel')

const bcrypt = require ('bcrypt')

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

        // console.log(email,passsword);
        const adminCheck = await User.findOne({email:bodyEmail,is_admin:1})
        console.log(adminCheck);

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



// admin logou

const adminLogout =async ( req , res ) => {
    
    try {

        req.session.admin = undefined

        req.flash('flash','logout succcessfully...')
        res.redirect('/admin')

        
    } catch (error) {
        
    }
} 


module.exports = {
   loadLogin,
   verifyAdmin,
   loadDashboard,
   adminLogout

}