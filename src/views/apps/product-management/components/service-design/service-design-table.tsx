import React from 'react';

import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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

export default function ServiceDesignTable(props:any) {
  const classes = useStyles();
  const designList = props.designList;
  const preventDefault = (event:any) => event.preventDefault();

  const editTableRule = (row:any, idx:any) => (e:any) => {
    props.editTableRule(row, idx);
  };

  const deleteTableRule = (row:any, idx:any) => (e:any) => {
    props.deleteTableRule(row, idx);
  };

  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table stickyHeader className={classes.table} aria-label="service design table">
        <TableHead>
          <TableRow>
            <TableCell>Service Type</TableCell>
            <TableCell align="center">Service Name</TableCell>
            <TableCell align="right">Max Limit</TableCell>
            <TableCell align="right">Waiting Period</TableCell>
            <TableCell align="right">Co-Share/Co-Pay</TableCell>
            <TableCell align="right">Mark As Exclude</TableCell>
            {props.action && <TableCell align="center">Action</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {designList &&
            designList?.map((row:any, idx:any) => {
              return (
                <TableRow key={row?.serviceType}>
                  <TableCell component="th" scope="row">
                    {row?.serviceTypeName}
                  </TableCell>
                  <TableCell align="center">{row?.serviceName}</TableCell>
                  <TableCell align="right">{row?.maxLimitValue}</TableCell>
                  <TableCell align="right">{row?.waitingPeriod}</TableCell>
                  <TableCell align="right">{row?.coShareOrPayPercentage}</TableCell>
                  <TableCell align="right">{(row?.toBeExcluded && 'Yes') || 'No'}</TableCell>
                  {props.action && (
                    <TableCell align="center" className={classes.actionBlock}>
                      {/* <Link href="javascript:void(0)" onClick={preventDefault}>
                      <VisibilityIcon />
                    </Link> */}
                      <Link href="javascript:void(0)" onClick={editTableRule(row, idx)}>
                        <EditIcon />
                      </Link>
                      <Link href="javascript:void(0)" onClick={deleteTableRule(row, idx)}>
                        <DeleteIcon style={{ color: 'red' }} />
                      </Link>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
