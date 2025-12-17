
import React from 'react'

import { useRouter } from 'next/navigation'

import { makeStyles } from '@mui/styles'
import { map, switchMap } from 'rxjs/operators'

import { AgentsService } from '@/services/remote-api/api/agents-services'
import { ClientService } from '@/services/remote-api/api/client-services'
import { InvoiceService } from '@/services/remote-api/api/invoice-services'
import { ClientTypeService } from '@/services/remote-api/fettle-remote-api'
import InvoiceAgentListModal from './modals/invoice.agent.list.modal.component'
import InvoiceReversalModal from './modals/invoice.reversal.modal.component'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button as MuiButton
} from '@mui/material'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Visibility, Replay } from '@mui/icons-material'
const useStyles = makeStyles(theme => ({
  tableBg: {
    height: 505,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  },
  agentListButton: {
    marginLeft: '5px'
  }
}))

const invoiceService = new InvoiceService()
const agentsService = new AgentsService()
const clientservice = new ClientService()
const clienttypeervice = new ClientTypeService()

const dataSource$ = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true
  },
  filterStartDate?: Date | null,
  filterEndDate?: Date | null
) => {
  let clientData: any[]

  pageRequest.sort = ['rowLastUpdatedDate dsc']

  if (pageRequest.searchKey) {
    pageRequest['name'] = pageRequest.searchKey.trim()
  }

  return clientservice
    .getClients(pageRequest)
    .pipe(
      map(data => {
        const content = data.content

        clientData = content
        const clientIds = content.map(item => item.id)

        return clientIds
      })
    )
    .pipe(
      switchMap((clientIds: any) => {
        const pagerequestquery2: any = {
          page: pageRequest.page,
          size: pageRequest.size,
          summary: false
        }

        if (filterStartDate) {
          const startMillis = new Date(filterStartDate).getTime()
          pagerequestquery2.dateFrom = startMillis
        }
        if (filterEndDate) {
          const endMillis = new Date(filterEndDate).getTime()
          pagerequestquery2.dateUpto = endMillis
        }

        pagerequestquery2.sort = ['rowCreatedDate dsc']

        // pagerequestquery2.clientOrProspectId= "1143540719000559616";
        if (pageRequest.searchKey) {
          // pagerequestquery2["invoiceDate"] = pageRequest.searchKey;
          pagerequestquery2['invoiceNumber'] = pageRequest.searchKey.trim()
          pagerequestquery2['clientIds'] = clientIds.trim()
        }

        delete pageRequest.searchKey

        return invoiceService
          .getFundInvoice(pagerequestquery2)
          .pipe(
            map((data2: any) => {
              const content = data2.content

              const records = content.map((item: any) => {
                const clientName = clientData?.find(ele => ele?.id == item?.clientOrProspectId)

                item['dateOfInvoice'] = new Date(item.invoiceDate).toLocaleDateString()
                item['isReverted'] = item.reverted ? 'Yes' + ' ' + '(' + item.type + ')' : 'No'
                item['clientName'] = clientName?.clientBasicDetails?.displayName

                return item
              })

              data2.content = records

              return data2
            })
          )
          .pipe(
            switchMap(data => {
              return clienttypeervice.getCleintTypes().pipe(
                map(ct => {
                  data.content.forEach((cl: any) => {
                    ct.content.forEach(clienttype => {
                      if (cl.clientOrProspectType === clienttype.code || cl.clientOrProspectType === clienttype.id) {
                        cl['clientOrProspectType'] = clienttype.name
                      }
                    })
                  })

                  return data
                })
              )
            })
          )
      })
    )
}

// const dataSource$ = (pageRequest = {
//   page: 0,
//   size: 5,
//   summary: true,
//   active: true
// }) => {
//   agentsService.getAgents(pageRequest).
//     map(val => {
//     val.content.forEach(ele => {
//       ele['primaryContact'] = ele.agentBasicDetails.contactNos[0].contactNo
//     })
//     return val
//   })
// };
type ColumnDef = {
  field: string
  headerName: string
  align?: 'left' | 'center' | 'right'
  body?: (row: any) => React.ReactNode
}

const mainColumns: ColumnDef[] = [
  {
    field: 'invoiceNumber',
    headerName: 'Invoice Number',
    align: 'left',
    body: (rowData: any) => <span style={{ wordBreak: 'break-word' }}>{rowData.invoiceNumber}</span>
  },
  { field: 'clientName', headerName: 'Client Name', align: 'left' },
  { field: 'invoiceType', headerName: 'Invoice Type', align: 'center' },
  { field: 'clientOrProspectType', headerName: 'Client Type', align: 'center' },
  { field: 'dateOfInvoice', headerName: 'Invoice Date', align: 'center' },
  { field: 'totalInvoiceAmount', headerName: 'Total Amount', align: 'right' }
]

const expandedColumns: ColumnDef[] = [
  { field: 'invoiceNumber', headerName: 'Invoice Number' },
  { field: 'clientName', headerName: 'Client Name' },
  { field: 'invoiceType', headerName: 'Invoice Type' },
  { field: 'clientOrProspectType', headerName: 'Client Type' },
  { field: 'dateOfInvoice', headerName: 'Invoice Date' },
  { field: 'totalInvoiceAmount', headerName: 'Total Amount' }
]

export default function FundInvoiceListComponent(props: any) {
  const router = useRouter()
  const [rows, setRows] = React.useState(props.rows)
  const [openAgentListModal, setOpenAgentListModal] = React.useState(false)
  const [reversalModal, setReversalModal] = React.useState(false)
  const [selectedAgentsList, setSelectedAgentsList] = React.useState([])
  const [selectedInvoiceForReversal, setSelectedInvoiceForReversal] = React.useState('')
  const [reloadTable, setReloadTable] = React.useState(false)
  const [dateFilterModalOpen, setDateFilterModalOpen] = React.useState(false)
  const [filterStartDate, setFilterStartDate] = React.useState<Date | null>(null)
  const [filterEndDate, setFilterEndDate] = React.useState<Date | null>(null)

  const classes = useStyles()

  const handleOpen = () => {
    router.push('/invoices?mode=create&type=fund')
  }

  React.useEffect(() => {
    setRows(props.rows)
  }, [props.rows])

  const openEditSection = (invoice: any) => {
    localStorage.setItem('InvoiceNumber', invoice.invoiceNumber)
    router.push(`/invoices/${invoice.id}?mode=view&type=fund`)
  }

  const openAgentModal = (invoice: any) => {
    const arr: any = []

    invoice.invoiceAgents.forEach((ag: any) => {
      arr.push(ag.agentId)
    })

    const pageRequest = {
      page: 0,
      size: 100,
      agentIds: arr
    }

    agentsService.getAgents(pageRequest).subscribe(res => {
      if (res.content.length > 0) {
        invoice.invoiceAgents.forEach((ag: any) => {
          res.content.forEach(item => {
            if (ag.agentId === item.id) {
              ag['name'] = item.agentBasicDetails.name
            }
          })
        })
        setSelectedAgentsList(invoice.invoiceAgents)
      }

      setOpenAgentListModal(true)
    })
  }

  const handleCloseAgentListModal = () => {
    setOpenAgentListModal(false)
    setSelectedAgentsList([])
  }

  const handleCloseReversalModal = () => {
    setReversalModal(false)
  }

  const submitReversalModal = (remarks: any) => {
    invoiceService.revertFundInvoice(remarks, selectedInvoiceForReversal).subscribe(ele => {
      handleCloseReversalModal()
      setReloadTable(true)
      setTimeout(() => {
        setReloadTable(false)
      }, 3000)
    })
  }

  const openReversalModal = (item: any) => {
    setSelectedInvoiceForReversal(item.id)
    setReversalModal(true)
  }

  const disableMenu = (item: { reverted: any }) => {
    return item.reverted
  }

  const xlsColumns = [
    'invoiceNumber',
    'clientName',
    'invoiceType',
    'clientOrProspectType',
    'dateOfInvoice',
    'totalInvoiceAmount'
  ]

  const configuration = {
    useAccordionMode: true,
    enableSelection: false,
    scrollHeight: '600px',
    pageSize: 10,
    actionButtons: [
      {
        key: 'view_fund_invoice',
        icon: <Visibility fontSize='small' />,
        color: '#007bff',
        tooltip: 'View',
        onClick: openEditSection
      },
      {
        key: 'agents_fund_invoice',
        icon: <Visibility fontSize='small' />,
        color: '#17a2b8',
        tooltip: 'Agents',
        onClick: openAgentModal
      },
      {
        key: 'reversal_fund_invoice',
        icon: <Replay fontSize='small' />,
        color: '#dc3545',
        tooltip: 'Reversal',
        onClick: openReversalModal,
        disabled: disableMenu
      }
    ],
    columnOptions: {
      enableSorting: true,
      enableColumnMenu: true,
      enableFiltering: true,
      enableColumnVisibility: false
    },
    expandableConfig: {
      gridTemplate: '60px 2fr 1.5fr 1.5fr 1.2fr 1fr auto',
      getStatusColor: () => 'transparent',
      renderExpandedContent: (row: any) => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px', padding: '16px 24px', backgroundColor: '#f8f9fa', borderTop: '1px solid #e9ecef' }}>
          {expandedColumns.map((col, idx) => (
            <div key={`${col.field}-${idx}`} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ color: '#6c757d', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>{col.headerName}</span>
              <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                {col.body ? col.body(row) : (row[col.field] ?? 'N/A')}
              </span>
            </div>
          ))}
        </div>
      )
    },
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      addCreateButton: true,
      onCreateButtonClick: handleOpen,
      text: 'Fund Invoice Management',
      enableGlobalSearch: true,
      enableDateFilter: true,
      onDateFilterClick: () => setDateFilterModalOpen(true)
    }
  }

  const style = {
    fontSize: '14px'
  }

  return (
    <div>
      <Dialog open={dateFilterModalOpen} onClose={() => setDateFilterModalOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Filter by Date Range</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label='Start Date'
                value={filterStartDate}
                onChange={(newValue) => setFilterStartDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth variant='outlined' />}
              />
              <DatePicker
                label='End Date'
                value={filterEndDate}
                onChange={(newValue) => setFilterEndDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth variant='outlined' />}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => {
            setFilterStartDate(null)
            setFilterEndDate(null)
            setDateFilterModalOpen(false)
            setReloadTable(prev => !prev)
          }} color='secondary'>
            Clear
          </MuiButton>
          <MuiButton onClick={() => {
            setDateFilterModalOpen(false)
            setReloadTable(prev => !prev)
          }} variant='contained'>
            Apply Filter
          </MuiButton>
          <MuiButton onClick={() => setDateFilterModalOpen(false)}>
            Cancel
          </MuiButton>
        </DialogActions>
      </Dialog>
      {/* <DataGrid rows={rows} columns={props.columns} pageSize={10} /> */}
      <FettleDataGrid
        $datasource={(pageRequest: any) => dataSource$(pageRequest, filterStartDate, filterEndDate)}
        config={configuration}
        columnsdefination={mainColumns}
        onEdit={openEditSection}
        // style={style}
        reloadtable={reloadTable}
      />
      <InvoiceAgentListModal
        openAgentListModal={openAgentListModal}
        handleCloseAgentListModal={handleCloseAgentListModal}
        selectedAgentsList={selectedAgentsList}
      />
      <InvoiceReversalModal
        reversalModal={reversalModal}
        handleCloseReversalModal={handleCloseReversalModal}
        selectedInvoiceForReversal={selectedInvoiceForReversal}
        submitReversalModal={submitReversalModal}
      />
    </div>
  )
}
