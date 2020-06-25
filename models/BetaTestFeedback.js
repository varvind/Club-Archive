const mongoose = require('mongoose')

const Schema = mongoose.Schema

const BetaSchema = new Schema ({
    feedback: {
        type: String,
        required:true
    }, 
    type : {
        type: String, 
        required :true
    },
    subject : {
        type: String,
        required: true
    },
    image : {
        type: [String],
        required : false
    },
    status: {
        type: String
    }

})

const BetaTestFeedback = mongoose.model('BetaTestFeedback', BetaSchema)
module.exports = BetaTestFeedback