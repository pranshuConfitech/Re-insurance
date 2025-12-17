import * as React from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { Toast } from 'primereact/toast'

import { HierarchyService } from '@/services/remote-api/api/hierarchy-services/hierarchy.services'

import Asterisk from '../../shared-component/components/red-asterisk'
import { InputLabel, MenuItem, Select } from '@mui/material'
import { UsersService } from '@/services/remote-api/fettle-remote-api'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

const branchService = new HierarchyService()
const usersService = new UsersService()

const useStyles = makeStyles(theme => ({
  input1: {
    width: '50%'
  },
  clientTypeRadioGroup: {
    flexWrap: 'nowrap',
    '& label': {
      flexDirection: 'row'
    }
  },
  formControl: {
    minWidth: '90%'
  }
}))

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

const schemaObject = {
  regionName: yup.string().required('Region Name is required'),
  regionManager: yup.string().required('Region Manager is required'),
  startDate: yup.string()
}

const validationSchema = yup.object(schemaObject)

const initialValues = {
  regionName: '',
  regionManager: '',
  startDate: '',
  managerId: ''
}

export default function RegionBasicDetailsComponent(props: any) {
  const classes = useStyles()
  const query2 = useSearchParams()
  const router = useRouter()
  const id: any = useParams().id
  const toast = React.useRef<any>(null)
  const [managersList, setManagersList] = React.useState([])

  const formik = useFormik({
    initialValues: {
      ...initialValues
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      handleSubmitPlan()
    }
  })

  React.useEffect(() => {
    getManagers() // Fetch the list of managers when the component mounts
  }, [])

  React.useEffect(() => {
    if (id) {
      populateData(id)
    }
  }, [id])

  const populateData = (id: any) => {
    branchService.getRegionDetails(id).subscribe(value => {
      formik.setValues({
        regionName: value.name,
        regionManager: value.regionManager,
        startDate: value.startDate,
        managerId: value.managerId
      })
    })
  }

  const handleSubmitPlan = () => {
    const payload = {
      name: formik.values.regionName,
      regionManager: formik.values.regionManager,
      startDate: formik.values.startDate,
      managerId: formik.values.managerId
    }

    if (query2.get('mode') === 'create') {
      branchService.saveRegion(payload).subscribe({
        next: (res: any) => {
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Region created successfully',
            life: 2000
          })
          setTimeout(() => router.push(`/branch?mode=viewList`), 1000)
        },
        error: (err: any) => {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong',
            life: 2000
          })
        }
      })
    }

    if (query2.get('mode') === 'edit') {
      branchService.editRegion(payload, id).subscribe({
        next: (res: any) => {
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Region updated successfully',
            life: 2000
          })
          setTimeout(() => router.push(`/branch?mode=viewList`), 1000)
        },
        error: (err: any) => {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong',
            life: 2000
          })
        }
      })
    }
  }

  const handleClose = (event: any) => {
    router.push(`/branch?mode=viewList`)

    // window.location.reload();
  }

  const getManagers = () => {
    const pageRequest = {
      page: 0,
      size: 1000,
      summary: true,
      active: true
    }
    usersService.getAgent('Super_Admin').subscribe({
      next: (response: any) => {
        const list = response?.map((agent: any) => ({
          value: agent.userName,
          label: `${agent.firstName ? agent.firstName : ''} ${agent.lastName ? agent.lastName : ''}`
        }))
        setManagersList(list)
      },
      error: (error: any) => {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load agents',
          life: 2000
        })
      }
    })
  }

  const handleStartDate = (date: any) => {
    const timestamp = new Date(date).getTime()

    formik.setFieldValue('startDate', timestamp)
  }

  return (
    <>
      <Toast ref={toast} />
      {query2.get('mode') === 'edit' ? (
        <Grid
          item
          xs={12}
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '20px',
            height: '2em',
            color: '#000',
            fontSize: '18px'
          }}
        >
          <span
            style={{
              fontWeight: '600',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '5px'
            }}
          >
            Region Management- Edit Region
          </span>
        </Grid>
      ) : null}
      <Paper elevation={0}>
        <Box p={3} my={2}>
          <form onSubmit={formik.handleSubmit} noValidate>
            <Grid container spacing={3} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <TextField
                    size='small'
                    id='standard-basic'
                    name='regionName'
                    value={formik.values.regionName}
                    onChange={formik.handleChange}
                    // style={{ height: '70px' }}
                    error={formik.touched.regionName && Boolean(formik.errors.regionName)}
                    helperText={formik.touched.regionName && formik.errors.regionName}
                    label={
                      <span>
                        Name <Asterisk />
                      </span>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl} fullWidth variant="outlined" size="small" error={formik.touched.regionManager && Boolean(formik.errors.regionManager)}>
                  <InputLabel id="regionManager-label">
                    Region Manager <Asterisk />
                  </InputLabel>
                  <Select
                    labelId="regionManager-label"
                    id="regionManager"
                    name="regionManager"
                    value={formik.values.regionManager}
                    onChange={formik.handleChange}
                    // className={classes.select}
                    displayEmpty
                    label="Region Manager" // Must match the text part of InputLabel for floating effect
                  >
                    {managersList.map((el: any) => (
                      <MenuItem key={el.value} value={el.value}>
                        {el.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label='Start Date'
                    value={formik.values.startDate}
                    onChange={handleStartDate}
                    renderInput={params => <TextField {...params} margin='normal' variant='outlined' />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button color='secondary' style={{ marginRight: '5px' }} type='submit'>
                  Save
                </Button>
                <Button color='primary' onClick={handleClose} className='p-button-text'>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </>
  )
}
