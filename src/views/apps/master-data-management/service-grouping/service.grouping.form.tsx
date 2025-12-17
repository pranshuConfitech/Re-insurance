/* import DateFnsUtils from "@date-io/date-fns"; */
// import Button from "@mui/material/Button";
import React from 'react'

import { useParams, useRouter } from 'next/navigation'

import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

/* import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers"; */
import { withStyles } from '@mui/styles'

import { Button } from 'primereact/button'

import {
  GenderTypeService,
  ServiceGroupingsService,
  ServiceGroupService,
  ServiceTypeService
} from '@/services/remote-api/api/master-services'
import {
  defaultPageRequestServiceGrouping,
  defaultPageRequestServices
} from '@/services/remote-api/models/page.request.service.grouping'

import { FettleAutocomplete } from '../../shared-component/components/fettle.autocomplete'

const serviceTypeService = new ServiceTypeService()
const genderTypeService = new GenderTypeService()
const serviceGroupService = new ServiceGroupService()
const serviceGroupingsService = new ServiceGroupingsService()

const useStyles = (theme: any) => ({
  root: {
    flexGrow: 1,
    minHeight: 100,
    padding: 30
  },
  formControl: {
    margin: theme.spacing ? theme.spacing(1) : '8px',
    width: 276
  },
  serviceAutoComplete: {
    /* width: 500, */
    '& .MuiInputBase-formControl': {
      maxHeight: 500,
      overflowX: 'hidden',
      overflowY: 'auto'
    }
  },
  actionBlock: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  addGroupBtnSection: {
    display: 'flex',
    alignItems: 'center'
  }
})

function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()
    const params = useParams()

    // console.log(params);

    return <Component {...props} router={router} params={params} />
  }
}

class ServiceGroupingFormComponent extends React.Component<any, any> {
  serviceGroupPage: number
  pageSize: number
  serviceGroupSearchText: string
  constructor(props: any) {
    super(props)

    this.state = {
      serviceGroupingForm: {
        serviceTypeId: '',
        groupId: '',
        group: {},
        serviceIds: [],
        startTime: new Date(),
        endTime: null
      },
      addGroupForm: {
        name: '',
        code: '',
        genderId: '',
        isParent: false,
        parentId: ''
      },
      serviceTypes: [],
      genders: [],
      openDialog: false,
      serviceTypeChangeDetect: false,
      groupChangeDetect: false,
      parentGroupChangeDetect: false
    }
    this.serviceGroupPage = 0
    this.pageSize = 10
    this.serviceGroupSearchText = ''
  }

  componentDidMount() {
    this.getServiceTypes()
    this.getserviceGroupingsById()
  }

  getServiceTypes = () => {
    const serviceTypeService$ = serviceTypeService.getServiceTypes()

    serviceTypeService$.subscribe(response => {
      this.setState({
        ...this.state,
        serviceTypes: response.content
      })
    })
  }

  getserviceGroupingsById = () => {
    const ID = this.props.params.id

    if (ID) {
      serviceGroupingsService.getServiceGroupingsById(Number(ID)).subscribe((res: any) => {
        this.setState({
          ...this.state,
          serviceGroupingForm: {
            ...this.state.serviceGroupingForm,
            ...res /* 
                        groupId: "868035070228639744",
                        serviceIds: ["868181445398441984", "868225630591725568"], */,
            startTime: new Date(res.startDate)
          },
          serviceTypeChangeDetect: res.serviceTypeId,
          groupChangeDetect: res.groupId
        })
      })
    }
  }

  groupDataSourceCallback$ = (params = {}, action: any, pageRequest = defaultPageRequestServiceGrouping) => {
    let reqParam = { ...pageRequest, ...params }

    if (action?.searchText) {
      reqParam = {
        ...reqParam,
        groupCode: action?.searchText,
        groupName: action?.searchText
      }
    }

    const serviceTypeId = this.state.serviceGroupingForm.serviceTypeId

    return serviceTypeService.getServiceGroupes(serviceTypeId, reqParam)
  }

  servicesDataSourceCallback$ = (params = {}, action: any, pageRequest = defaultPageRequestServices) => {
    let reqParam = { ...pageRequest, ...params }

    if (action?.searchText) {
      reqParam = {
        ...reqParam,
        nameAlias: action?.searchText,
        icdCode: action?.searchText,
        name: action?.searchText
      }
    }

    const serviceTypeId = this.state.serviceGroupingForm.serviceTypeId
    const groupId = this.state.serviceGroupingForm.groupId

    return serviceTypeService.getServices(serviceTypeId, groupId, reqParam)
  }

  parentGroupDataSourceCallback$ = (params = {}, action: any, pageRequest = defaultPageRequestServiceGrouping) => {
    let reqParam = {
      ...pageRequest,
      ...params,
      nonGroupedServiceGroup: false,
      parentEligibleServiceGroupIrrespectiveGruping: true
    }

    if (action?.searchText) {
      reqParam = {
        ...reqParam,
        groupCode: action?.searchText,
        groupName: action?.searchText
      }
    }

    const serviceTypeId = this.state.serviceGroupingForm.serviceTypeId

    return serviceTypeService.getServiceGroupes(serviceTypeId, reqParam)
  }

  handleChange = (e: any) => {
    const { name, value } = e.target

    this.setState({
      ...this.state,
      serviceGroupingForm: {
        ...this.state.serviceGroupingForm,
        [name]: value,
        ...(name === 'serviceTypeId' && { groupId: '', serviceIds: [] })
      },
      ...(name === 'serviceTypeId' && { serviceTypeChangeDetect: value })
    })
  }

  handleAddGroupChange = (e: any) => {
    const { name, value, checked } = e.target

    if (name === 'isParent') {
      this.setState({
        ...this.state,
        addGroupForm: {
          ...this.state.addGroupForm,
          [name]: checked
        },
        parentGroupChangeDetect: this.state.serviceGroupingForm.serviceTypeId
      })
    } else {
      this.setState({
        ...this.state,
        addGroupForm: {
          ...this.state.addGroupForm,
          [name]: value
        }
      })
    }
  }

  handleServiceAutocompleteChange = (e: any, newValue: any, name: string) => {
    if (newValue && Array.isArray(newValue)) {
      this.setState({
        ...this.state,
        serviceGroupingForm: {
          ...this.state.serviceGroupingForm,
          [name]: newValue.map(o => o.id)
        }
      })
    } else {
      this.setState({
        ...this.state,
        serviceGroupingForm: {
          ...this.state.serviceGroupingForm,
          [name]: newValue ? newValue.id : '',
          group: newValue,
          ...(name === 'groupId' && { serviceIds: [] })
        },
        groupChangeDetect: newValue ? newValue.id : ''
      })
    }
  }

  handleParentGroupAutoCompleteChange = (e: any, newValue: any, name: string) => {
    this.setState({
      ...this.state,
      addGroupForm: {
        ...this.state.addGroupForm,
        [name]: newValue ? newValue.id : ''
      }
    })
  }

  handleDateChange = (e: any, name: string) => {
    this.setState({
      ...this.state,
      serviceGroupingForm: {
        ...this.state.serviceGroupingForm,
        [name]: e
      }
    })
  }

  addGroupModalToggle = (status: any) => (e: any) => {
    this.setState({
      ...this.state,
      openDialog: status
    })

    if (status) {
      this.getGenders()
    }
  }

  getGenders = () => {
    genderTypeService.getGenders().subscribe(res => {
      this.setState({
        ...this.state,
        genders: res.content
      })
    })
  }

  handleAddGroup = () => {
    const { name, code, parentId, genderId } = this.state.addGroupForm

    const requestPayload = {
      code,
      serviceGroupCreationDTO: {
        name,
        serviceTypeId: this.state.serviceGroupingForm.serviceTypeId,
        parentId,
        genderId
      }
    }

    serviceGroupService.saveGrouping(requestPayload).subscribe(res => {
      this.setState({
        ...this.state,
        serviceTypeChangeDetect: 'new group ' + Math.random()
      })
    })
    this.handleClose()
  }

  saveServiceGroup = () => {
    const { startTime, serviceIds } = this.state.serviceGroupingForm

    const requestPayload = {
      ...((!this.props.params.id && { serviceGroupActivationDTO: { serviceIds } }) || {
        serviceGroupTerminationDTO: { serviceIds }
      })
    }

    // const step = this.props.params.id ? 2 : 1;

    serviceGroupService.updateGrouping(this.state.serviceGroupingForm.groupId, requestPayload, 1).subscribe(res => {
      this.handleClose()
    })
  }

  handleClose = () => {
    this.props.router.push('/masters/service-grouping')
  }

  render() {
    const { classes } = this.props

    const {
      serviceGroupingForm,
      openDialog,
      addGroupForm,
      serviceTypes,
      serviceTypeChangeDetect,
      groupChangeDetect,
      parentGroupChangeDetect,
      genders
    } = this.state

    return (
      <div>
        <Typography variant='h6' gutterBottom>
          Service Grouping: {this.props.params.id ? 'Edit' : 'Add'}
        </Typography>
        <Paper elevation={0}>
          <div className={classes.root}>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <FormControl className={classes.formControl}>
                  <InputLabel id='select-service-type-label'>Service Type</InputLabel>
                  <Select
                    label='Service Type'
                    name='serviceTypeId'
                    value={serviceGroupingForm.serviceTypeId}
                    onChange={this.handleChange}
                    className={classes.selectEmpty}
                    disabled={this.props.params.id}
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    {serviceTypes.map((item: any) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.displayName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{paddingBottom:'8px',paddingLeft:'7px'}}>
              <Grid item xs={3}>
                {(!this.props.params.id && (
                  <FettleAutocomplete
                    id='group-name'
                    name='groupId'
                    label='Group'
                    $datasource={this.groupDataSourceCallback$}
                    value={serviceGroupingForm.group}
                    changeDetect={serviceTypeChangeDetect}
                    onChange={(e: any, newValue: any) => this.handleServiceAutocompleteChange(e, newValue, 'groupId')}
                  />
                )) || (
                  <React.Fragment>
                    <FormControl className={classes.formControl} style={{ marginTop: 15, marginBottom: 15 }}>
                      <TextField value={serviceGroupingForm.groupName || ''} label='Group' disabled />
                    </FormControl>
                  </React.Fragment>
                )}
              </Grid>
              <Grid item xs={3} className={classes.addGroupBtnSection}>
                <Button color='primary' onClick={this.addGroupModalToggle(true)} disabled={this.props.params.id}>
                  Add Group
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={1} className='pl-2'>
              <Grid item xs={3}>
                <FettleAutocomplete
                  id='services'
                  name='serviceIds'
                  label='Services'
                  $datasource={this.servicesDataSourceCallback$}
                  multiple={true}
                  value={serviceGroupingForm.serviceIds ?? []}
                  changeDetect={groupChangeDetect}
                  onChange={(e: any, newValue: any) => this.handleServiceAutocompleteChange(e, newValue, 'serviceIds')}
                />
              </Grid>
            </Grid>

            {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container spacing={1}>
                                <Grid item xs={3}>
                                    <FormControl className={classes.formControl}>
                                        <KeyboardDatePicker
                                            views={["year", "month", "date"]}
                                            variant="inline"
                                            format="MM/dd/yyyy"
                                            margin="normal"
                                            id="date-from"
                                            label="Date From"
                                            name="startTime"
                                            value={serviceGroupingForm.startTime}
                                            onChange={(e) => this.handleDateChange(e, 'startTime')}
                                            KeyboardButtonProps={{
                                                "aria-label": "change date",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                    <FormControl className={classes.formControl}>
                                        <KeyboardDatePicker
                                            disabled
                                            views={["year", "month", "date"]}
                                            variant="inline"
                                            format="MM/dd/yyyy"
                                            margin="normal"
                                            id="date-upto"
                                            label="Date Upto"
                                            name="endTime"
                                            value={serviceGroupingForm.endTime}
                                            onChange={(e) => this.handleDateChange(e, 'endTime')}
                                            KeyboardButtonProps={{
                                                "aria-label": "change date",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </MuiPickersUtilsProvider> */}

            <Grid container spacing={1}>
              <Grid item xs={12} className={classes.actionBlock}>
                <Button color='primary' onClick={this.saveServiceGroup}>
                  Save
                </Button>
                <Button className='p-button-text' style={{ marginLeft: 15 }} onClick={() => this.handleClose()}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </div>
        </Paper>

        <Dialog
          fullWidth
          maxWidth='sm'
          open={openDialog}
          onClose={this.addGroupModalToggle(false)}
          aria-labelledby='max-width-dialog-title'
        >
          <DialogTitle id='max-width-dialog-title'>Add Group</DialogTitle>
          <DialogContent>
            <form className={classes.form} noValidate>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      name='name'
                      label='Name'
                      value={addGroupForm.name}
                      onChange={this.handleAddGroupChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      name='code'
                      label='Code'
                      value={addGroupForm.code}
                      onChange={this.handleAddGroupChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id='gender-label'>Gender</InputLabel>
                    <Select
                      label='Gender'
                      labelId='gender-label'
                      name='genderId'
                      value={addGroupForm.genderId}
                      onChange={this.handleAddGroupChange}
                      MenuProps={{
                        anchorOrigin: {
                          vertical: 'bottom',
                          horizontal: 'left'
                        }

                        // transformOrigin: {
                        //   vertical: "top",
                        //   horizontal: "left",
                        // },
                      }}
                    >
                      {genders.map((item: any) => (
                        <MenuItem key={item.id} value={item.id}>
                          {' '}
                          {item.name}{' '}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    className={classes.formControl}
                    control={
                      <Checkbox
                        checked={addGroupForm.isParent}
                        onChange={this.handleAddGroupChange}
                        name='isParent'
                        color='primary'
                      />
                    }
                    label='Is Parent'
                    labelPlacement='start'
                  />
                </Grid>
                {addGroupForm.isParent && (
                  <Grid item xs={12}>
                    <FormControl className={classes.formControl}>
                      <FettleAutocomplete
                        id='parent-group'
                        name='parentId'
                        label='Parent Group'
                        $datasource={this.parentGroupDataSourceCallback$}
                        changeDetect={parentGroupChangeDetect}
                        onChange={(e: any, newValue: any) =>
                          this.handleParentGroupAutoCompleteChange(e, newValue, 'parentId')
                        }
                      />
                    </FormControl>
                  </Grid>
                )}
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button color='primary' onClick={this.handleAddGroup}>
              Go
            </Button>
            <Button onClick={this.addGroupModalToggle(false)} className='p-button-text'>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withRouter(withStyles(useStyles)(ServiceGroupingFormComponent))
