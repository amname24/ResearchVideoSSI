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
