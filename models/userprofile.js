import mongoose from "mongoose";

const userProfile = new mongoose.Schema({
  personalInformation:{
    firstName:{type:String,trim:true},
    lastName:{type:String,trim:true}  

  }
  ,
  gender:{type:String,trim:true,enum:["Male","Female"]},
  emailAdress:{type:String,trim:true},
  mobileNo:{type:String,trim:true},
  accountSetting:{
  manageAdress:{type:String,trim:true},
    panCardInformation:{type:String,trim:true}
  },
//   myOrder:{},
//   payment:{},
//   myStuff:{}
});
const userProfileModel = mongoose.model('userProfile',userProfile);
export default userProfileModel;