"use client"
import PatientListCompoent from "@/views/apps/claim-management/case-management/components/inhospital.list.component";

const inhospitalId = ({params}:{params:any})=>{
    console.log(params);
    
    return <PatientListCompoent  />;
    
}

export default inhospitalId;
