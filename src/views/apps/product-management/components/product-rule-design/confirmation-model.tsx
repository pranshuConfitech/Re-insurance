import React from 'react'
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material';
import { Button } from 'primereact/button'

export default function ConfirmationModel({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  messageComponent,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel"
}: {
  open: boolean,
  onClose: () => void,
  onConfirm: () => void,
  title?: string,
  message?: string,
  messageComponent?: React.ReactNode,
  confirmLabel?: string,
  cancelLabel?: string
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
      <Box padding={5}>
          <Grid container spacing={4}>
            <DialogContentText>{messageComponent || message}</DialogContentText>
          </Grid>
      </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary' autoFocus className='p-button-text'>
          {cancelLabel}
        </Button>
        <Button onClick={onConfirm} color="primary">
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}


