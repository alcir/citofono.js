var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var session = require('express-session');


var routes = require('./routes/index');
var citofono = require('./routes/citofono');
var connessi = require('./routes/connessi');

var app = express();

var auth = require('http-auth');
var basic = auth.basic({
	realm: "Simon Area.",
	file: __dirname + "/data/users.htpasswd"
});

var server = require('http').Server(app);
var servers = require('https').Server(app);

var tcpserver = require('net').Server(app);
var tlsserver = require('tls').Server(app);

var sockets = [];
var tlssockets = [];


app.use(session({
  name: 'server-session-cookie-id',
  secret: 'my express secret',
  saveUninitialized: true,
  resave: true,
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(auth.connect(basic));

app.use(function printSession(req, res, next) {
  //console.log('req.session.admin', req.session.admin);
  return next();
});


// middleware

app.use(function(req, res, next) {
    console.log('middleware');
    res.tcpserver = tcpserver;
    res.tlsserver = tlsserver;
    res.sockets = sockets;
    res.tlssockets = tlssockets;
    return next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/citofono', citofono);
app.use('/connessi', connessi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = {
    app: app,
    server: server,
    tcpserver: tcpserver,
    tlsserver: tlsserver,
    sockets: sockets,
    tlssockets: tlssockets
};
