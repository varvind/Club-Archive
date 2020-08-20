const User = require('../../../../models/User')

var userId = ''
var mode = 'production'

module.exports = async (req, res) => {
  await initVariables(mode, req.session.userId)
  console.log(await User.find({}))
  const user = await User.findById(userId)

  for (var i = 0; i < user.inbox.length; i++) {
    user.inbox[i].status = 'read'
  }
  user.markModified('inbox')
  user.save()
  res.redirect('/notificationsPage')
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
      user.inbox.push({ subject: 'test', body: 'test', date: 'test', time: '9:41', club: 'testclub', status: 'unread', type: 'announcement' })
      user.inbox.push({ subject: 'test', body: 'test', date: 'test', time: '9:41', club: 'testclub', status: 'unread', type: 'announcement' })
      user.save()
      userId = user._id
    })
  } else {
    userId = id
  }
}

module.exports.testMode = testMode
