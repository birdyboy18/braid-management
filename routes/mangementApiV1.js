var express = require('express');
    router = express.Router();

//get controllers
var user = require('../controllers/user');
var braid = require('../controllers/braid');
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

module.exports = router;
