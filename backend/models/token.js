let mongoose = require('mongoose');

let tokenSchema = new mongoose.Schema({
    userId:{type:String, required:true},
    token:{type:String, required:true},
    isVerified:{type:Boolean, default:false}
});


let model = mongoose.model('token', tokenSchema);


module.exports = model;