import { Request,Response } from "express";
import { prisma } from "..";
// import { AttendanceTypes } from "../types/attendance.types";
// import { PunchInZodSchema, PunchOutZodSchema } from "../utils/zod.validate";
// import {  formatTime } from "../utils/formatDateTime";
import { CustomRequest } from "../middleware/auth.middleware";
// import { string } from "zod";
// import { DateTimeHelper } from "../utils/dateTimeHelper";
// import GetLocation from ""
// import { GetLocation } from "../utils/GetLocation";

// import { getQueryParamAsString } from "../utils/queryUtils";
// import { QueryOptimizer } from "../utils/queryOptimize";


export const markAttendance = async (req: CustomRequest, res: Response) => {
    try {
        const { Location, Type } = req.body;
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                error: "Unauthorized: User ID is missing",
            });
            return;
        }

        if (!Location || !Type) {
            res.status(401).json({
                success: false,
                error: "Unauthorized: Location and Type are required",
            });
            return;
        }
        // const {address}=await GetLocation(Number(Latitude),Number(Logitude));
        // console.log("this is address",address)
        const PunchInTime:string=Date.now().toString();
        
        const result = await prisma.attendance.create({
            data: {
                Type,
                UserId:userId,
                PunchInLocation:Location,
                PunchInAt:PunchInTime,
                status: "PRESENT",
            },
            select:{
                Type:true,
                id:true
            }
        });
    
        res.status(200).json({
            success: true,
            message: "Punch In successful." ,
            result,
        });
    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
};

export const markPunchOut = async (req: CustomRequest, res: Response) => {
    try {
        const { Location, Type } = req.body;
        const userId = req.userId;
        const id=req.query.id;

        if (!userId || !id) {
            res.status(401).json({
                success: false,
                error: "Unauthorized: User ID is missing",
            });
            return;
        }

        if (!Location|| !Type) {
            res.status(401).json({
                success: false,
                error: "Unauthorized: Location and Type are required",
            });
            return;
        }

        // const {address}=await GetLocation(Number(Latitude),Number(Logitude));
        // console.log("this is address",address)
        const PunchInTime:string=Date.now().toString();
        
        const result = await prisma.attendance.update({
            where:{
                id:id as string
            },
            data: {
                Type,
                UserId:userId,
                punchOutLocation:Location,
                PunchOutAt:PunchInTime,
                status: "PRESENT",
            },
            select:{
                Type:true
            }
        });
    
        res.status(200).json({
            success: true,
            message: "Punch In successful." ,
            result,
        });
    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
};



export const GetPunchOut = async (req: CustomRequest, res: Response) => {
    try {
        // const { Location, Type } = req.body;
        const userId = req.userId;
        // const id=req.query.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                error: "Unauthorized: User ID is missing",
            });
            return;
        }


        // const PunchInTime:string=Date.now().toString();
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        
        const result = await prisma.attendance.findFirst({
            where: {
                UserId: userId,
                createdAt: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
            },
            orderBy: {
                createdAt: "desc", // 👈 latest record
            },
            select: {
                Type: true,
                PunchInAt: true,
                PunchOutAt: true,
                id: true,
            },
        });

    
        res.status(200).json({
            success: true,
            message: "Punch In successful." ,
            result,
        });
    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
};

// Controller for employee to see their own attendance data
// export const getAttendance = async (req: CustomRequest, res: Response): Promise<void> => {
//     try {
//         const { startDate, endDate, page = '1', limit = '10' } = req.query;
//         const userId = req.userId;

//         if (!userId) {
//             res.status(401).json({
//                 success: false,
//                 message: "Unauthorized: User ID not found.",
//             });
//             return;
//         }

//         // Parse pagination params
//         const pageNum = parseInt(page as string, 10);
//         const limitNum = parseInt(limit as string, 10);
//         const offset = (pageNum - 1) * limitNum;

//         // Parse startDate and endDate (if provided)
//         const start = startDate ? new Date(startDate as string) : undefined;
//         const end = endDate ? new Date(endDate as string) : undefined;

//         // Check if user exists
//         const user = await prisma.user.findUnique({
//             where: { id: userId },
//         });

//         if (!user) {
//             res.status(404).json({
//                 success: false,
//                 message: "User not found.",
//             });
//             return;
//         }

//         const punchInTimeFilter: Prisma.DateTimeFilter = {};
//         if (start) punchInTimeFilter.gte = start;
//         if (end) punchInTimeFilter.lte = end;

//         // Get total count for pagination
//         const totalRecords = await prisma.attendance.count({
//             where: {
//                 UserId: userId,
//                 PunchInTime: punchInTimeFilter,
//             },
//         });

//         const attendanceData = await prisma.attendance.findMany({
//             where: {
//                 UserId: userId,
//                 PunchInTime: punchInTimeFilter,
//             },
//             include: {
//                 user: {
//                     select: {
//                         name: true,
//                         email: true,
//                         // Add other user fields you want to include
//                     },
//                 },
//             },
//             orderBy: {
//                 PunchInTime: 'desc', // Newest first
//             },
//             skip: offset,
//             take: limitNum,
//         });

//         // Group attendance data by date
//         const groupedData: Record<string, AttendanceRecord[]> = {};

//         attendanceData.forEach((record) => {
//             const date = formatDate(record.PunchInTime);
//             const punchInTime = formatTime(record.PunchInTime);
//             const punchOutTime = record.PunchOutTime ? formatTime(record.PunchOutTime) : null;

//             if (!groupedData[date]) {
//                 groupedData[date] = [];
//             }

//             groupedData[date].push({
//                 id: record.id,
//                 UserId: record.UserId,
//                 punchInTime,
//                 punchOutTime,
//                 PunchInLocation: record.PunchInLocation,
//                 punchOutLocation: record.punchOutLocation,
//                 status: record.status,
//                 user: record.user,
//                 createdAt: formatTime(record.createdAt),
//                 updatedAt: formatTime(record.updatedAt),
//             });
//         });

//         res.status(200).json({
//             success: true,
//             message: "Attendance data fetched successfully.",
//             data: groupedData,
//             pagination: {
//                 currentPage: pageNum,
//                 totalPages: Math.ceil(totalRecords / limitNum),
//                 totalRecords,
//                 hasNext: pageNum < Math.ceil(totalRecords / limitNum),
//                 hasPrev: pageNum > 1,
//             },
//         });
//     } catch (error) {
//         console.error("Error in getAttendance:", error);
//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//         });
//     }
// };



export const getUserAttendance = async (req: Request, res: Response) => {
    try {
        const { from, to, userId } = req.query as {
      from?: string;
      to?: string;
      userId?: string;
    };

        if (!userId) {
            res.status(400).json({
                success: false,
                error: "User ID is required.",
            });
            return
        }

        // ✅ If no `from` and `to` are provided → take last 1 month
        const now = new Date();
        const defaultFrom = new Date();
        defaultFrom.setMonth(now.getMonth() - 1); // 1 month back

        const startDate = from ? new Date(from) : defaultFrom;
        const endDate = to ? new Date(to) : now;

        const attendance = await prisma.attendance.findMany({
            where: {
                UserId: userId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            
            orderBy: {
                createdAt: "desc", // Newest first
            },
        });

        res.status(200).json({
            success: true,
            message: "User attendance data fetched successfully.",
            attendance,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
            err,
        });
    }
};


// export const getAttendanceEnhanced = async (req: CustomRequest, res: Response): Promise<void> => {
//     try {
//         const { startDate, endDate } = req.query;
//         const page = getQueryParamAsString(req.query.page) ?? "1";
//         const limit = getQueryParamAsString(req.query.limit) ?? "10";

//         const userId = req.userId;
//         if (!userId) {
//             res.status(401).json({ success: false, message: "Unauthorized: User ID not found." });
//             return;
//         }

//         const { pageNum, limitNum, offset } = QueryOptimizer.getPaginationLimits(page, limit);


//         // Check if user exists (with caching if needed)
//         const user = await prisma.user.findUnique({
//             where: { id: userId },
//             select: { id: true, name: true, email: true }
//         });

//         if (!user) {
//             res.status(404).json({
//                 success: false,
//                 message: "User not found.",
//             });
//             return;
//         }

//         // Create optimized date filter
//         const punchInTimeFilter = DateTimeHelper.createDateRangeFilter(
//             startDate as string, 
//             endDate as string
//         );

//         const whereCondition = {
//             UserId: userId,
//             isActive: true, // Only get active records
//             ...(punchInTimeFilter && { PunchInTime: punchInTimeFilter })
//         };

//         // Get optimized count
//         const { count: totalRecords, isApproximate } = await QueryOptimizer.getOptimizedCount(
//             prisma.attendance, 
//             whereCondition
//         );

        

//         // Fetch attendance data with optimized query
//         const attendanceData = await prisma.attendance.findMany({
//             where: whereCondition,
//             select: {
//                 id: true,
//                 PunchInAt: true,
//                 PunchOutAt: true,
//                 PunchInLocation: true,
//                 punchOutLocation: true,
//                 status: true,
//                 createdAt: true,
//                 updatedAt: true,
//                 user: {
//                     select: {
//                         name: true,
//                         email: true,
//                     }
//                 }
//             },
//             orderBy: {
//                 createdAt: 'desc',
//             },
//             skip: offset,
//             take: limitNum,
//         });

//         // Group attendance data by IST date
//         const groupedData: Record<string, any[]> = {};

//         attendanceData.forEach((record) => {
//             const istDate = DateTimeHelper.formatDateToIST(record.PunchInTime);
//             const punchInTime = DateTimeHelper.formatToIST(record.PunchInTime);
//             const punchOutTime = record.PunchOutTime ? DateTimeHelper.formatToIST(record.PunchOutTime) : null;

//             if (!groupedData[istDate]) {
//                 groupedData[istDate] = [];
//             }

//             groupedData[istDate].push({
//                 // id: record.id,
//                 punchInTime,
//                 punchOutTime,
//                 PunchInLocation: record.PunchInLocation,
//                 punchOutLocation: record.punchOutLocation,
//                 status: record.status,
//                 // user: record.user,
//                 // createdAt: DateTimeHelper.formatToIST(record.createdAt),
//                 // updatedAt: DateTimeHelper.formatToIST(record.updatedAt),
//             });
//         });

//         const totalPages = Math.ceil(totalRecords / limitNum);

//         res.status(200).json({
//             success: true,
//             message: "Attendance data fetched successfully.",
//             data: groupedData,
//             pagination: {
//                 currentPage: pageNum,
//                 totalPages,
//                 totalRecords,
//                 hasNext: pageNum < totalPages,
//                 hasPrev: pageNum > 1,
//                 isApproximate,
//             },
//         });

//     } catch (error) {
//         console.error("Error in getAttendance:", error);
//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//         });
//     }
// };

