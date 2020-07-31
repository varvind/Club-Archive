const Club = require('../../../../../models/Club')
const User = require('../../../../../models/User')


module.exports = async(req, res) => {
    const club = await Club.findById(req.params.id)
    const user = await User.findById(req.session.userId)
    const announcement_index = req.params.announcement_index
    var original_message = club.announcements[announcement_index]
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
    visibility = req.params.visibility
    // delete from club side
    if (visibility == "private") {
        original_message = club.announcements.private[announcement_index]
        club.announcements.private.splice(announcement_index, 1)
    } else {
        original_message = club.announcements.public[announcement_index]
        club.announcements.public.splice(announcement_index, 1)
    }
    const settings_message = {User: user.firstName + " " + user.lastName, Type: `Removed Announcement with Subject : ${original_message.subject}`, Date: date, Time: time}
    club.settings_history.unshift(settings_message)
    club.save()

    // delete from user side
    
    club.members.forEach(member => {
        delete_message_from_inbox(member, original_message)
    })

    setTimeout(() => {
        res.redirect('/clubannouncements/' + club._id)
    }, 2000);
}

async function delete_message_from_inbox(member, original_message) {
    const user = await User.findById(member.id)

    var i = 0
    user.inbox.forEach(message => {
        if(message.subject == original_message.subject
            && message.body == original_message.body) {
                user.inbox.splice(i, 1)
                user.save()
                return;
        }
        i++
    })

}

