const User = require('../models/User')
const Club = require('../models/Club')

module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    const club = await Club.findById(req.params.id)

    if(!club.adminstrators.includes(String(user._id)) && !club.admin_applications.includes(String(user._id))){
        club.admin_applications.push(user._id)
        user.pending_applications.push(club._id)
        club.save()
        user.save()
        res.redirect('/post/'+club._id)
    }
    else {
        res.redirect('/')
    }
    
}