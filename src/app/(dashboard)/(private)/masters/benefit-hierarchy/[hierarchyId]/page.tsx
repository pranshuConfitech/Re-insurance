"use client"
import BenefitHierarchyAction from "@/views/apps/master-data-management/benefit-management/benefit.hierarchy.action";

const hierarchyId = ({params}:{params:any})=>{
    console.log(params);

    return <BenefitHierarchyAction  />;


}

export default hierarchyId;
