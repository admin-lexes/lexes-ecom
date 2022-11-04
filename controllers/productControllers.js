import ProductModel from "../models/product.js"
import CategoryModel from "../models/category.js"


class ProductController {
    static createProduct = async (req, res) => {
        // res.status(200).json({file:req.files, body:req.body});
        try {
            const { title, category1, category2, category3, price, mrp,
                quantity, size, description, offer } = req.body

            let productImages = [];
            if (req.files.length > 0) {
                productImages = req.files.map(file => {
                    return { img: file.filename }
                });
            }

            const productDoc = new ProductModel({
                title: title,
                category1,
                category2,
                category3,
                price: parseInt(price),
                mrp: parseInt(mrp),
                quantity: parseInt(quantity),
                productImages,
                size,
                description,
                offer,
                CreatedBy: req.userID,
                UpdatedBy: req.userID,

            })
            if (productDoc) {
                const product = await productDoc.save()
                res.status(201).json({ product: product, message: "product will save" });
            } else {
                res.status(400).json({ productt: productDoc, error: "product not save" })
            }

        } catch (err) {
            console.log(err);
            res.status(500).json({ error: err, message: "something went wrong" })

        }

    }

    static listingProductByCategory = async (req, res) => {

        try {
            const { slug } = req.params;
            const category = await CategoryModel.findOne({ slug: slug }).select('_id type');
            if (!category) {
                res.status(400).json(message, "categorey not Found")
            }
             let catObj = {};
            if(category.type === 1){
               catObj.category1=category._id;
            }else if(category.type === 2){
                catObj.category2=category._id;
            }else{
                catObj.category3=category._id;
            }
        // console.log("category",category);
        // console.log("CatObj",catObj);
            const defaultLimit = 2;
            const maxLimit = 3;

            const page = parseInt(req.query.page) || 1;
            let limit = parseInt(req.query.limit) || defaultLimit;
            limit = (limit > maxLimit) ? maxLimit : limit;
            //console.log("limit",limit);
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            // const products= await ProductModel.find();


            let results = {};
            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit: limit
                };
            }

            if (endIndex) {
                results.next = {
                    page: page + 1,
                    limit: limit
                };
            }
            //products.slice(startIndex,endIndex);  
            //results.result =  prodByCate.find().limit(limit).skip(startIndex).exec();
            results.result = await ProductModel.find(catObj).limit(limit).skip(startIndex).exec();
            if(!results.result){
                res.status(400).json(message, "product listing based on category  not Found")
              }
            res.status(200).json(results);

        } catch (error) {
            console.log(error);
            res.status(500).json(message, error.message);
        }
    }

    static  productDetails = async (req,res)=>{
        try {
            const {productId}=req.params;
            const product = await ProductModel.findOne({productId}).populate('category1 category2 category3');
            if(!productId && !product){
                res.status(400).json(message,"please provide right productId")  
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({error:error.message})
        }
    }
}

export default ProductController