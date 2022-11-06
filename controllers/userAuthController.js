import dotenv from 'dotenv'
dotenv.config()
import UserRegistrationModel from "../models/userRegistration.js";
import bcrypt from "bcrypt";
import userSessionModel from "../models/userSession.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

class Authentication {   
  static sendEmail = async (name, email, otp) => {
    console.log("name", name, "email", email);
    const Transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTSL: true,
      auth: {
        user: "ashish@lexeslab.com",
        pass: process.env.smtp_pass 
      },
    });
    const mailOptions = {
      from: "ashish@lexeslab.com",
      to: email,
      subject: "Registerd Email Verification",
      html: `<p>Hi <b>${name}</b> Enter <b>${otp}</b> in the app to verify your email address and complete<p/>`,
    };    
    Transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent", info.response);
      }
    });
  };

  static otpVerification = async (req,res)=>{
    try { 
      const {otp_user, id } = req.body 
      if (id != null) {
        
        const userotp = await UserRegistrationModel.findById({_id:id}).select('otp')
      // console.log('otp_user',otp_user);
      // console.log('id',id); 
      console.log("userotp",userotp);
      if (userotp && otp_user == userotp.otp) {    
        const isverify = await UserRegistrationModel.findOneAndUpdate(
          {_id:id},{$set:{is_verified:1}});
        console.log('isverify',isverify.is_verified);
        if (isverify != null) {
          res.status(201).send({ status: "Verified", massage: "Email Verification Successed"});
          const blanckOtp = await UserRegistrationModel.findOneAndUpdate(
            {_id:id},{$unset:{otp:1}});
          console.log('blanckOtp',blanckOtp);
        } 
        else {
          res.status(404).send({ status: "Failed", massage: "unauthorized"});
        }     
      } else {
        res.status(404).send({ status: "Failed", massage: "OTP Expired"});
      }
      }
    }catch(error){
          res.status(500).json({error:error.message});
        }
      }

  static userRegistration = async (req, res) => {
    try {
      const { name, email, password, mobile } = req.body;
      const otp = Math.floor(1000 + Math.random() * 9000);
      Authentication.sendEmail(name, email, otp)
      const result = await UserRegistrationModel.find({ email: email });
      if (result.length) {
        // console.log("result.length", result)
        return res.status(400).send({ message: "User already exits" });
      }
      const hashPassword = await bcrypt.hash(password, 12);
      const Doc = new UserRegistrationModel({
        name: name,
        email: email,
        password: hashPassword,
        mobile: mobile,
        otp:otp 
      });

    //   call sendEmail function
      if (Doc) {
        const Result = await Doc.save();
      // console.log("Result",Result);
        res.status(201).send({message:"New User Create"})  
      }

    } catch (error) {
      console.log(error);
    }
  };

  static userLogin = async (req, res) => {
    try {
      const { email, password, repassword } = req.body;

      if (email && password && repassword) {
        // console.log("email && password",email , password)
        const user = await UserRegistrationModel.findOne({ email: email });
        // console.log("user",user)
        if (user != null) {
          // console.log("user....",user.password)
          // console.log("user.password....",user.password)
          const isCheck = await bcrypt.compare(password, user.password);
          const isReCheck = await bcrypt.compare(repassword, user.password);
          console.log("isReCheck", isReCheck);
          if (user.email == email && (isCheck == true) & (isReCheck == true)) {
            console.log("user._id", user._id);
            // console.log("userID",userID)
            const sessionFlag = userSessionModel.updateMany(
              { userID: user._id, status: 1 },
              { status: 0 }
            );

            const userObj = await userSessionModel.create({
              userID: user._id,
              status: 1,
            });

            const token = jwt.sign(
              {
                userID: user._id,
                sessionId: userObj._id,
                userType: user.user_type,
              },
              process.env.jwt_key,
              { expiresIn: "3d" }
            );
            res.send({
              status: "success",
              massage: "Login successfully !!",
              token: token,
            });
          } else {
            res
              .status(401)
              .send({ status: "Faild", massage: "Email Password Not Matched" });
          }
        } else {
          res
            .status(401)
            .send({ status: "Faild", massage: "Email Password Not Matched" });
        }
      } else {
        res
          .status(404)
          .send({ status: "Failed", massage: "All field are Required !!" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  static userLogout = async (req, res) => {
    try {
      // console.log({ "what is inside": req.sessionId})
      // console.log({"userid":req.userID})

      const logout = await userSessionModel.updateMany(
        { userID: req.userID, status: 1 },
        { status: 0 }
      );
      console.log("logout", logout);
      res
        .status(201)
        .send({ status: "success", massage: "logout successfully !!" });
    } catch (error) {
      console.log(error);
    }
  };

    static userProfile = async(req,res)=>{
        try{
        //    const user = await UserRegistrationModel.findById({_id:req.userID});
        //    const {name,email,mobile}=user;
           const {lastName,gender,manageAdress,panCardInformation}=req.body;
           const userProfileRecord = new UserRegistrationModel({
                lastName,  
                gender,
              accountSetting:{
              manageAdress,
              panCardInformation
              }
           });
           if(userProfileRecord){
              await userProfileRecord.updateOne({_id:req.userID});
              res.status(200).json({"profile":userProfileRecord, message:"successfull added profile"})
        }else{
            res.status(204).json({message:"not Edit Please Check"})
        }

        }
        catch(error){
        res.status(500).json({error:error.message})
        }
    }

  }
export default Authentication;
