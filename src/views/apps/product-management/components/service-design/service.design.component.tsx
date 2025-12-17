import React from 'react'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Snackbar from '@mui/material/Snackbar'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import Alert from '@mui/lab/Alert'
import { createStyles, withStyles } from '@mui/styles'
import { forkJoin, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { FormHelperText, Paper, Autocomplete } from '@mui/material'

import { BenefitService, LimitFrequencyService, ServiceTypeService } from '@/services/remote-api/api/master-services'
import { ProductService } from '@/services/remote-api/api/product-services'
import {
  defaultPageRequestServiceGrouping,
  defaultPageRequestServices
} from '@/services/remote-api/models/page.request.service.grouping'
import ServiceDesignTable from './service-design-table'
import { FettleAutocomplete } from '@/views/apps/shared-component/components/fettle.autocomplete'

const useStyles = (theme: any) =>
  createStyles({
    serviceDesignRoot: {
      flexGrow: 1,
      minHeight: 100,
      padding: 30
    },
    header: {
      paddingTop: 10,
      paddingBottom: 10,
      color: '#4472C4'
    },
    formControl: {
      margin: theme?.spacing ? theme.spacing(1) : '8px',
      height: '65px',
      width: '100%'
    },
    serviceAutoComplete: {
      width: '100%',
      '& .MuiInputBase-formControl': {
        maxHeight: 200,
        overflowX: 'hidden',
        overflowY: 'auto'
      }
    },
    actionBlock: {
      display: 'flex',
      alignItems: 'center'
    },
    tableBg: {
      height: 400,
      width: '100%',
      backgroundColor: '#fff',
      boxShadow:
        '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
      borderRadius: '4px'
    },
    formControlWrapper: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      padding: '0 8px'
    },
    rowContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%'
    },
    fettleAutocompleteWrapper: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      '& .MuiFormControl-root': {
        width: '100%'
      },
      '& .MuiInputBase-root': {
        width: '100%'
      },
      '& .MuiAutocomplete-root': {
        width: '100%'
      },
      '& .MuiAutocomplete-input': {
        width: '100% !important'
      }
    },
    checkboxWrapper: {
      display: 'flex',
      justifyContent: 'flex-start',
      width: '100%',
      padding: '0 8px'
    }
  })

const serviceTypeService = new ServiceTypeService()
const limitFrequencyService = new LimitFrequencyService()
const productservice = new ProductService()
const benefitService = new BenefitService()

const initForm = {
  serviceTypeId: '',
  serviceTypeName: '',
  searchBy: '',
  groupId: null,
  serviceIds: [],
  serviceName: '',
  maxLimitValue: '',
  percentage: '',
  benefitId: '',
  benefitName: '',
  frequencies: [{ limitFrequencyId: '', maxLimit: '', limitFrequencyList: [] }],
  waitingPeriod: '',
  coShareOrPayPercentage: '',
  toBeExcluded: false,
  isAddOtherLimitValues: false
}

function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()
    return <Component {...props} router={router} />
  }
}

interface ServiceDesignState {
  serviceDesignForm: typeof initForm
  serviceTypes: any[]
  serviceTypeChangeDetect: boolean | string
  benefitList: any[]
  allLimitFrequencies: any[]
  limitFrequencyList: any[]
  rows: any[]
  editIndex: string
  openSnackbar: boolean
  errorMsg: {
    serviceTypeId: string
    serviceName: string
    maxLimitValue: string
    waitingPeriod: string
    coShareOrPayPercentage: string
  }
}

class ServiceDesignComponent extends React.Component<any, ServiceDesignState> {
  private isEditedId: any

  constructor(props: any) {
    super(props)

    this.state = {
      serviceDesignForm: { ...initForm },
      serviceTypes: [],
      serviceTypeChangeDetect: false,
      benefitList: [],
      allLimitFrequencies: [],
      limitFrequencyList: [],
      rows: [],
      editIndex: '',
      openSnackbar: false,
      errorMsg: {
        serviceTypeId: '',
        serviceName: '',
        maxLimitValue: '',
        waitingPeriod: '',
        coShareOrPayPercentage: ''
      }
    }
    this.isEditedId = ''
  }

  componentDidMount() {
    this.getServiceTypes()
    this.getBenefitStructure()
    this.getLimitFrequcies()
  }

  setSeviceDesignData = () => {
    productservice.getProductDetails(JSON.parse(JSON.stringify(localStorage.getItem("productId")))).subscribe((res: any) => {
      if (res?.productServices) {
        console.log("987456321", res?.productServices)
        const servicesRows = JSON.parse(JSON.stringify(res.productServices))
        if (servicesRows?.length > 0) {
          const serviceRow$ = servicesRows.map((item: any) => {
            if (item.groupId) {
              return this.groupDataSourceCallback$({}, '', defaultPageRequestServiceGrouping, item.serviceTypeId).pipe(
                switchMap((res: any) => {
                  const group = res.content?.find((g: any) => g.id === item.groupId)
                  const serviceName = group?.name || ''
                  const serviceTypeName = this.getServiceTypeName(item.serviceTypeId)
                  return of({ ...item, serviceName, serviceTypeName })
                })
              )
            } else if (item.serviceIds?.length > 0) {
              return this.servicesDataSourceCallback$({}, '', defaultPageRequestServiceGrouping, item.serviceTypeId).pipe(
                switchMap((res: any) => {
                  const serviceName = res.content
                    ?.filter((g: any) => item.serviceIds.includes(g.id))
                    ?.map((o: any) => o.name)
                    ?.join(', ') || ''
                  const serviceTypeName = this.getServiceTypeName(item.serviceTypeId)
                  return of({ ...item, serviceName, serviceTypeName })
                })
              )
            } else {
              const serviceTypeName = this.getServiceTypeName(item.serviceTypeId)
              return of({ ...item, serviceTypeName })
            }
          })
          console.log("123654", servicesRows)

          forkJoin(serviceRow$).subscribe({
            next: (res: any) => {
              this.setState(prevState => ({
                ...prevState,
                rows: res
              }))
              this.props.updateServiceDesignDetails?.(res)
            },
            error: (error) => {
              console.error('Error loading service design data:', error)
            }
          })
        }
      }
    })
  }

  getBenefitStructure = () => {
    const serviceDesignBenefitList: any[] = []

    if (this.props.benefitStructure?.length > 0) {
      this.props.benefitStructure.forEach((benefit: any) => {
        this.setBenefitList(benefit.hirearchy, serviceDesignBenefitList)
      })
    }

    this.setState(prevState => ({
      ...prevState,
      benefitList: serviceDesignBenefitList
    }))
  }

  setBenefitList = (benefit: any, serviceDesignBenefitList: any[]) => {
    if (benefit?.rules?.length > 0) {
      const coverageRules = benefit.rules.filter((rule: any) =>
        rule.ruleTextArea?.includes('Coverage')
      )

      if (coverageRules.length > 0) {
        const { name, id, code } = benefit
        serviceDesignBenefitList.push({ name, id, code })
      }
    }

    if (benefit?.child?.length > 0) {
      benefit.child.forEach((childObj: any) => {
        this.setBenefitList(childObj, serviceDesignBenefitList)
      })
    }
  }

  getServiceTypes = () => {
    const serviceTypeService$ = serviceTypeService.getServiceTypes()

    serviceTypeService$.subscribe({
      next: (response) => {
        this.setState(prevState => ({
          ...prevState,
          serviceTypes: response.content || []
        }))
        this.setSeviceDesignData()
      },
      error: (error) => {
        console.error('Error fetching service types:', error)
      }
    })
  }

  getServiceTypeName = (id: any) => {
    if (!this.state.serviceTypes?.length || !id) return ''
    const serviceType = this.state.serviceTypes.find((item: any) => item.id === id)
    return serviceType?.name || ''
  }

  getLimitFrequcies = () => {
    const limitFrequencyService$ = limitFrequencyService.getLimitFrequencies()

    limitFrequencyService$.subscribe({
      next: (response) => {
        this.setState(prevState => ({
          ...prevState,
          allLimitFrequencies: response.content || []
        }))
      },
      error: (error) => {
        console.error('Error fetching limit frequencies:', error)
      }
    })
  }

  handleChange = (e: any) => {
    const { name, value, checked } = e.target
    let freqDto: any[] = []

    if (name === 'isAddOtherLimitValues' || name === 'toBeExcluded') {
      if (name === 'isAddOtherLimitValues' && checked) {
        freqDto = [{
          limitFrequencyId: '',
          maxLimit: '',
          limitFrequencyList: this.state.allLimitFrequencies
        }]
      }

      this.setState(prevState => ({
        ...prevState,
        serviceDesignForm: {
          ...prevState.serviceDesignForm,
          [name]: checked,
          frequencies: freqDto,
          ...(name === 'toBeExcluded' && !checked && {
            isAddOtherLimitValues: false,
            waitingPeriod: '',
            coShareOrPayPercentage: '',
            maxLimitValue: '',
            percentage: '',
            benefitId: '',
            benefitName: ''
          })
        }
      }))
    } else {
      let serviceTypeName = ''
      let benefitName = ''

      if (name === 'serviceTypeId') {
        const serviceType = this.state.serviceTypes.find((service: any) => service.id === value)
        serviceTypeName = serviceType?.name || ''
      } else if (name === 'benefitId') {
        const benefit = this.state.benefitList.find((service: any) => service.id === value)
        benefitName = benefit?.name || ''
      }

      this.setState(prevState => ({
        ...prevState,
        serviceDesignForm: {
          ...prevState.serviceDesignForm,
          [name]: value,
          ...(name === 'serviceTypeId' && {
            serviceTypeName,
            groupId: null,
            serviceIds: [],
            serviceName: ''
          }),
          ...(name === 'benefitId' && { benefitName })
        },
        ...(name === 'serviceTypeId' && { serviceTypeChangeDetect: value })
      }))
    }
  }

  groupDataSourceCallback$ = (
    params = {},
    action: any,
    pageRequest = defaultPageRequestServiceGrouping,
    serviceTypeId = this.state.serviceDesignForm.serviceTypeId
  ) => {
    let reqParam = {
      ...pageRequest,
      ...params,
      nonGroupedServiceGroup: false,
      groupedServiceServiceGroup: true,
      parentEligibleServiceGroupIrrespectiveGruping: false
    }

    if (action?.searchText) {
      reqParam = {
        ...reqParam,
        groupCode: action.searchText,
        groupName: action.searchText
      }
    }

    return serviceTypeService.getServiceGroupes(serviceTypeId, reqParam)
  }

  servicesDataSourceCallback$ = (
    params = {},
    action: any,
    pageRequest = defaultPageRequestServices,
    serviceTypeId = this.state.serviceDesignForm.serviceTypeId
  ) => {
    let reqParam = { ...pageRequest, ...params }

    if (action?.searchText) {
      reqParam = {
        ...reqParam,
        nameAlias: action.searchText,
        icdCode: action.searchText,
        name: action.searchText
      }
    }

    return serviceTypeService.getServices(serviceTypeId, '', reqParam)
  }

  handleServiceAutocompleteChange = (e: any, newValue: any, name: string) => {
    if (newValue && Array.isArray(newValue)) {
      this.setState(prevState => ({
        ...prevState,
        serviceDesignForm: {
          ...prevState.serviceDesignForm,
          [name]: newValue.map(o => o.id),
          serviceName: newValue.map(o => o.name).join(', ')
        }
      }))
    } else {
      this.setState(prevState => ({
        ...prevState,
        serviceDesignForm: {
          ...prevState.serviceDesignForm,
          [name]: newValue ? newValue.id : '',
          serviceName: newValue ? newValue.code || newValue.name : ''
        }
      }))
    }
  }

  handleAddMore = () => {
    const { frequencies } = this.state.serviceDesignForm
    const { allLimitFrequencies } = this.state

    const usedFrequencyIds = frequencies.map((freq: any) => freq.limitFrequencyId).filter(Boolean)
    const availableFrequencies = allLimitFrequencies.filter((freq: any) =>
      !usedFrequencyIds.includes(freq.id)
    )

    this.setState((prevState: any) => ({
      ...prevState,
      serviceDesignForm: {
        ...prevState.serviceDesignForm,
        frequencies: [
          ...prevState.serviceDesignForm.frequencies,
          {
            limitFrequencyId: '',
            maxLimit: '',
            limitFrequencyList: availableFrequencies
          }
        ]
      }
    }))
  }

  handleRemoveRow = (idx: number) => {
    this.setState(prevState => {
      const updatedFrequencies = [...prevState.serviceDesignForm.frequencies]
      updatedFrequencies.splice(idx, 1)

      // Rebuild frequency lists for remaining rows
      const usedFrequencyIds = updatedFrequencies.map(freq => freq.limitFrequencyId).filter(Boolean)
      const updatedFrequenciesWithLists = updatedFrequencies.map((item: any) => ({
        ...item,
        limitFrequencyList: prevState.allLimitFrequencies.filter((freq: any) =>
          !usedFrequencyIds.includes(freq.id) || freq.id === item.limitFrequencyId
        )
      }))

      return {
        ...prevState,
        serviceDesignForm: {
          ...prevState.serviceDesignForm,
          frequencies: updatedFrequenciesWithLists
        }
      }
    })
  }

  handleOtherLimitValues = (idx: number) => (e: any) => {
    const { name, value } = e.target

    this.setState(prevState => {
      const updatedFrequencies = [...prevState.serviceDesignForm.frequencies]
      updatedFrequencies[idx] = {
        ...updatedFrequencies[idx],
        [name]: value
      }

      // Rebuild frequency lists if limitFrequencyId changed
      if (name === 'limitFrequencyId') {
        const usedFrequencyIds = updatedFrequencies.map(freq => freq.limitFrequencyId).filter(Boolean)
        updatedFrequencies.forEach((item: any, index: number) => {
          item.limitFrequencyList = prevState.allLimitFrequencies.filter((freq: any) =>
            !usedFrequencyIds.includes(freq.id) || freq.id === item.limitFrequencyId
          )
        })
      }

      return {
        ...prevState,
        serviceDesignForm: {
          ...prevState.serviceDesignForm,
          frequencies: updatedFrequencies
        }
      }
    })
  }

  validateForm = () => {
    const { serviceDesignForm } = this.state
    const errorMsg = {
      serviceTypeId: '',
      serviceName: '',
      maxLimitValue: '',
      waitingPeriod: '',
      coShareOrPayPercentage: ''
    }

    let hasError = false

    // Common validation
    if (!serviceDesignForm.serviceTypeId) {
      errorMsg.serviceTypeId = 'Service Type is Required'
      hasError = true
    }

    // Additional validation for non-excluded services
    if (!serviceDesignForm.toBeExcluded) {
      if (!serviceDesignForm.maxLimitValue) {
        errorMsg.maxLimitValue = 'Max limit is Required'
        hasError = true
      }
      if (!serviceDesignForm.waitingPeriod) {
        errorMsg.waitingPeriod = 'Waiting Period is Required'
        hasError = true
      }
      if (!serviceDesignForm.coShareOrPayPercentage) {
        errorMsg.coShareOrPayPercentage = 'Co-share/Pay percentage is Required'
        hasError = true
      }
    }

    this.setState(prevState => ({ ...prevState, errorMsg }))
    return !hasError
  }

  addToTable = () => {
    if (!this.validateForm()) return

    const rowObj = { ...this.state.serviceDesignForm }
    let updatedRows: any[]

    if (this.isEditedId !== '') {
      updatedRows = [...this.state.rows]
      updatedRows[this.isEditedId] = {
        ...rowObj,
        groupId: rowObj.groupId || null
      }
      this.isEditedId = ''
    } else {
      updatedRows = [...this.state.rows, rowObj]
    }

    this.props.updateServiceDesignDetails?.(updatedRows)

    this.setState(prevState => ({
      ...prevState,
      rows: updatedRows,
      serviceDesignForm: { ...initForm }
    }))
  }

  saveNNext = () => {
    const servicesDTO = this.state.rows.map((row: any) => ({
      serviceTypeId: row.serviceTypeId,
      groupId: row.groupId,
      serviceIds: row.serviceIds,
      maxLimitValue: row.maxLimitValue ? Number(row.maxLimitValue) : null,
      derievedMaxLimitDto: {
        benefitId: row.benefitId,
        percentage: row.percentage ? Number(row.percentage) : null,
        expression: row.percentage && row.benefitName ? `${row.percentage}% of ${row.benefitName}` : ''
      },
      frequencies: row.frequencies?.map(({ limitFrequencyId, maxLimit }: any) => ({
        limitFrequencyId,
        maxLimit: Number(maxLimit) || 0
      })) || [],
      waitingPeriod: row.waitingPeriod ? Number(row.waitingPeriod) : null,
      coShareOrPayPercentage: row.coShareOrPayPercentage ? Number(row.coShareOrPayPercentage) : null,
      toBeExcluded: row.toBeExcluded
    }))

    const productId = localStorage.getItem('productId')

    if (!productId) {
      console.error('Product ID not found')
      return
    }

    productservice.addProductServices(servicesDTO, productId).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.setOpenSnackbar(true)
          this.props.handleNextStep?.()
        }
      },
      error: (error) => {
        console.error('Error saving product services:', error)
      }
    })
  }

  setOpenSnackbar = (status: boolean) => {
    this.setState(prevState => ({
      ...prevState,
      openSnackbar: status
    }))
  }

  editTableRule = (row: any, idx: number) => {
    this.isEditedId = idx

    // Prepare frequencies for editing
    const frequencies = row.frequencies?.map((freq: any) => ({
      ...freq,
      limitFrequencyList: this.state.allLimitFrequencies
    })) || []

    this.setState(prevState => ({
      ...prevState,
      serviceDesignForm: {
        ...prevState.serviceDesignForm,
        ...row,
        benefitId: row.derievedMaxLimitDto?.benefitId || '',
        percentage: row.derievedMaxLimitDto?.percentage || '',
        searchBy: row.serviceIds?.length > 0 ? 'Individual' : 'Group',
        isAddOtherLimitValues: frequencies.length > 0,
        frequencies: frequencies.length > 0 ? frequencies : [{
          limitFrequencyId: '',
          maxLimit: '',
          limitFrequencyList: []
        }]
      },
      serviceTypeChangeDetect: row.serviceTypeId
    }))
  }

  deleteTableRule = (row: any, idx: number) => {
    const updatedRows = [...this.state.rows]
    updatedRows.splice(idx, 1)

    this.setState(prevState => ({
      ...prevState,
      rows: updatedRows
    }))

    this.props.updateServiceDesignDetails?.(updatedRows)
  }

  render() {
    const { classes } = this.props
    const {
      serviceDesignForm,
      serviceTypes,
      serviceTypeChangeDetect,
      allLimitFrequencies,
      benefitList,
      openSnackbar,
      errorMsg,
      rows
    } = this.state

    return (
      <Paper elevation={0} className={classes.serviceDesignRoot}>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => this.setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => this.setOpenSnackbar(false)} severity='success' variant='filled'>
            Product updated successfully
          </Alert>
        </Snackbar>

        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Grid item xs={3} className={classes.header}>
              <h3>Service Design</h3>
            </Grid>
          </Grid>
        </Grid>

        <Grid container alignItems='center' item xs={12}>
          <Grid item xs={12} sm={6} md={4} className={classes.rowContainer}>
            <div className={classes.formControlWrapper}>
              <FormControl className={classes.formControl}>
                <Autocomplete
                  options={serviceTypes}
                  getOptionLabel={(option: any) => option.displayName || option.name || ''}
                  value={serviceTypes.find((item: any) => item.id === serviceDesignForm.serviceTypeId) || null}
                  onChange={(event, newValue) => {
                    this.handleChange({
                      target: {
                        name: 'serviceTypeId',
                        value: newValue ? newValue.id : ''
                      }
                    })
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Service Type'
                      placeholder='Select Service Type'
                      variant='outlined'
                      fullWidth
                      error={!!errorMsg.serviceTypeId}
                    />
                  )}
                />
                {errorMsg.serviceTypeId && (
                  <FormHelperText error>{errorMsg.serviceTypeId}</FormHelperText>
                )}
              </FormControl>
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={4} className={classes.rowContainer}>
            <div className={classes.formControlWrapper}>
              <FormControl className={classes.formControl}>
                <Autocomplete
                  options={[
                    { id: 'Group', name: 'Group' },
                    { id: 'Individual', name: 'Individual' }
                  ]}
                  getOptionLabel={(option: any) => option.name}
                  value={serviceDesignForm.searchBy ? { id: serviceDesignForm.searchBy, name: serviceDesignForm.searchBy } : null}
                  onChange={(event, newValue) => {
                    this.handleChange({
                      target: {
                        name: 'searchBy',
                        value: newValue ? newValue.id : ''
                      }
                    })
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Search By'
                      placeholder='Select Search Type'
                      variant='outlined'
                      fullWidth
                    />
                  )}
                />
              </FormControl>
            </div>
          </Grid>

          {serviceDesignForm.searchBy === 'Group' && (
            <Grid item xs={12} sm={6} md={4} className={classes.rowContainer}>
              <div className={classes.formControlWrapper}>
                <div className={classes.fettleAutocompleteWrapper}>
                  <FettleAutocomplete
                    id='group-name'
                    name='groupId'
                    label='Group'
                    $datasource={this.groupDataSourceCallback$}
                    value={serviceDesignForm.groupId ?? ''}
                    changeDetect={serviceTypeChangeDetect}
                    onChange={(e: any, newValue: any) => this.handleServiceAutocompleteChange(e, newValue, 'groupId')}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </Grid>
          )}

          {serviceDesignForm.searchBy === 'Individual' && (
            <Grid item xs={12} sm={6} md={4} className={classes.rowContainer}>
              <div className={classes.formControlWrapper}>
                <div className={classes.fettleAutocompleteWrapper}>
                  <FettleAutocomplete
                    id='services'
                    name='serviceIds'
                    label='Services'
                    $datasource={this.servicesDataSourceCallback$}
                    multiple={true}
                    value={serviceDesignForm.serviceIds ?? []}
                    changeDetect={serviceTypeChangeDetect}
                    onChange={(e: any, newValue: any) => this.handleServiceAutocompleteChange(e, newValue, 'serviceIds')}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </Grid>
          )}

          <Grid item xs={12} sm={6} md={4} className={classes.rowContainer}>
            <div className={classes.checkboxWrapper}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={serviceDesignForm.toBeExcluded}
                    onChange={this.handleChange}
                    name='toBeExcluded'
                    color='primary'
                  />
                }
                label='Mark As Excluded'
              />
            </div>
          </Grid>

          {!serviceDesignForm.toBeExcluded && (
            <React.Fragment>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={4} className={classes.rowContainer}>
                  <div className={classes.formControlWrapper}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        name='maxLimitValue'
                        label='Max Limit'
                        value={serviceDesignForm.maxLimitValue || ''}
                        onChange={this.handleChange}
                        fullWidth
                        error={!!errorMsg.maxLimitValue}
                      />
                      {errorMsg.maxLimitValue && (
                        <FormHelperText error>{errorMsg.maxLimitValue}</FormHelperText>
                      )}
                    </FormControl>
                  </div>
                </Grid>

                <Grid item xs={12} sm={6} md={4} className={classes.rowContainer}>
                  <div className={classes.formControlWrapper}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        type='number'
                        name='percentage'
                        label='Percentage of'
                        value={serviceDesignForm.percentage}
                        onChange={this.handleChange}
                        fullWidth
                      />
                    </FormControl>
                  </div>
                </Grid>

                <Grid item xs={12} sm={6} md={4} className={classes.rowContainer}>
                  <div className={classes.formControlWrapper}>
                    <FormControl className={classes.formControl}>
                      <Autocomplete
                        options={benefitList}
                        getOptionLabel={(option: any) => option.name || ''}
                        value={benefitList.find((item: any) => item.id === serviceDesignForm.benefitId) || null}
                        onChange={(event, newValue) => {
                          this.handleChange({
                            target: {
                              name: 'benefitId',
                              value: newValue ? newValue.id : ''
                            }
                          })
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Benefits'
                            placeholder='Select Benefit'
                            variant='outlined'
                            fullWidth
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                </Grid>
              </Grid>

              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={4} className={classes.rowContainer}>
                  <div className={classes.checkboxWrapper}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={serviceDesignForm.isAddOtherLimitValues}
                          onChange={this.handleChange}
                          name='isAddOtherLimitValues'
                          color='primary'
                        />
                      }
                      label='Add Other Limit Values'
                    />
                  </div>
                </Grid>
              </Grid>

              {serviceDesignForm.isAddOtherLimitValues &&
                serviceDesignForm.frequencies.map((item: any, idx: any) => (
                  <Grid container spacing={1} key={idx}>
                    <Grid item xs={12} sm={6} md={4} className={classes.rowContainer}>
                      <div className={classes.formControlWrapper}>
                        <FormControl className={classes.formControl}>
                          <Autocomplete
                            options={item.limitFrequencyList}
                            getOptionLabel={(option: any) => option.name}
                            value={item.limitFrequencyList.find((freq: any) => freq.id === item.limitFrequencyId) || null}
                            onChange={(event, newValue) => {
                              this.handleOtherLimitValues(idx)({
                                target: {
                                  name: 'limitFrequencyId',
                                  value: newValue ? newValue.id : ''
                                }
                              })
                            }}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='Limit Frequency'
                                placeholder='Select Limit Frequency'
                                variant='outlined'
                                fullWidth
                              />
                            )}
                          />
                        </FormControl>
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} className={classes.rowContainer}>
                      <div className={classes.formControlWrapper}>
                        <FormControl className={classes.formControl}>
                          <TextField
                            name='maxLimit'
                            label='Max Limit'
                            value={item.maxLimit}
                            onChange={this.handleOtherLimitValues(idx)}
                            fullWidth
                          />
                        </FormControl>
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} className={classes.rowContainer}>
                      <div className={classes.formControlWrapper}>
                        {serviceDesignForm.frequencies.length > 1 && (
                          <Box>
                            <IconButton color='secondary' aria-label='delete' onClick={() => this.handleRemoveRow(idx)}>
                              <RemoveCircleOutlineIcon />
                            </IconButton>
                          </Box>
                        )}
                        {idx === serviceDesignForm.frequencies.length - 1 &&
                          serviceDesignForm.frequencies.length < allLimitFrequencies.length && (
                            <Box>
                              <IconButton color='primary' aria-label='add' onClick={() => this.handleAddMore()}>
                                <AddCircleOutlineIcon />
                              </IconButton>
                            </Box>
                          )}
                      </div>
                    </Grid>
                  </Grid>
                ))}

              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={4} className={classes.rowContainer}>
                  <div className={classes.formControlWrapper}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        name='waitingPeriod'
                        label='Waiting Period'
                        value={serviceDesignForm.waitingPeriod}
                        onChange={this.handleChange}
                        InputProps={{
                          endAdornment: <InputAdornment position='end'>Days</InputAdornment>
                        }}
                        fullWidth
                      />
                      {errorMsg.waitingPeriod && <FormHelperText>{errorMsg.waitingPeriod}</FormHelperText>}
                    </FormControl>
                  </div>
                </Grid>

                <Grid item xs={12} sm={6} md={4} className={classes.rowContainer}>
                  <div className={classes.formControlWrapper}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        name='coShareOrPayPercentage'
                        label='Co-Share/Co-Pay Percentage'
                        value={serviceDesignForm.coShareOrPayPercentage}
                        onChange={this.handleChange}
                        InputProps={{
                          endAdornment: <InputAdornment position='end'>%</InputAdornment>
                        }}
                        fullWidth
                      />
                      {errorMsg.coShareOrPayPercentage && (
                        <FormHelperText>{errorMsg.coShareOrPayPercentage}</FormHelperText>
                      )}
                    </FormControl>
                  </div>
                </Grid>
              </Grid>
            </React.Fragment>
          )}

          <Grid container spacing={1}>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Button color='primary' icon='pi pi-plus' iconPos='right' onClick={this.addToTable}>
                Add
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={1} style={{ marginTop: 30 }}>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div className={classes.tableBg}>
                <ServiceDesignTable
                  designList={this.state.rows}
                  action={true}
                  editTableRule={this.editTableRule}
                  deleteTableRule={this.deleteTableRule}
                />
              </div>
            </Grid>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
              <Button color='secondary' onClick={this.saveNNext}
              // disabled={this.state.rows.length === 0}
              >
                Save & Next
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

export default withRouter(withStyles(useStyles)(ServiceDesignComponent))
