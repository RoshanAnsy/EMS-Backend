export interface AttendanceTypes {
    Location:string;
    
    Type:string
}

export interface AttendanceRecord {
    id: string;
    UserId: string;
    punchInTime: string;
    punchOutTime: string | null;
    PunchInLocation: string | null;
    punchOutLocation: string | null;
    status: string;
    user?: {
        Name: string | null;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}