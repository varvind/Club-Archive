const feedback = require('../../../models/BetaTestFeedback')


module.exports = async(req, res) => {
    var image = [];

    if(req.files) {
        req.files.forEach(element => {
            image.push(element.filename)
        });
    }

    await feedback.create({
        subject: req.body.subject,
        feedback : req.body.message,
        image:image,
        type : req.body.category,
        status: "Unresolved"
    }, function (error, newlymade) {
        if(error) {
            res.redirect('/betatest')
        }
    })
    res.redirect('/requestrecorded')
    
}