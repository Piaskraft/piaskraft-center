import type {
  EbayWorkflowStatus,
  PrestaWorkflowStatus,
  TaskAuthor,
} from '../../generated/prisma/enums';

export class UpdateWorkProductDto {
  name?: string;
  ean?: string | null;
  sku?: string | null;
  manufacturer?: string | null;
  source?: string;
  sourceUrl?: string | null;
  sourceProductId?: string | null;

  targetPresta?: boolean;
  targetEbay?: boolean;
  prestaStatus?: PrestaWorkflowStatus | null;
  ebayStatus?: EbayWorkflowStatus | null;
  prestaAssignee?: TaskAuthor | null;
  ebayAssignee?: TaskAuthor | null;

  piaskraftUrl?: string | null;
  prestaProductId?: string | null;
  ebayUrl?: string | null;
  ebayItemId?: string | null;

  notes?: string | null;
}
