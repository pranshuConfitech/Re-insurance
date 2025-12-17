import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme:any) => ({
  content: {
    padding: theme?.spacing?theme.spacing(2):'16px',
  },
  warningIcon: {
    fontSize: 48,
    color: theme?.palette?.error?.main,
    marginBottom: theme?.spacing?theme.spacing(2):'16px',
  },
  warningText: {
    color: theme?.palette?.error?.main,
    marginBottom: theme?.spacing?theme.spacing(2):'16px',
  },
  leadInfo: {
    marginTop: theme?.spacing?theme.spacing(2):'16px',
    padding: theme?.spacing?theme.spacing(2):'16px',
    backgroundColor: theme?.palette?.grey[50],
    borderRadius: theme?.shape?.borderRadius,
  },
}));

const DeleteLeadDialog = ({ open, onClose, lead, onDelete }:{ open: any, onClose: any, lead: any, onDelete: any }) => {
  const classes = useStyles();

  const handleDelete = () => {
    onDelete(lead?.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Lead</DialogTitle>
      <DialogContent className={classes.content}>
        <div style={{ textAlign: 'center' }}>
          <WarningIcon className={classes.warningIcon} />
          <Typography variant="h6" className={classes.warningText}>
            Are you sure you want to delete this lead?
          </Typography>
          <Typography variant="body1" gutterBottom>
            This action cannot be undone.
          </Typography>
        </div>
        <div className={classes.leadInfo}>
          <Typography variant="subtitle2" gutterBottom>
            Lead Information
          </Typography>
          <Typography variant="body2">
            Name: {lead?.name}<br />
            Email: {lead?.email}<br />
            Phone: {lead?.phone}<br />
            Status: {lead?.status}
          </Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleDelete} 
          color="secondary" 
          variant="contained"
        >
          Delete Lead
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteLeadDialog; 
