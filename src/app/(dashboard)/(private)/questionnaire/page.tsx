import { Suspense } from "react"

import Questionnaire from "@/views/apps/questionnaire-management/questionnaire/questionnaire.main.component";

const questionnaire = () => {
  return (
    <Suspense fallback={null}>
      <Questionnaire/>
    </Suspense>
  )
}

export default questionnaire;
