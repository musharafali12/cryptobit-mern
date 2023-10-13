let dotenv = require('dotenv').config();
let PORT = process.env.PORT;
let MONGODB_CONNCEC_STRING = process.env.MONGODB_CONNCEC_STRING;
let ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
let REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
let VERIFICATION_KEY = process.env.VERIFICATION_KEY;

if (!process.env.VERIFICATION_KEY) {
    throw new Error('VERIFICATION_KEY is not set in the .env file');
}


module.exports = {
    PORT,
    MONGODB_CONNCEC_STRING,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    VERIFICATION_KEY,
};