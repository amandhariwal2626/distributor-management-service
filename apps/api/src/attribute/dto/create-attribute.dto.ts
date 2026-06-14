import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AttributeDataType } from '@prisma/client';

export class CreateAttributeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  attributeName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  attributeCode!: string;

  @ApiProperty({ enum: AttributeDataType })
  @IsEnum(AttributeDataType)
  @IsNotEmpty()
  dataType!: AttributeDataType;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  mandatory?: boolean;
}
