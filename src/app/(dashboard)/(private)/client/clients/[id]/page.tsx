"use client"
import ClientDetails from "@/views/apps/client-management/client/client.details.component";

const ClientId = ({params}:{params:any})=>{
    console.log(params);
    
    return <ClientDetails  />;
    
}

export default ClientId;