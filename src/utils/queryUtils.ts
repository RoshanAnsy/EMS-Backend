// src/utils/queryUtils.ts
import { ParsedQs } from "qs";

export type QueryParam = string | string[] | ParsedQs | ParsedQs[] | undefined;

export function getQueryParamAsString (param: QueryParam): string | undefined {
    if (Array.isArray(param)) return String(param[0]);
    if (typeof param === "object") return undefined; // ParsedQs ignore
    return param ? String(param) : undefined;
}
