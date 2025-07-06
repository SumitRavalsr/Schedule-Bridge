const mongoose = require('mongoose')



const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    recovery_key: { type: String, required: true },
    company_name: { type: String, required: true, unique: true },
    sector: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pin_code: { type: String, required: true },
    mno: { type: String, required: true, unique: true },
    total_work_hours: { type: Number, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    total_slots: { type: Number, required: true },
    website: { type: String },
    service: { type: String, required: true },
    role: {
        type: String,
        enum: ["user", "admin"], // only allow 'user' or 'admin' roles
        default: "admin",
    },
},
    { timestamps: true }
); 

module.exports = mongoose.model("Admin", AdminSchema) 