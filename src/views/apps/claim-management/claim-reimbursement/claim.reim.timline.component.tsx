
import * as React from 'react';

import { FettleDocTimeline } from '../../shared-component/components/fettle.doc.timeline';


export default function ClaimReimTimelineComponent(props:any) {
    const STATIC_TIMELINE = [
        {
            timestamp: new Date(2021, 2, 15, 18, 35),
            title: 'Paid',
            description: '',
        },
        {
            timestamp: new Date(2021, 2, 15, 18, 28),
            title: 'Audited',
            description: '',
        },
        {
            timestamp: new Date(2021, 2, 15, 18, 18),
            title: 'Processed',
            description: '',
        },
        {
            timestamp: new Date(2021, 2, 15, 17, 45),
            title: 'Registered',
            description: '',
        },
    ];

    return (
        <FettleDocTimeline timeline={STATIC_TIMELINE} />

    );

}
