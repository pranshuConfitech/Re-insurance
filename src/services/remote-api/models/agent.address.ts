import type { Address } from "./address";
import type { AgentContactPersonDetails } from "./agent.contactPersonDetails";

export interface AgentAddress {
    addresses:Array<Address>;
    agentContactPersonDetails:AgentContactPersonDetails;
    agentWeeklyHolidays:Array<string>;

}