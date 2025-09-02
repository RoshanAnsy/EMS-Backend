import { Response, Request } from "express";
import { prisma } from "..";
import { AttendanceTypes, AttendanceRecord } from "../types/attendance.types";
import { PunchInZodSchema, PunchOutZodSchema } from "../utils/zod.validate";
import { formatDate, formatTime } from "../utils/formatDateTime";
import { CustomRequest } from "../middleware/auth.middleware";
import { DateTimeHelper } from "../utils/dateTimeHelper";


import { getQueryParamAsString } from "../utils/queryUtils";
import { QueryOptimizer } from "../utils/queryOptimize";


export const markAttendance = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { PunchInLocation, PunchOutLocation }: AttendanceTypes = req.body;
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                error: "Unauthorized: User ID is missing",
            });
            return;
        }

        // Determine if this is punch in or punch out
        const isPunchIn = PunchInLocation && !PunchOutLocation;
        const isPunchOut = PunchOutLocation && !PunchInLocation;

        if (!isPunchIn && !isPunchOut) {
            res.status(400).json({
                success: false,
                error: "Provide either PunchInLocation for punch in OR PunchOutLocation for punch out",
            });
            return;
        }

        // Validate based on operation type
        if (isPunchIn) {
            const zodResponse = PunchInZodSchema.safeParse({ PunchInLocation });
            if (!zodResponse.success) {
                res.status(400).json({
                    success: false,
                    error: zodResponse.error.issues,
                });
                return;
            }
        } else {
            const zodResponse = PunchOutZodSchema.safeParse({ PunchOutLocation });
            if (!zodResponse.success) {
                res.status(400).json({
                    success: false,
                    error: zodResponse.error.issues,
                });
                return;
            }
        }

        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            res.status(404).json({
                success: false,
                error: "User not found",
            });
            return;
        }

        // Get today's date (start and end of the day)
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const todaysPunchIn = await prisma.attendance.findFirst({
            where: {
                UserId: userId,
                PunchInTime: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });

        if (isPunchIn) {
            // Punch In Logic
            if (todaysPunchIn) {
                res.status(400).json({
                    success: false,
                    message: "You have already punched in today.",
                });
                return;
            }

            // Create punch-in record
            const newAttendance = await prisma.attendance.create({
                data: {
                    UserId: userId,
                    PunchInTime: new Date(),
                    PunchInLocation: PunchInLocation,
                    PunchOutTime: new Date(), // Handle based on your schema requirements
                    punchOutLocation: "",
                    status: 'PRESENT',
                },
            });

            res.status(200).json({
                success: true,
                message: "Punch In Successful.",
                // data: newAttendance
            });

        } else {
            // Punch Out Logic
            if (!todaysPunchIn) {
                res.status(400).json({
                    success: false,
                    message: "No active punch-in found.",
                });
                return;
            }

            if (todaysPunchIn.punchOutLocation && todaysPunchIn.punchOutLocation !== "") {
                res.status(400).json({
                    success: false,
                    message: "You have already punched out today.",
                });
                return;
            }

            // Update punch-out record
            const updatedAttendance = await prisma.attendance.update({
                where: { id: todaysPunchIn.id },
                data: {
                    PunchOutTime: new Date(),
                    punchOutLocation: PunchOutLocation,
                }
            });

            res.status(200).json({
                success: true,
                message: "Punch Out Successful.",
                // data: updatedAttendance
            });
        }

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

// Controller for admin to see any employee's attendance data
// export const getUserAttendance = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { userId } = req.params;
//         const { date, page = '1', limit = '10' } = req.query;

//         // Parse pagination params
//         const pageNum = parseInt(page as string, 10);
//         const limitNum = parseInt(limit as string, 10);
//         const offset = (pageNum - 1) * limitNum;

//         if (!userId) {
//             res.status(400).json({
//                 success: false,
//                 error: "User ID is required.",
//             });
//             return;
//         }

//         // Check if user exists
//         const user = await prisma.user.findUnique({
//             where: { id: userId },
//         });

//         if (!user) {
//             res.status(404).json({
//                 success: false,
//                 error: "User not found.",
//             });
//             return;
//         }

//         // Handle date filter with proper IST to UTC conversion
//         let punchInTimeFilter = undefined;
        
//         if (date) {
//             // Parse the date and set IST boundaries
//             const dateIST = new Date(date as string);
//             const startOfDayIST = new Date(dateIST);
//             startOfDayIST.setHours(0, 0, 0, 0);
//             const endOfDayIST = new Date(dateIST);
//             endOfDayIST.setHours(23, 59, 59, 999);
            
//             // Convert IST to UTC for DB query
//             const startOfDayUTC = new Date(startOfDayIST.getTime() - (5.5 * 60 * 60 * 1000));
//             const endOfDayUTC = new Date(endOfDayIST.getTime() - (5.5 * 60 * 60 * 1000));
            
//             punchInTimeFilter = {
//                 gte: startOfDayUTC,
//                 lte: endOfDayUTC,
//             };
//         }

//         const whereCondition = {
//             UserId: userId,
//             PunchInTime: punchInTimeFilter,
//         };

//         // Get total count for pagination
//         const totalRecords = await prisma.attendance.count({
//             where: whereCondition,
//         });

//         const attendance = await prisma.attendance.findMany({
//             where: whereCondition,
//             include: {
//                 user: {
//                     select: {
//                         name: true,
//                         email: true
//                     },
//                 },
//             },
//             orderBy: {
//                 PunchInTime: 'desc', // Newest first
//             },
//             skip: offset,
//             take: limitNum,
//         });

//         // Format the time fields to Indian timezone
//         const formattedAttendance = attendance.map(record => ({
//             id: record.id,
//             UserId: record.UserId,
//             PunchInTime: formatTime(record.PunchInTime),
//             PunchOutTime: record.PunchOutTime ? formatTime(record.PunchOutTime) : record.PunchOutTime,
//             PunchInLocation: record.PunchInLocation,
//             punchOutLocation: record.punchOutLocation,
//             status: record.status,
//             createdAt: formatTime(record.createdAt),
//             updatedAt: formatTime(record.updatedAt),
//             isActive: record.isActive,
//             user: record.user,
//         }));

//         res.status(200).json({
//             success: true,
//             message: "User attendance data fetched successfully.",
//             data: formattedAttendance,
//             pagination: {
//                 currentPage: pageNum,
//                 totalPages: Math.ceil(totalRecords / limitNum),
//                 totalRecords,
//                 hasNext: pageNum < Math.ceil(totalRecords / limitNum),
//                 hasPrev: pageNum > 1,
//             },
//         });
//     } catch (error) {
//         console.error("Error fetching user attendance:", error);
//         res.status(500).json({
//             success: false,
//             error: "Internal Server Error",
//         });
//     }
// };


export const getAttendanceEnhanced = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { startDate, endDate } = req.query;
        const page = getQueryParamAsString(req.query.page) ?? "1";
        const limit = getQueryParamAsString(req.query.limit) ?? "10";

        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized: User ID not found." });
            return;
        }

        const { pageNum, limitNum, offset } = QueryOptimizer.getPaginationLimits(page, limit);


        // Check if user exists (with caching if needed)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true }
        });

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found.",
            });
            return;
        }

        // Create optimized date filter
        const punchInTimeFilter = DateTimeHelper.createDateRangeFilter(
            startDate as string, 
            endDate as string
        );

        const whereCondition = {
            UserId: userId,
            isActive: true, // Only get active records
            ...(punchInTimeFilter && { PunchInTime: punchInTimeFilter })
        };

        // Get optimized count
        const { count: totalRecords, isApproximate } = await QueryOptimizer.getOptimizedCount(
            prisma.attendance, 
            whereCondition
        );

        

        // Fetch attendance data with optimized query
        const attendanceData = await prisma.attendance.findMany({
            where: whereCondition,
            select: {
                id: true,
                PunchInTime: true,
                PunchOutTime: true,
                PunchInLocation: true,
                punchOutLocation: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                PunchInTime: 'desc',
            },
            skip: offset,
            take: limitNum,
        });

        // Group attendance data by IST date
        const groupedData: Record<string, any[]> = {};

        attendanceData.forEach((record) => {
            const istDate = DateTimeHelper.formatDateToIST(record.PunchInTime);
            const punchInTime = DateTimeHelper.formatToIST(record.PunchInTime);
            const punchOutTime = record.PunchOutTime ? DateTimeHelper.formatToIST(record.PunchOutTime) : null;

            if (!groupedData[istDate]) {
                groupedData[istDate] = [];
            }

            groupedData[istDate].push({
                // id: record.id,
                punchInTime,
                punchOutTime,
                PunchInLocation: record.PunchInLocation,
                punchOutLocation: record.punchOutLocation,
                status: record.status,
                // user: record.user,
                // createdAt: DateTimeHelper.formatToIST(record.createdAt),
                // updatedAt: DateTimeHelper.formatToIST(record.updatedAt),
            });
        });

        const totalPages = Math.ceil(totalRecords / limitNum);

        res.status(200).json({
            success: true,
            message: "Attendance data fetched successfully.",
            data: groupedData,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalRecords,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1,
                isApproximate,
            },
        });

    } catch (error) {
        console.error("Error in getAttendance:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


export const getUserAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const date = getQueryParamAsString(req.query.date);

    const page = getQueryParamAsString(req.query.page) ?? "1";
    const limit = getQueryParamAsString(req.query.limit) ?? "10";

    // Parse pagination with QueryOptimizer
    const { pageNum, limitNum, offset } = QueryOptimizer.getPaginationLimits(page, limit);

    if (!userId) {
      res.status(400).json({
        success: false,
        error: "User ID is required.",
      });
      return;
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found.",
      });
      return;
    }

    // Handle date filter with helper
    const punchInTimeFilter = date
      ? DateTimeHelper.createDateRangeFilter(date, date) // single date range
      : undefined;

    const whereCondition = {
      UserId: userId,
      ...(punchInTimeFilter && { PunchInTime: punchInTimeFilter }),
    };

    // Optimized count
    const { count: totalRecords, isApproximate } = await QueryOptimizer.getOptimizedCount(
      prisma.attendance,
      whereCondition
    );

    // Fetch attendance
    const attendance = await prisma.attendance.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        PunchInTime: "desc", // newest first
      },
      skip: offset,
      take: limitNum,
    });

    // Format time to IST
    const formattedAttendance = attendance.map((record) => ({
      PunchInTime: formatTime(record.PunchInTime),
      PunchOutTime: record.PunchOutTime ? formatTime(record.PunchOutTime) : null,
      PunchInLocation: record.PunchInLocation,
      punchOutLocation: record.punchOutLocation,
      status: record.status,
    //   isActive: record.isActive,
    }));

    const totalPages = Math.ceil(totalRecords / limitNum);

    res.status(200).json({
      success: true,
      message: "User attendance data fetched successfully.",
      data: formattedAttendance,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalRecords,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
        isApproximate,
      },
    //   meta: {
    //     timezone: "Asia/Kolkata",
    //     dateFormat: "DD/MM/YYYY, hh:mm:ss A",
    //   },
    });
  } catch (error) {
    console.error("Error fetching user attendance:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};