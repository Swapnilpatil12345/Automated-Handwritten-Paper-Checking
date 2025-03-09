const User = require('../models/user.js');

module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs');
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs');
}

module.exports.signup = async (req, res) => {
    try {
        let { user } = req.body;
        const newUser = User(user);
        const registeredUser = await User.register(newUser, user.password);
        console.log(registeredUser);
        req.login(registeredUser,(err) =>{
            if(err){
                return next(err);
            }
            req.flash('sucess', 'user was registered');
            res.redirect('/papers')
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}

module.exports.login = async (req, res) => {
    req.flash('success','Well-Come Back to AHEGS');
    let redirectURL = res.locals.redirectUrl || '/papers';
    res.redirect(redirectURL);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        req.flash('success','Log-out Successfully!');
        res.redirect('/papers');
    })
}