const Club = require('../models/Club')
const User = require('../models/User')
module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    
    const query = req.query.search2 || "" //search bar
    const sort = req.query.sort || "" 
    const filter = req.query.filter || ""
   
    let params = {}
    if(query){ params = {"$or" : [{tags : {$regex: query, $options:"$i"}},{description: {$regex: query, $options: "$i"}}, {name: {$regex: query, $options: "$i"}}]} }
    let clubs = await Club.find(params)

    if(sort){
        if(sort == "overall"){
            clubs = clubs.sort((b,a) => {
                if(!b.ratings.global.count || b.ratings.global.count==0){return 1}
                else if(!a.ratings.global.count || a.ratings.global.count==0){return -1}
                else{
                    let a_average = a.ratings.global.total/a.ratings.global.count
                    let b_average = b.ratings.global.total/b.ratings.global.count
                    let difference = a_average - b_average
                    return difference
                }
            })
        } else if(sort == "member"){
            clubs = clubs.sort((b,a) => {
                if(!b.ratings.members.count || b.ratings.members.count==0){return 1}
                else if(!a.ratings.members.count || a.ratings.members.count==0){return -1}
                else{
                    let a_average = a.ratings.members.total/a.ratings.members.count
                    let b_average = b.ratings.members.total/b.ratings.members.count
                    let difference = a_average - b_average
                    return difference
                }
            })
        }else if(sort == "popular"){
            //yet to be implemented
        }else if(sort == "approved"){
            clubs = clubs.filter((a) => {
                return a.club_archive_approved
            })
        }else{console.log(sort)}
    }

    if(filter){
        if(filter == "academic"){
            clubs = clubs.filter((a) => {
                return a.category == "Academic Organization"
            })
        }else if(filter == "sports"){
            clubs = clubs.filter((a) => {
                return a.category == "Sports"
            })
        }else if(filter == "greek"){
            clubs = clubs.filter((a) => {
                return a.category == "Greek Organization"
            })
        }else if(filter == "special"){
            clubs = clubs.filter((a) => {
                return a.category == "Interest Groups"
            })
        }else{console.log(filter)}
        
    }

    res.render('searchLanding', {
        clubs,
        query,
        sort,
        filter,
        user,
        layout:'layouts/topMenuBar'
    })
}