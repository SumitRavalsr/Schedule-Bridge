const mongoose = require('mongoose')


const ContactSchema = mongoose.Schema({
    id:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    }
},{ timestamps: true })

module.exports = mongoose.model('Contact',ContactSchema)