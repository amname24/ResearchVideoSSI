var mongoose = require("mongoose");
var uuidv4 = require("uuid/v4");
// var bcrypt = require("bcrypt");


var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/video', function (err) {
    if (err) {
        throw err;
    } else {
        console.log('Mongo Video Database : connected');
    }
});

var VideoSchema = Schema({
    _id : String,
    name : String,
    video_id : String,
    thumbnailUrl: String,
    description: String,
    site :String
});
var HistorySchema = Schema({
    _id : String,
    date_watched : String,
    video_id : String,
    user_id: String
});
var PlayListSchema = Schema({
    _id : String,
    name : String,
    date_created: String,
    video_id : String,
    user_id: String
});

var VideoModel = mongoose.model('videos', VideoSchema);
var HistoryModel = mongoose.model('histories', HistorySchema);
var PlayListModel = mongoose.model('playlistes', PlayListSchema);


module.exports = {
    addVideo : function (video, cb) {
        VideoModel.count({
            name : video.name,
            video_id : video.video_id,
            thumbnailUrl: video.thumbnailUrl,
            description: video.description,
            site :video.site
        }, function (err, count) {
            if (err) {    
                console.error();
            } else if (count == 0) {
                var nouveau = new  VideoModel({
                    _id : video._id,
                    name : video.name,
                    video_id : video.video_id,
                    thumbnailUrl: video.thumbnailUrl,
                    description: video.description,
                    site :video.site
                });
                nouveau.save(function(err,resp){
                    if(err){
                        console.log("problème creation video in the BD ");
                        console.error();
                    } else{
                        console.log("a new video is created in the BD ");
                        cb(resp,true);
                    }
                });
            }
            else{
                VideoModel.findOne({
                    name : video.name,
                    video_id : video.video_id,
                    thumbnailUrl: video.thumbnailUrl,
                    description: video.description,
                    site :video.site
                }, function (err, resp) {
                    if(err){
                        console.log("problem get video from the BD ");
                        console.error();
                    } else{
                        console.log("get video from BD ");
                        cb(resp,true);
                    }
                })               
            }
        })
    },
    addHistory : function (history, cb) {

        
        var lastWatched = (new Date()).toISOString();
        var nouveau = new  HistoryModel({
            _id : history._id,
            user_id:history.user_id,
            video_id : history.video_id,
            date_watched : lastWatched,
        });
        nouveau.save(function(err,resp){
            if(err){
                console.log("problème creation history in the BD ");
                console.error();
            } else{
                console.log("a new history is created in the BD ");
                cb(resp,true);
            }
        });
    },
    addPlayList : function (playlist, cb) {
        var dateCreated = (new Date()).toISOString();
        var nouveau = new  PlayListModel({
            _id : playlist._id,
            user_id:playlist.user_id,
            name : playlist.name,
            video_id : playlist.video_id,
            date_created:  dateCreated
        });
        nouveau.save(function(err,resp){
            if(err){
                console.log("problème creation playlist in the BD ");
                console.error();
            } else{
                console.log("a new playlist is created in the BD ");
                cb(resp,true);
            }
        });
    },

};