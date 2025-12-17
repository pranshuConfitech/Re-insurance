import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ProviderTimelineComponent from '../provider.timeline.component';

export default function ProviderViewModal(props: any) {
    const { provider } = props;
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
            maxWidth="lg"
            aria-labelledby="form-dialog-title"
            disableEnforceFocus
        >
            <DialogTitle id="form-dialog-title">
                <Grid container>
                    <Grid item xs={8}>
                        Provider: {provider?.providerBasicDetails?.name || provider?.name || 'N/A'}
                    </Grid>
                    <Grid item xs={4}>
                        <span style={{ float: 'right' }}>
                            {provider?.providerBasicDetails?.code || provider?.code || 'N/A'}
                        </span>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <ProviderTimelineComponent provider={provider} />
            </DialogContent>
        </Dialog>
    );
}

