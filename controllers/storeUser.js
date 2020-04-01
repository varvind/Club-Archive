const User = require('../models/User')
const path = require('path')
module.exports = (req, res) => {
    let image = req.files.image;
    image.mv(path.resolve(__dirname,'..','public/img',image.name), async (error) => {
        await User.create({
            ...req.body,
            image: '/public/img/' + image.name
        })
        //req.session.userId = user._id
        res.redirect('/')
    })
}