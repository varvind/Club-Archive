const mongoose = require('mongoose')

const Schema = mongoose.Schema
const bcrypt = require('bcrypt')


const UserSchema = new Schema ({
    firstName : {
        type: String,
        required: true
    },
    lastName : {
        type :String,
        required: true
    },
    email : {
        type :String,
        required:true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true,
    },
    major :{
        type : String,
        required: true
    },
    gradYear : {
        type :String,
        required: true
    },
    pending_applications:[Object],
    clubs :[Object],
    image : {
        filename: {
            required: true,
            type: String
        },
        id: {
            required: true,
            type: String
        }
    },
    inbox : {
        type: [Object],
        default:[]
    }
})

const User = mongoose.model('User', UserSchema)
module.exports = User