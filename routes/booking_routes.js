const express = require('express');
const Booking = require('../models/booking');
const authMiddleware = require('../middleware/auth_middleware');
const userMiddleware = require('../middleware/user_middleware');

const router = express.Router()

router.get('/search-appointment/pending',authMiddleware,userMiddleware, async (req, res)=>{
    try{

        const user_Id = req.userInfo.userId;
        const {first_name, last_name} = req.query;
        // console.log("Debug: ",req)
        // console.log("Debug: ",user_Id)

        if(!first_name || !last_name){
            return res.status(400).json({
                success: false,
                message: 'First name and Last name are required'

            })
        }

        const results = await Booking.find({
            customer_id: user_Id,
            status:'Pending',
            first_name: { $regex: new RegExp(first_name, 'i')},
            last_name: { $regex: new RegExp(last_name, 'i')}
        })

        res.json({success: true, data: results})
    } catch(err){
        console.error('Error searching appointment: ',err)
        res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
})
router.get('/search-appointment/scheduled',authMiddleware,userMiddleware, async (req, res)=>{
    try{

        const user_Id = req.userInfo.userId;
        const {first_name, last_name} = req.query;
        // console.log("Debug: ",req)
        // console.log("Debug: ",user_Id)

        if(!first_name || !last_name){
            return res.status(400).json({
                success: false,
                message: 'First name and Last name are required'

            })
        }

        const results = await Booking.find({
            customer_id: user_Id,
            status:'Booked',
            first_name: { $regex: new RegExp(first_name, 'i')},
            last_name: { $regex: new RegExp(last_name, 'i')}
        })

        res.json({success: true, data: results})
    } catch(err){
        console.error('Error searching appointment: ',err)
        res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
})

router.put('/cancel-appointment/:id',authMiddleware,userMiddleware, async (req, res)=>{
    try{
        const appointmentId = req.params.id;

        const booking = await Booking.findById(appointmentId)

        if(!booking){
            return res.status(404).json({
                success: false,
                message: "Appointment not found."
            })
        }

        if(booking.status ==='Cancelled' || booking.status === 'Done'){
            return res.status(404).json({
                success: false,
                message: "Appointment can not be cancelled."
            })
        }

        booking.status = 'Cancelled'
        await booking.save()

        res.json({
            success: true,
            message: "Appointment cancelled successfully"
        })
    }catch(err){
        console.error("Error cancelling appointment:",err)
        res.status(500).json({
            success: false,
            message: 'server error'
        })
    }
})


module.exports = router