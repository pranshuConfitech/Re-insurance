import type { BankAddress } from "./bank.address";
import type { BankBasicDetails } from "./bank.basic";

export interface Bank {  
    id?: string;
    bankBasicDetails: BankBasicDetails;
    bankAddressDetails: BankAddress;
}