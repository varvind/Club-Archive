const User = require('../models/User')
const Club = require('../models/Club')
module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)

    const clubs = req.session.searches
    console.log(clubs)
    res.render('userProfile', {
        user,
        clubs
    })
}