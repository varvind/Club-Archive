const mongoose = require('mongoose')

const Scheme = mongoose.Schema
const bcrypt = require('bcrypt')


const clubSchema = new Scheme ({
    name : {
        type : String,
        required :true
    },
    memberCount : {
        type : String,
        required: true
    },
    president_orginizer: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    phonenumber : {
        type: String,
        required:true
    },
    username : {
        type:String,
        required:true
    },
    password : {
        type: String,
        required: true
    },
    category : {
        type: String,
        required: true
    },
    image:String


})
clubSchema.pre('save', function(next) {
    const club = this
    bcrypt.hash(club.password, 10, (error, hash) =>{
        club.password = hash
        next()
    })
})

const Club = mongoose.model('Club', clubSchema)
module.exports = Club