module.exports = (req, res) => {
    res.render('user_views/login', {
        error : null,
        layout: false
    })
}