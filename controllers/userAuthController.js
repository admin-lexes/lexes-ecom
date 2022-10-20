import UserRagistrationModel from '../models/userRagistrationModel.js';
import bcrypt from 'bcrypt';
import userSessionModel from '../models/userSessionModel.js';
class Authentication{
    static userRagistration = async (req,res)=>{
        try {
            const {name, email, password, mobile} = req.body
            const result = await UserRagistrationModel.find({email:email})
            // console.log("req.body", req.body);
            // console.log("result", result);
            console.log("result.length1", result.length);
            if(result.length){
                console.log("result.length", result)
                return  res.status(400).send({ message: "User already exits" });
                
            }

            const hashPassword = await bcrypt.hash(password, 12);

            const Doc = new UserRagistrationModel({
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
            const {email, password} = req.body;
            if (email && password) {
                const user = await UserRagistrationModel.findOne({email:email});
                // console.log("user",user)
                if (user != null) {

                    const isCheck = bcrypt.compare(password, user.password)
                    console.log("isCheck",isCheck)
                    if(user.email == email && isCheck== true){
                        const sessionFlag = userSessionModel.updateMany(
                            {userID: user._id, status:1},
                            {status:0}
                        );

                        const userSessionObj = await userSessionModel.create({
                            userID:user._id,
                            status:1
                        });

                        const token = jwt
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
            
            // console.log("result",result.email);

            // if(result != null){
            //     // console.log("result",result);
            //     if (result.email == email && result.password == password){
            //         res.status(201).send(result)
            //     }
            //     else{
            //         res.send("Email or Password does not match")
            //     }

            // }
            // else{
            //     res.send("Email does not resister")
            // }

            
            
        } catch (error) {
            console.log(error);
        }
    }
}

export default Authentication