import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { withStyles } from '@mui/styles'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
  IndustryService,
} from '@/services/remote-api/api/master-services'
import { defaultPageRequest } from '@/services/remote-api/models/page.request'

const industryService = new IndustryService()

const pageRequest = { ...defaultPageRequest }

pageRequest.size = 100000

const useStyles = (theme: any) => ({
  root: {
    padding: 20,
    '& .MuiFormLabel-asterisk.MuiInputLabel-asterisk': {
      color: 'red'
    }
  },
  formControl: {
    minWidth: 182
  },
  benefitAutoComplete: {
    width: 280,
    '& .MuiInputBase-formControl': {
      maxHeight: 200,
      overflowX: 'hidden',
      overflowY: 'auto'
    }
  },
  formGroupOuter: {
    // flexWrap: 'nowrap',
    display: 'flex',
    '& .pctlabel': {
      flexDirection: 'row',
      marginBottom: 0
    }
  },
  chipInputList: {
    '& .chipItem': {
      color: 'rgba(0, 0, 0, 0.87)',
      border: 'none',
      height: 32,
      display: 'inline-flex',
      outline: 'none',
      padding: 0,
      fontSize: '0.8125rem',
      boxSizing: 'border-box',
      transition:
        'background - color 300ms cubic - bezier(0.4, 0, 0.2, 1) 0ms, box - shadow 300ms cubic - bezier(0.4, 0, 0.2, 1) 0ms',
      alignItems: 'center',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans - serif',
      whiteSpace: 'nowrap',
      borderRadius: 16,
      verticalAlign: 'middle',
      justifyContent: 'center',
      textDecoration: 'none',
      backgroundColor: '#e0e0e0',
      margin: '0 8px 8px 0'
    }
  }
})

const initForm = {
  name: '',
  code: ''
}

const industrySchema = Yup.object().shape(
  {
    name: Yup.string().required('Industry name is required'),
  },
)

function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()
    const params = useParams()

    console.log(params)

    return <Component {...props} router={router} params={params} />
  }
}

class IndustryFormComponent extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.state = {
      industryForm: { ...initForm },
    }
  }

  componentDidMount() {
    if (this.props.params.id) {
      industryService.getIndustryDetailsById(this.props.params.id).subscribe((resp: any) => {
        this.setState({
          ...this.state,
          secotrForm: {
            ...this.state.industryForm,
            ...resp,
          },
        })
      })
    }
  }

  handleChange = (event: any) => {
    const { name, value } = event.target

    this.setState({
      ...this.state,
      parameterForm: {
        ...this.state.industryForm,
        [name]: value
      }
    })
  }

  handleClose = () => {
    this.props.router.push('/masters/industries?mode=viewList')
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <Typography variant='h6' gutterBottom>
          Industry: {this.props.params.id ? 'Edit' : 'Create'}
        </Typography>
        <Paper elevation={0}>
          <div className={classes.root}>
            <Formik
              enableReinitialize={true}
              initialValues={{ ...this.state.industryForm }}
              validationSchema={industrySchema}
              onSubmit={(values) => {
                const payload = {
                  ...values,
                }
                console.log("123456", values, payload)

                if (this.props.params.id) {
                  industryService.updateIndustry(payload, this.props.params.id).subscribe(res => {
                    if (res.status) {
                      this.handleClose()
                    }
                  })
                } else {
                  industryService.saveIndustry(payload).subscribe(res => {
                    if (res.status) {
                      this.handleClose()
                    }
                  })
                }
              }}
            >
              {({ touched, errors, handleSubmit, handleChange, values }) => {

                return (
                  <form onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={7}>
                      <Grid item xs={12} container spacing={1}>
                        <Grid item xs={12} sm={6} sx={{ mb: 2 }}>
                          <TextField
                            name='name'
                            label='Industry Name'
                            value={values.name}
                            onChange={handleChange}
                            required
                            error={touched.name && Boolean(errors.name)}

                          // helperText={touched.name && errors.name}
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12} container spacing={1}>
                        <Grid item xs={12} sm={6}>
                          <Button type='submit' color='primary'>
                            Save
                          </Button>
                          <Button
                            style={{ marginLeft: 15 }}
                            onClick={() => this.handleClose()}
                            className='p-button-text'
                          >
                            Cancel
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </form>
                )
              }}
            </Formik>
          </div>
        </Paper>
      </div>
    )
  }
}

export default withRouter(withStyles(useStyles)(IndustryFormComponent))
