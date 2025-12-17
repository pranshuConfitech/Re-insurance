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

import { HierarchyService } from '@/services/remote-api/api/hierarchy-services/hierarchy.services'
import RoleService from '@/services/utility/role'

import { FettleDataGrid } from '@/views/apps/shared-component/components/fettle.data.grid'

const PAGE_NAME = 'PLAN'
const roleService = new RoleService()
const branchService = new HierarchyService()

// Define column type
interface ColumnDef {
  field: string;
  headerName: string;
  body?: (row: any) => React.ReactNode;
}

// Region columns - Main (shown in main row)
const regionMainColumns: ColumnDef[] = [
  { field: 'name', headerName: 'Region Name' },
  { field: 'code', headerName: 'Code' },
]

// Region expanded columns (shown in expanded row)
const regionExpandedColumns: ColumnDef[] = [
  { field: 'regionManager', headerName: 'Region Manager' },
]

// Branch columns - Main (shown in main row)
const branchMainColumns: ColumnDef[] = [
  { field: 'centerName', headerName: 'Branch Name' },
  { field: 'regionName', headerName: 'Region' },
  { field: 'centerPhoneNo', headerName: 'Contact No' },
]

// Branch expanded columns (shown in expanded row)
const branchExpandedColumns: ColumnDef[] = [
  { field: 'centerMailId', headerName: 'Email' },
  { field: 'branchManager', headerName: 'Branch Manager' },
]

// Unit columns - Main (shown in main row)
const unitMainColumns: ColumnDef[] = [
  { field: 'name', headerName: 'Unit Name' },
  { field: 'branchName', headerName: 'Branch' },
  { field: 'regionName', headerName: 'Region' },
]

// Unit expanded columns (shown in expanded row)
const unitExpandedColumns: ColumnDef[] = [
  { field: 'unitManager', headerName: 'Unit Manager' },
  { field: 'overrideComision', headerName: 'Override Commission (%)' },
]

const dataSource$: any = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true
  }
) => {
  pageRequest.sort = ['rowLastUpdatedDate dsc']

  if (pageRequest.searchKey) {
    pageRequest['code'] = pageRequest.searchKey.trim()
    pageRequest['name'] = pageRequest.searchKey.trim()
  }

  delete pageRequest.searchKey

  return branchService.getBranches(pageRequest).pipe(
    map(data => {
      return data
    })
  )
}

const dataSourceRegion$: any = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true
  }
) => {
  pageRequest.sort = ['rowLastUpdatedDate dsc']

  if (pageRequest.searchKey) {
    pageRequest['code'] = pageRequest.searchKey.trim()
    pageRequest['name'] = pageRequest.searchKey.trim()
  }

  delete pageRequest.searchKey

  return branchService.getRegion(pageRequest).pipe(
    map(data => {
      return data
    })
  )
}

const dataSourceUnit$: any = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true
  }
) => {
  pageRequest.sort = ['rowLastUpdatedDate dsc']

  if (pageRequest.searchKey) {
    pageRequest['code'] = pageRequest.searchKey.trim()
    pageRequest['name'] = pageRequest.searchKey.trim()
  }

  delete pageRequest.searchKey

  return branchService.getUnit(pageRequest).pipe(
    map(data => {
      return data
    })
  )
}

interface BranchListComponentProps {
  tabType?: 'region' | 'branch' | 'unit'
}

export default function BranchListComponent({ tabType = 'region' }: BranchListComponentProps) {
  const router = useRouter()
  const [reloadTable, setReloadTable] = useState(false)
  
  // Date filter modal states
  const [dateFilterModalOpen, setDateFilterModalOpen] = useState(false)
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null)
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null)

  const handleOpen = () => {
    if (tabType === 'region') {
      router.push('/branch?mode=create&type=region')
    } else if (tabType === 'unit') {
      router.push('/branch?mode=create&type=unit')
    } else {
      router.push('/branch?mode=create')
    }
  }

  const openEditSection = (item: any) => {
    if (tabType === 'region') {
      router.push(`/branch/${item.id}?mode=edit&type=region`)
    } else if (tabType === 'unit') {
      router.push(`/branch/${item.id}?mode=edit&type=unit`)
    } else {
      router.push(`/branch/${item.id}?mode=edit`)
    }
  }

  // Get data source based on tab type
  const getDataSource = () => {
    if (tabType === 'region') return dataSourceRegion$
    if (tabType === 'unit') return dataSourceUnit$
    return dataSource$
  }

  // Get columns based on tab type
  const getMainColumns = () => {
    if (tabType === 'region') return regionMainColumns
    if (tabType === 'unit') return unitMainColumns
    return branchMainColumns
  }

  const getExpandedColumns = () => {
    if (tabType === 'region') return regionExpandedColumns
    if (tabType === 'unit') return unitExpandedColumns
    return branchExpandedColumns
  }

  // Get title based on tab type
  const getTitle = () => {
    if (tabType === 'region') return 'Region Management'
    if (tabType === 'unit') return 'Unit Management'
    return 'Branch Management'
  }

  // Get grid template based on tab type
  const getGridTemplate = () => {
    if (tabType === 'region') {
      // Region: 60px expand + 2 main columns + auto for action
      return '60px 2fr 2fr auto'
    } else if (tabType === 'unit') {
      // Unit: 60px expand + 3 main columns + auto for action
      return '60px 2fr 2fr 2fr auto'
    } else {
      // Branch: 60px expand + 3 main columns + auto for action
      return '60px 2fr 2fr 2fr auto'
    }
  }

  // Ensure action buttons are always available
  const getActionButtons = () => {
    const buttons = roleService.checkActionPermission(PAGE_NAME, '', () => { }, actionBtnList)
    // Always return buttons to ensure action column is visible
    return (buttons && Array.isArray(buttons) && buttons.length > 0) ? buttons : actionBtnList
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

  const actionBtnList = [
    {
      key: 'edit_item',
      icon: <EditIcon fontSize="small" />,
      color: '#fbac05',
      className: 'ui-button-warning',
      tooltip: 'Edit',
      onClick: openEditSection
    }
  ]

  const xlsColumns = ['name', 'code']

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
      mainColumns: getMainColumns(),
      expandedColumns: getExpandedColumns(),
      gridTemplate: getGridTemplate(),
      getStatusColor: () => 'transparent',
      renderExpandedContent: (row: any) => {
        const expandedColsCount = getExpandedColumns().length;
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
            {getExpandedColumns().map((col: any, idx: number) => {
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
      text: getTitle(),
      enableGlobalSearch: true,
      searchText: 'Search by code, name',
      enableDateFilter: true,
      onDateFilterClick: () => setDateFilterModalOpen(true),
      dateFilterStartDate: filterStartDate,
      dateFilterEndDate: filterEndDate,
    },
  }

  return (
    <div>
      <FettleDataGrid
        $datasource={getDataSource()}
        config={configuration}
        columnsdefination={getMainColumns()}
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
