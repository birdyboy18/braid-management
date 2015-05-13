//To keep the server lighweight we'll make a configure module
//that takes the app and then returns the app with all the config set up
var config = require('../config.js');
var path = require('path');
var routes = require('../routes');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var mongoose = require('mongoose');
var passport = require('passport');
var expressSession = require('express-session');
var Scraper = require('../services/scraper.js')();
var Email = require('../services/email.js');
var cors = require('cors');

module.exports = function(app) {
  //allows cross origin requests
  app.use(cors());
  app.use(logger('dev'));
  //used to parse json requests to the api
  app.use(bodyParser.json());
  //used to parse x-www-form-urlencoded requests to the api
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(methodOverride());
  app.use(expressSession({ secret: 'uni work sucks', resave: false, saveUninitialized: false}));
  //init passport for authentication
  app.use(passport.initialize());
  //allow the use of sessions
  app.use(passport.session());

  //init the routes
  routes.init(app);
  //Connect to the database
  var options = {
    user: config.db.user,
    pass: config.db.pass
  }
  mongoose.connect('mongodb://db.getbraid.io/braid', options);
  mongoose.connection.on('open', function(err){
    if (err) throw err;

    console.log("Succesfully connected to database");
    Scraper.start();
  });

  if ('development' === app.get('env')) {
    app.use(errorHandler());
    app.set('json spaces', 2);
  }

  return app;
}
