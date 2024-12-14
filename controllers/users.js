const User = require("../models/user");


module.exports.getSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}


module.exports.signup = async(req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username })
        let registerdUser = await User.register(newUser, password);

        // LOGIN after SIGNUP
        req.logIn(registerdUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        })
        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}



module.exports.getLoginForm = (req, res) => {
    res.render("users/login.ejs");
}



module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}



module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    })
}