var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuidv4 = require('uuid/v4');

mongoose.connect('mongodb://localhost:27017/researchvideo',function(err){
    if(err) {throw err; } else{
        console.log('mongo connected');
    }
});
var LoginSchema = Schema({
    _id : String,
    name : String,
    email : String,
    password : String,
});
const LoginModel  = mongoose.model('comptes',LoginSchema);
module.exports = {
    ajouterCompte : function(compte, cb){
        var nouveau = new  LoginModel({
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
}
