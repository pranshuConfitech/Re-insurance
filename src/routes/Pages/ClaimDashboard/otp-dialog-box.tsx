import React from 'react';

import { Button } from 'primereact/button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

export default function OTPDialogBox(props:any) {

    const { open } = props;

    const handleClose = () => {
        props.handleClose();
    };

    return (
        <Dialog open={open} 
        onClose={(event, reason) => {
            if (reason === "backdropClick") return;
            handleClose();
          }}
         aria-labelledby="form-dialog-title" maxWidth="xs" fullWidth>
            <DialogTitle id="form-dialog-title">OTP Box</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please Enter the OTP
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="fettle-otp"
                    type="text"
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" >
                    Submit
                </Button>
                <Button onClick={handleClose} color="primary" >
                    Resend OTP
                </Button>
            </DialogActions>
        </Dialog>
    );
}
