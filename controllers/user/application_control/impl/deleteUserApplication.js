const User = require('../../../../models/User')
const Club = require('../../../../models/Club')
var loggedIn = global.loggedIn
var mode = 'production'
var userId = ''
module.exports = async (req, res) => {
  await initVariables(mode, req.session.userId)
  if (!loggedIn) {
    res.redirect('/')
  } else {
    const user = await User.findById(userId)
    const club = await Club.findById(req.params.id)
    for (var i = 0; i < user.pending_applications.length; i++) {
      if (String(user.pending_applications[i].clubId) === String(req.params.id)) {
        user.pending_applications.splice(i, 1)
        user.save()
        break
      }
    }
    for (i = 0; i < club.admin_applications.length; i++) {
      if (String(userId) === club.admin_applications[i].userId) {
        club.admin_applications.splice(i, 1)
        club.save()
        break
      }
    }
    for (i = 0; i < club.member_applications.length; i++) {
      if (String(userId) === club.member_applications[i].userId) {
        club.member_applications.splice(i, 1)
        club.save()
        break
      }
    }
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
  }
}

module.exports.testMode = testMode
