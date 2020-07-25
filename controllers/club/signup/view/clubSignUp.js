module.exports = (req, res) => {
    res.render('club_views/clubSignUp', {
        error : null,
        fields :{},
        layout:false
    })
}