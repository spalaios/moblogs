var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const async = require('async');
const request = require('request');
const session = require('express-session');
const mongdDbStore = require('connect-mongodb-session')(session);

const config = require('./config');
const mongoose = require('mongoose');
const User = require('./models/User');
const Counter = require('./models/Counter');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blogs');

var app = express();

const store = new mongdDbStore({
  uri:config.db,
  collection: 'sessions'
});

store.on('error', (error) => {
  console.log("Error while initalizing session store");
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: 'suraj',
  resave: false,
  saveUninitialized: true,
  store: store
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  try {
    const userCount = await User.count({});
    
    
    if(userCount <= 0) {
      //create a new user and save it to the database and add the user to the req object
      const user =  new User({
        firstname: 'Suraj',
        lastname: 'Palai',
        email: 'palaisuraj@gmail.com',
        password: '@surajpalai',
        gender: 'M'
      });

      const userSavedStatus = await user.save();

      if(userSavedStatus) {
        req.user = user;
      }
      

    }else {
      //just find by the given id
      const existingUser = await User.findById('5d1a5bc762d2dd1991dad80d');
      if(existingUser) {
        req.user = existingUser;
      }
    }

    next();
    
  } catch (error) {
    console.log("Error while setting user to the req object", error);
  }
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/post', blogRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


async function initateMyApp() {
  
  try {
    const mongooseConnection = await mongoose.connect(config.db, ({useNewUrlParser: true}));
    if(mongooseConnection) {
      console.log("Mongodb server running...");
      app.listen(config.app, async () => {
        console.log("Blog App server running...");
        const postIdCounter = await Counter.findOne({ _id: "postid"});
        const userIdCounter = await Counter.findOne({ _id: "userid"});
        if(!postIdCounter) {
          const isPostIdCounter = await Counter.create({ _id: "postid", sequence_value: 0});
          if(isPostIdCounter) {
            console.log("Post id counter created");
          }
        }
        if(!userIdCounter) {
          const isUserIdCounter = await Counter.create({ _id: "userid", sequence_value: 0});
          if(isUserIdCounter) {
            console.log("User id counter created");
          }
        }
      });
    }
  } catch (error) {
    console.log('something went wrong while starting the app server', error);
  }
}

initateMyApp();




function makeMultipleCreatePostRequest(number) {
  const requestArray = [];
  let option = {
    url: "http://localhost:3000/post/create",
    method: "POST",
    json: {
      "title": "Concurent request",
      "content": "concurenncy level being tested"
    } 
  }


  for(let i=0; i<number; i++) {
    requestArray.push(function(callback) {
      request(option, (error, response, body) => {
        if(error) {
          callback(error);
          return;
        }
        callback(null, body);
      })
    });
  }

  async.parallel(requestArray,
    function(err, result) {
      if(err) {
        console.log("concurrency request me locha hai", err);
        return;
      }
      console.log("Results array", result);
    }
  )
}

module.exports = app;
