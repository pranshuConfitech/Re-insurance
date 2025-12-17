import * as React from 'react';
import { useEffect } from 'react';

import { Button } from 'primereact/button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import 'date-fns';

export default function ProviderCategoryListModal(props:any) {
  let columns = [
    { field: 'categoryId', headerName: 'ID', width: 70 },
    { field: 'catName', headerName: 'Name', width: 130 },
    { field: 'planName', headerName: 'Plan name', width: 130 },
    { field: 'startDate', headerName: 'Start date', width: 130 },
  ];


  //planList,Categorylist,providerCategoryHistorys
  useEffect(() => {
  }, [props.planList, props.Categorylist, props.providerCategoryHistorys]);

  const setColumns = (value:any) => {
    columns = [
      { field: 'categoryId', headerName: 'Name', width: 130 },
      { field: 'planId', headerName: 'Plan name', width: 130 },
      { field: 'startDate', headerName: 'Start date', width: 130 },
    ];
  };

  const handleClose = () => {
    props.closeCategoryListModal();
  };

  return (
    <Dialog
      open={props.openCategoryListModal}
      fullWidth={true}
      maxWidth="md"
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      disableEnforceFocus>
      <DialogTitle id="form-dialog-title">Category List</DialogTitle>
      <DialogContent>
        {/* <DataGrid rows={props.providerCategoryHistorys} columns={columns} pageSize={10}  /> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
