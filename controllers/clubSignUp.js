module.exports = (req, res) => {
    res.render('clubSignUp', {
        error : null,
        fields :{},
        layout:false
    })
}