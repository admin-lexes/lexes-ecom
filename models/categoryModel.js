import mongoose from 'mongoose';

// Defining Scema
const catagorySchema = new mongoose.Schema(
{
    catname:{type:String, required:true, trim:true},
    type:{type:Number, required:true, enum:[1,2,3]},
    referenceID:{
        type:mongoose.Types.ObjectId,
        ref: "CategoryProduct"
    },
},
{
    timestamps:true
}


)


// Model
const CategoryModel = new mongoose.model("CategoryProduct",catagorySchema)

export default CategoryModel