const express = require("express");
const router = express.Router();
const controllerUser = require("../controller/user.js")
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.route("/signup")
.get(controllerUser.renderSignupPage)
.post(wrapAsync(controllerUser.signupUser))


router.route("/login")
.get( controllerUser.renderLoginPage)
.post(saveRedirectUrl, passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
}), controllerUser.loginUser )
//passport automatically clear all session to we store user path in locals and then redirect through this path

router.get("/logout", controllerUser.logoutUser )

module.exports = router;