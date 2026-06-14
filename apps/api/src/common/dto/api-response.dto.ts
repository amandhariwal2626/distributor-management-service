import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiMeta {
  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  total!: number;

  @ApiProperty()
  totalPages!: number;

  @ApiProperty()
  hasNextPage!: boolean;

  @ApiProperty()
  hasPreviousPage!: boolean;
}

export class PaginatedResponseDto<T> {
  @ApiProperty()
  success!: boolean;

  items!: T[];

  @ApiProperty()
  meta!: ApiMeta;

  @ApiPropertyOptional()
  message?: string;
}

export class SuccessResponseDto<T> {
  @ApiProperty({ default: true })
  success!: boolean;

  data!: T;

  @ApiPropertyOptional()
  message?: string;
}

export class ErrorResponseDto {
  @ApiProperty({ default: false })
  success!: boolean;

  @ApiProperty()
  message!: string;

  @ApiPropertyOptional({ type: [String] })
  errors?: string[];

  @ApiProperty()
  timestamp!: string;

  @ApiPropertyOptional()
  path?: string;
}
