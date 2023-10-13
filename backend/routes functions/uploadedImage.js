const path = require('path');
let imgModel = require('../models/imageModel');
let fs = require('fs');

let uploadImageController = {
    async storeUploadedImage(req, resp, next){

        if(!req.file){
            return resp.status(400).json({message:'No file uploaded'});
        }
        let {userId} = req.params;



        try {
            let generatedFileName =req.generatedFileName;
            //check if user has already saved a profile pic
            let isProfileExists = await imgModel.findOne({userId:userId});
            if(isProfileExists){
                let updateProfile = await imgModel.findOneAndUpdate({userId:userId},{fileName:req.file.originalname, userId:userId, generatedImgName:generatedFileName});
                resp.status(200).json({imgDetails:updateProfile, message:'File updated'});
                console.log(generatedFileName)
            }else{
                let saveImg = new imgModel({fileName:req.file.originalname, userId:userId, generatedImgName:generatedFileName});
            saveImg = await saveImg.save();
            resp.status(200).json({imgDetails:saveImg, message:'File uploaded'});
            console.log(saveImg);
            }
        } catch (error) {
            console.log(error)
            resp.status(500).json({message:'Error in uploading image'})
        }
        // if(!req.file){
        //     return resp.status(400).json({message:'No file uploaded'});
        // } else{
        //     resp.status(200).json({message:'File uploaded'});
        // }
    },

    async sendProImg(req, resp, next){
        let imageDirectory = path.join(__dirname, 'images');
        let {userId} = req.params;
        try {
            let findImageName = await imgModel.findOne({userId:userId});
            if(findImageName){
                resp.status(200).json({imageUrl:findImageName})
            }
        } catch (error) {
            console.log(error)
        }
    }
}


module.exports = uploadImageController;