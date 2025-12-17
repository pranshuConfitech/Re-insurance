"use client"

import MemberDetail from "@/views/apps/member-upload-management/member.details.components";

const DetailsId = ({params}:{params:any})=>{
    console.log(params);
    
    return <MemberDetail  />;
    
}

export default DetailsId;
