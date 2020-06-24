const User = require('../models/User')


module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    //console.log(req.session)

    res.render('index', {
        user,
        layout: false
    })
}