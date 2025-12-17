"use client"
import FeesDetailsComponent from "@/views/apps/fees-management/components/fees.details.component";

const ProductId = ({params}:{params:any})=>{
    console.log(params);
    
    return <FeesDetailsComponent  />;
    
}

export default ProductId;
