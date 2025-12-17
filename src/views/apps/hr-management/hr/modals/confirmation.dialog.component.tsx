import * as React from 'react'

import { Button } from 'primereact/button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import MuiAlert from '@mui/lab/Alert'

import 'date-fns'

import { HierarchyService } from '@/services/remote-api/api/hierarchy-services/hierarchy.services'

const orgtypeservice = new HierarchyService()

function Alert(props: any) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

export default function ConfirmationDialogComponent(props: any) {
  const [remarks, setRemarks] = React.useState('')
  const [fullWidth, setFullWidth] = React.useState(true)
  const [maxWidth, setMaxWidth] = React.useState<any>('sm')
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  const [snackbarMessage, setSnackbarMessage] = React.useState('')

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleClose = () => {
    props.confirmNo()
  }

  const handleModalSubmit = () => {
    props.confirmYes(props.selectedNode)
  }

  const handleChange = (e: any) => {
    setRemarks(e.target.value)
  }

  return (
    <Dialog
      open={props.confirmModal}
      onClose={handleClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      aria-labelledby='form-dialog-title'
      disableEnforceFocus
    >
      {/* <DialogTitle id="form-dialog-title">Add Position</DialogTitle> */}
      <DialogContent>
        <span>Are you sure to delete? Please confirm.</span>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModalSubmit} color='primary'>
          Yes
        </Button>
        <Button onClick={handleClose} color='primary' className='p-button-text'>
          No
        </Button>
      </DialogActions>
    </Dialog>
  )
}
