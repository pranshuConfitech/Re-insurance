import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme:any) => ({
  content: {
    padding: theme?.spacing ? theme.spacing(2) : '16px',
  },
  field: {
    marginBottom: theme?.spacing ? theme.spacing(2) : '16px',
  },
}));

const LogCallDialog = ({ open, onClose, lead, onLog }:{ open: any, onClose: any, lead: any, onLog: any }) => {
  const classes = useStyles();
  const [callData, setCallData] = useState({
    duration: '',
    type: 'outbound',
    outcome: 'completed',
    notes: '',
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setCallData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onLog({
      ...callData,
      leadId: lead?.id,
      timestamp: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Log Call with {lead?.name}</DialogTitle>
      <DialogContent className={classes.content}>
        <Grid container spacing={2} sx={{ paddingTop: 2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth className={classes.field}>
              <InputLabel>Call Type</InputLabel>
              <Select
                name="type"
                label="Call Type"
                value={callData.type}
                onChange={handleChange}
              >
                <MenuItem value="outbound">Outbound</MenuItem>
                <MenuItem value="inbound">Inbound</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Duration (minutes)"
              name="duration"
              type="number"
              value={callData.duration}
              onChange={handleChange}
              className={classes.field}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth className={classes.field}>
              <InputLabel>Outcome</InputLabel>
              <Select
                name="outcome"
                label="Outcome"
                value={callData.outcome}
                onChange={handleChange}
              >
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="no_answer">No Answer</MenuItem>
                <MenuItem value="voicemail">Left Voicemail</MenuItem>
                <MenuItem value="busy">Busy</MenuItem>
                <MenuItem value="wrong_number">Wrong Number</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Call Notes"
              name="notes"
              value={callData.notes}
              onChange={handleChange}
              className={classes.field}
              multiline
              rows={4}
              placeholder="Enter details about the call"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Log Call
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogCallDialog; 
