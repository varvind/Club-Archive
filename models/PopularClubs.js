const mongoose = require('mongoose')
const Schema = mongoose.Schema

const popularSchema = new Schema({
  lastUpdated: {
    type: Date,
    default: new Date()
  },
  topClubs: [{
    club: Object,
    counter: Number,
    rating: Number
  }]
})

const PopularClubsSchema = mongoose.model('PopularClubsSchema', popularSchema)
module.exports = PopularClubsSchema
