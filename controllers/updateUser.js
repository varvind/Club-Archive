const User = require('../models/User')
const mongoose = require('mongoose')

module.exports = (req, res)=> {
    var gfs = global.gfs
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
            
            //delete previous image
            if(user.image.filename != "default") {
                gfs.remove({_id: new mongoose.Types.ObjectId(user.image.id), root: 'uploads'}, (err) => {
                    if(err){
                        console.log("Issue with deleting old user image files")
                        res.redirect('/')
                    }else{
                        console.log("Successfully Deleted Old image files")
                    }
                })
            }
    
            user.image= {
                filename: req.file.filename,
                id: req.file.id
            }

            user.save();
            console.log(error)
        });
        res.redirect('/usersettings')
    }
    
}