// Very Important Modules
var createError = require('http-errors');
var express = require('express');//web framework
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan'); //http logger middleware

/* Our app is api-only. 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
*/
// describe and define the behavior of the api
var app = express(); // instanciation. 

// view engine setup
/* We no use of static files.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
*/

var MongoDBUtil = require('./modules/mongodb/mongodb.module').MongoDBUtil;

app.use(logger('dev'));
app.use(express.json());//body-parser. parse only json content-type
app.use(express.urlencoded({ extended: false })); // encoded url .
app.use(cookieParser());//key-value pair cookies in keys var.
//app.use(express.static(path.join(__dirname, 'public')));//no static files
/*
app.use('/', indexRouter);
app.use('/users', usersRouter);
*/
//////above, app level dependency level.
MongoDBUtil.init();


// remove index page. and response with package.json file
app.get('/', function(req, res){
  var pkg = 
  require(path.join(__dirname,'package.json'));
  res.json({
    name: pkg.name,
    version: pkg.version,
    status: 'up'
  });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  //call a middleware function that handles the 404 error
  //invoke next middleware in the stack
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error'); // remove error pages
  res.json({
    message: res.locals.message,
    error: res.locals.error
  });
});

module.exports = app;
