const User = require('../models/User')
const Club = require('../models/Club')


module.exports = async (req, res) => {
    const user = await User.findById(req.params.userId)
    const club = await Club.findById(req.params.clubId)
    var user_application_index;
    var club_application_index;
    for(var i = 0; i < user.pending_applications.length; i++){
        if(String(user.pending_applications[i].id) == String(req.params.clubId) ){
            user_application_index = i
            break;
        }
    }

    for(var i = 0; i < club.admin_applications.length; i++){
        if(String(club.admin_applications[i].id) == String(req.params.userId) ){
            club_application_index = i
            break;
        }
    }
    const appDecision = String(req.body.applicationdecision)
    if(appDecision == "Accept"){
        admin = {name : club.admin_applications[i].name, id:user._id}
        club.adminstrators.push(admin)
        club.admin_applications.splice(club_application_index,1)
        club.save()

       
        user.pending_applications[user_application_index].status = "Accept"
        user.markModified('pending_applications')
        user.clubs.push(club._id)
        user.save()
    }
    else{
        club.admin_applications.splice(club_application_index,1)
        club.save()

        user.pending_applications[user_application_index].status = "Reject"
        user.markModified('pending_applications')
        user.save()

    }
    setTimeout( () => {
        res.redirect('/clubAdminApplications/'+req.params.clubId)
    }, 2000)


}