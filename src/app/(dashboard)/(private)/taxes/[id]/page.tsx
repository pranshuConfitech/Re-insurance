"use client"
import TaxDetails from "@/views/apps/tax-management/taxes/tax.details.component";

const taxId = ({params}:{params:any})=>{
    console.log(params);
    
    return <TaxDetails  />;
    
}

export default taxId;
