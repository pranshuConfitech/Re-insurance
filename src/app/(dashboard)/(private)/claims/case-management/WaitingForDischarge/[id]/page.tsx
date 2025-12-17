"use client"
import PatientListCompoent from "@/views/apps/claim-management/case-management/components/waitingfordischarge.list.component";

const waitingfordischargenId = ({params}:{params:any})=>{
    console.log(params);
    
    return <PatientListCompoent  />;
    
}

export default waitingfordischargenId;
