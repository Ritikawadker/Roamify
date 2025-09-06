const User = require("../models/user.js");



module.exports.renderSignupPage = (req, res) => {
    res.render("users/signUp.ejs");
}


module.exports.signupUser = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err) => {
            if (err) {
                req.flash("error", "Login after registration failed");
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}


module.exports.renderLoginPage = (req, res) => {
    res.render("users/login.ejs");
}


module.exports.loginUser = async (req, res) => {
    req.flash("success", "You succesfully logged in..!!");
    let redirect = res.locals.redirectUrl || "/listings";
    res.redirect(redirect);
}


module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next();
        }
        req.flash("success", "you have been successfully logged out !");
        res.redirect("/listings");
    })
}