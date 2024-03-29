const User = require('../../../../models/User')
const Club = require('../../../../models/Club')
var mode = 'production'
var loggedIn = global.loggedIn
var userId = ''
module.exports = async (req, res) => {
  await initVariables(mode, req.session.userId)
  if (!loggedIn) {
    res.redirect('/')
  } else {
    const user = await User.findById(userId, (err, foundUser) => {
      if (err || !foundUser) {
        console.log('Problem finding User')
      }
    })
    const clubs = user.recent_search
    const clubNames = []
    var promises = []
    user.clubs.forEach(eachClub => {
      let clubPromise = Club.findById(eachClub, (err, foundClub) => {
        if (err || !foundClub) {
          console.log('No club found')
        } else {
          clubNames.push(foundClub.name)
        }
      }).catch(function(err) {
        throw err
      })
      promises.push(clubPromise)
    })

    Promise.all(promises).then(function(result) {
      res.render('user_views/profile/userProfile', {
        user,
        clubs,
        clubNames,
        layout: 'layouts/topMenuBar'
      })
    }).catch(function(err) {
      throw err
    })
  }
}

// These two methods are used for tests
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
