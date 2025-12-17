import React from 'react';

import type { AlertProps} from '@mui/material';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/lab/Alert';



function Alert(props: React.JSX.IntrinsicAttributes & AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}



export const FettleGlobalErrorMessageSnackbar = () => {

    const [prop, setProp] = React.useState({ open: false, message: { code: "", body: "" } });

    const handleClose = (event: any, reason: any) => {
        setProp({ open: false, message: { code: "", body: "" } });
    };

    document.addEventListener('errorHappend', (event:any) => {
        const {detail}=event || {};
        const data= detail?.response?.data || {}; 
        const code = data.code || "ERR";
        const msg = data.message || "Error occured";

        setProp({open:true,message:{code,body:msg}}); 
    });

    return (
        <Snackbar open={prop.open} autoHideDuration={6000} onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Alert severity="error" sx={{ width: '100%' }}>
                {prop.message.code} - {prop.message.body}
            </Alert>
        </Snackbar>
    );
}
