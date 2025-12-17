"use client"
import ParametersActionComponent from "@/views/apps/master-data-management/parameters-management/parameters.action.component";

const ParameterId = ({params}:{params:any})=>{
    console.log(params);

    return <ParametersActionComponent  />;


}

export default ParameterId;
