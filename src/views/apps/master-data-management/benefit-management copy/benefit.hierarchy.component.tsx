import React from 'react'

import { useParams, useRouter } from 'next/navigation'

import { Button } from 'primereact/button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import { withStyles } from '@mui/styles'
import { Formik } from 'formik'
import * as Yup from 'yup'

import { BenefitStructureService } from '@/services/remote-api/api/benefit-structure-services'
import { BenefitService } from '@/services/remote-api/api/master-services'
import { defaultPageRequest } from '@/services/remote-api/models/page.request'
import { FettleBenefitGraph } from '../../shared-component/components/fettle.benefit.graph'
import Asterisk from '../../shared-component/components/red-asterisk'
import { Box } from '@mui/material'

const benefitService = new BenefitService()
const benefitStructureService = new BenefitStructureService()

const pageRequest = { ...defaultPageRequest }

pageRequest.size = 100000
const benefitService$ = benefitService.getAllBenefit(pageRequest)

const useStyles = (theme: any) => ({})

const hierarchySchema = Yup.object().shape({
  hierarchyName: Yup.string()
    .matches(/^[a-zA-Z0-9]*$/, 'Only letters and numbers are allowed')
    .required('Hierarchy name is required')
})

function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()
    const params = useParams()

    // console.log(params);

    return <Component {...props} router={router} params={params} />
  }
}

class BenifitHierarchyComponent extends React.Component<any, any> {
  hierarchyData: any
  constructor(props: any) {
    super(props)

    this.state = { hierarchyName: '', hierarchy: null, benefitStructureStatus: '' }
    this.hierarchyData = {}
  }

  componentDidMount = () => {
    if (this.props.params.hierarchyId) {
      benefitStructureService.getBenefitStructuresById(this.props.params.hierarchyId).subscribe((resp: any) => {
        console.log("resp", resp)
        if (resp.status === 200) {
          this.setState({
            ...this.state,
            hierarchyName: resp.data.description,
            benefitStructureStatus: resp.data.benefitStructureStatus,
            hierarchy: resp.data.hirearchy
          })
          this.hierarchyData = resp.data.hirearchy
        }
      })
    }
  }

  datasource = () => benefitService$

  graphOnchange = (data: any) => {
    this.hierarchyData = data
  }

  handleSave: any = (values: any) => {
    if (Object.keys(this.hierarchyData).length) {
      const payload = {
        id: this.props.params.hierarchyId,
        description: values.hierarchyName,
        hirearchy: this.hierarchyData
      }

      if (this.props.params.hierarchyId) {
        return benefitStructureService.updateBenefitStructures(payload, this.props.params.hierarchyId)
      } else {
        return benefitStructureService.saveBenefitStructures(payload)
      }
    } else {
      alert('Create hierarchy first')
    }
  }

  navigateToList = () => {
    this.props.router.push('/masters/benefit-hierarchy?mode=viewList')
  }

  render() {
    return (
      <div>
        {/*  <Typography variant="h6" gutterBottom>Benifit Management: Benefit Hierarchy</Typography> */}
        <Paper elevation={0}>
          <Box style={{ border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '4px' }}>
            <FettleBenefitGraph
              benefitDataSource$={this.datasource}
              onChange={this.graphOnchange}
              benefit={this.state.hierarchy}
              readOnly={this.state.benefitStructureStatus === 'APPROVED'}
            />
          </Box>

          <Formik
            enableReinitialize={true}
            initialValues={{
              hierarchyName: this.state.hierarchyName,
              benefitStructureStatus: this.state.benefitStructureStatus
            }}
            validationSchema={hierarchySchema}
            onSubmit={(values: any, { resetForm }) => {
              this.handleSave(values).subscribe((resp: any) => {
                this.setState({ ...this.state, hierarchy: null })
                resetForm()
                this.navigateToList()
              })
            }}
          >
            {({ touched, errors, handleSubmit, handleChange, values }) => {

              return (
                <form onSubmit={handleSubmit} noValidate>
                  <Grid container style={{ padding: '8px' }}>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}
                    >
                      <TextField
                        name='hierarchyName'
                        label={
                          <span>
                            Hierarchy Name <Asterisk />
                          </span>
                        }
                        value={values.hierarchyName}
                        onChange={handleChange}
                        // required
                        onInput={(e: any) => {
                          e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')
                        }}
                        fullWidth
                        disabled={values.benefitStructureStatus === 'APPROVED'}
                        error={touched.hierarchyName && Boolean(errors.hierarchyName)}

                      // helperText={touched.hierarchyName && errors.hierarchyName}
                      />
                    </Grid>
                    <Grid
                      item
                      xs
                      style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', paddingTop: '8px' }}
                    >
                      <Button
                        type='submit'
                        color='primary'
                        disabled={
                          !!(
                            this.hierarchyData &&
                            Object.keys(this.hierarchyData).length > 0 &&
                            values?.benefitStructureStatus === 'APPROVED'
                          )
                        }

                      // style={{
                      //   color: 'inherit',
                      //   marginRight: '8px',
                      //   boxShadow:
                      //     '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
                      //   padding: '6px 16px',
                      //   borderRadius: 4,
                      // }}
                      >
                        Save
                      </Button>
                      <Button
                        className='p-button-text'
                        onClick={this.navigateToList}

                      // style={{
                      //   color: 'inherit',
                      //   boxShadow:
                      //     '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
                      //   padding: '6px 16px',
                      //   borderRadius: 4,
                      // }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              )
            }}
          </Formik>
        </Paper>
      </div>
    )
  }
}
export default withRouter(withStyles(useStyles)(BenifitHierarchyComponent))
