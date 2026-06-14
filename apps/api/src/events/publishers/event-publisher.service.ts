import { Injectable, Logger, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEvent, IEventPublisher } from '../interfaces/event.interface';

@Injectable()
export class EventPublisherService implements IEventPublisher {
  private readonly logger = new Logger(EventPublisherService.name);
  private handlers = new Map<string, Array<(event: IEvent) => Promise<void>>>();
  private publishedEvents: IEvent[] = [];

  constructor(@Optional() private readonly configService?: ConfigService) {
    const kafkaBroker = this.configService?.get<string>('KAFKA_BROKER');
    if (kafkaBroker) {
      this.logger.log(
        `Kafka broker configured at ${kafkaBroker}. In-process bus active until Kafka adapter is connected.`,
      );
    }
  }

  async publish(event: IEvent): Promise<void> {
    this.publishedEvents.push(event);
    this.logger.debug(
      `Publishing event: ${event.eventType} [${event.eventId}]`,
    );

    const handlers = this.handlers.get(event.eventType) ?? [];
    if (handlers.length === 0) {
      this.logger.warn(
        `No handlers registered for event type: ${event.eventType}`,
      );
    }

    await Promise.all(
      handlers.map((handler) =>
        handler(event).catch((err: Error) => {
          this.logger.error(
            `Handler failed for event ${event.eventType} (${event.eventId}): ${err.message}`,
            err.stack,
          );
        }),
      ),
    );
  }

  async publishMany(events: IEvent[]): Promise<void> {
    await Promise.all(events.map((event) => this.publish(event)));
  }

  subscribe(
    eventType: string,
    handler: (event: IEvent) => Promise<void>,
  ): void {
    const existing = this.handlers.get(eventType) ?? [];
    existing.push(handler);
    this.handlers.set(eventType, existing);
    this.logger.debug(`Handler registered for event type: ${eventType}`);
  }

  removeHandler(
    eventType: string,
    handler: (event: IEvent) => Promise<void>,
  ): void {
    const existing = this.handlers.get(eventType);
    if (existing) {
      const filtered = existing.filter((h) => h !== handler);
      if (filtered.length === 0) {
        this.handlers.delete(eventType);
      } else {
        this.handlers.set(eventType, filtered);
      }
      this.logger.debug(`Handler removed for event type: ${eventType}`);
    }
  }

  getHandlersCount(eventType: string): number {
    return this.handlers.get(eventType)?.length ?? 0;
  }

  getPublishedEvents(): IEvent[] {
    return [...this.publishedEvents];
  }

  clearEvents(): void {
    this.publishedEvents = [];
  }
}
