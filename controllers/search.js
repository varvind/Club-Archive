const Club = require('../models/Club')
const User = require('../models/User')
module.exports = async (req, res) => {
    const query = req.query.search2
    
    if(query !== null && query !== '') {
        try {
            var clubs = await Club.find({name: {$regex: query, $options: "$i"}});
            res.render('searchlanding', {
                clubs
            })
        }catch {
            res.redirect('/')
        }
    } else {
        try {
            const clubs = await Club.find({});
            console.log("hello")
            res.render('searchlanding', {
                clubs
            })
        }catch {
            res.redirect('/')
        }
        
    }
}