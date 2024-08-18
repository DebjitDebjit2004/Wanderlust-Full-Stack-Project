const express = require("express")
const router = express.Router({ mergeParams: true })
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");

const userController = require("../Controller/user.js");

router.get("/signup", wrapAsync(userController.signupGet));

router.post("/signup", wrapAsync(userController.signupPost));

router.get("/login", userController.loginGet);

router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true, }), userController.loginPost)

router.get("/logout", userController.logout)

module.exports = router;