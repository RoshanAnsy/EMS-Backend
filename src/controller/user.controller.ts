import { Response,Request } from "express";
import { prisma } from "..";
import dotenv from "dotenv";
import { CustomRequest } from "../middleware/auth.middleware";
dotenv.config();



const logUserActivity=async (userId:string, action:'LOGIN' | 'LOGOUT')=>{
    
    try{
        await prisma.log.create({
            data:{
                userId,
                action,
            }
        })
    }

    catch(error){
        console.error("Error logging user activity", error);
    }

}



const getUserLogs=async (req:CustomRequest, res: Response):Promise<void> => {
        
    try{
        const Id=req.userId;
        if(!Id){
            res.status(400).json({
                success: false,
                error: "User ID is required"
            });
            return;
        }
        const logs = await prisma.user.findUnique({
            where: {
                id: Id,
            },
            select: {
                name: true,
                email: true,
                logs: {
                    select: {
                        action: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        if(!logs){
            res.status(404).json({
                success: false,
                error: "No logs found"
            });
            return;
        }

        res.status(200).json({
            message:"User logs get successfully",
            success:true,
            logs,
        })
    }
    catch(error){
        res.status(500).json({
            message:"User logs get failed",
            success:false,
            error:`internal error: ${error}`
        })
    }
}

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
        
    try{
        const {limit,skip}=req.query;
    
        const TotalSkip=Number(skip);
        const TotalLimit=Number(limit);
        const users = await prisma.user.findMany({
            skip:TotalSkip,
            take: TotalLimit,
            orderBy: {
                id: 'asc'
            },
            select:{
                id:true,
                name:true,
                email:true,
            }
        })
        if(!users){
            res.status(404).json({
                success: false,
                error: "No users found"
            });
            return;
        }
        res.status(200).json({
            message:"All user get successful",
            success:true,
            users
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message:"Failed to get users",
            error: `internal server error ${error}`
        });
    }
    

}

const GetUser = async (req:CustomRequest,res:Response) => {
    try{
        const Id=req.userId;
        
        const result = await prisma.user.findUnique({
            where:{id:Id},
            select: {
                name:true,
                email:true,
            }
        })
        if(!result){
            res.status(404).json({
                success: false,
                error: "User not found"
            });
            return;
        }
        res.status(200).json({
            message: "User get successful",
            success: true,
            result,
        })
    }
    catch(error){
        console.error("Error getting user", error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
}

export {getUserLogs,getAllUsers,logUserActivity,GetUser}