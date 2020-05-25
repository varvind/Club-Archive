const mongoose = require('mongoose')

const Scheme = mongoose.Schema
const bcrypt = require('bcrypt')


const clubSchema = new Scheme ({
    name : {
        type : String,
        required :true,
        unique:true
    },
    memberCount : {
        type : String,
        required: true
    },
    president_organizer: {
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
    description : {
        type :String,
        required: true
    },
    category : {
        type: String,
        required: true
    },
    meeting_times : {
        type: String,
        default: 'Monday : 12AM - 12PM \nTuesday : 12AM - 12PM \nWednesday : 12AM - 12PM \nThursday : 12AM - 12PM \nFriday : 12AM - 12PM'
    },
    club_archive_approved: {
        type: Boolean,
        default: false  
    },
    applications_open: {
        type:Boolean,
        default: false
    },
    registration_season: {
        type:String,
        default :"Fall"
    },
    tags : {
        type : [String]
    },
    adminstrators: {
        type : [Object]
    },
    admin_applications: {
        type: [Object]
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