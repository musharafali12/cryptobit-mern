let  jwt = require('jsonwebtoken');
let {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = require('../config env/index');
let RefreshTokenModel = require('../models/refreshToken');

class jwtService{
    static genAccesToken(payload, expiryTime){
        return jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn:expiryTime})
    }

    static genRefreshToken(payload, expiryTime){
        return jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn:expiryTime});
    }

    static verifyAccessToken(token){
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    }

    static verifyRefreshToken(token){
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    }
    

    static async storeRefreshToken(token, userId){
        try {
            let refreshTokenInstance = new RefreshTokenModel({userId, token});
            let storedInDataBase = await refreshTokenInstance.save();
        } catch (error) {
            console.log(error);
        }
    }
};


module.exports = jwtService;