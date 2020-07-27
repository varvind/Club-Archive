const User = require('../../../../../models/User')
const Club = require('../../../../../models/Club')

module.exports = async (req, res) => {
    await Club.findById(req.params.club_id, async (err, club) => {
        if(err || !club){
            console.log(err || "Club Not Found")
            res.redirect('/')
        }else{
            await User.findById(req.session.userId, (errr, user) => {
                if(errr || !user){
                    console.log(errr || "User Not Found")
                    res.redirect('/')
                }else{
                    let canEdit = false
                    club.adminstrators.forEach(admin => {
                        if(String(admin.id) == user._id){
                            canEdit = true
                        }
                    })
                    if(!canEdit){
                        console.log("User does not have access to these settings")
                        res.redirect('/')
                    }else{
                        res.render('club_views/settings/invite_members/inviteMembers', {
                            club,
                            user,
                            layout:'layouts/topMenuBar'
                        })
                    }
                }
            })
        }
    })
}