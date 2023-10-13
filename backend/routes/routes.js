let express = require('express');
let authController = require('../routes functions/register_login_controller');
let watchlistController = require('../routes functions/watchlist_controller');
let cryptoBoughtController = require('../routes functions/cryptoBought_controller');
let uploadImageController = require('../routes functions/uploadedImage');
let router = express.Router();
let path = require('path');
let multer = require('multer');

//Multer configuration for file uploads
let storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, 'images/')
    },
    filename:(req, file, cb)=>{
        let fileSuffix = Date.now() + Math.round(Math.random()*1E9);
        let fileExt = path.extname(file.originalname);
        cb(null, fileSuffix+fileExt);
        let fullName= fileSuffix+fileExt;
        console.log(`generatedfull name${fullName}`)
        req.generatedFileName = fullName;
    }
});

let upload = multer({storage:storage});


//register route
router.post('/register', authController.register);
//
router.get('/verify/:token', authController.verifyEmail);
//Login route
router.post('/login', authController.login);
//upload image route
router.post('/uploadimage/:userId',  upload.single('pro-image'),uploadImageController.storeUploadedImage);
//fetch profile image to frontend
router.get('/fetchProImg/:userId', uploadImageController.sendProImg)
//watchlist 
router.post('/watchlist', watchlistController.watchListFunction);
//Get watchlist data
router.get('/getwatchlistdata', watchlistController.watchListGetData);
//update watchlist
router.put('/updatewatchlist', watchlistController.updateWatchList);
//Buy Crypto API
router.post('/buycrypto', cryptoBoughtController.saveCrypto);
//Change password
router.post('/changepassword', authController.changePass);
//fetch crypto balance
router.get('/purchasedcrypto/:id', cryptoBoughtController.fetchPurchasedCrypto);
//delete user account
router.delete('/deleteaccount', authController.processAccountDeletion);

module.exports = router;