"use client"
import ProductsActionComponent from "@/views/apps/product-management/components/product.action.component";

const ProductId = ({params}:{params:any})=>{
    console.log(params);
    
    return <ProductsActionComponent  />;
    
}

export default ProductId;
