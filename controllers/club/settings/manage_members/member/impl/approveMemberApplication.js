const User = require('../../../../../../models/User')
const Club = require('../../../../../../models/Club')

module.exports = async (req, res) =>{    
    var today = new Date();
    var date = (today.getMonth() + 1) + '-' + today.getDate()+ "-" + today.getFullYear();
    var time = "";
    const signed_in_user = await User.findById(req.session.userId)
    if(today.getUTCHours() - 5 > 12) {
            time = (today.getUTCHours() - 12 - 5) + ":" + today.getMinutes() + " pm"
    } else if (today.getUTCHours() - 5 == 12) {
            time = (today.getUTCHours() - 5 ) + ":" + today.getMinutes() + " pm"
    } else if (today.getUTCHours() - 5 == 0) {
            time = (today.getUTCHours() + 12 - 5) + ":" + today.getMinutes() + " am"
    } else {
            time = (today.getUTCHours() - 5) + ":" + today.getMinutes() + " am"
    }
    const user = await User.findById(req.params.user_id, (err, found) => {
        if(!found || err){console.log("Error finding user or does not exist")}
    })
    const club = await Club.findById(req.params.club_id, (err, found) => {
        if(!found || err){console.log("Error finding club or does not exist")}
    })

    var user_application_index;
    var club_application_index;
    var i = 0
    user.pending_applications.forEach(application => {
        if(String(application.clubId) == String(req.params.club_id) && application.type == "member"){
            user_application_index = i
        }
        i += 1
    });
    i = 0
    club.member_applications.forEach(application => {
        if(String(application.userId) == String(req.params.user_id)){
            club_application_index = i
        }
        i += 1
    });
    

    if(req.body.approve){
        console.log(club_application_index)
        member = {name : club.member_applications[club_application_index].fullname, id:user._id}
        let insert1 = false
        club.members.forEach(member => {
            if(String(member.id) == String(user._id)){
                //console.log("User already in clum-members schema")
                insert1 = true
            }
        });
        if(insert1 == false){
            //console.log("User not found in club-member schema, so push user as new member")
            club.members.push(member)
        }
        //else{console.log("Already a Member (club)")}
        const settings_message = {User: signed_in_user.firstName + " " + signed_in_user.lastName, Type: `Accepted ${club.member_applications[club_application_index].fullname} into Club`, Date: date, Time: time}
        club.settings_history.unshift(settings_message)
        club.member_applications.splice(club_application_index,1)
        club.save()
        var app_notification = {subject: `Application Status: Member for ${club.name}`, body : `Congrats! You have been accepted as a member of ${club.name}! Please be sure to contact your club for next steps! You will also begin to receive updates from clubs should they announce any!`, date : date, time : time, club : club.name, status: "unread", type :"application"}
        user.inbox.unshift(app_notification)
        user.pending_applications[user_application_index].status = "Approved"
        user.markModified('pending_applications')
        let insert2 = false
        user.clubs.forEach(found => {
            if(String(found) == String(club._id)){
                //console.log("Club already in user-club schema")
                insert2 = true
            }
        });
        if(insert2 == false){
            //console.log("Club not found in user-club schema, so push new club")
            
            user.clubs.push(club._id)
            user.save()
        }
        else{
            //console.log("Already a Member (user)")
            user.pending_applications.splice(user_application_index,1)
            user.save()
        }
        
    }
    else{
        const settings_message = {User: signed_in_user.firstName + " " + signed_in_user.lastName, Type: `Rejected ${club.member_applications[club_application_index].fullname} into Club`, Date: date, Time: time}
        club.settings_history.unshift(settings_message)
        club.member_applications.splice(club_application_index,1)
        club.save()

        user.pending_applications[user_application_index].status = "Denied"
        var app_notification = {subject: `Application Status: Member for ${club.name}`, body : `We are sorry to inform you that you have been declined for member of ${club.name}. If you have additional questions please be sure to contact the club/organization `, date : date, time : time, club : club.name, status: "unread", type :"application"}
        user.inbox.unshift(app_notification)
        user.markModified('pending_applications')
        user.save()

    }
    setTimeout( () => {
        res.redirect(`/${req.params.club_id}/club-applications`)
    }, 2000)

}