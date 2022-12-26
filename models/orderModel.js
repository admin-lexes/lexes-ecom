import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userID:{type:mongoose.Types.ObjectId, ref:"user"},
        address:{type:String, require:true},
        orderList:[{
            productID:{type:mongoose.Types.ObjectId, ref:"cart", required:true},
            productPrice:{type:Number, required: true, trim: true },
            productQuantity:{type:Number, required:true}
         }],
        // cartProduct:{type:mongoose.Types.ObjectId, ref:"cart", require:true},
        totalPrice:{type:Number, require:true},
        orderstatus:{type:String, payment_status:["Success","Failed","Pending","Cancel"], default:"Pending", require:true},
        createdBy:{type:mongoose.Types.ObjectId, ref:"user"},
        updatedBy:{type:mongoose.Types.ObjectId, ref:"user"},
    },
    {
        timestamps:true
    }
);

const orderModel = mongoose.model("order",orderSchema)
export default orderModel;