"use client"
import AgentsDetails from "@/views/apps/agent_management/agents/agents.details.component";

const AgentId = ({params}:{params:any})=>{
    console.log(params);
    
    return <AgentsDetails />;
    
}

export default AgentId;