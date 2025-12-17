'use client'
import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  IconButton,
  Grid,
  Button,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles'
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css'; 

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const useStyles = makeStyles((theme:any) => ({
  root: {
    width: '100%',
    padding: theme?.spacing?theme.spacing(3):'24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme?.spacing?theme.spacing(3):'24px',
  },
  calendarContainer: {
    height: 'calc(100vh - 200px)',
    '& .rbc-calendar': {
      backgroundColor: theme?.palette?.background?.paper,
      borderRadius: theme?.shape?.borderRadius,
    },
  },
  navigationContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme?.spacing?theme.spacing(2):'16px',
  },
}));

// Sample events data
const events = [
  {
    id: 1,
    title: 'Client Meeting - John Doe',
    start: new Date(2024, 2, 11, 10, 0),
    end: new Date(2024, 2, 11, 11, 0),
  },
  {
    id: 2,
    title: 'Follow-up Call - Jane Smith',
    start: new Date(2024, 2, 12, 14, 0),
    end: new Date(2024, 2, 12, 15, 0),
  },
  {
    id: 3,
    title: 'Product Demo - Mike Johnson',
    start: new Date(2024, 2, 13, 11, 0),
    end: new Date(2024, 2, 13, 12, 0),
  },
];

const Calendar = () => {
  const classes = useStyles();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration error by rendering only after mount
  if (!mounted) return null;

  const handleNavigate = (action:any) => {
    const newDate = new Date(currentDate);
    if (action === 'PREV') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (action === 'NEXT') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (action === 'TODAY') {
      return setCurrentDate(new Date());
    }
    setCurrentDate(newDate);
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.navigationContainer}>
          <Typography variant="h4" component="h1">
            Calendar
          </Typography>
          <IconButton onClick={() => handleNavigate('PREV')}>
            <ChevronLeftIcon />
          </IconButton>
          <Button variant="outlined" onClick={() => handleNavigate('TODAY')}>
            Today
          </Button>
          <IconButton onClick={() => handleNavigate('NEXT')}>
            <ChevronRightIcon />
          </IconButton>
          <Typography variant="h6">
            {format(currentDate, 'MMMM yyyy')}
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => console.log('Add new event')}
        >
          Add Event
        </Button>
      </div>

      <Paper className={classes.calendarContainer}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}
          onNavigate={(date:any) => setCurrentDate(date)}
          views={['month', 'week', 'day', 'agenda']}
          defaultView="month"
          selectable
          popup
          onSelectEvent={(event:any) => console.log('Selected event:', event)}
          onSelectSlot={(slotInfo:any) => console.log('Selected slot:', slotInfo)}
        />
      </Paper>
    </div>
  );
};

export default Calendar; 
