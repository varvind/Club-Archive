const Club = require('../../../../../models/Club')
const User = require('../../../../../models/User')

module.exports = async (req, res) => {
    const club = await Club.findById(req.params.id)
    const user = await User.findById(req.session.userId)
    var canEdit = false;
    if(user != null){
        for(var i = 0; i < user.clubs.length; i++){
            if(String(user.clubs[i]) == String(club._id)){
                canEdit = true
                break;
            }
        }
        for(var i = 0; i < club.adminstrators.length; i++){
            if(String(req.session.userId) == String(club.adminstrators[i].id) ){
                canEdit = true
                break;
            }
        }
    }
    if(canEdit) {
        res.render('club_views/settings/announcements/clubannouncements',  {
            user, 
            club,
            layout:'layouts/topMenuBar'
        })
    } else {
        res.redirect('/')
    }
}