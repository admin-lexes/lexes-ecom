import mongoose from 'mongoose';
import slugify from 'slugify';
import CategoryModel from '../models/category.js';


function fetchCate(categories, Parent_referenceID = null) {
    //console.log(categories);
    //console.log("parentrefID",Parent_referenceID);
    const categoryList = [];
    let category;
    if (Parent_referenceID == null) { 
         category = categories.filter( (cat) => cat.Parent_referenceID == undefined);
        // console.log("categoryif",category);
    } else {
       // console.log("parentrefID",Parent_referenceID);
        category = categories.filter( (cat) => {
            return String(cat.Parent_referenceID) === String(Parent_referenceID)
            console.log((String(cat.Parent_referenceID) === String(Parent_referenceID)));
        }
            );
      console.log("catElseBlock",category);
    }
   
    for (let catItem of category) {
       // console.log(catItem);
        categoryList.push({
            _id: catItem._id,
            cateName: catItem.cateName,
            slug: catItem.slug,
            type:catItem.type,
            childrenCategory: fetchCate(categories, catItem._id),
        })
    }
    return categoryList;
}

class CategoryController {

    // create Category
    static createCategory = async (req, res) => {
        try {
            const { cateName, type } = req.body;
            console.log(cateName, type);
            let cat = {};
            if (cateName && type) {

                cat = {
                    cateName: cateName,
                    slug: slugify(cateName),
                    type: type
                }
                if (req.body.Parent_referenceID) {
                    cat.Parent_referenceID = req.body.Parent_referenceID;
                }
                console.log(cat);
                const category = new CategoryModel(cat);
                if (category) {
                    await category.save()
                    res.status(201).json({ category: category, message: "new category Created" });
                }

            } else {
                res.status(404).json({ message: "please provide right data catName , type  ,refrenceId" });
            }
        } catch (err) {
           res.status(404).json({message:"somthing went wrong",error:err});

        }
    }

    // Get Allcategory
    static getAllCategory = async (req, res) => {

       
        try {
            const categories = await CategoryModel.find({});
       
            if (!categories) {
                return res.status(404).json({ message: "not found data" });
            }
            const categoryList = fetchCate(categories);
          //  console.log(categoryList);
            res.status(200).json({ categoryList });

        } catch (err) {
            console.log(err);
        }

    }

    static selectCategory = async (req, res) => {

        try {
            // console.log("req.query.id",req.query)
            const { referenceID, type } = req.query;
            let filter = {};
            if (referenceID != undefined) {
                filter.referenceID = referenceID;
            }
            else if (type != undefined) {
                filter.type = type;
            }
            else if (type != undefined || referenceID != undefined) {
                filter.type = type;
                filter.referenceID = referenceID;
            }

            const womenCat = await CategoryModel.find(filter)
            res.status(201).send(womenCat);

        } catch (error) {
            console.log(error);
        }
    };

    // static getOneMenCat = async (req,res)=>{
    //     try {

    //         const menDoc = await CategoryModel.find({type:1,type:2, type:3})
    //         res.status(201).send(menDoc)

    //     } catch (error) {
    //         console.log(error);

    //     }
    // };


}
export default CategoryController