const User = require('../models/User')
const CAApprovedApps = require('../models/CAApprovedApps')
module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    
    applications = await CAApprovedApps.find({})
    
    
    
    
    
    
    //TODO : Add verification by ID as well
    if(user.firstName != "Arvind" || user.lastName != "Venkatesan"){
        res.redirect('/')
    }
    else{
        res.render('clubarchiveadmin', {
            user,
            applications
        })
    }


}