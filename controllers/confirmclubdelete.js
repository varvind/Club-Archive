const User = require('../models/User')
const Club = require('../models/Club')

module.exports = async (req, res) => {
    const club = await Club.findById(req.params.id);
    const users = []
    
    for(var i = 0; i < club.adminstrators.length; i++){
        var user = await User.findById(club.adminstrators[i].id);
        for(var j = 0; j < user.clubs.length; j++){
            if(user.clubs[j] == String(club._id)){
                user.clubs.splice(j,1)
                user.save()
            }
        
        }
    }

    await Club.deleteOne({"_id" : club._id})
    for(var i = 0; i < searches.length; i++){
        if(String(searches[i]._id) == String(club._id)){
            searches.splice(i,1)
        }
    }
    setTimeout(() => {
        res.redirect('/')
    }, 4000)
    
}