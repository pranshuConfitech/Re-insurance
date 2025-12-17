import React, { useMemo } from 'react';

// import { DateFnsAdapter } from '@date-io/date-fns';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import DescriptionIcon from '@mui/icons-material/Description';

import moment from 'moment';

 // const STATIC_TIMELINE = [
    //     {
    //         timestamp: new Date(2021, 2, 15, 18, 35),
    //         title: 'Enhancement Approved',
    //         description: '',
    //     },
    //     {
    //         timestamp: new Date(2021, 2, 15, 18, 28),
    //         title: 'Enhancement Requested',
    //         description: '',
    //     },
    //     {
    //         timestamp: new Date(2021, 2, 15, 18, 18),
    //         title: 'Pre-auth Approve',
    //         description: '',
    //     },
    //     {
    //         timestamp: new Date(2021, 2, 15, 17, 45),
    //         title: 'Pre-auth Request',
    //         description: '',
    //     },
    // ];

    type TimelineEntry = {
      timestamp: Date;
      title: string;
      description?: string;
      createdBy?:string
    };
    
    // Define the props type
    type FettleDocTimelineProps = {
      timeline: TimelineEntry[];
    };
    

export const FettleDocTimeline: React.FC<FettleDocTimelineProps> = ({ timeline = [] }) => {
  const uiTimeline = useMemo(() => {
    return timeline.map((it, index) => ({
      ...it,
      key: index,
      timestamp: moment(it.timestamp).format('DD MMM YY hh:mm A'),
    }));
  }, [timeline]);

  
return (
    <Timeline>
      {uiTimeline.map((it,index) => {
        return (
          <TimelineItem key={`Timeline-${index}`}>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <div>
                <div>{it.timestamp}</div>
                <div style={{ display: 'flex' }}>
                  <div style={{ marginTop: '12px', marginRight: '12px' }}>
                    <DescriptionIcon />
                  </div>
                  <div style={{ marginTop: '8px', marginBottom: '18px' }}>
                    <div style={{ marginBottom: '8px' }}>{it.title}</div>
                    <div><b>{it.createdBy}</b></div>
                  </div>
                </div>
              </div>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};

// FettleDocTimeline.propTypes = {
//   timeline: PropTypes.arrayOf({
//     timestamp: PropTypes.instanceOf(Date).isRequired,
//     title: PropTypes.string.isRequired,
//     description: PropTypes.string,
//   }),
// };
