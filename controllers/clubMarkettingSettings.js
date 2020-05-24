const User = require('../models/User')
const Club = require('../models/Club')


module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId);
    const club = await Club.findById(req.params.id)


    if(user != null){
        for(var i = 0; i < user.clubs.length; i++){
            if(String(user.clubs[i]._id) == String(club._id)){
                canEdit = true
            }
        }
        for(var i = 0; i < club.adminstrators.length; i++){
            if(String(req.session.userId) == club.adminstrators[i] ){
                canEdit = true
            }
        }
    }
    
    if(canEdit){
        res.render('clubMarkettingSettings', {
            user,
            club
        })
    }else{
        res.redirect('/')
    }
}