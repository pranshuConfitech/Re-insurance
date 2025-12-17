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
import { InputLabel, MenuItem, Select } from '@mui/material'

import { HierarchyService } from '@/services/remote-api/api/hierarchy-services/hierarchy.services'
import { AgentService } from '@/services/remote-api/api/agent-services/agent.service'

import Asterisk from '../../shared-component/components/red-asterisk'
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
    minWidth: '80%',
    maxWidth: '90%',
    margin: '0 auto'
  },
  inputLabel: {
    textAlign: 'center'
  },
  textField: {
    '& .MuiInputBase-input': {
      padding: '8px 14px',
      height: '1.4375em',
      display: 'flex',
      alignItems: 'center'
    },
    '& .MuiInputBase-root': {
      height: '40px'
    }
  },
  select: {
    '& .MuiSelect-select': {
      padding: '8px 14px',
      height: '1.4375em',
      display: 'flex',
      alignItems: 'center'
    },
    '& .MuiOutlinedInput-root': {
      height: '40px'
    },
    '& .MuiSelect-nativeInput': {
      padding: '8px 14px',
      height: '1.4375em',
      display: 'flex',
      alignItems: 'center'
    }
  }
}))

const schemaObject = {
  unitName: yup.string().required('Unit Name is required'),
  unitManager: yup.string().required('Unit Manager is required'),
  overrideCommission: yup.number().min(0, 'Commission must be greater than or equal to 0').max(100, 'Commission cannot exceed 100'),
  branch: yup.string().required('Branch is required'),
  region: yup.string().required('Region is required')
}

const validationSchema = yup.object(schemaObject)

const initialValues = {
  unitName: '',
  unitManager: '',
  overrideCommission: '',
  branch: '',
  region: '',
  startDate: ''
}

export default function UnitBasicDetailsComponent(props: any) {
  const classes = useStyles()
  const query2 = useSearchParams()
  const router = useRouter()
  const id: any = useParams().id
  const toast = React.useRef<any>(null)
  const [agents, setAgents] = React.useState([])
  const [branches, setBranches] = React.useState([])
  const [region, setRegion]: any[] = React.useState([])

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
    if (id) {
      populateData(id)
    }
    loadAgents()
    loadBranches()
  }, [id])

  React.useEffect(() => {
    if (formik.values.region) {
      loadBranches()
    }
  }, [formik.values])

  const loadBranches = () => {
    branchService.getBranchesFromRegion(formik.values.region).subscribe({
      next: (response: any) => {
        console.log('itemssss', response)
        const branchList = response.branches.map((branch: any) => ({
          value: branch.id,
          label: branch.centerName
        }))
        setBranches(branchList)
      },
      error: (error: any) => {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load branches',
          life: 2000
        })
      }
    })
  }

  const loadAgents = () => {
    usersService.getAgent('agent-default-role').subscribe({
      next: (response: any) => {
        const agentList = response.map((agent: any) => ({
          value: agent.userName,
          label: `${agent.firstName ? agent.firstName : ''} ${agent.lastName ? agent.lastName : ''}`
        }))
        setAgents(agentList)
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

  const populateData = (id: any) => {
    branchService.getUnitDetails(id).subscribe(value => {
      formik.setValues({
        unitName: value.name,
        unitManager: value.unitManager || '',
        overrideCommission: value.overrideComision || '',
        branch: value.branchId || '',
        region: value.regionId || '',
        startDate: value.startDate
      })
    })
  }

  const handleSubmitPlan = () => {
    const payload = {
      name: formik.values.unitName,
      unitManager: formik.values.unitManager,
      overrideComision: formik.values.overrideCommission,
      branchId: formik.values.branch,
      region: formik.values.region,
      startDate: formik.values.startDate
    }

    if (query2.get('mode') === 'create') {
      branchService.saveUnit(formik.values.region, formik.values.branch, payload).subscribe({
        next: (res: any) => {
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Unit created successfully',
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
      branchService.editUnit(formik.values.region, formik.values.branch, payload, id).subscribe({
        next: (res: any) => {
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Unit updated successfully',
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

  const populateRegion = () => {
    let pageRequest: any = {
      page: 0,
      size: 1000,
      summary: true,
      active: true
    }
    branchService.getRegion(pageRequest).subscribe(value => {
      let temp: any[] = []
      value.content.map((item: any) => {
        let obj = {
          value: item.id,
          label: item.name
        }
        temp.push(obj);
      })
      setRegion(temp);
    })
  }

  React.useEffect(() => { populateRegion() }, [])

  const handleClose = (event: any) => {
    router.push(`/branch?mode=viewList`)
  }

  const handleStartDate = (date: any) => {
    const timestamp = new Date(date).getTime()

    formik.setFieldValue('startDate', timestamp)
  }

  console.log('formik', formik.values)
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
            Unit Management- Edit Unit
          </span>
        </Grid>
      ) : null}
      <Paper elevation={0}>
        <Box p={3} my={2}>
          <form onSubmit={formik.handleSubmit} noValidate>
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl} fullWidth>
                  <TextField
                    size='small'
                    id='standard-basic'
                    name='unitName'
                    value={formik.values.unitName}
                    onChange={formik.handleChange}
                    error={formik.touched.unitName && Boolean(formik.errors.unitName)}
                    helperText={formik.touched.unitName && formik.errors.unitName}
                    label={
                      <span>
                        Unit Name <Asterisk />
                      </span>
                    }
                    placeholder="Enter Unit Name"
                    className={classes.textField}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl} fullWidth>
                  <TextField
                    size='small'
                    id='override-commission'
                    name='overrideCommission'
                    type="number"
                    value={formik.values.overrideCommission}
                    onChange={formik.handleChange}
                    error={formik.touched.overrideCommission && Boolean(formik.errors.overrideCommission)}
                    helperText={formik.touched.overrideCommission && formik.errors.overrideCommission}
                    label="Override Commission (%)"
                    placeholder="Enter Commission"
                    inputProps={{ min: 0, max: 100 }}
                    className={classes.textField}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl style={{ width: "90%" }} className={classes.formControl} fullWidth variant="outlined" size="small" error={formik.touched.region && Boolean(formik.errors.region)}>
                  <InputLabel
                    id="demo-simple-select-label"
                    style={{ marginBottom: "0px" }}
                  >
                    Region
                  </InputLabel>
                  <Select
                    label="Region"
                    name="region"
                    value={formik.values.region}
                    variant="outlined"
                    onChange={formik.handleChange}
                    style={{ fontSize: "14px" }}
                    fullWidth
                  >
                    {region.map((item: any) => {
                      return (
                        <MenuItem style={{ fontSize: "14px" }} value={item.value}>{item.label}</MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl} fullWidth variant="outlined" size="small" error={formik.touched.branch && Boolean(formik.errors.branch)}>
                  <InputLabel id="branch-label">
                    Branch <Asterisk />
                  </InputLabel>
                  <Select
                    labelId="branch-label"
                    id="branch"
                    name="branch"
                    value={formik.values.branch}
                    onChange={formik.handleChange}
                    className={classes.select}
                    displayEmpty
                    label="Branch" // Must match the text part of InputLabel for floating effect
                  >
                    {branches.map((branch: any) => (
                      <MenuItem key={branch.value} value={branch.value}>
                        {branch.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl} fullWidth variant="outlined" size="small" error={formik.touched.unitManager && Boolean(formik.errors.unitManager)}>
                  <InputLabel id="unit-manager-label">
                    Unit Manager <Asterisk />
                  </InputLabel>
                  <Select
                    labelId="unit-manager-label"
                    id="unit-manager"
                    name="unitManager"
                    value={formik.values.unitManager}
                    onChange={formik.handleChange}
                    className={classes.select}
                    displayEmpty
                    label="Unit Manager" // This must be plain text, icons inside don't render well
                  >
                    {agents.map((agent: any) => (
                      <MenuItem key={agent.value} value={agent.value}>
                        {agent.label}
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
