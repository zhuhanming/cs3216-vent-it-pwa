var express = require('express');
var router = express.Router();
require('dotenv').config();
const passport = require('passport');
const jsonWebToken = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const facebookAuth = passport.authenticate('facebook', {
  scope: ['email'],
  session: false,
  failWithError: true
});

const facebookAuthToken = passport.authenticate('facebook-token', {
  session: false,
  failWithError: true
});

const auth = require('../controller/authController');

router.post('/facebook', facebookAuthToken, auth.fbLogin, auth.fbLoginError);

router.post('/signup', auth.signupUser);
router.post(
  '/login',
  passport.authenticate('local', { session: false, failWithError: true }),
  auth.loginUser,
  auth.loginUserError
);

router.post(
  '/confirm',
  passport.authenticate('jwt', { session: false }),
  auth.confirmEmail
);

router.post(
  '/resend',
  passport.authenticate('jwt', { session: false }),
  auth.resendEmail
);



module.exports = router;
