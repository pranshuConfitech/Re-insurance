"use client"
import InvoiceDetailsMain from "@/views/apps/invoice-management/invoice/invoice.details.main.component";

const invoiceId = ({params}:{params:any})=>{
    console.log(params);
    
    return <InvoiceDetailsMain  />;
    
}

export default invoiceId;