require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
var flash = require('connect-flash');
var mongoose = require('mongoose');

mongoose.set('strictQuery', false);
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(
    `mongodb+srv://${process.env.DB_username}:${process.env.DB_password}@cluster0.kj8t2zy.mongodb.net/bellspace?retryWrites=true&w=majority`
  );
}

var indexRouter = require('./routes/index');
var signupRouter = require('./routes/signup');
var loginRouter = require('./routes/login');
var userRouter = require('./routes/user');
var communityRouter = require('./routes/community');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({ secret: "cats", resave: false, saveUninitialized: true, cookie: { maxAge: 1800000 } }));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('keyboard cat'));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', indexRouter);
app.use('/register', signupRouter);
app.use('/login', loginRouter);
app.use('/user', userRouter);
app.use('/r', communityRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
