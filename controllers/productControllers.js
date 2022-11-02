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
            const category = await CategoryModel.findOne({ slug: slug }).select('_id');
            if (!category) {
                res.status(400).json(message, "categorey not Found")
            }

           const prodByCate = await ProductModel.find({category1:category._id});
          if(!prodByCate){
            res.status(400).json(message, "product listing based on category  not Found")
          }
            console.log(prodByCate);

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

            if (endIndex < prodByCate.length) {
                results.next = {
                    page: page + 1,
                    limit: limit
                };
            }
            //products.slice(startIndex,endIndex);  
            //results.result =  prodByCate.find().limit(limit).skip(startIndex).exec();
            results.result = prodByCate.slice(startIndex,endIndex);
            res.status(200).json(results);

        } catch (error) {
            console.log(error);
            res.status(500).json(message, error.message);
        }
    }

}

export default ProductController