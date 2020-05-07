const User = require('../models/User')
const Club = require('../models/Club')

module.exports = async (req, res) =>{
    const club = await Club.findById(req.params.id)
    const user = await User.findById(req.session.userId)
    var canEdit = false;
    if(user != null){
        for(var i = 0; i < user.clubs.length; i++){
            if(user.clubs[i].name == club.name){
                canEdit = true
            }
        }
    }
    if(canEdit){
        res.render('clubSettings', {
            user,
            club
        })
    }else{
        res.redirect('/')
    }
    
}