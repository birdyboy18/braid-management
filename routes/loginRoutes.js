var express = require('express'),
    router = express.Router(),
    auth = require('../controllers/auth');
    path = require('path');


// router.get('/login/', function(req, res) {
// 	var options = {
//     root: './views/login/',
//     dotfiles: 'deny',
//     headers: {
//         'x-timestamp': Date.now(),
//         'x-sent': true
//     }
//   };
//     console.log(options.root);
//     console.log(__dirname);
// 	res.sendFile('index.html', options);
// });

router.post('/login/', auth.localAuthentication);



module.exports = router;