import mongoose from "mongoose"

// Defining Schema

const productSchema = new mongoose.Schema(
    {
        title:{type:String, required:true, trim:true},
        category1:{type:mongoose.Types.ObjectId, ref: "category"},
        category2:{type:mongoose.Types.ObjectId, ref: "category"},
        category3:{type:mongoose.Types.ObjectId, ref: "category"},
        price:{type:mongoose.Types.Decimal128,set:v=>{return new mongoose.Types.Decimal128(v.toFixed(2));},required:true,trim:true},
        mrp:{type:mongoose.Types.Decimal128,set:v=>{return new mongoose.Types.Decimal128(v.toFixed(2));},required:true,trim:true},
        quantity:{type:Number, required:true},
        images:{data: Buffer, contentType: Array},
        size:{type:String, required:true, trim:true},
        description:{type:String, required:true, trim:true},
        thumbnail: { data: Buffer, contentType: String },
        CreatedBy:{type:mongoose.Types.ObjectId, ref:"user"},
        UpdatedBy:{type:mongoose.Types.ObjectId, ref:"user"},

    },
    {
        timestamps:true
    }
)

const ProductModel = new mongoose.model("product",productSchema)

export default ProductModel