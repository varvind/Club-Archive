const Club = require('../../../../../models/Club')
const User = require('../../../../../models/User')

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
    const club = await Club.findById(req.params.id)
    const user = await User.findById(req.session.userId)
    if(!req.file){
        res.redirect('/clubsettings/'+ club._id)
    } else {
        const settings_message = {User: user.firstName + " " + user.lastName, Type: `Added Image from Club Profile`, Date: date, Time: time}
        club.settings_history.unshift(settings_message)
        if(req.file.mimetype == "image/jpeg" || req.file.mimetype == "image/png"){
            club.images.push(req.file.filename);
            club.save();
        }
        res.redirect('/clubsettings/'+ club._id)
    }
}