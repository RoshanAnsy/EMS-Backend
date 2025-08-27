import { Response } from "express";
import { prisma } from "..";
import { CustomRequest } from "../middleware/auth.middleware";
import { Role } from "@prisma/client";

export const GetSideBar= async (req:CustomRequest,res:Response)=>{
    try {
       
        const roleValue = req.role as keyof typeof Role;
        const SideBarList=prisma.menu.findMany({
                        
            where: {
                webUserRights: {
                    some: {
                        Role: roleValue, // or role variable
                        isAccess: true,
                    },
                },
            },
            select: {
                MenuName: true,
                Icon: true,
                Priority: true,
                SubMenus: {
                    where: {
                        webUserRights: {
                            some: {
                                Role: "ADMIN",
                                isAccess: true,
                            },
                        },
                    },
                    select: {
                        SubMenuName: true,
                        Icon: true,
                        Routes: true,
                        Priority: true,
                    },
                },
            },

        });
        res.status(200).json({
            success: true,
            message:"fetching sidebar successful",
            SideBarList
        });
    }

       

    catch(error){
        res.status(500).json({
            success: false,
            message:"fetching sidebar failed",
            error: error
        });
    }
}




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
        if(!menuId || !subMenuName || !priority || !routes){
            res.status(400).json({
                success: false,
                message:"menuId, subMenuName, priority and routes are required"
            });
            return;
        }
        const result=await prisma.subMenu.create({
            data:{
                SubMenuName:subMenuName,
                Priority:priority,
                Routes:routes,
                Icon:icon,
                Menu:{connect:{id:menuId}},
            }});
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


type AssignMenuParams=[{
    
    Menu:{
        MenuId:string,
        canView?:boolean,
        subMenu:{
            SubMenuId:string,
            canView?:boolean
        }
    }
}]

export const AssignMenuToRole= async (req:CustomRequest,res:Response)=>{
    try {
        const data:AssignMenuParams=req.body;


        const roleValue = req.role as keyof typeof Role;
        const userId=req.userId;
        if(!data || !roleValue){
            res.status(400).json({
                success: false,
                message:"userId, role, menuId and subMenuId are required"
            });
            return;
        }
        let existingAssignment;
        for(let i=0;i<data.length;i++){
            const item=data[i];
            const subMenuId=item.Menu.subMenu.SubMenuId;
            const canView=item.Menu.subMenu.canView;
            // Check if an assignment already exists for this user, role, menu, and submenu
            existingAssignment = await prisma.webUserRight.findFirst({
                where: {
                    userId:userId,
                    Role: roleValue,
                    MenuId: item.Menu.MenuId,
                    SubMenuId: subMenuId,
                },
            });

            if (existingAssignment) {
                // If an assignment exists, update it
                await prisma.webUserRight.update({
                    where: { id: existingAssignment.id },
                    data: {
                        isAccess: true,
                        canView: canView || existingAssignment.canView,
                    },
                });
            } else {
                // If no assignment exists, create a new one
                await prisma.webUserRight.create({
                    data: {
                        userId:userId as string,
                        Role: roleValue,
                        MenuId: item.Menu.MenuId,
                        SubMenuId: subMenuId,
                        isAccess: true,
                        canView: canView || false,
                    },
                });
            }
        }
       
        res.status(201).json({
            success: true,
            message:"Menu assigned to role successfully",
            existingAssignment
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message:"assigning menu to role failed",
            error: error
        });
    }
}



export const GetMenuWithSubMenu= async (req:CustomRequest,res:Response)=>{
    try {
       
        
        const SideBarList=await prisma.menu.findMany({
             
            select: {
                MenuName: true,
                Icon: true,
                Priority: true,
                SubMenus: {
                    
                    select: {
                        SubMenuName: true,
                        Icon: true,
                        Routes: true,
                        Priority: true,
                    },
                },
            },

        });

      

        res.status(200).json({
            success: true,
            message:"fetching sidebar successful",
            SideBarList
        });
    }

       

    catch(error){
        res.status(500).json({
            success: false,
            message:"fetching sidebar failed",
            error: error
        });
    }
}
/**
 * Create a new SubMenu under an existing Menu
 */