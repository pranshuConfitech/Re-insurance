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
  Typography,
  useTheme,
} from '@mui/material';
import { makeStyles } from '@mui/styles'

// const useStyles = makeStyles(() => {
//   const theme = useTheme(); // Use theme directly
//   return {
//     content: {
//       padding: theme.spacing(2),
//     },
//     field: {
//       marginBottom: theme.spacing(2),
//     },
//     summary: {
//       marginBottom: theme.spacing(3),
//       padding: theme.spacing(2),
//       backgroundColor: theme.palette.grey[50], // Now theme is properly referenced
//       borderRadius: theme.shape.borderRadius,
//     },
//   };
// });


const ConvertToClientDialog = ({ open, onClose, lead, onConvert }:{ open: any, onClose: any, lead: any, onConvert: any }) => {
  // const classes = useStyles();

  const theme = useTheme()
  console.log(theme.typography);
  const classes = {
    content: {
      padding: theme.spacing(2),
    },
    field: {
      marginBottom: theme.spacing(2),
    },
    summary: {
      marginBottom: theme.spacing(3),
      padding: theme.spacing(2),
      backgroundColor: theme.palette.grey[50],
      borderRadius: theme.shape.borderRadius,
    },
  };
  console.log(classes);
  
  const [clientData, setClientData] = useState({
    contractType: 'standard',
    contractValue: '',
    startDate: '',
    notes: '',
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setClientData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onConvert({
      ...clientData,
      leadId: lead?.id,
      conversionDate: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Convert {lead?.name} to Client</DialogTitle>
      <DialogContent style={classes.content}>
        <div style={classes.summary}>
          <Typography variant="subtitle2" gutterBottom style={{ display: 'block' }}>
            Lead Summary
          </Typography>
          <Typography variant="body2">
            Name: {lead?.name}<br />
            Email: {lead?.email}<br />
            Phone: {lead?.phone}
          </Typography>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth style={classes.field}>
              <InputLabel>Contract Type</InputLabel>
              <Select
                name="contractType"
                label="Contract Type"
                value={clientData.contractType}
                onChange={handleChange}
              >
                <MenuItem value="standard">Standard</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
                <MenuItem value="enterprise">Enterprise</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Contract Value"
              name="contractValue"
              type="number"
              value={clientData.contractValue}
              onChange={handleChange}
              style={classes.field}
              InputProps={{
                startAdornment: <span>$</span>,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Start Date"
              name="startDate"
              type="date"
              value={clientData.startDate}
              onChange={handleChange}
              style={classes.field}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Notes"
              name="notes"
              value={clientData.notes}
              onChange={handleChange}
              style={classes.field}
              multiline
              rows={4}
              placeholder="Enter any additional notes about the conversion"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Convert to Client
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConvertToClientDialog; 
