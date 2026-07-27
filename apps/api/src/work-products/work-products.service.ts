import { Injectable } from '@nestjs/common';
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
}
