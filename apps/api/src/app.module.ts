import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';
import { NotificationsModule } from './notifications/notifications.module';
import { WorkProductsModule } from './work-products/work-products.module';

@Module({
  imports: [PrismaModule, TasksModule, NotificationsModule, WorkProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
