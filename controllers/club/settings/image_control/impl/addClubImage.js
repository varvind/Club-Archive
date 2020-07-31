const Club = require('../../../../../models/Club')
const User = require('../../../../../models/User')

module.exports = async (req, res) => {
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