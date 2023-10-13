const watchListModel = require('../models/Watchlist');
let Watchlist = require('../models/Watchlist');

let watchlistController = {
    async watchListFunction(req, resp, next){
        //check if item is already added in the watchlist
        let {userId,symbol} = req.body;
        try {
            let query = {$and:[{userId:userId},{symbol:symbol}]};
            let isItemExists = await Watchlist.find(query);
            if(isItemExists && isItemExists.length > 0){
                let error = {
                    status:409,
                    message:"You already have added this item."
                }

                return next(error);
            }
        } catch (error) {
            return next(error);
        }

        //save item in database
        try {
            let watchListItem = new Watchlist(req.body);
            let saveWatchListItem = await watchListItem.save();
            resp.json(saveWatchListItem);
        } catch (error) {
            resp.json(error);
        }
    },

    async watchListGetData(req, resp, next){
        let userId = req.query.userId;
        try {
            let watchlistData =await  Watchlist.find({userId:userId});
            resp.json(watchlistData);
        } catch (error) {
            resp.json(error);
        }
    },

    async updateWatchList(req, resp, next){
        let updatedData = req.body;
        console.log(updatedData);
        try {
            let updateData = updatedData.map(async(item)=> {
                let result = await Watchlist.updateMany(
                    {symbol:item.symbol},
                    {$set:item},
                    {multi:true}
                );
                return result;
            });
        // let result = await Watchlist.updateMany(
        //     {symbol:{$in:symbolsToUpdate}},
        //     {$set:{id, symbol, name, image, current_price, price_change_percentage_24h, market_cap}},
        //     {multi:true}
        // );
        // console.log(result)

        resp.json({message:'Data updated successfully', updateData});

        } catch (error) {
            resp.json(error)
        }
    }
}

module.exports = watchlistController;