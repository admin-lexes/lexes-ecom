import jwt from "jsonwebtoken"
import userSessionModel from "../models/userSessionModel"

const checkUserAuth = async(req,res)=>{

    let token
    const authorization = req['header']['authorization'];
    console.log({"auth":authorization})
}