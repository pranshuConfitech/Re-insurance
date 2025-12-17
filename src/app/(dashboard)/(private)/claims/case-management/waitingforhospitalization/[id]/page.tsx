"use client"
import PatientListCompoent from "@/views/apps/claim-management/case-management/components/waitingforhospitalization.list.component";

const waitingforhospitalizationId = ({params}:{params:any})=>{
    console.log(params);
    
    return <PatientListCompoent  />;
    
}

export default waitingforhospitalizationId;
