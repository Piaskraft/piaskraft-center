import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateWorkProductDto } from './dto/create-work-product.dto';
import { UpdateWorkProductDto } from './dto/update-work-product.dto';
import { WorkProductsService } from './work-products.service';

@Controller('work-products')
export class WorkProductsController {
  constructor(private readonly workProductsService: WorkProductsService) {}

  @Post()
  create(@Body() data: CreateWorkProductDto) {
    return this.workProductsService.create(data);
  }
  @Patch(':productId/archive')
  archive(@Param('productId', ParseIntPipe) productId: number) {
    return this.workProductsService.archive(productId);
  }
  @Patch(':productId/restore')
  restore(@Param('productId', ParseIntPipe) productId: number) {
    return this.workProductsService.restore(productId);
  }

  @Patch(':productId')
  update(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() data: UpdateWorkProductDto,
  ) {
    return this.workProductsService.update(productId, data);
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
