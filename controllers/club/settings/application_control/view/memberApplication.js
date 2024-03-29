const User = require('../../../../../models/User')
const Club = require('../../../../../models/Club')

module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    const club = await Club.findById(req.params.id)

    if(!user || !club){
        console.log('Invalid user or club')
        res.redirect('/')
    }else{
        res.render('club_views/settings/application_settings/member/designApplication', {club, user,
            layout:'layouts/topMenuBar'})
    }
}