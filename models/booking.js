const mongoose = require('mongoose')

const BookingSchema = new mongoose.Schema({
    customer_id: { type: String, required: true },
    company_name: {
        type: String,
        required: true
    },
    // address: {
    //     type: String,
    //     required: true
    // },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    adminId: { type: String, required: true },
    mno: { type: Number, required: true },
    time: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Booked', 'Rejected', 'Cancelled', 'Done'], default: 'Pending' }
})

module.exports = mongoose.model("Booking",BookingSchema)
