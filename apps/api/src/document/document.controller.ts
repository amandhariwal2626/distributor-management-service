import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Permissions } from '../decorators/permissions.decorator';
import { PermissionsGuard } from '../guards/permissions.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { DocumentService } from './document.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto';

@ApiTags('Document Management')
@Controller('documents')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @Permissions('documents.upload')
  @ApiOperation({ summary: 'Create a document for a product' })
  create(
    @Req() req: { user: { sub: string } },
    @Body() dto: CreateDocumentDto,
    @Headers('x-organization-id') organizationId: string,
  ) {
    return this.documentService.create(dto, req.user.sub, organizationId);
  }

  @Get()
  @Permissions('documents.read')
  @ApiOperation({
    summary: 'List documents, filterable by productId and documentType',
  })
  findAll(
    @Query('productId') productId?: string,
    @Query('documentType') documentType?: string,
  ) {
    return this.documentService.findAll(productId, documentType);
  }

  @Get(':id')
  @Permissions('documents.read')
  @ApiOperation({ summary: 'Get a document by ID' })
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(id);
  }

  @Patch(':id')
  @Permissions('documents.update')
  @ApiOperation({ summary: 'Update document metadata' })
  update(
    @Param('id') id: string,
    @Req() req: { user: { sub: string } },
    @Body() dto: UpdateDocumentDto,
  ) {
    return this.documentService.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  @Permissions('documents.delete')
  @ApiOperation({ summary: 'Soft delete a document' })
  remove(@Param('id') id: string, @Req() req: { user: { sub: string } }) {
    return this.documentService.remove(id, req.user.sub);
  }
}
