let mongoose = require('mongoose');
let {MONGODB_CONNCEC_STRING} = require('../config env/index');



let dbConnec = async () =>{
    try {
        let connec = await mongoose.connect(MONGODB_CONNCEC_STRING);
        console.log(`Database connected at: ${connec.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error}`);
    }

};


module.exports = dbConnec;