import * as React from 'react';

import { Button } from 'primereact/button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import 'date-fns';

export default function ReceiptReversalModal(props:any) {
  const [remarks, setRemarks] = React.useState('');
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth]:any = React.useState('sm');

  const handleClose = () => {
    props.handleCloseReversalModal();
  };

  const handleModalSubmit = () => {
    props.submitReversalModal(remarks);

    // invoiceservice.revertInvoice(remarks,props.selectedInvoiceForReversal).subscribe(ele=> {
    //     props.handleCloseReversalModal();
    // })
  };

  const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setRemarks(e.target.value);
  };

  return (
    <Dialog
      open={props.reversalModal}
      onClose={handleClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      aria-labelledby="form-dialog-title"
      disableEnforceFocus>
      <DialogTitle id="form-dialog-title">Receipt Reversal</DialogTitle>
      <DialogContent>
        <TextField
          id="standard-multiline-flexible"
          required
          multiline
          name="remarks"
          value={remarks}
          onChange={handleChange}
          label="Remarks"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} className="p-button-text" color="primary">
          Cancel
        </Button>
        <Button onClick={handleModalSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
