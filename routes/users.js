const express = require('express');
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const usersController = require("../controllers/users");


// GET SIGNUP ROUTE
// SIGNUP ROUTE
router
.route("/signup")
.get(usersController.getSignupForm)
.post(usersController.signup);



// GET LOGIN ROUTE
// LOGIN ROUTE 
router
.route("/login")
.get(usersController.getLoginForm)
.post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), usersController.login)



// LOGOUT ROUTE
router.get("/logout", usersController.logout)


module.exports = router;