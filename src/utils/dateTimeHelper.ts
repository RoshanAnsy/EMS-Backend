import moment from 'moment-timezone';

// Enhanced date utilities with edge case handling
export class DateTimeHelper {
    private static IST_TIMEZONE = 'Asia/Kolkata';
    
    // Convert IST date boundaries to UTC with edge case handling
    static createISTDateRange(dateString: string): { startOfDay: Date; endOfDay: Date } {
        try {
            // Parse date in IST timezone explicitly
            const istMoment = moment.tz(dateString, 'YYYY-MM-DD', this.IST_TIMEZONE);
            
            if (!istMoment.isValid()) {
                throw new Error(`Invalid date format: ${dateString}`);
            }
            
            return {
                startOfDay: istMoment.clone().startOf('day').utc().toDate(),
                endOfDay: istMoment.clone().endOf('day').utc().toDate(),
            };
        } catch (error) {
            throw new Error(`Date parsing error: ${error}`);
        }
    }
    
    // Handle date range with validation
    static createDateRangeFilter(startDate?: string, endDate?: string) {
        const filter: any = {};
        
        try {
            if (startDate) {
                const { startOfDay } = this.createISTDateRange(startDate);
                filter.gte = startOfDay;
            }
            
            if (endDate) {
                const { endOfDay } = this.createISTDateRange(endDate);
                filter.lte = endOfDay;
            }
            
            // Validate date range logic
            if (startDate && endDate) {
                const start = moment.tz(startDate, 'YYYY-MM-DD', this.IST_TIMEZONE);
                const end = moment.tz(endDate, 'YYYY-MM-DD', this.IST_TIMEZONE);
                
                if (start.isAfter(end)) {
                    throw new Error('Start date cannot be after end date');
                }
                
                // Prevent too large date ranges (optional performance check)
                const daysDiff = end.diff(start, 'days');
                if (daysDiff > 365) {
                    throw new Error('Date range cannot exceed 365 days');
                }
            }
            
            return Object.keys(filter).length > 0 ? filter : undefined;
        } catch (error) {
            throw new Error(`Date range filter error: ${error}`);
        }
    }
    
    // Format UTC date to IST for display
    static formatToIST(utcDate: Date): string {
        return moment(utcDate).tz(this.IST_TIMEZONE).format('DD/MM/YYYY, hh:mm:ss A');
    }
    
    // Format UTC date to IST date only
    static formatDateToIST(utcDate: Date): string {
        return moment(utcDate).tz(this.IST_TIMEZONE).format('DD/MM/YYYY');
    }
    
    // Check if a UTC time falls on IST date (handles midnight edge cases)
    static isOnISTDate(utcDateTime: Date, istDateString: string): boolean {
        const { startOfDay, endOfDay } = this.createISTDateRange(istDateString);
        return utcDateTime >= startOfDay && utcDateTime <= endOfDay;
    }
}