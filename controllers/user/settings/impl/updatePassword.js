const User = require('../../../../models/User')
const bcrypt = require('bcryptjs')
var mode = 'production'
var loggedIn = global.loggedIn
var userId = ''
module.exports = async (req, res) => {
  await initVariables(mode, req.session.userId)
  if (!loggedIn) {
    res.redirect('/')
  } else {
    const user = await User.findById(userId)
    if (req.body.newPassword !== '') {
      bcrypt.compare(req.body.verifyPassword, user.password, (error, same) => {
        if (same) {
          if (req.body.newPassword !== req.body.confirmNewPassword) {
            error = 'New Password and Confirmation Do Not Match'
            res.render('user_views/settings/changePassword', {
              user,
              error,
              layout: 'layouts/topMenuBar'
            })
          } else {
            bcrypt.hash(req.body.newPassword, 10, async function (error, hash) {
              if (error) {
                console.log('Unable to hash password')
              }
              await User.findById(userId, (error, user) => {
                if (error) {
                  console.log('Unable to locate user')
                }
                user.password = hash
                user.save()
              })
            })
            res.redirect('/usersettings')
          }
        } else {
          error = 'Current Password is Incorrect'
          res.render('user_views/settings/changePassword', {
            user,
            error,
            layout: 'layouts/topMenuBar'
          })
        }
      })
    } else {
      res.redirect('/profile_password')
    }
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
