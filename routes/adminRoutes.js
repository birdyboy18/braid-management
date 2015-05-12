var express = require('express'),
    router = express.Router(),
    auth = require('../controllers/auth');
    path = require('path');

router.post('/logout', function(req,res){
    req.logOut();
    res.redirect('/login');
})



module.exports = router;