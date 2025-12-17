'use client'
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { map } from 'rxjs/operators'

import { Button } from 'primereact/button'

import { PreAuthService } from '@/services/remote-api/api/claims-services/claim.preauth.services'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const preAuthService = new PreAuthService()

const useStyles = makeStyles((theme: any) => ({
  header: {
    background: theme?.palette?.background?.paper
  },
  customStyle: {
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '0px 0px 10px 10px',
    background: '#ffffff',
    padding: 20,
    borderTop: 'none'
  },

  headerText: {
    fontSize: '16px',
    fontWeight: 'Bold',
    color: '#002776'
  },
  subheader: {
    fontSize: '12px',
    fontWeight: 'Bold'
  },
  body: {
    fontSize: '12px',
    fontWeight: 'Bold'
  },
  dropdownsContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  formControl: {
    minWidth: 182
  },
  dropdown: {
    marginLeft: theme?.spacing ? theme.spacing(2) : '8px',
    '&:first-child': {
      marginLeft: 0
    }
  }
}))

const statusConstants: any = {
  WAITING_FOR_HOSPITALIZATION: 'Waiting For Hospitalization',
  IN_HOSPITAL: 'In Hospital',
  WAITING_FOR_DISCHARGE: 'Waiting For Discharge'
}

const yearSelectItems = []
const MIN_YEAR = 2018
const MAX_YEAR = new Date().getFullYear()

for (let i = MIN_YEAR; i <= MAX_YEAR; i++) {
  yearSelectItems.push({ label: i, value: i })
}

const dataSource$ = () => {
  return preAuthService.getCaseList().pipe(
    map(data => {
      const content = data?.data?.map((item: any) => {
        item['hospitalizationStatus'] = statusConstants[item.hospitalizationStatus]

        return item
      })

      data.content = content

      return data
    })
  )
}

const CaseManagement = () => {
  const router = useRouter()
  const classes = useStyles()
  const [date, setDate] = useState({ month: '', year: '' })

  const [selectedMonth, setSelectedMonth] = useState<any>('')
  const [selectedYear, setSelectedYear] = useState<any>('')

  const months = Array.from({ length: 12 }, (_, index) => index + 1) // 1 to 12
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 12 }, (_, index) => currentYear - index) // Current year and previous 11 years

  const handleGoButtonClick = () => {
    console.log(`Selected Month: ${selectedMonth}, Selected Year: ${selectedYear}`)
  }

  const handleClearButtonClick = () => {
    setSelectedMonth('')
    setSelectedYear('')
  }

  useEffect(() => {
    const currentDate = new Date()

    setSelectedMonth(currentDate.getMonth() + 1)
    setSelectedYear(currentDate.getFullYear())
  }, [])

  const configuration = {
    enableSelection: false,

    // scrollHeight: '300px',
    paginator: false,
    pageSize: 10,
    header: {
      enable: true,
      enableDownload: true,

      // downloadbleColumns: xlsColumns,
      text: 'Case Management',
      enableGlobalSearch: false
    }
  }

  const handleCellClick = (row: any, header: any) => {
    // Convert to lowercase but preserve the original case for specific statuses
    let status = row.replace(/\s/g, '')
    
    // Map the status to the correct folder name
    if (status === 'WaitingForDischarge') {
      status = 'WaitingForDischarge'
    } else {
      status = status.toLowerCase()
    }
    
    const name = header.replace(/\s/g, '').toLowerCase()
    console.log(status, name)
    router.push(`/claims/case-management/${status}/${name}`)
  }

  const customCellTemplate = (rowData: any, column: any) => {
    const row = rowData['hospitalizationStatus']
    const clickedValue = column.field
    const hasValue = rowData[column.field] > 0

    return (
      <span
        style={{
          cursor: hasValue ? 'pointer' : 'default',
          textDecoration: hasValue ? 'underline' : 'none'
        }}
        onClick={() => handleCellClick(row, clickedValue)}
        // onClick={() => (hasValue ? handleCellClick(row, clickedValue) : null)}
      >
        {rowData[column.field]}
      </span>
    )
  }

  const columnsDefinations = [
    { field: 'hospitalizationStatus', headerName: 'Hospitalization Status' },
    { field: 'today', headerName: 'Today', body: customCellTemplate },
    { field: 'thisWeek', headerName: 'This Week', body: customCellTemplate },
    { field: 'thisMonth', headerName: 'This Month', body: customCellTemplate },
    { field: 'thisYear', headerName: 'This Year', body: customCellTemplate }
  ]

  return (
    <div style={{ backgroundColor: 'var(--surface-f)' }}>
      <Grid container spacing={8} style={{ padding: '16px' }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Month</InputLabel>
            <Select label='Month' value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
              {months.map(month => (
                <MenuItem key={month} value={month}>
                  {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select label='Year' value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
              {years.map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Button
            color='secondary'
            className='p-button-secondary'
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            onClick={handleGoButtonClick}
          >
            Go
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Button
            color='primary'
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            onClick={handleClearButtonClick}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
      <FettleDataGrid
        $datasource={dataSource$}
        config={configuration}
        columnsdefination={columnsDefinations}

        // onEdit={openEditSection}
      />
    </div>
  )
}

export default CaseManagement
