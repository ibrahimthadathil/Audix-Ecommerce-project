const express = require ('express')
const user_routers=express()

//requiring user controlles

const user_controller = require('../controllers/usercontroller')

// setting view for user

user_routers.set('view engine','ejs')
user_routers.set('views','./views/user')

// require  OTP model

const User_otp = require ('../models/OTPmodel')

//showing home page

user_routers.get('/',user_controller.loadHome)

// showing login

user_routers.get('/login',user_controller.loadlogin)

// posting input data 

user_routers.post('/login',user_controller.verifylogin)

// showing signuppage

user_routers.get('/signup',user_controller.loadsignup)


// inserting user data

user_routers.post('/signup',user_controller.insertUser)

// showing otp page

user_routers.get('/verify',user_controller.loadotpVerify)

// posting the otp digit for verification

user_routers.post('/verify',user_controller.verifyOTP)

// logout user 

user_routers.post('/logout',user_controller.logoutUser)

// RESEND OTP

user_routers.get('/resend-otp',user_controller.resendOtp)

// Load category

user_routers.get('/category',user_controller.loadCategory)

// load products
user_routers.get('/products',user_controller.loadProducts)

//load contact

user_routers.get('/contact',user_controller.loadContacts)

//load about

user_routers.get('/About',user_controller.loadAbout)

module.exports=user_routers














