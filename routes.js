//This file sets up the routes for the entire app. By splitting it into their own modules it will be easier to
//create and set up routes as needed as the app may grow, both through features and api versions.
//The function takes the app and then sets up the routes, it works exactly the same as how configure works.

var mangementApiv1 = require('./routes/mangementApiV1');
var emailRoutes = require('./routes/emailRoutes');
var loginRoutes = require('./routes/loginRoutes.js');
var adminRoutes = require('./routes/adminRoutes.js');
var serveStatic = require('serve-static');
var path = require('path');
var auth = require('./controllers/auth');

module.exports.init = function(app) {
  app.use('/api/mangement/v1/', mangementApiv1);
  app.use('/email/', emailRoutes);
  app.use('/', loginRoutes);
  app.use('/admin', adminRoutes);
  app.use('/admin', auth.clientIsAuthenticated(), serveStatic(path.join(__dirname, '/views/admin/')));
  //serve up any files in the public folder
  app.use('/public/', serveStatic(path.join(__dirname, '/public/')));
  app.use('/', serveStatic(path.join(__dirname, '/_site/')));
  app.use('/docs', serveStatic(path.join(__dirname, '/views/docs/')));
}
