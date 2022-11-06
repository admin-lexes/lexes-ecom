import mongoose from "mongoose"

// Defining UserRegistration Schema

const userRegistrationSchema = new mongoose.Schema(
    {
        name:{type:String, required:true, trim:true,index:true,unique:true,lowercase:true},
        lastName:{type:String,trim:true}, 
        gender:{type:String,trim:true,enum:["Male","Female"]},
        email:{type:String, required:true, trim:true,unique:true,lowercase:true},
        password:{type:String, required:true, trim:true },
        mobile:{type:String, required:true, trim:true},
        otp:{type:String,trim:true},
        user_type:{type:String, required:true,trim:true, enum:["Admin","User"], default:"User"},
        is_verified:{type:Number, status_code:[1,0], default:0},
        accountSetting:{
            manageAdress:{type:String,trim:true},
              panCardInformation:{type:String,trim:true}
            },
        createdby:{type:mongoose.Types.ObjectId, ref:"user"},
        updatedby:{type:mongoose.Types.ObjectId, ref:"user"},
    },
    {
        timestamps:true
    }
)

// Compiling Schema
const UserRegistrationModel =  mongoose.model('user', userRegistrationSchema)

export default UserRegistrationModel

