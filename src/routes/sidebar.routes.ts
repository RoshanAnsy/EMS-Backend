
import express  from "express";
import {getUnassignedMenusWithSubMenus,getALLWebRightsEntry,
    GetSubMenu,GetMenu,UpdateMenu,UpdateSubMenu, addMenu,addSubMenu,GetMenuWithSubMenu,AssignMenuToRole } from "../controller/sidebar.controller";
import { authorization } from "../middleware/auth.middleware";
// import { authorization } from "../middleware/auth.middleware";
// export const sidebarRouter=Router();
export const MenuRouter= express.Router();

MenuRouter.get('/getUnAssignSidebar',getUnassignedMenusWithSubMenus);
MenuRouter.post('/addMenu',addMenu);
MenuRouter.post('/addSubMenu',addSubMenu);
MenuRouter.get('/getMenuWithSubMenu',authorization,GetMenuWithSubMenu);
MenuRouter.post('/assignMenuToRole',AssignMenuToRole);
MenuRouter.get('/getAllWebRightsEntry',getALLWebRightsEntry);
MenuRouter.get('/GetMenu',GetMenu);
MenuRouter.get('/getSubMenu',GetSubMenu);
MenuRouter.put('/updateMenu',UpdateMenu);
MenuRouter.put('/updateSubMenu',UpdateSubMenu);

