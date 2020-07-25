const User = require('../../../../../models/User')
const Club = require('../../../../../models/Club')

module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    const club = await Club.findById(req.params.id)

    res.render('club_views/user_applications/admin/adminregistration', {
        user,
        club,
        layout:'layouts/topMenuBar'
    })
}