import React, { useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from 'primereact/button'
import { Grid, Paper, Step, StepLabel, Stepper, Typography, useTheme } from '@mui/material'
import { makeStyles } from '@mui/styles'

import { AddressService, IdentificationTypeService } from '@/services/remote-api/api/master-services'
import { AgentsService } from '@/services/remote-api/api/agents-services'
import AgentAddressDetailsComponent from './agents.address.details.component'
import AgentPersonalDetailsComponent from './agents.personal.details.component'
import AgentOtherDetailsComponent from './agents.other.details.component'
import AgentDocumentsComponent from './agents.documents.component'

// import { AgentsService } from "../../remote-api/api/agents-services";
// import { AddressService } from "../../remote-api/api/master-services/address.service";
// import { IdentificationTypeService } from "../../remote-api/api/master-services/identification.type.service";
// import AgentAddressDetailsComponent from "./agents.address.details.component";
// import AgentOtherDetailsComponent from "./agents.other.details.component";
// import AgentPersonalDetailsComponent from "./agents.personal.details.component";

const identificationService = new IdentificationTypeService()
const agentService = new AgentsService()
const addressService = new AddressService()

const iden$ = identificationService.getIdentificationTypes()
const pt$ = agentService.getParentAgents()
const addr$ = addressService.getAddressConfig()

const useStyles = makeStyles((theme: any) => ({
  root: {
    flexDirection: 'column'
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
  return ['Basic Details', 'Contact Details', 'Finance Details', 'Documents']
}

export default function AgentsDetails() {
  const router = useRouter()

  // const query = router.query;
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')
  const theme = useTheme()

  // State Hooks
  const [identificationTypes, setIdentificationTypes] = useState([])
  const [parentAgents, setParentAgents] = useState([])
  const [addressConfig, setAddressConfig] = useState([])
  const [agentID, setAgentID] = useState('')
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = React.useState(new Set())
  const steps = getSteps()

  const isStepOptional = (step: number) => {
    return step === 1
  }

  // Observables Setup
  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: { content: any }) => {
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
              name: ele.agentBasicDetails.name,
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
      if (result.length !== 0) {
        result.forEach((prop: { addressConfigurationFieldMappings: any[] }, i: any) => {
          prop.addressConfigurationFieldMappings.forEach((field, j) => {
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

              if (field.type === 'dropdown' && field.sourceId === null) {
                if (field.addressConfigurationFieldCustomValueMappings.length !== 0) {
                  field['sourceList'] = field.addressConfigurationFieldCustomValueMappings
                }

                // if(field.addressConfigurationFieldCustomValueMappings.length === 0 || field.addressConfigurationFieldCustomValueMappings === null){
                //   field['sourceList'] = [];
                // }
              }
            }
          })
        })
        setAddressConfig(result)
      }
    })

    return () => subscription.unsubscribe()
  }, [addr$, setAddressConfig])

  useObservable2(pt$, setParentAgents)
  useObservable(iden$, setIdentificationTypes)

  const handleClose = () => {
    router.push(`/agents/management?mode=viewList`)

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

  const getStepContent = (step: any) => {
    return (
      <>
        <div style={step == 0 ? { display: 'block' } : { display: 'none' }}>
          <AgentPersonalDetailsComponent
            identificationTypes={identificationTypes}
            pageMode={mode}
            handleClose={handleClose}
            handleNext={handleNext}
            parentAgents={parentAgents}
            setAgentID={setAgentID}
          />
        </div>
        <div style={step == 1 ? { display: 'block' } : { display: 'none' }}>
          <AgentAddressDetailsComponent
            handleClose={handleClose}
            agentID={agentID}
            handleNext={handleNext}
            addressConfig={addressConfig}
          />
        </div>
        <div style={step == 2 ? { display: 'block' } : { display: 'none' }}>
          <AgentOtherDetailsComponent handleClose={handleClose} agentID={agentID}handleNext={handleNext} addressConfig={addressConfig}/>
        </div>
        <div style={step == 3 ? { display: 'block' } : { display: 'none' }}>
          <AgentDocumentsComponent handleClose={handleClose} agentID={agentID} />
        </div>
      </>
    )
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
            color: 'inherit',
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
            Agent Management - Edit Agent
          </span>
        </Grid>
      ) : null}

      <div className={classes.root}>
        <Paper elevation={0}>
          <Stepper activeStep={activeStep} style={{ backgroundColor: 'transparent' }}>
            {steps.map((label, index) => {
              const stepProps: any = {}
              const labelProps: any = {}

              // if (isStepOptional(index)) {
              //   labelProps.optional = <Typography variant='caption'>Optional</Typography>
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
            <div>
              <Typography className={classes.instructions}>All steps completed</Typography>
              <Button onClick={handleClose} color='secondary' className={classes.button}>
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
                  className={`p-button-text ${classes.button}`}
                  color='secondary'
                  style={{ marginRight: '5px' }}
                >
                  Back
                </Button>
                {isStepOptional(activeStep) && (
                  <Button color='secondary' onClick={handleSkip} className={`p-button-text ${classes.button}`}>
                    Skip
                  </Button>
                )}

                <Button color='primary' onClick={handleNext} className={classes.button}>
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
