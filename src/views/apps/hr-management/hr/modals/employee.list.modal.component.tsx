import * as React from "react";

import { Button } from 'primereact/button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from "@mui/material/Paper";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import "date-fns";


export default function EmployeeAddModal(props: any) {
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState<any>('sm');

    const handleClose = () => {
        props.closeEmployeeListModal();
    }


    return (

        <Dialog open={props.employeelistmodal} onClose={handleClose} fullWidth={fullWidth}
            maxWidth={maxWidth} aria-labelledby="form-dialog-title" disableEnforceFocus>
            <DialogTitle id="form-dialog-title">Details</DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Contact</TableCell>
                                <TableCell>Email</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.selectedUsersList.map((row: any, i: number) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        {row.name}
                                    </TableCell>
                                    <TableCell>
                                        {row.contact}
                                    </TableCell>
                                    <TableCell>
                                        {row.email}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Ok
                </Button>

            </DialogActions>
        </Dialog>
    );
}
