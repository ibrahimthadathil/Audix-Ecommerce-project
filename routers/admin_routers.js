const express = require ('express')

const admin_routers = express ()

// setting admin view 
admin_routers.set('view engine','ejs')
admin_routers.set('views','./views/Admin')



// requiring admin controll 

const admin_controll = require('../controllers/admincontroller')

// showing the login page 

admin_routers.get('/',admin_controll.loadLogin)

// post body request

admin_routers.post('/',admin_controll.verifyAdmin)

// load dashboard

admin_routers.get('/dashboard',admin_controll.loadDashboard)




// admin logout 

admin_routers.post('/logout',admin_controll.adminLogout)







module.exports =  admin_routers