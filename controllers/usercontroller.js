const User = require('../models/usermodel')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const otp  = require('../models/OTPmodel')
const flash = require('express-flash')
const { trusted } = require('mongoose')
require("dotenv").config();
const { EMAIL_USER, EMAIL_PASSWORD} = process.env;



const securepassword = async (password) => {

    try {
        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash
        
    } catch (error) {
        console.log(error.message);
        
    }
    
}
//***************Load home**************

const loadHome = async (req,res) =>{
    
    try { 
        dataDelete()
        
        if(req.session.user){

            res.render('homepage',{ login: req.session.user})
        }else{

            res.render('homepage')
        }
        
        
    } 
    catch (error) {
        
        console.log(error.message);

      }
}





//*********load signup */

const loadsignup = async (req,res)=>{
    try {
        const flash = req.flash('flash')
        res.render('signup',{msg:flash})
        
    } catch (error) {
        console.log(error.messge);
    }
}

//********Load login**********/

const  loadlogin = async (req,res) => {

    try {
      const flash =  req.flash('flash')
        res.render('login',{msg:flash})
        
    } catch (error) {
        
    }

}

//***********verifyLogin******** */

const verifylogin = async (req,res)=>{
    try {
        
        const email = req.body.email
        
        const verifiedUser = await User.findOne({email:email,is_verified:true})

       

        if(verifiedUser){
            const passsword = req.body.password
            const passwordMatch = await bcrypt.compare(passsword,verifiedUser.password)
            

            if(passwordMatch){

                req.session.user=verifiedUser._id

                res.redirect('/')

            }else{
                
                req.flash('flash','invalid password')
                res.redirect('/login')
            }
        }else{
            req.flash('flash','You are not a verified user')
            res.redirect('/login')
        }
        

    } catch (error) {
        
        console.log(error.message);

    }
}




// insert user 

const insertUser = async (req,res)=>{

    try {

    const bodyEmail = req.body.email
    
    // check the mail from the database

    const emailCheck =await User.findOne({email:bodyEmail})
    

    

    if(emailCheck){


        req.flash('flash','Email already exist')
        res.redirect('/signup')

    }else{

        
    const hashpassword = await securepassword(req.body.password)

    // insert user

    const user = new User({
        fullname:req.body.fullname,
        email:req.body.email,
        phone:req.body.phone,
        password:hashpassword,
        is_admin:0,
        is_blocked:false,
        

    })



    const userData = await user.save()

    if(userData){

        const OTP = generateOTP() 
        console.log(OTP);

        await sendOTPmail(req.body.fullname,req.body.email,OTP,res)  // passing data as argument

    }else{

        res.redirect('/signup')
    }

    }
    

    
    
    } catch (error) {
        
        console.log(error.message);

    }

   
}


//  Function to Generator Otp :-

 
const generateOTP = () => {
    
    const digits = '0123456789';

    let OTP = '';

    for (let i = 0; i < 4; i++) {

        OTP += digits[Math.floor(Math.random() * 10)];
    };

    return OTP;

};

// sending  otp to mail

const sendOTPmail = async(username,email,sendOtp,res) => {

    try {
        
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:  process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        

        // compose email 
        const mailOption = {
            from : process.env.EMAIL_USER,
            to:email,
            subject:'For Otp Verification',
            html :`<h3>Hello ${username},Welcome To AUDIX</h3> <br> <h4>Enter : ${sendOtp} on the OTP Box to register</h4>`
        }

        //send mail
        transporter.sendMail(mailOption,function(error,info){

            if(error){
                console.log('Erro sending mail :- ',error.message);
            }else{
                console.log('Email has been sended :- ',info.response);
            }
        });

        // otp schema adding 
        const userOTP = new otp({
            emailId:email,
            otp:sendOtp,
         
        });

        await userOTP.save()
        res.redirect(`/verify?email=${email}`)
        

    } catch (error) {
        console.log(error.message);
    }
}



const loadotpVerify = async (req,res)=>{

    try {
      
        const queryemail = req.query.email  
        const flash = req.flash('flash')
        
        res.render('otp',{queryemail,msg:flash})
        
    } catch (error) {

        console.log(error.message);
        
    }
}

// verify the otp

const verifyOTP = async (req,res) =>{

    try {

        const getQueryEmail = req.body.email
        
        let enteredOTP =req.body.digit1 + req.body.digit2 + req.body.digit3 + req.body.digit4
        
        const verifiedOTP = await otp.findOne({emailId:getQueryEmail,otp:enteredOTP});

        
        
    
        if(verifiedOTP){

            // if (verifiedOTP.expiresAt < Date.now()) {
            //     req.flash('flash', 'OTP has expired. Please request a new OTP.');
            //     return res.redirect(`/verify?email=${getQueryEmail}`);
            // }

            const userData = await User.findOne({email:getQueryEmail})

            if(userData){

                await User.findByIdAndUpdate({_id:userData._id},{$set:{is_verified:true}})
                res.redirect('/login')

            }

        }else{
            
            req.flash('flash','Invalid OTP...!')
            res.redirect(`/verify?email=${getQueryEmail}`)
           
        }
        
        
    } catch (error) {
        console.log(error.message);
        
    }

}

// resend -OTP

const resendOtp = async ( req,res) =>{

try {
    
    const re_otpMail = req.query.email

    const dataCheck = await User.findOne({email:re_otpMail})

    if(dataCheck){
        
        const OTP = generateOTP()
        console.log(OTP + ' Re-send otp');
        
        await sendOTPmail(dataCheck.fullname,dataCheck.email,OTP,res)
        

    }

} catch (error) {
    
    console.log(error.message);

}

}



// logout user
const logoutUser = async (req,res) =>{

    try {
        req.session.user = undefined;
        res.redirect('/')

    } catch (error) {

        console.log(error.message);

    }
}


// load categotry 
const loadCategory = async (req,res) => {
    try {
        
        if(req.session.user){

            res.render('category',{login :req.session.user})

        }else{

            res.render('category')

        }


    } catch (error) {
        
        console.log(error.message);

    }
}

// load products

const loadProducts = async (req,res) => {
    try {
        
        if(req.session.user){

            res.render('products',{login :req.session.user})

        }else{

            res.render('products')

        }


    } catch (error) {
        
        console.log(error.message);

    }
}

//load contact
const loadContacts = async (req,res) => {
    try {
        
        if(req.session.user){

            res.render('contact',{login :req.session.user})

        }else{

            res.render('contact')

        }


    } catch (error) {
        
        console.log(error.message);

    }
}

//load about

const loadAbout = async (req,res) => {
    try {
        
        if(req.session.user){

            res.render('about',{login :req.session.user})

        }else{

            res.render('about')

        }


    } catch (error) {
        
        console.log(error.message);

    }
}

const dataDelete = async() => {

    try {
        const unVerified = await User.find({is_verified:false})

       if(unVerified){

        await User.deleteMany({ is_verified: false, dateJoined: { $lt: new Date(Date.now() - 900000) } })

       }

    } catch (error) {
        
        console.log(error.message);
    }

}

const forgotpassword = 3


module.exports = {
    loadHome,
    loadlogin,
    verifylogin,
    loadsignup,
    insertUser,
    loadotpVerify,
   verifyOTP,
   logoutUser,
   resendOtp,
   loadCategory,
   loadProducts,
   loadContacts,
   loadAbout
}