var passport = require('passport');
var Account = require('./models/account');
var monk = require('monk');
var db = monk('localhost:27017/vidzy');

module.exports = function (app) {
    
  app.get('/', function (req, res) {
      res.render('index', { user : req.user });
  });

  app.get('/api/videos', function (req, res) {
    var collection = db.get('videos');
    collection.find({user : req.user.username}, function(err, videos){
        if (err) throw err;
        
        res.json(videos);
    });
  });

  app.get('/api/videos/:id', function (req, res) {
    var collection = db.get('videos');
    collection.findOne({ _id: req.params.id }, function(err, video){
        if (err) throw err;

        res.json(video);
    });
  });


app.post('/api/videos', function(req, res){
    var collection = db.get('videos');
    collection.insert({
        user: req.user.username,
        title: req.body.title,
        description: req.body.description
    }, function(err, video){
        if (err) throw err;

        res.json(video);
    });
});


  app.put('/api/videos/:id', function (req, res) {
    var collection = db.get('videos');
    collection.update({
        _id: req.params.id
    },
    {
        user: req.user.username,
        title: req.body.title,
        description: req.body.description
    }, function(err, video){
        if (err) throw err;

        res.json(video);
    });
  });

  app.delete('/api/videos/:id', function(req, res){
    var collection = db.get('videos');
    collection.remove({ _id: req.params.id }, function(err, video){
        if (err) throw err;

        res.json(video);
    });
});

  app.get('/register', function(req, res) {
      res.render('register', { });
  });

  app.get('/home', function(req, res) {
      res.render('home', { user : req.user  });
  });

  app.post('/register', function(req, res) {
      Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
          if (err) {
            return res.render("register", {info: "Sorry. That username already exists. Try again."});
          }

          passport.authenticate('local')(req, res, function () {
            res.redirect('/home');
          });
      });
  });

  app.get('/login', function(req, res) {
      res.render('login', { user : req.user });
  });

  app.post('/login', passport.authenticate('local'), function(req, res) {
      res.redirect('/home');
  });

  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  app.get('/ping', function(req, res){
      res.send("pong!", 200);
  });
  
};
