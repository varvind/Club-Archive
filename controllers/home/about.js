const User = require('../../models/User')


module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    res.render('home_views/about', {
        user,
        layout:'layouts/topMenuBar'
    })
}