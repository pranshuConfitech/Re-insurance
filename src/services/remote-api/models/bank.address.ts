import type { Address } from "./address";
import type { BankContactPersonDetails } from "./bank.contactPersonDetails";

export interface BankAddress {
    addresses:Array<Address>;
    agentContactPersonDetails:BankContactPersonDetails;

}