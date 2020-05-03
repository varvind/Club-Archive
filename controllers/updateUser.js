const User = require('../models/User')
const path = require('path')
const bcrypt = require('bcrypt')
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
            if(first != ""){
                user.firstName = first;
            }
            if(last != ""){
                user.lastName = last;
            }
            if(email != ""){
                user.email = email;
            }
            if(userName != ""){
                user.userName = userName
            }
            if(major!= ""){
                user.major = major;
            }
            if(grad != ""){
                user.gradYear = grad;
            }
            

            user.save();
        });
    }
    else{
        let image = req.files.image;
        image.mv(path.resolve(__dirname,'..','public/img',image.name), async (error)=> {
            if(error){
                console.log("error while updating user")
            }
            else{
                User.findById(userid, (error, user)=>{
                    if(first != ""){
                        user.firstName = first;
                    }
                    if(last != ""){
                        user.lastName = last;
                    }
                    if(email != ""){
                        user.email = email;
                    }
                    if(userName != ""){
                        user.userName = userName
                    }
                    if(major!= ""){
                        user.major = major;
                    }
                    if(grad != ""){
                        user.gradYear = grad;
                    }
                    user.image ='/public/img/' + image.name;
                    user.save();
                });

            }
        })
    }
}