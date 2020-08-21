const User = require('../../../../models/User')
var mode = 'production'
var loggedIn = global.loggedIn
var userId = ''
module.exports = async (req, res) => {
  await initVariables(mode, req.session.userId)
  const user = await User.findById(userId)
  var error
  if (loggedIn) {
    res.render('user_views/settings/changePassword', {
      user,
      error,
      layout: 'layouts/topMenuBar'
    })
  } else {
    res.redirect('/login')
  }
}

function testMode () {
  mode = 'test'
}

async function initVariables (mode, id) {
  if (mode === 'test') {
    await User.findOne({ userName: '0' }, (err, user) => {
      if (err) {
        console.log(err)
      }
      userId = user._id
    })
    loggedIn = 'mock'
  } else {
    userId = id
    loggedIn = global.loggedIn
  }
}

module.exports.testMode = testMode
