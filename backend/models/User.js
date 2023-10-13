let mongoose = require('mongoose');



let userSchema = new mongoose.Schema({
    username:{type:String, required:true},
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    isVerified:{type:Boolean}
},
    {timestamps:true}
)


let User = mongoose.model('users', userSchema);

module.exports = User;