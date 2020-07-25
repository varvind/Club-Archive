const User = require('../../../../../models/User')
const Club = require('../../../../../models/Club')


module.exports = async (req, res) => {
    const club = await Club.findById(req.params.id)
    const user = await User.findById(req.session.userId)
    var canDelete = false;
    if(user != null){
        for(var i = 0; i < user.clubs.length; i++){
            if(String(user.clubs[i]) == String(club._id)){
                canDelete = true
                break;
            }
        }
        for(var i = 0; i < club.adminstrators.length; i++){
            if(String(req.session.userId) == String(club.adminstrators[i].id) ){
                canDelete = true
                break;
            }
        }
    }
    
    if(canDelete){
        res.render('club_views/settings/profile_settings/confirmClubDelete', {
            user,
            club,
            layout:'layouts/topMenuBar'
        })
    }else{
        res.redirect('/')
    }
    
}