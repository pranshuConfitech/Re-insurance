import { Suspense } from "react"

import ProductManagementComponent from "@/views/apps/product-management/components/product-management.component";

const Product_Management = ()=>{
    return(
        <Suspense fallback={null}>
           <ProductManagementComponent/>
        </Suspense>
    )
}

export default Product_Management;
