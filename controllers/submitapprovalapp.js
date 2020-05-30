const CAApprovedApp = require('../models/CAApprovedApps')
const Club = require('../models/Club')

module.exports = async (req, res) => {
    const currentApp = await CAApprovedApp.findById(req.params.id)
    
    if(String(req.body.applicationdecision) =="Accept") {
        console.log("hello")
        clubId = currentApp.club._id
        const club = await Club.findById(clubId);
        club.club_archive_approved = true;
        club.save()
        CAApprovedApp.remove({currentApp});
    } else {
        CAApprovedApp.remove({currentApp})
    }
    res.redirect('/')
}