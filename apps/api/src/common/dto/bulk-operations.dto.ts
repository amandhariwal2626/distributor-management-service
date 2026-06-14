import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class BulkIdsDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  ids!: string[];
}

export class BulkActionResponse {
  @ApiProperty()
  successCount!: number;

  @ApiProperty()
  failureCount!: number;

  @ApiPropertyOptional({ type: [Object] })
  errors?: Array<{ id: string; message: string }>;
}
