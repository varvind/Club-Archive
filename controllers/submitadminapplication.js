const User = require('../models/User')
const Club = require('../models/Club')


module.exports = async (req, res) => {
    const user = await User.findById(req.params.userId)
    const club = await Club.findById(req.params.clubId)
    var user_application_index = 0;
    var club_application_index = 0;
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
    var today = new Date();
    var date = (today.getMonth() + 1) + '-' + today.getDate()+ "-" + today.getFullYear();
    var time = "";
    if(today.getUTCHours() - 5 > 12) {
            time = (today.getUTCHours() - 12 - 5) + ":" + today.getMinutes() + " pm"
    } else if (today.getUTCHours() - 5 == 12) {
            time = (today.getUTCHours() - 5 ) + ":" + today.getMinutes() + " pm"
    } else if (today.getUTCHours() - 5 == 0) {
            time = (today.getUTCHours() + 12 - 5) + ":" + today.getMinutes() + " am"
    } else {
            time = (today.getUTCHours() - 5) + ":" + today.getMinutes() + " am"
    }
    const appDecision = String(req.body.applicationdecision)
    console.log(appDecision)
    console.log(user.pending_applications[user_application_index])
    if(appDecision == "Accept"){
        admin = {name : club.admin_applications[i].name, id:user._id}
        club.adminstrators.push(admin)
        club.admin_applications.splice(club_application_index,1)
        club.save()

       
        user.pending_applications[user_application_index].status = "Accept"
        var app_notification = {subject: `Application Status: Administrator for ${club.name}`, body : `You have been accepted by ${club.name} to be an administrator! Please be sure to reach out to your club/organization sponsor and confirm next steps! You have also gained access to your clubs settings options, be sure to visit your club's profile to check it out!`, date : date, time : time, club : club.name, status: "unread", type :"application"}
        user.inbox.unshift(app_notification)
        user.markModified('pending_applications')
        if(check_user_clubs(user, club._id)) {
            user.clubs.push(club._id)
        }
        user.save()
    }
    else{
        club.admin_applications.splice(club_application_index,1)
        club.save()


        var app_notification = {subject: `Application Status: Administrator for ${club.name}`, body : `Your application to ${club.name} for administrator has been declined. If you have additional questions please be sure to reach out to that club/organization.`, date : date, time : time, club : club.name, status: "unread", type :"application"}
        user.inbox.unshift(app_notification)
        user.pending_applications[user_application_index].status = "Reject"
        user.markModified('pending_applications')
        user.save()

    }
    setTimeout( () => {
        res.redirect('/clubAdminApplications/'+req.params.clubId)
    }, 2000)


}

function check_user_clubs(user, clubid) {
    user.clubs.forEach(club => {
        if(String(club) == String(clubid)) {
            return false
        }
    })
    return true
}