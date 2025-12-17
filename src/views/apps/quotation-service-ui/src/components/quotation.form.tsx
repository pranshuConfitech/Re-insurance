
import React from 'react'

import { useParams, useRouter } from 'next/navigation'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/lab/Alert'
import { AlertTitle } from '@mui/lab'
import { Button } from 'primereact/button'
import Grid from '@mui/material/Grid'
import Step from '@mui/material/Step'
import StepConnector from '@mui/material/StepConnector'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import { createStyles, makeStyles, withStyles } from '@mui/styles'
import clsx from 'clsx'

import { QuotationService } from '@/services/remote-api/api/quotation-services'
import QuotationBasicDetailsComponent from './basic.deatils'
import MemberUploadComponent from './member.upload.component'
import QuotationDesignComponent from './quotation.design'

const quotationService = new QuotationService()

const useStyles = (theme: any) =>
  createStyles({
    quotationFormRoot: {
      flexGrow: 1
    },
    paper: {
      padding: theme?.spacing ? theme.spacing(2) : '8px',
      textAlign: 'center',
      color: theme?.palette?.text?.secondary
    },
    labelContainer: {
      borderRadius: 4,
      boxShadow: 'none'

      // '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%) !important',
    },
    stepperContent: {
      borderRadius: 4,
      margin: '15px 0'

      /* boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)', */
    },
    steperAction: {
      textAlign: 'right',
      padding: '20px 30px',
      paddingTop: '0',
      margin: '15px 0'
    }
  })

const ColorlibConnector = withStyles((theme: any) => ({
  alternativeLabel: {
    top: 22
  },
  active: {
    '& $line': {
      backgroundColor: theme?.palette?.primary?.main || '#D80E51'
    }
  },
  completed: {
    '& $line': {
      backgroundColor: theme?.palette?.primary?.main || '#D80E51'
    }
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1
  }
}))(StepConnector)

function getSteps() {
  return ['Basic Details', 'Member Upload', 'Quotation Design']
}

function getStepContent(
  step: any,
  handleNext: () => void,
  quotationDetails: any,
  updateQuotation: (o: any, changeType?: string) => void,
  getQuoationDetailsByID: () => void,
  onSeniorMembersUpdate: any,
  seniorMembers: any
) {
  switch (step) {
    case 0:
      return <QuotationBasicDetailsComponent handleNext={handleNext} quotationDetails={quotationDetails} />
    case 1:
      return (
        <MemberUploadComponent quotationDetails={quotationDetails} getQuoationDetailsByID={getQuoationDetailsByID}
          onSeniorMembersUpdate={onSeniorMembersUpdate}
          seniorMembers={seniorMembers} />
      )
    case 2:
      return <QuotationDesignComponent quotationDetails={quotationDetails} updateQuotation={updateQuotation} />
    default:
      return <div>Default</div>
  }
}

function ColorlibStepIcon(props: any) {
  const classes = useColorlibStepIconStyles()
  const { active, completed } = props

  return (
    <div
      className={clsx(classes.iconRoot, {
        [classes.active]: active,
        [classes.completed]: completed
      })}
    >
      <strong>{props.icon}</strong>
    </div>
  )
}

const useColorlibStepIconStyles = makeStyles((theme: any) => ({
  iconRoot: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  active: {
    backgroundColor: theme?.palette?.primary?.main || '#D80E51',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
  },
  completed: {
    backgroundColor: theme?.palette?.primary?.light || '#D80E51',
    border: `2px solid ${theme?.palette?.primary?.light || '#D80E51'}`,
    color: theme?.palette?.common?.white
  }
}))

const steps = getSteps()

function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()
    const params = useParams()

    return <Component {...props} router={router} params={params} />
  }
}

class QuotationFormComponent extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      activeStep: 0,
      quotationDetails: {},
      openSnackbar: false,
      snackbarMsg: '',
      alertType: '',
      seniorMembers: []
    }
  }

  componentDidMount() {
    if (localStorage.getItem('quotationId')) {
      localStorage.removeItem('quotationId')
    }

    if (this.props.params.quotationId) {
      localStorage.setItem('quotationId', this.props.params.quotationId)
      quotationService.getQuoationDetailsByID(this.props.params.quotationId).subscribe(res => {
        this.setState({
          ...this.state,
          quotationDetails: res
        })
      })
    }
  }

  componentWillUnmount() {
    if (localStorage.getItem('quotationId')) {
      localStorage.removeItem('quotationId')
      localStorage.removeItem('prospectID')
      localStorage.removeItem('proposerid')
    }
  }

  navigateToList = () => {
    this.props.router.push(`/quotations?mode=viewList`)
  }

  getQuoationDetailsByID = () => {
    const quotationId: any = localStorage.getItem('quotationId')

    quotationService.getQuoationDetailsByID(quotationId).subscribe(res => {
      this.setState({ quotationDetails: res })
    })
  }

  handleSeniorMembersChange = (members: any[]) => {
    this.setState({ seniorMembers: members });
  }

  handleNext = () => {
    if (this.state.activeStep > 1) {
      this.navigateToList()
    } else {
      if (this.state.activeStep === 1) {
        console.log(".......", this.state.seniorMembers)
        const quotationId: any = localStorage.getItem('quotationId')
        quotationService.getQuoationDetailsByID(quotationId).subscribe(res => {
          this.setState({ quotationDetails: res })
          if (res == 'INPROGRESS') {
            this.toggleSnackbar(true, 'warning', 'Member Uploading, Please Wait!')
            return;
          }
          if (res == 'COMPLETED') {
            this.toggleSnackbar(true, 'warning', 'Please Upload Member From Member Tab')
            return;
          } else {
            this.setState({
              ...this.state,
              activeStep: this.state.activeStep + 1
            })
          }
        })
      } else {
        this.setState({
          ...this.state,
          activeStep: this.state.activeStep + 1
        })
      }
    }
  }

  handleBack = () => {
    this.setState({
      ...this.state,
      activeStep: this.state.activeStep - 1
    })
  }

  handleReset = () => {
    this.setState({
      ...this.state,
      activeStep: 0
    })
  }

  updateQuotation = (o: any, changeType = '') => {
    this.setState({
      ...this.state,
      quotationDetails: { ...o, changeType }
    })
  }

  toggleSnackbar = (
    status: any,
    alertType = this.state.alertType || 'success',
    snackbarMsg = this.state.snackbarMsg || 'Success'
  ) => {
    this.setState({
      ...this.state,
      openSnackbar: status,
      alertType,
      snackbarMsg
    })
  }

  render() {
    const { classes } = this.props
    const { activeStep, quotationDetails, openSnackbar, snackbarMsg, alertType } = this.state

    return (
      <div className={classes.quotationFormRoot}>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => this.toggleSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => this.toggleSnackbar(false)} severity={alertType} variant='filled'>
            <AlertTitle>{alertType}</AlertTitle>
            {snackbarMsg}
          </Alert>
        </Snackbar>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              connector={<ColorlibConnector />}
              className={classes.labelContainer}
            >
              {steps.map(label => {
                return (
                  <Step key={label}>
                    <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                  </Step>
                )
              })}
            </Stepper>
            <div className={classes.stepperContent}>
              {activeStep === steps.length ? (
                <div className={classes.steperAction}>
                  <Typography className={classes.instructions}>All steps completed</Typography>
                  <Button onClick={this.handleReset}>Reset</Button>
                </div>
              ) : (
                <div>
                  <div className={classes.instructions}>
                    {getStepContent(
                      activeStep,
                      this.handleNext,
                      quotationDetails,
                      this.updateQuotation,
                      this.getQuoationDetailsByID,
                      this.handleSeniorMembersChange,
                      this.state.seniorMembers
                    )}
                  </div>
                  <div className={classes.steperAction}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                      className={`p-button-text ${classes.backButton}`}
                    >
                      Back
                    </Button>
                    <Button color='primary' onClick={this.handleNext}>
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }
}
export default withRouter(withStyles(useStyles)(QuotationFormComponent))
