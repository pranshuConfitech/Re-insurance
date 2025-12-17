"use client"
import CardDetailsComponent from "@/views/apps/bank-management/card/card.details.component";

const cardId = ({params}:{params:any})=>{
    console.log(params);
    
    return <CardDetailsComponent  />;
    
}

export default cardId;
