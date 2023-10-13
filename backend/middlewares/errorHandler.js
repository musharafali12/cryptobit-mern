let {ValidationError} = require('joi');

let errorHandler = (error, req, resp, next) =>{
    let status = 500;
    let data = {
        message:'Internal server error'
    };

    //code handling validation error only
    if(error instanceof ValidationError){
        status = 401;
        data.message = error.message;

        return resp.status(status).json(data);
    }

    //code handling general errors
    if(error.status){
        status = error.status;
    }

    if(error.message){
        data.message = error.message;
    }

    resp.status(status).json(data);

};


module.exports = errorHandler;