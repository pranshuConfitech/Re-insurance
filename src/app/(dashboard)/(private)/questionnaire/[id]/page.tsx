"use client"
import QuestionnaireComponent from "@/views/apps/questionnaire-management/questionnaire/questionnaire.component";

const questionnairetId = ({params}:{params:any})=>{
    console.log(params);
    
    return <QuestionnaireComponent  />;
    
}

export default questionnairetId;
