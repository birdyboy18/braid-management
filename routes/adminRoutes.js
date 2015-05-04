var express = require('express'),
    router = express.Router(),
    auth = require('../controllers/auth');
    path = require('path');


router.get('/admin', auth.clientIsAuthenticated(), function(req, res){
    res.send("You made it to the admin area");
});

router.post('/logout', function(req,res){
    req.logOut();
    res.redirect('/login');
})



module.exports = router;