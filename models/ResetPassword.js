const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ResetPasswordSchema = new Schema ({
    userId: {
        type: String,
        required: true
    },
    resetPasswordToken: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        required: true, 
        default: Date.now, 
        expires: 86400
    }
})

const ResetPassword = mongoose.model('ResetPassword', ResetPasswordSchema)
module.exports = ResetPassword