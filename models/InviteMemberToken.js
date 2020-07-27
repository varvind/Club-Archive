const mongoose = require('mongoose')
const Schema = mongoose.Schema

const inviteTokenSchema = new Schema ({
    clubId: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        required: true, 
        default: Date.now, 
        expires: 2592000 //one month
    }
})

const InviteMemberToken = mongoose.model('InviteMemberToken', inviteTokenSchema)
module.exports = InviteMemberToken
