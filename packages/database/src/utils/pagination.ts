export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function createPaginationHelpers() {
  return {
    getOffset: (page: number, limit: number) => (page - 1) * limit,
    getTotalPages: (total: number, limit: number) => Math.ceil(total / limit),
    buildPaginatedResult: <T>(
      data: T[],
      total: number,
      page: number,
      limit: number,
    ): PaginatedResult<T> => ({
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }),
  };
}
