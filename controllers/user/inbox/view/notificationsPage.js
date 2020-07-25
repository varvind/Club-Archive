const User = require('../../../../models/User')

module.exports = async(req, res) => {
    if(!loggedIn) {
        res.redirect('/')
    }
    else {
        user = await User.findById(req.session.userId)
        res.render('user_views/profile/notificationspage', {
            user,
            layout: 'layouts/topMenuBar'
        })
    }
}