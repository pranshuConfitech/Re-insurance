"use client"
import Reports from "@/views/apps/underwritings-reports/reports";

const reportId = ({params}:{params:any})=>{
    console.log(params);
    
    return <Reports  />;
    
}

export default reportId;
