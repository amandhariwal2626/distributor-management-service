import { Module } from '@nestjs/common';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { AttributeController } from './attribute.controller';
import { AttributeService } from './attribute.service';
import { AttributeValidator } from './validators/attribute.validator';

@Module({
  imports: [AuditLogsModule],
  controllers: [AttributeController],
  providers: [AttributeService, AttributeValidator],
  exports: [AttributeService],
})
export class AttributeModule {}
