import IndustryComponent from "@/views/apps/master-data-management/industry/industry.component";
import { Suspense } from "react";


const ProviderConfig = () => {
  return (
    <Suspense fallback={null}>
      <IndustryComponent />
    </Suspense>
  )
}

export default ProviderConfig
