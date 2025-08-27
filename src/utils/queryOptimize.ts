// Query optimization utilities
import { getQueryParamAsString } from "../utils/queryUtils";
// src/utils/queryOptimize.ts

export class QueryOptimizer {
  static getPaginationLimits(page?: string, limit?: string) {
    const pageNum = Math.max(1, parseInt(page ?? "1", 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit ?? "10", 10))); // Max 100 records
    const offset = (pageNum - 1) * limitNum;

    return { pageNum, limitNum, offset };
  }

  static async getOptimizedCount<T>(
    model: { count: (args: { where: T }) => Promise<number> },
    whereCondition: T,
    maxCount: number = 10000
  ): Promise<{ count: number; isApproximate: boolean }> {
    const exactCount = await model.count({ where: whereCondition });

    if (exactCount > maxCount) {
      return { count: maxCount, isApproximate: true };
    }

    return { count: exactCount, isApproximate: false };
  }
}
