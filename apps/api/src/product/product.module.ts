import { Module } from '@nestjs/common';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductValidator } from './validators/product.validator';

@Module({
  imports: [AuditLogsModule],
  controllers: [ProductController],
  providers: [ProductService, ProductValidator],
  exports: [ProductService],
})
export class ProductModule {}
