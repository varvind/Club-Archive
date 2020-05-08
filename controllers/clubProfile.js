const Club = require('../models/Club')
const User = require('../models/User')
module.exports = async (req, res) => {

    const club = await Club.findById(req.params.id)
    const user = await User.findById(req.session.userId)
    
    var canEdit = false;
    if(user != null){
        for(var i = 0; i < user.clubs.length; i++){
            if(String(user.clubs[i]._id) == String(club._id)){
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
    //console.log(searches)
    req.session.searches=searches
    res.render('clubProfile' ,{
        club,
        user,
        canEdit
    })

}