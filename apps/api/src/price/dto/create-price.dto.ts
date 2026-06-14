import {
  IsUUID,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePriceDto {
  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  productId!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  mrp!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  ptr!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  pts!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  distributorPrice!: number;

  @ApiProperty()
  @IsDateString()
  effectiveFrom!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  effectiveTo?: string;
}
