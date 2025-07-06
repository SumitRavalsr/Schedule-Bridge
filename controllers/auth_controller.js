const User = require('../models/user')
const Admin = require('../models/admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// register controller
const registerUser= async(req,res)=>{
    try {
        // extract user information from our request body
        const { name, email, password, recovery_key} = req.body;

        const checkExistingUser = await User.findOne({$or:[{email}]})
        if(checkExistingUser){
            return res.status(400).json({
                success: false,
                message: 'User is already exists with same email'
            }
            )
        }
        //check user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt)
        const hashedRecoveryKey = await bcrypt.hash(recovery_key,salt)

        //now create a new user and save in database
        const newlyCreatedUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'user',
            recovery_key: hashedRecoveryKey
        }) 

        await newlyCreatedUser.save()

        if(newlyCreatedUser){
            res.status(201).json({
                success: true,
                message: 'User registered successfully'
            })
        }else {
            res.status(400).json({
                success: false,
                message: 'Unable to register user'
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message:'Some error occur! Please try again 1st',
        })
    }   
}

const registerAdmin= async(req,res)=>{
    try {
        
        const { 
            name, 
            password, 
            recovery_key, 
            company_name, 
            sector, 
            address, 
            email, 
            state, 
            country, 
            pin_code, 
            mno, 
            total_work_hours, 
            start_time, 
            end_time, 
            total_slots, 
            website, 
            service, 
             
        } = req.body;

        
        


        const checkExistingUser = await Admin.findOne({$or:[{email}]})
        if(checkExistingUser){
            return res.status(400).json({
                success: false,
                message: 'User is already exists with same email'
            }
            )
        }
        //check user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt)


        //check user password
    
        const hashedRecoveryKey = await bcrypt.hash(recovery_key,salt)
        //now create a new user and save in database
        // extract admin information from our request body
        const newAdmin = new Admin({
            name,
            password: hashedPassword, // Don't forget to hash
            recovery_key: hashedRecoveryKey,
            company_name,
            sector,
            address,
            email,
            state,
            country,
            pin_code,
            mno,
            total_work_hours,
            start_time,
            end_time,
            total_slots,
            website,
            service,
            role: 'admin'
            
        });

        await newAdmin.save()

        if(newAdmin){
            res.status(201).json({
                success: true,
                message: 'Admin registered successfully'
            })
        }else {
            res.status(400).json({
                success: false,
                message: 'Unable to register admin'
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message:'Some error occur! Please try again',
        })
    }   
}


// login controller
const loginUser= async(req,res)=>{
    try {
        // console.log(req.body)
        const {email, password} = req.body;
        // find if the current user is exists in db or not

        let user = await User.findOne({email});
        if(!user){
            user = await Admin.findOne({email}) 
        }
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User doesn't exists!"
            })
        }
        
        
        const isPasswordMatch = await bcrypt.compare(password,user.password) 
       

    

        if(!isPasswordMatch){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials!"
            })
        }

        // bearer

        // create a jwt JSON Web token
        const accessToken = jwt.sign({
            userId: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },process.env.JWT_SECRET_KEY,{
            expiresIn: '25m'
        })

        res.cookie('accessToken', accessToken,{
            httpOnly: true, // prevents js from accessing the cookie
            secure: false, //set true if using https
            sameSite:'strict' // helps prevent csrf
        })

        res.status(200).json({
            success: true,
            message: 'Logged in successful',
            accessToken,
            role: user.role
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message:'Some error occur! Please try again',
        })
    }   
}

module.exports = {registerUser, registerAdmin, loginUser}