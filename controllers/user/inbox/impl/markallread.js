const User = require('../../../../models/User')


module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)

    for(var i = 0; i < user.inbox.length; i++) {
        user.inbox[i].status = "read";
    }
    user.markModified('inbox')
    user.save()
    res.redirect('/notificationsPage')
}