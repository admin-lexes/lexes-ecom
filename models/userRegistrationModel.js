import mongoose from "mongoose"

// Defining UserRegistration Schema

const userRegistrationSchema = new mongoose.Schema(
    {
        name:{type:String, required:true, trim:true},
        email:{type:String, required:true, trim:true},
        password:{type:String, required:true, trim:true },
        mobile:{type:String, required:true, trim:true},
        otp:{type:String,trim:true},
        user_type:{type:String, required:true,trim:true, enum:["Admin","User"], default:"User"},
        is_verified:{type:Number, status_code:[1,0], default:0},
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

