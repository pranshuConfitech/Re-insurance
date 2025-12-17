"use client"

import AccessRightsAction from "@/views/apps/user-management/access-rights/access.rights.action";

const roleName = ({params}:{params:any})=>{
    console.log(params);
    
    return <AccessRightsAction  />;
    
}

export default roleName;
