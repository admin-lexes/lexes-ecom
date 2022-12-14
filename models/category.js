import mongoose from 'mongoose';

// Defining Scema
const catagorySchema = new mongoose.Schema(
{
    cateName:{type:String, required:true, trim:true},
    slug:{type:String,required:true,unique:true},
    type:{type:Number, required:true, enum:[1,2,3]},
    Parent_referenceID:{
        type:mongoose.Types.ObjectId,
        ref: "category"
    },
    CreatedBy:{type:mongoose.Types.ObjectId, ref:"user"},
    UpdatedBy:{type:mongoose.Types.ObjectId, ref:"user"},

},
{
    timestamps:true
}


)


// Model
const CategoryModel = new mongoose.model("category",catagorySchema)

export default CategoryModel