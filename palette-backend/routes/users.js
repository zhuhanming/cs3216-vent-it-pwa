const express = require('express');
const router = express.Router();
const passport = require('passport');

const user = require('../controller/userController');

/* GET users listing. */
router.post(
  '/onboarded',
  passport.authenticate('jwt', { session: false }),
  user.markUserOnboarded
);

router.get(
  '/feed',
  passport.authenticate('jwt', { session: false }),
  user.getUserFeed
);

module.exports = router;
