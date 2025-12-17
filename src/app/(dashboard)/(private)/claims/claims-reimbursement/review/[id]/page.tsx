"use client"
import ClaimReimReview from "@/views/apps/claim-management/claim-reimbursement/claim.reim.review.component";

const claimReimbursementReviewId = ({params}:{params:any})=>{
    console.log(params);
    
    return <ClaimReimReview  />;
    
}

export default claimReimbursementReviewId;
