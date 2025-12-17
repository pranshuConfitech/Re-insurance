import * as React from 'react';

import { Button } from 'primereact/button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';

import 'date-fns';

export default function ClaimModal(props:any) {
  const [state, setState] = React.useState({
    insuranceCompany: '',
    corporateName: '',
    membershipNo: '',
    memberName: '',
    gender: '',
    age: '',
    policyCode: '',
    policyType: '',
    policyPeriod: '',
    enrolmentDate: '',
  });

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<any>('sm');

  const handleClose = () => {
    props.handleCloseClaimModal();
  };

  const handleModalSubmit = () => {};

  return (
    <Dialog
      open={props.claimModal}
      onClose={handleClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      aria-labelledby="form-dialog-title"
      disableEnforceFocus>
      <DialogTitle id="form-dialog-title">Claim Member Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid item xs={12} style={{ marginTop: '20px' }}>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Policy Code</TableCell>
                    <TableCell>Plan Name</TableCell>
                    <TableCell>Scheme Category</TableCell>
                    <TableCell>Policy Period</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody />
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="standard-multiline-flexible"
              name="insuranceCompany"
              value={props.memberBasic.insuranceCompany}
              label="Insurance Company"
              InputProps={{readOnly:true}}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="standard-multiline-flexible"
              name="corporateName"
              value={props.memberBasic.corporateName}
              label="Corporate Name"
              InputProps={{readOnly:true}}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              id="standard-multiline-flexible"
              name="membershipNo"
              value={props.memberBasic.membershipNo}
              label="Membership No"
              InputProps={{readOnly:true}}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField id="standard-multiline-flexible" InputProps={{readOnly:true}} name="memberName" value={props.memberBasic.name} label="Member Name" />
          </Grid>
          <Grid item xs={6}>
            <TextField id="standard-multiline-flexible" InputProps={{readOnly:true}} name="gender" value={props.memberBasic.gender} label="Gender" />
          </Grid>
          <Grid item xs={6}>
            <TextField id="standard-multiline-flexible" InputProps={{readOnly:true}} name="age" value={props.memberBasic.age} label="Age" />
          </Grid>
          <Grid item xs={6}>
            <TextField id="standard-multiline-flexible" InputProps={{readOnly:true}} name="policyCode" value={props.memberBasic.policyCode} label="Policy Code" />
          </Grid>
          <Grid item xs={6}>
            <TextField id="standard-multiline-flexible" InputProps={{readOnly:true}} name="policyType" value={props.memberBasic.policyType} label="Policy type" />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="standard-multiline-flexible"
              name="enrolmentDate"
              value={props.memberBasic.enrolmentDate}
              label="First Enrollment date"
              InputProps={{readOnly:true}}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="standard-multiline-flexible"
              name="policyPeriod"
              value={props.memberBasic.policyPeriod}
              label="Policy Period"
              InputProps={{readOnly:true}}
            />
          </Grid>
          <Grid item xs={12} style={{ marginTop: '20px' }}>
            <span style={{ color: '#4472C4', fontWeight: 'bold' }}>Policy Conditions(Benefits/Coverage)</span>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Benefit</TableCell>
                    <TableCell>Waiting Period</TableCell>
                    <TableCell>Max Limit(KSH)</TableCell>
                    <TableCell>Consumed(KSH)</TableCell>
                    <TableCell>Balance(KSH)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody />
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Ok
        </Button>
       
      </DialogActions>
    </Dialog>
  );
}
