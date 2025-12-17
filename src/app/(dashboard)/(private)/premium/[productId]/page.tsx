"use client"

import PremiumDesignAction from "@/views/apps/premium-management/components/premium.design.action";


const premiumId = ({params}:{params:any})=>{
    console.log(params);
    
    return <PremiumDesignAction  />;
    
}

export default premiumId;
