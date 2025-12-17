import * as React from 'react'

import { Button } from 'primereact/button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import 'date-fns'

import type { Breakpoint } from '@mui/material'

import { InvoiceService } from '@/services/remote-api/api/invoice-services/invoice.services'

const invoiceservice = new InvoiceService()

export default function DenominationConfirmModal(props: any) {
  const [remarks, setRemarks] = React.useState('')
  const [fullWidth, setFullWidth] = React.useState(true)
  const [maxWidth, setMaxWidth] = React.useState<false | Breakpoint | undefined>('sm')

  const handleClose = () => {
    props.closeDeleteModal()
  }

  const handleModalSubmit = () => {
    props.handleDelete()

    // props.submitReversalModal(remarks)
    // invoiceservice.revertInvoice(remarks,props.selectedInvoiceForReversal).subscribe(ele=> {
    //     props.handleCloseReversalModal();
    // })
  }

  const handleChange = (e: any) => {
    setRemarks(e.target.value)
  }

  return (
    <Dialog
      open={props.openConfirmModal}
      onClose={handleClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      aria-labelledby='form-dialog-title'
      disableEnforceFocus
    >
      <DialogTitle id='form-dialog-title'>Disable Denomination</DialogTitle>
      <DialogContent>
        <span>Are you sure to disable this denomination?</span>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          No
        </Button>
        <Button onClick={handleModalSubmit} color='primary'>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
