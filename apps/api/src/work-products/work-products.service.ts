import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.workProduct.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(productId: number) {
    const product = await this.prisma.workProduct.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Produkt roboczy nie istnieje.');
    }

    return product;
  }
}
