import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { SessionsModule } from './sessions/sessions.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuthModule } from './auth/auth.module';
import { InvitesModule } from './invites/invites.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { EventsModule } from './events/events.module';
import { AuditModule } from './audit/audit.module';
import { StorageModule } from './storage/storage.module';
import { ProductModule } from './product/product.module';
import { PriceModule } from './price/price.module';
import { HierarchyModule } from './hierarchy/hierarchy.module';
import { TaxModule } from './tax/tax.module';
import { AttributeModule } from './attribute/attribute.module';
import { DocumentModule } from './document/document.module';
import { RbacModule } from './rbac/rbac.module';
import { ReportingModule } from './reporting/reporting.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 60 }],
    }),
    PrismaModule,
    SessionsModule,
    RolesModule,
    PermissionsModule,
    AuthModule,
    UsersModule,
    InvitesModule,
    AuditLogsModule,
    EventsModule,
    AuditModule,
    StorageModule,
    ProductModule,
    PriceModule,
    HierarchyModule,
    TaxModule,
    AttributeModule,
    DocumentModule,
    RbacModule,
    ReportingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
