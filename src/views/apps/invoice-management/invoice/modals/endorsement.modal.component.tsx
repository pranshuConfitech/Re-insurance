import * as React from 'react'

import { Button } from 'primereact/button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import 'date-fns'

import { map } from 'rxjs/operators'

import { EndorsementService } from '@/services/remote-api/api/endorsement-services/endorsement.services'
import { FettleDataGrid } from '@/views/apps/shared-component/components/fettle.data.grid'

const endorsementService = new EndorsementService()

export default function EndorsementModal(props: any) {
  const { setOpenEndorsementModal, handleCloseEndorsementModal, clientData } = props
  const [selectedEndorsements, setSelectedEndorsements] = React.useState([])
  const [selectedPolicyId, setSelectedPolicyId] = React.useState(null)

  const handleModalSubmit = (e: any) => {
    props.setOpenEndorsementModal(false)
    props.handleSubmitEndorsementModal(selectedEndorsements)
    props.handleCloseEndorsementModal()
    setSelectedPolicyId(null)
  }

  const handleClose = () => {
    handleCloseEndorsementModal()
    setSelectedPolicyId(null)
  }

  const dataSource$ = () => {
    const pagerequestquery = {
      page: 0,
      size: 10,
      active: true,
      summary: false,
      clientId: clientData?.clientId
    }

    return endorsementService.getEndorsements(pagerequestquery).pipe(
      map(data => {
        const content = data.content

        if (content.length > 0) {
          const records = content.map(item => {
            item['endorsementDateVal'] = new Date(item.endorsementDate).toLocaleDateString()

            return item
          })

          data.content = records
        }

        return data
      })
    )
  }

  const columnsDefinations = [
    { field: 'id', headerName: 'Endorsement Number' },
    { field: 'endorsementDateVal', headerName: 'Endorsement Date' },
    { field: 'policyId', headerName: 'Policy Id' }
  ]

  const handleSelectedRows = (selectedEndorsements: any) => {
    if (selectedEndorsements.length === 0) {
      setSelectedPolicyId(null)
    } else {
      setSelectedEndorsements(selectedEndorsements)

      if (!selectedPolicyId) {
        setSelectedPolicyId(selectedEndorsements[0].policyId)
      }
    }
  }

  const configuration: any = {
    enableSelection: true,
    scrollHeight: props.dataGridScrollHeight,
    header: {
      enable: true,
      onSelectionChange: handleSelectedRows
    },
    pageSize: props.dataGridPageSize
  }

  const isSelectable = (rowData: any) => {
    if (!selectedPolicyId) {
      if (rowData.status !== 'APPROVED') {
        alert('Only APPROVED endorsements can be selected')

        return false
      }

      return true
    }

    const isSelectableRow = rowData.policyId === selectedPolicyId

    if (rowData.status !== 'APPROVED') {
      alert('Only APPROVED endorsements can be selected')

      return false
    }

    if (!isSelectableRow) {
      alert('You cannot select endorsements of different policies')

      return false
    }

    return isSelectableRow
  }

  return (
    <Dialog
      open={props.openEndorsementModal}
      onClose={handleClose}
      aria-labelledby='form-dialog-title'
      disableEnforceFocus
    >
      <DialogTitle id='form-dialog-title'>Select Endorsement</DialogTitle>
      <DialogContent>
        <FettleDataGrid
          $datasource={dataSource$}
          config={configuration}
          columnsdefination={columnsDefinations}
          isRowSelectable={isSelectable}
          width={'30rem'}
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
