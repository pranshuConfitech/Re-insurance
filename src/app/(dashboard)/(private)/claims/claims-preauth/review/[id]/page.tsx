"use client"
import PreAuthReview from "@/views/apps/claim-management/claim-preauth/preauth.review.component";

const claimPreauthReviewId = ({params}:{params:any})=>{
    console.log(params);
    
    return <PreAuthReview  />;
    
}

export default claimPreauthReviewId;
