const cron = require('node-cron')
const Booking = require('../models/booking')


const updateRegular = cron.schedule('*/5 * * * *',async ()=>{
    console.log("scheduled..");
    
    try{
        const now = new Date();

        const bookings = await Booking.find({
            status: 'Booked'
        })

        const bookings_pending = await Booking.find({
            status: 'Pending'
        })

        
        for(const booking of bookings){
            const appointmentDateTime = new Date(booking.date)

            const [hours, minutes] = booking.time.split(':').map(Number)
            appointmentDateTime.setHours(hours, minutes, 0, 0)

            if(appointmentDateTime <= now){
                booking.status = 'Done'
                await booking.save()
            }
        }

        for(const booking of bookings_pending){
                // console.log(`Checking Pending appointment: ${booking._id}, Date: ${booking.date}, Time: ${booking.time}`);

            const appointmentDateTime = new Date(booking.date)

            const [hours, minutes] = booking.time.split(':').map(Number)
            appointmentDateTime.setHours(hours, minutes, 0, 0)

            if(appointmentDateTime <= now){
                booking.status = 'Cancelled'
                await booking.save()
            }
        }


    }catch(err){
        console.error("Error updating bookings: ",err)
    }

    
})

module.exports = updateRegular