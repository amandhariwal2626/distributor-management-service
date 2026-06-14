import { IsUUID, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetAttributeValueDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  attributeId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value!: string;
}
