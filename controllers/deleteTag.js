const User = require('../models/User')
const Club = require('../models/Club')

module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId);
    const club = await Club.findById(req.params.id)
    var temp = []
    for(var i = 0; i < club.tags.size(); i++){
        if(req.params.tagName != club.tags[i]){
            temp.push(club.tags[i])
        }
    }
    club.tags = temp;
    club.save();
    res.redirect('/clubMarkettingSettings/' + club._id)
}