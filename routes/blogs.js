const express = require('express');

const _ = require('lodash');

const blogController = require('../controllers/blogController');

const router = express.Router();

router.get('/create', (req, res, next) => {
  res.render('postAdd/index');
});

router.post('/create', blogController.savePost);

router.get('/all', blogController.getAllPosts);

module.exports = router;

