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
    signup : function(compte, cb){
        AccountModel.count({
            email: compte.email,
        }, function (err, count) {
            if (err) {    
                console.error();
            } else if (count == 0) {
                console.log("this mail was not used before to register "+compte.email)            
                var nouveau = new  AccountModel({
                    _id : compte._id,
                    name : compte.name,
                    email : compte.email,
                    password : compte.password
                });
                nouveau.save(function(err,resp){
                    if(err){
                        console.log("problème creation acount in the BD ");
                        console.error();
                    } else{
                        console.log("a new acount is created in the BD ");
                        cb(resp,true);
                    }
                });
            } else {
                console.log("this mail was used before to register "+compte.email)      
                cb(count, false);
            }
        })
    }


};
