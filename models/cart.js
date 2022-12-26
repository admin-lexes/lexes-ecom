import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({

//         productID:{type:mongoose.Types.ObjectId, ref:"product"},
//         productPrice:{type: mongoose.Types.Decimal128, set: v => { return new mongoose.Types.Decimal128(v.toFixed(2))}, required: true, trim: true },


// })

const cartSchema = new mongoose.Schema(
    {
        userID:{type:mongoose.Types.ObjectId, ref:"user"},
        cartlist:[{
            productID:{type:mongoose.Types.ObjectId, ref:"product", required:true},
            productPrice:{type:Number, required: true, trim: true },
            productQuantity:{type:Number, required:true}
         }],
        // cartlist:[productSchema],
        
        
        updatedBy:{type:mongoose.Types.ObjectId, ref:"user"},
    }
)

// console.log("cartSchema",cartSchema.path('cartlist'))

const cartModel = mongoose.model("cart",cartSchema)
export default cartModel