const Club = require('../models/Club')
const path = require('path')


module.exports = (req, res) => {
    Club.create(req.body, (error, club) => {
        res.redirect('/')
    })
}