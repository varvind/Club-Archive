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
    members: {
        type: [Object]
    },
    admin_applications: [Object],
    member_applications: [Object],
    images:[String],
    onlineApplication: {
        allow: {
            type: Boolean,
            default: false
        },
        fullname: {
            type: Boolean,
            default: false
        },
        email: {
            type: Boolean,
            default: false
        },
        rank: {
            type: Boolean,
            default: false
        },
        major: {
            type: Boolean,
            default: false
        },
        resume: {
            type: Boolean,
            default: false
        },
        custom1: {
            type: String,
            default: ""
        },
        custom2: {
            type: String,
            default: ""
        },
        custom3: {
            type: String,
            default: ""
        }
    },
    ratings: {
        members: {
            total: {
                type: Number,
                default: 0
            },
            count: {
                type: Number,
                default: 0
            },
            users: [Object]
        },
        global: {
            total: {
                type: Number,
                default: 0
            },
            count: {
                type: Number,
                default: 0
            },
            users: [Object]
        }
    },
    announcements : {
        private: {
            type: [Object]
        },
        public : {
            type:[Object]
        }
    },
    counter: {
        array: {
            type: [Number],
            default: [0]
        },
        shiftDate: {
            type: Date,
            default: new Date()
        }
    }, 
    settings_history : {
        type: [Object],
        default : []
    }
})

const Club = mongoose.model('Club', clubSchema)
module.exports = Club