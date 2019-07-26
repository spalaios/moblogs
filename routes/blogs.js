const express = require('express');

const _ = require('lodash');

const blogController = require('../controllers/blogController');

const router = express.Router();

router.get('/create', (req, res, next) => {
  if(req.session.user) {
    res.render('postAdd/index');
  }else {
    res.send({
      status: 0,
      msg: "Not authorized"
    });
  }
});

router.post('/create', blogController.savePost);

router.get('/all', blogController.getAllPosts);

router.get('/:id', blogController.getSinglePost);

router.post('/:id', blogController.deletePost);


module.exports = router;

