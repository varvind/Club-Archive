const Club = require('../models/Club')
const User = require('../models/User')
const { promiseImpl } = require('ejs')


module.exports = async (req, res) => {
    //TODO Add security to prevent invalid posts

    //TODO add promise functionality


    const club = await Club.findById(req.params.id)
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
        if(req.body.slider == 'on') {
            club.announcements.private.unshift(announcement)
        } else {
            club.announcements.public.unshift(announcement)
        }
        club.save()
        const announcement_user = {subject: req.body.subject, body : req.body.body, date : date, time : time, club : club.name, status: "unread"}    
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