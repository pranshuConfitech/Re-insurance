import * as React from 'react'

import { useParams } from 'next/navigation'

import { PRE_AUTH_STATUS_MSG_MAP } from './preauth.shared'
import { PreAuthService } from '@/services/remote-api/api/claims-services/claim.preauth.services'
import { FettleDocTimeline } from '../../shared-component/components/fettle.doc.timeline'

const preAuthService = new PreAuthService()

export default function PreAuthTimelineComponent(props: any) {
  const id: any = useParams().id
  const [timeLine, setTimeLine] = React.useState<any>([{}])

  if (id || props.id) {
    preAuthService.getPreAuthById(id || props.id).subscribe(preAuth => {
      const data = preAuth.timeLine || []

      const tl = data.map(timeLine => ({
        timestamp: new Date(timeLine.dateTime),
        title: PRE_AUTH_STATUS_MSG_MAP[timeLine.status as keyof typeof PRE_AUTH_STATUS_MSG_MAP],
        description: timeLine.comment || '--'
      }))

      setTimeLine(tl)
    })
  }

  return <FettleDocTimeline timeline={timeLine} />
}
