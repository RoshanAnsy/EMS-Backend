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
// import { Where } from "redis-om";

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
            where:{isActive:true},
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

export const DeleteUser=async (req:Request,res:Response)=>{
    try{
        const {userID}=req.body;
        if(!userID){
            res.status(401).json({
                message:"userId is missing",
                success:false,
            })
            return;
        }
        const users= await prisma.user.update({
            where:{id:userID,isActive:true,},
            data:{isActive:false,}
            
        });
        res.status(200).json({
            success: true,
            message:"User delete successfully",
            users
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message:"User delete failed",
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




type CreateUserMappingInput = {
  assignedToId: string;
  assignUserIds: string[];
};

export const CreateUserMapping = async (req: CustomRequest, res: Response) => {
    try {
        const { assignedToId, assignUserIds } = req.body as CreateUserMappingInput;
        const createdById = req.userId;

        if (!createdById || !assignedToId || !assignUserIds?.length) {
            res.status(400).json({
                success: false,
                message: "Missing required fields: assignedToId, assignUserIds",
            });
            return;
        }
        let userMaping;
        // 1️⃣ Check if a mapping already exists for this AssignedToID
        userMaping = await prisma.userMaping.findFirst({
            where: { AssignedToID: assignedToId, isActive: true },
            include: { AssignUsers: true },
        });
       
        if (userMaping) {
            // 2️⃣ Add only new AssignUsers that don’t exist already
            const existingAssignUserIds = userMaping.AssignUsers.map(u => u.assignUserId);
            const newAssignUsers = assignUserIds
                .filter(id => !existingAssignUserIds.includes(id))
                .map(id => ({ assignUserId: id }));

            if (newAssignUsers.length > 0) {
                await prisma.assignUserMaping.createMany({
                    data: newAssignUsers.map(u => ({ ...u, userMapingId: userMaping!.UserMapingAutoID })),
                });
            }
           
        } else {
            // 3️⃣ Create a new UserMaping with nested AssignUsers
            userMaping = await prisma.userMaping.create({
                data: {
                    CreatedByID: createdById,
                    AssignedToID: assignedToId,
                    AssignUsers: {
                        create: assignUserIds.map(id => ({ assignUserId: id })),
                    },
                },
            });
        }
        

        // 4️⃣ Fetch the updated mapping with nested user info
        const result = await prisma.userMaping.findUnique({
            where: { UserMapingAutoID: userMaping.UserMapingAutoID },
            include: {
                AssignedTo: { select: { id: true, name: true } },
                AssignUsers: {
                    include: { AssignUser: { select: { id: true, name: true, role: true } } },
                },
            },
        });
        
        res.status(201).json({
            success: true,
            message: "User mapping updated successfully",
            result,
        });
        return;
    } catch (error) {
        console.error("Error in CreateUserMapping:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create/update user mapping",
            error: (error as Error).message,
        });
        return;
    }
};



export const GetListUserOnRoleBased = async (req: CustomRequest, res: Response) => {
    try {
        // <-- multiple IDs expected
        const userId = req.userId;
        const {Role}=req.body;
        console.log(Role,userId,req.body)

        if (!userId || !Role) {
            res.status(401).json({ success: false, message: "Unauthorized: User ID missing" });
            return;
        }

       

        const List=await prisma.user.findMany({
            where:{role:Role as Role},
            select:{
                id:true,
                name:true
            }
        })

        res.status(201).json({
            success: true,
            message: "User List successfully",
            List
        });
        return;
    } catch (error) {
        console.error("Error in CreateUserMaping:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create user mapping",
            error,
        });
        return;
    }
};


export const GetListUserAssign = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: User ID missing",
            });
            return;
        }

        const user=await prisma.user.findFirst({where:{id:userId},
            select:{
                id:true,
                name:true,
                role:true,
            }
        })

        const list = await prisma.userMaping.findMany({
            where: {
                AssignedToID: userId, // get mappings where current user is the "assignee"
                isActive: true,       // only active user mappings
            },
            
            include: {
                AssignUsers: {
                    // where: {
                    //     AssignUser: {
                    //         isActive: true, // only fetch active assigned users
                    //     },
                    // },
                    include: {
                        AssignUser: {
                            select: {
                                id: true,
                                name: true,
                                role: true,
                                MobileNo:true,
                                EmplyID:true,
                                email:true
                            },
                        },
                    },
                },
                
            },
            
        });
        
        res.status(200).json({
            success: true,
            message: "Assign list fetched successfully",
            list,
            user,
        });
        return;
    } catch (error) {
        console.error("Error in GetListUserAssign:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user list",
            error: (error as Error).message,
        });
        return;
    }
};


// export const GetListUserAssign = async (req: CustomRequest, res: Response) => {
//     try {
//         const userId = req.userId;

//         if (!userId) {
//             return res.status(401).json({ success: false, message: "Unauthorized: User ID missing" });
//         }

//         // Fetch UserMaping with included AssignUsers
//         const mappings = await prisma.userMaping.findMany({
//             where: { AssignedToID: userId, isActive: true },
//             include: {
//                 AssignUser: {
//                     where: { AssignUser: { isActive: true } },
//                     include: {
//                         AssignUser: {
//                             select: { id: true, name: true, role: true }
//                         }
//                     }
//                 }
//             }
//         });

//         // Transform into desired format
//         const List: UserMapping[] = mappings.map((map) => ({
//             id: map.UserMapingAutoID,
//             AssignedToID: map.AssignedToID,
//             CreatedByID: map.CreatedByID,
//             AssignUserID: undefined, // optional if you want one main, can remove
//             AssignUser: map.AssignUsers.map((au) => ({
//                 id: au.AssignUser.id,
//                 name: au.AssignUser.name,
//                 role: au.AssignUser.role
//             }))
//         }));

//         res.status(200).json({
//             success: true,
//             message: "User List successfully",
//             List
//         });
//     } catch (error) {
//         console.error("Error in GetListUserAssign:", error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch user mapping",
//             error,
//         });
//     }
// };



export const UserListByRole=async (req:Request,res:Response)=>{
    try{
        const {Role}=req.query;
        let users;
        if(!Role){
            res.status(401).json({
                message:"Select the role",
                success:false
            })
            return;
        }

        if (Role === "ADMIN") {
            users = await prisma.user.findMany({
                where: {
                    isActive:true,
                    role: {
                        in: ["HOS", "DIRECTOR","HR","AREAMANAGEROPS","ACCOUNTANT","SCP","SCP1","SCP2","TRAINEE"], // adjust role values according to your schema
                    },
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            });
        }
        if (Role === "DIRECTOR") {
            users = await prisma.user.findMany({
                where: {
                    isActive:true,
                    role: {
                        in: ["HOS", "STATEHEAD","HR","AREAMANAGEROPS","ACCOUNTANT","SCP","SCP1","SCP2","TRAINEE"], // adjust role values according to your schema
                    },
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            });
        }

        if (Role === "HOS") {
            users = await prisma.user.findMany({
                where: {
                    isActive:true,
                    role: {
                        in: ["SITESUPERVISOR", "STATEHEAD","HR","AREAMANAGER1","AREAMANAGER2","ACCOUNTANT","SCP","SCP1","SCP2","TRAINEE"], // adjust role values according to your schema
                    },
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            });
        }
        if (Role === "STATEHEAD") {
            users = await prisma.user.findMany({
                where: {
                    isActive:true,
                    role: {
                        in: ["SITESUPERVISOR","SCP", "SCP1","SCP2","HR","AREAMANAGER1","AREAMANAGER2","ACCOUNTANT","TRAINEE"], // adjust role values according to your schema
                    },
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            });
        }

        if (Role === "AREAMANAGER1" || Role==="AREAMANAGER2") {
            users = await prisma.user.findMany({
                where: {
                    isActive:true,
                    role: {
                        in: ["SALESOFFICER", "CP","SCP","CP1","CP2","SCP1","SCP2","TRAINEE"], // adjust role values according to your schema
                    },
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            });
        }

        if (Role === "SCP1" || Role==="SCP2" || Role==="SCP") {
            users = await prisma.user.findMany({
                where: {
                    isActive:true,
                    role: {
                        in: [ "CP1","CP2","CP","TRAINEE"], // adjust role values according to your schema
                    },
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            });
        }





        res.status(200).json({
            success: true,
            message:"User list fetch successful",
            users
        });
        return;
    }
    catch(error){
        res.status(500).json({
            success: false,
            message:"User list fetch failed",
            error: error
        });
    }
}



export const GetTeamListByID = async (req: CustomRequest, res: Response) => {
    try {

        const {UserID}=req.query;
        const userId = req.userId;
        if (!UserID) {
            res.status(401).json({
                success: false,
                message: "userid  is missing",
            });
            return;
        }

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: User ID missing",
            });
            return;
        }

        const user=await prisma.user.findFirst({where:{id:UserID as string},
            select:{
                id:true,
                name:true,
                role:true,
            }
        })

        const list = await prisma.userMaping.findMany({
            where: {
                AssignedToID: UserID as string, // get mappings where current user is the "assignee"
                isActive: true,       // only active user mappings
            },
            
            include: {
                AssignUsers: {
                    where: {
                        AssignUser: {
                            isActive: true, // only fetch active assigned users
                        },
                    },
                    include: {
                        AssignUser: {
                            select: {
                                id: true,
                                name: true,
                                role: true,
                                MobileNo:true,
                                EmplyID:true,
                                email:true
                            },
                        },
                    },
                },
                
            },
            
        });
        console.log(list);
        res.status(200).json({
            success: true,
            message: "Assign list fetched successfully",
            list,
            user,
        });
        return;
    } catch (error) {
        console.error("Error in GetListUserAssign:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user list",
            error: (error as Error).message,
        });
        return;
    }
};

export const RestoreUser = async (req:Request,res:Response)=>{
    try{
        const {userId}=req.query;

        if(!userId){
            res.status(401).json({
                message:"userId is missing",
                success:false,
            })
        }

        const updateResult= await prisma.user.update({
            where:{id:userId as string},
            data:{isActive:true}
        })

        res.status(201).json({
            message:"user restore successfully",
            updateResult
        })

    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Failed to fetch user list",
            error: (error as Error).message,
        });
        return;
    }
}

export const GetTeamListAndTaskDetailByID = async (req: CustomRequest, res: Response) => {
    try {

        const {UserID,startOfMonth,endOfMonth}=req.query;
        const userId = req.userId;
        if (!UserID || !startOfMonth || !endOfMonth) {
            res.status(401).json({
                success: false,
                message: "Required Parameter is missing",
            });
            return;
        }

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: User ID missing",
            });
            return;
        }

        const user=await prisma.user.findFirst({where:{id:UserID as string},
            select:{
                id:true,
                name:true,
                role:true,
            }
        })

        

        const list = await prisma.userMaping.findMany({
            where: {
                AssignedToID: UserID as string, // get mappings where current user is the "assignee"
                isActive: true,       // only active user mappings
            },
            
            include: {
                AssignUsers: {
                    where: {
                        AssignUser: {
                            isActive: true, // only fetch active assigned users
                        },
                    },
                    include: {
                        AssignUser: {
                            select: {
                                id: true,
                                name: true,
                                role: true,
                                MobileNo:true,
                                EmplyID:true,
                                email:true
                            },
                        },
                    },
                },
                
            },
            
        });

        //console.log(new Date(startOfMonth as string),);

        const CompletedTaskAmountTeamLead = await prisma.task.aggregate({
            where: {
                assignedTo: UserID as string,
                status: "COMPLETED",
                isActive: true,
                createdAt: {
                    gte:new Date(startOfMonth as string), // completed date >= first day of current month
                    lte: new Date(endOfMonth as string),   // completed date <= last day of current month
                },
            },
            _count: {
                _all: true, // total completed tasks
            },
            _sum: {
                TotalProjectCost: true,
                TotalReceivedAmount: true,
            },
        });

        const CompletedTaskAmountTeam = await prisma.task.groupBy({
            by: ['assignedTo'],
            where: {
                assignedTo: {
                    in: list.flatMap((m) => m.AssignUsers.map((au) => au.assignUserId)),
                },
                status: "COMPLETED",
                isActive: true,
                createdAt: {
                    gte:new Date(startOfMonth as string), // completed date >= first day of current month
                    lte: new Date(endOfMonth as string),   // completed date <= last day of current month
                },
            },
            _count: {
                _all: true, // total completed tasks
            },
            _sum: {
                TotalProjectCost: true,
                TotalReceivedAmount: true,
            },
            
        });
        // const assignUserIds = list.flatMap(m => m.AssignUsers.map(au => au.assignUserId));
        const finalReport = list.flatMap(mapping =>
            mapping.AssignUsers.map(au => {
                const match = CompletedTaskAmountTeam.find(c => c.assignedTo === au.assignUserId);
                return {
                    id: au.AssignUser.id,
                    name: au.AssignUser.name,
                    role: au.AssignUser.role,
                    MobileNo: au.AssignUser.MobileNo,
                    EmplyID: au.AssignUser.EmplyID,
                    email: au.AssignUser.email,
                    completedTaskCount: match?._count?._all ?? 0,
                    totalProjectCost: match?._sum?.TotalProjectCost ?? 0,
                    totalReceivedAmount: match?._sum?.TotalReceivedAmount ?? 0
                };
            })
        );

        const teamTotals = finalReport.reduce(
            (acc, item) => {
                acc.completedTaskCount += item.completedTaskCount;
                acc.totalProjectCost += item.totalProjectCost;
                acc.totalReceivedAmount += item.totalReceivedAmount;
                return acc;
            },
            { completedTaskCount: 0, totalProjectCost: 0, totalReceivedAmount: 0 }
        );

        const totalCompletedTasks = (CompletedTaskAmountTeamLead?._count?._all ?? 0) + teamTotals.completedTaskCount;
        const totalProjectCost = (CompletedTaskAmountTeamLead?._sum?.TotalProjectCost ?? 0) + teamTotals.totalProjectCost;
        const totalReceivedAmount = (CompletedTaskAmountTeamLead?._sum?.TotalReceivedAmount ?? 0) + teamTotals.totalReceivedAmount;





        console.log(list);
        res.status(200).json({
            success: true,
            message: "Assign list fetched successfully",
            totalCompletedTasks,
            totalProjectCost,
            totalReceivedAmount,
            list,
            user,
            CompletedTaskAmountTeam,
            CompletedTaskAmountTeamLead,
            finalReport
        });
        return;
    } catch (error) {
        // console.error("Error in GetListUserAssign:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user list",
            error: (error as Error).message,
        });
        return;
    }
};





export {getUserLogs,getAllUsers,logUserActivity,GetUser}