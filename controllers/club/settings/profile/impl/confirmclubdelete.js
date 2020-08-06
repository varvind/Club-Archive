const User = require('../../../../../models/User')
const Club = require('../../../../../models/Club')
const popularClubs = require('../../../../../models/PopularClubs');
const forgotPassword = require('../../../../user/password_reset/view/forgotPassword');
const { unwatchFile } = require('fs');
module.exports = async (req, res) => {
    const club = await Club.findById(req.params.id);
    const users = []
    
    for(var i = 0; i < club.members.length; i++){
        var user = await User.findById(club.members[i].id);
        await removeFromUserClubs(user, club);
        await removeFromRecentSearch(user, club);
        await removeFromPendingApps(user, club);
        user.save()
    }
    for (var i = 0; i < club.images.length; i++) {
        gfs.remove({filename: String(club.images[i]), root: 'uploads'}, (err) => {
            if(err){
                console.log("Issue with deleting club image")
                res.redirect('/')
            }else{
                console.log("Successfully deleted club image")
            }
        })
    }
    await Club.deleteOne({"_id" : club._id})

    let topClubsObject = await popularClubs.findOne({})
    let topClubs = topClubsObject.topClubs
    for(var i = 0; i < topClubs.length; i++) {
        if(String(topClubs[i].club._id) == String(club._id)) {
            topClubs.splice(i, 1)
            topClubsObject.markModified('topClubs')
            topClubsObject.save();
            break;
        }
    }


    setTimeout(() => {
        res.redirect('/')
    }, 4000)
    
}

async function removeFromUserClubs(user, club) {
    for(var j = 0; j < user.clubs.length; j++){
        if(user.clubs[j] == String(club._id)){
            user.clubs.splice(j,1)
        }
    }
}

async function removeFromRecentSearch(user, club) {
    for(var i = 0; i < user.recent_search.length; i++){
        if(String(user.recent_search[i].id) == String(club._id)){
            user.recent_search.splice(i,1)
        }
    }
}

async function removeFromPendingApps(user, club) {
    for(var i = user.pending_applications.length - 1; i>= 0; i--) {
        if(String(user.pending_applications[i].clubId) == String(club._id)) {
            user.pending_applications.splice(i,1)
        }
    }
}