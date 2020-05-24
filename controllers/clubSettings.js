const User = require('../models/User')
const Club = require('../models/Club')

module.exports = async (req, res) =>{
    const club = await Club.findById(req.params.id)
    const user = await User.findById(req.session.userId)
    var canEdit = false;
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
        res.render('clubSettings', {
            user,
            club
        })
    }else{
        res.redirect('/')
    }
    
}