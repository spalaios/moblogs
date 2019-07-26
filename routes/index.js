var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController');
/* GET home page. */
router.get('/signup', function(req, res, next) {
  res.render('signup/index', {});
});

router.post('/signup', authController.signup);

router.get('/login', (req, res, next) => {
  res.render('login/index', {});
});


router.post('/login', authController.login);

router.get('/logout', authController.logout);

module.exports = router;
