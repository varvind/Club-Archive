const User = require('../../../../../models/User')
const Club = require('../../../../../models/Club')

module.exports = async (req, res) => {
    const club = await Club.findById(req.params.id)
    const error = null
    if(!club || !club.onlineApplication.allow){
        console.log('Invalid club')
        res.redirect('/')
    }else{
        res.render('club_views/user_applications/member/onlineClubApplication', {club, error, layout:false})
    }
}