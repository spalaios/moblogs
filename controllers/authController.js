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

exports.login = async (req, res, next) => {
  console.log("login body", req.body);
  const { email, password } = req.body;
  let user = await User.find({email: email});
  if(_.isEmpty(user)) {
    res.send({
      status: 0,
      msg: "User does not exist"
    });
  }else {
    //match the password of the user
    user = user[0];
    const matchedPassword = await bcrypt.compare(password, user.password);
    if(matchedPassword) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(error => {
        if(!error) {
          res.send({
            status: 1,
            msg: 'loggedin successfully'
          });
        }
      });
    }
  }
}

exports.logout = async (req, res, next) => {
  console.log("logging out");
  req.session.destroy(err => {
    if(err) {
      console.log(err);
      return;
    }
    console.log("logged out");
    res.send({
      status: 1,
      msg: 'logged out successfully'
    });
  });
}