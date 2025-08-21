import { asc, desc } from "drizzle-orm";
import {
  PaginatedResult,
  PaginationOptions,
  createPaginationHelpers,
} from "./pagination";

export interface PaginatedQueryOptions<T> {
  baseQuery: any;
  countQuery: any;
  filters?: any;
  pagination?: PaginationOptions;
  sortBy: any; // Mudando para any para aceitar a referência da coluna
  sortOrder?: "asc" | "desc";
}

export async function executePaginatedQuery<T>({
  baseQuery,
  countQuery,
  filters,
  pagination,
  sortBy,
  sortOrder = "desc",
}: PaginatedQueryOptions<T>): Promise<PaginatedResult<T>> {
  const { page = 1, limit = 10 } = pagination || {};
  const { getOffset, buildPaginatedResult } = createPaginationHelpers();

  const orderByClause =
    sortOrder === "asc" ? asc(sortBy) : desc(sortBy);
  const offset = getOffset(page, limit);

  const [countResult, data] = await Promise.all([
    countQuery.execute(),
    baseQuery.orderBy(orderByClause).limit(limit).offset(offset),
  ]);

  const total = countResult[0]?.count || 0;
  return buildPaginatedResult(data, total, page, limit);
}
