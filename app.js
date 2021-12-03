var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var jacketRouter = require('./routes/jacket');
const resoureRouter = require('./routes/resource')
const addModRouter = require('./routes/addmods');
const selectorRouter = require('./routes/selector');
const Costume = require("./models/costume");
var hotstar= require('./routes/hotstar');
var Account = require('./models/account'); 

var passport = require('passport'); 
var LocalStrategy = require('passport-local').Strategy; 
var app = express();

const connectionString =  process.env.MONGO_CON;
console.log(connectionString)
mongoose.connect(connectionString,{useNewUrlParser: true, useUnifiedTopology: true}); 

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:')); 
db.once("open", function(){
   console.log("Connection to DB succeeded");
    recreateDB();
}); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({ 
  secret: 'keyboard cat', 
  resave: false, 
  saveUninitialized: false 
})); 
app.use(passport.initialize()); 
app.use(passport.session()); 
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/resource', resoureRouter);
app.use('/jacket', jacketRouter);
app.use('/users', usersRouter);
app.use('/hotstar', hotstar);
app.use('/addmods', addModRouter);
app.use('/selector', selectorRouter);
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

passport.use(new LocalStrategy( 
  function(username, password, done) { 
    Account.findOne({ username: username }, function (err, user) { 
      if (err) { return done(err); } 
      if (!user) { 
        return done(null, false, { message: 'Incorrect username.' }); 
      } 
      console.log(user)
      if ( user.validPassword && !user.validPassword(password)) { 
        return done(null, false, { message: 'Incorrect password.' }); 
      } 
      return done(null, user); 
    }); 
  }))

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    Account.findById(id, function(err, user) {
      done(err, user);
    });
  });


async function recreateDB(){ 
  // Delete everything 
  await Costume.deleteMany(); 
 
  let instance1 = new Costume({costume_type:"ghost",  size:'large', cost:125.4}); 
  let instance2 = new Costume({costume_type:"Joker",  size:'Medium', cost:129.4}); 
  let instance3 = new Costume({costume_type:"Batman",  size:'small', cost:112.4}); 

  instance1.save( function(err,doc) { 
      if(err) return console.error(err); 
      console.log("First object saved") 
  });
  instance2.save( function(err,doc) { 
    if(err) return console.error(err); 
    console.log("second object saved") 
  });
  instance3.save( function(err,doc) { 
    if(err) return console.error(err); 
    console.log("third object saved") 
  });
  
} 
 


module.exports = app;