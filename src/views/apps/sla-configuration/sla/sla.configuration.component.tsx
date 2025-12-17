import React, { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import { useFormik } from 'formik'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'

import { Autocomplete } from '@mui/lab'

import {
  ClientService,
  ClientTypeService,
  GroupTypeService,
  OrganizationTypeService
} from '@/services/remote-api/fettle-remote-api'
import { SLAService } from '@/services/remote-api/api/claims-services/sla.services'

import Asterisk from '../../shared-component/components/red-asterisk'

const slaService = new SLAService()

const useStyles = makeStyles((theme: any) => ({
  input1: {
    width: '50%'
  },
  clientTypeRadioGroup: {
    flexWrap: 'nowrap',
    '& label': {
      flexDirection: 'row'
    }
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  },
  formControl: {
    minWidth: 182
  },
  formControl1: {
    minWidth: 300
  },
  heading: {
    fontSize: theme?.typography?.pxToRem(15),

    // flexBasis: '33.33%',
    flexShrink: 0,
    fontWeight: 700
  },
  secondaryHeading: {
    fontSize: theme?.typography?.pxToRem(15),
    color: theme?.palette?.text?.secondary
  }
}))

const initialValues: any = {
  clientType: '',
  groupType: '',
  organizationType: '',
  parentOrganizationType: ''
}

const organizationservice = new OrganizationTypeService()
const clienttypeervice = new ClientTypeService()
const grouptypeService = new GroupTypeService()
const clientService = new ClientService()

const org$ = organizationservice.getOrganizationTypes()
const ct$ = clienttypeervice.getCleintTypes()
const gt$ = grouptypeService.getGroupTypes()
const pc$ = clientService.getParentClients()

export default function SLAConfigurationComponent(props: any) {
  const classes: any = useStyles()
  const query = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const id: any = params.id
  const [clientTypes, setClientTypes] = React.useState([])
  const [clientType, setClientType] = React.useState()
  const [organizationTypes, setOrganizationTypes] = React.useState([])
  const [groupTypes, setGroupTypes] = React.useState([])
  const [parentClients, setParentClients] = React.useState([])

  const useObservable = (observable: any, setter: any, type = '') => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  const useObservable2 = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        const tableArr: any = []

        if (result.content && result.content.length > 0) {
          result.content.forEach((ele: any) => {
            tableArr.push({
              name: ele.clientBasicDetails.displayName,
              id: ele.id
            })
          })
        }

        setter(tableArr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(org$, setOrganizationTypes)
  useObservable(ct$, setClientTypes, 'clientType')
  useObservable(gt$, setGroupTypes)
  useObservable2(pc$, setParentClients)

  const formik = useFormik({
    initialValues: {
      ...initialValues
    },

    // validationSchema: validationSchema,
    onSubmit: values => {
      handleSubmit()

      // console.log("asasas", values)
    }
  })

  React.useEffect(() => {
    if (id) {
      populateData(id)
    }
  }, [id])

  const populateData = (id: any) => {
    slaService.getSLAById(id).subscribe(value => {
      setClientType(value.clientType)
      formik.setValues({
        clientType: value.clientType,
        groupType: value.groupType,
        organizationType: value.organizationType,
        parentOrganizationType: value.parentOrganizationType,
        slaFor: value.slaFor,
        claimCategory: value.claimCategory,
        isDeathCase: value.isDeathCase,
        tatFrom: value.tatFrom,
        tatTo: value.tatTo,
        isGrievanceCase: value.isGrievanceCase,
        isVip: value.isVip,
        isSeniorCitizen: value.isSeniorCitizen,
        patientOrDischarge: value.patientOrDischarge,
        slaType: value.slaType,
        tatScale: value.tatScale,
        isCompulsory: value.isCompulsory,
        minClaimPercentage: value.minClaimPercentage,
        maxClaimPercentage: value.maxClaimPercentage,
        isActualBasis: value.isActualBasis,
        perCaseFixedValue: value.perCaseFixedValue
      })

      // if(value.clientType === 'GROUP'){
      //     formik.setFieldValue('groupType',value.groupType)
      // }
    })
  }

  const handleSubmit = () => {
    const payload = { ...formik.values }

    payload.clientType = clientType

    if (query.get('mode') === 'create') {
      slaService.saveSlaCongiguration(payload).subscribe(res => {
        router.push('/sla/configuration?mode=viewList')
      })
    }

    if (query.get('mode') === 'edit') {
      slaService.saveSLAById(payload, id).subscribe(res => {
        router.push('/sla/configuration?mode=viewList')
      })
    }
  }

  // console.log('asdghjk', formik.values);
  return (
    <div>
      <Grid
        item
        xs={12}
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          marginBottom: '20px',
          height: '2em',
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
          {/* SLA Configuration */}
        </span>
      </Grid>
      <Paper
        elevation={0}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '1%'
        }}
      >
        <form onSubmit={formik.handleSubmit} noValidate>
          <Box padding={'10px'}>
            <Grid container spacing={3}>
              <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl component='fieldset'>
                    <FormLabel component='legend'>
                      Client type <Asterisk />
                    </FormLabel>
                    <RadioGroup
                      aria-label='clientType'
                      name='clientType'
                      // value={formik.values.clientType}
                      value={clientType}
                      onChange={(e: any) => {
                        setClientType(e.target.value)
                      }}
                      // onChange={formik.handleChange}
                      row
                      className={classes.clientTypeRadioGroup}
                    >
                      {clientTypes.map((ele: any) => {
                        return <FormControlLabel key={ele.code} value={ele.code} control={<Radio />} label={ele.name} />
                      })}
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                {clientType === 'GROUP' && (
                  <div style={{ display: 'flex', gap: 70 }}>
                    <Grid item xs={12} sm={6} md={4} style={{ marginBottom: '20px' }}>
                      <FormControl className={classes.formControl}>
                        <InputLabel id='demo-simple-select-label' style={{ marginBottom: '10px' }}>
                          Group Type <Asterisk />
                        </InputLabel>
                        <Select
                          label='Group Type'
                          labelId='demo-simple-select-label'
                          name='groupType'
                          id='demo-simple-select'
                          value={formik.values.groupType}
                          onChange={formik.handleChange}
                          style={{ width: 200 }}
                        >
                          {groupTypes.map((ele: any) => {
                            return (
                              <MenuItem key={ele.code} value={ele.code}>
                                {ele.name}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl className={classes.formControl}>
                        <InputLabel id='demo-simple-select-label' style={{ marginBottom: '10px' }}>
                          Organization type <Asterisk />
                        </InputLabel>
                        <Select
                          label='Organization type'
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          name='organizationType'
                          style={{ width: 200 }}
                          value={formik.values.organizationType}
                          onChange={formik.handleChange}
                        >
                          {organizationTypes.map((ele: any) => {
                            return (
                              <MenuItem key={ele.code} value={ele.code}>
                                {ele.name}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                  </div>
                )}
                {clientType === 'GROUP' && formik.values.organizationType === 'OT117246' ? (
                  <Grid item xs={12} sm={6} md={4}>
                    <Autocomplete
                      id='combo-box-demo'
                      options={parentClients}
                      getOptionLabel={option => option.name}
                      style={{ width: '50%' }}
                      renderInput={params => <TextField {...params} label='Parent Organization*' />}
                      value={formik.values.parentOrganizationType}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                ) : (
                  <div />
                )}
              </Grid>

              <Grid item xs={12} sm={6} md={4} style={{ marginTop: '4px' }}>
                <Box style={{ marginTop: '3px' }}>
                  {/* <FormControl> */}
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    SLA for
                  </InputLabel>
                  <Select
                    label='SLA for'
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    name='slaFor'
                    // style={{width:"50px"}}
                    fullWidth
                    value={formik.values.slaFor}
                    onChange={formik.handleChange}

                    // value={x.documentType}
                    // disabled={!!x.documentName}
                    // onChange={e => handleInputChangeDocumentType(e, i)}
                  >
                    <MenuItem value='tat'>TAT</MenuItem>
                    <MenuItem value='investigation'>Investigation</MenuItem>
                    <MenuItem value='Grievance'>Grievance</MenuItem>
                  </Select>
                  {/* </FormControl> */}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4} style={{ marginTop: '4px' }}>
                <Box style={{ marginTop: '3px' }}>
                  {/* <FormControl> */}
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Claim Category
                  </InputLabel>
                  <Select
                    label='Claim Category'
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    name='claimCategory'
                    // style={{width:"50px"}}
                    fullWidth
                    value={formik.values.claimCategory}
                    onChange={formik.handleChange}

                    // value={x.documentType}
                    // disabled={!!x.documentName}
                    // onChange={e => handleInputChangeDocumentType(e, i)}
                  >
                    <MenuItem value='a'>a</MenuItem>
                    <MenuItem value='b'>b</MenuItem>
                  </Select>
                  {/* </FormControl> */}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}></Grid>
              <div style={{ marginTop: '20px' }}></div>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl component='fieldset'>
                  <FormLabel component='legend'>Is Death Case ?</FormLabel>
                  <RadioGroup
                    aria-label='isDeathCase'
                    name='isDeathCase'
                    value={formik.values.isDeathCase}
                    // value={clientType}
                    // onChange={e => {
                    //   console.log(e.target.value, e.target.name);
                    //   setClientType(e.target.value);
                    // }}
                    onChange={formik.handleChange}
                    row
                    className={classes.clientTypeRadioGroup}
                  >
                    {['Yes', 'No'].map((ele: any) => {
                      return <FormControlLabel key={ele} value={ele} control={<Radio />} label={ele} />
                    })}
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl component='fieldset'>
                  <FormLabel component='legend'>Is Grievance Case ?</FormLabel>
                  <RadioGroup
                    aria-label='isGrievanceCase'
                    name='isGrievanceCase'
                    value={formik.values.isGrievanceCase}
                    // value={clientType}
                    // onChange={e => {
                    //   console.log(e.target.value, e.target.name);
                    //   setClientType(e.target.value);
                    // }}
                    onChange={formik.handleChange}
                    row
                    className={classes.clientTypeRadioGroup}
                  >
                    {['Yes', 'No'].map((ele: any) => {
                      return <FormControlLabel key={ele} value={ele} control={<Radio />} label={ele} />
                    })}
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl component='fieldset'>
                  <FormLabel component='legend'>Is VIP ?</FormLabel>
                  <RadioGroup
                    aria-label='isVip'
                    name='isVip'
                    value={formik.values.isVip}
                    // value={clientType}
                    // onChange={e => {
                    //   console.log(e.target.value, e.target.name);
                    //   setClientType(e.target.value);
                    // }}
                    onChange={formik.handleChange}
                    row
                    className={classes.clientTypeRadioGroup}
                  >
                    {['Yes', 'No'].map((ele: any) => {
                      return <FormControlLabel key={ele} value={ele} control={<Radio />} label={ele} />
                    })}
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl component='fieldset'>
                  <FormLabel component='legend'>Is Senior Citizen ?</FormLabel>
                  <RadioGroup
                    aria-label='isSeniorCitizen'
                    name='isSeniorCitizen'
                    value={formik.values.isSeniorCitizen}
                    // value={clientType}
                    // onChange={e => {
                    //   console.log(e.target.value, e.target.name);
                    //   setClientType(e.target.value);
                    // }}
                    onChange={formik.handleChange}
                    row
                    className={classes.clientTypeRadioGroup}
                  >
                    {['Yes', 'No'].map((ele: any) => {
                      return <FormControlLabel key={ele} value={ele} control={<Radio />} label={ele} />
                    })}
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl component='fieldset'>
                  <FormLabel component='legend'>Patient or Discharge</FormLabel>
                  <RadioGroup
                    aria-label='patientOrDischarge'
                    name='patientOrDischarge'
                    value={formik.values.patientOrDischarge}
                    // value={clientType}
                    // onChange={e => {
                    //   console.log(e.target.value, e.target.name);
                    //   setClientType(e.target.value);
                    // }}
                    onChange={formik.handleChange}
                    row
                    className={classes.clientTypeRadioGroup}
                  >
                    {['Yes', 'No'].map((ele: any) => {
                      return <FormControlLabel key={ele} value={ele} control={<Radio />} label={ele} />
                    })}
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}></Grid>

              <Grid item xs={12} sm={6} md={4} style={{ marginTop: '4px' }}>
                <Box style={{ marginTop: '3px' }}>
                  {/* <FormControl> */}
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    SLA Type
                  </InputLabel>
                  <Select
                    label='SLA Type'
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    name='slaType'
                    // style={{width:"50px"}}
                    fullWidth
                    value={formik.values.slaType}
                    onChange={formik.handleChange}

                    // value={x.documentType}
                    // disabled={!!x.documentName}
                    // onChange={e => handleInputChangeDocumentType(e, i)}
                  >
                    <MenuItem value='a'>a</MenuItem>
                    <MenuItem value='b'>b</MenuItem>
                  </Select>
                  {/* </FormControl> */}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  variant='standard'
                  name='tatFrom'
                  label='TAT From'
                  fullWidth
                  value={formik.values.tatFrom}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  variant='standard'
                  name='tatTo'
                  label='TAT To'
                  fullWidth
                  value={formik.values.tatTo}
                  onChange={formik.handleChange}
                />
              </Grid>

              <div style={{ marginTop: '20px' }}></div>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl component='fieldset'>
                  <FormLabel component='legend'>TAT Scale</FormLabel>
                  <RadioGroup
                    aria-label='tatScale'
                    name='tatScale'
                    value={formik.values.tatScale}
                    // value={clientType}
                    // onChange={e => {
                    //   console.log(e.target.value, e.target.name);
                    //   setClientType(e.target.value);
                    // }}
                    onChange={formik.handleChange}
                    row
                    className={classes.clientTypeRadioGroup}
                  >
                    {['Day', 'Hour', 'Minute'].map((ele: any) => {
                      return <FormControlLabel key={ele} value={ele} control={<Radio />} label={ele} />
                    })}
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl component='fieldset'>
                  <FormLabel component='legend'>Is Compulsory ?</FormLabel>
                  <RadioGroup
                    aria-label='isCompulsory'
                    name='isCompulsory'
                    value={formik.values.isCompulsory}
                    // value={clientType}
                    // onChange={e => {
                    //   console.log(e.target.value, e.target.name);
                    //   setClientType(e.target.value);
                    // }}
                    onChange={formik.handleChange}
                    row
                    className={classes.clientTypeRadioGroup}
                  >
                    {['Yes', 'No'].map((ele: any) => {
                      return <FormControlLabel key={ele} value={ele} control={<Radio />} label={ele} />
                    })}
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl component='fieldset'>
                  <FormLabel component='legend'>Minimum Claim Percentage ?</FormLabel>
                  <RadioGroup
                    aria-label='minClaimPercentage'
                    name='minClaimPercentage'
                    value={formik.values.minClaimPercentage}
                    // value={clientType}
                    // onChange={e => {
                    //   console.log(e.target.value, e.target.name);
                    //   setClientType(e.target.value);
                    // }}
                    onChange={formik.handleChange}
                    row
                    className={classes.clientTypeRadioGroup}
                  >
                    {['Yes', 'No'].map((ele: any) => {
                      return <FormControlLabel key={ele} value={ele} control={<Radio />} label={ele} />
                    })}
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl component='fieldset'>
                  <FormLabel component='legend'>Maximum Claim Percentage ?</FormLabel>
                  <RadioGroup
                    aria-label='maxClaimPercentage'
                    name='maxClaimPercentage'
                    value={formik.values.maxClaimPercentage}
                    // value={clientType}
                    // onChange={e => {
                    //   console.log(e.target.value, e.target.name);
                    //   setClientType(e.target.value);
                    // }}
                    onChange={formik.handleChange}
                    row
                    className={classes.clientTypeRadioGroup}
                  >
                    {['Yes', 'No'].map((ele: any) => {
                      return <FormControlLabel key={ele} value={ele} control={<Radio />} label={ele} />
                    })}
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl component='fieldset'>
                  <FormLabel component='legend'>Per Case Fixed Value ?</FormLabel>
                  <RadioGroup
                    aria-label='perCaseFixedValue'
                    name='perCaseFixedValue'
                    value={formik.values.perCaseFixedValue}
                    // value={clientType}
                    // onChange={e => {
                    //   console.log(e.target.value, e.target.name);
                    //   setClientType(e.target.value);
                    // }}
                    onChange={formik.handleChange}
                    row
                    className={classes.clientTypeRadioGroup}
                  >
                    {['Yes', 'No'].map((ele: any) => {
                      return <FormControlLabel key={ele} value={ele} control={<Radio />} label={ele} />
                    })}
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl component='fieldset'>
                  <FormLabel component='legend'>Is Actual Basis ?</FormLabel>
                  <RadioGroup
                    aria-label='isActualBasis'
                    name='isActualBasis'
                    value={formik.values.isActualBasis}
                    // value={clientType}
                    // onChange={e => {
                    //   console.log(e.target.value, e.target.name);
                    //   setClientType(e.target.value);
                    // }}
                    onChange={formik.handleChange}
                    row
                    className={classes.clientTypeRadioGroup}
                  >
                    {['Yes', 'No'].map((ele: any) => {
                      return <FormControlLabel key={ele} value={ele} control={<Radio />} label={ele} />
                    })}
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Grid
            item
            xs={12}
            className={classes?.actionContainer}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button color='primary' type='submit' className={classes?.buttonPrimary}>
              Save
            </Button>
          </Grid>
        </form>
      </Paper>
    </div>
  )
}
