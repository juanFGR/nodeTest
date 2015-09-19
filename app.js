
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();


var Twitter = require('twitter');
var client = new Twitter({
    consumerKey: 'ouy8sE5HZvOHuBVBOZAN0WgJY',
    consumerSecret: 'Y9AXQdYTWw6rnLYmPvMwNrFDADGC80g2z6aLZ3SCaK2HuZG8zj',
    access_token_key: '374141615-2xSdReXe9GlsjNl8jlbUA9cfbhpTAMtwP8PRVwtC',
    access_token_secret: 'CK6MawyTAKBU94ZCB27iBrx4TitMcxtPjbpGCdjxBzqW2'
});

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

var OAuth = require('oauth').OAuth
  , oauth = new OAuth(
      "https://api.twitter.com/oauth/request_token",
      "https://api.twitter.com/oauth/access_token",
      "ouy8sE5HZvOHuBVBOZAN0WgJY",
      "Y9AXQdYTWw6rnLYmPvMwNrFDADGC80g2z6aLZ3SCaK2HuZG8zj",
      "1.0",
      "https://immense-chamber-2876.herokuapp.com/auth/twitter/callback",
      "HMAC-SHA1"
    );


app.get('/auth/twitter', function(req, res) {
 
  oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
    if (error) {
      console.log(error);
      res.send("Authentication Failed!");
    }
    else {
      req.session.oauth = {
        token: oauth_token,
        token_secret: oauth_token_secret
      };
      console.log(req.session.oauth);
      res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
    }
  });
 
});

app.get('/auth/twitter/callback', function(req, res, next) {
 
  if (req.session.oauth) {
    req.session.oauth.verifier = req.query.oauth_verifier;
    var oauth_data = req.session.oauth;
 
    oauth.getOAuthAccessToken(
      oauth_data.token,
      oauth_data.token_secret,
      oauth_data.verifier,
      function(error, oauth_access_token, oauth_access_token_secret, results) {
        if (error) {
          console.log(error);
          res.send("Authentication Failure!");
        }
        else {
          req.session.oauth.access_token = oauth_access_token;
          req.session.oauth.access_token_secret = oauth_access_token_secret;
          console.log(results, req.session.oauth);
          res.send("Authentication Successful");
          // res.redirect('/'); // You might actually want to redirect!
        }
      }
    );
  }
  else {
    res.redirect('/login'); // Redirect to login page
  }
 
});





app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
