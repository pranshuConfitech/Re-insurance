import * as React from 'react'
import { useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'

import 'date-fns'

import { Button } from 'primereact/button'

import { AddressService, IdentificationTypeService } from '@/services/remote-api/api/master-services'
import { ProvidersService } from '@/services/remote-api/api/provider-services'
import BranchBasicDetailsComponent from './branch.basic.details.component'
import BranchAddressDetailsComponent from './branch.address.details.component'
import BranchContactPersonDetailsComponent from './branch.contact.person.details.component'
import RegionBasicDetailsComponent from './region.details.component'
import UnitBasicDetailsComponent from './unit.details.component'

const identificationservice = new IdentificationTypeService()
const providerservice = new ProvidersService()
const addressservice = new AddressService()
const iden$ = identificationservice.getIdentificationTypes()
const pt$ = providerservice.getParentProviders()
const addr$ = addressservice.getAddressConfig()

const useStyles = makeStyles((theme: any) => ({
  root: {
    // width: '100%',
    flexDirection: 'column'

    /* marginLeft: "5%", */
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
  return ['Basic Details', 'Address Details', 'Contact Person Details']
}

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

export default function BasicDetails(props: any) {
  const query1 = useSearchParams()
  const router = useRouter()

  const [identificationTypes, setIdentificationTypes] = React.useState([])
  const [parentProviders, setParentProviders] = React.useState([])
  const [addressConfig, setAddressConfig] = React.useState([])
  const [branchId, setBranchId] = React.useState('')

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
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  const useObservable2 = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        const tableArr: any = []

        if (result.content && result.content) {
          result.content.forEach((ele: any) => {
            tableArr.push({
              name: ele.providerBasicDetails.name,
              id: ele.id
            })
          })
        }

        setter(tableArr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useEffect(() => {
    const subscription = addr$.subscribe((result: any) => {
      if (result.length > 0) {
        result.forEach((prop: any, i: number) => {
          prop.addressConfigurationFieldMappings.forEach((field: any, j: number) => {
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

  useObservable2(pt$, setParentProviders)
  useObservable(iden$, setIdentificationTypes)

  const handleClose = (event: any) => {
    router.push(`/branch?mode=viewList`)

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

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <BranchBasicDetailsComponent
            identificationTypes={identificationTypes}
            pageMode={query1.get('mode')}
            handleClose={handleClose}
            handleNext={handleNext}
            parentProviders={parentProviders}
            setBranchId={setBranchId}
          />
        )
      case 1:
        return (
          <BranchAddressDetailsComponent
            handleClose={handleClose}
            branchId={branchId}
            handleNext={handleNext}
            addressConfig={addressConfig}
          />
        )
      case 2:
        return (
          <BranchContactPersonDetailsComponent
            handleClose={handleClose}
            branchId={branchId}
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
      {query1.get('type') === 'region' ? (<RegionBasicDetailsComponent />) : query1.get('type') === 'unit' ? (<UnitBasicDetailsComponent />) :
        <>
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
                Branch Management- Edit Branch
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
        </>
      }
    </div>
  )
}
