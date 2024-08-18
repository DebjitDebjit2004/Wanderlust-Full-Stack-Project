const User = require("../DatabaseSchema/userSchema.js");
const passport = require("passport");

module.exports.signupGet = async (req, res) => {
    res.render("./user/signup");
}

module.exports.signupPost = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username })
        const registerUser = await User.register(newUser, password);
        req.login(registerUser, (err) =>{
            if (err) {
                return next(err);
            }
            req.flash("success", "Account Created :)")
            return res.redirect("/listing");
        })
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.loginGet = (req, res) => {
    res.render("./user/login")
}

module.exports.loginPost = async (req, res) => {
    req.flash("success", "you are registered on wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next)=>{
    req.logOut((err) =>{
        if (err) {
            next(err);
        }
        req.flash("success", "you are logged out from wanderlust")
        res.redirect("/listing")
    });
}