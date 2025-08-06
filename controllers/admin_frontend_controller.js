const path = require('path');
const Admin = require('../models/admin');
const Booking = require('../models/booking');
const user = require('../models/user');

const serveLoginPage = (req, res)=>{

    res.sendFile(path.join(__dirname, '../views','admin_login.html'))
}

const fetchAdmin = async (req,res)=>{
    // const admin_id = req.adminInfo._id;
    // console.log("ddd");
    
    // console.log('dddd',req.userInfo);
   try {
        const adminId = req.userInfo.userId; // Assuming you set req.user in verifyToken middleware
        const admin = await Admin.findById(adminId).lean();

        if (!admin) {
            return res.json({ success: false, message: "Admin not found" });
        }

        res.json({ success: true, admin });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "Error fetching profile" });
    }
    
}

const fetchAppointments = async(req,res)=>{
    try {
        const adminId = req.userInfo.userId; // Assuming you set req.user in verifyToken middleware
        const admin = await Admin.findById(adminId).lean();
        const appointments = await Booking.find({adminId}).lean()
        // console.log(admin);
        
        if (!appointments.length) {
            return res.json({ success: false, message: "No appointments found" });
        }

        res.json({ success: true, appointments });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "Error fetching appointments" });
    }
}

const updateDetails = async (req, res) => {
    try {
        const adminId = req.userInfo.userId;

        const admin = await Admin.findById(adminId);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }
        const em= req.body.email
        if(admin.email === req.body.email || !Admin.findOne({$or:[{em}]}) && !user.findOne({$or:[{em}]})) {
            admin.name = req.body.name;
            admin.email = req.body.email;
            admin.company_name = req.body.company_name;
            admin.sector = req.body.sector;
            admin.address = req.body.address;
            admin.state = req.body.state;
            admin.country = req.body.country;
            admin.pin_code = req.body.pin_code;
            admin.mno = req.body.mno;
            admin.total_work_hours = req.body.total_work_hours;
            admin.start_time = req.body.start_time;
            admin.end_time = req.body.end_time;
            admin.total_slots = req.body.total_slots;
            admin.website = req.body.website;
            admin.service = req.body.services;
    
            await admin.save();
    
            res.json({
                success: true,
                message: "Admin details updated successfully"
            });

        }else{
            res.status(400).json({
            success: false,
            message: "Email already exists"
        });

        }

    } catch (error) {
        console.error('Error updating admin details:', error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const updateAppointment = async (req,res)=>{

    // console.log(req.body);
    
    const appointment = await Booking.findById(req.body._id)

    if(!appointment){
        return res.status(404).json({
            success: false,
            message: "Appointment not found"
        })
    }

    appointment.status = req.body.status;
    await appointment.save()

   
    // console.log(appointment);
    
    res.json({
        "success": true,
        "message":"work done"
    })
}

module.exports = {serveLoginPage,fetchAdmin, fetchAppointments, updateAppointment, updateDetails}