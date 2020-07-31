const User = require('../../../../../models/User')
const Club = require('../../../../../models/Club')
const e = require('express')


module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    const club = await Club.findById(req.params.clubId)
    var canEdit = false;
    if(user != null){
        for(var i = 0; i < club.adminstrators.length; i++){
            if(String(req.session.userId) ==String(club.adminstrators[i].id) ){
                canEdit = true
            }
        }
    }
    if(canEdit) { 
        club.settings_history = []
        club.save();
        res.redirect(`/club_settings_history/${club._id}`)
    } else {
        res.redirect('/')
    }
}