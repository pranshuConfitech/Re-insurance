
import type { ProviderAddress } from "./provider.address";
import type { ProviderBasicDetails } from "./provider.basic";
import type { ProviderOtherDetails } from "./provider.otherDetails";

export interface Provider {  
    id?: string;
    providerBasicDetails: ProviderBasicDetails;
    providerAddresses: ProviderAddress;
    ProviderOtherDetails:ProviderOtherDetails
}