"use client"

import LetterDetailsComponent from "@/views/apps/claim-management/letter-management/components/letter.details.component";

const letterId = ({params}:{params:any})=>{
    console.log(params);
    
    return <LetterDetailsComponent  />;
    
}

export default letterId;
