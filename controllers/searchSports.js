const Club = require('../models/Club')
const User = require('../models/User')
module.exports = async (req, res) => {
    const query = "Sports"
    //console.log(query)
    const user = await User.findById(req.session.userId)
    if(query !== null && query !== '') {
        try {
            var clubs = await Club.find({category: {$regex: query, $options: "$i"}});
            res.render('searchlanding', {
                clubs,
                query,
                user
            })
        }catch {
            res.redirect('/')
        }
    } else {
        try {
            const clubs = await Club.find({});
            res.render('searchlanding', {
                clubs,
                query,
                user
            })
        }catch {
            res.redirect('/')
        }
        
    }
}