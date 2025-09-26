import { Response,Request } from "express";
import { prisma } from "..";
import dotenv from "dotenv";
import { CustomRequest } from "../middleware/auth.middleware";
import { signUpTypes } from "../types/auth.types";
import { Role } from "@prisma/client";
dotenv.config();
import bcrypt from 'bcryptjs';
import { getQueryParamAsString } from "../utils/queryUtils";
import { QueryOptimizer } from "../utils/queryOptimize";
import { signUpZodSchema } from "../utils/zod.validate";

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
        // const {limit,skip}=req.query;

        const page = getQueryParamAsString(req.query.page) ?? "1";
        const limit = getQueryParamAsString(req.query.limit) ?? "10";

        const { pageNum, limitNum, offset } = QueryOptimizer.getPaginationLimits(page, limit);
        
        const whereCondition = {
            isActive: true
        }
        const { count: totalRecords, isApproximate } = await QueryOptimizer.getOptimizedCount(
            prisma.user,
            whereCondition
        );
        const users = await prisma.user.findMany({
            where: whereCondition,
            select: {
                id:true,
                name:true,
                email:true,
                role:true,
            },
            skip: offset,
            take: limitNum,
            orderBy: {
                id: 'asc'
            }
        });
        if(!users){
            res.status(404).json({
                success: false,
                error: "No users found"
            });
            return;
        }
        const totalPages = Math.ceil(totalRecords / limitNum);

        res.status(200).json({
            message:"All user get successful",
            success:true,
            data: users,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalRecords,
                hasNext: pageNum < totalPages,
                hasPrevious: pageNum > 1,
                isApproximate,
            },
        });
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


export const UserList=async (req:Request,res:Response)=>{
    try{
        const users= await prisma.user.findMany({
            select:{
                id:true,
                name:true,
                email:true,
                role:true,
                
                
            }
        });
        res.status(200).json({
            success: true,
            message:"User list fetch successful",
            users
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message:"User list fetch failed",
            error: error
        });
    }
}

export const GetUserDetails=async (req:Request,res:Response)=>{
    try{
        const {userId}=req.query;
        if(!userId){
            res.status(400).json({
                success: false,
                message:"User ID is required",
            });
            return;
        }

        const user= await prisma.user.findUnique({
            where:{id:String(userId)},
            select:{
                id:true,
                name:true,
                EmplyID:true,
                email:true,
                role:true,
                createdAt:true,
                MobileNo:true,
                PanNo:true,
                AdharNo:true,
                DateOfJoining:true,
                EmergencyContactNo:true,
                PermanentAddress:true,
                CurrentAddress:true,
                BankDetails:{
                    select:{
                        bankName:true,
                        branch:true,
                        IFSCode:true,
                        accountNo:true,
                    }
                }

            }
        });

        if(!user){
            res.status(404).json({
                success: false,
                message:"User not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message:"User details fetch successful",
            user
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message:"User details fetch failed",
            error: error
        });
    }
}


// export const UpdateUserDetails=async (req:Request,res:Response)=>{
//     try{
//         const {userId}=req.query;
//         const {name,MobileNo,PanNo,AdharNo,EmergencyContactNo,PermanentAddress,CurrentAddress,BankName,IFSCCode,Branch,accountNo}=req.body;

//         if(!userId){
//             res.status(400).json({
//                 success: false,
//                 message:"User ID is required",
//             });
//             return;
//         }

//         const user= await prisma.user.update({
//             where:{id:String(userId)},
//             data:{
//                 name:name,
//                 MobileNo:MobileNo,
//                 PanNo:PanNo,
//                 AdharNo:AdharNo,
//                 EmergencyContactNo:EmergencyContactNo,
//                 PermanentAddress:PermanentAddress,
//                 CurrentAddress:CurrentAddress,
//                 BankDetails:{
//                     create:{
//                         bankName:BankName,
//                         IFSCode:IFSCCode,
//                         branch:Branch,
//                         accountNo:accountNo,
//                         userId:String(userId),
//                     }
//                 },
//             }
//         });

//         if(!user){
//             res.status(404).json({
//                 success: false,
//                 message:"User not found",
//             });
//             return;
//         }
//         res.status(200).json({
//             success: true,
//             message:"User details update successful",
//             user
//         });
//     }
//     catch(error){
//         res.status(500).json({
//             success: false,
//             message:"User details update failed",
//             error: error
//         });
//     }   

// }

export const UpdateUserDetails = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;
        const {
            name,
            MobileNo,
            PanNo,
            AdharNo,
            EmergencyContactNo,
            PermanentAddress,
            CurrentAddress,
            BankName,
            IFSCCode,
            Branch,
            accountNo,
        } = req.body;

        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }

        const user = await prisma.user.update({
            where: { id: String(userId) },
            data: {
                name,
                MobileNo,
                PanNo,
                AdharNo,
                EmergencyContactNo,
                PermanentAddress,
                CurrentAddress,
                BankDetails: {
                    upsert: {
                        create: {
                            bankName: BankName,
                            IFSCode: IFSCCode,
                            branch: Branch,
                            accountNo: accountNo,
                            
                        },
                        update: {
                            bankName: BankName,
                            IFSCode: IFSCCode,
                            branch: Branch,
                            accountNo: accountNo,
                        },
                    },
                },
            },
            include: { BankDetails: true }, // fetch related bank details
        });

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "User details update successful",
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "User details update failed",
            error: error instanceof Error ? error.message : error,
        });
    }
};



export const AddNewUser=async (req:Request,res:Response):Promise<void> =>{
        
    try{
       
        const {name,email,password,conformPassword,EmplyID,DateOfJoining}:signUpTypes=req.body;
        const roleValue = req.body.role as keyof typeof Role;
        // console.log("Role value",roleValue);
        // validate the data
        if(!name ||!email ||!password ||!conformPassword || !EmplyID || !DateOfJoining){
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
                name,email,password:hashedPassword,role:Role[roleValue],EmplyID,DateOfJoining:new Date(DateOfJoining)
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

export const GetUserListForDropdown=async (req:Request,res:Response):Promise<void>=>{
    try{
        const users= await prisma.user.findMany({
            where:{
                isActive:true
            },
            select:{
                id:true,
                name:true,
            }
        });
        if(!users){
            res.status(404).json({
                success: false,
                error: "No users found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            message:"User list fetch successful",
            users
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message:"User list fetch failed",
            error: error
        });
    }
}

export {getUserLogs,getAllUsers,logUserActivity,GetUser}