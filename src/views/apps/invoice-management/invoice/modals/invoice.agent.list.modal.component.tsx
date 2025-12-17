import * as React from 'react'

import { Button } from 'primereact/button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import 'date-fns'

import { ClientService, ProspectService } from '@/services/remote-api/api/client-services'

const clientservice = new ClientService()
const prospectservice = new ProspectService()

export default function InvoiceAgentListModal(props: any) {
  const handleClose = () => {
    props.handleCloseAgentListModal()
  }

  return (
    <Dialog
      open={props.openAgentListModal}
      onClose={handleClose}
      aria-labelledby='form-dialog-title'
      disableEnforceFocus
    >
      <DialogTitle id='form-dialog-title'>Agents</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table size='small' aria-label='a dense table'>
            <TableHead>
              <TableRow>
                <TableCell>Agent name</TableCell>
                <TableCell>Commission value</TableCell>
                <TableCell align='right'>Final value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.selectedAgentsList.map((row: any, i: any) => (
                <TableRow key={i}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.commissionValue}%</TableCell>
                  <TableCell align='right'>{row.finalValue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} className='p-button-text' color='primary'>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
