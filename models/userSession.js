import mongoose from "mongoose";

const userSessionSchema = new mongoose.Schema(
    {
    userID:{type:mongoose.Types.ObjectId, ref:"user"},
    status:{type:Number, status_code:[1,0], default:1}
},
{
    timestamps:true
}
)

const userSessionModel = mongoose.model('userSession', userSessionSchema)

export default userSessionModel