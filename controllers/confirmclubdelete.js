const User = require('../models/User')
const Club = require('../models/Club')

module.exports = async (req, res) => {
    const club = await Club.findById(req.params.id);
    const users = []
    
    (await User.find({clubs : [club._id]})).forEach(function(user) {
        console.log(user)
    });

    await Club.deleteOne({"_id" : club._id})

    setTimeout(() => {
        res.redirect('/')
    }, 4000)
    
}