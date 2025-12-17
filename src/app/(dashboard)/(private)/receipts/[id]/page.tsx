"use client"
import ReceiptDetails from "@/views/apps/receipt-management/receipts/receipts.details.component";

const receiptId = ({params}:{params:any})=>{
    console.log(params);
    
    return <ReceiptDetails  />;
    
}

export default receiptId;