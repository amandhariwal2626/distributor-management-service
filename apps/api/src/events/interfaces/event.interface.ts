export interface IEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  payload: Record<string, unknown>;
  metadata: {
    timestamp: string;
    userId?: string;
    organizationId?: string;
    correlationId?: string;
    ipAddress?: string;
  };
}

export interface IEventPublisher {
  publish(event: IEvent): Promise<void>;
  publishMany(events: IEvent[]): Promise<void>;
}

export interface IEventSubscriber {
  subscribe(eventType: string, handler: (event: IEvent) => Promise<void>): void;
}

export interface IEventHandler<T = unknown> {
  handle(event: IEvent): Promise<T>;
}
