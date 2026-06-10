import { PaginationDto, PaginatedResult } from '../dto/pagination.dto';
import { SelectQueryBuilder } from 'typeorm';

export async function paginate<T>(query: SelectQueryBuilder<T>, dto: PaginationDto): Promise<PaginatedResult<T>> {
  const { page = 1, limit = 20 } = dto;
  const [data, total] = await query.skip((page - 1) * limit).take(limit).getManyAndCount();
  return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}
