const Club = require('../../../../../models/Club')
const CAApp = require('../../../../../models/CAApprovedApps')


module.exports = async (req, res) => {
    var today = new Date();
    var date = (today.getMonth() + 1) + '-' + today.getDate()+ "-" + today.getFullYear();
    var time = "";
    if(today.getUTCHours() - 5 > 12) {
            time = (today.getUTCHours() - 12 - 5) + ":" + today.getMinutes() + " pm"
    } else if (today.getUTCHours() - 5 == 12) {
            time = (today.getUTCHours() - 5 ) + ":" + today.getMinutes() + " pm"
    } else if (today.getUTCHours() - 5 == 0) {
            time = (today.getUTCHours() + 12 - 5) + ":" + today.getMinutes() + " am"
    } else {
            time = (today.getUTCHours() - 5) + ":" + today.getMinutes() + " am"
    }
    const club = await Club.findById(req.params.id);
    const settings_message = {User: user.firstName + " " + user.lastName, Type: `Submitted ClubArchive Approved Application`, Date: date, Time: time}
    club.settings_history.unshift(settings_message)
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