import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { map } from 'rxjs/operators'

import { 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Typography,
  IconButton
} from '@mui/material'
import { 
  CloseOutlined, 
  Edit as EditIcon 
} from '@mui/icons-material'

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { TaxService } from '@/services/remote-api/api/tax-services/tax.services'
import RoleService from '@/services/utility/role'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const PAGE_NAME = 'TAX'
const roleService = new RoleService()
const taxservices = new TaxService()

// Define column type
interface ColumnDef {
  field: string;
  headerName: string;
  body?: (row: any) => React.ReactNode;
}

// Main columns (shown in main row)
const mainColumns: ColumnDef[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'type', headerName: 'Type' },
  { field: 'value', headerName: 'Value' },
]

// Expanded columns (shown in expanded row)
const expandedColumns: ColumnDef[] = [
  { field: 'effectiveFrom', headerName: 'Effective from' },
  { field: 'effectiveUpto', headerName: 'Effective upto' },
]

const dataSource$ = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true
  }
) => {
  pageRequest.sort = ['rowLastUpdatedDate dsc']

  // Apply date filter if set
  if (pageRequest.filterStartDate) {
    pageRequest.startDate = pageRequest.filterStartDate
  }
  if (pageRequest.filterEndDate) {
    pageRequest.endDate = pageRequest.filterEndDate
  }

  if (pageRequest.searchKey) {
    pageRequest['name'] = pageRequest.searchKey.trim()
    pageRequest['type'] = pageRequest.searchKey.trim()
    pageRequest['value'] = pageRequest.searchKey.trim()
  }

  delete pageRequest.searchKey

  return taxservices.getTaxes(pageRequest).pipe(
    map(data => {
      const content = data.content

      const records = content.map((item: any) => {
        item['effectiveFrom'] = new Date(item.effectiveFrom).toLocaleDateString()
        item['effectiveUpto'] = new Date(item.effectiveUpto).toLocaleDateString()

        return item
      })

      data.content = records

      return data
    })
  )
}

export default function TaxListComponent(props: any) {
  const router = useRouter()
  const [reloadTable, setReloadTable] = useState(false)
  
  // Date filter modal states
  const [dateFilterModalOpen, setDateFilterModalOpen] = useState(false)
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null)
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null)

  const handleOpen = () => {
    router.push('/taxes?mode=create')
  }

  const openEditSection: any = (tax: any) => {
    router.push(`/taxes/${tax.id}?mode=edit`)
  }

  // Date filter handlers
  const handleDateFilterApply = () => {
    setDateFilterModalOpen(false)
    setReloadTable(prev => !prev)
  }

  const handleDateFilterClear = () => {
    setFilterStartDate(null)
    setFilterEndDate(null)
    setDateFilterModalOpen(false)
    setReloadTable(prev => !prev)
  }

  // Enhanced data source with date filter
  const enhancedDataSource$ = (
    pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true
    }
  ) => {
    // Apply date filter if set
    if (filterStartDate) {
      const start = new Date(filterStartDate)
      start.setHours(0, 0, 0, 0)
      pageRequest.filterStartDate = start.getTime()
    }
    if (filterEndDate) {
      const end = new Date(filterEndDate)
      end.setHours(23, 59, 59, 999)
      pageRequest.filterEndDate = end.getTime()
    }

    return dataSource$(pageRequest)
  }

  // Ensure action buttons are always available
  const getActionButtons = () => {
    const actionBtnList = [
      {
        key: 'edit_tax',
        icon: <EditIcon fontSize="small" />,
        color: '#fbac05',
        className: 'ui-button-warning',
        tooltip: 'Edit',
        onClick: openEditSection
      }
    ]
    const buttons = roleService.checkActionPermission(PAGE_NAME, 'UPDATE', () => {}, actionBtnList)
    return (buttons && Array.isArray(buttons) && buttons.length > 0) ? buttons : actionBtnList
  }

  const xlsColumns = ['name', 'type', 'value', 'effectiveFrom', 'effectiveUpto']

  const configuration: any = {
    useAccordionMode: true,
    enableSelection: false,
    scrollHeight: '600px',
    pageSize: 10,
    actionButtons: getActionButtons(),
    columnOptions: {
      enableSorting: true,
      enableColumnMenu: true,
      enableFiltering: true,
      enableColumnVisibility: false,
    },
    expandableConfig: {
      mainColumns: mainColumns,
      expandedColumns: expandedColumns,
      gridTemplate: '60px 2fr 2fr 2fr auto',
      getStatusColor: () => 'transparent',
      renderExpandedContent: (row: any) => {
        const expandedColsCount = expandedColumns.length;
        const gridCols = expandedColsCount === 2 ? '1fr 1fr' : '1fr 1fr 1fr';

        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: gridCols,
            gap: '24px',
            padding: '16px 24px',
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #e9ecef'
          }}>
            {expandedColumns.map((col: any, idx: number) => {
              const value = col.field.includes('.')
                ? col.field.split('.').reduce((obj: any, key: string) => obj?.[key], row)
                : row[col.field];

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{
                    color: '#6c757d',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {col.headerName}
                  </span>
                  <span style={{
                    color: '#212529',
                    fontSize: '14px',
                    fontWeight: 500,
                    wordBreak: 'break-word'
                  }}>
                    {col.body ? col.body(row) : (value !== null && value !== undefined ? String(value) : 'N/A')}
                  </span>
                </div>
              );
            })}
          </div>
        );
      }
    },
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
      onCreateButtonClick: handleOpen,
      text: 'Tax Management',
      enableGlobalSearch: true,
      searchText: 'Search by name, type, value',
      enableDateFilter: true,
      onDateFilterClick: () => setDateFilterModalOpen(true),
      dateFilterStartDate: filterStartDate,
      dateFilterEndDate: filterEndDate,
    },
  }

  return (
    <div>
      <FettleDataGrid
        $datasource={enhancedDataSource$}
        config={configuration}
        columnsdefination={mainColumns}
        onEdit={openEditSection}
        reloadtable={reloadTable}
      />

      {/* Date Filter Modal */}
      <Dialog open={dateFilterModalOpen} onClose={() => setDateFilterModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Filter by Date Range</Typography>
            <IconButton onClick={() => setDateFilterModalOpen(false)} size="small">
              <CloseOutlined />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={filterStartDate}
                onChange={(newValue) => setFilterStartDate(newValue)}
                renderInput={(params: any) => <TextField {...params} fullWidth variant="outlined" />}
              />
              <DatePicker
                label="End Date"
                value={filterEndDate}
                onChange={(newValue) => setFilterEndDate(newValue)}
                renderInput={(params: any) => <TextField {...params} fullWidth variant="outlined" />}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDateFilterClear} color="secondary">
            Clear
          </Button>
          <Button onClick={handleDateFilterApply} variant="contained" color="primary">
            Apply Filter
          </Button>
          <Button onClick={() => setDateFilterModalOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
