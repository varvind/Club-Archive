
module.exports = (req, res) => {
    req.session.searches = []
    res.redirect('/userprofile')
}