"use client"
import UsersActionComponent from "@/views/apps/user-management/users/users.action.component";

const userName = ({params}:{params:any})=>{
    console.log(params);
    
    return <UsersActionComponent  />;
    
}

export default userName;
