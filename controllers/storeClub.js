const Club = require('../models/Club')
const User = require('../models/User')
const path = require('path')
module.exports = async (req, res) => {
    let inputs = []
    for(let input in req.body){
        if(input != null){
            inputs.push(req.body[input])}
        else{inputs.push("")}
    }
    if(!req.files){
        res.render('clubSignUp',  { error:"Error please upload at least 1 cover photo", fields: inputs })
    }
    else {
        var validFiles = true;
        for(var i = 0; i < req.files.length; i++){
            if(req.files[i].mimetype == "image/jpeg" || req.files[i].mimetype == "image/png"){
                false;
                break;
            }
        }
        if(validFiles){
            await Club.create({
                ...req.body
            }, async function(error, newlymade) {
                if(error){
                    console.log("hello")
                    console.log(error)
                    res.render('clubSignUp', { error: error})
                }
                else {
                    req.files.forEach(element => {
                        newlymade.images.push(element.filename)
                    });
                    User.findById(req.session.userId, (err, user) => {
                        var adminApplication = {clubId: newlymade._id,  name: newlymade.name, type: "admin", status: "Approved"}
                        user.pending_applications.push(adminApplication)
                        var memberApplication = {clubId: newlymade._id,  name: newlymade.name, type: "member", status: "Approved"}
                        user.pending_applications.push(memberApplication)
                        user.clubs.push(newlymade._id)
                        user.save()

                        admin = {name : user.firstName + " " + user.lastName, id: user._id}
                        newlymade.adminstrators.push(admin)
                        member = {name : user.firstName + " " + user.lastName, id: user._id}
                        newlymade.members.push(member)
                        
                    })
                    newlymade.save()
                    res.redirect('/')
                }
            })  
        }
        else{
            error = "File type invalid, please upload a jpg or png"
            res.render('clubSignUp',  {
                error : "File type invalid, please upload a jpg or png",
                fields: inputs
            })
        }
                      
    }
}