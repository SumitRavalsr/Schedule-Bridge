const express = require('express')
const authMiddleware = require('../middleware/auth_middleware')
const adminMiddleware = require('../middleware/admin_middleware')
const adminController = require('../controllers/admin_frontend_controller')
const router = express.Router()
const path = require('path')


// router.get('/welcome',authMiddleware,adminMiddleware,(req,res)=>{
//     res.json({
//         message: "Welcome to the admin page"
//     })
// })

router.get('/admin-signup',(req,res)=>{
    res.sendFile(path.join(__dirname, '../views','admin_signup.html'))
    // res.json({
    //     message: "Welcome to the admin page"
    // })
})

router.get('/admin-home',authMiddleware,adminMiddleware,(req,res)=>{
    res.sendFile(path.join(__dirname, '../views','admin.html'))
    // res.json({
    //     message: "Welcome to the admin page"
    // })
})

router.get('/admin/about-us',authMiddleware,adminMiddleware,(req,res)=>{
    res.sendFile(path.join(__dirname, '../views','Admin-About-us.html'))
    // res.json({
    //     message: "Welcome to the admin page"
    // })
})

router.get('/admin/contact-us',authMiddleware,adminMiddleware,(req,res)=>{
    res.sendFile(path.join(__dirname, '../views','Admin-Contact-us.html'))
    // res.json({
    //     message: "Welcome to the admin page"
    // })
})

router.get('/admin/developers',authMiddleware,adminMiddleware,(req,res)=>{
    res.sendFile(path.join(__dirname, '../views','Admin-Team-members.html'))
    // res.json({
    //     message: "Welcome to the admin page"
    // })
})

router.get('/admin/profile',authMiddleware,adminMiddleware,(req,res)=>{
    res.sendFile(path.join(__dirname, '../views','Admin_profile.html'))
    // res.json({
    //     message: "Welcome to the admin page"
    // })
})

router.get('/admin/profile-update',authMiddleware,adminMiddleware,(req,res)=>{
    res.sendFile(path.join(__dirname, '../views','Admin-update.html'))
    // res.json({
    //     message: "Welcome to the admin page"
    // })
})

router.get('/admin/profile/details',authMiddleware,adminMiddleware,adminController.fetchAdmin)

router.get('/admin/appointments',authMiddleware,adminMiddleware,adminController.fetchAppointments)

router.post('/admin/update-appointment',authMiddleware,adminMiddleware,adminController.updateAppointment)

router.post('/admin/update-details',authMiddleware,adminMiddleware,adminController.updateDetails)


module.exports = router