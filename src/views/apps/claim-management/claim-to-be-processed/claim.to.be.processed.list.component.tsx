import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { makeStyles } from '@mui/styles'
import 'date-fns'
import { useFormik } from 'formik'

import { map } from 'rxjs/operators'
import * as Yup from 'yup'

import { Button } from 'primereact/button'

import { ProvidersService } from '@/services/remote-api/api/provider-services'
import { ReimbursementService } from '@/services/remote-api/api/claims-services/claim.reimbursement.services'

import { getDateElements } from '@/utils/@jambo-utils/dateHelper'
import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

// const data$ = new Observable(subscriber => {
//   subscriber.next(sampleData);
// });

// const dataSource$ = () => {
//   return data$.pipe(
//     map(data => {
//       data.content = data;
//       return data;
//     })
//   );
// };

const useStyles = makeStyles((theme: any) => ({
  header: {
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '10px 10px 0px 0px',
    background: '#0edb8a',
    padding: 20,
    borderBottom: 'none'
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
    marginLeft: theme.spacing ? theme.spacing(2) : '8px',
    '&:first-child': {
      marginLeft: 0
    }
  }
}))

const validationSchema = Yup.object().shape({
  selectedDate: Yup.date().nullable().required('Date is required'),
  selectedProvider: Yup.string().required('Provider is required')
})

const ClaimToBeProcessedListComponent = (props: any) => {
  const classes = useStyles()
  const history = useRouter()
  const providerService = new ProvidersService()

  const [providerList, setProviderList] = useState<any>([])
  const [selectedProvider, setSelectedProvider] = useState('')
  const [reloadTable, setReloadTable] = React.useState(false)

  const formik = useFormik({
    initialValues: {
      selectedDate: new Date(),
      selectedProvider: ''
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      submitHandler(values)
    }
  })

  const handleMembershipClick = (rowData: any, field: any) => {
    if (field === 'membershipNo' || 'claimNo') {
      const membershipNo = rowData.memberShipNo

      history.push(`/claims/claims-to-be-processed/${rowData?.id}`)
    }
  }

  const columnsDefinations: any = [
    // {
    //   field: 'serial',
    //   headerName: 'SL#',
    //   body: (rowData: any, data: any) => {
    //     // Debugging log to inspect the data object
    //     console.log('Row Data:', rowData, 'Data:', data);

    //     // Validate data and provide a fallback value
    //     return data?.rowIndex !== undefined ? data.rowIndex + 1 : 0;
    //   },
    //   style: { width: '4rem' },
    // },
    {
      field: 'memberShipNo',
      headerName: 'MEMBERSHIP NO',
      body: (rowData: any) => (
        <span
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => handleMembershipClick(rowData, 'membershipNo')}
        >
          {rowData.memberShipNo}
        </span>
      ),
    },
    {
      field: 'claimNo',
      headerName: 'CLAIM NO.',
      body: (rowData: any) => (
        <span
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => handleMembershipClick(rowData, 'claimNo')}
        >
          {rowData.id}
        </span>
      ),
    },
    { field: 'createdDate', headerName: 'CLAIM DATE' },
    { field: 'expectedDOA', headerName: 'ADMISSION DATE' },
    { field: 'expectedDOD', headerName: 'DISCHARGE DATE' },
    { field: 'claimedAmount', headerName: 'CLAIMED AMOUNT' },
    // {
    //   field: 'providerName',
    //   headerName: 'PROVIDERS NAME',
    //   body: (rowData: any) => {
    //     return (
    //       <ul style={{ listStyle: 'disc' }}>
    //         {rowData?.providerName?.map((name: any, index: any) => (
    //           <li key={index}>&bull; {name}</li>
    //         ))}
    //       </ul>
    //     );
    //   },
    // },
    { field: 'billAmount', headerName: 'BILL AMOUNT' },
  ]

  const ps$ = providerService.getProviders({
    page: 0,
    size: 10000,
    summary: true,
    active: true
  })
  const reimbursementService = new ReimbursementService()

  const submitHandler = (values: any) => {
    setReloadTable(true)
    setTimeout(() => {
      setReloadTable(false)
    }, 1000)
  }

  useEffect(() => {
    const subscription = ps$.subscribe(result => {
      const filteredProviders: any = result.content.filter((ele: any) => !ele.blackListed)

      setProviderList(filteredProviders)

      return () => subscription.unsubscribe()
    })
  }, [])

  const dataSource$ = (
    pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true
    }
  ) => {
    pageRequest.sort = ['rowCreatedDate dsc']

    // if (pageRequest.searchKey) {
    //   pageRequest['providerId'] = pageRequest.searchKey;
    // }
    pageRequest['providerId'] = selectedProvider

    // pageRequest.claimStatus = ["EVALUATION_INPROGRESS"];

    return reimbursementService.getReadyToProcessReimbursements(pageRequest).pipe(
      map(data => {
        const content = data.content

        const records = content?.map((item: any) => {
          const providerNames = item.providers
            ?.map((providerId: any) => providerList.find((provider: any) => provider.id === providerId)?.name)
            .filter((name: any) => name !== undefined || name !== '')

          const totalEstimatedCost = item.benefitsWithCost.reduce((accumulator: any, currentValue: any) => {
            return accumulator + currentValue.estimatedCost
          }, 0)

          const invoicesAmount = item.invoices.reduce((accumulator: any, currentValue: any) => {
            return accumulator + currentValue.invoiceAmount
          }, 0)

          item['createdDate'] = `${getDateElements(item.createdDate).date.numerical}`
          item['expectedDOA'] = `${getDateElements(item.expectedDOA).date.numerical}`
          item['expectedDOD'] = `${getDateElements(item.expectedDOD).date.numerical}`
          item['providerName'] = providerNames
          item['claimedAmount'] = totalEstimatedCost
          item['billAmount'] = invoicesAmount

          return item
        })

        data.content = records

        return data
      })
    )
  }

  const openEditSection = (provider: any) => {
    history.push(`/endorsements/${provider.id}?mode=edit`)
  }

  const handleOpen = () => {
    history.push('/endorsements?mode=create')
  }

  const handleSelectedRows = (selectedClaim: any) => { }

  const xlsColumns = [
    'serial',
    'memberShipNo',
    'claimNo',
    'createdDate',
    'expectedDOA',
    'expectedDOD',
    'claimedAmount',
    'providerName',
    'billAmount'
  ]

  const configuration = {
    enableSelection: false,
    scrollHeight: '300px',
    pageSize: 10,
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      text: 'CLAIMS READY TO PROCESS'

      // enableGlobalSearch: true,
      // searchText: 'Search by Claim number',
      // onSelectionChange: handleSelectedRows,
    }
  }

  return (
    <div style={{ backgroundColor: 'var(--surface-f)' }}>
      {/* <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={8} style={{ padding: '16px' }}>
          <Grid item xs={12} sm={6} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={['year', 'month']}
                label='Claims inwarded in'
                value={formik.values.selectedDate}
                onChange={date => {
                  formik.setFieldValue('selectedDate', date)
                }}
                maxDate={new Date()}
                renderInput={(params: any) => (
                  <TextField {...params} margin='normal' variant='outlined' InputLabelProps={{ shrink: true }} />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth className={classes.formControl}>
              <InputLabel id='demo-simple-select-label'>Provider</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                label='Provider'
                id='selectedProvider'
                name='selectedProvider'
                color='primary'
                value={formik.values.selectedProvider}
                onChange={e => {
                  setSelectedProvider(e.target.value)
                  formik.handleChange(e)
                }}
              >
                {providerList.map((ele: any) => {
                  return (
                    <MenuItem key={ele.id} value={ele.id}>
                      {ele.providerBasicDetails.name}
                    </MenuItem>
                  )
                })}
              </Select>
              <FormHelperText>{formik.touched.selectedProvider && formik.errors.selectedProvider}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
              type='submit'
              color='secondary'
              className='p-button-secondary'
            >
              Go
            </Button>
          </Grid>
        </Grid>
      </form> */}
      <FettleDataGrid
        $datasource={dataSource$}
        columnsdefination={columnsDefinations}
        onEdit={openEditSection}
        config={configuration}
        reloadtable={reloadTable}
      />
    </div>
  )
}

export default ClaimToBeProcessedListComponent
