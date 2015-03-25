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
router.post('/:username/braid/', auth.isAuthenticated, auth.isAuthorized(), braid.create);
router.put('/:username/braid/:braid_id', auth.isAuthenticated, auth.isAuthorized(), braid.update);
router.delete('/:username/braid/:braid_id', auth.isAuthenticated, auth.isAuthorized(), braid.remove);

//Modifier Routes
router.get('/modifiers/', auth.isAuthenticated, auth.isAuthorized(), modifier.list);
router.post('/:username/modifier/', auth.isAuthenticated, auth.isAuthorized(), modifier.create);
router.put('/:username/modifier/:modifier_id', auth.isAuthenticated, auth.isAuthorized(), modifier.update);
router.delete('/:username/modifier/:modifier_id', auth.isAuthenticated, auth.isAuthorized(), modifier.remove);

//Thread Routes
router.get('/threads/', auth.isAuthenticated, auth.isAuthorized(), thread.list);
router.post('/:username/braid/:braid_id/thread/', auth.isAuthenticated, auth.isAuthorized(), thread.create);
router.put('/:username/braid/:braid_id/thread/:thread_id', auth.isAuthenticated, auth.isAuthorized(), thread.update);
router.delete('/:username/braid/:braid_id/thread/:thread_id', auth.isAuthenticated, auth.isAuthorized(), thread.remove);

module.exports = router;
