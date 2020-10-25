require('dotenv').config();
const express = require('express');
const router = express.Router();
const passport = require('passport');
const post = require('../controller/postController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post(
  '/upload',
  passport.authenticate('jwt', { session: false }),
  upload.single('audio'),
  post.uploadPost
);

router.get(
  '/archived',
  passport.authenticate('jwt', { session: false }),
  post.getArchivedPosts
);

router.get(
  '/archive',
  post.markPostsAsArchived
);


router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  post.getPost
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  post.deletePost
);






module.exports = router;
