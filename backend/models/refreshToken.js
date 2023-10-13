let mongoose = require('mongoose');

let refreshTokenSchema = new mongoose.Schema({
    userId:{type:String, required:true},
    refreshToken:{type:String, required:true}
});


let model = mongoose.model('refreshTokens', refreshTokenSchema);

module.exports = model;