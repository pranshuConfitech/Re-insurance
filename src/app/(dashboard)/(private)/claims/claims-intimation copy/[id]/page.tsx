"use client"

import ClaimsIntimationDetailsComponent from "@/views/apps/claim-management/claim-intimation/intimation.component";

const claimIntimationId = ({ params }: { params: any }) => {
    console.log(params);

    return <ClaimsIntimationDetailsComponent />;

}

export default claimIntimationId;
