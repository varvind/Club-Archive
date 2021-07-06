const User = require('../../../models/User')

var mode = 'production'
var userId = ''
const clubs = []
const query = ''
const sort = ''
const filter = ''
const popularTags = []

module.exports = async (req, res) => {
  await initVariables(mode, req.session.userId)
  const user = await User.findById(userId)
  res.render('search/searchLanding', {
    clubs,
    query,
    sort,
    filter,
    user,
    popularTags,
    layout: 'layouts/topMenuBar'
  })
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
  } else {
    userId = id
  }
}

module.exports.testMode = testMode
