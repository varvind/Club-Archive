const Club = require('../models/Club')
const User = require('../models/User')


module.exports = async(req, res) => {
    const club = await Club.findById(req.params.id)
    const announcement_index = req.params.announcement_index
    //update club side of update

    // private announcement update
    console.log(req.body)
    if(req.body.subject != "" || req.body.body != "") {
        var today = new Date();
        var original_announcement;
        current_date = getCurrentDate(today);
        current_time = getCurrentTime(today);
        subject = ""
        body = ""
        if(req.params.visibility == "private") {
            original_announcement = club.announcements.private[announcement_index]
            if(req.body.subject != "") {
                subject = req.body.subject
            } else {
                subject = club.announcements.private[announcement_index].subject
            }

            if(req.body.body != "") {
                    body = req.body.body
            } else {
                body = club.announcements.private[announcement_index].body
            }

            club.announcements.private.splice(announcement_index, 1)
            const new_announcement = {subject: subject, body : body, date : current_date, time : current_time}
            club.announcements.private.unshift(new_announcement)
            club.save()
            
        } else {
            original_announcement = club.announcements.public[announcement_index]
            if(req.body.subject != "") {
                subject = req.body.subject
            } else {
                subject = club.announcements.public[announcement_index].subject
            }

            if(req.body.body != "") {
                    body = req.body.body
            } else {
                body = club.announcements.public[announcement_index].body
            }

            club.announcements.public.splice(announcement_index, 1)
            const new_announcement = {subject: subject, body : body, date : current_date, time : current_time}
            club.announcements.public.unshift(new_announcement)
            club.save()
        }

        const user_updated_announcement = {subject: subject, body : body, date : current_date, time : current_time, club : club.name, status: "unread"}
        club.members.forEach(member => {
            update_user_inbox(member, user_updated_announcement, original_announcement)
        })
    }
    setTimeout(() => {
        res.redirect('/clubannouncements/' + club._id)
    }, 2000);
    
    
}



function getCurrentDate(today) {
    return  (today.getMonth() + 1) + '-' + today.getDate()+ "-" + today.getFullYear();
}

function getCurrentTime(today) {
    time = ""
    if(today.getUTCHours() - 5 > 12) {
        time = (today.getUTCHours() - 12 - 5) + ":" + today.getMinutes() + " pm"
    } else if (today.getUTCHours() - 5 == 12) {
        time = (today.getUTCHours() - 5 ) + ":" + today.getMinutes() + " pm"
    } else if (today.getUTCHours() - 5 == 0) {
        time = (today.getUTCHours() + 12 - 5) + ":" + today.getMinutes() + " am"
    } else {
        time = (today.getUTCHours() - 5) + ":" + today.getMinutes() + " am"
    }
    return time
}

async function update_user_inbox(member, user_updated_announcement, original_announcement) {
    const user = await User.findById(member.id)
    var i = 0;
    user.inbox.forEach(messages => {
        if(original_announcement.subject == messages.subject 
            && original_announcement.body == messages.body) {
                user.inbox.splice(i, 1)
                user.inbox.unshift(user_updated_announcement)
                user.save()
                return;
        }
        i++
    })
}