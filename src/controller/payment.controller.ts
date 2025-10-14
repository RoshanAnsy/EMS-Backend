import { Response } from "express";
import { prisma } from "..";
// import { AttendanceTypes } from "../types/attendance.types";
// import { PunchInZodSchema, PunchOutZodSchema } from "../utils/zod.validate";
// import {  formatTime } from "../utils/formatDateTime";
import { CustomRequest } from "../middleware/auth.middleware";



export const GetUserDetailsWithBankDetails = async (req: CustomRequest, res: Response) => {
    try {
        const {customerID,fromDate,toDate}=req.body;
        // const userId = req.userId;

        if(!customerID || !fromDate || !toDate){
            res.status(401).json({ message: "customerID missing" });
            return;
        }


        // if (!userId) {
        //     res.status(401).json({ message: "Unauthorized: User ID missing" });
        //     return;
        // }
        const user = await prisma.user.findUnique({
            where: { id: customerID },
            select: {   
                id: true,
                name: true,
                email: true,    
                role: true,
                EmplyID: true,
                MobileNo: true,
                BankDetails:{
                    where:{ isActive:true },
                    select:{
                        id:true,
                        bankName:true,
                        branch:true,
                        accountNo:true,
                        IFSCode:true,
                        
                    },
                },
                TargetTasks:{
                    where:{ isActive:true },
                    select:{
                        TargetTaskID:true,
                        TaskStartedAt:true,
                        TaskCompletedAt:true,
                        TotalAmountTarget:true,
                        TotalTarget:true,
                        TotalUnits:true,
                        companyName:true,
                        TaskType:true,
                    }

                },
                task:{
                    where:{ 
                        isActive:true,
                        status:"COMPLETED"
                    },
                    select:{
                        id:true,
                        title:true,
                        description:true,
                        TaskStartedAt:true,
                        TaskCompletedAt:true,
                        TotalReceivedAmount:true,
                        TotalProjectCost:true,
                        TotalUnits:true,
                        companyName:true,
                        PerUnitCost:true,
                        TaskBalanceAmount:true,
                        MobileNo:true,
                        clientName:true,
                        city:true,
                        state:true,
                        country:true,
                    }
                }
                  
            },
        });

        const totalPunches = await prisma.attendance.count({
            where: {
                UserId: customerID,
                isActive: true,
                createdAt: {
                    gte:new Date(fromDate), // start date
                    lte:new Date(toDate) ,     // end date
                },
            }
            
        });

        // const TotalTargetDetail=


        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({
            user,
            totalPunches
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const MakePaymentToUser = async (req: CustomRequest, res: Response) => {
    try {
        const {customerID,FixAmount,VariableAmount,totalAmount,remark,
            Tds,AnyTax,TravelCost,OtherCost,FoodAllowanceCost,medicleInsuranceCost,
            PFAmount,GratuityAmount,LaultyAmount,MisleneousAmount
        }=req.body;
        const userId = req.userId;
        if(!userId){
            res.status(401).json({ message: "Unauthorized: User ID missing" });
            return;
        }

        if(!customerID || !totalAmount){
            res.status(401).json({ message: "customerID or totalAmount missing" });
            return;
        }
        const payment=await prisma.payment.create({
            data:{
                PaidBy:userId,
                PaidTo:customerID,
                FixAmount:Number(FixAmount) || 0,
                VariableAmount:Number(VariableAmount) || 0,
                totalAmount:Number(totalAmount),
                remark:remark,
                Tds:Number(Tds) || 0,
                AnyTax:Number(AnyTax) || 0,
                TravelCost:Number(TravelCost) || 0,
                OtherCost:Number(OtherCost) || 0,
                FoodAllowanceCost:Number(FoodAllowanceCost) || 0,
                medicleInsuranceCost:Number(medicleInsuranceCost) || 0,
                PFAmount:Number(PFAmount) || 0,
                GratuityAmount:Number(GratuityAmount) || 0,
                LaultyAmount:Number(LaultyAmount) || 0,
                MisleneousAmount:Number(MisleneousAmount) || 0,
            }
        });

        res.status(200).json({ message: "Payment successful", success:true,payment });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const GetPaymentList= async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.userId;
        if(!userId){
            res.status(401).json({ message: "Unauthorized: User ID missing" });
            return;
        }
        const paymentList=await prisma.payment.findMany({
            where:{  
                isActive:true
            },
            select:{
                id:true,
                FixAmount:true,
                VariableAmount:true,
                totalAmount:true,
                remark:true,
                Tds:true,
                AnyTax:true,
                TravelCost:true,
                OtherCost:true,
                FoodAllowanceCost:true,
                medicleInsuranceCost:true,
                PFAmount:true,
                GratuityAmount:true,
                LaultyAmount:true,
                MisleneousAmount:true,
                paidAt:true,
                paidToUser:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        EmplyID:true,
                        MobileNo:true,
                    }
                },
                paidByUser:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        EmplyID:true,
                        MobileNo:true,
                    }
                }
            },
            orderBy:{
                paidAt:'desc'
            }
        });
        res.status(200).json({
            success:true,
            paymentList 
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Internal server error" });
    }   
};



export const GetPaymentListForEmp= async (req: CustomRequest, res: Response) => {
    try {

        const userId = req.userId;
        if(!userId){
            res.status(401).json({ message: "Unauthorized: User ID missing" });
            return;
        }
        const paymentList=await prisma.payment.findMany({
            where:{ 
                PaidTo:userId, 
                isActive:true
            },
            select:{
                id:true,
                FixAmount:true,
                VariableAmount:true,
                totalAmount:true,
                remark:true,
                Tds:true,
                AnyTax:true,
                TravelCost:true,
                OtherCost:true,
                FoodAllowanceCost:true,
                medicleInsuranceCost:true,
                PFAmount:true,
                GratuityAmount:true,
                LaultyAmount:true,
                MisleneousAmount:true,
                paidAt:true,
                
                paidByUser:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        EmplyID:true,
                        MobileNo:true,
                    }
                }
            },
            orderBy:{
                paidAt:'desc'
            }
        });
        res.status(200).json({ paymentList });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Internal server error" });
    }   
};

export const DeletePayment = async (req:CustomRequest,res:Response)=>{
    try{
        const {payMentID}=req.body;
        const userId=req.userId;
        if(!userId){
            res.status(401).json({ message: "Unauthorized: User ID missing" });
            return;
        }
        if(!payMentID){
            res.status(401).json({ message: "payMent ID missing" });
            return;
        }

        const result= await prisma.payment.delete({where:{id:payMentID}});

        if(!result){
            res.status(402).json({ message: "Payment does not deleted" });
            return;
        }
        res.status(200).json({
            message:"payment deleted successfully",
            success:true,
        })
        return;

    }
    catch(err){
        console.error("Error fetching user details:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}




export const UpdatePaymentReceiptSetting = async (req: CustomRequest, res: Response) => {
    try {
        const userId=req.userId;
        const {
            
            FixAmount = false,
            VariableAmount = false,
            TotalAmount = false,
            Tds = false,
            AnyTax = false,
            TravelCost = false,
            OtherCost = false,
            FoodAllowanceCost = false,
            MedicleInsuranceCost = false,
            PFAmount = false,
            GratuityAmount = false,
            LaultyAmount = false,
            MisleneousAmount = false,
            
        } = req.body;
       
        if(!userId){
            res.status(401).json({
                message:"userId is missing ",
            })
            return;
        }


        const PaymentReceiptID='93d9ad4e-9cea-452b-a5a8-9e3ffa004ac5'
        if(!PaymentReceiptID){
            res.status(401).json({
                message:"PaymentReceiptID is missing ",
            })
            return;
        }
        // ✅ If PaymentReceiptID is provided → update existing record
        
        const updatedReceipt = await prisma.paymentReceipt.update({
            where: { PaymentReceiptID },
            data: {
                FixAmount,
                VariableAmount,
                TotalAmount,
                Tds,
                AnyTax,
                TravelCost,
                OtherCost,
                FoodAllowanceCost,
                MedicleInsuranceCost,
                PFAmount,
                GratuityAmount,
                LaultyAmount,
                MisleneousAmount,
                updatedBY:userId
            },
        });

        res.status(200).json({
            success: true,
            message: "Payment receipt updated successfully",
            data: updatedReceipt,
        });
        

        // ✅ Otherwise, create a new PaymentReceipt record
       
    } catch (error) {
        // console.error("❌ Error creating/updating PaymentReceipt:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: (error as Error).message,
        });
    }
};

export const CreatePaymentReceiptSetting = async (req: CustomRequest, res: Response) => {
    try {
        const userId=req.userId;
        const {
            
            FixAmount = false,
            VariableAmount = false,
            TotalAmount = false,
            Tds = false,
            AnyTax = false,
            TravelCost = false,
            OtherCost = false,
            FoodAllowanceCost = false,
            MedicleInsuranceCost = false,
            PFAmount = false,
            GratuityAmount = false,
            LaultyAmount = false,
            MisleneousAmount = false,
            
        }:{
            FixAmount :boolean,
            VariableAmount :boolean,
            TotalAmount :boolean,
            Tds :boolean,
            AnyTax:boolean,
            TravelCost:boolean,
            OtherCost :boolean,
            FoodAllowanceCost:boolean,
            MedicleInsuranceCost :boolean,
            PFAmount:boolean,
            GratuityAmount:boolean,
            LaultyAmount :boolean,
            MisleneousAmount :boolean,
            
        } = req.body;
        if(!userId){
            res.status(401).json({
                message:"userId is missing ",
            })
            return;
        }
        // ✅ If PaymentReceiptID is provided → update existing record
        
        const newReceipt = await prisma.paymentReceipt.create({
            data: {
                FixAmount,
                VariableAmount,
                TotalAmount,
                Tds,
                AnyTax,
                TravelCost,
                OtherCost,
                FoodAllowanceCost,
                MedicleInsuranceCost,
                PFAmount,
                GratuityAmount,
                LaultyAmount,
                MisleneousAmount,
                updatedBY:userId as string
            },
        });

        res.status(201).json({
            success: true,
            message: "Payment receipt created successfully",
            data: newReceipt,
        });
        
        

        // ✅ Otherwise, create a new PaymentReceipt record
       
    } catch (error) {
        console.error("❌ Error creating/updating PaymentReceipt:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: (error as Error).message,
        });
    }
};

export const FindPaymentReceiptSetting = async (req: CustomRequest, res: Response) => {
    try {
        const userId=req.userId;
 
        if(!userId){
            res.status(401).json({
                message:"userId is missing ",
            })
            return;
        }
        // ✅ If PaymentReceiptID is provided → update existing record
        
        const Receipt = await prisma.paymentReceipt.findFirst({
            select:{
                FixAmount:true,
                VariableAmount:true,
                TotalAmount:true,
                Tds:true,
                AnyTax:true,
                TravelCost:true,
                OtherCost:true,
                FoodAllowanceCost:true,
                MedicleInsuranceCost:true,
                PFAmount:true,
                GratuityAmount:true,
                LaultyAmount:true,
                MisleneousAmount:true,
            }
        });

        res.status(201).json({
            success: true,
            message: "Payment receipt get successfully",
            Receipt
        });
        
        

        // ✅ Otherwise, create a new PaymentReceipt record
       
    } catch (error) {
        console.error("❌ Error creating/updating PaymentReceipt:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: (error as Error).message,
        });
    }
};


export const GetPaymentDetails= async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.userId;
        const {PayMentId}=req.query;
        if(!userId){
            res.status(401).json({ message: "Unauthorized: User ID missing" });
            return;
        }
        if(!PayMentId){
            res.status(401).json({ message: "PayMentId missing" });
            return;
        }
        const paymentD=await prisma.payment.findFirst({
            where:{  
                isActive:true,
                id:PayMentId as string
            },
            select:{
                id:true,
                FixAmount:true,
                VariableAmount:true,
                totalAmount:true,
                remark:true,
                Tds:true,
                AnyTax:true,
                TravelCost:true,
                OtherCost:true,
                FoodAllowanceCost:true,
                medicleInsuranceCost:true,
                PFAmount:true,
                GratuityAmount:true,
                LaultyAmount:true,
                MisleneousAmount:true,
                paidAt:true,
                paidToUser:{
                    select:{
                        name:true,
                        EmplyID:true,
                        role:true,
                        MobileNo:true,
                        DateOfJoining:true,
                    }
                }
                
            }
            
        });
        res.status(200).json({
            success:true,
            paymentD 
        });
        return;
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Internal server error" });
    }   
};