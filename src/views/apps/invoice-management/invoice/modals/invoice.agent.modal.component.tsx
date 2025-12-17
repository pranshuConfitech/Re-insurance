import * as React from 'react'
import { useEffect } from 'react'

import { Button } from 'primereact/button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import DeleteIcon from '@mui/icons-material/Delete'

import 'date-fns'

import { map } from 'rxjs/operators'

import { AgentsService } from '@/services/remote-api/api/agents-services'
import { FettleMultiFieldSearch } from '@/views/apps/shared-component/components/fettle.multi.field.search'

const agentservice = new AgentsService()

export default function InvoiceAgentModal(props: any) {
  const [selectedAgents, setSelectedAgents] = React.useState([])

  useEffect(() => {
    setSelectedAgents(props.agentsList)
  }, [props.agentsList])

  const handleModalSubmit = (e: any) => {
    props.handleAgentModalSubmit(selectedAgents)
  }

  const handleClose = () => {
    props.handleCloseAgentModal()
  }

  const deleteAgent = (agentId: any) => {
    const list = [...selectedAgents]
    const arr = list.filter((ele: any) => ele.agentId !== agentId)

    setSelectedAgents(arr)
  }

  const dataSource$ = (fields: any, pageRequest = { page: 0, size: 10 }) => {
    const pagerequestquery: any = {
      page: pageRequest.page,
      size: pageRequest.size,
      summary: false
    }

    Object.keys(fields)
      .filter(key => !!fields[key])
      .forEach(key => (pagerequestquery[key] = fields[key]))

    return agentservice.importAgentData(pagerequestquery).pipe(
      map(data => {
        const content = data.content

        const records = content.map((item: any) => {
          item['contactNo'] = item.agentBasicDetails.contactNos[0].contactNo
          item['code'] = item.agentBasicDetails.code
          item['name'] = item.agentBasicDetails.name
          item['agentId'] = item.id
          item['commissionType'] = 'PERCENTAGE'
          item['commissionValue'] = 0
          item['finalValue'] = ''

          return item
        })

        data.content = records

        return data
      })
    )
  }

  const fields = [
    { label: 'Code', propertyName: 'code' },
    { label: 'Name', propertyName: 'name' },
    { label: 'Contact', propertyName: 'contactNo' }
  ]

  const columnsDefinations = [
    { field: 'code', headerName: 'Agent Code' },
    { field: 'name', headerName: 'Agent Name' },
    { field: 'contactNo', headerName: 'Agent Contact' }
  ]

  const handleImport = (item: { agentId: any }) => {
    let isPresent = false
    const list: any = [...selectedAgents]

    selectedAgents.forEach((ele: any) => {
      if (ele.agentId === item.agentId) {
        isPresent = true
      }
    })

    if (!isPresent) {
      list.push(item)
      setSelectedAgents(list)
    }
  }

  return (
    <Dialog open={props.openAgentModal} onClose={handleClose} aria-labelledby='form-dialog-title' disableEnforceFocus>
      <DialogTitle id='form-dialog-title'>Select Agent</DialogTitle>
      <DialogContent>
        <FettleMultiFieldSearch
          $datasource={dataSource$}
          fields={fields}
          onSelect={(item: any) => {
            handleImport(item)
          }}
          columnsDefinations={columnsDefinations}
          dataGridPageSize={10}
          dataGridScrollHeight='400px'
        />
        {/* <Grid container spacing={3} style={{ marginBottom: "20px" }}>
                    <Grid item xs={12}>

                    </Grid>
                </Grid> */}
        <Divider />

        {selectedAgents.length > 0 && (
          <TableContainer component={Paper}>
            <Table size='small' aria-label='a dense table'>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedAgents.map((row: any) => (
                  <TableRow key={row.agentId}>
                    <TableCell component='th' scope='row'>
                      {row.code}
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.contactNo}</TableCell>
                    <TableCell>
                      <Button
                        icon={<DeleteIcon style={{ color: '#dc3545' }} />}
                        color='secondary'
                        // className={classes.button}
                        onClick={() => {
                          deleteAgent(row.agentId)
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
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
