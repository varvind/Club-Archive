const bcrypt = require('bcryptjs')
const User = require('../../../../models/User')

module.exports = (req, res) => {
  const { userName, password } = req.body

  User.findOne({ userName: userName }, (error, user) => {
    if (user) {
      bcrypt.compare(password, user.password, (error, same) => {
        if (same) {
          req.session.userId = user._id
          res.redirect('/')
        } else {
          error = 'Invalid Login'
          res.render('user_views/login', {
            error: 'Invalid Login',
            layout: false
          })
        }
      })
    } else {
      console.log(error)
      res.render('user_views/login', {
        error: 'Invalid Login',
        layout: false
      })
    }
  })
}
