const path = require('path')
const User = require('../models/user')
const Admin = require('../models/admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Booking = require('../models/booking')
const Contact = require('../models/contactus')
const serveLoginPage = (req, res)=>{

    res.sendFile(path.join(__dirname, '../views','index.html'))
}

const signupPage = (req, res)=>{

    res.sendFile(path.join(__dirname, '../views','signup.html'))
}

const homePage = (req, res)=>{

    res.sendFile(path.join(__dirname, '../views','User-Home.html'))
}

const verifyPasswordPage = (req, res)=>{

    res.sendFile(path.join(__dirname, '../views','verification.html'))
}

const changePasswordPage = (req, res)=>{

    res.sendFile(path.join(__dirname, '../views','changepassword.html'))
}
const setPasswordPage = (req, res)=>{

    res.sendFile(path.join(__dirname, '../views','setpassword.html'))
}


// this will take token of cookie and then already decoded through middleware and send details to client

const getUserDetails = (req,res)=>{
    // console.log(req.userDetails);
    res.json({
        success: true,
        _id : req.userDetails.userId,
        
    })
    // const {email} = req.userDetails
}

const setPassword = async (req,res)=>{
    // console.log(req.userDetails);
    // console.log(req.body);
    const password = req.body.password
    // console.log("trying");
    
    try {

        const userId=req.userInfo.userId
        console.log('user id is: ',userId);
        
        // let user = await User.findById(userId);
        // if(!user){
        //     user = await Admin.findById(userId);
        // }

        // if(!user){
        //     return res.status(404).json({
        //         success: false,
        //         message: "User not found"
        //     })
        // }

        //check user password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(password,salt)
        // user.password = hashedNewPassword;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                password: hashedNewPassword
            },
            {new : true}
        )

        if (!updatedUser) {
  const updatedAdmin = await Admin.findByIdAndUpdate(
    userId,
    { password: hashedNewPassword },
    { new: true }
  );

  if (!updatedAdmin) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
}


        // await user.save();

        // res.clearCookie('accessToken',{ path: '/'})

        res.status(200).json({
            success: true,
            message: 'changed pass successful',
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message:'Some error occur in pass! Please try again',
        })
    }
    
}
const changePassword = async (req,res)=>{
    // console.log(req.userDetails);
    // console.log(req.body);
    const password = req.body.password
    // console.log("trying");
    
    try {

        const userId=req.userDetails.userId
        
        let user = await User.findById(userId);
        if(!user){
            user = await Admin.findById(userId);
        }

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        //check user password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(password,salt)
        user.password = hashedNewPassword;


        await user.save();

        res.clearCookie('passToken',{ path: '/'})

        res.status(200).json({
            success: true,
            message: 'changed pass successful',
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message:'Some error occur in pass! Please try again',
        })
    }
    
}

const logoutUser = async (req,res)=>{
    res.clearCookie('accessToken',{ path: '/'})
    res.json({
        success: true,
        message:"Logged out successfully"
    })
}

const contactHandle = async (req, res)=>{

    try {
        
    
    const userId = req.userInfo.userId

    const {name, email, message} = req.body

    const newContact = new Contact({
        name,
        email,
        message,
        id: userId
    })

    const saved = await newContact.save()

    if(!saved){
        res.status(400).json({
            success: false,
            message: 'Something were wrong please try again'
        })
    }
    res.status(200).json({
        success: true,
        message: 'message sent successfully!'
    })

    } catch (error) {
         console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error, please try again later.'
        });
    }
}

const changeUserProfile = async (req, res)=>{
    console.log(req.body)
    const userId = req.userInfo.userId
    console.log(userId);
    
    try{
        const { email, name } = req.body

        if (email) {
            const emailExistsInUsers = await User.findOne({ email, _id: { $ne: userId } });
            const emailExistsInAdmins = await Admin.findOne({ email, _id: { $ne: userId } });

            if (emailExistsInUsers || emailExistsInAdmins) {
                return res.status(400).json({
                    success: false,
                    message: "Email already exists, please use a different email.",
                });
            }
        }

        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if(email) user.email = email;
        if(name) user.name = name;

        await user.save()
        res.clearCookie('accessToken',{ path: '/'})

        // res.redirect('/')

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                name: user.name,
                email: user.email,
                role: req.userInfo.role
            }
        });

    }catch(error){
         console.log(error);
        res.status(500).json({
            success: false,
            message: "Some error occurred! Please try later.."
        });
    }
}

const isCorrectUser =async (req, res)=>{

    try{

        // console.log(req.body);
        const {email, recovery_key} = req.body;
    
        // const user = await User.findOne({$or:[{email}]})
        let user = await User.findOne({$or:[{email}]})
        if(!user){

            user = await Admin.findOne({$or:[{email}]})
        }
        if(!user){
            return res.status(400).json({
                success: false,
                message: 'User is not exists with email'
            }
            )
        }

        const isKeyMatch = await bcrypt.compare(recovery_key,user.recovery_key)

        if(!isKeyMatch){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials!"
            })
        }
        // console.log("matched.."); 

        const passToken = jwt.sign({
            userId: user._id,
            email: user.email,
            role: user.role
        },process.env.JWT_SECRET_KEY,{
            expiresIn: '5m'
        })

        res.cookie('passToken', passToken,{
            httpOnly: true, // prevents js from accessing the cookie
            secure: false, //set true if using https
            sameSite:'strict' // helps prevent csrf
        })

        res.status(200).json({
            success: true,
            message: 'Logged in successful',
            passToken
        })

        // res.redirect('/home')

    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message:'Some error occur! Please try again',
        })
        
    }
        

}

const getUserDetailsForProfile2 = async (req,res)=>{
    try {
        // console.log(req.userInfo);
        const userId = req.userInfo.userId
    const {name} = await User.findById(userId,'name -_id').lean()
    console.log("dddd",name);
    
    res.json({
        success: true,
        user: {
            name,
            email: req.userInfo.email,
            role: req.userInfo.role
        }
    });
    } catch (error) {
        console.log(error);
    res.status(500).json({
        success: false,
        message:"Some error occur!Please try later.."
    })
    }
    
}
const getUserDetailsForProfile = async (req, res) => {
    try {
        const userId = req.userInfo.userId;

        const user = await User.findById(userId, 'user_name -_id').lean();
        console.log('dd',user.user_name);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user: {
                name: user.user_name,
                email: req.userInfo.email,
                role: req.userInfo.role
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some error occurred! Please try later.."
        });
    }
};

const getAllAdmins = async(req,res)=>{

    try {
        const admins = await Admin.find({},'name email company_name _id')
        res.json({
            success: true, admins
        })
    } catch (error) {
        res.status(500).json({success: false,message:'Server error'})
    }
}

const getAdminDetails = async (req, res) =>{
    try {
        const adminId = req.params.adminId;
        // console.log("admin id..");
        
        // console.log(adminId);
        
        const admin = await Admin.findById(adminId);

        if(!admin){
            return res.status(404).json({
                success: false,
                message: "Company not found"
            })
        }

        res.json({success: true, admin})

    } catch (error) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

const handleBooking = async (req,res)=>{
    try{

    
    // console.log(req.body);
    // console.log(req.userInfo);

    const {adminId, firstName, lastName, email, mno, date, time} = req.body
    
    const admin = await Admin.findById(adminId)


    const newAppointment = new Booking({
        customer_id: req.userInfo.userId,
        company_name: admin.company_name,
        first_name:firstName,
        last_name:lastName,
        email,
        adminId,
        mno,
        time,
        date
    })
    await newAppointment.save()

    if(newAppointment){
        res.status(201).json({
            success: true,
            message: 'Booked successfully'
        })
    }else{
        res.status(400).json({
            success: false,
            message: 'Unable to Book'
        })
    }
}catch(error){
    console.log(error);
    res.status(500).json({
        success: false,
        message:"Some error occur!Please try later.."
    })
    
}
    
}

const fetchAppointments = async (req,res)=>{
     try {
            const customer_id = req.userInfo.userId; // Assuming you set req.user in verifyToken middleware

            // const admin = await Admin.findById(adminId).lean();
            const appointments = await Booking.find({customer_id}).lean()
            // console.log(appointments);
            
            if (!appointments.length) {
                return res.json({ success: false, message: "No appointments found" });
            }
    
            res.json({ success: true, appointments });
        } catch (err) {
            console.error(err);
            res.json({ success: false, message: "Error fetching appointments" });
        }
} 

const searchBusiness = async (req, res) =>{
    // console.log("bussiness...");
    // console.log(req.query.query);
    try {
        const admins = await Admin.find({
            company_name: { $regex: new RegExp(req.query.query, 'i')},// i for case insensitive 
        })
        res.json({
            success: true, admins
        })
    } catch (error) {
        res.status(500).json({success: false,message:'Server error'})
    }
    
}

module.exports = {serveLoginPage, signupPage, homePage, changePasswordPage, verifyPasswordPage , isCorrectUser, getUserDetails, changePassword, setPasswordPage, setPassword, logoutUser
    ,getUserDetailsForProfile, getAllAdmins, getAdminDetails, handleBooking, fetchAppointments, searchBusiness, changeUserProfile, contactHandle
}

// const signupPage = (req, res)=>{
//     res.sendFile(path.join(__dirname, '../views','signup.html'))
// }

// const registerUser = (req, res)=>{
    
//     res.sendFile(path.join(__dirname, '../views','signup.html'))
// }

// module.exports = {serveLoginPage}