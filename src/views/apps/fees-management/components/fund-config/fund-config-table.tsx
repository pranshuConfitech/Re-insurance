import React from "react";

import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

/* import DeleteIcon from "@mui/icons-material/Delete"; */
import EditIcon from "@mui/icons-material/Edit";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  container: {
    maxHeight: 400,
  },
  actionBlock: {
    /*  display: "flex",
     justifyContent: "space-evenly", */
  },
});

export default function RenewalTable(props:any) {
  const classes = useStyles();
  const designList = props.designList;
  const preventDefault = (event:any) => event.preventDefault();

  const editTableRule = (row:any, idx:number) => (e:any) => {
    props.editTableRule(row, idx);
  };

  // const deleteTableRule = (row, idx) => (e) => {
  //   // props.deleteTableRule(row, idx);
  // };

  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table stickyHeader className={classes.table} aria-label="service design table">
        <TableHead>
          <TableRow>
            <TableCell>Percentage of Fund Exhausted</TableCell>
            <TableCell align="center">Alert Message</TableCell>
            <TableCell align="center">Restrict Claim Process</TableCell>
            <TableCell align="center">Client</TableCell>
            <TableCell align="center">Alert Mode</TableCell>
            {props.action &&
              <TableCell align="center">Action</TableCell>
            }
          </TableRow>
        </TableHead>
        <TableBody>
  
          {designList.map((row:any, idx:number) => {
            const alertMode = {sms:row.alertModeSms? 'SMS':'', email:row.alertModeEmail? 'Email':'', whatsapp: row.alertModeWhatsapp? 'whatsapp':''} 
            const {sms, email, whatsapp} = alertMode;

            
return (
              <TableRow key={row?.serviceType}>
                {/* <TableCell component="th" scope="row">
                  {row?.serviceTypeName}
                </TableCell> */}
                <TableCell align="center">{row?.percentageOfFundExhausted}%</TableCell>
                <TableCell align="center">{row?.alertMessage}</TableCell>
                <TableCell align="center">{row?.restrictClaim && 'Yes' || 'No'}</TableCell>
                <TableCell align="center">{row.groupClient === 'ALL'? 'ALL':row?.groupClient.map((item:any) =>  ` ${item}`)}</TableCell>
                <TableCell align="center">{`${sms} ${email} ${whatsapp}`}</TableCell>
                {props.action &&
                  <TableCell align="center" className={classes.actionBlock}>
                    {/* <Link href="javascript:void(0)" onClick={preventDefault}>
                      <VisibilityIcon />
                    </Link> */}
                    <Link href="javascript:void(0)" onClick={editTableRule(row, idx)}>
                      <EditIcon />
                    </Link>
                    {/* <Link href="javascript:void(0)" onClick={deleteTableRule(row, idx)}>
                      <DeleteIcon />
                    </Link> */}
                  </TableCell>
                }
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
