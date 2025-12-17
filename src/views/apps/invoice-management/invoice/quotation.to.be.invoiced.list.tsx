import React from 'react'

import { useRouter } from 'next/navigation'

import { makeStyles } from '@mui/styles'
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
import { Add } from '@mui/icons-material'

import RoleService from '@/services/utility/role'
import { QuotationService } from '@/services/remote-api/api/quotation-services/quotation.service'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const PAGE_NAME = 'INVOICE'
const roleService = new RoleService()
const quotationService = new QuotationService()

const useStyles = makeStyles(() => ({
  categoryButton: {
    marginLeft: '5px',
    marginBottom: '5px',
    color: 'white'
  }
}))

const mainColumns = [
  { field: 'prospectName', headerName: 'Prospect Name', align: 'left' },
  { field: 'quotationNo', headerName: 'Quotation No.', align: 'left', body: (row: any) => <span style={{ wordBreak: 'break-word' }}>{row.quotationNo}</span> },
  { field: 'tag', headerName: 'Tag', align: 'center' },
  { field: 'productId', headerName: 'Product', align: 'center', body: (row: any) => row.productName || row.productId },
  { field: 'planId', headerName: 'Plan', align: 'center', body: (row: any) => row.planName || row.planId }
]

const expandedColumns = [
  {
    field: 'policyStartDate',
    headerName: 'Policy Period',
    body: (row: any) => {
      const end = new Date(row.policyEndDate)
      return `${new Date(row.policyStartDate).toLocaleDateString()} - ${end.toLocaleDateString()}`
    }
  },
  { field: 'quoteDate', headerName: 'Quote Date', body: (row: any) => new Date(row.quoteDate).toLocaleDateString() },
  { field: 'quotationStatus', headerName: 'Status' },
  { field: 'createdBy', headerName: 'Created By' }
]

const QuotationToBeInvoicedListComponent = () => {
  const [reloadTable, setReloadTable] = React.useState(false)
  const [dateFilterModalOpen, setDateFilterModalOpen] = React.useState(false)
  const [filterStartDate, setFilterStartDate] = React.useState<Date | null>(null)
  const [filterEndDate, setFilterEndDate] = React.useState<Date | null>(null)
  const router = useRouter()

  const dataSource$ = (
    pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      isInvoiceGenerated: false
    }
  ) => {
    pageRequest.sort = ['rowCreatedDate dsc']

    if (pageRequest.searchKey) {
      pageRequest['tag'] = pageRequest.searchKey.trim()
      pageRequest['quotationNo'] = pageRequest.searchKey.trim()
      pageRequest['displayName'] = pageRequest.searchKey.trim()
      pageRequest['status'] = pageRequest.searchKey.trim()
      pageRequest['productId'] = pageRequest.searchKey.trim()
      pageRequest['planId'] = pageRequest.searchKey.trim()
    }

    if (filterStartDate) {
      const start = new Date(filterStartDate)
      start.setHours(0, 0, 0, 0)
      pageRequest.startDate = start.getTime()
    }
    if (filterEndDate) {
      const end = new Date(filterEndDate)
      end.setHours(23, 59, 59, 999)
      pageRequest.endDate = end.getTime()
    }

    return quotationService.getQuoationDetails(pageRequest)
  }

  const openEditSection = (quotation: any) => {
    router.push(`/invoices/${quotation.id}?mode=create&quotationNo=${encodeURIComponent(quotation.quotationNo)}`)
  }

  const configuration: any = {
    useAccordionMode: true,
    enableSelection: false,
    scrollHeight: '600px',
    pageSize: 10,
    actionButtons: [
      {
        key: 'create_invoice',
        icon: <Add fontSize='small' />,
        color: '#28a745',
        tooltip: 'Create Invoice',
        onClick: openEditSection
      }
    ],
    columnOptions: {
      enableSorting: true,
      enableColumnMenu: true,
      enableFiltering: true,
      enableColumnVisibility: false
    },
    expandableConfig: {
      gridTemplate: '60px 1.3fr 1.3fr 1.5fr 1fr 1fr auto',
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
      downloadbleColumns: ['prospectName', 'quotationNo', 'quoteDate'],
      text: 'Quotations To Be Invoiced',
      enableGlobalSearch: true,
      searchText: 'Search by Id, Tag, Quotation No., Plan, Status',
      enableDateFilter: true,
      onDateFilterClick: () => setDateFilterModalOpen(true)
    }
  }

  return (
    <>
      <Dialog open={dateFilterModalOpen} onClose={() => setDateFilterModalOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Filter by Date Range</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label='Start Date'
                value={filterStartDate}
                onChange={(newValue) => setFilterStartDate(newValue)}
                renderInput={(params: any) => <TextField {...params} fullWidth variant='outlined' />}
              />
              <DatePicker
                label='End Date'
                value={filterEndDate}
                onChange={(newValue) => setFilterEndDate(newValue)}
                renderInput={(params: any) => <TextField {...params} fullWidth variant='outlined' />}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <MuiButton
            onClick={() => {
              setFilterStartDate(null)
              setFilterEndDate(null)
              setDateFilterModalOpen(false)
              setReloadTable(prev => !prev)
            }}
            color='secondary'
          >
            Clear
          </MuiButton>
          <MuiButton
            onClick={() => {
              setDateFilterModalOpen(false)
              setReloadTable(prev => !prev)
            }}
            variant='contained'
          >
            Apply Filter
          </MuiButton>
          <MuiButton onClick={() => setDateFilterModalOpen(false)}>
            Cancel
          </MuiButton>
        </DialogActions>
      </Dialog>
      <FettleDataGrid
        $datasource={dataSource$}
        config={configuration}
        columnsdefination={mainColumns}
        reloadtable={reloadTable}
      />
    </>
  )
}

export default QuotationToBeInvoicedListComponent
