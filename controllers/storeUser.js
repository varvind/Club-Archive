const User = require('../models/User')
const path = require('path')
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
            await User.create({
                ...req.body,
                image: '/public/img/' + image.name
            }, function(error, newlymade) {
                if(error){
                    console.log(error)
                    res.render('userSignUp', {
                        error
                    })
                }
                else {
                    res.redirect('/')
                }
            })
            //req.session.userId = user._id
            
        })
    }
    
    
}