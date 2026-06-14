import { Global, Module } from '@nestjs/common';
import { EventPublisherService } from './publishers/event-publisher.service';
import { EventFactoryService } from './event-factory.service';

@Global()
@Module({
  providers: [EventPublisherService, EventFactoryService],
  exports: [EventPublisherService, EventFactoryService],
})
export class EventsModule {}
