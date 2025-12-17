import type { Address } from "./address";
import type { directorDetails } from "./director.details";

export interface ClientAddressDetails {
  addresses: Address[];
  contactPerson: {
    name:string;
    emailId: string;
    alternateEmailId: string;
    mobileNo: string;
    alternateMobileNo: string;
  };
  directorDetails: directorDetails[];
}
