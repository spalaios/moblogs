const Joi = require('@hapi/joi');
const _ = require('lodash');
const User = require('../models/User');


exports.signup = async (req, res, next) => {
  console.log("singup body", req.body);
  const { email, password, confirmpassword, firstname, lastname } = req.body;
  const userDoesExist = await User.find({email: email});
  console.log(userDoesExist);
  if(userDoesExist.length > 0) {
    // redirect it to login page
    res.send('user already exists');
    return;
  }else {
    const user = new User({
      firstname,
      lastname,
      email,
      password
    });
    const saveUser = await user.save();
    if(saveUser) {
      res.redirect('/post/create');
    }
  }
}