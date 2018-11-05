var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuidv4 = require('uuid/v4');

var LoginSchema = Schema({
    _id : String,
    userName : String,
    passWord : String,
});
const LoginModel  = mongoose.model('comptes',LoginSchema);