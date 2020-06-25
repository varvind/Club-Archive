const User = require('../models/User')
const feedBackFroms = require('../models/BetaTestFeedback')
module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    const tickets = await feedBackFroms.find({})
    res.render('feedbackForm', {
        user,
        layout : 'layouts/topMenuBar',
        tickets
    })
}