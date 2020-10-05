const User = require('../../../../models/User')
var mode = 'production'
var loggedIn = global.loggedIn
var userId = ''
module.exports = async (req, res) => {
  await initVariables(mode, req.session.userId)
  if (!loggedIn) {
    res.redirect('/')
  } else {
    const user = await User.findById(userId)
    user.popular_tags = []
    user.recent_search = []
    user.save()
    res.redirect('/userprofile')
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
