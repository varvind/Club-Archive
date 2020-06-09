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
        member = {name : club.member_applications[i].fullname, id:user._id}
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
            club.save()
        }
        //else{console.log("Already a Member (club)")}
        club.member_applications.splice(club_application_index,1)
        club.save()
       
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