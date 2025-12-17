
import type { AgentAddress } from "./agent.address";
import type { AgentBasicDetails } from "./agent.basic";
import type { agentOtherDetails } from "./agent.otherDetails";

export interface Agent {  
    id?: string;
    agentBasicDetails: AgentBasicDetails;
    agentAddresses: AgentAddress;
    agentOtherDetails:agentOtherDetails
}