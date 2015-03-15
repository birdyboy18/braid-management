var express = require('express');
    router = express.Router();

//get controllers
var user = require('../controllers/user');
var auth = require('../controllers/auth');

router.get('/', function(req,res){
  res.json({'message': 'Using mangement api v1'});
});

//User routes
router.get('/user/', auth.isAuthenticated, auth.restrictTo('admin'), user.list);
router.post('/user/', user.create);
router.put('/user/:username', auth.isAuthenticated, auth.restrictToSelf(), user.update);
router.delete('/user/:username', auth.isAuthenticated, auth.restrictTo('admin'), user.remove);


module.exports = router;
