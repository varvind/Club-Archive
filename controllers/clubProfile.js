const Club = require('../models/Club')
const User = require('../models/User')
module.exports = async (req, res) => {

    const club = await Club.findById(req.params.id)
    const user = await User.findById(req.session.userId)
    
    var canEdit = false;
    if(user != null){
        for(var i = 0; i < user.clubs.length; i++){
            if(user.clubs[i].name == club.name){
                canEdit = true
            }
        }
    }
    console.log(canEdit)
   var found = false;
   for(var i =0; i < searches.length; i++) {
        if(searches[i].name == club.name) {
            found = true;
            break;
        }
   }
   if(found == false) {
       searches.push(club)
   }
    //console.log(searches)
    req.session.searches=searches
    res.render('clubProfile' ,{
        club,
        user,
        canEdit
    })

}