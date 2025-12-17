"use client"
import TreatyConfigFormComponent from "@/views/apps/reinsurance/treaty-config/treaty-config.form.component";

const PlanId = ({ params }: { params: any }) => {
    console.log(params);

    return <TreatyConfigFormComponent />;

}

export default PlanId;
