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
    if(!req.file){
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
        User.findById(userid, (error, user)=>{
            if(first != ""){ user.firstName = first; }
            if(last != ""){ user.lastName = last; }
            if(email != ""){ user.email = email; }
            if(userName != ""){ user.userName = userName }
            if(major!= ""){ user.major = major; }
            if(grad != ""){ user.gradYear = grad; }
            user.image = req.file.filename
            user.save();
            console.log(error)
        });
        res.redirect('/usersettings')
    }
    
}