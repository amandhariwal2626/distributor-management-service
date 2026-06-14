import { PaginatedResult, PaginationParams } from '../interfaces';

export function paginate<T>(
  data: T[],
  total: number,
  params: PaginationParams,
): PaginatedResult<T> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

export function getPaginationSkip(
  page: number = 1,
  limit: number = 20,
): number {
  return (page - 1) * limit;
}

export function buildOrderBy(
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
): Record<string, 'asc' | 'desc'> {
  if (!sortBy) return { createdAt: 'desc' };
  return { [sortBy]: sortOrder ?? 'desc' };
}
