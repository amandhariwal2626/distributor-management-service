import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IEvent } from './interfaces/event.interface';

@Injectable()
export class EventFactoryService {
  createEvent(
    eventType: string,
    aggregateId: string,
    aggregateType: string,
    payload: Record<string, unknown>,
    metadata?: {
      userId?: string;
      organizationId?: string;
      correlationId?: string;
      ipAddress?: string;
    },
  ): IEvent {
    return {
      eventId: uuidv4(),
      eventType,
      aggregateId,
      aggregateType,
      payload,
      metadata: {
        timestamp: new Date().toISOString(),
        ...metadata,
        correlationId: metadata?.correlationId ?? uuidv4(),
      },
    };
  }

  createFromExisting(
    event: IEvent,
    newPayload?: Record<string, unknown>,
  ): IEvent {
    return {
      ...event,
      eventId: uuidv4(),
      payload: newPayload ?? { ...event.payload },
      metadata: {
        ...event.metadata,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
