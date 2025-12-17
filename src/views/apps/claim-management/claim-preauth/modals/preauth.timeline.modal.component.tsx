import * as React from 'react';

import { useRouter } from 'next/navigation';

import { Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import 'date-fns';

import { PRE_AUTH_STATUS_MSG_MAP } from '../preauth.shared';
import PreAuthTimelineComponent from '../preauth.timeline.component';


export default function PreAuthTimeLineModal(props:any) {

    
    const { preAuth }= props;
    const history = useRouter();
    const [fullWidth, setFullWidth] = React.useState(true);

    const handleClose = () => {
        props.onClose();
    };

    return (
        <Dialog
            open={props.open}
            onClose={handleClose}
            fullWidth={fullWidth}

            aria-labelledby="form-dialog-title"
            disableEnforceFocus>
            <DialogTitle id="form-dialog-title">
                <Grid container>
                    <Grid item xs={8}>Preauth : {preAuth.id}</Grid>
                    <Grid item xs={4}><span style={{ float: 'right' }}>{PRE_AUTH_STATUS_MSG_MAP[preAuth?.preAuthStatus as keyof typeof PRE_AUTH_STATUS_MSG_MAP]}</span></Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <PreAuthTimelineComponent id={preAuth.id}/>
            </DialogContent>
            {/* <DialogActions>
            </DialogActions> */}
        </Dialog>
    );
}
