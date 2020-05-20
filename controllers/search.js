const Club = require('../models/Club')
const User = require('../models/User')
module.exports = async (req, res) => {
    const query = req.query.search2
    const user = await User.findById(req.session.userId)
    //console.log(query)
    if(query !== null && query !== '') {
        try {
            var clubs = await Club.find({"$or" : [{tags : {$regex: query, $options:"$i"}},{description: {$regex: query, $options: "$i"}}, {name: {$regex: query, $options: "$i"}}]});
            res.render('searchLanding', {
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
            res.render('searchLanding', {
                clubs,
                query,
                user
            })
        }catch {
            res.redirect('/')
        }
        
    }
}