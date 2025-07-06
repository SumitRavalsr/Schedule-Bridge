const express = require('express')
const router = express.Router()
const authMiddleware = require("../middleware/auth_middleware")
const userMiddleware = require('../middleware/user_middleware')
// const userController = require('../controllers/user_frontend_controller');
const authController = require('../controllers/auth_controller');

// router.get('/welcome',handler1, handler2 (req,res)=>{
router.get('/welcome',authMiddleware,userMiddleware,(req,res)=>{
    const {email, userId, role} = req.userInfo // it comes from authMiddleware 
    res.json({
        message: "Welcome to the home page",
        user:{
            _id: userId,
            email,
            role
        }
    })
})

// other user routes

// Public Access Routes (No middleware needed)
// router.get('/user-signup', userController.signupPage);
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