const User = require('../models/User')


module.exports = async (req, res) => {
 
    const user = await User.findById(req.session.userId)

    for(var i = 0; i < user.pending_applications.length; i++) {
        if(String(user.pending_applications[i].id) == String(req.params.id)) {
            user.pending_applications.splice(i,1)
            user.save()
        }
    }


    res.redirect('/userprofile')
}