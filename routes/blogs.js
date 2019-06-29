const express = require('express');
const Joi = require('@hapi/joi');
const _ = require('lodash');

const router = express.Router();

router.get('/create', (req, res, next) => {
  res.render('postAdd/index');
});

router.post('/create', (req, res, next) => {
  console.log("Request body",req.body);

  const createPostSchema = Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required()
  });

  const { error, result } = createPostSchema.validate({ title: title, content: content});

  if(_.isNull(error)) {
    res.send({status: 1, msg: {}});
  }else {
    res.send({status: 0, msg: {result}});
  }

});


module.exports = router;

