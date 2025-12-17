'use client'
import * as React from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { makeStyles, useTheme } from '@mui/styles'
import MuiAlert from '@mui/lab/Alert'

import 'date-fns'

import { Observable, map } from 'rxjs'

import { Modal } from '@mui/material'

import { TabPanel, TabView } from 'primereact/tabview'

import { PreAuthService } from '@/services/remote-api/api/claims-services'
import ReimDocumentComponent from './claim.reim.doc.component'
import ClaimReimTimelineComponent from './claim.reim.timline.component'
import ClaimsReimBasicComponent from './cliam.reim.basic.component'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const useStyles = makeStyles((theme: any) => ({
  root: {
    // width: '100%',
    flexDirection: 'column'

    // marginLeft: '1%',
  },
  backButton: {
    marginRight: theme.spacing ? theme.spacing(1) : '8px'
  },
  instructions: {
    marginTop: theme.spacing ? theme.spacing(1) : '8px',
    marginBottom: theme.spacing ? theme.spacing(1) : '8px'
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

const preauthService = new PreAuthService()

function getSteps() {
  return ['Claim details', 'Document details']
}

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

function Alert(props: any) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

export default function ClaimsReimDetails(props: any) {
  const query1 = useSearchParams()
  const history = useRouter()
  const theme: any = useTheme()
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())
  const [selectedChoice, setSelectedChoice] = React.useState('')
  const [preauthId, setPreAuthId] = React.useState('')
  const [importMode, setImportMode] = React.useState(false)
  const [preauthData, setPreauthData] = React.useState('')
  const [idErrorMsg, setIdErrorMsg] = React.useState(false)
  const [showDataTable, setShowDataTable] = React.useState(false)
  const [enteredMembershipNo, setEnteredMembershipNo] = React.useState()
  const [tableData, setTableData] = React.useState()
  const [openPopup, setOpenPopup] = React.useState(false)

  const steps = getSteps()

  const isStepOptional = (step: any) => {
    return step === 1
  }

  React.useEffect(() => {
    if (query1.get('preId')) {
      importPreAuthData(query1.get('preId'))
    }
  }, [query1.get('preId')])

  const handleClose = (event: any) => {
    localStorage.removeItem('claimreimid')

    history.push(`/claims/claims-reimbursement?mode=viewList`)

    // window.location.reload();
  }

  const handleChoice = (event: any) => {
    setSelectedChoice(event.target.value)

    if (event.target.value === 'No') {
      setImportMode(false)
    }
  }

  const handlePreAuthId = (event: any) => {
    setPreAuthId(event.target.value)
  }

  const importPreAuthData = (pid: any) => {
    if (pid) {
      preauthService.getPreAuthById(pid).subscribe((res: any) => {
        if (res.preAuthStatus === 'WAITING_FOR_CLAIM') {
          setPreauthData(res)
          setImportMode(false)
        }

        if (res.preAuthStatus !== 'WAITING_FOR_CLAIM') {
          setIdErrorMsg(true)
        }
      })

      // setImportMode(false)
    }
  }

  const importFromPreAuth = () => {
    history.push(`/claims/claims-reimbursement?mode=create&preId=` + preauthId)
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
        return <ClaimsReimBasicComponent preauthData={preauthData} handleClose={handleClose} handleNext={handleNext} />
      case 1:
        return <ReimDocumentComponent preauthData={preauthData} handleClose={handleClose} handleNext={handleNext} />

      //   case 2:
      //     return (
      //       <AgentOtherDetailsComponent
      //         handleClose={handleClose}
      //       />
      //     );

      default:
        return 'Unknown step'
    }
  }

  const handleIDErrorClose = (event: any, reason: any) => {
    setIdErrorMsg(false)
  }

  const [tabvalue, setTabValue] = React.useState(0)

  const handleTabChange = (event: any, newValue: any) => {
    setTabValue(newValue)
  }

  const handleSearch = () => {
    preauthService.getPreAuthsByMembership(enteredMembershipNo).subscribe((res: any) => {
      if (res.content.length > 0) {
        setTableData(res.content)
        setShowDataTable(true)
      } else {
        setOpenPopup(true)
      }
    })
  }

  const handleYes = (preAuth: any) => {
    setOpenPopup(false)
    setImportMode(false)
  }

  const clickHandler = (preAuth: any) => {
    history.push(`/claims/claims-reimbursement?mode=create&preId=` + preAuth.id)
  }

  const columnsDefinations = [
    { field: 'id', headerName: 'PreAuth ID' },
    { field: 'memberShipNo', headerName: 'MembershipNuber ' },
    { field: 'policyNumber', headerName: 'Policy Number' },
    { field: 'preAuthType', headerName: 'PreAuth Type' }
  ]

  const xlsColumns = ['id', 'memberShipNo', 'policyNumber', 'preAuthType']

  const configuration = {
    enableSelection: false,
    scrollHeight: '285px',
    pageSize: 10,
    actionButtons: [
      {
        icon: 'pi pi-eye',
        onClick: clickHandler
      }
    ],
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      text: 'POLICY CONDITION (COVERAGE / BENEFITS)'
    }
  }

  const data$ = new Observable(subscriber => {
    subscriber.next(tableData)
  })

  const dataSource$ = () => {
    return data$.pipe(
      map((data: any) => {
        data.content = data

        return data
      })
    )
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
            Claim Management-Edit Claim Reimbursement
          </span>
        </Grid>
      ) : null}
      {query1.get('mode') === 'create' && importMode ? (
        <Paper elevation={0} className={classes.prospectImportOuterContainer}>
          <Snackbar open={idErrorMsg} autoHideDuration={6000} onClose={handleIDErrorClose}>
            <Alert onClose={handleIDErrorClose} severity='error'>
              Please enter a Approved Pre-Auth ID
            </Alert>
          </Snackbar>
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={4}>
              <TextField
                id='membershipNumber'
                name='membershipNumber'
                label='Enter Membership Number'
                style={{ width: '100%' }}
                value={enteredMembershipNo}
                onChange={(e: any) => setEnteredMembershipNo(e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                style={{ background: theme?.palette?.primary?.main || '#D80E51', color: '#fff' }}
                onClick={handleSearch}
              >
                Search
              </Button>
            </Grid>
          </Grid>
          {/* <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid item xs={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Do you want to import data from PreAuth</FormLabel>
              <RadioGroup
                aria-label="preauthimport"
                name="preauthimport"
                value={selectedChoice}
                onChange={handleChoice}
                row
                className={classes.prospectImportRadioGroup}>
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
          {selectedChoice === 'Yes' && (
            <Grid item xs={4}>
              <TextField
                style={{ width: '100%' }}
                id="standard-basic"
                name="preauthId"
                value={preauthId}
                onChange={handlePreAuthId}
                label="PreAuth ID"
              />
            </Grid>
          )}
          {selectedChoice === 'Yes' && preauthId !== "" && preauthId !== null && 
          <Grid item xs={2}>
                  <Button variant="contained" color="primary" onClick={importFromPreAuth}>
                    Import data
                  </Button>
                
              </Grid>}
        </Grid> */}
          {showDataTable && (
            <Box marginTop={'25px'}>
              <FettleDataGrid $datasource={dataSource$} config={configuration} columnsdefination={columnsDefinations} />
            </Box>
          )}
        </Paper>
      ) : (
        <TabView scrollable style={{ fontSize: '14px' }}>
          <TabPanel leftIcon='pi pi-user mr-2' header='Reimbursement Details'>
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
                    <div className={classes.instructions}>{getStepContent(activeStep)}</div>
                    <div>
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className={`p-button-text ${classes.backButton}`}
                        style={{ marginRight: '5px' }}
                      >
                        Back
                      </Button>
                      {isStepOptional(activeStep) && (
                        <Button color='primary' onClick={handleSkip} className={classes.backButton}>
                          Skip
                        </Button>
                      )}

                      <Button color='primary' onClick={handleNext} className={classes.backButton}>
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabPanel>
          <TabPanel leftIcon='pi pi-user mr-2' header='Reimbursement Audit Trail'>
            <ClaimReimTimelineComponent />
          </TabPanel>
        </TabView>
      )}

      <Modal
        open={openPopup}
        onClose={e => setOpenPopup(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h2' align='center'>
            No PreAuth found for given id. You can still create Claim Reimbursement.
          </Typography>
          <Typography id='modal-modal-description' style={{ marginTop: '8px' }}>
            For create Claim Reimbursement click Yes.
          </Typography>
          <Box display={'flex'} justifyContent={'end'} marginTop={'15px'}>
            <Button className='p-button-text' onClick={e => setOpenPopup(false)}>
              No
            </Button>
            <Button
              style={{ background: theme?.palette?.primary?.main || '#D80E51', color: '#fff' }}
              onClick={handleYes}
            >
              Yes
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}
