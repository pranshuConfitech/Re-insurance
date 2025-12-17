import React from 'react'

import { useParams, useRouter } from 'next/navigation'

import { Button } from 'primereact/button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import Autocomplete from '@mui/lab/Autocomplete'
import { withStyles } from '@mui/styles'
import { Formik } from 'formik'

// import ChipInput from 'material-ui-chip-input';
import * as Yup from 'yup'

import Chip from '@mui/material/Chip'

import {
  BenefitService,
  ParameterComparisonTypeService,
  ParameterDataTypeService,
  ParameterRenderTypeService,
  ParametersService
} from '@/services/remote-api/api/master-services'
import { defaultPageRequest } from '@/services/remote-api/models/page.request'

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' />

const paramRenderTypeService = new ParameterRenderTypeService()
const paramDataTypeService = new ParameterDataTypeService()
const paramComparisonTypeService = new ParameterComparisonTypeService()
const parametersService = new ParametersService()
const benefitService = new BenefitService()

const paramRenderType$ = paramRenderTypeService.getParameterRenderTypes()
const paramDataType$ = paramDataTypeService.getParameterDataTypes()
const paramComparisonTypeService$ = paramComparisonTypeService.getParameterComparisonTypes()

const pageRequest = { ...defaultPageRequest }

pageRequest.size = 100000
const benefitService$ = benefitService.getAllBenefit(pageRequest)

// const useStyles = (theme:any) => ({
//   root: {
//     padding: 20,
//     '& .MuiFormLabel-asterisk.MuiInputLabel-asterisk': {
//       color: 'red',
//     },
//   },
//   formControl: {
//     minWidth: 182,
//   },
//   chipInputList: {
//     '& .chipItem': {
//       color: 'rgba(0, 0, 0, 0.87)',
//       border: 'none',
//       height: 32,
//       display: 'inline-flex',
//       outline: 'none',
//       padding: 0,
//       fontSize: '0.8125rem',
//       boxSizing: 'border-box',
//       transition:
//         'background - color 300ms cubic - bezier(0.4, 0, 0.2, 1) 0ms, box - shadow 300ms cubic - bezier(0.4, 0, 0.2, 1) 0ms',
//       alignItems: 'center',
//       fontFamily: '"Roboto", "Helvetica", "Arial", sans - serif',
//       whiteSpace: 'nowrap',
//       borderRadius: 16,
//       verticalAlign: 'middle',
//       justifyContent: 'center',
//       textDecoration: 'none',
//       backgroundColor: '#e0e0e0',
//       margin: '0 8px 8px 0',
//     },
//   },
//   formGroupOuter: {
//     flexWrap: 'nowrap',
//     '& .pctlabel': {
//       flexDirection: 'row',
//       marginBottom: 0,
//     },
//   },
//   benefitAutoComplete: {
//     width: 280,
//     '& .MuiInputBase-formControl': {
//       maxHeight: 200,
//       overflowX: 'hidden',
//       overflowY: 'auto',
//     },
//   },
// });
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
  id: '',
  name: '',
  paramterComparisonTypeIds: [],
  paramterDataTypeId: '',
  paramterUiRenderTypeId: '',
  internalName: 'Random',
  type: true,
  isEligibleForProduct: true,
  isEligibleForPremium: true,
  parameterValues: [],
  paramterComparisonTypeNames: [],
  paramterDataTypeName: '',
  paramterUiRenderTypeName: '',
  start: '',
  end: '',
  count: '',
  benefits: []
}

const parameterSchema = Yup.object().shape(
  {
    name: Yup.string().required('Parameter name is required'),
    paramterUiRenderTypeId: Yup.string().required('Parameter type is required'),
    paramterDataTypeId: Yup.string().when('paramterUiRenderTypeId', (paramterUiRenderTypeId: any, schema: any) =>
      paramterUiRenderTypeId === '847343507192987648' ? schema.required('Parameter datatype is required') : schema
    ),
    parameterValues: Yup.array().when('paramterUiRenderTypeId', (paramterUiRenderTypeId: any, schema: any) =>
      paramterUiRenderTypeId === '847343672402427904' ? schema.min(1, 'Parameter values are required') : schema
    ),
    paramterComparisonTypeIds: Yup.array().min(1, 'Parameter comparison type required'),
    isEligibleForProduct: Yup.boolean().when('isEligibleForPremium', (isEligibleForPremium, schema) =>
      !isEligibleForPremium ? schema.oneOf([true], 'Select Product or Premium or both') : schema
    ),
    isEligibleForPremium: Yup.boolean().when('isEligibleForProduct', (isEligibleForProduct, schema) =>
      !isEligibleForProduct ? schema.oneOf([true], 'Select Product or Premium or both') : schema
    )
  },
  [['isEligibleForProduct', 'isEligibleForPremium']]
)

function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()
    const params = useParams()

    console.log(params)

    return <Component {...props} router={router} params={params} />
  }
}

class ParameterFormComponent extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.state = {
      parameterForm: { ...initForm },
      parameterUIRenderType: [],
      parameterDataType: [],
      parameterComparisonTypeList: [],
      benefitList: []
    }
  }

  componentDidMount() {
    paramRenderType$.subscribe(response => {
      this.setState({
        ...this.state,
        parameterUIRenderType: response.content
      })
    })
    paramDataType$.subscribe(response => {
      this.setState({
        ...this.state,
        parameterDataType: response.content
      })
    })
    paramComparisonTypeService$.subscribe(response => {
      this.setState({
        ...this.state,
        parameterComparisonTypeList: response.content.map(r => ({ ...r, checked: false }))
      })
    })
    benefitService$.subscribe(response => {
      this.setState({
        ...this.state,
        benefitList: response.content.map(({ id, name }) => ({ id, name }))
      })
    })

    if (this.props.params.parameterId) {
      parametersService.getParameterDetailsById(this.props.params.parameterId).subscribe((resp: any) => {
        this.setState({
          ...this.state,
          parameterForm: {
            ...this.state.parameterForm,
            ...resp,
            benefits: resp.benefits ? resp.benefits.map(({ id, name }: { id: any; name: any }) => ({ id, name })) : [],
            paramterUiRenderTypeId: resp.paramterUiRenderType.id,
            paramterComparisonTypeIds: resp.paramterComparisonTypes.map((item: any) => item.id),
            ...(resp.paramterDataType && { paramterDataTypeId: resp.paramterDataType.id })
          },
          parameterComparisonTypeList: this.state.parameterComparisonTypeList.map((item: any) => {
            return {
              ...item,
              checked: resp.paramterComparisonTypes.some((r: any) => r.id === item.id)
            }
          })
        })
      })
    }
  }

  handleChange = (event: any) => {
    const { name, value } = event.target

    this.setState({
      ...this.state,
      parameterForm: {
        ...this.state.parameterForm,
        [name]: value
      }
    })
  }

  resetForm = () => {
    this.setState({
      ...this.state,
      parameterForm: initForm,
      parameterComparisonTypeList: this.state.parameterComparisonTypeList.map((p: any) => ({ ...p, checked: false }))
    })
  }

  handleClose = () => {
    this.props.router.push('/masters/parameters')
  }

  render() {
    const { classes } = this.props

    const { parameterUIRenderType, parameterDataType, parameterComparisonTypeList, parameterForm, benefitList } =
      this.state
    return (
      <div>
        <Typography variant='h6' gutterBottom>
          Parameter Management: {this.props.params.parameterId ? 'Edit' : 'Add'}
        </Typography>
        <Paper elevation={0}>
          <div className={classes.root}>
            <Formik
              enableReinitialize={true}
              initialValues={{ ...this.state.parameterForm }}
              validationSchema={parameterSchema}
              onSubmit={(values, { resetForm }) => {
                const payload = {
                  ...initForm,
                  ...values,
                  benefitIds: values.benefits.map((item: any) => item.id)
                }
                console.log("123456", values)

                if (this.props.params.parameterId) {
                  parametersService.updateParameter(payload, this.props.params.parameterId).subscribe(res => {
                    if (res.status) {
                      this.handleClose()
                    }
                  })
                } else {
                  parametersService.saveParameter(payload).subscribe(res => {
                    if (res.status) {
                      this.resetForm()
                      resetForm()
                    }
                  })
                }
              }}
            >
              {({ touched, errors, handleSubmit, handleChange, values, setFieldValue }) => {
                const allSelected = benefitList.length > 0 && values.benefits.length === benefitList.length

                const handleAddChip = (chip: any) => {
                  setFieldValue('parameterValues', [...values.parameterValues, chip])
                }

                const handleDeleteChip = (chip: any, index: number) => {
                  const chipValues = [...values.parameterValues]

                  chipValues.splice(index, 1)

                  setFieldValue('parameterValues', chipValues)
                }

                const handleComparisonTypeChange = (event: any, idx: number) => {
                  const pclist = [...parameterComparisonTypeList]

                  pclist[idx].checked = event.target.checked
                  this.setState({
                    ...this.state,
                    parameterComparisonTypeList: [...pclist]
                  })
                  setFieldValue(
                    'paramterComparisonTypeIds',
                    pclist.filter(item => item.checked).map(item => item.id)
                  )
                }

                const handleBenefitChange = (e: any, val: any) => {
                  let selectedBenefits = val
                  const isSelecAll = selectedBenefits.some((item: any) => item.id === 'selectall')

                  if (isSelecAll) {
                    if (benefitList.length > 0 && benefitList.length === values.benefits.length) {
                      selectedBenefits = []
                    } else {
                      selectedBenefits = benefitList
                    }
                  }

                  setFieldValue('benefits', selectedBenefits)
                }

                const autocompleteFilterChange = (options: any, state: any) => {
                  if (state.inputValue) {
                    return options.filter((item: any) => item.name.toLowerCase().indexOf(state.inputValue) > -1)
                  }

                  return [{ id: 'selectall', name: 'Select all' }, ...options]
                }

                const getParameterTypeByID = (id: any) => {
                  if (!id) return

                  return parameterUIRenderType.filter((item: any) => item.id === id)[0]?.type
                }

                const handleTypeChange = (name: any, e: any) => {
                  setFieldValue(name, e.target.checked)

                  if (name == 'type' && e.target.checked) {
                    setFieldValue('isEligibleForProduct', true)
                    setFieldValue('isEligibleForPremium', true)
                  }
                }

                return (
                  <form onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={7}>
                      <Grid item xs={12} container spacing={1}>
                        <Grid item xs={12} sm={6} sx={{ mb: 2 }}>
                          <TextField
                            name='name'
                            label='Parameter Name'
                            value={values.name}
                            onChange={handleChange}
                            required
                            error={touched.name && Boolean(errors.name)}

                          // helperText={touched.name && errors.name}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            className={classes.formControl}
                            required
                            error={touched.paramterUiRenderTypeId && Boolean(errors.paramterUiRenderTypeId)}

                          // helperText={touched.paramterUiRenderTypeId && errors.paramterUiRenderTypeId}
                          >
                            <InputLabel id='parameter-type-label'>Parameter Type</InputLabel>
                            <Select
                              labelId='parameter-type-label'
                              label='Parameter Type'
                              name='paramterUiRenderTypeId'
                              value={values.paramterUiRenderTypeId}
                              onChange={handleChange}

                            // MenuProps={{
                            //   anchorOrigin: {
                            //     vertical: 'bottom',
                            //     horizontal: 'left'
                            //   }
                            // }}
                            >
                              {parameterUIRenderType.map((paramType: any) => (
                                <MenuItem key={paramType.id} value={paramType.id}>
                                  {paramType.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {touched.paramterUiRenderTypeId && Boolean(errors.paramterUiRenderTypeId) && (
                              <FormHelperText>
                                {touched.paramterUiRenderTypeId && typeof errors.paramterUiRenderTypeId === 'string'
                                  ? errors.paramterUiRenderTypeId
                                  : ''}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>

                        {(() => {
                          switch (getParameterTypeByID(values.paramterUiRenderTypeId)) {
                            case 'textbox':
                              return (
                                <Grid item xs={2}>
                                  <FormControl
                                    className={classes.formControl}
                                    required
                                    error={touched.paramterDataTypeId && Boolean(errors.paramterDataTypeId)}
                                  >
                                    <InputLabel id='text-datatype-label'>Datatype</InputLabel>
                                    <Select
                                      labelId='text-datatype-label'
                                      name='paramterDataTypeId'
                                      label='Datatype'
                                      value={values.paramterDataTypeId}
                                      onChange={handleChange}

                                    // MenuProps={{
                                    //   anchorOrigin: {
                                    //     vertical: 'bottom',
                                    //     horizontal: 'left'
                                    //   }
                                    // }}
                                    >
                                      {parameterDataType.map((paramType: any) => (
                                        <MenuItem key={paramType.id} value={paramType.id}>
                                          {paramType.name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    {touched.paramterDataTypeId && Boolean(errors.paramterDataTypeId) && (
                                      <FormHelperText>
                                        {touched.paramterUiRenderTypeId && typeof errors.paramterDataTypeId === 'string'
                                          ? errors.paramterDataTypeId
                                          : ''}
                                      </FormHelperText>
                                    )}
                                  </FormControl>
                                </Grid>
                              )
                            case 'dropdown':
                              return (
                                <Grid item xs={2}>
                                  {/* <ChipInput
                                    required
                                    error={touched.parameterValues && Boolean(errors.parameterValues)}
                                    helperText={touched.parameterValues && errors.parameterValues}
                                    label="Values"
                                    value={values.parameterValues}
                                    onAdd={(chip:any) => handleAddChip(chip)}
                                    onDelete={(chip:any, index:any) => handleDeleteChip(chip, index)}
                                  /> */}
                                  <Autocomplete
                                    multiple
                                    freeSolo
                                    options={[]}
                                    value={values.parameterValues}
                                    onChange={(event, newValue) => setFieldValue('parameterValues', newValue)}
                                    renderTags={(value, getTagProps) =>
                                      value.map((option: any, index: number) => {
                                        const { key, ...tagProps } = getTagProps({ index }) // Extract key explicitly

                                        return <Chip key={key} label={option} {...tagProps} />
                                      })
                                    }
                                    renderInput={params => <TextField required {...params} label='Values' />}
                                  />
                                  {/* <Select
                                    labelId='Values'
                                    multiple
                                    required
                                    error={touched.parameterValues && Boolean(errors.parameterValues)}
                                    value={values.parameterValues}
                                    onChange={(event: any) => handleAddChip(event.target.value)}
                                    renderValue={selected => (
                                      <div style={{ marginRight: '1%', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {(selected as string[]).map((value, index) => (
                                          <Chip
                                            key={value}
                                            label={value}
                                            onDelete={() => handleDeleteChip(value, index)}
                                          />
                                        ))}
                                      </div>
                                    )}
                                  >
                                    {values.parameterValues.map((value: any, index: number) => (
                                      <MenuItem key={value} value={value}>
                                        {value}
                                      </MenuItem>
                                    ))}
                                  </Select> */}
                                  <p style={{ fontSize: '12px', color: 'red' }}>
                                    *After entering value please press enter
                                  </p>
                                </Grid>
                              )
                            case 'textarea':
                              return (
                                <Grid item xs={2}>
                                  <TextField rows='2' multiline />
                                </Grid>
                              )
                            case 'dropdown_range':
                              return (
                                <Grid item xs={6} style={{ display: 'flex', justifyContent: 'space-around' }}>
                                  <TextField
                                    name='start'
                                    type='number'
                                    label='Start'
                                    value={values.start}
                                    onChange={handleChange}
                                    style={{ marginRight: '10px' }}
                                  />
                                  <TextField
                                    name='end'
                                    type='number'
                                    label='End'
                                    value={values.end}
                                    onChange={handleChange}
                                    style={{ marginRight: '10px' }}
                                  />
                                  <TextField
                                    name='count'
                                    type='number'
                                    label='Count'
                                    value={values.count}
                                    onChange={handleChange}
                                    style={{ marginRight: '10px' }}
                                  />
                                </Grid>
                              )
                            default:
                              return
                          }
                        })()}
                      </Grid>
                      <Grid item xs={12} container spacing={1}>
                        <Grid item xs={12} md={6}>
                          <FormControl
                            className={classes.formGroupOuter}
                            required
                            error={touched.paramterComparisonTypeIds && Boolean(errors.paramterComparisonTypeIds)}
                          >
                            <FormLabel component='legend'>Parameter Comparison Type</FormLabel>
                            <Grid container spacing={1}>
                              {parameterComparisonTypeList.map((pct: any, idx: any) => (
                                <Grid item xs={3} key={idx}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={pct.checked}
                                        onChange={e => handleComparisonTypeChange(e, idx)}
                                        value={pct.id}
                                        name={pct.name}
                                        color='primary'
                                      />
                                    }
                                    label={pct.symbol}
                                    labelPlacement='end'
                                    className='pctlabel'
                                  />
                                </Grid>
                              ))}
                            </Grid>
                            {touched.paramterComparisonTypeIds && Boolean(errors.paramterComparisonTypeIds) && (
                              <FormHelperText>
                                {touched.paramterComparisonTypeIds &&
                                  typeof errors.paramterComparisonTypeIds === 'string'
                                  ? errors.paramterComparisonTypeIds
                                  : ''}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Autocomplete
                            className={classes.benefitAutoComplete}
                            fullWidth
                            multiple
                            value={values.benefits}
                            onChange={handleBenefitChange}
                            id='checkboxes-tags-demo'
                            filterOptions={autocompleteFilterChange}
                            options={benefitList}
                            disableCloseOnSelect
                            getOptionLabel={option => option?.name || ''}
                            isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                            renderOption={(props: any, option: any, { selected }) => {
                              const selectedOpt = (option.id === 'selectall' && allSelected) || selected
                              const { key, ...restProps } = props

                              return (
                                <li key={option.id} {...restProps}>
                                  <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{ marginRight: 8, color: '#626bda' }}
                                    checked={selectedOpt}
                                  />
                                  {option.name}
                                </li>
                              )
                            }}
                            renderInput={params => (
                              <TextField {...params} label='Benefit' placeholder='Select Benefit' />
                            )}
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12} container spacing={1}>
                        <Grid item xs={12}>
                          <FormLabel component='legend'>Parameter Eligible For</FormLabel>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.type}
                                onChange={e => handleTypeChange('type', e)}
                                name='type'
                                color='primary'
                              />
                            }
                            label='Product & Premium'
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Grid item xs={12} container spacing={1}>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={values.isEligibleForProduct}
                                    onChange={e => handleTypeChange('isEligibleForProduct', e)}
                                    name='isEligibleForProduct'
                                    color='primary'
                                  />
                                }
                                label='Product'
                                disabled={values.type}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={values.isEligibleForPremium}
                                    onChange={e => handleTypeChange('isEligibleForPremium', e)}
                                    name='isEligibleForPremium'
                                    color='primary'
                                  />
                                }
                                label='Premium'
                                disabled={values.type}
                              />
                            </Grid>
                          </Grid>
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

export default withRouter(withStyles(useStyles)(ParameterFormComponent))
