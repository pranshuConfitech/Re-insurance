import * as React from 'react'

import { useParams } from 'next/navigation'

import { forkJoin, map, switchMap } from 'rxjs'

import { PreAuthService } from '@/services/remote-api/api/claims-services'
import { PRE_AUTH_STATUS_MSG_MAP } from './preauth.shared'
import { FettleDocTimeline } from '../../shared-component/components/fettle.doc.timeline'

import { UsersService } from '@/services/remote-api/fettle-remote-api'

const preAuthService = new PreAuthService()

export default function PreAuthTimelineComponent(props: any) {
  const id: any = useParams().id
  const [timeLine, setTimeLine] = React.useState<any>([])
  const userService = new UsersService()

  if (!timeLine.length) {
    if (id || props.id) {
      preAuthService
        .getPreAuthById(props.id || id)
        .pipe(
          switchMap(preAuth => {
            const data = preAuth.timeLine || []

            const userRequests = data.map((timeLine: any) =>
              userService.getUserDetails(timeLine.createdBy).pipe(
                map((res: any) => ({
                  timestamp: new Date(timeLine.dateTime),
                  title: PRE_AUTH_STATUS_MSG_MAP[timeLine.status as keyof typeof PRE_AUTH_STATUS_MSG_MAP],
                  description: timeLine.createdBy || '--',
                  createdBy: res ? `${res.firstName} ${res.lastName}` : '--'
                }))
              )
            )

            return forkJoin(userRequests)
          })
        )
        .subscribe(tl => {
          setTimeLine(tl)
        })
    }
  }

  return <FettleDocTimeline timeline={timeLine} />
}
