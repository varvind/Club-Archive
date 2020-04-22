const User = require('../models/User')
const path = require('path')
const bcrypt = require('bcrypt')
module.exports = (req, res) => {
    if(!req.files){
        res.render('userSignUp',  {
            error:"error"
        })
    }
    else {
        let image = req.files.image;
    
        image.mv(path.resolve(__dirname,'..','public/img',image.name), async (error) => {
            if(error){
                console.log("Error making image")
            }
            bcrypt.hash(req.body.password, 10, async function(error, hash) {
                await User.create({
                    firstName: req.body.firstName,
                    lastName : req.body.lastName,
                    email :req.body.email,
                    userName : req.body.userName,
                    password: hash,
                    major: req.body.major,
                    gradYear: req.body.gradYear,
                    image: '/public/img/' + image.name
                }, function(error, newlymade) {
                    if(error){
                        console.log(error)
                        res.render('userSignUp', {
                            error
                        })
                    }
                    else {
                        req.session.userId = newlymade._id
                        res.redirect('/')
                    }
                })
            })
            
            //req.session.userId = user._id
            
        })
    }
    
    
}