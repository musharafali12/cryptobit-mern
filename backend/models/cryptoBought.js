let mongoose  = require('mongoose');


let cryptoBoughtSchema = new mongoose.Schema({
    userId:{type:String, required:true},
    cryptoName:{type:String, required:true},
    imgUrl:{type:String, required:true},
    crypto:{type:String, required:true}
},
{timestamps:true}
);

let cryptoBoughtModel = mongoose.model('cryptoBoughtData', cryptoBoughtSchema);

module.exports = cryptoBoughtModel;