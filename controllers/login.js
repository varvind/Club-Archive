module.exports = (req, res) => {
    res.render('login', {
        error : null,
        layout: false
    })
}