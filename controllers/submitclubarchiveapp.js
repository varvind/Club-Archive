const Club = require('../models/Club')
const CAApp = require('../models/CAApprovedApps')


module.exports = async (req, res) => {
    const club = await Club.findById(req.params.id);

    await CAApp.create ({
        club:club
    }, (error, newlymade) => {
        if(error){
            console.log(error)
        }
        else{
            console.log(newlymade)
        }
    })
    setTimeout(() => {
        res.redirect('/clubprofilesettings/' + club._id)
    }, 500);
    
}