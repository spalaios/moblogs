const Joi = require('@hapi/joi');
const _ = require('lodash');
const User = require('../models/User');
const getNextSequenceValue = require('../utilites').getNextSequenceValue;
const bcrypt = require('bcrypt');

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
    const newUserId = await getNextSequenceValue('userid');
    const newPassword = await bcrypt.hash(password, 12);
    if(newUserId && newPassword) {
      const user = new User({
        firstname,
        lastname,
        email,
        password: newPassword,
        _id: newUserId
      });
      const saveUser = await user.save();
      if(saveUser) {
        return res.send({
          status: 1,
          msg: "User successfully created"
        });
      }
    }
  }
}