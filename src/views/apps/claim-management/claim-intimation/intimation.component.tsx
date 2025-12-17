import React, { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import { Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextareaAutosize } from '@mui/material'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'
import MuiAlert from '@mui/lab/Alert'
import Autocomplete from '@mui/lab/Autocomplete'

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@mui/pickers';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { makeStyles } from '@mui/styles'

import FormLabel from '@mui/material/FormLabel'

import Radio from '@mui/material/Radio'

import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'

import { Button } from 'primereact/button'

import ClaimsIntimationDocumentComponent from './intimation.document.component'

import { ProvidersService } from '@/services/remote-api/api/provider-services'
import { ClaimsIntimationService, PreAuthService } from '@/services/remote-api/api/claims-services'

import GridContainer from '../../shared-component/GridContainer'
import Asterisk from '../../shared-component/components/red-asterisk'

const claimintimationservice = new ClaimsIntimationService()
const providerservice = new ProvidersService()
const preAuthService = new PreAuthService()

const pt$ = providerservice.getProviders({
  page: 0,
  size: 10000,
  summary: true,
  active: true
})

const useStyles = makeStyles((theme: any) => ({
  root: {
    width: '100%',
    height: '100%'
  },
  form: {
    // display: 'grid',
    // gridTemplateColumns: '1fr 1fr 1fr',
    // gridGap: theme.spacing(2),
    margin: theme?.spacing ? theme.spacing(1) : '32px'

    // minHeight: '400px',
  },
  fullWidth: {
    width: '100%',
    height: '100%'
  },
  actionContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  saveBtn: {
    marginRight: '5px'
  },
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
    minWidth: 182
  },
  formControl1: {
    margin: theme?.spacing ? theme.spacing(1) : '8px',
    minWidth: 120,
    maxWidth: 300
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  },
  inputRoot: {
    '&$disabled': {
      color: 'black'
    }
  },
  backButton: {
    marginRight: theme?.spacing ? theme.spacing(1) : '8px'
  },
  instructions: {
    marginTop: theme?.spacing ? theme.spacing(1) : '8px',
    marginBottom: theme?.spacing ? theme.spacing(1) : '8px'
  },
  stepText: {
    '& span': {
      fontSize: '16px'
    }
  },
  prospectImportOuterContainer: {
    padding: 20
  },
  prospectImportRadioGroup: {
    flexWrap: 'nowrap',
    '& label': {
      flexDirection: 'row'
    }
  }
}))

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }
function getSteps() {
  return ['Intimation Details', 'Documents']
}

export default function ClaimsIntimationDetailsComponent() {
  const imgF =
    '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'

  const history = useRouter()
  const id: any = useParams().id

  const classes = useStyles()
  const [isInvoiceDetailModal, setInvoiceDetailModal] = React.useState(false)
  const [uploadSuccess, setUploadSuccess] = React.useState(false)
  const [importMode, setImportMode] = React.useState(true)
  const [selectedChoice, setSelectedChoice] = React.useState('')
  const [preauthId, setPreAuthId] = React.useState<any>('')
  const query1 = useSearchParams()

  const [intimationstate, setIntimationState] = React.useState({
    membershipNo: '',
    providerId: '',
    providerInvoiceNo: '',
    selectedLossDate: new Date(),
    modeOfComunication: '',
    documentReceiveFrom: '',
    notes: '',
    selectedReceiveDate: new Date(),
    documentNo: ''
  })

  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())
  const steps = getSteps()

  const isStepOptional = (step: any) => {
    return step === 1
  }

  const [providerData, setProviderData] = React.useState<any>('')

  const [providersList, setProvidersList] = React.useState([])

  const [documentList, setDocumentList] = React.useState([
    {
      documentType: '',
      docFormat: '',
      documentName: '',
      document: '',

      // imgLink: '',
      documentNo: ''
    }
  ])

  function Alert(props: any) {
    return <MuiAlert elevation={6} variant='filled' {...props} />
  }

  const isStepSkipped = (step: any) => {
    return skipped.has(step)
  }

  const handleNext = () => {
    if (activeStep === 0) {
      //API call 1st step
    }

    if (activeStep === 1) {
      //API call 2nd step
    }

    let newSkipped = skipped

    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.")
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1)
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values())

      newSkipped.add(activeStep)

      return newSkipped
    })
  }

  const getStepContent = (step: any) => {
    switch (step) {
      case 0:
        return (
          <div className={classes.root}>
            <Paper elevation={0}>
              <Snackbar open={uploadSuccess} autoHideDuration={3000} onClose={handleFileUploadMsgClose}>
                <Alert onClose={handleFileUploadMsgClose} severity='success'>
                  File uploaded successfully
                </Alert>
              </Snackbar>

              <form className={classes.form}>
                <Box pb={{ xs: 6, md: 10, xl: 16 }}>
                  <GridContainer spacing={8}>
                    <Grid item xs={12} sm={4}>
                      {selectedChoice === 'Yes' && (
                        <Grid item xs={4}>
                          <TextField
                            style={{ width: '100%' }}
                            id='standard-basic'
                            name='preauthId'
                            value={preauthId}
                            onChange={handlePreAuthId}
                            label='PreAuth ID'
                          />
                        </Grid>
                      )}
                      {selectedChoice === 'Yes' && preauthId !== '' && preauthId !== null && (
                        <Grid item xs={2}>
                          <Button color='primary' onClick={importFromPreAuth}>
                            Continue
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={4}></Grid>
                    <Grid item xs={12} sm={4}></Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        id='standard-basic'
                        name='membershipNo'
                        // required
                        value={intimationstate.membershipNo}
                        onChange={handleChange}
                        label={
                          <span>
                            Membership No. <Asterisk />
                          </span>
                        }
                        disabled={selectedChoice === 'Yes' && preauthId !== '' && preauthId !== null}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Autocomplete
                        id='combo-box-demo'
                        options={providersList}
                        getOptionLabel={(option: any) => option.name}
                        value={providerData}
                        style={{ width: '50%' }}
                        renderInput={params => <TextField {...params} label='Provider name' />}
                        onChange={handlePChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        id='standard-basic'
                        name='providerInvoiceNo'
                        // required
                        value={intimationstate.providerInvoiceNo}
                        onChange={handleChange}
                        label={
                          <span>
                            Provider Invoice No. <Asterisk />
                          </span>
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      {/* <FormControl variant="outlined" required> */}
                      {/* <InputLabel variant="outlined">Loss Date</InputLabel> */}
                      {/* <KeyboardDateInput format="dd/MM/yyyy" variant="outlined" /> */}
                      {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          views={['year', 'month', 'date']}
                          variant="inline"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="date-picker-inline"
                          autoOk={true}
                          label="Loss Date *"
                          value={intimationstate.selectedLossDate}
                          onChange={handleDateChange}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                      </MuiPickersUtilsProvider> */}
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          views={['year', 'month', 'day']}
                          label='Loss Date *'
                          value={intimationstate.selectedLossDate}
                          onChange={handleDateChange}
                          renderInput={params => (
                            <TextField {...params} margin='normal' style={{ marginBottom: '0px' }} variant='outlined' />
                          )}
                        />
                      </LocalizationProvider>
                      {/* </FormControl> */}
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormControl style={{ width: '100%' }}>
                        <InputLabel style={{ marginBottom: '0px' }}>Mode of Communication</InputLabel>
                        <Select
                          labelId='demo-simple-select-label'
                          label='Mode of Communication'
                          name='modeOfComunication'
                          id='demo-simple-select'
                          value={intimationstate.modeOfComunication}
                          onChange={handleChange}
                        >
                          {['In Person', 'eMail', 'Courier', 'WhatsApp'].map(item => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormControl style={{ width: '100%' }}>
                        <InputLabel style={{ marginBottom: '0px' }}>Document Received From</InputLabel>
                        <Select
                          labelId='demo-simple-select-label'
                          label='Document Received From'
                          name='documentReceiveFrom'
                          id='demo-simple-select'
                          value={intimationstate.documentReceiveFrom}
                          onChange={handleChange}
                        >
                          {['Provider', 'Insured'].map(item => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <InputLabel variant='outlined'>Notes</InputLabel>
                      <FormControl className={classes.fullWidth} variant='outlined'>
                        <TextareaAutosize
                          minRows={4}
                          aria-label='Notes'
                          name='notes'
                          value={intimationstate.notes}
                          onChange={handleChange}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      {/* <FormControl variant="outlined" required> */}
                      {/* <InputLabel variant="outlined">Loss Date</InputLabel> */}
                      {/* <KeyboardDateInput format="dd/MM/yyyy" variant="outlined" /> */}
                      {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          views={['year', 'month', 'date']}
                          variant="inline"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="date-picker-inline"
                          label="Receive Date *"
                          autoOk={true}
                          value={intimationstate.selectedReceiveDate}
                          onChange={handleDateChange2}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                      </MuiPickersUtilsProvider> */}
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          views={['year', 'month', 'day']}
                          label='Receive Date *'
                          value={intimationstate.selectedReceiveDate}
                          onChange={handleDateChange2}
                          renderInput={params => (
                            <TextField {...params} margin='normal' style={{ marginBottom: '0px' }} variant='outlined' />
                          )}
                        />
                      </LocalizationProvider>
                      {/* </FormControl> */}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        id='standard-basic'
                        name='documentNo'
                        value={intimationstate.documentNo}
                        onChange={handleChange}
                        label='Document No.'
                      />
                    </Grid>

                    <Grid item xs={12} className={classes.actionContainer}>
                      <Button className={classes.saveBtn} color='primary' onClick={handleSubmit}>
                        Save
                      </Button>
                      <Button
                        className={`p-button-text ${classes.saveBtn}`}
                        style={{ marginLeft: '10px' }}
                        color='primary'
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </GridContainer>
                </Box>
              </form>
            </Paper>
          </div>
        )
      case 1:
        return <ClaimsIntimationDocumentComponent handleClose={handleClose} handleNext={handleNext} />
      default:
        return 'Unknown step'
    }
  }

  const handleInputChangeDocumentType = (e: any, index: any) => {
    const { name, value } = e.target
    const list: any = [...documentList]

    list[index][name] = value
    setDocumentList(list)
  }

  const handleInputChangeDocumentNo = (e: any, index: any) => {
    const { name, value } = e.target
    const list: any = [...documentList]

    list[index][name] = value
    setDocumentList(list)
  }

  const handleRemoveDocumentList = (index: any) => {
    const list = [...documentList]

    list.splice(index, 1)
    setDocumentList(list)
  }

  const handleAddDocumentList = () => {
    setDocumentList([
      ...documentList,
      {
        documentType: '',
        documentNo: '',
        document: '',
        documentName: '',
        docFormat: ''

        // imgLink: '',
      }
    ])
  }

  const handleImgChange1 = (e: any, index: any) => {
    let base64String = ''
    const file: any = e.target['files'][0]
    const reader: any = new FileReader()

    reader.onload = function () {
      base64String = reader.result.replace('data:', '').replace(/^.+,/, '')

      // imageBase64Stringsep = base64String;

      // alert(imageBase64Stringsep);

      const list = [...documentList]

      list[index]['document'] = base64String
      list[index]['docFormat'] = file.type

      // list[index]['imgLink'] = reader.result;
      list[index]['documentName'] = file.name

      setDocumentList(list)
      setUploadSuccess(true)
    }

    reader.readAsDataURL(file)
  }

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        const arr: any = []

        if (result.content && result.content.length !== 0) {
          result.content.forEach((ele: any) => {
            if (!ele.blackListed) {
              arr.push({
                name: ele.providerBasicDetails.name,
                id: ele.id
              })
            }
          })
        }

        setter(arr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(pt$, setProvidersList)

  React.useEffect(() => {
    if (id) {
      setTimeout(() => {
        populateDetails(id)
      }, 1000)
    }
  }, [id])

  React.useEffect(() => {
    if (query1.get('preId')) {
      setPreAuthId(query1.get('preId'))
      setSelectedChoice('Yes')
      setImportMode(false)
    }
  }, [query1.get('preId')])

  const populateDetails = (id: any) => {
    claimintimationservice.getIntimationDetails(id).subscribe(res => {
      setIntimationState({
        membershipNo: res.membershipNo,
        providerId: res.providerId,
        providerInvoiceNo: res.providerInvoiceNo,
        selectedLossDate: new Date(res.lossDate),
        modeOfComunication: res.modeOfComunication,
        documentReceiveFrom: res.documentReceiveFrom,
        notes: res.notes,
        selectedReceiveDate: new Date(res.receiveDate),
        documentNo: res.documentNo ? res.documentNo : ''
      })
      setImportMode(false)

      if (res.providerId) {
        providerservice
          .getProviders({
            page: 0,
            size: 100,
            summary: true,
            active: true
          })
          .subscribe((result: any) => {
            result.content.forEach((pr: any) => {
              if (pr.id === res.providerId) {
                setProviderData({
                  name: pr.providerBasicDetails.name,
                  id: pr.id
                })
              }
            })
          })
      }

      if (res.claimIntimationDocumentDetails) {
        setDocumentList(res.claimIntimationDocumentDetails)
      } else {
        setDocumentList([
          {
            documentType: '',
            docFormat: '',
            documentName: '',
            document: '',

            // imgLink: '',
            documentNo: ''
          }
        ])
      }

      if (res.preauthid) {
        setPreAuthId(res.preauthid)
        setSelectedChoice('Yes')
      }
    })
  }

  const handlePChange = (e: any, value: any) => {
    setIntimationState({
      ...intimationstate,
      providerId: value?.id
    })
    setProviderData(value)
  }

  const handleAddInvoiceDetailsBtn = () => {
    setInvoiceDetailModal(true)
  }

  const handleInvDetClose = () => {
    setInvoiceDetailModal(false)
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target

    setIntimationState({
      ...intimationstate,
      [name]: value
    })
  }

  const handleDateChange = (date: any) => {
    setIntimationState({
      ...intimationstate,
      selectedLossDate: date
    })
  }

  const handleDateChange2 = (date: any) => {
    setIntimationState({
      ...intimationstate,
      selectedReceiveDate: date
    })
  }

  const handleClose = () => {
    history.push('/claims/claims-intimation?mode=viewList')

    // window.location.reload();
  }

  const handleSubmit = () => {
    const payload: any = {
      membershipNo: intimationstate.membershipNo,
      providerId: intimationstate.providerId,
      providerInvoiceNo: intimationstate.providerInvoiceNo,
      preAuthId: preauthId,
      lossDate: new Date(intimationstate.selectedLossDate).getTime(),
      modeOfComunication: intimationstate.modeOfComunication,
      documentReceiveFrom: intimationstate.documentReceiveFrom,
      notes: intimationstate.notes,
      receiveDate: new Date(intimationstate.selectedReceiveDate).getTime(),
      documentNo: intimationstate.documentNo

      //claimIntimationDocumentDetails: documentList
    }

    if (id) {
      claimintimationservice.editIntimation(payload, id).subscribe(res => {
        handleNext()
      })
    } else {
      claimintimationservice.saveIntimation(payload).subscribe((res: any) => {
        history.push(`/claims/claims-intimation/${res.id}?mode=create`)
        handleNext()
      })
    }
  }

  const handleFileUploadMsgClose = (event: any, reason: any) => {
    setUploadSuccess(false)
  }

  const handleChoice = (event: any) => {
    setSelectedChoice(event.target.value)
    setImportMode(false)
  }

  const importFromPreAuth = () => {
    history.push(`/claims/claims-intimation?mode=create&preId=` + preauthId)
    setImportMode(false)
    preAuthService.getPreAuthById(preauthId).subscribe((res: any) => {
      setIntimationState({
        ...intimationstate,
        membershipNo: res.memberShipNo

        // providerId: res.providerId,
        // providerInvoiceNo: res.providerInvoiceNo,
        // selectedLossDate: new Date(res.lossDate),
        // modeOfComunication: res.modeOfComunication,
        // documentReceiveFrom: res.documentReceiveFrom,
        // notes: res.notes,
        // selectedReceiveDate: new Date(res.receiveDate),
        // documentNo: res.documentNo ? res.documentNo : '',
      })

      // formik.setValues({
      //   memberShipNo: res.memberShipNo,
      //   expectedDOA: res.expectedDOA,
      //   expectedDOD: res.expectedDOD,
      //   diagnosis: res.diagnosis,
      //   contactNoOne: Number(res.contactNoOne),
      //   contactNoTwo: Number(res.contactNoTwo),
      //   referalTicketRequired: res.referalTicketRequired,
      //   preAuthStatus: res.preAuthStatus
      // });
    })
  }

  const handlePreAuthId = (event: any) => {
    setPreAuthId(event.target.value)
  }

  return (
    <div>
      {query1.get('mode') === 'edit' ? (
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
            Claim Intimation- Edit Claim
          </span>
        </Grid>
      ) : null}
      {query1.get('mode') === 'create' && importMode && !id && !query1.get('preId') ? (
        <Paper elevation={0} className={classes.prospectImportOuterContainer}>
          <Grid container spacing={3} style={{ marginBottom: '20px', padding: '16px' }}>
            <Grid item xs={6}>
              <FormControl component='fieldset'>
                <FormLabel component='legend'>Do you want to import data from PreAuth</FormLabel>
                <RadioGroup
                  aria-label='preauthimport'
                  name='preauthimport'
                  value={selectedChoice}
                  onChange={handleChoice}
                  row
                  className={classes.prospectImportRadioGroup}
                >
                  <FormControlLabel value='Yes' control={<Radio size='small' />} label='Yes' />
                  <FormControlLabel value='No' control={<Radio size='small' />} label='No' />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      ) : (
        <div className={classes.root}>
          <Paper elevation={0}>
            <Stepper activeStep={activeStep} style={{ backgroundColor: 'transparent' }}>
              {steps.map((label, index) => {
                const stepProps: any = {}
                const labelProps: any = {}

                if (isStepOptional(index)) {
                  labelProps.optional = <Typography variant='caption'>Optional</Typography>
                }

                if (isStepSkipped(index)) {
                  stepProps.completed = false
                }

                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps} className={classes.stepText}>
                      {label}
                    </StepLabel>
                  </Step>
                )
              })}
            </Stepper>
          </Paper>
          <div>
            {activeStep === steps.length ? (
              <div>
                <Typography className={classes.instructions}>All steps completed</Typography>
                <Button onClick={handleClose} color='primary' className={classes.backButton}>
                  Go to Table
                </Button>
              </div>
            ) : (
              <div>
                <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                <div>
                  {activeStep !== 0 && (
                    <Button
                      onClick={handleBack}
                      className={`p-button-text ${classes.backButton}`}
                      style={{ marginRight: '5px' }}
                    >
                      Back
                    </Button>
                  )}
                  {isStepOptional(activeStep) && (
                    <Button color='primary' onClick={handleSkip} className={classes.backButton}>
                      Skip
                    </Button>
                  )}

                  {activeStep !== 0 && (
                    <Button color='primary' onClick={handleNext} className={classes.backButton}>
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
