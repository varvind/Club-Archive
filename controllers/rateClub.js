const User = require('../models/User')
const Club = require('../models/Club')

module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId, async function(err){
        if(err){
            console.log("User not logged in")
            res.redirect('/')
        }else{
            const club = await Club.findById(req.params.clubId, (error, found) => {
                if(error || !found){
                    console.log("Error finding club to rate")
                    res.redirect('/')
                }else{
                    let newUser = true
                    
                    found.ratings.users.forEach(user_rating => {
                        if(user_rating.userId == req.session.userId){
                            let difference = req.body.rating - user_rating.rating
                            found.ratings.total += difference
                            found.markModified('ratings')
                            found.save()

                            newUser = false
                        }
                    });

                    if(newUser){
                        let new_rating = {userId: req.session.userId, rating: req.body.rating}
                        found.ratings.users.push(new_rating)
                        found.ratings.total += req.body.rating
                        found.ratings.count += 1
                        found.save()
                    }

                    res.redirect('/')
                }
            });
        }
    });
}