let joi = require('joi');
let bcrypt = require('bcrypt');
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
let User = require('../models/User');
let Token = require('../models/token');
let UserDTO = require('../DTOs/UserDTO');
let jwt = require('jsonwebtoken');
let { VERIFICATION_KEY } = require('../config env/index');
let secretKey = '0e07a9614026595f9be1e306ef017c57874af8d43d8c13775a500d555f03e4da';
let nodemailer = require('nodemailer');
const watchListModel = require('../models/Watchlist');
const cryptoBoughtModel = require('../models/cryptoBought');


let authController = {
    async register(req, resp, next){
        // 1.Validate user data

        let  validateRegister = joi.object({
            username: joi.string().min(5).max(10).required(),
            name: joi.string().min(8).max(15).required(),
            email: joi.string().email().required(),
            password:joi.string().pattern(passwordPattern).required(),
            confirmpassword:joi.ref("password"),
        });

        let {error} = validateRegister.validate(req.body);

        if(error){
            return next(error);
        }

        //2.Check whether username or email exists
        let { username, name, email, password } = req.body;

        try {
            let isUserNameExists = await User.exists({username:username});
            let isEmailExists = await User.exists({email:email});

            if(isUserNameExists){
                let error = {
                    status:409,
                    message:"Username  already exists"
                }
                return next(error)
            }

            if(isEmailExists){
                let error = {
                    status:409,
                    message:"Email  already exists"
                }
                return next(error)
            }

        } catch (error) {
            return next(error)
        }

        //3. Hash Password
        let saltRounds = 10;
        let salt = await bcrypt.genSalt(saltRounds);
        let hashedPassword = await bcrypt.hash(password, salt);
        //4. store data in database
        let isVerified = false;
        let user
        try {
            let userToRegister = new User({
                username,
                name,
                email,
                password:hashedPassword,
                isVerified,
            })

            user = await userToRegister.save();
            //generate verification token
            let verificationString = jwt.sign(
                {email:user.email},
                secretKey,
                {expiresIn:'1d'}
            )

            //store token in database

            try {
                let storeToken = new Token({userId:user._id, token:verificationString, isVerified:false});
                storeToken = await storeToken.save();
                console.log(storeToken)
            } catch (error) {
                return next(error);
            }

            //Create verification url
            const verificationUrl = `http://localhost:3000/verify/${verificationString}`;

            //send the verification mail
            let transporter = nodemailer.createTransport({
                service:'Gmail',
                auth:{
                    'user':'musharafali274@gmail.com',
                    pass:'fcilmfyqeamaujeo'
                }
            });

            let mailDetails = {
                from:'musharafali274@gmail.com',
                to:user.email,
                subject:'CryptoBit Account Verification',
                html:`To verify your email address, Click: <a href = "${verificationUrl}">Verify Now</a>`
            }

            await transporter.sendMail(mailDetails);

        } catch (error) {
            return next(error);
        }

        
        //send response
        resp.status(200).json({message:'Early registration completed. Check Your mail to verify your email now and fully activate your CryptoBit account', isVerified});

    },

    async verifyEmail(req, resp, next){
        try {
            let verification_token = req.params.token;

            let findToken = await Token.findOne({token:verification_token});

            if(findToken.isVerified === true){
                // await Token.updateOne({token:verification_token},{isVerified:true})
                return resp.json({message:'You have already verified your account'})
            };
          
        //verify token
        let verifiedToken = jwt.verify(verification_token, secretKey );
        
        let user = await User.findOneAndUpdate({email:verifiedToken.email}, {isVerified:true},{new:true});
        await Token.updateOne({token:verification_token},{isVerified:true});
        console.log(`after verification the user is:${user}`)
        let userDto = new UserDTO(user);
        
        resp.status(201).json({
            user:userDto,
            auth:true,
            message:'Your Email Address has been verified.',
        });
        
        } catch (error) {
            return next(error);
        }
    },


    async login(req, resp, next){
       // 1. Validate user Data
       let ValidateLogin = joi.object({
        username:joi.string().min(5).max(10),
        password:joi.string().pattern(passwordPattern).required(),
       });

       let {error} = ValidateLogin.validate(req.body);

       if(error){
        return next(error);
       }

       //2. Find user in database
       let {username, password} = req.body;

       let user = await User.findOne({username:username});

       if(!user){
        let error = {
            status:401,
            message:"Invalid Username",
        }
        return next(error);
       };

       let IsPasswordMatched = await bcrypt.compare(password, user.password);

       if(!IsPasswordMatched){
        let error = {
            status: 401,
            message:"Invalid Password"
        }

        return next(error);

       }

       let userDto = new UserDTO(user);
       resp.status(200).json({user:userDto, auth:true})


    },

    async changePass(req, resp, next){
        let { userId ,password, newPassword } = req.body;
        try {
            let user = await User.findById(userId);
            if(!user){
                resp.status(404).json({"message":"User not found"});
            }

            let IsPasswordExists =await bcrypt.compare(password, user.password);

            if(!IsPasswordExists){
                resp.status(404).json({"message":"Old password is incorrect"});
            }

            //hash new password and update the old password
            let salt = await bcrypt.genSalt(10);
            let hashedNewPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedNewPassword;
            await user.save();
            resp.status(200).json({message:"Password successfully updated"})

        } catch (error) {
            return next(error);
        }
    },

    async processAccountDeletion(req, resp, next){
        let {userId} = req.body;
        try {
            let findAndDeleteUser = await User.deleteOne({_id:userId});
            let findAndDeleteWatchlist = await watchListModel.deleteMany({userId:userId});
            let findAndDeleteCrypto = await cryptoBoughtModel.deleteMany({userId:userId});
            if(findAndDeleteUser && findAndDeleteWatchlist && findAndDeleteCrypto){
                resp.status(200).json({message:`${userId} account deleted successfully`});
            } else{
                error = {
                    message:'There was an error deleting your account'
                }
                return next(error);
            }
        } catch (error) {
            return next(error);
        }
    }

};


module.exports = authController;
