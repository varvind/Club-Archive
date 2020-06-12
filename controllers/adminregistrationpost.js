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
        if(String(req.session.userId) == String(club.adminstrators[i].id) ){
            duplicate = true
        }
    }




    if(!duplicate){
        var currentApplication = {clubId: club._id,  name: club.name, type: "admin", status: "Pending"}
        user.pending_applications.push(currentApplication)
        user.save()

        var club_side_application = {id:user._id, name : user.firstName + " " + user.lastName, major : user.major}
        club.admin_applications.push(club_side_application)
        club.save()
        
        res.redirect('/post/'+club._id)
    }
    else {
        console.log("Already applied for admin position")
        res.redirect('/')
    }
    
}