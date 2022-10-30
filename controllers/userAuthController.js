import UserRegistrationModel from '../models/userRegistrationModel.js';
import bcrypt from 'bcrypt';
import userSessionModel from '../models/userSessionModel.js';
import jwt from 'jsonwebtoken'
class Authentication{
    static userRegistration = async (req,res)=>{
        try {
            const {name, email, password, mobile} = req.body
            const result = await UserRegistrationModel.find({email:email})
            // console.log("req.body", req.body);
            // console.log("result", result);
            console.log("result.length1", result.length);
            if(result.length){
                console.log("result.length", result)
                return  res.status(400).send({ message: "User already exits" });
                
            }

            const hashPassword = await bcrypt.hash(password, 12);

            const Doc = new UserRegistrationModel({
                name:name,
                email:email,
                password:hashPassword,
                mobile:mobile

            })

            const Result = await Doc.save();
            // console.log("Result",Result);
            res.status(201).send({message:"New User Create"})
            
        } catch (error) {
            console.log(error);
        }
    }

    static userLogin = async(req,res)=>{

        try {
            const {email, password, repassword} = req.body;
            
            if (email && password && repassword) {
                // console.log("email && password",email , password)
                const user = await UserRegistrationModel.findOne({email:email});
                // console.log("user",user)
                if (user != null) {
                    // console.log("user....",user.password)
                    // console.log("user.password....",user.password)
                    const isCheck = await bcrypt.compare(password, user.password)
                    const isReCheck = await bcrypt.compare(repassword, user.password)
                    console.log("isReCheck",isReCheck)
                    if(user.email == email && isCheck== true & isReCheck== true){
                        console.log("user._id",user._id)
                        // console.log("userID",userID)
                        const sessionFlag = userSessionModel.updateMany(
                            {userID: user._id, status:1},
                            {status:0}
                            
                        );
                        

                        const userObj = await userSessionModel.create({
                            userID:user._id,
                            status:1
                        });
                        
                        const token = jwt.sign(
                            {userID:user._id, sessionId: userObj._id, userType:user.user_type},
                            process.env.jwt_key,
                            {expiresIn:"3d"}

                        );
                        res.send({ status: "success", massage: "Login successfully !!", "token": token });
                    }
                    else{
                        res.status(401).send({ status: "Faild", massage: "Email Password Not Matched" });
                    }
                } else {
                    res.status(401).send({ status: "Faild", massage: "Email Password Not Matched" });
                }
            }
            else{
                res.status(404).send({ status: "Failed", massage: "All field are Required !!" });
            }
                       
            
        } catch (error) {
            console.log(error);
        }
    }

    static userLogout = async (req,res)=>{
        try {
            // console.log({ "what is inside": req.sessionId})
            // console.log({"userid":req.userID})
            
            const logout = await userSessionModel.updateMany(
                {userID:req.userID,status: 1}, {status:0})
            console.log('logout', logout);
            res.status(201).send({ status: "success", massage: "logout successfully !!" });

        } catch (error) {
            console.log(error);
            
        }
    }
}

export default Authentication