var express = require('express');
    router = express.Router();

//get controllers
var user = require('../controllers/user');
var braid = require('../controllers/braid');
var modifier = require('../controllers/modifier');
var thread = require('../controllers/thread');
var auth = require('../controllers/auth');

router.get('/', function(req,res){
  res.json({'message': 'Using mangement api v1'});
});

//User routes
router.get('/users/', auth.isAuthenticated, auth.isAuthorized(), user.list);
router.post('/user/', user.create);
router.put('/user/:username', auth.isAuthenticated, auth.isAuthorized(), user.update);
router.delete('/user/:username', auth.isAuthenticated, auth.isAuthorized(), user.remove);

//Braid Routes
router.get('/braids/', auth.isAuthenticated, auth.isAuthorized(), braid.list);
router.post('/braid/', auth.isAuthenticated, auth.isAuthorized(), braid.create);
router.put('/braid/:braid_id', auth.isAuthenticated, auth.isAuthorized(), braid.update);
router.delete('/braid/:braid_id', auth.isAuthenticated, auth.isAuthorized(), braid.remove);

//Modifier Routes
router.get('/modifiers/', auth.isAuthenticated, auth.isAuthorized(), modifier.list);
router.post('/modifier/', auth.isAuthenticated, auth.isAuthorized(), modifier.create);
router.put('/modifier/:modifier_id', auth.isAuthenticated, auth.isAuthorized(), modifier.update);
router.delete('/modifier/:modifier_id', auth.isAuthenticated, auth.isAuthorized(), modifier.remove);

//Thread Routes
router.get('/threads/', auth.isAuthenticated, auth.isAuthorized(), thread.list);
router.post('/thread/', auth.isAuthenticated, auth.isAuthorized(), thread.create);
router.put('/thread/:thread_id', auth.isAuthenticated, auth.isAuthorized(), thread.update);
router.delete('/thread/:thread_id', auth.isAuthenticated, auth.isAuthorized(), thread.remove);

router.get('/thread/:thread_id/entries', auth.isAuthenticated, auth.isAuthorized(), thread.listEntries);

/*
Modifier to threads routes, use this to attach modifiers to threads, the system will work out the rest.
Only needs to be a put request because we are updating the thread, the application will know what to do after.
*/
router.put('/attach/modifier/:mod_id/to/thread/:thread_id', auth.isAuthenticated, auth.isAuthorized(), thread.attachModifier);
router.put('/remove/modifier/:mod_id/from/thread/:thread_id', auth.isAuthenticated, auth.isAuthorized(), thread.removeModifier);

module.exports = router;
