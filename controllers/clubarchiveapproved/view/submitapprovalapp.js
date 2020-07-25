const CAApprovedApp = require('../../../models/CAApprovedApps')
const Club = require('../../../models/Club')

module.exports = async (req, res) => {
    const currentApp = await CAApprovedApp.findById(req.params.id)
    
    if(String(req.body.applicationdecision) =="Accept") {
        clubId = currentApp.club._id
        const club = await Club.findById(clubId);
        club.club_archive_approved = true;
        club.save()
        await CAApprovedApp.deleteOne({"_id" : currentApp._id})
    } else {
        await CAApprovedApp.deleteOne({"_id" : currentApp._id})
    }
    res.redirect('/')
}