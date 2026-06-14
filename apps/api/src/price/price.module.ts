import { Module } from '@nestjs/common';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';
import { PriceValidator } from './validators/price.validator';

@Module({
  imports: [AuditLogsModule],
  controllers: [PriceController],
  providers: [PriceService, PriceValidator],
  exports: [PriceService],
})
export class PriceModule {}
