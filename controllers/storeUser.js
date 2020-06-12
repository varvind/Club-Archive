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

    if(!req.file){
        res.render('userSignUp',  {
            error:"error",
            fields: inputs
        })
    }
    else {
        bcrypt.hash(req.body.password, 10, async function(error, hash) {
            await User.create({
                firstName: req.body.firstName,
                lastName : req.body.lastName,
                email :req.body.email,
                userName : req.body.userName,
                password: hash,
                major: req.body.major,
                gradYear: req.body.gradYear,
                image: req.file.filename
            }, function(error, newlymade) {
                if(error){
                    console.log(error)
                    res.render('userSignUp', { error: error, fields:inputs })
                }
                else {
                    req.session.userId = newlymade._id
                    res.redirect('/')
                }
            })
        })            
    }
}