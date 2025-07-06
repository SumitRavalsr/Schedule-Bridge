const express = require('express')
const router = express.Router()
const authMiddleware = require("../middleware/auth_middleware")
const userMiddleware = require('../middleware/user_middleware')
const userController = require('../controllers/user_frontend_controller');
const authController = require('../controllers/auth_controller');
const forgotPassMiddleware = require('../middleware/forgot_middleware');
const path = require('path')
const Admin = require('../models/admin')



// // router.get('/welcome',handler1, handler2 (req,res)=>{
// router.get('/welcome',authMiddleware,userMiddleware,(req,res)=>{
//     const {email, userId, role} = req.userInfo // it comes from authMiddleware 
//     res.json({
//         message: "Welcome to the home page",
//         user:{
//             _id: userId,
//             email,
//             role
//         }
//     })
// })

// other user routes

// Public Access Routes (No middleware needed)




router.get('/user-signup', userController.signupPage);
router.get('/forgot-password',forgotPassMiddleware, userController.changePasswordPage);

router.post('/verifyUser',userController.isCorrectUser);
router.get('/verify-user',userController.verifyPasswordPage);

// now change password
router.get('/get-userid',forgotPassMiddleware,userController.getUserDetails)
router.get('/user-home',authMiddleware,userMiddleware,userController.homePage);

router.post('/change-password',forgotPassMiddleware,userController.changePassword)
router.post('/logout',authMiddleware,userController.logoutUser)//don't use user because admin can also use it
router.get('/user/details',authMiddleware,userMiddleware,userController.getUserDetailsForProfile)


// other routes

router.get('/user/about-us',authMiddleware,userMiddleware,(req,res)=>{
    res.sendFile(path.join(__dirname, '../views','About-us.html'))
    // res.json({
    //     message: "Welcome to the admin page"
    // })
})

router.get('/user/contact-us',authMiddleware,userMiddleware,(req,res)=>{
    res.sendFile(path.join(__dirname, '../views','Contact-us.html'))
    // res.json({
    //     message: "Welcome to the admin page"
    // })
})

router.get('/user/developers',authMiddleware,userMiddleware,(req,res)=>{
    res.sendFile(path.join(__dirname, '../views','Team-members.html'))
    // res.json({
    //     message: "Welcome to the admin page"
    // })
})

router.get('/user/book-appointment',authMiddleware,userMiddleware,(req,res)=>{
    res.sendFile(path.join(__dirname, '../views','Book_appointment.html'))
    // res.json({
    //     message: "Welcome to the admin page"
    // })
})
router.get('/user/view-booked-appointments',authMiddleware,userMiddleware,(req,res)=>{
    res.sendFile(path.join(__dirname, '../views','View_appointment.html'))
    // res.json({
    //     message: "Welcome to the admin page"
    // })
})

router.get('/user/profile',authMiddleware,userMiddleware,(req,res)=>{
    res.sendFile(path.join(__dirname, '../views','user_profile.html'))
    // res.json({
    //     message: "Welcome to the admin page"
    // })
})

router.get('/user/fetchAdmins',authMiddleware,userMiddleware,userController.getAllAdmins)

router.get('/user/fetchAdmin/:adminId',authMiddleware,userMiddleware,userController.getAdminDetails)

// router.get('/user/fetchAdminPage/:adminId',authMiddleware,userMiddleware,(req,res)=>{
router.get('/user/company/:adminId',authMiddleware,userMiddleware,(req,res)=>{
    // console.log("happy");
    
    console.log(req.userInfo);
    res.sendFile(path.join(__dirname, '../views', 'company_details.html'))
    
})

router.post('/user/book',authMiddleware, userMiddleware, userController.handleBooking)

router.get('/user/fetch-appointments',authMiddleware,userMiddleware,userController.fetchAppointments)


router.get('/search-business',authMiddleware,userMiddleware,userController.searchBusiness)




// router.post('/user-signup', userController.registerUser);

// router.get('/login', userController.loginPage);
// router.post('/login', userController.loginUser);

// router.get('/forgot-password', userController.forgotPasswordPage);
// router.post('/forgot-password', userController.sendResetLink);

// router.get('/verify', userController.verificationPage);
// router.post('/verify', userController.verifyAccount);

// Protected Routes (Require authentication)
// router.get('/welcome', authMiddleware, userMiddleware, userController.welcomeUser);

// router.post('/change-password', authMiddleware, userController.changePassword);

// router.get('/profile', authMiddleware, userMiddleware, userController.userProfile);
// router.get('/profile/view', authMiddleware, userController.viewProfile);

// router.post('/profile/change-password', authMiddleware, userController.updatePassword);
// router.post('/profile/update', authMiddleware, userController.updateProfile);

// Static Pages (Optional auth protection if needed)
// You might keep these public or restrict depending on your app design:

// router.get('/', userController.homePage);                   // Likely public
// router.get('/about', userController.aboutPage);             // Public
// router.get('/contact', userController.contactPage);         // Public
// router.get('/members', authMiddleware, userMiddleware, userController.membersPage); // Private members directory

// // Appointment Routes (Should be protected)
// router.get('/appointments/book', authMiddleware, userMiddleware, userController.bookAppointmentPage);
// router.get('/appointments/view', authMiddleware, userMiddleware, userController.viewAppointmentsPage);

module.exports = router