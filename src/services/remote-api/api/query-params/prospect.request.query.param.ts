import type { PageRequest } from "../../models/page.request";

export interface ProspectRequestQueryParam extends PageRequest {
  code?: string;
}
