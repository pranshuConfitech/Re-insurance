import type { ClientAccount } from "./client.account";
import type { ClientAddressDetails } from "./client.address";
import type { clientBasicDetails } from "./client.basic";

export interface Client {  
      id?: string,
      clientBasicDetails: clientBasicDetails,
      clientAddress: ClientAddressDetails,
      clientAccount: ClientAccount 
}
