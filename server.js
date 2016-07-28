var express = require('express');
var path = require('path');

var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); // for parsing multipart/form-data i.e. upload something
var cookieParser = require('cookie-parser');
var session = require('express-session');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var app = express();


// import mongoose model
var User = require('./models/userList.js');

var port = process.env.PORT || 3000;

// use static middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// use bodyparser middleware
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true})); // for parsing application/x-www-form-urlencoded

// configure cookieParser, session, session for passport and initialize passport
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret', // 'env' for production mode and 'secret' development
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// use passport local strategy i.e. check for valid username and password after authentication
passport.use(new LocalStrategy(
    function(username, password, done) {
       // checking valid user from database
       User.findOne({username: username, password: password}, function(err, user){
           if(user){
               return done(null, user);
           }
           return done(null, false, {message: "Unable to login"});
       });
    }
));

// serialize and deserialize user
// Serialize function determine what data from the user object should be stored in the session
passport.serializeUser(function(user, done){
   done(null, user);
});

passport.deserializeUser(function(user, done){
   done(null, user);
});

// For login
app.post('/login', passport.authenticate('local'), function(req, res){ // passport checks for authentication
   //console.log(req.body);
   console.log(req.user);
   res.json(req.user);
});

// For logout
app.post('/logout', function(req, res){ // passport checks for authentication
    req.logOut();
    res.sendStatus(200); // success
});

// For logged in i.e. to go to profile page
app.get('/loggedin', function(req, res){
    res.send(req.isAuthenticated() ? req.user : '0'); // if not authenticated redirect to 'login' page
});

// For register
app.post('/register', function(req, res){
   // Check if the username exists
   User.findOne({username: req.body.username}, function(err, user){
        if(user){ // if username already exists
            res.json(null);
        }
        else{
            // Add new user to the database
            var newUser = new User(req.body);
            newUser.roles = ['student']; // if not indicated put 'student' as default value
            newUser.save(function(err, user){
                req.login(user, function(err){ // passport makes the new user login
                    if(err){
                        return next(err);
                    }
                    res.json(user);
                });
            });
        }
   });
});

// Restrict data access from unauthorized user
var auth = function(req, res, next){
  if(!req.isAuthenticated()) {
      res.send(401);
  }
  else {
      next();
  }
};

app.get("/rest/user", auth, function(req, res){ // use this auth function to restrict json data
    User.find(function(err, users){
        res.json(users);
    });
});

// Frontend routes ======================================================================================
// Route to handle all angular requests
app.get('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// server running
app.listen(port, function(){
   console.log("Server running on port " + port);
});