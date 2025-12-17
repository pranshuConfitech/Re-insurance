"use client"
import SectorActionComponent from "@/views/apps/master-data-management/sector/sector.action.component";

const ParameterId = ({ params }: { params: any }) => {
    console.log(params);

    return <SectorActionComponent />;


}

export default ParameterId;
