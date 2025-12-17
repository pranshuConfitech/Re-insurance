import * as React from 'react'

import { Button } from 'primereact/button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import 'date-fns'

import { InvoiceService } from '@/services/remote-api/api/invoice-services'

const invoiceservice = new InvoiceService()

export default function EditConfirmationModal(props: any) {
  const [fullWidth, setFullWidth] = React.useState(true)
  const [maxWidth, setMaxWidth]: any = React.useState('sm')

  const handleClose = () => {
    props.closeConfirmationModal('no')
  }

  const handleModalSubmit = () => {
    props.closeConfirmationModal('yes')

    // invoiceservice.revertInvoice(remarks,props.selectedInvoiceForReversal).subscribe(ele=> {
    //     props.handleCloseReversalModal();
    // })
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
      <DialogTitle id='form-dialog-title'>Edit Client</DialogTitle>
      <DialogContent>
        <span>Editing here will also change the original client data.Do you still want to continue?</span>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} className='p-button-text' color='primary'>
          No
        </Button>
        <Button onClick={handleModalSubmit} color='primary'>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
