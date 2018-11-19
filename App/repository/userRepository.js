var mongoose = require("mongoose");
var uuidv4 = require("uuid/v4");
// var bcrypt = require("bcrypt");


var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/videoresearch', function (err) {
    if (err) {
        throw err;
    } else {
        console.log('Mongo Database : connected');
    }
});

var AccountSchema = Schema({
    _id: String,
    name: String,
    email: String,
    password: String
});

var AccountModel = mongoose.model('accounts', AccountSchema);


module.exports = {

    login: function (req, cb) {
        console.log(req)
        var email = req.email;
        var password = req.password;

        if (email == null || password == null)
            console.log('null data');


        AccountModel.findOne({
            email: email,
            password: password
        }, function (err, user) {
            if (err) {                
                cb(user, false);
            } else if (user != null) {
                cb(user, true);
            } else {
                cb(user, false);
            }
        })
    },
    ajouterCompte : function(compte, cb){
        var nouveau = new  AccountModel({
            _id : compte._id,
            name : compte.name,
            email : compte.email,
            password : compte.password
        });
        nouveau.save(function(err){
            if(err){
                console.log("problème creation compte BD ");
                throw err;
            } else{
                cb();
            }
        });
    }


};
