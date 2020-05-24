const User = require('../models/User')
const Club = require('../models/Club')

module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    const club = await Club.findById(req.params.id)

    var duplicate = false

    for(var i = 0; i < club.admin_applications.length; i++){
        if(String(club.admin_applications[i].id) == String(user._id)){
            duplicate = true;
        }
    }
    for(var i = 0; i < club.adminstrators.length; i++){
        if(String(req.session.userId) == club.adminstrators[i] ){
            duplicate = true
        }
    }




    if(!duplicate){
        var currentApplication = {id: club._id, name : club.name, status : "In Review"}
        var club_side_application = {id:user._id, name : user.firstName + " " + user.lastName, major : user.major}
        club.admin_applications.push(club_side_application)
        user.pending_applications.push(currentApplication)
        club.save()
        user.save()
        res.redirect('/post/'+club._id)
    }
    else {
        res.redirect('/')
    }
    
}