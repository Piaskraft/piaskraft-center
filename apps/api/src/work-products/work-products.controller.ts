import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateWorkProductDto } from './dto/create-work-product.dto';
import { WorkProductsService } from './work-products.service';

@Controller('work-products')
export class WorkProductsController {
  constructor(private readonly workProductsService: WorkProductsService) {}

  @Post()
  create(@Body() data: CreateWorkProductDto) {
    return this.workProductsService.create(data);
  }

  @Get()
  findAll() {
    return this.workProductsService.findAll();
  }

  @Get(':productId')
  findOne(@Param('productId', ParseIntPipe) productId: number) {
    return this.workProductsService.findOne(productId);
  }
}
