const User = require('../../../../../models/User')
const Club = require('../../../../../models/Club')

module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    const club = await Club.findById(req.params.id)

    
    var canEdit = false;
    if(user != null){
        for(var i = 0; i < club.adminstrators.length; i++){
            if(String(req.session.userId) ==String(club.adminstrators[i].id) ){
                canEdit = true
            }
        }
    }

    if(!canEdit){res.redirect('/')} else {
        res.render('club_views/settings/history/club_settings_history', {
            user, 
            club,
            layout: 'layouts/topMenuBar'
        })
    }
}