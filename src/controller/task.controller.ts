import { Response } from "express";
import { prisma } from "..";
// import { AttendanceTypes } from "../types/attendance.types";
// import { PunchInZodSchema, PunchOutZodSchema } from "../utils/zod.validate";
// import {  formatTime } from "../utils/formatDateTime";
import { CustomRequest } from "../middleware/auth.middleware";
import { TaskPeriod } from "@prisma/client";


export const createTask=async (req:CustomRequest,res:Response)=>{
    try {
        const { title, description, AssignID,pinCode,city,state,MobileNo,Address,companyName,ClientName } = req.body;
        const userId =req.userId;
        console.log(req.body);
        console.log("userId",userId);
        // Validate input
        if (!title || !description || !AssignID || !pinCode || !city || !state || !MobileNo || !Address  || !companyName || !ClientName) {
            res.status(400).json({ message: "All  are required" });
            return;
        }
        if (!userId) {
            res.status(401).json({ message: "Unauthorized: User ID missing" });
            return;
        }

        const NewTask=await prisma.task.create({
            data:{
                title,
                description,
                UserId:userId,
                assignedBy:userId,
                assignedTo:AssignID,
                pinCode,
                city,
                state,
                MobileNo,
                address:Address,
                // TotalProjectCost:Number(projectCost),
                companyName,
                clientName:ClientName
            }
        }); 

        if(!NewTask){
            res.status(500).json({message:"Failed to create task"});
            return;
        }
        res.status(201).json({
            success:true,
            message:"Task created successfully",
            task:NewTask
        });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Internal server error" });
    }


}


export const CompleteTask=async (req:CustomRequest,res:Response)=>{
    try {
        const { taskId,projectCost, TaskStartedAt, TaskCompletedAt,TotalReceivedAmount,
            PerUnitCost,TotalUnits,TaskBalanceAmount,remark } = req.body;
        const userId =req.userId;
       
        
        // Validate input
        if (!taskId || !TaskStartedAt || !projectCost || !TaskCompletedAt || !TotalReceivedAmount || !PerUnitCost || !TotalUnits || !TaskBalanceAmount || !remark) {
            res.status(400).json({ message: "All  are required" });
            return;
        }
        if (!userId) {
            res.status(401).json({ message: "Unauthorized: User ID missing" });
            return;
        }

        const NewTask=await prisma.task.update({
            where:{id:taskId},
            data:{
                status:"INPROGRESS",
                TaskStartedAt:new Date(TaskStartedAt),
                TaskCompletedAt:new Date(TaskCompletedAt),
                TotalReceivedAmount:Number(TotalReceivedAmount),
                PerUnitCost:Number(PerUnitCost),
                TotalUnits:Number(TotalUnits),
                TotalProjectCost:Number(projectCost),
                TaskBalanceAmount:Number(TaskBalanceAmount),
                remark,
                assignedBy:userId,
                
            }
        }); 

        if(!NewTask){
            res.status(500).json({message:"Failed to create task"});
            return;
        }
        res.status(201).json({
            success:true,
            message:"Task updated successfully",
            task:NewTask
        });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Internal server error" });
    }


}

export const GetTasksList=async (req:CustomRequest,res:Response)=>{
    try {
        const userRole=req.role;

        if(!userRole){
            res.status(401).json({message:"Unauthorized: User role missing"});
            return;
        }
        
        const TaskList=await prisma.task.findMany({
            select:{
                id:true,
                title:true,
                description:true,
                status:true,    
                assignee:{
                    select:{
                        id:true,
                        name:true,
                    }},
                assigner:{
                    select:{
                        id:true,
                        name:true,
                    }},
                createdAt:true,
                pinCode:true,
                city:true,
                state:true,
                MobileNo:true,
                address:true,
                TotalProjectCost:true,
                companyName:true,
                clientName:true
            }});
        
        if(!TaskList){
            res.status(404).json({message:"No tasks found"});
            return;
        }
        res.status(200).json({
            success:true,
            TaskList
        });

    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



export const GetInprogressTasksList=async (req:CustomRequest,res:Response)=>{
    try {
        const userRole=req.role;

        if(!userRole){
            res.status(401).json({message:"Unauthorized: User role missing"});
            return;
        }
        
        const TaskList=await prisma.task.findMany({
            where:{status:"INPROGRESS"},
            select:{
                id:true,
                title:true,
                description:true,
                status:true, 
                TaskStartedAt:true,
                TaskCompletedAt:true,
                TotalReceivedAmount:true,
                PerUnitCost:true,
                TotalUnits:true,
                TaskBalanceAmount:true,
                remark:true,     
                assignee:{
                    select:{
                        id:true,
                        name:true,
                    }},
                assigner:{
                    select:{
                        id:true,
                        name:true,
                    }},
                createdAt:true,
                pinCode:true,
                city:true,
                state:true,
                MobileNo:true,
                address:true,
                TotalProjectCost:true,
                companyName:true,
                clientName:true
            }});
        
        if(!TaskList){
            res.status(404).json({message:"No tasks found"});
            return;
        }
        res.status(200).json({
            success:true,
            TaskList
        });

    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const GetCompletedTasksList=async (req:CustomRequest,res:Response)=>{
    try {
        const userRole=req.role;

        if(!userRole){
            res.status(401).json({message:"Unauthorized: User role missing"});
            return;
        }
        
        const TaskList=await prisma.task.findMany({
            where:{status:"COMPLETED"},
            select:{
                id:true,
                title:true,
                description:true,
                status:true, 
                TaskStartedAt:true,
                TaskCompletedAt:true,
                TotalReceivedAmount:true,
                PerUnitCost:true,
                TotalUnits:true,
                TaskBalanceAmount:true,
                remark:true, 
                assignee:{
                    select:{
                        id:true,
                        name:true,
                    }},
                assigner:{
                    select:{
                        id:true,
                        name:true,
                    }},
                createdAt:true,
                pinCode:true,
                city:true,
                state:true,
                MobileNo:true,
                address:true,
                TotalProjectCost:true,
                companyName:true,
                clientName:true
            }});
        
        if(!TaskList){
            res.status(404).json({message:"No tasks found"});
            return;
        }
        res.status(200).json({
            success:true,
            TaskList
        });

    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const GetAssignTasksList=async (req:CustomRequest,res:Response)=>{
    try {
        const userId=req.userId;

        if(!userId){
            res.status(401).json({message:"Unauthorized: User userId missing"});
            return;
        }
        
        const TaskList=await prisma.task.findMany({
            where:{assignedTo:userId},
            select:{
                id:true,
                title:true,
                description:true,
                status:true,    
                assignee:{
                    select:{
                        id:true,
                        name:true,
                    }},
                assigner:{
                    select:{
                        id:true,
                        name:true,
                    }},
                createdAt:true,
                pinCode:true,
                city:true,
                state:true,
                MobileNo:true,
                address:true,
                TotalProjectCost:true,
                companyName:true,
                clientName:true
            }});
        
        if(!TaskList){
            res.status(404).json({message:"No tasks found"});
            return;
        }
        res.status(200).json({
            success:true,
            TaskList
        });

    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const UpdateTaskStatus=async (req:CustomRequest,res:Response)=>{
    try {
        const { taskId, status } = req.body;
        const userId =req.userId;
        if (!taskId || !status) {
            res.status(400).json({ message: "Task ID and status are required" });
            return;
        }
        if (!userId) {
            res.status(401).json({ message: "Unauthorized: User ID missing" });
            return;
        }
        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: { status, assignedBy: userId },
        });
        if (!updatedTask) {
            res.status(404).json({ message: "Task not found" });
            return;
        }   
        res.status(200).json({ success: true, message: "Task status updated", task: updatedTask });
    }
    catch (error) {
        console.error("Error updating task status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



export const CreateTargetTask=async (req:CustomRequest,res:Response)=>{
    try {
        const {TaskStartedAt, TaskCompletedAt,
            TotalAmountTarget,TotalUnits,assignedTo,TaskType,
            remark ,companyName} = req.body;
        const userId =req.userId;
       
        // console.log(TaskStartedAt, TaskCompletedAt,
        //     TotalAmountTarget,TotalTarget,TotalUnits,assignedTo,TaskType,
        //     remark ,companyName);
        // Validate input
        if (!TotalAmountTarget || !TaskStartedAt || !companyName || !TaskCompletedAt || !assignedTo || !TaskType || !TotalUnits || !remark) {
            res.status(400).json({ message: "All  are required" });
            return;
        }
        
        if (!userId) {
            res.status(401).json({ message: "Unauthorized: User ID missing" });
            return;
        }
        console.log("this is calling");
        console.log(userId);
        const NewTask=await prisma.targetTask.create({

            data:{
                TaskType:TaskType as TaskPeriod,
                TaskStartedAt:new Date(TaskStartedAt),
                TaskCompletedAt:new Date(TaskCompletedAt),
                companyName,
                TotalUnits:Number(TotalUnits),
                TotalAmountTarget:Number(TotalAmountTarget),
               
                remark:remark,
                assignedTo:assignedTo as string,
                UserId:userId,
                
            }
        }); 

        if(!NewTask){
            res.status(500).json({message:"Failed to create task"});
            return;
        }
        res.status(201).json({
            success:true,
            message:"Task updated successfully",
            task:NewTask
        });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Internal server error" });
    }


}


export const GetTargetTasksList=async (req:CustomRequest,res:Response)=>{
    try {
        // const userRole=req.role;
        const userId=req.userId;

        // if(!userRole){
        //     res.status(401).json({message:"Unauthorized: User role missing"});
        //     return;
        // }
        if(!userId){
            res.status(401).json({message:"Unauthorized: User userId missing"});
            return;
        }
        const TaskList=await prisma.targetTask.findMany({
            where:{assignedTo:userId},
            select:{    
                TargetTaskID:true,
                TaskType:true,
                TaskStartedAt:true,
                TaskCompletedAt:true,
                TotalUnits:true,
                TotalAmountTarget:true,
                remark:true,
                createdAt:true,
                assignee:{
                    select:{
                        id:true,
                        name:true,
                    }},
                
            }});

        if(!TaskList){
            res.status(404).json({message:"No tasks found"});
            return;
        }
        res.status(200).json({
            success:true,
            TaskList
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



export const GetCompletedTaskDetails=async (req:CustomRequest,res:Response)=>{
    try {
        const { taskId } = req.query;
        const userId=req.userId;  
        
        console.log(taskId);
        console.log("userId",userId);
        // if(!userRole){
        if(!userId){
            res.status(401).json({message:"Unauthorized: User userId missing"});
            return;
        }
        if(!taskId){
            res.status(400).json({message:"Task ID is required"});
            return;
        }
        const TaskDetails=await prisma.task.findUnique({
            where:{id:taskId as string},
            select:{
                id:true,
                title:true,
                description:true,   
                status:true,
                TaskStartedAt:true,
                TaskCompletedAt:true,
                TotalReceivedAmount:true,
                PerUnitCost:true,
                TotalUnits:true,
                TaskBalanceAmount:true,
                remark:true,  
                assignee:{
                    select:{
                        id:true,
                        name:true,
                    }},
                assigner:{
                    select:{
                        id:true,    
                        name:true,
                    }},
                createdAt:true,
                pinCode:true,
                city:true,
                state:true,
                MobileNo:true,
                address:true,
                TotalProjectCost:true,
                companyName:true,
                clientName:true
            }
        }); 
        if(!TaskDetails){
            res.status(404).json({message:"No task found"});
            return;
        }
        res.status(200).json({
            success:true,
            TaskDetails
        });
    } catch (error) {
        console.error("Error fetching task details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const AcceptTask=async (req:CustomRequest,res:Response)=>{
    try {
        const { taskId } = req.body;
        const userId=req.userId;
        if(!userId){
            res.status(401).json({message:"Unauthorized: User userId missing"});
            return;
        }
        if(!taskId){
            res.status(400).json({message:"Task ID is required"});
            return;
        }
        
        const updatedTask=await prisma.task.update({
            where:{id:taskId,status:"INPROGRESS"},
            data:{status:"COMPLETED"}
        });
        res.status(200).json({success:true,message:"Task accepted",updatedTask});
    } catch (error) {
        console.error("Error accepting task:", error);
        res.status(500).json({ message: "Internal server error" });
    }   
}



export const DeleteTask=async (req:CustomRequest,res:Response)=>{
    try {
        const { taskId } = req.body;
        const userId=req.userId;

        
        if(!userId){
            res.status(401).json({message:"Unauthorized: User userId missing"});
            return;
        }
        if(!taskId){
            res.status(400).json({message:"Task ID is required"});
            return;
        }
        
        const updatedTask=await prisma.task.delete({
            where:{id:taskId,status:"PENDING"},
            
        });

        res.status(200).json({success:true,message:"Task Delete successfully",updatedTask});
    } catch (error) {
        console.error("Error accepting task:", error);
        res.status(500).json({ message: "Internal server error" });
    }   
}

