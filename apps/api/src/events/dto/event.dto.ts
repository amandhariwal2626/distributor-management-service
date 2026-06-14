import { IsString, IsObject, IsOptional } from 'class-validator';

export class EventMetadataDto {
  @IsString()
  timestamp!: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  organizationId?: string;

  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;
}

export class PublishEventDto {
  @IsString()
  eventType!: string;

  @IsString()
  aggregateId!: string;

  @IsString()
  aggregateType!: string;

  @IsObject()
  payload!: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metadata?: Partial<EventMetadataDto>;
}
