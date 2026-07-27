import type { TaskAuthor } from '../../generated/prisma/enums';

export class CreateWorkProductDto {
  name!: string;
  ean?: string;
  sku?: string;
  manufacturer?: string;
  source!: string;
  sourceUrl?: string;
  sourceProductId?: string;

  targetPresta!: boolean;
  targetEbay!: boolean;
  prestaAssignee?: TaskAuthor;
  ebayAssignee?: TaskAuthor;

  notes?: string;
  createdBy!: TaskAuthor;
}
