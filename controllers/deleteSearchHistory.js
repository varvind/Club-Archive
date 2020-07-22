const userprofile = require("./userprofile")
const User = require('../models/User')
module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    user.popular_tags = []
    user.recent_search = []
    user.save()
    res.redirect('/userprofile')
}