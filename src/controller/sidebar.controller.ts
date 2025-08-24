import { Response,Request } from "express";
import { prisma } from "..";

export const GetSideBar= async (req:Request,res:Response)=>{
    try {
            const SideBarList=prisma.menu.findMany({
               
                select:{
                    MenuName:true,
                    Icon:true,
                    Priority:true,
                    SubMenus:{
                        select:{
                            SubMenuName:true,
                            Icon:true,
                            Routes:true,
                            Priority:true
                        }
                    }
                },

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

