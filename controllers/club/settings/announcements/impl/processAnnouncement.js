const Club = require('../../../../../models/Club')
const User = require('../../../../../models/User')
const { promiseImpl } = require('ejs')


module.exports = async (req, res) => {
    //TODO Add security to prevent invalid posts

    //TODO add promise functionality


    const club = await Club.findById(req.params.id)
    const user = await User.findById(req.session.userId)
    //const annoucnementAction = new Promise(async () => {
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
        
        const announcement = {subject: req.body.subject, body : req.body.body, date : date, time : time}
        // adding announcement to club
        var announcement_type = ""
        if(req.body.slider == 'on') {
            club.announcements.private.unshift(announcement)
            announcement_type = "Private"
        } else {
            club.announcements.public.unshift(announcement)
            announcement_type = "Public"
        }
        const settings_message = {User: user.firstName + " " + user.lastName, Type: `Sent ${announcement_type} Announcement`, Date: date, Time: time}
        club.settings_history.unshift(settings_message)
        club.save()
        const announcement_user = {subject: req.body.subject, body : req.body.body, date : date, time : time, club : club.name, status: "unread", type :"announcement"}
        // sending push notification to users
        for(var i = 0; i < club.members.length; i++){
            let user = await User.findById(club.members[i].id)
            user.inbox.unshift(announcement_user)
            user.markModified('inbox')
            user.save()
        }
    // })
    // annoucnementAction.then(() => {
         res.redirect(`/clubannouncements/${club._id}`);
    // })
}