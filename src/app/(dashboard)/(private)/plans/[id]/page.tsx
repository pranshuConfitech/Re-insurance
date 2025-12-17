"use client"
import PlanDetailsComponent from "@/views/apps/plan-management/components/plan.details.component";

const PlanId = ({params}:{params:any})=>{
    console.log(params);
    
    return <PlanDetailsComponent  />;
    
}

export default PlanId;