const express = require ('express')
const user_routers=express()

//requiring user controlles

const user_controller = require('../controllers/usercontroller')
// requiring profile controller

const profile_controller = require ('../controllers/userProfile')

const address_controller = require('../controllers/address_controller')

const checkout_controller = require('../controllers/checkoutController')

const cart_controller = require ('../controllers/cart_controller')

// const 

const user_auth = require ('../middleware/user_auth')

// setting view for user

user_routers.set('view engine','ejs')
user_routers.set('views','./views/user')


//showing home page

user_routers.get('/',user_auth.checkBlockedStatus,user_controller.loadHome)

// showing login

user_routers.get('/login',user_auth.islogin ,user_controller.loadlogin)

//showing forget password

user_routers.get('/forgotpassword',user_controller.loadforgot)

// forget post

user_routers.post('/forgotpassword',user_controller.verifyforgot)

// showing forgot confirm password

user_routers.get('/passwordVerify',user_auth.forgotUser,user_controller.passmatch)

// confirm password post

user_routers.post('/passwordVerify',user_controller.passmatchsave)


// posting input data 

user_routers.post('/login',user_controller.verifylogin)

// showing signuppage

user_routers.get('/signup', user_auth.islogin , user_controller.loadsignup)


// inserting user data

user_routers.post('/signup',user_controller.insertUser)

// showing otp page

user_routers.get('/verify',user_auth.islogin,user_controller.loadotpVerify)

// posting the otp digit for verification

user_routers.post('/verify',user_controller.verifyOTP)

// logout user 

user_routers.post('/logout',user_controller.logoutUser)

// RESEND OTP

user_routers.get('/resend-otp',user_controller.resendOtp)

// Load category

user_routers.get('/category/:id',user_auth.checkBlockedStatus,user_controller.loadCategory)

// load products
user_routers.get('/products',user_auth.checkBlockedStatus,user_controller.loadProducts)

//load contact

user_routers.get('/contact',user_auth.checkBlockedStatus,user_controller.loadContacts)

//load about

user_routers.get('/about',user_auth.checkBlockedStatus,user_controller.loadAbout)

// product details

user_routers.get('/productDetails',user_auth.checkBlockedStatus,user_controller.productView)

// whishlist

user_routers.get('/wishlist',user_auth.islogout,user_auth.checkBlockedStatus,user_controller.wishlist)




//__________ user profile 
user_routers.get('/profile',user_auth.islogout,profile_controller.profileLoad)

// edit user profile 
user_routers.post('/editProfile',profile_controller.editProfile)
// change password
user_routers.post('/editPassword',profile_controller.passCange)




// aadd address show 
user_routers.get('/Address',address_controller.loadAddress)
// add post 
user_routers.post('/addAddress',address_controller.addAddress)
// delete address 
user_routers.post('/deleteAddress',address_controller.deleteAddress)


// load checkout
user_routers.get('/checkout',checkout_controller.loadcheckout)
// add address
user_routers.post('/checkoutAdd',checkout_controller.addAddresscheckout)

// cart load
user_routers.get('/cart',user_auth.islogout,user_auth.checkBlockedStatus,cart_controller.cart)

// add cart
user_routers.post('/addcart/:id',cart_controller.addCart)

// user_router
module.exports=user_routers














