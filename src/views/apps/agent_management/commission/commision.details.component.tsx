import React, { useEffect } from 'react'

// import Box from '@material-ui/core/Box';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
// import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';
// import Snackbar from '@material-ui/core/Snackbar';
// import TextField from '@material-ui/core/TextField';
// import {
//   AgentTypeService,
//   ClientTypeService,
//   GroupTypeService,
//   OrganizationTypeService,
// } from './../../remote-api/api/master-services';
// import { BenefitService } from './../../remote-api/api/master-services';
// import { useHistory, useLocation, useParams } from 'react-router-dom';
// import { useFormik } from 'formik';
// import { useEffect } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import Checkbox from '@material-ui/core/Checkbox';
// import Autocomplete from '@material-ui/lab/Autocomplete';
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

import { makeStyles } from '@mui/styles'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import * as yup from 'yup'
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  FormControlLabel,
  Radio,
  FormLabel,
  RadioGroup
} from '@mui/material'
import { Button } from 'primereact/button'
import Grid from '@mui/material/Grid'
import type { Observable } from 'rxjs'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

import Autocomplete from '@mui/material/Autocomplete'

import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import { Calendar } from 'primereact/calendar'
import InputAdornment from '@mui/material/InputAdornment'

// import { Calendar } from 'primereact/calendar';
// import Typography from '@material-ui/core/Typography';
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

// import InputAdornment from '@material-ui/core/InputAdornment';

import { getIn, useFormik } from 'formik'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'

import { ClientService } from '@/services/remote-api/fettle-remote-api'
import { AgentsService } from '@/services/remote-api/api/agents-services'
import {
  AgentTypeService,
  BenefitService,
  ClientTypeService,
  GroupTypeService,
  OrganizationTypeService
} from '@/services/remote-api/api/master-services'
import { AnyARecord } from 'dns'

// import { AgentsService } from '../../remote-api/api/agents-services';
// import moment from 'moment';
// import { ClientService } from '../../remote-api/fettle-remote-api';

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' />

const useStyles = makeStyles((theme: any) => ({
  formControl: {
    margin: theme.spacing ? theme.spacing(1) : '8px',
    minWidth: 182,
    maxWidth: 182
  },
  clientAutoComplete: {
    width: 400,
    '& .MuiInputBase-formControl': {
      maxHeight: 400,
      overflowX: 'hidden',
      overflowY: 'auto',
      minWidth: 'auto',
      maxWidth: 250
    }
  },
  root: {},
  clientTypeRadioGroup: {}
}))

const agenttypeservice = new AgentTypeService()
const benefitService = new BenefitService()
const agentservice = new AgentsService()
const clienttypeervice = new ClientTypeService()
const grouptypeService = new GroupTypeService()
const organizationservice = new OrganizationTypeService()
const clientService = new ClientService()

const gt$ = grouptypeService.getGroupTypes()
const ct$ = clienttypeervice.getCleintTypes()
const org$ = organizationservice.getOrganizationTypes()
const at$ = agenttypeservice.getAgentTypes()
const benefit$ = benefitService.getAllBenefit({ page: 0, size: 1000, summary: true })
const pc$ = clientService.getParentClients()

const validationSchema = yup.object().shape({
  clientType: yup.string().required('clientType is required'),
  agentType: yup.string().required('Agent Type is required'),
  corporateClients: yup.array().of(yup.object())
    .when('clientType', {
      is: 'Corporate',
      then: (schema) => schema.min(1, 'Corporate Client is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  validFrom: yup.string().required('Date is required'),
  agentCommissionBenefits: yup.array().of(yup.object()).min(1, 'Main benefit is required'),
  agentCommissionBenefitForYears: yup
    .array()
    .of(
      yup.object({
        commissionPercentage: yup
          .number()
          .typeError('must be a number')
          .positive('reuire positive nnumber')
          .required('Field Required'),
        yearNumber: yup.number().positive('only positive'),
        onwards: yup.boolean()
      })
    )
    .min(1, 'value  is required')
})

const initialValues = {
  clientType: 'RETAIL',
  corporateClients: [],
  groupTypeCd: '',
  agentType: '',
  parentclientId: '',
  orgTypeCd: '',
  pOrgData: '',
  validFrom: new Date(),
  agentCommissionBenefits: [],
  groups: [],
  agentCommissionBenefitForYears: []
}

function useQuery() {
  // return new URLSearchParams(useLocation().search);
  const searchParams = useSearchParams()

  return Object.fromEntries(searchParams.entries())
}

const CommissionDetailsComponent = () => {
  const classes = useStyles()
  const router = useRouter()
  const query = useQuery()
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')
  const pathname = usePathname()

  const [agentTypes, setAgentTypes] = React.useState([])
  const [allBenefit, setAllBenefit] = React.useState([])
  const [clientTypes, setClientTypes] = React.useState([])
  const [groupTypes, setGroupTypes] = React.useState([])
  const [parentClients, setParentClients] = React.useState([])
  const [organizationTypes, setOrganizationTypes] = React.useState([])
  const [isAllClientSelected, setIsAllClientSelected] = React.useState(false)
  const [isAllBenefitSelected, setIsAllBenefitSelected] = React.useState(false)
  const [agentCommissionForm, setAgentCommissionForm] = React.useState({ ...initialValues })
  const [groupCategories, setGroupCategories] = React.useState([])

  const [yearSegmentList, setYearSegmentList] = React.useState([
    {
      yearNumber: '',
      commissionPercentage: '',
      onwards: ''
    }
  ])

  //   useEffect(() => {
  //     agentservice.getCommissionDetails(id).subscribe(val => {
  //       setAgentCommissionForm({
  //         ...agentCommissionForm,
  //         clientType: val?.clientType,
  //         corporateClients: [],
  //         agentType: val?.agentType,
  //         validFrom: moment(val.validFrom).toString(),
  //         agentCommissionBenefits: val?.agentCommissionBenefits,
  //         agentCommissionBenefitForYears: val?.agentCommissionBenefitForYears,
  //       });

  //       setYearSegmentList(val?.agentCommissionBenefitForYears);
  //     });
  //   }, []);

  useEffect(() => {
    const param = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      clientTypeCd: 'group'
    }

    clientService.getGroups(param).subscribe((val: any) => {
      console.log('Groups', val)
      setGroupCategories(val?.content)
    })
  }, [])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...agentCommissionForm
    },
    validationSchema: validationSchema,
    onSubmit: (values: any) => {
      // resetForm();
      saveDetails(values)
      setYearSegmentList([
        {
          yearNumber: '',
          commissionPercentage: '',
          onwards: ''
        }
      ])
    }
  })

  const today = new Date()
  const month = today.getMonth()
  const year = today.getFullYear()
  const day = today.getDate()
  const minDate = new Date()

  minDate.setMonth(month)
  minDate.setFullYear(year)
  minDate.setDate(day)

  const handleDateSetter = (e: { value: any }) => {
    const date = e.value

    // date = format(new Date(date), 'dd/MM/yyyy')
    formik.setFieldValue('validFrom', date)
  }

  const useObservable = (observable: Observable<any>, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: { content: any }) => {
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  const useObservable2 = (observable: Observable<any>, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe(
        (result: { content: { clientBasicDetails: { displayName: any }; id: any }[] }) => {
          const tableArr: { name: any; id: any }[] = []

          if (result.content && result.content.length > 0) {
            result.content.forEach((ele: { clientBasicDetails: { displayName: any }; id: any }) => {
              tableArr.push({
                name: ele.clientBasicDetails.displayName,
                id: ele.id
              })
            })
          }

          setter(tableArr)
        }
      )

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable2(pc$, setParentClients)
  useObservable(org$, setOrganizationTypes)
  useObservable(ct$, setClientTypes)
  useObservable(gt$, setGroupTypes)
  useObservable(at$, setAgentTypes)
  useObservable(benefit$, setAllBenefit)

  const clients = [
    { id: 12232, name: 'TCS' },
    { id: 323232, name: 'Acclaris' },
    { id: 23231, name: 'Accenture' },
    { id: 2321, name: 'Capgemini' },
    { id: 233231, name: 'Tech Mahindra' },
    { id: 23232, name: 'HCL' },
    { id: 72323, name: 'IBM' },
    { id: 3235454, name: 'HP' },
    { id: 32323, name: 'CTS' },
    { id: 12320, name: 'Wipro' }
  ]

  const handleGroupClientChange = (e: any, val: any) => {
    const allSelectIndex = val.findIndex((item: { id: string }) => item.id === 'selectall')

    if (allSelectIndex > -1) {
      if (val.length > 1 && allSelectIndex === 0) {
        //'ALL is selected before and unchecking item;
        const arr = [...val]
        const toberemoved = arr.splice(1, 1)
        const toBePushed = [...clients]
        const beRemovedIndex = toBePushed.findIndex(item => item.id === toberemoved[0].id)

        toBePushed.splice(beRemovedIndex, 1)
        val = null
        val = [...toBePushed]
        formik.setFieldValue('corporateClients', toBePushed)
        setIsAllClientSelected(false)

        return
      }

      if ((val.length > 1 && allSelectIndex !== 0) || val.length === 1) {
        //'ALL' selected at first choice.
        val = null
        val = [{ id: 'selectall', name: 'ALL' }, ...clients]
        formik.setFieldValue('corporateClients', [{ id: 'selectall', name: 'ALL' }])
        setIsAllClientSelected(true)

        return
      }
    } else {
      if (val.length === clients.length) {
        val = null
        val = [{ id: 'selectall', name: 'ALL' }, ...clients]
        formik.setFieldValue('corporateClients', [{ id: 'selectall', name: 'ALL' }])
        setIsAllClientSelected(true)
      } else {
        formik.setFieldValue('corporateClients', val)
        setIsAllClientSelected(false)
      }
    }
  }

  const handleMainGroupChange = (e: any, val: any) => {
    let isSelectedAll
    const allSelectIndex = val.findIndex((item: { id: string }) => item.id === 'selectall')

    if (allSelectIndex > -1) {
      if (val.length > 1 && allSelectIndex === 0) {
        //'ALL is selected before and unchecking item;
        const arr = [...val]
        const toberemoved = arr.splice(1, 1)
        const toBePushed = [...allBenefit]
        const beRemovedIndex = toBePushed.findIndex((item: { id: string }) => item.id === toberemoved[0].id)

        toBePushed.splice(beRemovedIndex, 1)
        val = null
        val = [...toBePushed]
        formik.setFieldValue('agentCommissionBenefits', toBePushed)
        setIsAllBenefitSelected(false)

        return
      }

      if ((val.length > 1 && allSelectIndex !== 0) || val.length === 1) {
        //'ALL' selected at first choice.
        val = null
        val = [{ id: 'selectall', name: 'ALL' }, ...allBenefit]
        formik.setFieldValue('agentCommissionBenefits', [{ id: 'selectall', name: 'ALL' }])
        setIsAllBenefitSelected(true)

        return
      }
    } else {
      if (val.length === allBenefit.length && allBenefit.length > 0) {
        val = null
        val = [{ id: 'selectall', name: 'ALL' }, ...allBenefit]
        formik.setFieldValue('agentCommissionBenefits', [{ id: 'selectall', name: 'ALL' }])
        setIsAllBenefitSelected(true)
      } else {
        formik.setFieldValue('agentCommissionBenefits', val)
        setIsAllBenefitSelected(false)
      }
    }
  }

  const handleMainBenfitChange = (e: any, val: any) => {
    let isSelectedAll
    const allSelectIndex = val.findIndex((item: { id: string }) => item.id === 'selectall')
    if (allSelectIndex > -1) {
      if (allSelectIndex === 0) {
        //'ALL is selected before and unchecking item;
        const arr = [...val]
        const toberemoved = arr.splice(1, 1)
        const toBePushed = [...allBenefit]
        const beRemovedIndex = toBePushed.findIndex((item: { id: string }) => item?.id === toberemoved[0]?.id)

        toBePushed.splice(beRemovedIndex, 1)
        val = null
        val = [...toBePushed]
        formik.setFieldValue('agentCommissionBenefits', toBePushed)
        setIsAllBenefitSelected(false)

        return
      }

      if ((val.length > 1 && allSelectIndex !== 0) || val.length === 1) {
        //'ALL' selected at first choice.
        val = null
        val = [{ id: 'selectall', name: 'ALL' }, ...allBenefit]
        formik.setFieldValue('agentCommissionBenefits', [{ id: 'selectall', name: 'ALL' }])
        setIsAllBenefitSelected(true)

        return
      }
    } else {
      if (val.length === allBenefit.length && allBenefit.length > 0) {
        val = null
        val = [{ id: 'selectall', name: 'ALL' }, ...allBenefit]
        formik.setFieldValue('agentCommissionBenefits', [{ id: 'selectall', name: 'ALL' }])
        setIsAllBenefitSelected(true)
      } else {
        formik.setFieldValue('agentCommissionBenefits', val)
        setIsAllBenefitSelected(false)
      }
    }
  }

  const autocompleteFilterChange = (options: any[], state: { inputValue: any }) => {
    if (state.inputValue) {
      return options?.filter(item => item.name.toLowerCase().indexOf(state.inputValue) > -1)
    }

    return [{ id: 'selectall', name: 'ALL' }, ...options]
  }

  //   return ([{ id: 'selectall', name: 'ALL' }, ...options]);
  const autocompleteFilterChangeGroup = (options: any[], state: { inputValue: any }) => {
    if (state.inputValue) {
      return options?.filter(item => item.name.toLowerCase().indexOf(state.inputValue) > -1)
    }

    return [{ clientBasicDetails: { id: 'selectall', firstName: 'ALL' } }, ...options]
  }

  const handleAddNewList = (index: number) => {
    const year = index + 2

    setYearSegmentList([
      ...yearSegmentList,
      {
        yearNumber: '',
        commissionPercentage: '',
        onwards: ''
      }
    ])
  }

  const HandleRemoveList = (index: number) => {
    let list = [...yearSegmentList]

    list.splice(index, 1)
    list = list.map((item: any, i) => {
      if (item.yearNumber > 1) {
        item.yearNumber -= 1

        return item
      }

      return item
    })
    setYearSegmentList(list)
  }

  const handleListInputChange = (event: any, index: number) => {
    const { name, value, checked } = event.target
    const list: any = [...yearSegmentList]

    list[index][name] = name === 'onwards' ? checked : value
    list[index]['yearNumber'] = index + 1
    setYearSegmentList(list)
  }

  useEffect(() => {
    formik.setFieldValue('agentCommissionBenefitForYears', yearSegmentList)
  }, [yearSegmentList])

  if (formik.values.clientType === 'RETAIL') {
    delete formik.errors.corporateClients
  }

  const saveDetails = (values: {
    agentCommissionBenefits: any[]
    agentCommissionBenefitForYears: any[]
    id: any
    clientType: any
    agentType: any
    corporateClients: any
    validFrom: number
  }) => {
    const tempAgentCommissionBenefits: any = []
    const tempAgentCommissionBenefitForYears: any = []

    const a = values.agentCommissionBenefits?.map(ele => {
      const obj = {
        id: +ele?.id,
        benefitName: ele?.name,
        benefitId: ele?.id
      }

      tempAgentCommissionBenefits.push(obj)
    })

    const p = values.agentCommissionBenefitForYears?.map(ele => {
      const obj = {
        id: ele?.id,
        onwards: ele?.onwards || false,
        year: ele?.yearNumber,
        commissionPercentage: ele?.commissionPercentage
      }

      tempAgentCommissionBenefitForYears.push(obj)
    })

    const payload = {
      id: values.id,
      clientType: values?.clientType,
      agentType: values?.agentType,
      corporateClients: values.corporateClients,
      validFrom: values?.validFrom * 1,
      agentCommissionBenefits: tempAgentCommissionBenefits,
      agentCommissionBenefitForYears: tempAgentCommissionBenefitForYears
    }

    agentservice.createAgentCommissions(payload).subscribe(res => {
      router.push('/agents/commission?mode=viewList')
    })
  }

  const handlePChange = (e: any, value: { id: any }) => {
    formik.setValues({
      ...formik.values,
      pOrgData: value,
      parentclientId: value.id
    })

    // setClientDetail({
    //     ...clientDetail,
    //     pOrgData: value,
    //     parentclientId: value.id,
    // });
  }
  console.log("123456", formik.values)
  return (
    <>
      {mode === 'edit' ? (
        <Grid
          item
          //   xs={12}
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '20px',

            // height: "2em",
            color: '#000',
            fontSize: '18px'
          }}
        >
          <span
            style={{
              fontWeight: '600',

              //   display: "flex",
              //   justifyContent: "center",
              //   alignItems: "center",
              marginLeft: '5px'
            }}
          >
            Agent Management- Edit Agent
          </span>
        </Grid>
      ) : null}
      <div className={classes.root}>
        <Paper elevation={0}>
          <Box padding={8}>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl component='fieldset'>
                    <FormLabel component='legend'>Client type*</FormLabel>
                    <RadioGroup
                      aria-label='clientTypeCd'
                      value={formik.values.clientType}
                      name='clientType'
                      onChange={formik.handleChange}
                      row
                      className={classes.clientTypeRadioGroup}
                    >
                      {clientTypes.map((ele: any) => {
                        return <FormControlLabel key={ele.code} value={ele.code} control={<Radio />} label={ele.name} />
                      })}
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                {formik.values.clientType === 'GROUP' && (
                  <div>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl
                        className={classes.formControl}
                        error={formik.touched.agentCommissionBenefits && Boolean(formik.errors.agentCommissionBenefits)}
                      >
                        <Autocomplete
                          className={classes.clientAutoComplete}
                          multiple
                          value={formik.values.agentCommissionBenefits}
                          onChange={handleMainGroupChange}
                          id="checkboxes-tags-demo"
                          filterOptions={(options, state) => {
                            if (state.inputValue) {
                              return options.filter((item) =>
                                item?.clientBasicDetails?.firstName?.toLowerCase().includes(state.inputValue.toLowerCase())
                              );
                            }
                            return options;
                          }}
                          disableCloseOnSelect
                          options={groupCategories}
                          getOptionLabel={(option: any) => option?.clientBasicDetails?.firstName || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.clientBasicDetails?.firstName === value?.clientBasicDetails?.firstName
                          }
                          renderOption={(props, option, { selected }) => {
                            const isSelectedAll =
                              isAllBenefitSelected ||
                              formik.values.agentCommissionBenefits.some(
                                (benefit: any) => benefit.name === option?.clientBasicDetails?.firstName
                              );

                            return (
                              <li {...props}>
                                <Checkbox
                                  icon={icon}
                                  checkedIcon={checkedIcon}
                                  style={{ marginRight: 8, color: "#626bda" }}
                                  checked={isSelectedAll}
                                  indeterminate={option.id === "selectall" && !isSelectedAll}
                                />
                                <Typography style={{ fontSize: "small" }} variant="body2" component="div">
                                  {option?.clientBasicDetails?.firstName}
                                </Typography>
                              </li>
                            );
                          }}
                          style={{ width: 200 }}
                          renderInput={(params) => (
                            <>
                              {/* <TextField {...params} label="All Groups" placeholder="Select Group" />
                              {formik.touched.agentCommissionBenefits &&
                                Boolean(formik.errors.agentCommissionBenefits) && (
                                  <FormHelperText>
                                    {formik.touched.agentCommissionBenefits &&
                                      typeof formik.errors.agentCommissionBenefits === "string"
                                      ? formik.errors.agentCommissionBenefits
                                      : null}
                                  </FormHelperText>
                                )} */}
                            </>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      {/* <FormControl className={classes.formControl}>
                                                <InputLabel id="demo-simple-select-label" style={{ marginBottom: '0px' }}>
                                                    Organization type*
                                                </InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    name="orgTypeCd"
                                                    value={formik.values.orgTypeCd}
                                                    onChange={formik.handleChange}
                                                >
                                                    {organizationTypes.map(ele => {
                                                        return <MenuItem value={ele.code}>{ele.name}</MenuItem>;
                                                    })}
                                                </Select>
                                            </FormControl> */}
                    </Grid>
                  </div>
                )}
                {formik.values.clientType === 'GROUP' && formik.values.orgTypeCd === 'OT117246' ? (
                  <Grid item xs={12} sm={6} md={4}>
                    <Autocomplete
                      id='combo-box-demo'
                      options={parentClients}
                      getOptionLabel={option => option.name}
                      value={formik.values.pOrgData}
                      style={{ width: '50%' }}
                      renderInput={params => <TextField {...params} label='Parent Organization*' />}
                      // name="parentclientId"
                      onChange={handlePChange}
                    />
                  </Grid>
                ) : (
                  <div />
                )}
              </Grid>

              {formik.values.clientType === 'Corporate' && (
                <Grid container alignItems='center' spacing={3} style={{ marginBottom: '20px' }}>
                  <Grid item xs={2}>
                    {' '}
                    {/**/}
                    <InputLabel id='alertMessage'>Corporate Clients</InputLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl
                      className={classes.formControl}
                      error={
                        formik.touched.corporateClients &&
                        Boolean(formik.errors.corporateClients && formik.values.clientType === 'Corporate')
                      }

                    // helperText={
                    //   formik.touched.corporateClients &&
                    //   formik.errors.corporateClients &&
                    //   formik.values.clientType === 'Corporate'
                    // }
                    >
                      <Autocomplete
                        className={classes.clientAutoComplete}
                        multiple
                        value={formik.values.corporateClients}
                        onChange={handleGroupClientChange}
                        id='checkboxes-tags-demo'
                        filterOptions={autocompleteFilterChange}
                        disableCloseOnSelect
                        options={clients}
                        getOptionLabel={(option: any) => option.name}
                        isOptionEqualToValue={(option: { id: any }, value: { id: any }) => option.id === value.id}
                        renderOption={(option: any, { selected }: any) => {
                          const isSelectedAll = isAllClientSelected || selected

                          return (
                            <React.Fragment>
                              <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8, color: '#626bda' }}
                                checked={isSelectedAll}
                                indeterminate={option.id === 'selectall' && !isSelectedAll ? true : false}
                              />
                              <Typography style={{ fontSize: 'small' }} variant='body2' component='div'>
                                {option?.name}
                              </Typography>
                            </React.Fragment>
                          )
                        }}
                        style={{ width: 300 }}
                        renderInput={params => (
                          <>
                            <TextField {...params} label='Select Clints' placeholder='Select Client' />
                            {formik.touched.corporateClients &&
                              Boolean(formik.errors.corporateClients) &&
                              formik.values.clientType === 'Corporate' && (
                                <FormHelperText>
                                  {formik.touched.corporateClients && typeof formik.errors.corporateClients === 'string'
                                    ? formik.errors.corporateClients
                                    : null}
                                </FormHelperText>
                              )}
                          </>
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              )}
              <Grid container alignItems='center' spacing={3} style={{ marginBottom: '20px' }}>
                {/* <Grid item xs={2}>
                  <InputLabel id='clientType'>Agent Type</InputLabel>
                </Grid> */}
                <Grid item xs={8}>
                  <FormControl
                    className={classes.formControl}
                    error={formik.touched.agentType && Boolean(formik.errors.agentType)}
                  >
                    <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                      Agent Type
                    </InputLabel>
                    <Select
                      label='Agent Type'
                      labelId='demo-simple-select-label'
                      name='agentType'
                      id='demo-simple-select'
                      value={formik.values.agentType}
                      onChange={formik.handleChange}
                    >
                      {agentTypes.map((ele: any) => {
                        return (
                          <MenuItem key={ele.code} value={ele.code}>
                            {ele.name}
                          </MenuItem>
                        ) //{id:ele.id, name:ele.name, code:ele.code}
                      })}
                    </Select>
                    {formik.touched.agentType && Boolean(formik.errors.agentType) && (
                      <FormHelperText>
                        {formik.touched.agentType && typeof formik.errors.agentType === 'string'
                          ? formik.errors.agentType
                          : null}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container alignItems='center' spacing={3} style={{ marginBottom: '20px' }}>
                <Grid item xs={2}>
                  <InputLabel id='Select Date'>Valid From</InputLabel>
                </Grid>
                <Grid item xs={8}>
                  <FormControl
                    className={classes.formControl}
                    error={formik.touched.validFrom && Boolean(formik.errors.validFrom)}
                  >
                    <label id='calender' style={{ color: '#666' }}>
                      Select a Date
                    </label>
                    <Calendar
                      id='calender'
                      dateFormat='dd/mm/yy'
                      value={formik.values.validFrom}
                      onChange={handleDateSetter}
                      readOnlyInput
                      minDate={minDate}
                      showIcon
                    />{' '}
                    {/* maxDate={maxDate}*/}
                    {formik.touched.validFrom && Boolean(formik.errors.validFrom) && (
                      <FormHelperText>
                        {formik.touched.validFrom &&
                          (typeof formik.errors.validFrom === 'string' ? formik.errors.validFrom : '')}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container alignItems='center' spacing={3} style={{ marginBottom: '20px' }}>
                <Grid item xs={3}>
                  <FormControl
                    className={classes.formControl}
                    error={formik.touched.agentCommissionBenefits && Boolean(formik.errors.agentCommissionBenefits)}
                  >
                    {/* <Autocomplete
                      className={classes.clientAutoComplete}
                      multiple
                      value={formik.values.agentCommissionBenefits}
                      onChange={handleMainBenfitChange}
                      id="checkboxes-tags-demo"
                      filterOptions={(options, state) => {
                        if (state.inputValue) {
                          return options.filter((item) =>
                            item.name.toLowerCase().includes(state.inputValue.toLowerCase())
                          );
                        }
                        return options;
                      }}
                      disableCloseOnSelect
                      options={allBenefit}
                      getOptionLabel={(option: any) => option.name || ""}
                      isOptionEqualToValue={(option, value) => option.name === value.name}
                      renderOption={(props, option, { selected }) => {
                        const isSelectedAll = isAllBenefitSelected || selected;

                        return (
                          <li {...props}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8, color: "#626bda" }}
                              checked={isSelectedAll}
                              indeterminate={option.id === "selectall" && !isSelectedAll}
                            />
                            <Typography style={{ fontSize: "small" }} variant="body2" component="div">
                              {option.name}
                            </Typography>
                          </li>
                        );
                      }}
                      style={{ width: 200 }}
                      renderInput={(params) => (
                        <>
                          <TextField {...params} label="Benefits" placeholder="Select Benefit" />
                          {formik.touched.agentCommissionBenefits && Boolean(formik.errors.agentCommissionBenefits) && (
                            <FormHelperText>
                              {formik.touched.agentCommissionBenefits &&
                                (typeof formik.errors.agentCommissionBenefits === "string"
                                  ? formik.errors.agentCommissionBenefits
                                  : "")}
                            </FormHelperText>
                          )}
                        </>
                      )}
                    /> */}
                    <Autocomplete
                      className={classes.clientAutoComplete}
                      fullWidth
                      multiple
                      value={formik.values.agentCommissionBenefits}
                      onChange={handleMainBenfitChange}
                      id='checkboxes-tags-demo'
                      filterOptions={autocompleteFilterChange}
                      options={allBenefit}
                      disableCloseOnSelect
                      getOptionLabel={option => option?.name || ''}
                      isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                      renderOption={(props: any, option: any, { selected }) => {
                        const selectedOpt = (option.id === 'selectall' && isAllBenefitSelected) || selected
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
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  {yearSegmentList?.map((item, index) => {
                    return (
                      <Grid container spacing={3} alignItems='center' key={index}>
                        <Grid item xs={3}>
                          <Typography style={{ textAlign: 'center' }} variant='h6'>
                            for Year {!item.yearNumber ? index + 1 : item.yearNumber}
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            id='percentage'
                            name='commissionPercentage'
                            // placeholder="e.g: 7"
                            InputProps={{
                              endAdornment: <InputAdornment position='end'>%</InputAdornment>
                            }}
                            value={item.commissionPercentage}
                            onChange={event => handleListInputChange(event, index)}
                            style={{ maxWidth: 142 }}
                          />
                          {getIn(formik.touched.agentCommissionBenefitForYears, `[${index}].commissionPercentage`) && (
                            <FormHelperText>
                              {getIn(formik.errors.agentCommissionBenefitForYears, `[${index}].commissionPercentage`)}
                            </FormHelperText>
                          )}
                        </Grid>
                        <Grid item xs={3}>
                          {yearSegmentList?.length - 1 === index && (
                            <Button
                              className=' p-button-primary'
                              color='primary'
                              disabled={item.commissionPercentage?.length < 1 || item.onwards ? true : false}
                              style={{ marginRight: '5px' }}
                              onClick={() => handleAddNewList(index)}
                            >
                              <AddIcon />
                            </Button>
                          )}
                          {yearSegmentList?.length !== 1 && (
                            <Button
                              className='mr10  p-button-danger'
                              onClick={() => HandleRemoveList(index)}
                              color='secondary'
                            >
                              <DeleteIcon />
                            </Button>
                          )}
                        </Grid>
                        <Grid item xs={3}>
                          {yearSegmentList?.length - 1 === index && (
                            <>
                              <Checkbox
                                id='onwards'
                                name='onwards'
                                color='primary'
                                checked={item.onwards ? true : false}
                                onChange={event => handleListInputChange(event, index)}
                              />
                              <label htmlFor='onwards'>...onwards</label>
                            </>
                          )}
                        </Grid>
                      </Grid>
                    )
                  })}
                </Grid>
              </Grid>
              <Divider />

              <Grid container spacing={1} style={{ marginTop: '10px' }}>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Button className=' p-button-primary' type='submit' color='primary'>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Paper>
      </div>
    </>
  )
}

export default CommissionDetailsComponent
