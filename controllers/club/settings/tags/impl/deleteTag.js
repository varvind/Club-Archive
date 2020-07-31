const User = require('../../../../../models/User')
const Club = require('../../../../../models/Club')

module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId);
    const club = await Club.findById(req.params.id)
    var temp = []
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
    for(var i = 0; i < club.tags.length; i++){
        if(req.params.tagName != club.tags[i]){
            temp.push(club.tags[i])
        }
    }
    club.tags = temp;
    const settings_message = {User: user.firstName + " " + user.lastName, Type: `Deleted Tag: ${req.params.tagName}`, Date: date, Time: time}
    club.settings_history.unshift(settings_message)
    club.save();
    res.redirect('/clubMarkettingSettings/' + club._id)
}