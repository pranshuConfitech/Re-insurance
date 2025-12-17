import * as React from 'react'
import { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import { Grid, Paper, Step, StepLabel, Stepper, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'

import 'date-fns'

// import { useHistory, useLocation, useParams } from "react-router-dom";
import { Button } from 'primereact/button'

import { AddressService, IdentificationTypeService, ProviderTypeService } from '@/services/remote-api/api/master-services'
import { ProvidersService } from '@/services/remote-api/api/provider-services'
import ProviderAddressDetailsComponent from './provider.address.details.component'
import ProviderOtherDetailsComponent from './provider.other.details.component'
import ProviderPersonalDetailsComponent from './provider.personal.details.component'
import ProviderDocumentsComponent from './provider.documents.component'
const identificationservice = new IdentificationTypeService()
const providerservice = new ProvidersService()
const addressservice = new AddressService()
const providertypeservice = new ProviderTypeService()

const iden$ = identificationservice.getIdentificationTypes()
const pt$ = providerservice.getParentProviders()
const addr$ = addressservice.getAddressConfig()
const ct$ = providertypeservice.getContractTypes({ // Add this block
  page: 0,
  size: 10,
  summary: true,
  active: true
})
const nsct$ = providertypeservice.getNationalSchemeContractTypes({ // Add this block
  page: 0,
  size: 10,
  summary: true,
  active: true
})
const pot$ = providertypeservice.getProviderOwnerTypes({ // Add this block
  page: 0,
  size: 10,
  summary: true,
  active: true
})

const useStyles = makeStyles((theme: any) => ({
  root: {
    // width: '100%',
    flexDirection: 'column'

    /* marginLeft: "5%", */
  },
  backButton: {
    marginRight: theme?.spacing ? theme?.spacing(1) : '8px'
  },
  button: {
    marginRight: theme?.spacing ? theme?.spacing(1) : '8px'
  },
  instructions: {
    marginTop: theme?.spacing ? theme?.spacing(1) : '8px',
    marginBottom: theme?.spacing ? theme?.spacing(1) : '8px'
  },
  stepText: {
    '& span': {
      fontSize: '16px'
    }
  }
}))

function getSteps() {
  return ['Basic Details', 'Contact Details', 'Finance details', 'Documents']
}

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

export default function ProviderDetails(props: any) {
  // const query1 = useQuery1();
  // const history = useHistory();
  // const { id } = useParams();
  const router = useRouter();
  const params = useParams();

  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')
  const rawId = params?.id
  const routeProviderId = Array.isArray(rawId) ? rawId[0] ?? '' : rawId ?? ''


  const [identificationTypes, setIdentificationTypes] = React.useState([])
  const [parentProviders, setParentProviders] = React.useState([])
  const [addressConfig, setAddressConfig] = React.useState([])
  const [providerID, setProviderID] = React.useState('')
  const [contractTypes, setContractTypes] = React.useState([])
  const [providerOwnerTypes, setProviderOwnerTypes] = React.useState([])
  const [nationalSchemeContractTypes, setNationalSchemeContractTypes] = React.useState([])
  const classes = useStyles()
  const [activeStep, setActiveStep]: any = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())
  const steps = getSteps()

  useEffect(() => {
    if (!providerID && routeProviderId) {
      setProviderID(routeProviderId)
    }
  }, [providerID, routeProviderId])

  // Automatically navigate to table when all steps are completed
  useEffect(() => {
    if (activeStep === steps.length) {
      handleClose(null)
    }
  }, [activeStep, steps.length])

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
    const subscription = addr$.subscribe(result => {
      if (result.length > 0) {
        result.forEach((prop: any, i: any) => {
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

  useObservable2(pt$, setParentProviders)
  useObservable(iden$, setIdentificationTypes)
  useObservable(ct$, setContractTypes)
  useObservable(nsct$, setNationalSchemeContractTypes)
  useObservable(pot$, setProviderOwnerTypes)
  const handleClose = (event: any) => {
    router.push(`/provider?mode=viewList`)

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

    setActiveStep((prevActiveStep: any) => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep: any) => prevActiveStep - 1)
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.")
    }

    setActiveStep((prevActiveStep: any) => prevActiveStep + 1)
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
          <ProviderPersonalDetailsComponent
            identificationTypes={identificationTypes}
            pageMode={mode}
            handleClose={handleClose}
            handleNext={handleNext}
            parentProviders={parentProviders}
            setProviderID={setProviderID}
            contractTypes={contractTypes}
            nationalSchemeContractTypes={nationalSchemeContractTypes}
            providerOwnerTypes={providerOwnerTypes}
          />
        )
      case 1:
        return (
          <ProviderAddressDetailsComponent
            handleClose={handleClose}
            providerID={providerID}
            handleNext={handleNext}
            addressConfig={addressConfig}
          />
        )
      case 2:
        return <ProviderOtherDetailsComponent handleClose={handleClose} providerID={providerID} handleNext={handleNext}
          addressConfig={addressConfig} />
      case 3:
        return (
          <ProviderDocumentsComponent
            handleClose={handleClose}
            providerID={providerID || routeProviderId}
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
      {mode === 'edit' ? (
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
            Provider Management- Edit Provider
          </span>
        </Grid>
      ) : null}

      <div className={classes.root}>
        <Paper>
          <Stepper activeStep={activeStep} style={{ backgroundColor: 'transparent', padding: '10px' }}>
            {steps.map((label, index) => {
              const stepProps: any = {}
              const labelProps: any = {}

              // if (isStepOptional(index)) {
              //   labelProps.optional = <Typography variant='caption'></Typography>
              // }

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
            null
          ) : (
            <div>
              <Typography component="div" className={classes.instructions}>{getStepContent(activeStep)}</Typography>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={`p-button-text ${classes.button}`}
                  style={{ marginRight: '5px' }}
                >
                  Back
                </Button>
                {isStepOptional(activeStep) && (
                  <Button color='primary' onClick={handleSkip} className={classes.button}>
                    Skip
                  </Button>
                )}

                <Button
                  // variant="contained"
                  color='primary'
                  onClick={handleNext}
                  className={classes.button}
                >
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
