import cartModel from "../models/cart.js";
import orderModel from "../models/orderModel.js";
import ProductModel from "../models/product.js";
import { CronJob } from "cron";
import moment from 'moment';
import { now } from "mongoose";





class OrderController  {
    static createOrder = async(req,res) =>{
        try {
            // console.log("check after",ischeck); 
            const {address,orderList,totalprice} = req.body
            // console.log("orderList",orderList);
            const cartProduct = await cartModel.findOne({userID:req.userID})
            // console.log("cartProduct",cartProduct);
            let orderListResult = [];
            let totalPriceResult = 0;
            for (let j = 0; j < cartProduct.cartlist.length; j++) {
                // console.log(cartProduct.cartlist[j].productPrice,"__",cartProduct.cartlist[j].productID.toString());
                for (let i = 0; i < orderList.length; i++) {
                    // console.log("orderList[i].productPrice",orderList[i].productPrice,orderList[i].productID);
                    if (cartProduct.cartlist[j].productID.toString()==orderList[i].productID
                     && cartProduct.cartlist[j].productPrice==orderList[i].productPrice 
                     && cartProduct.cartlist[j].productQuantity==orderList[i].productQuantity) 
                    {
                        // console.log("cartProduct.cartlist[j]",cartProduct.cartlist[j].productPrice);
                        // console.log("orderList",orderList[i].productPrice);
                        orderList[i].productPrice = cartProduct.cartlist[j].productPrice
                        orderListResult.push(cartProduct.cartlist[j]) 
                        // console.log("cartProduct.cartlist[j]",cartProduct.cartlist[j].productQuantity,cartProduct.cartlist[j].productID.toString()); 
                        totalPriceResult = totalPriceResult +  (cartProduct.cartlist[j].productPrice * cartProduct.cartlist[j].productQuantity)   
                    }    
                }    
            }
          
            const orderUser = await orderModel.findOne({"userID":req.userID})
            // console.log("orderUser",orderUser);
            // console.log("orderListResult",orderListResult);
            // *****************Order Create*********************
            if (orderListResult!== null) {
        //******/ if (!orderUser) {
                    if (totalPriceResult == totalprice) {
                        const orderDoc = new orderModel({
                            userID:req.userID,
                            address:address,
                            orderList:orderListResult,
                            totalPrice:totalPriceResult
                        });
                        const result = await orderDoc.save();
                        //  console.log("ischeck",ischeck);
                        console.log("new order create",result);
                        res.status(201).json({message:"order create",result}) 
                        // ***********Product Value Update***********************
                        for (let i = 0; i < orderListResult.length; i++) {
                            // console.log("Id",orderListResult[i].productID.toString());
                            const ProductList = await ProductModel.findById(orderListResult[i].productID.toString())
                            // console.log("before ProductList",ProductList. _id.toString());
                            if (orderListResult[i].productID.toString()===ProductList. _id.toString()) { 
                                ProductList.quantity = ProductList.quantity-orderListResult[i].productQuantity
                                // console.log("afterProductList",ProductList.quantity);    
                                const cartProductas = await ProductModel.findByIdAndUpdate(orderListResult[i].productID.toString(),{quantity:ProductList.quantity})
                                // console.log(" cartProductas", cartProductas);    
                            } else {
                                console.log("Product Can Not Update");
                                res.status(404).json({message:"Product Can Not Update"})
                            }
                        }

                        // **********Delete Cart User Data**************
                        if (!result) {
                            console.log("Data Does not Found");
                        }
                        else{
                            const delusercart = await cartModel.deleteOne({userID:req.userID})
                            console.log("delusercart",delusercart);
                        }  
                    }
                    else{
                        console.log("Total Price Does Not Match");
                        res.status(404).json({message:"Total Price Does Not Match"})
                    }
                   
// ****************} else{
//                     console.log("No User Found");
//                     res.status(404).json({message:"No User Found"})
//                 }
             
            } else{
                console.log("message: cart list is empity");
                return res.status(404).json({message:"No Data Found"})
            }

        
             
        } catch (error) {

            console.log( error);
        };
    };

    static getOrders = async(req,res)=>{

        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const orderstatus = req.query.status
        let startTime = req.query.startTime
        let endTime = req.query.endTime
        // {orderstatus:orderstatus}
        // console.log("orderstatus",orderstatus.length);

        let startIndex = (page-1)*limit

        let filter = {};

        if ((orderstatus && orderstatus !== "")) {
            filter.orderstatus = orderstatus;
            // console.log("filter oderstatus",filter)         
        }

        if ((startTime && startTime !== "")) {
            let startMomentTime = moment.utc(new Date(startTime));
            // console.log('startMomentTime', startMomentTime); 
            filter.createdAt = {$gte:startMomentTime}; 
        }

        if ((endTime && endTime !== "")) {
            filter.createdAt = {$lte:endTime};    
        }
        
        // console.log("filter",filter);
        const allOrder = await orderModel.find(filter).skip(startIndex).limit(limit)
        console.log(allOrder);
        

// *************************************************************************************
        // 
        
        // let result = {};
        // if (orderstatus && orderstatus !== '') {
        //     filter.orderstatus = orderstatus;
        // }


        // if ((startTime!==undefined) &&
        //     (endTime!==undefined) &&
        //     (orderstatus!==undefined) ) {
        //         // console.log("orderstatus",orderstatus,"startTime",startTime,"endTime",endTime);
        //         result = {$and:[{orderstatus:{$eq:orderstatus}},{createdAt:{$gte:startTime}},{createdAt:{$lte:endTime}}]}    
        // }
        // else if ((startTime!==undefined) &&
        //         (endTime!==undefined) &&
        //         (orderstatus===undefined)) {
        //             // console.log("startTime",startTime,"endTime",endTime);
        //             result = {$and:[{createdAt:{$gte:startTime}},{createdAt:{ $lte:endTime}}]}    
        // }
        // else if ((startTime!==undefined) &&
        //         (endTime===undefined) &&
        //         (orderstatus!==undefined) ) {
        //             // console.log("orderstatus",orderstatus,"startTime",startTime);
        //             result = {$and:[{orderstatus:{$eq:orderstatus}},{createdAt:{$gte:startTime}}]} 
        // }
        // else if ((startTime===undefined) &&
        //         (endTime!==undefined) &&
        //         (orderstatus!==undefined) ) {
        //             // console.log("orderstatus",orderstatus,"endTime",endTime);
        //             result = {$and:[{orderstatus:{$eq:orderstatus}},{createdAt:{$lte:endTime}}]}
        // }
        // else if ((startTime===undefined) &&
        //         (endTime===undefined) &&
        //         (orderstatus!==undefined) ) {
        //             // console.log("orderstatus",orderstatus);
        //             result = {orderstatus:{$eq:orderstatus}}
        // }
        // else if ((startTime!==undefined) &&
        //         (endTime===undefined) &&
        //         (orderstatus===undefined) ) {
        //             // console.log("startTime",startTime);
        //             result = {createdAt:{$gte:startTime}}
        // }

        // else if ((startTime===undefined) &&
        //         (endTime!==undefined) &&
        //         (orderstatus===undefined) ) {
        //             // console.log("endTime",endTime);
        //             result = {createdAt:{$lte:endTime}}
        // }


        // console.log(result);

        // const allOrder = await orderModel.find(result).skip(startIndex).limit(endIndex)

        // res.status(201).json({message:allOrder})

        
        // console.log(allOrder.length);
        // if (limit<10) {
              
            // return res.status(400).json({message:"Invalid Request"})  
        // }
        // else{
            // console.log("all-order",allOrder);
            // return res.status(201).json({message:allOrder})
            
        // }
        // ***************************************************************************
        
    }


    static cronOrder = async()=>{
        // console.log('You will see this message every second');

        const pendingOrder = await orderModel.find({orderstatus:"Pending"})
        // console.log("pendingOrder",pendingOrder[0].orderstatus);
        for (let i = 0; i < pendingOrder.length; i++) {
            // console.log("pendingOrder",pendingOrder[i].createdAt.getUTCMinutes());
            const createdDate = moment(pendingOrder[i].createdAt);  
            // console.log(createdDate);
   
            let newcronDate = moment().subtract( 15, 'm');
            // console.log("newcronDate",newcronDate);
            
            if (newcronDate>createdDate) {
                // console.log("newCreateDate",newCreateDate);
                // console.log(pendingOrder[i]._id.toString());
                const orderpendingData = await orderModel.findByIdAndUpdate({_id:pendingOrder[i]._id.toString()},{orderstatus: 'Failed'})
                console.log("orderpendingData",orderpendingData);
            }
        }
    }    
};
export default OrderController;

let job = new CronJob('* */15 * * * *',()=> {
        OrderController.cronOrder()
	},
	null,
	true,
);

