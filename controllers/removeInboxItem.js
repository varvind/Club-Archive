const User = require('../models/User')



module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    const inbox_index = req.params.inbox_index
    user.inbox.splice(inbox_index, 1);
    user.save()

    res.redirect('/notificationsPage')
}