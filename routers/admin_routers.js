const express = require ('express')
const path = require('path')
const admin_routers = express ()

// setting admin view 
admin_routers.set('view engine','ejs')
admin_routers.set('views','./views/Admin')


// middlewear

const admin_auth = require ('../middleware/admin_auth')


//__________________ requiring admin controll 

const admin_controll = require('../controllers/admincontroller')

//_________________________ requiring category

const category_controll = require('../controllers/categorycontroller')

// _______________________requiring product

const product_controll = require ('../controllers/product_controller')


// showing the login page 

admin_routers.get('/',admin_auth.islogout,admin_controll.loadLogin)

// post body request

admin_routers.post('/',admin_controll.verifyAdmin)

// load dashboard

admin_routers.get('/dashboard',admin_auth.islogin,admin_controll.loadDashboard)

// load users
admin_routers.get('/users',admin_auth.islogin,admin_controll.loadUsers)

admin_routers.get('/users/:id',admin_controll.userAction)

// load orders 
admin_routers.get('/orders',admin_auth.islogin,admin_controll.loadOrders)


// load category

admin_routers.get('/category',admin_auth.islogin,admin_controll.adminCategory)

// admin logout 

admin_routers.post('/logout',admin_auth.islogin,admin_controll.adminLogout)




//__________________ category routes


admin_routers.post('/category',category_controll.addCategory)

// edit category

admin_routers.put('/category',category_controll.editCategory)

// category action

admin_routers.put('/categoryaction',category_controll.cateAction)

// _________________add brand

admin_routers.post('/addBrands',category_controll.addBrand)



//____________________ add products 

const multer=require('multer');
const storage = multer.diskStorage({

    destination: (req, file, cb) => {

    cb(null, path.join(__dirname, '../public/product_Images'));
     },

      filename: (req, file, cb) => {

    const name = Date.now() + ' - ' + file.originalname;

    cb(null, name);

     },

    });

const upload = multer({

  storage: storage,
  fileFilter: (req, file, cb) => {

    cb(null, true);

  },

});

  

// load products

admin_routers.get('/products',admin_auth.islogin,product_controll.loadProducts)

// add products (Get)

admin_routers.get('/productsAdd',admin_auth.islogin,product_controll.loadAddproduct)

// add products (post)

admin_routers.post('/productsAdd',upload.array('images', 3),product_controll.addProducts)

// edit product 
admin_routers.get('/editProduct',admin_auth.islogin,product_controll.loadeditProduct)

//product list 

admin_routers.put('/productStatus',product_controll.productStatus)

// product Edit

admin_routers.post('/productedit/:id',upload.fields([{ name: 'image0', maxCount: 1 },{ name: 'image1', maxCount: 1 },{ name: 'image2', maxCount: 1 }]),product_controll.editProduct)













module.exports =  admin_routers