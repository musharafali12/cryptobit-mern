let cryptoBought = require('../models/cryptoBought');

let cryptoBoughtController = {
    async saveCrypto(req, resp, next){
        let {userId, cryptoName, crypto, imgUrl} = req.body;
        try {
            let saveCrypto = new cryptoBought({userId:userId, cryptoName:cryptoName, crypto:crypto, imgUrl:imgUrl});
            saveCrypto = await saveCrypto.save();
            resp.status(200).json({"Crypto amount saved":saveCrypto})
        } catch (error) {
            return next(error);
        }
    },

    async fetchPurchasedCrypto(req, resp, next){
        let userId = req.params.id;
        try {
            let findPurchasedCrypto = await cryptoBought.find({userId:userId});
            if(findPurchasedCrypto && findPurchasedCrypto.length > 0){
                resp.status(200).json(findPurchasedCrypto);
            } else{
                // console.log()
                resp.status(404).json({message:"You don't have any coin currently"});
            }
        } catch (error) {
            return next(error);
        }
    }
}


module.exports = cryptoBoughtController;