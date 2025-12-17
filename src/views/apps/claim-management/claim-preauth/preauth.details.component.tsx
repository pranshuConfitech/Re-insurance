
import * as React from 'react';

import { useParams, useRouter, useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import { Button } from 'primereact/button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import 'date-fns';

import { TabView, TabPanel } from 'primereact/tabview';

import ClaimsDocumentComponent from './document.component';
import PreAuthTimelineComponent from './preauth.timeline.component';
import ClaimsPreAuthIPDComponent from './preauthIPD.component';
import ClaimsPreAuthOPDComponent from './preauthOPD.component';
import ClaimsDocumentOPDComponent from './document.OPD.component';


const useStyles = makeStyles((theme: any) => ({
  root: {
    // width: '100%',
    flexDirection: 'column',

    // marginLeft: '1%',
  },
  backButton: {
    marginRight: theme?.spacing ? theme.spacing(1) : '8px',
  },
  instructions: {
    marginTop: theme?.spacing ? theme.spacing(1) : '8px',
    marginBottom: theme?.spacing ? theme.spacing(1) : '8px',
  },
  nextButton: {
    backgroundColor: '#D80E51',
    color: '#f1f1f1',
  },
  stepText: {
    '& span': {
      fontSize: '16px',
    },
    '& .MuiStepIcon-root.MuiStepIcon-active': {
      color: '#313c95',
    },
    '& .MuiStepIcon-root.MuiStepIcon-completed': {
      color: '#313c95',
    },
  },
}));

function getSteps() {
  return ['Pre-Auth Claims', 'Document details'];
}


export default function ClaimsPreAuthDetails(props: any) {
  const query1 = useSearchParams();
  const history = useRouter();
  const id: any = useParams().id;
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [membershipNumber, setMembershipNumber] = React.useState();
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  React.useEffect(() => {
    if (query1.get('addDoc')) setActiveStep(1);
  }, []);

  const isStepOptional = (step: any) => {
    return step === 1;
  };

  const handleClose = (event: any) => {
    localStorage.removeItem('preauthid');
    history.push(`/claims/claims-preauth?mode=viewList`);

    // window.location.reload();
  };

  const isStepSkipped = (step: any) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      //API call 1st step
    } else if (activeStep === 1) {
      history.push(`/claims/claims-preauth?mode=viewList`);

      // window.location.reload();
    }

    let newSkipped = skipped;

    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());

      newSkipped.add(activeStep);

      return newSkipped;
    });
  };

  const getStepContent = (step: any) => {
    switch (step) {
      case 0:
        return query1.get('auth') === 'OPD' ? (
          <ClaimsPreAuthOPDComponent handleClose={handleClose} handleNext={handleNext} />
        ) : (
          <ClaimsPreAuthIPDComponent
            handleClose={handleClose}
            handleNext={handleNext}
            setMembershipNumber={setMembershipNumber}
          />
        );
      case 1:
        return query1.get('auth') === 'OPD' ? (
          <ClaimsDocumentOPDComponent
            handleClose={handleClose}
            handleNext={handleNext}
            setMembershipNumber={setMembershipNumber}
          />
        ) : (
          <ClaimsDocumentComponent
            handleClose={handleClose}
            handleNext={handleNext}
            setMembershipNumber={setMembershipNumber}
          />
        );

      //   case 2:
      //     return (
      //       <AgentOtherDetailsComponent
      //         handleClose={handleClose}
      //       />
      //     );

      default:
        return 'Unknown step';
    }
  };

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
            fontSize: '18px',
          }}>
          <span
            style={{
              fontWeight: '600',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '5px',
            }}>
            Claim Management- Edit Pre-Auth Claim
          </span>
        </Grid>
      ) : null}
      {query1.get('mode') === 'edit' && <Box display={'flex'} justifyContent={'space-between'}>
        <Grid item xs={6} style={{ marginLeft: '10px' }}>
          <span style={{ color: '#D80E51', fontWeight: 'bold' }}>Claim ID</span>: {id}
        </Grid>
        <Grid item xs={6} style={{ marginRight: '10px' }}>
          <span style={{ color: '#D80E51', fontWeight: 'bold' }}>Membership Number</span>: {membershipNumber}
        </Grid>
      </Box>}
      <TabView scrollable style={{ fontSize: '14px' }} activeIndex={activeIndex} onTabChange={e => setActiveIndex(e.index)}>
        <TabPanel leftIcon="pi pi-user mr-2" header="Pre-Auth Details">
          <div className={classes.root}>
            {query1.get('auth') === 'IPD' && (
              <Paper elevation={0}>
                <Stepper activeStep={activeStep} style={{ backgroundColor: 'transparent' }}>
                  {steps.map((label, index) => {
                    const stepProps: any = {};
                    const labelProps: any = {};

                    if (isStepOptional(index)) {
                      labelProps.optional = <Typography component="div" variant="caption">Optional</Typography>;
                    }

                    if (isStepSkipped(index)) {
                      stepProps.completed = false;
                    }


                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps} className={classes.stepText}>
                          {label}
                        </StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
              </Paper>
            )}

            <div>
              {activeStep === steps.length ? (
                <div>
                  <Typography component="div" className={classes.instructions}>All steps completed</Typography>
                  <Button onClick={handleClose} color="primary" className={classes.backButton}>
                    Go to Table
                  </Button>
                </div>
              ) : (
                <div>
                  <Typography component="div" className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={`p-button-text ${classes.backButton}`}
                      style={{ marginRight: '5px' }}>
                      Back
                    </Button>
                    {/* {isStepOptional(activeStep) && (
                      <Button color="primary" onClick={handleSkip} className={classes.backButton}>
                        Skip
                      </Button>
                    )} */}

                    <Button color="primary" onClick={handleNext} className={classes.nextButton}>
                      {activeStep === steps.length - 1 ? 'Exit' : 'Next'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabPanel>
        <TabPanel leftIcon="pi pi-user-minus mr-2" header="Pre-Auth Audit Trail">
          <PreAuthTimelineComponent />
        </TabPanel>
      </TabView>
    </div>
  );
}
