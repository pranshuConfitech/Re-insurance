import type { PlanCategory } from "./plan.category";

export interface Plan {
  id?: string;
  name: string;
  productCode: string;
  productCurrency: string;
  premiumCurrency: string;
  description: string;
  groupType?: string;
  clientType: string;
  code?: string;
  productId: string;
  planCategorys: PlanCategory[];
}
