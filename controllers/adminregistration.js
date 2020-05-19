const User = require('../models/User')
const Club = require('../models/Club')

module.exports = (req, res) => {
    const user = User.findById(req.session.userId)
    const club = Club.findById(req.params.id)

    res.render('/adminregistration', {
        user,
        club
    })
}