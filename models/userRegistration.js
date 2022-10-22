import mongoose from "mongoose"

// Defining UserRagistration Schema

const userRagistrationSchema = new mongoose.Schema(
    {
        name:{type:String, required:true, trim:true},
        email:{type:String, required:true, trim:true},
        password:{type:String, required:true, trim:true },
        mobile:{type:String, required:true, trim:true},
        createdby:{type:mongoose.Types.ObjectId, ref:"user"},
        updatedby:{type:mongoose.Types.ObjectId, ref:"user"},
    },
    {
        timestamps:true
    }
)

// Compiling Schema
const UserRagistrationModel =  mongoose.model('user', userRagistrationSchema)

export default UserRagistrationModel

