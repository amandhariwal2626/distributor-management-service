import { Controller, Get, Headers, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../decorators/permissions.decorator';
import { ReportingService } from './reporting.service';
import { ReportQueryDto } from './dto/report-query.dto';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get('products')
  @Permissions('report.read')
  @ApiOperation({ summary: 'Product report with status/category/date filters' })
  @ApiResponse({ status: 200, description: 'Returns aggregated product data' })
  getProductReport(@Query() query: ReportQueryDto) {
    return this.reportingService.getProductReport(query);
  }

  @Get('prices')
  @Permissions('report.read')
  @ApiOperation({ summary: 'Price report with product/status filters' })
  @ApiResponse({ status: 200, description: 'Returns aggregated price data' })
  getPriceReport(@Query() query: ReportQueryDto) {
    return this.reportingService.getPriceReport(query);
  }

  @Get('audit')
  @Permissions('report.read')
  @ApiOperation({ summary: 'Audit log report with entity/action/date filters' })
  @ApiResponse({
    status: 200,
    description: 'Returns aggregated audit log data',
  })
  getAuditReport(
    @Headers('x-organization-id') organizationId: string,
    @Query() query: ReportQueryDto,
  ) {
    return this.reportingService.getAuditReport(organizationId, query);
  }

  @Get('dashboard')
  @Permissions('report.read')
  @ApiOperation({ summary: 'Dashboard summary counts' })
  @ApiResponse({ status: 200, description: 'Returns key metric counts' })
  getDashboardSummary() {
    return this.reportingService.getDashboardSummary();
  }
}
