import express  from "express";
import { GetSideBar,addMenu,addSubMenu,GetMenuWithSubMenu,AssignMenuToRole } from "../controller/sidebar.controller";

// export const sidebarRouter=Router();
export const MenuRouter= express.Router();

MenuRouter.get('/getSidebar',GetSideBar);
MenuRouter.post('/addMenu',addMenu);
MenuRouter.post('/addSubMenu',addSubMenu);
MenuRouter.get('/getMenuWithSubMenu',GetMenuWithSubMenu);
MenuRouter.post('/assignMenuToRole',AssignMenuToRole);