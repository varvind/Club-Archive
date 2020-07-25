const User = require('../../../../models/User')

module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    const notification_index = req.params.notification_index
    user.inbox[notification_index].status = "read"
    user.markModified('inbox')

    user.save()
}