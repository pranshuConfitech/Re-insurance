import type { Address } from "./address";
import type { ProviderContactPersonDetails } from "./provider.contactPersonDetails";

export interface ProviderAddress {
    addresses:Array<Address>;
    agentContactPersonDetails:ProviderContactPersonDetails;
    agentWeeklyHolidays:Array<string>;

}