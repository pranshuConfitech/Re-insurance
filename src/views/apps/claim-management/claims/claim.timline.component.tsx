import * as React from 'react'

import { useParams } from 'next/navigation'

import { ReimbursementService } from '@/services/remote-api/api/claims-services'
import { REIM_STATUS_MSG_MAP } from './shared'
import { FettleDocTimeline } from '../../shared-component/components/fettle.doc.timeline'

const reimService = new ReimbursementService()

export default function ClaimsTimelineComponent(props: any) {
  const id: any = useParams().id
  const [timeLine, setTimeLine] = React.useState<any>([])

  if (!timeLine.length) {
    if (id || props.id) {
      reimService.getReimbursementById(id).subscribe(preAuth => {
        const data = preAuth.timeLine || []

        const tl: any = data.map(timeLine => ({
          timestamp: new Date(timeLine.dateTime),
          title: REIM_STATUS_MSG_MAP[timeLine.status as keyof typeof REIM_STATUS_MSG_MAP],
          description: timeLine.comment || '--'
        }))

        setTimeLine([...tl])
      })
    }
  }

  return <FettleDocTimeline timeline={timeLine} />
}
