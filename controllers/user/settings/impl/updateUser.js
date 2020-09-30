const User = require('../../../../models/User')
const mongoose = require('mongoose')
var mode = 'production'
var loggedIn = global.loggedIn
var userId = '';
module.exports = async (req, res)=> {
  await initVariables(mode, req.session.userId)
  if(!loggedIn) {
    res.redirect('/')
  } else {
    var gfs = global.gfs
    var first = req.body.firstName;
    var last = req.body.lastName;
    var email = req.body.email;
    var userName = req.body.userName;
    var major = req.body.major;
    var grad = req.body.gradYear;
    var minor = req.body.minor;
    if(!req.file){
      await User.findById(userId, (error, user)=>{
        if(first != ""){ user.firstName = first; }
        if(last != ""){ user.lastName = last; }
        if(email != ""){ user.email = email; }
        if(userName != ""){ user.userName = userName }
        if(major!= ""){ user.major = major; }
        if(grad != ""){ user.gradYear = grad; }
        if(minor !=""){user.minor = minor}
        user.save();
      });
      res.redirect('/usersettings')
    }
    else{  
      await User.findById(userId, (error, user)=>{
        if(first != ""){ user.firstName = first; }
        if(last != ""){ user.lastName = last; }
        if(email != ""){ user.email = email; }
        if(userName != ""){ user.userName = userName }
        if(major!= ""){ user.major = major; }
        if(grad != ""){ user.gradYear = grad; }
        if(minor !=""){user.minor = minor}
        
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
    
}

function testMode () {
  mode = 'test'
}
async function initVariables (mode, id) {
  if (mode === 'test') {
    await User.findOne({ userName: '0' }, (err, user) => {
      if (err) {
        console.log(err)
      }
      userId = user._id
    })
    loggedIn = 'mock'
  } else {
    userId = id
    loggedIn = global.loggedIn
  }
}

module.exports.testMode = testMode
