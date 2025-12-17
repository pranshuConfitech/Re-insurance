import type { Address } from "./address";

export interface Prospect {
  id?: string;
  prefix: string;
  firstName: string;
  middletName: string;
  lastName: string;
  suffix: string;
  displayName: string;
  groupType: string;
  clientType: string;
  code?: string;
  emailId: string;
  alternateEmailId: string;
  mobileNo: string;
  alternateMobileNo: string;
  addresses: Address[];
}
