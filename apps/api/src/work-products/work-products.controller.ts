import { Controller, Get } from '@nestjs/common';
import { WorkProductsService } from './work-products.service';

@Controller('work-products')
export class WorkProductsController {
  constructor(private readonly workProductsService: WorkProductsService) {}

  @Get()
  findAll() {
    return this.workProductsService.findAll();
  }
}
