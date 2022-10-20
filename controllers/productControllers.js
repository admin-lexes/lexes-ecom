import ProductModel from "../models/productModel.js"


class ProductController{
    static createProduct = async (req, res)=>{
        // console.log('req.body',req.body)
        try {
            const { title,category1,category2,category3,price,mrp,
                quantity,images,size,description,thumbnail} = req.body
                
            const productDoc = new ProductModel({
                title:title,
                category1:category1,
                category2:category2,
                category3:category3,
                price:price,
                mrp:mrp,
                quantity:quantity,
                images:images,
                size:size,
                description:description,
                thumbnail:thumbnail
            })
            // console.log("productDoc ",productDoc )
            const result = await productDoc.save()
            console.log("result",result)
            res.status(201).send({message:"newcategory created"});
            
            
        } catch (error) {
            console.log(error)
            
        }
        
    }
}

export default ProductController