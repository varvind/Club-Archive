const User = require('../../../../../models/User')
const Club = require('../../../../../models/Club')
const InviteMemberToken = require('../../../../../models/InviteMemberToken')

module.exports = async (req, res) => {
    await Club.findById(req.params.club_id, async (err, club) => {
        if(err || !club){
            console.log(err || "Club Not Found")
            res.redirect('/')
        }else{
            await User.findById(req.session.userId, async (errr, user) => {
                if(errr || !user){
                    console.log(errr || "User Not Found")
                    res.render('login', {
                        error: "You Must Be Logged In",
                        layout:false
                    })
                }else{
                    await InviteMemberToken.findOne({clubId: club._id, token: req.body.token}, (err, found) => {
                        if(err){
                            console.log("Error finding token")
                            res.render('club_views/settings/invite_members/joinClub', {
                                club,
                                user,
                                error: "Problem Finding Token",
                                layout:'layouts/topMenuBar'
                            })
                        }else if(!found){
                            console.log("Token not found")
                            res.render('club_views/settings/invite_members/joinClub', {
                                club,
                                user,
                                error: "Token Not Found",
                                layout:'layouts/topMenuBar'
                            })
                        }else{
                            let new_mem = {name: user.firstName + " " + user.lastName, id: user._id}
                            let alreadyMember = false
                            club.members.forEach(mem => {
                                if(String(mem.id) == String(user._id)){alreadyMember = true}
                            })
                            if(!alreadyMember){
                                club.members.push(new_mem)
                                club.markModified('members')
                            }else{console.log('already a member')}

                            if(found.isAdmin){
                                let alreadyAdmin = false
                                club.adminstrators.forEach(admin => {
                                    if(String(admin.id) == String(user._id)){alreadyAdmin = true}
                                })
                                if(!alreadyAdmin){
                                    club.adminstrators.push(new_mem)
                                    club.markModified('adminstrators')
                                }else{console.log('already an admin')}
                            }
                            club.save()

                            let alreadyInClub = false
                            user.clubs.forEach(organization => {
                                if(String(organization) == String(club._id)){alreadyInClub = true}
                            })
                            if(!alreadyInClub){
                                user.clubs.push(club._id)
                            }else{console.log('already in club')}
                            user.save()


                            InviteMemberToken.findOneAndDelete({clubId: club._id, token: req.body.token}, (err) => {
                                if(err){console.log("Error deleting invite token")}
                            })

                            res.redirect(`/post/${club._id}`)
                        }
                    })
                }
            })
        }
    })
}