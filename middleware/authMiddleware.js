import jwt from "jsonwebtoken";
import userSessionModel from "../models/userSessionModel.js";

const checkUserAuth = async(req,res, next)=>{
    
    let token
    const authorization = req['headers']['authorization'];
    
    if (authorization && authorization.startsWith('Bearer')) {
        
        try {
            token = authorization.split(' ')[1];
            const { userID, sessionId, userType} = jwt.verify(token, process.env.jwt_key);
            // console.log({"userId":userID,"sessionId":sessionId,"userType":userType}, jwt.verify(token, process.env.jwt_key));

            const currentStatus = await userSessionModel.findById({_id:sessionId});
            // console.log({currentStatus:currentStatus.status})

            if (currentStatus.status == 0) {

                res.status(401).send({"status": "faild", "message": "UnauthorizedUser User, Status "})
                
            } else {

                req.userID = userID;
                req.sessionId = sessionId;
                req.userType = userType;

                // console.log({"userId":userID,"sessionId":sessionId,"userType":userType});

                next();
                
            }
        } catch (error) {
            res.status(401).send({"status":"Failed", "message":"UnauthorizedUser...!!"})
            
        }
        
    } 

}

export default checkUserAuth