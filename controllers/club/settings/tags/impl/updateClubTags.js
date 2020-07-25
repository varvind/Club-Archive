const User = require('../../../../../models/User')
const Club = require('../../../../../models/Club')

module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId);
    const club = await Club.findById(req.params.id)
    if(req.body.tags != ""){
        if(!club.tags.includes(req.body.tags)){
            club.tags.push(req.body.tags)
            club.save()
        }
    }
    res.redirect('/clubMarkettingSettings/' + club._id)
}