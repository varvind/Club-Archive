const Club = require('../models/Club')

module.exports = async (req, res) => {

    const club = await Club.findById(req.params.id)
    console.log(club)




    res.render('clubProfile' ,{
        club
    })
}