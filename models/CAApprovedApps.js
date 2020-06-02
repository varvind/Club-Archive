const mongoose = require('mongoose')

const Schema = mongoose.Schema


const approvedApplicationSchema = new Schema ({
    club: {
        type : Object,
        required:true
    },
    status: {
        type:String,
        default : "In Review"
    },
    createdAt: {
        type:Date,
        required:true,
        default: Date.now,
        expires:43200
    }
})


const CAApprovedApp = mongoose.model('CAApprovedApp', approvedApplicationSchema)
module.exports = CAApprovedApp