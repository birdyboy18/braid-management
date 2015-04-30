//This file sets up the routes for the entire app. By splitting it into their own modules it will be easier to
//create and set up routes as needed as the app may grow, both through features and api versions.
//The function takes the app and then sets up the routes, it works exactly the same as how configure works.

var mangementApiv1 = require('./routes/mangementApiV1');
var emailRoutes = require('./routes/emailRoutes');

module.exports.init = function(app) {
  app.use('/api/mangement/v1/', mangementApiv1);
  app.use('/email/', emailRoutes);
}
