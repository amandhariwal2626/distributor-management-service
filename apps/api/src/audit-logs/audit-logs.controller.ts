import { Controller, Get, Headers, Query, UseGuards } from '@nestjs/common';
import { listAuditLogsSchema } from '@dms/validations';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../decorators/permissions.decorator';
import { AuditLogService } from './audit-logs.service';
import type { ListAuditLogsDto } from './dto/list-audit-logs.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AuditLogsController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @Permissions('audit.read')
  findAll(
    @Headers('x-organization-id') organizationId: string,
    @Query(new ZodValidationPipe(listAuditLogsSchema)) query: ListAuditLogsDto,
  ) {
    return this.auditLogService.findAll(organizationId, query);
  }
}
