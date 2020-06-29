const Club = require('../models/Club')
const User = require('../models/User')
const { promiseImpl } = require('ejs')


module.exports = async (req, res) => {
    const club = await Club.findById(req.params.id)
    //const annoucnementAction = new Promise(async () => {
        const announcement = {subject: req.body.subject, body : req.body.body}

        // adding announcement to club
        if(req.body.slider == 'on') {
            club.announcements.private.push(announcement)
        } else {
            club.announcements.public.push(announcement)
        }
        club.save()


        // sending push notification to users
        for(var i = 0; i < club.members.length; i++){
            let user = await User.findById(club.members[i].id)
            user.inbox.push(announcement)
            user.markModified('inbox')
            user.save()
        }
    // })
    // annoucnementAction.then(() => {
         res.redirect(`/post/${club._id}`);
    // })
}