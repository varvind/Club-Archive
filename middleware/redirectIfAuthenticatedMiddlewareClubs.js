module.exports = (req, res, next) => {
    if(req.session.clubId) {
        return res.redirect('/')
    }
    next()
}