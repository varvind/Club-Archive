const User = require('../../../../models/User')
var userId = ''
var mode = 'production'
module.exports = async (req, res) => {
  await initVariables(mode, req.session.userId)
  const user = await User.findById(userId)
  const inboxIndex = req.params.inbox_index
  console.log(user)
  user.inbox.splice(inboxIndex, 1)
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
      userId = user._id
      user.inbox.push({ subject: 'test', body: 'test', date: 'test', time: '9:41', club: 'testclub', status: 'unread', type: 'announcement' })
      user.save()
    })
  } else {
    userId = id
  }
}

module.exports.testMode = testMode
