const User = require('../models/User')
const path = require('path')
const bcrypt = require('bcrypt')
const fs = require('fs')

module.exports = (req, res)=> {
    var userid = req.session.userId;
    var first = req.body.firstName;
    var last = req.body.lastName;
    var email = req.body.email;
    var userName = req.body.userName;
    var major = req.body.major;
    var grad = req.body.gradYear;
    if(!req.files){
        User.findById(userid, (error, user)=>{
            if(first != ""){ user.firstName = first; }
            if(last != ""){ user.lastName = last; }
            if(email != ""){ user.email = email; }
            if(userName != ""){ user.userName = userName }
            if(major!= ""){ user.major = major; }
            if(grad != ""){ user.gradYear = grad; }

            user.save();
        });
        res.redirect('/usersettings')
    }
    else{
        let image = req.files.image;
        let imageName = Date.now() + '-' + image.name

        image.mv(path.resolve(__dirname, '..', 'public', 'user-images', imageName), async (error)=> {
            if(error){
                console.log("error while updating user")
                res.redirect('/usersettings')
            }
            else{
                User.findById(userid, (error, user)=>{
                    if(first != ""){ user.firstName = first; }
                    if(last != ""){ user.lastName = last; }
                    if(email != ""){ user.email = email; }
                    if(userName != ""){ user.userName = userName }
                    if(major!= ""){ user.major = major; }
                    if(grad != ""){ user.gradYear = grad; }
                    
                    let delete_path = path.join(path.resolve(__dirname, '..'), user.image)
                    fs.unlink(delete_path, (err) => {
                        if (err) {
                          console.error(err)
                          return
                        }
                    })
                    user.image = path.resolve(__dirname, '..', '/', 'public', 'user-images', imageName);

                    user.save();
                });
                res.redirect('/usersettings')
            }
        })
    }
}