let mongoose = require('mongoose');


let watchListSchema = new mongoose.Schema({
    userId:{type:String, required:true},
    market_cap_rank:{type:String, required:true},
    id:{type:String, required:true},
    symbol:{type:String, required:true},
    name:{type:String, required:true},
    image:{type:String, required:true},
    current_price:{type:String, required:true},
    price_change_percentage_24h:{type:String, required:true},
    market_cap:{type:String, required:true}
});

let watchListModel = mongoose.model('watchlist', watchListSchema);

module.exports = watchListModel;
