const Club = require('../models/Club')
const User = require('../models/User')

module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    const club = await Club.findById(req.params.id)
    
    if(user != null){
        for(var i = 0; i < user.clubs.length; i++){
            if(String(user.clubs[i]._id) == String(club._id)){
                canEdit = true
            }
        }
    }
    
    if(canEdit){
        res.render('clubAdminApplicationsSettings' , {
            user,
            club
        })
    }else{
        res.redirect('/')
    }

    
}