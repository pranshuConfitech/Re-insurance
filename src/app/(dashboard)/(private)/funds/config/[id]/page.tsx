"use client"
import FundConfigForm from "@/views/apps/fund-management/components/fund-config/fund.config.form";

const ProductId = ({params}:{params:any})=>{
    console.log(params);
    
    return <FundConfigForm  />;
    
}

export default ProductId;
