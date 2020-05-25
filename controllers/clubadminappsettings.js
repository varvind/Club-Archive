const Club = require('../models/Club')
const User = require('../models/User')

module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    const club = await Club.findById(req.params.id)
    var canEdit = false
    if(user != null){
        for(var i = 0; i < user.clubs.length; i++){
            if(String(user.clubs[i]) == String(club._id)){
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
        
        res.render('clubAdminApplicationsSettings' , {
            user,
            club

        })
       
    }else{
        res.redirect('/')
    }

    
}