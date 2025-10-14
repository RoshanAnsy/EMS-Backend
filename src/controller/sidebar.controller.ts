


import { Response } from "express";
import { prisma } from "..";
import { CustomRequest } from "../middleware/auth.middleware";
import { Role } from "@prisma/client";

// import { Role } from "../generated/prisma";

// export const GetSideBar= async (req:CustomRequest,res:Response)=>{
//     try {
       
//         const roleValue = req.role as keyof typeof Role;
//         const SideBarList=prisma.menu.findMany({
                        
//             where: {
//                 webUserRights: {
//                     some: {
//                         Role: roleValue, // or role variable
//                         isAccess: true,
//                     },
//                 },
//             },
//             select: {
//                 MenuName: true,
//                 Icon: true,
//                 Priority: true,
//                 SubMenus: {
//                     where: {
//                         webUserRights: {
//                             some: {
//                                 Role: "ADMIN",
//                                 isAccess: true,
//                             },
//                         },
//                     },
//                     select: {
//                         SubMenuName: true,
//                         Icon: true,
//                         Routes: true,
//                         Priority: true,
//                     },
//                 },
//             },

//         });
//         res.status(200).json({
//             success: true,
//             message:"fetching sidebar successful",
//             SideBarList
//         });
//     }

       

//     catch(error){
//         res.status(500).json({
//             success: false,
//             message:"fetching sidebar failed",
//             error: error
//         });
//     }
// }




export const addMenu= async (req:CustomRequest,res:Response)=>{
    try {
        const {menuName,priority,icon}=req.body;
        if(!menuName || !priority){
            res.status(400).json({
                success: false,
                message:"menuName and priority are required"
            });
            return;
        }
        const newMenu= await prisma.menu.create({
            data:{
                MenuName:menuName,
                Priority:priority,
                Icon:icon
            }
        });
        res.status(201).json({
            success: true,
            message:"Menu added successfully",
            newMenu
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message:"adding menu failed",
            error: error
        });
    }
}




export const addSubMenu= async (req:CustomRequest,res:Response)=>{
    try {
        const {menuId,subMenuName,priority,routes,icon}=req.body;
        // const roleValue = req.role as keyof typeof Role;
        // console.log("role value",roleValue);
        // console.log("menuId",menuId);
       
        if(!menuId || !subMenuName || !priority || !routes){
            res.status(400).json({
                success: false,
                message:"menuId, subMenuName, priority, Role and routes are required"
            });
            return;
        }
        const result=await prisma.subMenu.create({
            data:{
                SubMenuName:subMenuName,
                Priority:priority,
                Routes:routes,
                Icon:icon,
                MenuId:menuId,
                
            }});
        console.log("result 1",result);
        
            
         
        // const newSubMenu= await addSubMenu(menuId,subMenuName,priority,routes,icon);
        res.status(201).json({
            success: true,
            message:"SubMenu added successfully",
            result
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message:"adding submenu failed",
            error: error
        });
    }
}


// type AssignMenuParams={
//     userId:string,
//     Menus:[{
//         MenuId:string,
//         subMenu:{
//             SubMenuId:string,
//             canView?:boolean
//         }[]
//     }]
// }


// type LoginFormInputs = {
//   id: string; // userId
//   Menu: {
//     MenuId: string;
//     subMenu: {
//       SubMenuId: string;
//       canView: boolean;
//     }[];
//   }[];
// };

// export const AssignMenuToRole= async (req:CustomRequest,res:Response)=>{
//     try {
//         const data:AssignMenuParams=req.body;

//         console.log("object data",JSON.stringify(data));
//         const userId=data.userId;
//         const MenuData=data.Menu;

//         if(!userId || !MenuData){
//             res.status(400).json({
//                 success: false,
//                 message:"userId, role, menuId and subMenuId are required"
//             });
//             return;
//         }
//         const FindRole=await prisma.user.findUnique({
//             where:{id:userId},
//             select:{role:true}
//         });

//         let existingAssignment;
//         for(const menuItem of MenuData){
//             for(const subMenuItem of menuItem.subMenu){
//                 existingAssignment= await prisma.webUserRight.create({
//                     data:{
//                         // userId:userId,
//                         Role:FindRole?.role as keyof typeof Role,
//                         isAccess:true,
//                         canView: subMenuItem.canView || false,
//                         MenuId:menuItem.MenuId,
//                         SubMenuId:subMenuItem.SubMenuId,
//                         isAccessBy:userId,
//                         AddedBY:req.userId
//                     }
                    
//                 });
//             }
//         }
        
       
//         res.status(201).json({
//             success: true,
//             message:"Menu assigned to role successfully",
//             existingAssignment
//         });
//     }
//     catch(error){
//         res.status(500).json({
//             success: false,
//             message:"assigning menu to role failed",
//             error: error
//         });
//     }
// }

type AssignMenuParams={
    userId:string,
    Menus:[{
        MenuId:string,
        subMenu:{
            SubMenuId:string,
            canView?:boolean
        }[]
    }]
}

export const AssignMenuToRole = async (req: CustomRequest, res: Response) => {
    try {
        const { userId, Menus }: AssignMenuParams = req.body.data;


        // console.log("object data",JSON.stringify(req.body));
        // console.log("object data",JSON.stringify(Menus));


        if (!userId || !Menus) {
            res.status(400).json({
                success: false,
                message: "userId and Menus are required",
            });
            return;
        }

        const user = await prisma.user.findFirst({
            where: { id: userId },
            select: { role: true },
        });

        if (!user?.role) {
            res.status(404).json({
                success: false,
                message: "User not found or role missing",
            });
            return;
        }

        const createData = Menus?.flatMap((menu) =>
            (menu.subMenu ?? []).map((subMenu) => ({
                Role: user?.role as keyof typeof Role,
                isAccess: true,
                canView: subMenu.canView ?? false,
                MenuId: menu.MenuId,
                SubMenuId: subMenu.SubMenuId,
                isAccessBy: userId,
                AddedBY: userId,
            }))
        );



        // console.log("result 1", createData);
        const result=await prisma.webUserRight.createMany({
            data: createData,
            skipDuplicates: false, // ✅ avoids inserting duplicates if unique index exists
        });

        res.status(201).json({
            success: true,
            message: "Menu assigned to role successfully",
            result
        });
    } catch (error) {
        console.error("AssignMenuToRole error:", error);
        res.status(500).json({
            success: false,
            message: "Assigning menu to role failed",
            error: error,
        });
    }
};





// export const GetMenuWithSubMenu= async (req:CustomRequest,res:Response)=>{
//     try {
       
//         const userId=req.userId;
//         const roleId=req.role as keyof typeof Role;

//         const rights = await prisma.webUserRight.findMany({
//             where: { Role: roleId, isActive: true, isAccess: true, isAccessBy: userId },
//             select: {
//                 MenuId: true,
//                 SubMenuId: true,
//                 isAccessBy: true,
//             },
//         })

//         console.log("rights", rights);

//         const menuIds = rights.map(r => r.MenuId)
//         const subMenuIds = rights.map(r => r.SubMenuId);

//         // Step 2: Get Menus with SubMenus
//         const menus = await prisma.menu.findMany({
//             where: {
//                 id: { in: menuIds },
//                 isActive: true,
//             },
//             select: {
//                 id: true,
//                 MenuName: true,
//                 Icon: true,
//                 Priority: true,
//                 SubMenus: {
//                     where: {
//                         id: { in: subMenuIds },
//                         isActive: true,
//                     },
//                     select: {
//                         id: true,
//                         SubMenuName: true,
//                         Routes: true,
//                         Icon: true,
//                         Priority: true,
//                     },
//                 },
//             },
//             orderBy: { Priority: 'asc' },
//         })

        

      

//         res.status(200).json({
//             success: true,
//             message:"fetching sidebar successful",
//             menus
//         });
//     }

       

//     catch(error){
//         res.status(500).json({
//             success: false,
//             message:"fetching sidebar failed",
//             error: error
//         });
//     }
// }



export const GetMenuWithSubMenu = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.userId;
        const roleId = req.role as keyof typeof Role;
        console.log("this is details",userId,roleId)
        if(!userId || !roleId){
            res.status(400).json({
                success: false,
                message: "userId and role are required",
            });
            return;
        }
        // ✅ Get user rights
        const rights = await prisma.webUserRight.findMany({
            where: { Role: roleId, isActive: true, isAccess: true, isAccessBy: userId },
            select: {
                MenuId: true,
                SubMenuId: true,
                isAccessBy: true,
            },
        });
        

        console.log("object rights", rights,userId);
        
        const menuIds = rights
            .map(r => r.MenuId)
            .filter((id): id is string => id !== null); // filter null
        const subMenuIds = rights
            .map(r => r.SubMenuId)
            .filter((id): id is string => id !== null);

      
        console.log("menuIds", menuIds, "subMenuIds", subMenuIds);
        // ✅ Fetch only menus that are accessible OR have accessible submenus
        const menus = await prisma.menu.findMany({
            where: {
                OR: [
                    { id: { in: menuIds } }, // Menu itself accessible
                    { SubMenus: { some: { id: { in: subMenuIds } } } }, // Or at least one submenu accessible
                ],
                isActive: true,
            },
            select: {
                id: true,
                MenuName: true,
                Icon: true,
                Priority: true,
                SubMenus: {
                    where: {
                        id: { in: subMenuIds }, // ✅ Only return accessible submenus
                        isActive: true,
                    },
                    select: {
                        id: true,
                        SubMenuName: true,
                        Routes: true,
                        Icon: true,
                        Priority: true,
                    },
                    orderBy: { Priority: 'asc' },
                },
            },
            orderBy: { Priority: 'asc' },
        });

        res.status(200).json({
            success: true,
            message: "Fetching sidebar successful",
            menus,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Fetching sidebar failed",
            error,
        });
    }
};


// export const GetMenuLIst=async (req:CustomRequest,res:Response)=>{
//     try {
//         const userId=req.userId;


//         const menuList=await prisma.webUserRight.findMany({
//             where:{isAccessBy:userId},
//             select:{
//                 MenuId:true,
//                 SubMenu:{
//                     select:{
//                         SubMenuName:true,
//                         Icon:true,
//                         Routes:true,
//                         Priority:true
//                     }
//                 }
//             }
//         });


//         res.status(200).json({
//             success: true,
//             message:"fetching menu list successful",
//             menuList
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message:"fetching menu list failed",
//             error: error
//         });
//     }
// }

//get the list of menu and submenu that not assigned to the user
// export const getUnassignedMenusWithSubMenus = async (req: CustomRequest, res: Response) => {
//     try {
//         const { userId } = req.query;
//         if (!userId) {
//             res.status(400).json({
//                 success: false,
//                 message: "userId is required",
//             });
//             return;
//         }

//         // Get role of the user
//         const role = await prisma.user.findUnique({
//             where: { id: userId as string },
//             select: { role: true },
//         });

//         // Step 1: Get already assigned rights for this role + user
//         const assignedRights = await prisma.webUserRight.findMany({
//             where: { Role: role?.role, isActive: true, isAccessBy: userId as string },
//             select: {
//                 MenuId: true,
//                 SubMenuId: true,
//             },
//         });

//         const assignedSubMenuIds = assignedRights.map((r) => r.SubMenuId);

//         // Step 2: Get menus + submenus NOT assigned
//         const unassignedMenus = await prisma.menu.findMany({
//             where: {
//                 isActive: true, // ✅ keep all active menus
//             },
//             select: {
//                 id: true,

//                 MenuName: true,
//                 Icon: true,
//                 Priority: true,
//                 SubMenus: {

//                     where: {
//                         isActive: true,
//                         NOT: {
//                             id: { in: assignedSubMenuIds }, // ✅ only filter submenus
//                         },
//                     },
//                     select: {
//                         id: true,
//                         SubMenuName: true,
//                         Routes: true,
//                         Icon: true,
//                         Priority: true,
//                     },
//                     orderBy: { Priority: "asc" },
//                 },
//             },
//             orderBy: { Priority: "asc" },
//         });

//         res.status(200).json({
//             success: true,
//             message: "Fetched unassigned menus successfully",
//             unassignedMenus,
//         });
//     } catch (err) {
//         console.error("Error fetching unassigned menus:", err);
//         res.status(500).json({
//             success: false,
//             message: "Error fetching unassigned menus",
//             error: err,
//         });
//     }
// };

export const getUnassignedMenusWithSubMenus = async (req: CustomRequest, res: Response) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "userId is required",
            });
            return;
        }

        // Get role of the user
        const role = await prisma.user.findUnique({
            where: { id: userId as string },
            select: { role: true },
        });

        // Step 1: Get already assigned rights for this role + user
        const assignedRights = await prisma.webUserRight.findMany({
            where: { Role: role?.role, isActive: true, isAccessBy: userId as string },
            select: {
                MenuId: true,
                SubMenuId: true,
            },
        });

        const assignedSubMenuIds = assignedRights.map((r) => r.SubMenuId);

        // Step 2: Get menus with submenus (but only unassigned submenus)
        const menus = await prisma.menu.findMany({
            where: { isActive: true },
            select: {
                id: true,
                MenuName: true,
                Icon: true,
                Priority: true,
                SubMenus: {
                    where: {
                        isActive: true,
                        NOT: {
                            id: { in: assignedSubMenuIds },
                        },
                    },
                    select: {
                        id: true,
                        SubMenuName: true,
                        Routes: true,
                        Icon: true,
                        Priority: true,
                    },
                    orderBy: { Priority: "asc" },
                },
            },
            orderBy: { Priority: "asc" },
        });
        
        // Step 3: Filter out menus with no unassigned submenus
        const unassignedMenus = menus.filter(menu => menu.SubMenus.length > 0);
        console.log("this is unsign ",unassignedMenus)
        res.status(200).json({
            success: true,
            message: "Fetched unassigned menus successfully",
            unassignedMenus,
        });
    } catch (err) {
        console.error("Error fetching unassigned menus:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching unassigned menus",
            error: err,
        });
    }
};





export const getALLWebRightsEntry= async (req:CustomRequest,res:Response)=>{
    try {
        const allEntries=await prisma.webUserRight.findMany({
            // where:{isActive:true},
            select:{
                id:true,
                Role:true,
                isAccess:true,
                canView:true,
                MenuId:true,
                SubMenu:{
                    select:{
                        SubMenuName:true,
                        Routes:true
                    }
                },
                isAccessBy:true,
                AddedBY:true,
                createdAt:true
            },
            orderBy:{createdAt:'desc'}
        });
        res.status(200).json({
            success: true,
            message:"fetching all web rights entry successful",
            allEntries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:"fetching all web rights entry failed",
            error: error
        });
    }
} 

export const GetMenu=async (req:CustomRequest,res:Response)=>{
    try {
        const menuList=await prisma.menu.findMany({
            // where:{isActive:true},
            select:{
                id:true,
                MenuName:true,
                Icon:true,
                Priority:true
            },
            orderBy:{Priority:'asc'}
        });
        res.status(200).json({
            success: true,
            message:"fetching menu list successful",
            menuList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:"fetching menu list failed",
            error: error
        });
    }
}

export const GetSubMenu=async (req:CustomRequest,res:Response)=>{
    try {
        const {menuId}=req.query;
        if(!menuId){
            res.status(400).json({
                success: false,
                message:"menuId is required"
            });
            return;
        }
        const subMenuList=await prisma.subMenu.findMany({
            where:{MenuId:menuId as string},
            select:{
                id:true,
                SubMenuName:true,
                Routes:true,
                Icon:true,
                Priority:true
            },
            orderBy:{Priority:'asc'}
        });
        res.status(200).json({
            success: true,
            message:"fetching submenu list successful",
            subMenuList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:"fetching submenu list failed",
            error: error
        });
    }
}

export const UpdateMenu= async (req:CustomRequest,res:Response)=>{
    try {
        const {menuId,menuName,priority,icon}=req.body;
        if(!menuId || !menuName || !priority){
            res.status(400).json({
                success: false,
                message:"menuId, menuName and priority are required"
            });
            return;
        }
        const updateMenu= await prisma.menu.update({
            where:{id:menuId},
            data:{
                MenuName:menuName,
                Priority:priority,
                Icon:icon
            }
        });
        res.status(200).json({
            success: true,
            message:"Menu updated successfully",
            updateMenu
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message:"updating menu failed",
            error: error
        });
    }
}


export const UpdateSubMenu= async (req:CustomRequest,res:Response)=>{
    try {
        const {subMenuId,subMenuName,priority,routes,icon}=req.body;
        if(!subMenuId || !subMenuName || !priority || !routes){
            res.status(400).json({
                success: false,
                message:"subMenuId, subMenuName, priority and routes are required"
            });
            return;
        }
        const updateSubMenu= await prisma.subMenu.update({
            where:{id:subMenuId},
            data:{
                SubMenuName:subMenuName,
                Priority:priority,
                Routes:routes,
                Icon:icon
            }
        });
        res.status(200).json({
            success: true,
            message:"SubMenu updated successfully",
            updateSubMenu
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message:"updating submenu failed",
            error: error
        });
    }
}
/**
 * Create a new SubMenu under an existing Menu
 */


export const GetMenuAccessList = async (req:CustomRequest, res: Response) => {
    try {
        const {userId} = req.query;
        // const {userId}=req.query; 
        // const { userId } = req.prams;
        console.log("this is from latest code ",userId)// Support userId from body or authenticated request
        if(!userId){
            res.status(400).json({
                success: false,
                message: "userId is required",
            });
            return;
        }

        // Get all rights for this user (active, access allowed)
        const rights = await prisma.webUserRight.findMany({
            where: { isActive: true, isAccess: true, isAccessBy: userId as string },
            select: {
                MenuId: true,
                SubMenuId: true,
            },
        });
        console.log("this is from latest code rights ",rights)// Support userId from body or authenticated request

        const menuIds = rights
            .map(r => r.MenuId)
            .filter((id): id is string => !!id);
        const subMenuIds = rights
            .map(r => r.SubMenuId)
            .filter((id): id is string => !!id);

        // Find menus user can access (direct menu access or via submenus)
        const menus = await prisma.menu.findMany({
            where: {
                OR: [
                    { id: { in: menuIds } }, // Direct menu access
                    { SubMenus: { some: { id: { in: subMenuIds }, isActive: true } } } // Access via submenus
                ],
                isActive: true,
            },
            select: {
                id: true,
                MenuName: true,
                Icon: true,
                Priority: true,
                SubMenus: {
                    where: {
                        id: { in: subMenuIds }, // Only accessible submenus for this user
                        isActive: true,
                    },
                    select: {
                        id: true,
                        SubMenuName: true,
                        Routes: true,
                        Icon: true,
                        Priority: true,
                    },
                    orderBy: { Priority: 'asc' },
                },
            },
            orderBy: { Priority: 'asc' },
        });
        console.log("this is from latest menu ",menus)// Support userId from body or authenticated request

        // You get each menu with its submenus, every ID and name included
        res.status(200).json({
            success: true,
            message: "Fetching sidebar successful",
            menus,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Fetching sidebar failed",
            error,
        });
        return;
    }
};




// export const RemoveAccess = async (req: CustomRequest, res: Response) => {
//     try {
//         const { userId, menuIds, submenuIds } = req.body; // Support userId from body or authenticated request
//         if(!userId || !Array.isArray(menuIds) || !Array.isArray(submenuIds)){
//             res.status(400).json({
//                 success: false,
//                 message: "userId is required",
//             });
//             return;
//         }


//         const deleteMenuAccess = prisma.webUserRight.deleteMany({
//             where: {
//                 isActive: true,
//                 isAccessBy: userId,
//                 MenuId: {in: menuIds },
//             },
//         });

//         const deleteSubmenuAccess = prisma.webUserRight.deleteMany({
//             where: {
//                 isActive: true,
//                 isAccessBy: userId,
//                 SubMenuId: { in: submenuIds },
//             },
//         });

//         // Perform both deletes in a transaction
//         const result = await prisma.$transaction([deleteMenuAccess, deleteSubmenuAccess]);

//         // Find menus user can access (direct menu access or via submenus)
        

//         // You get each menu with its submenus, every ID and name included
//         res.status(200).json({
//             success: true,
//             message: "Access removed successfully",
//             result,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Fetching sidebar failed",
//             error,
//         });
//     }
// };


export const RemoveAccess = async (req: CustomRequest, res: Response) => {
    try {
        const { userId, menuIds, submenuIds } = req.body;

        if (!userId || !Array.isArray(menuIds) || !Array.isArray(submenuIds)) {
            res.status(400).json({
                success: false,
                message: "userId, menuIds, and submenuIds must be valid arrays",
            });
            return;
        }

        // Step 1: Delete submenu access safely
        const deleteSubmenuAccess = prisma.webUserRight.deleteMany({
            where: {
                isActive: true,
                isAccessBy: userId,
                SubMenuId: { in: submenuIds },
            },
        });

        // Step 2: Before deleting menu access, ensure there are no active submenus left for those menus
        const menusWithRemainingSubmenus = await prisma.webUserRight.findMany({
            where: {
                isActive: true,
                isAccessBy: userId,
                MenuId: { in: menuIds },
                SubMenuId: { notIn: submenuIds },
            },
            select: { MenuId: true },
            distinct: ["MenuId"],
        });

        const menusToKeep = menusWithRemainingSubmenus.map(m => m.MenuId);
        const menusToDelete = menuIds.filter(id => !menusToKeep.includes(id));

        // Step 3: Delete only those menus that have no remaining submenus
        const deleteMenuAccess = prisma.webUserRight.deleteMany({
            where: {
                isActive: true,
                isAccessBy: userId,
                MenuId: { in: menusToDelete },
                OR:[
                // { SubMenuId: null }, // for nullable column
                    { SubMenuId: "" },

                ]
                 
            },
        });

        // Step 4: Execute both deletions in a transaction
        const result = await prisma.$transaction([deleteSubmenuAccess, deleteMenuAccess]);

        res.status(200).json({
            success: true,
            message: "Access removed successfully",
            result,
        });
        return;
    } catch (error) {
        console.error("Error removing access:", error);
        res.status(500).json({
            success: false,
            message: "Error while removing access",
            error,
        });
        return;
    }
};



