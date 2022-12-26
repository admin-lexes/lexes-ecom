import cartModel from "../models/cart.js";

class CartController{
    static createCart = async(req,res)=>{
        try {
            // console.log('req.userID', req.userID,typeof(req.userID));
            const { cartlist} = req.body
            //  console.log("cartlist",cartlist[0]['productID']);
            const resUser = await cartModel.findOne({"userID":req.userID})
            //  console.log("resUser",resUser[0].userID.toString());
            //  console.log("resUser",resUser.length);



            if (resUser) {
                if (req.userID == resUser.userID.toString()) {
                    const cartlistloop = resUser.cartlist
            //         // console.log("cartlistloop",cartlistloop);
                    let ischeck = false;

                    // console.log("object_ischeck",ischeck);
                    // let data;
                    for (let i = 0; i < cartlistloop.length; i++) {
                        // console.log(cartlistloop[i].productID.toString());
                        if (cartlist[0].productID==cartlistloop[i].productID.toString()) {
                            ischeck = true
                            // console.log("before cartlistloop[i]",typeof(cartlistloop[i]));
                            cartlistloop[i]["productQuantity"] = cartlistloop[i]["productQuantity"]+cartlist[0]["productQuantity"]                          
                        }
                        // console.log("cartlistloop",cartlistloop);    
                    }
                    if (ischeck == false) {
                        console.log("last_ischeck",ischeck);
                        // let userobj = {"userID":req.userID}
                        // let cartlistobj = cartlist[0]

                        cartlistloop.push( cartlist[0]);
                        // let query = {$push: {"cartlist":cartlistobj}}
                        // const updateArray = await cartModel.updateOne(userobj,query)
                        // console.log("updateArray",updateArray);                        
                    }                   
                    let userobj = {"userID":req.userID}

                    let query = {"cartlist":cartlistloop}
                    const updateproductQuentity = await cartModel.updateOne(userobj,{$set:{...query}})
                    console.log("updateproductQuentity",updateproductQuentity);
                    return res.status(201).json({ message: "Congratulations Your Data Has Been Inserted In Your Cart" });

// **************************************************************************************************************************
                    // for (let index = 0; index < cartlistloop.length; index++) {
                    //     console.log(cartlistloop[index].productID.toString());
                    //     // console.log("cartlist[0].productID",cartlist[0].productID);
                    //     // console.log(false);
                    //     if (cartlist[0].productID==cartlistloop[index].productID.toString()) {
                    //         ischeck = true
                    //         console.log("second_ischeck",ischeck);
                    //         const updateproductQuantity = cartlistloop[index]["productQuantity"] + cartlist[0].productQuantity;
                    //         const resUserproductQuantityUpdate = await cartModel.findOneAndUpdate(
                    //             {userID:req.userID,"cartlist":{$elemMatch:{productID:cartlistloop[index].productID}}}
                    //         ,{$set:{"cartlist.$.productQuantity":updateproductQuantity}})
                    //     }
                        
                    // }
// ******************************************************************************************************************************

                   
            }

        } 
            else {
                const doc = new cartModel({
                    userID:req.userID,
                    cartlist,                 
                    
                })
                // console.log("Doc",doc)
                const result = await doc.save()
                console.log("result",result)

               console.log("user create a cart");
               return res.status(201).json({ message: "user create a cart" });        
            }

            
        } catch (error) {
            console.log(error);
            
        }
    }

    static getcart = async (req,res)=>{
        // console.log("getcart");
        // console.log(req.userID);
        try {
            const userCartData = await cartModel.findOne({userID:req.userID})
            if (!userCartData) {

                return res.status(404).json({message:"Data Not Found"})
            }
            else
            {
                return res.status(404).json({message:userCartData})
                // console.log(userCartData);
            }


            
        } catch (error) {
            console.log(error);
            res.status(404).json({message:"somthing went wrong with cart data",error:error});
        }

    }
}

export default CartController