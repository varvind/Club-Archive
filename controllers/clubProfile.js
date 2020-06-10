const Club = require('../models/Club')
const User = require('../models/User')
module.exports = async (req, res) => {

    const club = await Club.findById(req.params.id)
    const user = await User.findById(req.session.userId)
    
    var canEdit = false;
    if(user != null){
        for(var i = 0; i < user.clubs.length; i++){
            if(String(user.clubs[i]) == String(club._id)){
                canEdit = true
            }
        }
        for(var i = 0; i < club.adminstrators.length; i++){
            if(String(req.session.userId) ==String(club.adminstrators[i].id) ){
                canEdit = true
            }
        }
    }
   var found = false;
   for(var i =0; i < searches.length; i++) {
        if(String(searches[i]._id) == String(club._id)) {
            found = true;
            searches[i] = club
            break;
        }
   }
   if(found == false) {
       searches.push(club)
   }

   //let alreadyAppliedAdmin = false;
   //for each if already applied to admin
   let alreadyAppliedMember = false;
   if(user != null){
    club.member_applications.forEach(user_app => {
        if(String(user_app.userId) == String(user._id)){
            alreadyAppliedMember = true;
        }
    });
   }

    //console.log(searches)
    req.session.searches=searches
    setTimeout(() => {
        res.render('clubProfile' ,{
            club,
            user,
            canEdit,
            alreadyAppliedMember
        })
    }, 2000);
    
}