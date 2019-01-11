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
    user_id: String
});
var PlayListVideoSchema = Schema({
    _id : String,
    playlist_id : String,
    video_id : String,
    date_created: String,
});

var VideoModel = mongoose.model('videos', VideoSchema);
var HistoryModel = mongoose.model('histories', HistorySchema);
var PlayListModel = mongoose.model('playlistes', PlayListSchema);
var PlayListVideoModel = mongoose.model('playlistsVideos',PlayListVideoSchema);

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
        PlayListModel.count({user_id : playlist.user_id,
            name : playlist.name},function(err,count){
                if(err)
                    console.error();
                else if (count==0){
                    var dateCreated = (new Date()).toISOString();
                    var nouveau = new  PlayListModel({
                        _id : playlist._id,
                        user_id : playlist.user_id,
                        name : playlist.name,
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
                }
                else {
                    cb(true);
                }
            }

        )
    },
    deletePlayList : function (playlist, cb) {
        PlayListVideoModel.remove({playlist_id:playlist._id},function(err){
            if(err){
                console.log("problème suppression playlist in the BD ");
                console.error();
            }
            else {
                PlayListModel.deleteOne({
                    _id : playlist._id,
                    user_id : playlist.user_id,
                    name : playlist.name,
                    date_created:  playlist.date_created
                },function(err){
                    if(err){
                        console.log("problème suppression playlist in the BD ");
                        console.error();
                        cb(playlist,false);
                    } else{
                        console.log("playlist deleted in the BD : "+JSON.stringify(playlist));
                        cb(playlist,true);
                    }
                });
            }
        })
    },
    addVideoToPlayList : function (playlistVideo, cb) {
        //a ajouter verif si name is in BD
        var date_created = (new Date()).toISOString();
        var nouveau = new  PlayListVideoModel({
            _id : playlistVideo._id,
            playlist_id: playlistVideo.playlist_id,
            video_id:  playlistVideo.video_id,
            date_created : date_created
        });
        nouveau.save(function(err,resp){
            if(err){
                console.log("problème ajout videoplaylist in the BD ");
                console.error();
            } else{
                console.log("video is added to playlist in the BD ");
                cb(resp,true);
            }
        });
    },
    findAllHistory : function(user_id,cb){
        HistoryModel.find({user_id:user_id}, function(err, histories) {
            if(err){
                console.log("problem while getting Histories");
                cb(false);
            }
            else 
                cb(true,histories);  
          });
    },
    findAllPlaylists: function(user_id,cb){
        PlayListModel.find({user_id:user_id}, function(err, playlists) {
            if(err){
                console.log("problem while getting playlists");
                cb(false);
            }
            else 
                cb(true,playlists);  
          });
    },
    findAllVideosHistory : function(user_id,cb){
        HistoryModel.find({user_id:user_id}, function(err, histories) {
            if(err){
                console.log("problem while getting Histories");
                cb(false);
            }
            else 
            {
                var videos = [];
                histories.forEach(function(history) {
                    VideoModel.findOne({_id:history.video_id},function(err,video){
                        if(err)
                            console.log("this video not found"+err);
                        else {
                            var videoHistory = {
                                date_watched : history.date_watched,
                                video : video
                            }
                            videos.push(videoHistory)
                            if (videos.length === histories.length) {
                                // we are done! :D
                                console.log(videos);
                                cb(true,videos)
                            }
                        }
                    })
                })
            }
          });
    },
    findAllvideosOfPlaylist : function(playlist_id,cb){
        PlayListVideoModel.find({playlist_id:playlist_id}, function(err, playlistvideos) {
            if(err){
                console.log("problem while getting Playlistesvideos");
                cb(false);
            }
            else 
            {
                var videos = [];
                playlistvideos.forEach(function(playlistvideo) {
                    VideoModel.findOne({_id:playlistvideo.video_id},function(err,video){
                        if(err)
                            console.log("this video not found"+err);
                        else {
                            videos.push(video)
                            if (videos.length === playlistvideos.length) {
                                // we are done! :D
                                console.log(videos);
                                cb(true,videos)
                            }
                        }
                    })
                })
            }
          });
    }

};