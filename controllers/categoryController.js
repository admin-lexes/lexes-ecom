import CategoryModel from '../models/categoryModel.js';
class CategoryController {
    // create Document
    static cat1 = async (req,res)=>{
        try {
            const { catname, type, referenceID} = req.body;
            console.log("req.body",req.body);
    
            const Doc = new CategoryModel({
                catname: catname,
                type: type,
                referenceID: referenceID

            });
            const Result = await Doc.save();
            console.log("Result",Result);
    
            res.status(201).send({ message: "newcategory created" });
            
        } catch (error) {
            console.log(error)
            
        }
    }

    static selectCategory = async (req,res)=>{

        try {
            // console.log("req.query.id",req.query)
            const {referenceID , type}= req.query;
            let filter = {};
            if (referenceID != undefined) {
                filter.referenceID = referenceID;
            }
            else if(type != undefined){
                filter.type = type;
            }
            else if(type != undefined || referenceID != undefined){
                filter.type = type;
                filter.referenceID = referenceID;
            }
            
            const womenDoc = await CategoryModel.find(filter)
            res.status(201).send(womenDoc)
              
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