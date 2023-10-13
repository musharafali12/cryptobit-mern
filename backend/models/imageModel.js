let mongoose = require('mongoose');

let imgSchema = new mongoose.Schema({
    userId:String,
    fileName:String,
    generatedImgName:String,
});

let imgModel = mongoose.model('images', imgSchema);


module.exports = imgModel;