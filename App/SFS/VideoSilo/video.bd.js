var mongoose = require("mongoose");
var uuidv4 = require("uuid/v4");
// var bcrypt = require("bcrypt");


var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/videoresearch', function (err) {
    if (err) {
        throw err;
    } else {
        console.log('Mongo Video Database : connected');
    }
});

var VideoSchema = Schema({
    _id: String,
    name: String,
    thumbnailUrl: String,
    url: String,
    description: String
});

var VideoModel = mongoose.model('videos', VideoSchema);


module.exports = {
  
   


};