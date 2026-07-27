import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { WorkProductsService } from './work-products.service';

@Controller('work-products')
export class WorkProductsController {
  constructor(private readonly workProductsService: WorkProductsService) {}

  @Get()
  findAll() {
    return this.workProductsService.findAll();
  }

  @Get(':productId')
  findOne(@Param('productId', ParseIntPipe) productId: number) {
    return this.workProductsService.findOne(productId);
  }
}
