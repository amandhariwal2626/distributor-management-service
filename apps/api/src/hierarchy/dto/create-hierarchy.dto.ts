import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateProductCategoryDto {
  @ApiProperty({ description: 'Unique code for the category' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  categoryCode!: string;

  @ApiProperty({ description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  categoryName!: string;

  @ApiPropertyOptional({ description: 'Description of the category' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class CreateProductSubCategoryDto {
  @ApiProperty({ description: 'Unique code for the sub-category' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  subCategoryCode!: string;

  @ApiProperty({ description: 'Sub-category name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  subCategoryName!: string;

  @ApiPropertyOptional({ description: 'Description of the sub-category' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: 'Parent category ID' })
  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class CreateBrandDto {
  @ApiProperty({ description: 'Unique code for the brand' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  brandCode!: string;

  @ApiProperty({ description: 'Brand name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  brandName!: string;

  @ApiPropertyOptional({ description: 'Description of the brand' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class CreateManufacturerDto {
  @ApiProperty({ description: 'Unique code for the manufacturer' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  manufacturerCode!: string;

  @ApiProperty({ description: 'Manufacturer name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  manufacturerName!: string;

  @ApiPropertyOptional({ description: 'GST number' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  gstNumber?: string;

  @ApiPropertyOptional({ description: 'Contact person name' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  contactPerson?: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @IsOptional()
  @IsEmail()
  @MaxLength(200)
  email?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ description: 'Address' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class CreateBusinessUnitDto {
  @ApiProperty({ description: 'Unique code for the business unit' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code!: string;

  @ApiProperty({ description: 'Business unit name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({ description: 'Description of the business unit' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class CreateDivisionDto {
  @ApiProperty({ description: 'Unique code for the division' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code!: string;

  @ApiProperty({ description: 'Division name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ description: 'Parent business unit ID' })
  @IsUUID()
  @IsNotEmpty()
  businessUnitId!: string;

  @ApiPropertyOptional({ description: 'Description of the division' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class CreateSubBrandDto {
  @ApiProperty({ description: 'Unique code for the sub-brand' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code!: string;

  @ApiProperty({ description: 'Sub-brand name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ description: 'Parent brand ID' })
  @IsUUID()
  @IsNotEmpty()
  brandId!: string;

  @ApiPropertyOptional({ description: 'Description of the sub-brand' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class CreateUomDto {
  @ApiProperty({ description: 'Unique code for the UOM' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  uomCode!: string;

  @ApiProperty({ description: 'UOM name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  uomName!: string;

  @ApiPropertyOptional({ description: 'Description of the UOM' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
