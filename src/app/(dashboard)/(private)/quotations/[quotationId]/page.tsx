"use client"

import QuotationManagementAction from "@/views/apps/quotation-service-ui/src/components/quotation.action";


const quotationId = ({params}:{params:any})=>{
    console.log(params);
    
    return <QuotationManagementAction  />;
    
}

export default quotationId;
