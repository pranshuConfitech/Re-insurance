import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid
} from '@mui/material';
import { makeStyles } from '@mui/styles'
// import { DateTimePicker } from '@material-ui/pickers';
import { LocalizationProvider,DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

const useStyles = makeStyles((theme:any) => ({
  content: {
    padding: theme?.spacing ? theme.spacing(2) : '16px',
  },
  field: {
    marginBottom: theme?.spacing ? theme.spacing(2) : '16px',
  },
}));

const ScheduleMeetingDialog = ({ open, onClose, lead, onSchedule }:{ open: any, onClose: any, lead: any, onSchedule: any }) => {
  const classes = useStyles();
  const [meetingData, setMeetingData] = useState({
    date: new Date(),
    location: '',
    description: '',
  });

  const handleDateChange = (date: any) => {
    setMeetingData((prev) => ({
      ...prev,
      date,
    }));
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setMeetingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSchedule({ ...meetingData, leadId: lead?.id });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Schedule Meeting with {lead?.name}</DialogTitle>
      <DialogContent className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Meeting Date & Time"
              value={meetingData.date}
              onChange={handleDateChange}
              className={classes.field}
              renderInput={(params) => <TextField {...params} fullWidth />}
              disablePast
              // format="yyyy/MM/dd hh:mm a"
            />
          </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={meetingData.location}
              onChange={handleChange}
              className={classes.field}
              placeholder="Enter meeting location or video call link"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={meetingData.description}
              onChange={handleChange}
              className={classes.field}
              multiline
              rows={4}
              placeholder="Enter meeting agenda or notes"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Schedule Meeting
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleMeetingDialog; 
