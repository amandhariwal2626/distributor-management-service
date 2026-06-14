import { Module } from '@nestjs/common';
import { HierarchyController } from './hierarchy.controller';
import { MastersController } from './masters.controller';
import { HierarchyService } from './hierarchy.service';

@Module({
  controllers: [HierarchyController, MastersController],
  providers: [HierarchyService],
  exports: [HierarchyService],
})
export class HierarchyModule {}
