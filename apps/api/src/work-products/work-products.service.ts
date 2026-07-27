import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkProductDto } from './dto/create-work-product.dto';

@Injectable()
export class WorkProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateWorkProductDto) {
    if (!data.targetPresta && !data.targetEbay) {
      throw new BadRequestException(
        'Produkt musi być przeznaczony do PrestaShop, eBay lub obu kanałów.',
      );
    }

    const duplicate = await this.prisma.workProduct.findFirst({
      where: {
        OR: [
          ...(data.ean ? [{ ean: data.ean }] : []),
          ...(data.sku ? [{ source: data.source, sku: data.sku }] : []),
          ...(data.sourceProductId
            ? [
                {
                  source: data.source,
                  sourceProductId: data.sourceProductId,
                },
              ]
            : []),
        ],
      },
      select: {
        id: true,
        name: true,
        targetPresta: true,
        prestaStatus: true,
        targetEbay: true,
        ebayStatus: true,
      },
    });

    if (duplicate) {
      throw new BadRequestException({
        message: 'Taki produkt roboczy już istnieje.',
        existingProduct: duplicate,
      });
    }

    return this.prisma.workProduct.create({
      data: {
        name: data.name,
        ean: data.ean || null,
        sku: data.sku || null,
        manufacturer: data.manufacturer || null,
        source: data.source,
        sourceUrl: data.sourceUrl || null,
        sourceProductId: data.sourceProductId || null,

        targetPresta: data.targetPresta,
        targetEbay: data.targetEbay,
        prestaStatus: data.targetPresta ? 'TO_PREPARE' : null,
        ebayStatus: data.targetEbay ? 'TO_PREPARE' : null,
        prestaAssignee: data.targetPresta ? data.prestaAssignee || null : null,
        ebayAssignee: data.targetEbay ? data.ebayAssignee || null : null,

        notes: data.notes || null,
        createdBy: data.createdBy,
      },
    });
  }

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
