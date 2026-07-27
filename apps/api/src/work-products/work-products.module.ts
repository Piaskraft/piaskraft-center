import { Module } from '@nestjs/common';
import { WorkProductsController } from './work-products.controller';
import { WorkProductsService } from './work-products.service';

@Module({
  controllers: [WorkProductsController],
  providers: [WorkProductsService]
})
export class WorkProductsModule {}
