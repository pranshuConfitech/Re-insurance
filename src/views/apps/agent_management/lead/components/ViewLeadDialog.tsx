import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Divider,
  Chip,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme:any) => ({
  section: {
    marginBottom: theme?.spacing ? theme.spacing(2) : '16px',
  },
  label: {
    fontWeight: 'bold',
    color: theme?.palette?.text?.secondary,
  },
  value: {
    marginTop: theme?.spacing ? theme.spacing(0.5) : '4px',
  },
  divider: {
    margin: theme?.spacing ? theme.spacing(2,0) : '16px 0',
  },
  contactIcon: {
    marginRight: theme?.spacing ? theme.spacing(2) : '8px',
    fontSize: '1rem',
    verticalAlign: 'middle',
  },
  statusChip: {
    marginTop: theme?.spacing ? theme.spacing(0.5) : '4px',
  },
  forecast: {
    fontWeight: 'bold',
  },
}));

const getStatusColor = (status:any) => {
  const colors:any = {
    'Hot': '#FF4D4D',
    'Warm': '#FFA726',
    'Cold': '#78909C',
  };
  return colors[status] || '#757575';
};

const ViewLeadDialog = ({ open, onClose, lead }:{open: any, onClose: any, lead: any}) => {
  const classes = useStyles();

  if (!lead) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Lead Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} className={classes.section}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography className={classes.label}>Lead Name</Typography>
                <Typography className={classes.value}>{lead.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className={classes.label}>Status</Typography>
                <Chip
                  label={lead.status}
                  className={classes.statusChip}
                  style={{
                    backgroundColor: getStatusColor(lead.status),
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className={classes.label}>Forecast</Typography>
                <Typography 
                  className={`${classes.value} ${classes.forecast}`}
                  style={{ 
                    color: parseInt(lead.forecast) > 70 ? '#4CAF50' : '#FF9800'
                  }}
                >
                  {lead.forecast}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className={classes.label}>Assigned To</Typography>
                <Typography className={classes.value}>{lead.assignedTo}</Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider className={classes.divider} />
          </Grid>

          <Grid item xs={12} className={classes.section}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography className={classes.label}>Phone</Typography>
                <Typography className={classes.value}>
                  <PhoneIcon className={classes.contactIcon} />
                  <a href={`tel:${lead.contact?.phone}`}>
                    {lead.contact?.phone}
                  </a>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className={classes.label}>Email</Typography>
                <Typography className={classes.value}>
                  <EmailIcon className={classes.contactIcon} />
                  <a href={`mailto:${lead.contact?.email}`}>
                    {lead.contact?.email}
                  </a>
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider className={classes.divider} />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Timeline
            </Typography>
            <Typography className={classes.label}>Last Updated</Typography>
            <Typography className={classes.value}>
              {new Date(lead.lastUpdated).toLocaleDateString()} at{' '}
              {new Date(lead.lastUpdated).toLocaleTimeString()}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewLeadDialog; 
