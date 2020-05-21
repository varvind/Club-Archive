const Club = require('../models/Club')
const User = require('../models/User')
const path = require('path')
module.exports = (req, res) => {
    if(!req.files){
        res.render('clubSignUp',  {
            error:"error"
        })
    }
    else {
        let image = req.files.image;
    
        image.mv(path.resolve(__dirname,'..','public/img',image.name), async (error) => {
            if(error){
                console.log("Error making image")
            }
            await Club.create({
                ...req.body,
                image: '/public/img/' + image.name
            }, async function(error, newlymade) {
                if(error){
                    console.log(error)
                    res.render('clubSignUp', {
                        error
                    })
                }
                else {
                    User.findById(req.session.userId, (error, user) => {
                        user.clubs.push(newlymade)
                        user.save()
                    })
                    
                    //user.clubs.push(newlymade._id) 
                    res.redirect('/')
                }
            })
            //req.session.userId = user._id
            
        })
    }
    
    
}