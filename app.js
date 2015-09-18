
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

var Twitter = require('twitter');
var client = new Twitter({
    consumerKey: 'xaYsAVUzFp6vLXp3JHN2SeEVP',
    consumerSecret: 'VKhVcNYPLgCdxErnFQRtw8TnI3qEtdWgIXLtUuY6syYvMSG6Ft',
    access_token_key: '374141615-HlfD1AyeTqsNN2tNKZ2hMwz7e1c8uWmDn4duTNLq',
    access_token_secret: '4iWdRL5RFcSvNbH4h6LOw8M3PrWbYwNYcrWoFPzbhDQuL'
});

var params = {screen_name: 'nodejs'};
client.get('statuses/user_timeline', params, function(error, tweets, response){
  if (!error) {
    console.log(tweets);
  }
});

client.get('favorites/list', function(error, tweets, response){
  if(error) throw error;
  console.log(tweets);  // The favorites. 
  console.log(response);  // Raw response object. 
});

client.post('statuses/update', {status: 'I Love Twitter'},  function(error, tweet, response){
  if(error) throw error;
  console.log(tweet);  // Tweet body. 
  console.log(response);  // Raw response object. 
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

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/p', function(req, res){ res.render('p', { title: 'pp' }) });

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
