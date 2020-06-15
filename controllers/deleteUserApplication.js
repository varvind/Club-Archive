const User = require('../models/User')
const Club = require('../models/Club')

module.exports = async (req, res) => {
 
    const user = await User.findById(req.session.userId)
    const club = await Club.findById(req.params.id)
    for(var i = 0; i < user.pending_applications.length; i++) {
        if(String(user.pending_applications[i].clubId) == String(req.params.id)) {
            user.pending_applications.splice(i,1)
            user.save()
            break;
        }
    }
    for(var i = 0; i < club.admin_applications.length;i++ ){
        if(String(req.session.userId) == club.admin_applications[i].userId){
            club.admin_applications.splice(i,1)
            club.save();
            break;
        }
    }
    for(var i = 0; i < club.member_applications.length;i++ ){
        if(String(req.session.userId) == club.member_applications[i].userId){
            club.club_applications.splice(i,1)
            club.save();
            break;
        }
    }


    res.redirect('/userprofile')
}