import * as React from 'react'

import { Button } from 'primereact/button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

import 'date-fns'

import { InvoiceService } from '@/services/remote-api/api/invoice-services'

const invoiceservice = new InvoiceService()

export default function InvoiceReversalModal(props: any) {
  const [remarks, setRemarks] = React.useState('')
  const [fullWidth, setFullWidth] = React.useState(true)
  const [maxWidth, setMaxWidth]: any = React.useState('sm')

  const handleClose = () => {
    props.handleCloseReversalModal()
  }

  const handleModalSubmit = () => {
    props.submitReversalModal(remarks)

    // invoiceservice.revertInvoice(remarks,props.selectedInvoiceForReversal).subscribe(ele=> {
    //     props.handleCloseReversalModal();
    // })
  }

  const handleChange = (e: any) => {
    setRemarks(e.target.value)
  }

  return (
    <Dialog
      open={props.reversalModal}
      onClose={handleClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      aria-labelledby='form-dialog-title'
      disableEnforceFocus
    >
      <DialogTitle id='form-dialog-title'>Invoice Reversal</DialogTitle>
      <DialogContent>
        <TextField
          id='standard-multiline-flexible'
          required
          style={{ width: '100%',marginTop: '10px' }}
          multiline
          name='remarks'
          value={remarks}
          onChange={handleChange}
          label='Remarks'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} className='p-button-text' color='primary'>
          Cancel
        </Button>
        <Button onClick={handleModalSubmit} color='primary'>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
