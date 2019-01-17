var mongoose = require("mongoose");
var uuidv4 = require("uuid/v4");
// var bcrypt = require("bcrypt");


var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/user', function (err) {
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
    password: String,
    last_login : String,
    role_id: String,
    created_at : String, 
    status: String 
});

var AccountModel = mongoose.model('accounts', AccountSchema);


module.exports = {

    login: function (req, cb) {
        var email = req.email;
        var password = req.password;
        var lastLogin = (new Date()).toISOString();
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
        var lastLogin = (new Date()).toISOString();
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
                    password : compte.password,
                    last_login: lastLogin,
                    status : 'active',
                    role_id: 'user',
                    created_at : lastLogin
                });
                nouveau.save(function(err,resp){
                    if(err){
                        console.log("problème creation acount in the BD ");
                        console.error();
                        return res.status(400).send({
                            message: err
                          });
                    } else{
                        console.log("a new acount is created in the BD ", resp);
                        cb(resp,true);
                    }
                });
            } else {
                console.log("this mail was used before to register "+compte.email)      
                cb(count, false);
            }
        })
    },
    createAccount : function(compte, cb){
        var lastLogin = (new Date()).toISOString();
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
                    password : compte.password,
                    last_login: lastLogin,
                    status : compte.status,
                    role_id: compte.role_id,
                    created_at : lastLogin
                });
                nouveau.save(function(err,resp){
                    if(err){
                        console.log("problème creation acount in the BD ");
                        console.error();
                    } else{
                        console.log("a new acount is created in the BD ");
                        console.log('here', resp);
                        
                        cb(resp,true);
                    }
                });
            } else {
                console.log("this mail was used before to register "+compte.email)      
                cb(count, false);
            }
        })
    },
    update: function(account, cb){
        AccountModel.findByIdAndUpdate(account._id, account,{new: true}, function(err, updatedAcc){
            if(err){
                throw err;
            }else{
                cb(updatedAcc);
            }
        });
    },
    findById: function(id, cb){
        AccountModel.findById(id, function(err, account){
            if(err){
                cb(err, null)
            }
            else{
                cb(null, account)
            }
        })
    },
    findByEmail: function (email, cb){
        AccountModel.findOne({email: email}, function (err, account){
            if(err){
                cb(err, null)
            }
            else {
                cb(null, account)
            }
        })
    },
    getAllUsers: function(cb){
        AccountModel.find({}, function(err, users){
            if(err){
                throw err;
            }
            else {
                cb(users)
            }
        })
    }
};
