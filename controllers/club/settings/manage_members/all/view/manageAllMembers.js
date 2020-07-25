const Club = require('../../../../../../models/Club')
const User = require('../../../../../../models/User')
module.exports = async (req, res) => {
    const club = await Club.findById(req.params.id)
    const user = await User.findById(req.session.userId)

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
        let non_admins = []
        club.members.forEach(mem => {
            let insert = true
            club.adminstrators.forEach(admin => {
                if(String(mem.id) == String(admin.id)){insert = false}
            });
            if(insert){non_admins.push(mem)}
        });

        res.render('club_views/settings/member_management/manageMembers' ,{club, user, non_admins,
            layout:'layouts/topMenuBar'})
    }
}