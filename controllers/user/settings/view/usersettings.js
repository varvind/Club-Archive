const User = require('../../../../models/User')

module.exports = async (req, res) =>{
  const user = await User.findById(req.session.userId)

  res.render('user_views/settings/userSettings', {
      user,
      layout: 'layouts/topMenuBar'
  })
}
