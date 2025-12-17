"use client"
import ClaimsInwardDetailsComponent from "@/views/apps/claim-management/claim-inwards/inward.component";

const claimIntimationId = ({ params }: { params: any }) => {
    console.log(params);

    return <ClaimsInwardDetailsComponent />;

}

export default claimIntimationId;
