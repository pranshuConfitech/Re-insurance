"use client"
import DocSourceActionComponent from "@/views/apps/master-data-management/doc-source/doc-source.action.component";

const ParameterId = ({ params }: { params: any }) => {
    console.log(params);

    return <DocSourceActionComponent />;


}

export default ParameterId;
