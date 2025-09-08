import { Response,Request } from "express";
import { loginTypes, signUpTypes } from "../types/auth.types";
import { loginZodSchema, signUpZodSchema } from "../utils/zod.validate";
import { prisma } from "..";
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";
import * as jwt from 'jsonwebtoken';
import {logUserActivity} from "./user.controller"
import { CustomRequest } from "../middleware/auth.middleware";
dotenv.config();
import { CookieOptions } from "express";
import { Role } from "@prisma/client";
// import { Role } from "../generated/prisma";
// sign up controller 
const signUp=async (req:Request,res:Response):Promise<void> =>{
        
    try{
       
        const {name,email,password,conformPassword,EmplyID}:signUpTypes=req.body;
        const roleValue = req.body.role as keyof typeof Role;
        // console.log("Role value",roleValue);
        // validate the data
        if(!name ||!email ||!password ||!conformPassword || !EmplyID){
            res.status(400).json({
                success: false,
                error: "Please fill all fields"
            });
            return;
        }
    
        const zodResponse=signUpZodSchema.safeParse({name,email,password,conformPassword,EmplyID});
        if(!zodResponse.success){
            res.status(400).json({
                success: false,
                error: JSON.parse(zodResponse.error.message)
            });
            return;
        }

    
        //verify password and confirm password
        if(password!== conformPassword){
            res.status(400).json({
                success: false,
                error: "Passwords and conformPassword did not matched"
            });
            return;
        }
    
        // hash password
        const hashedPassword=await bcrypt.hash(password,Number(process.env.ROUND));
        if(!hashedPassword){
            res.status(403).json({
                success: false,
                error: "Error hashing password"
            });
            return;
        }
    
        const createUser=await prisma.user.create({
            data:{
                name,email,password:hashedPassword,role:Role[roleValue],EmplyID,
            }
        })
        if(!createUser){
            res.status(404).json({
                success: false,
                error: "Error creating user"
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "User created successfully",
            createUser,
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            error: error
        });
    }




}

const login=async (req:Request,res:Response): Promise<void>=>{
    
    try{
        const {EmplyID,password}:loginTypes=req.body;
        // console.log(email,password);
        // validate the data
        if(!EmplyID ||!password){
            res.status(400).json({
                success: false,
                error: "Please fill all fields"
            });
            return;
        }
        const zodResponse=loginZodSchema.safeParse({EmplyID,password});
        if(!zodResponse.success){
            res.status(400).json({
                success: false,
                error: JSON.parse(zodResponse.error.message)
            });
            return;
        }
        // console.log(zodResponse);
        // implement login logic here
        const isUserExist=await prisma.user.findFirst({
            where:{
                EmplyID
            },
            select:{
                name:true,
                password:true,
                email:true,
                id:true,
                role:true,
                EmplyID:true
            }
        });

        // console.log(isUserExist)
    
        if(!isUserExist){
            res.status(404).json({
                success: false,
                error: "user doesn't exists"
            });
            return;
        }
        
        // compare password with hashed password from the database
        // let user={}
        if(isUserExist){
            const isPasswordMatch=await bcrypt.compare(password,isUserExist.password);
            if(!isPasswordMatch){
                res.status(401).json({
                    success:false,
                    message:"password is not correct"
                })
                return;
            }
            
            isUserExist.password=""
            
        }
        const user={
            name:isUserExist.name,
            email:isUserExist.email,
            role:isUserExist.role,
            id:isUserExist.id
        }
        
        //token generations
        const secret=process.env.JWT_SECRET_KEY as string;
        const token=jwt.sign({isUserExist},secret,
            {expiresIn:'8h'}
        )
        // if successful return jwt token
        //add login information
        // await logUserActivity(isUserExist.id,"LOGIN");
        const options:CookieOptions=  {
            expires: new Date(Date.now() + 24*60*60*1000),
            httpOnly:true,
            path:"/",
            secure:true,
            sameSite:"lax",
            priority:"medium",
        }

        res.cookie("token", token, options)
        res.status(200).json({
            message:"user login successful",
            success:true,
            user,
            token,
        });
        
        
    }
    catch(error){
        res.status(500).json({
            success: false,
            message:"login failed",
            error: error
        });
    }
}


//logout

const logout=async (req:CustomRequest,res:Response): Promise<void>=>{
    try{
        const userId=req.userId;
        if(!userId){
            res.status(400).json({
                success: false,
                error: "User ID is required"
            });
            return;
        }

        await logUserActivity(userId,"LOGOUT");
        // remove token from the client
       
        res.status(200).json({
            success: true,
            message:"logout successful",
            token:''
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message:"logout failed",
            error: error
        });
    }
}

export {signUp,login,logout} 