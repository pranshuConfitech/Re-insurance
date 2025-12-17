import { Suspense } from "react"

import ServiceGroupingComponent from "@/views/apps/master-data-management/service-grouping/service.grouping.component"

const ServiceGrouping = () => {
  return (
    <Suspense fallback={null}>
    <ServiceGroupingComponent/>
  </Suspense>
  )
}

export default ServiceGrouping
