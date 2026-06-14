import { PartialType } from '@nestjs/swagger';
import { CreateTaxGroupDto } from './create-tax-group.dto';

export class UpdateTaxGroupDto extends PartialType(CreateTaxGroupDto) {}
