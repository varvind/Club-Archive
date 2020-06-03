const User = require('../models/User')
const Club = require('../models/Club')

module.exports = async (req, res) =>{    
    
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
        if(String(application.clubId) == req.params.club_id && application.type == "member"){
            user_application_index = i
        }
        i += 0
    });
    i = 0
    club.member_applications.forEach(application => {
        if(String(application.userId) == req.params.user_id && application.type == "member"){
            club_application_index = i
        }
        i += 0
    });
    

    if(req.body.approve){
        member = {name : club.member_applications[i].fullname, id:req.params.user_id}
        club.members.push(member)
        club.member_applications.splice(club_application_index,1)
        club.save()

       
        user.pending_applications[user_application_index].status = "Approved"
        user.markModified('pending_applications')
        
        let insert = user.clubs.includes(req.params.club_id)
        if(!insert){user.clubs.push(req.params.club_id)}
        user.save()
    }
    else{
        club.member_applications.splice(club_application_index,1)
        club.save()

        user.pending_applications[user_application_index].status = "Denied"
        user.markModified('pending_applications')
        user.save()

    }
    setTimeout( () => {
        res.redirect(`/${req.params.club_id}/club-applications`)
    }, 2000)

}