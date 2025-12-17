"use client"
import BankDetails from "@/views/apps/bank-management/bank/bank.details.component";

const bankId = ({params}:{params:any})=>{
    console.log(params);
    
    return <BankDetails  />;
    
}

export default bankId;
