const User = require('../../../../models/User')

module.exports = async (req, res) =>{
    const user = await User.findById(req.session.userId)
    var error;
    if(loggedIn) {
        res.render('user_views/settings/changePassword',{
            user,
            error,
            layout:'layouts/topMenuBar'
        })
    } else {
        res.redirect('/')
    }
}