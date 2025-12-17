import React from 'react';

import { Button } from 'primereact/button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const FettleConfirmDialog = (props:any) => {
    const handleAction = (flag:any) => {
        props.action(flag);
    };

    const handleClose = () => {
    };

    const doSomething = () => {
    }

    const childrenWithProps = React.Children.map(props.children, child => {
        // checking isValidElement is the safe way and avoids a typescript error too
        if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, { doSomething });
        }

        
return child;
    });

    
return (
        <div>
            <Dialog
                open={props.open}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        handleClose;
                    }
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                disableEscapeKeyDown
            >
                <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {childrenWithProps || props.description}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={(e) => handleAction(false)} color="primary">
                        Disagree
                    </Button>
                    <Button onClick={(e) => handleAction(true)} color="primary" autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
