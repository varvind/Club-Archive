const User = require('../models/User')
const path = require('path')
const bcrypt = require('bcrypt')
module.exports = (req, res) => {
    let inputs = []
    for(let input in req.body){
        if(input != null){
            inputs.push(req.body[input])}
        else{inputs.push("")}
    }
    if (!req.file) {
        imageObj = {
            filename: "default",
            id: 0
        }
    } else if (req.file.mimetype == "image/jpeg" || req.file.mimetype == "image/png") {
        imageObj = {
            filename: req.file.filename,
            id: req.file.id
        }
    } else {
        error = "File type invalid, please upload a jpg or png"
        res.render('userSignUp',  {
            error : "File type invalid, please upload a jpg or png",
            fields: inputs
        })
    }
    if(req.body.password != req.body.confirm_password) {
        error = "Confirm password does not match original password"
        res.render('userSignUp',  {
            error : "Confirm password does not match original password",
            fields: inputs
        })
    } else {
        bcrypt.hash(req.body.password, 10, async function(error, hash) {
            await User.create({
                firstName: req.body.firstName,
                lastName : req.body.lastName,
                email :req.body.email,
                userName : req.body.userName,
                password: hash,
                major: req.body.major,
                gradYear: req.body.gradYear,
                image: imageObj
            }, function(error, newlymade) {
                if(error){
                    console.log(error)
                    res.render('userSignUp', { error: error, fields:inputs, layout:false })
                }
                else {
                    req.session.userId = newlymade._id
                    res.redirect('/')
                }
            })
        })
    }
    
}
        