import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { appSecret } from "../config";
import { UserAttribute, UserInstance } from "../model/userModel";


export const authorize=async(req: JwtPayload, res: Response, next: NextFunction)=>{
    try {
        const auth = req.headers.authorization  //or req.cookies.jwt
        if(!auth){
            return res.status(401).json({
                Error: "Unauthorized"
            })
        }

        const token = auth.slice(7, auth.length);
        let verify = jwt.verify(token, appSecret);
        if(!verify){
            return res.status(401).json({
                Error: "Access denied"
            })
        }

        const {id} = verify as {[key: string]:string};
        const User = await UserInstance.findOne({where:{id}}) as unknown as UserAttribute;
        if(!User){
            return res.status(401).json({
                Error: "Invalid credentials"
            })
        }
        req.User = verify;
        next()
    } catch (error) {
        return res.status(401).json({
            Error: "Unauthorized"
        })
    }
    
}