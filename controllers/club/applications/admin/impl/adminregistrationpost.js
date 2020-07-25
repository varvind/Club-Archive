const User = require('../../../../../models/User')
const Club = require('../../../../../models/Club')

module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    const club = await Club.findById(req.params.id)

    var duplicate = false
    for(var i=0; i < club.admin_applications.length; i++){
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
        var currentApplication = {clubId: club._id,  name: club.name, type: "admin", status: "Pending"}
        var app_notification = {subject: `Application Submission for ${club.name}`, body : `Application successfully submitted to ${club.name}. Check your inbox to get updates on your status`, date : date, time : time, club : club.name, status: "unread", type :"application"}
        user.inbox.unshift(app_notification)
        user.pending_applications.push(currentApplication)
        user.save()

        var club_side_application = {id: user._id, name: user.firstName+" "+user.lastName, major: user.major}
        club.admin_applications.push(club_side_application)
        club.save()
        
        res.redirect('/post/'+club._id)
    }
    else {
        console.log("Already applied for admin position")
        res.redirect('/')
    }
    
}