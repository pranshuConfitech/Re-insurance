import type { accountDetails } from "./account.details";

export interface ClientAccount {
  amlRiskCategory: string,
  accountDetails: accountDetails[]
}