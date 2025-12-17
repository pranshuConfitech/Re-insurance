'use client'
import * as React from 'react'
import { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import { Button } from 'primereact/button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'

import 'date-fns'
import { BankService } from '@/services/remote-api/api/banks-services'
import { AddressService, OrganizationTypeService } from '@/services/remote-api/api/master-services'
import BankAddressDetailsComponent from './bank.address.details.component'
import BankBasicDetailsComponent from './bank.basic.details.component'

const bankservice = new BankService()
const addressservice = new AddressService()
const orgtypeservice = new OrganizationTypeService()
const ot$ = orgtypeservice.getOrganizationTypes()

const pt$ = bankservice.getParentBanks()
const addr$ = addressservice.getAddressConfig()

const useStyles = makeStyles((theme: any) => ({
  root: {
    // width: '100%',
    flexDirection: 'column'

    /* marginLeft: '5%', */
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
  }
}))

function getSteps() {
  return ['Basic Details', 'Address details']
}

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

export default function BankDetails(props: any) {
  const query1 = useSearchParams()
  const history = useRouter()
  const params = useParams()
  const id: any = params.id

  const [parentBanks, setParentBanks] = React.useState([])
  const [addressConfig, setAddressConfig] = React.useState([])
  const [orgTypes, setOrgTypes] = React.useState([])

  const [bankID, setBankID] = React.useState('')

  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())
  const steps = getSteps()

  const isStepOptional = (step: any) => {
    return step === 1
  }

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        const tableArr: any = []

        if (result.content && result.content.length > 0) {
          result.content.forEach((ele: any) => {
            tableArr.push({
              name: ele.bankBasicDetails.bankName,
              id: ele.id
            })
          })
        }

        setter(tableArr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  const useObservable1 = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  // useObservable1(ot$, setOrgTypes);

  useEffect(() => {
    const subscription = addr$.subscribe((result: any) => {
      if (result.length !== 0) {
        result.forEach((prop: any, i: number) => {
          prop.addressConfigurationFieldMappings.forEach((field: any, j: any) => {
            // let fname = "field"+i+j;
            // field['fieldName'] = fname;
            field['value'] = ''

            if (field.sourceId !== null && field.sourceId !== '') {
              field['sourceList'] = []
            }

            if (field.type === 'dropdown' && field.sourceId === null) {
              if (field.addressConfigurationFieldCustomValueMappings.length !== 0) {
                field['sourceList'] = field.addressConfigurationFieldCustomValueMappings
              }

              // if(field.addressConfigurationFieldCustomValueMappings.length === 0 || field.addressConfigurationFieldCustomValueMappings === null){
              //   field['sourceList'] = [];
              // }
            }
          })
        })
        setAddressConfig(result)
      }
    })

    return () => subscription.unsubscribe()
  }, [addr$, setAddressConfig])

  useObservable(pt$, setParentBanks)

  const handleClose = (event: any) => {
    history.push(`/bank-management/banks?mode=viewList`)

    // window.location.reload();
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

  const handleReset = () => {
    setActiveStep(0)
  }

  const getStepContent = (step: any) => {
    switch (step) {
      case 0:
        return (
          <BankBasicDetailsComponent
            pageMode={query1.get('mode')}
            handleClose={handleClose}
            handleNext={handleNext}
            parentBanks={parentBanks}
            setBankID={setBankID}
            orgTypes={orgTypes}
          />
        )
      case 1:
        return (
          <BankAddressDetailsComponent
            handleClose={handleClose}
            bankID={bankID}
            handleNext={handleNext}
            addressConfig={addressConfig}
          />
        )

      default:
        return 'Unknown step'
    }
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
            Bank Management- Edit Bank
          </span>
        </Grid>
      ) : null}

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
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={`p-button-text ${classes.backButton}`}
                  style={{ marginRight: '5px' }}
                >
                  Back
                </Button>
                {isStepOptional(activeStep) && (
                  <Button color='primary' onClick={handleSkip} className={`p-button-text ${classes.backButton}`}>
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
    </div>
  )
}
