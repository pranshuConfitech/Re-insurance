
import React from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Grid from '@mui/material/Grid'
import Step from '@mui/material/Step'
import StepConnector from '@mui/material/StepConnector'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import { createStyles, makeStyles, withStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import clsx from 'clsx'
import '../styles.css'
import { Button } from 'primereact/button'

import ProductBasicDetailsComponent from './basic-details/product-basic-details.component'
import BenifitDesignComponent from './product-rule-design/benifit-design.component'
import PreviewComponent from './preview/preview.component'
import ServiceDesignComponent from './service-design/service.design.component'
import { ProductService } from '@/services/remote-api/api/product-services/product.service'

const productservice = new ProductService()

const useStyles = (theme: any) =>
  createStyles({
    prodManageRoot: {
      flexGrow: 1
    },
    paper: {
      padding: theme?.spacing ? theme.spacing(2) : '8px',
      textAlign: 'center',
      color: theme?.palette?.text?.primary || '#D80E51'
    },
    labelContainer: {
      borderRadius: 4

      // boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%) !important',
    },
    stepperContent: {
      borderRadius: 4,
      backgroundColor: 'inherit',
      margin: '15px 0'

      // boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    },
    steperAction: {
      textAlign: 'right',
      padding: '20px 14px',
      paddingTop: 0
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
    backgroundColor: theme?.palette?.primary?.light || '#D80E51',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    color: theme?.palette?.primary?.contrastText
  },
  completed: {
    backgroundColor: theme?.palette?.primary?.main || '#D80E51',
    border: `2px solid ${theme?.palette?.primary?.main || '#D80E51'}`,
    color: 'rgba(255,255,255,.7)'
  }
}))

function getSteps() {
  return ['Basic Details', 'Benefit Design', 'Service Design', 'Preview and Save']
}

function getStepContent(this: any,
  step: any,
  handleNext: () => void,
  productDetails: any,
  benefitStructure: any = [],
  updateBasiDetailsFnc: (details: any) => void,
  updateBenefitStructureFnc: (structure: any) => void,
  updateServiceDesignDetailsFnc: (details: any) => void,
  refetch: any
) {
  switch (parseInt(step)) {
    case 0:
      return (
        <ProductBasicDetailsComponent
          handleNextStep={handleNext}
          productDetails={productDetails}
          updateBasiDetails={updateBasiDetailsFnc}
        />
      )
    case 1:
      return (
        <BenifitDesignComponent
          handleNextStep={handleNext}
          productDetails={productDetails}
          updateBenefitStructureFnc={updateBenefitStructureFnc}
          refetch={refetch}
        />
      )
    case 2:
      return (
        <ServiceDesignComponent
          productDetails={productDetails}
          handleNextStep={handleNext}
          benefitStructure={benefitStructure}
          updateServiceDesignDetails={updateServiceDesignDetailsFnc}
        />
      )
    case 3:
      return <PreviewComponent productDetails={productDetails} />

    default:
      return null
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

const steps = getSteps()

function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()
    const params = useParams()
    const query = useSearchParams()

    return <Component {...props} router={router} params={params} query={Object.fromEntries(query)} />
  }
}

class ProductManagementForm extends React.Component<any, any> {
  query: any = this.props.query

  // let query = this.props.query;
  constructor(props: any) {
    super(props)

    this.state = {
      activeStep: this.getCurrentStep(),
      productDetails: {},
      benefitStructure: []
    }
  }
  getCurrentStep = () => {
    const query = this.props.query

    return query?.step ? parseInt(query.step) : 0
  }

  // useQuery() {
  //   return new URLSearchParams(this.props.location.search);
  // }
  componentDidUpdate(prevProps: any) {
    if (prevProps.query.step !== this.props.query.step) {
      this.setState({ activeStep: this.getCurrentStep() })
    }
  }

  componentDidMount() {
    if (localStorage.getItem('productId')) {
      localStorage.removeItem('productId')
    }

    if (this.props.params.productId) {
      localStorage.setItem('productId', this.props.params.productId)
      productservice.getProductDetails(this.props.params.productId).subscribe(res => {
        // let step = useSearchParams().get('step');
        // if (step == null || step == undefined || isNaN(step) || !(step >= 0 && step < steps.length - 1)) {
        //   step = 0;
        // }

        this.setState({
          ...this.state,
          productDetails: res,
          activeStep: this.getCurrentStep()
        })
      })
    }
  }

  refetch = () => {
    const productId = this.props.params.productId || localStorage.getItem('productId');
    if (productId) {
      productservice.getProductDetails(productId).subscribe(res => {
        this.setState({
          ...this.state,
          productDetails: res
        });
      });
    }
  };

  handleNext = () => {
    const nextStep = this.state.activeStep + 1
    const { router } = this.props

    this.setState({
      ...this.state,
      activeStep: nextStep
    })
    router.replace(`/products/${localStorage.getItem('productId')}?mode=edit&step=${nextStep}`)
  }

  handleBack = () => {
    const { router } = this.props
    const prevStep = this.state.activeStep - 1

    this.setState({
      ...this.state,
      activeStep: prevStep
    })
    router.replace(`/products/${localStorage.getItem('productId')}?mode=edit&step=${prevStep}`)
  }

  handleReset = () => {
    this.setState({
      ...this.state,
      activeStep: 0
    })
  }

  updateBasiDetailsFnc = (basicDetails: any) => {
    this.setState({
      ...this.state,
      productDetails: {
        ...this.state.productDetails,
        productBasicDetails: {
          productBasicDetails: this.state.productDetails.productBasicDetails,
          ...basicDetails.productBasicDetailsForm
        }
      }
    })
  }

  updateBenefitStructureFnc = (structureObj: any) => {
    this.setState({
      ...this.state,
      benefitStructure: structureObj
    })
  }

  updateServiceDesignDetailsFnc = (serviceDesignDetails: any) => {
    this.setState({
      ...this.state,
      productDetails: {
        ...this.state.productDetails,
        productServices: {
          services: [...serviceDesignDetails]
        }
      }
    })
  }

  render() {
    const { classes } = this.props

    const { activeStep, productDetails, benefitStructure } = this.state

    return (
      <div className={classes.prodManageRoot}>
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
                  <Typography component={'span'} className={classes.instructions}>
                    {getStepContent(
                      activeStep,
                      this.handleNext,
                      productDetails,
                      benefitStructure,
                      this.updateBasiDetailsFnc,
                      this.updateBenefitStructureFnc,
                      this.updateServiceDesignDetailsFnc,
                      this.refetch
                    )}
                  </Typography>
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
export default withRouter(withStyles(useStyles)(ProductManagementForm))
