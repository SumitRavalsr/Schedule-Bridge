const path = require('path');
const Admin = require('../models/admin');
const Booking = require('../models/booking')

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

module.exports = {serveLoginPage,fetchAdmin, fetchAppointments, updateAppointment}