const mongoose = require('mongoose')
const Schema = mongoose.Schema

const popularSchema = new Schema ({
    topClubs: [{
        club: Object,
        counter: Number,
        lastUpdated: Date
    }]
})

const PopularClubsSchema = mongoose.model('PopularClubsSchema', popularSchema)
module.exports = PopularClubsSchema 