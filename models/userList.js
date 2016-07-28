var mongoose = require('mongoose');

// mongoose connection
mongoose.connect("mongodb://localhost:27017/login");

// creating schema
var userSchema = mongoose.Schema({
   username: String,
   password: String,
   firstname: String,
   lastname: String,
   email: String,
   roles: [String]
}, { collection: "user"});

var User = mongoose.model('User', userSchema);

module.exports = User;