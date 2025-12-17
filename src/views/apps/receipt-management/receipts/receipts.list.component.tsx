import React, { useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { makeStyles } from '@mui/styles'
import { map, switchMap } from 'rxjs/operators'

import { 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Typography, 
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material'
import { 
  CloseOutlined, 
  Download as DownloadIcon, 
  Visibility, 
  Replay 
} from '@mui/icons-material'

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import ReceiptReversalModal from './modals/receipts.revert.modal.component'
import { ClientService } from '@/services/remote-api/api/client-services'
import { ReceiptService } from '@/services/remote-api/api/receipts-services'

import RoleService from '@/services/utility/role'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const PAGE_NAME = 'RECEIPT'
const roleService = new RoleService()

const useStyles = makeStyles(theme => ({
  tableBg: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  },
  agentListButton: {
    marginLeft: '5px'
  },
  categoryButton: {}
}))

const receiptService = new ReceiptService()
const clientservice = new ClientService()

// Define column type
interface ColumnDef {
  field: string;
  headerName: string;
  body?: (row: any) => React.ReactNode;
}

// Main columns for accordion view
const mainColumns: ColumnDef[] = [
  { field: 'receiptNumber', headerName: 'Receipt Number' },
  { field: 'dateOfReceipt', headerName: 'Receipt Date' },
  { field: 'clientOrProspectId', headerName: 'Client ID' },
]

// Expanded columns
const expandedColumns: ColumnDef[] = [
  { field: 'isReverted', headerName: 'Is Reverted' },
  { field: 'type', headerName: 'Type' },
  { field: 'amount', headerName: 'Amount' },
]

export default function ReceiptListComponent(props: any) {
  const router = useRouter()
  const classes = useStyles()
  const theme = useTheme()
  const [searchType, setSearchType] = React.useState(0)
  const [reversalModal, setReversalModal] = React.useState(false)
  const [reloadTable, setReloadTable] = React.useState(false)
  const [receiptStartDate, setReciptStartDate]: any = React.useState(null)
  const [receiptEndDate, setReciptEndDate]: any = React.useState(null)
  const [selectedReceiptForReversal, setSelectedReceiptForReversal] = React.useState('')
  
  // Date filter modal states
  const [dateFilterModalOpen, setDateFilterModalOpen] = React.useState(false)
  const [filterStartDate, setFilterStartDate] = React.useState<Date | null>(null)
  const [filterEndDate, setFilterEndDate] = React.useState<Date | null>(null)

  const handleOpen = () => {
    router.push('/receipts?mode=create')
  }

  const openEditSection = (receipt: any) => {
    router.push(`/receipts/${receipt.id}?mode=view`)
  }

  const handleCloseReversalModal = () => {
    setReversalModal(false)
  }

  const submitReversalModal = (remarks: any) => {
    receiptService.revertReceipt(remarks, selectedReceiptForReversal).subscribe(ele => {
      handleCloseReversalModal()
      setReloadTable(true)
    })
  }

  const openReversalModal = (item: any) => {
    setSelectedReceiptForReversal(item.id)
    setReversalModal(true)
  }

  const downloadReceipt = (item: { id: string }) => {
    receiptService.getReceiptDownload(item?.id).subscribe((blob: any) => {
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `Receipt_${item.id}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(downloadUrl)
    })
  }

  const disableMenu = (item: { reverted: any }) => {
    return item.reverted
  }

  const dataSource$ = useCallback((
    pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
    }
  ) => {
    pageRequest.sort = ['rowLastUpdatedDate dsc']

    if (pageRequest.searchKey) {
      pageRequest['name'] = pageRequest.searchKey.trim()
    }

    // Apply date filter
    if (filterStartDate) {
      const startDate = new Date(filterStartDate)
      startDate.setHours(0, 0, 0, 0)
      pageRequest.receiptDateStart = startDate.getTime()
    }
    if (filterEndDate) {
      const endDate = new Date(filterEndDate)
      endDate.setHours(23, 59, 59, 999)
      pageRequest.receiptDateEnd = endDate.getTime()
    }

    return clientservice
      .getClients(pageRequest)
      .pipe(
        map(data => {
          const content = data.content
          const clientIds = content.map(item => item.id)
          return clientIds
        })
      )
      .pipe(
        switchMap(clientIds => {
          const pagerequestquery2: any = {
            page: pageRequest.page,
            size: pageRequest.size,
            summary: false,
            subType: "RECEIPT"
          }

          pagerequestquery2.sort = ['rowLastUpdatedDate dsc']

          if (pageRequest.searchKey) {
            pagerequestquery2['receiptNumber'] = pageRequest.searchKey
            pagerequestquery2['clientIds'] = pageRequest.searchKey
          }

          if (pageRequest.receiptDateStart) {
            pagerequestquery2.receiptDateStart = pageRequest.receiptDateStart
          }
          if (pageRequest.receiptDateEnd) {
            pagerequestquery2.receiptDateEnd = pageRequest.receiptDateEnd
          }

          delete pageRequest.searchKey

          return receiptService.getReceipts(pagerequestquery2).pipe(
            map(data2 => {
              const content = data2.content

              const records = content.map((item: any) => {
                item['dateOfReceipt'] = new Date(item.receiptDate).toLocaleDateString()
                item['isReverted'] = item.reverted ? 'Yes' + ' ' + '(' + item.type + ')' : 'No'
                return item
              })

              data2.content = records
              return data2
            })
          )
        })
      )
  }, [filterStartDate, filterEndDate])

  // Date filter handlers
  const handleDateFilterApply = () => {
    setDateFilterModalOpen(false)
    setReloadTable(true)
    setTimeout(() => setReloadTable(false), 100)
  }

  const handleDateFilterClear = () => {
    setFilterStartDate(null)
    setFilterEndDate(null)
    setDateFilterModalOpen(false)
    setReloadTable(true)
    setTimeout(() => setReloadTable(false), 100)
  }

  const actionBtnList = [
    {
      key: 'download_receipt',
      icon: <DownloadIcon fontSize="small" />,
      color: '#28a745',
      className: 'ui-button-warning',
      tooltip: 'Download',
      onClick: downloadReceipt
    },
    {
      key: 'view_receipt',
      icon: <Visibility fontSize="small" />,
      color: '#18a2b8',
      className: 'ui-button-warning',
      tooltip: 'View',
      onClick: openEditSection
    },
    {
      key: 'revert_receipt',
      icon: <Replay fontSize="small" />,
      color: '#ff9800',
      disabled: disableMenu,
      className: classes.agentListButton,
      tooltip: 'Revert',
      onClick: openReversalModal
    }
  ]

  const xlsColumns = ['receiptNumber', 'dateOfReceipt', 'clientOrProspectId', 'isReverted']

  const configuration: any = {
    useAccordionMode: true,
    enableSelection: false,
    scrollHeight: '300px',
    pageSize: 10,
    actionButtons: roleService.checkActionPermission(PAGE_NAME, '', () => { }, actionBtnList),
    columnOptions: {
      enableColumnSorting: true,
      enableColumnFilters: true,
      enableColumnVisibility: false,
      enableColumnManagement: false,
    },
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
      onCreateButtonClick: handleOpen,
      text: 'Invoiced Receipts',
      enableGlobalSearch: true,
      enableDateFilter: true,
      onDateFilterClick: () => setDateFilterModalOpen(true),
    },
    expandableConfig: {
      mainColumns: mainColumns,
      expandedColumns: expandedColumns,
      gridTemplate: '60px 2fr 2fr 2fr auto',
      getStatusColor: () => 'transparent',
      renderExpandedContent: (row: any) => (
        <Box sx={{ p: 2, backgroundColor: '#fafafa' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            {expandedColumns.map((col) => (
              <Box key={col.field}>
                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                  {col.headerName}
                </Typography>
                <Typography variant="body2">
                  {col.body ? col.body(row) : row[col.field] || '-'}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ),
    },
  }

  return (
    <div>
      <ReceiptReversalModal
        reversalModal={reversalModal}
        handleCloseReversalModal={handleCloseReversalModal}
        selectedReceiptForReversal={selectedReceiptForReversal}
        submitReversalModal={submitReversalModal}
      />
      
      <FettleDataGrid
        $datasource={dataSource$}
        config={configuration}
        columnsdefination={mainColumns}
        onEdit={openEditSection}
        reloadtable={reloadTable}
      />

      {/* Date Filter Modal */}
      <Dialog open={dateFilterModalOpen} onClose={() => setDateFilterModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Filter by Date</Typography>
            <IconButton onClick={() => setDateFilterModalOpen(false)} size="small">
              <CloseOutlined />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" gap={2} mt={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={filterStartDate}
                onChange={(date) => setFilterStartDate(date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={filterEndDate}
                onChange={(date) => setFilterEndDate(date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDateFilterClear} color="secondary">
            Clear
          </Button>
          <Button onClick={handleDateFilterApply} variant="contained" color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
