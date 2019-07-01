const express = require('express');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const postSchema = require('../models/Post');
const blogController = require('../controllers/blogController');

const router = express.Router();

router.get('/create', (req, res, next) => {
  res.render('postAdd/index');
});

router.post('/create', blogController);


module.exports = router;

