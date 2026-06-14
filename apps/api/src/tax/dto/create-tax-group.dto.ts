import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaxGroupDto {
  @ApiProperty({ description: 'Tax code (e.g., GST18)' })
  @IsString()
  taxCode!: string;

  @ApiProperty({ description: 'Tax name (e.g., GST 18%)' })
  @IsString()
  taxName!: string;

  @ApiProperty({ description: 'CGST rate (%)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  cgst!: number;

  @ApiProperty({ description: 'SGST rate (%)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  sgst!: number;

  @ApiProperty({ description: 'IGST rate (%)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  igst!: number;

  @ApiProperty({ description: 'CESS rate (%)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  cess!: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
