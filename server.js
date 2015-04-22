var express = require('express'),
    config = require('./server/configure'),
    Scraper = require('./services/scraper.js')();
    app = express();

    app.set('port', process.env.PORT || 3000);
    config(app);

    Scraper.getThreads(function(threads){
      threads.map(function(thread){
        var min = 1000*60;
        var now = new Date();
        var timeSinceChecked = Math.ceil((now.getTime() - thread.last_checked.getTime())/min);

        if (timeSinceChecked > thread.poll_time) {
          console.log("needs to be scraped, last scraped was " + timeSinceChecked + " mins ago");
        }

      });
    });

    app.listen(app.get('port'),function(){
      console.log('Server started sucessfully and is listeneing on port ' + app.get('port'));
    });
