module.exports =  async (req, res) => {    
    res.render('user_views/userSignUp', {
        error: null,
        fields: {},
        layout:false
    })
}
