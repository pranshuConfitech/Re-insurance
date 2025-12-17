"use client"

import BranchDetailsComponent from "@/views/apps/branch-management/components/branch.details.component";

const branchId = ({params}:{params:any})=>{
    console.log(params);
    
    return <BranchDetailsComponent  />;
    
}

export default branchId;
