const Club = require('../models/Club')
const User = require('../models/User')
module.exports = async (req, res) => {
    const club = await Club.findById(req.params.club_id)
    const user = await User.findById(req.session.userId)
    const member = await User.findById(req.params.user_id)

    var canEdit = false;
    if(user != null){
        for(var i = 0; i < club.adminstrators.length; i++){
            if(String(req.session.userId) ==String(club.adminstrators[i].id) ){
                canEdit = true
            }
        }
    }

    if(!canEdit){res.redirect('/')}
    else{
        if(req.body.make_admin){
            //console.log("Make Admin")
            let admin = {name : member.firstName+" "+member.lastName, id:member._id}
            club.adminstrators.push(admin)
            club.save()
        }
        else if(req.body.remove_admin){
            //console.log("Remove Admin")
            if(club.adminstrators.length > 1) {
                let i=0
                club.adminstrators.forEach(admin => {
                    if(String(admin.id) == String(member._id)){
                        club.adminstrators.splice(i,1)
                        club.save()
                    }
                    i += 1
                });
            } else {
                console.log("Cannot remove admin if there is only 1")
            }
            

            //need to remove admin priviledges
        }
        else if(req.body.delete_member){
            console.log("Delete Member")
            if(club.administrators > 1){
                let i =0
                club.adminstrators.forEach(admin => {
                    if(String(admin.id) == String(member._id)){
                        club.adminstrators.splice(i,1)
                        club.save()
                    }
                    i += 1
                });

                i=0
                club.members.forEach(mem => {
                    if(String(mem.id) == String(member._id)){
                        club.members.splice(i,1)
                        club.save()
                    }
                    i += 1
                });

                i= 0
                member.clubs.forEach(found => {
                    if(String(found) == String(club._id)){
                        member.clubs.splice(i,1)
                        member.save()
                    }
                    i += 1
                })

                i = 0
                member.pending_applications.forEach(application => {
                    if(String(application.clubId) == club._id){
                        member.pending_applications[i].status = "Removed From Club"
                        member.markModified('pending_applications')
                        member.save()
                    }
                    i += 1
                });
            } else {
                console.log("cannot delete only member of club")
            }
            
            
        }
        else{
            console.log("Editing priviledges Error")
        }

        res.redirect(`/${req.params.club_id}/manage-members`)
    }
}