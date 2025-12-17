import React from 'react'
import { useRouter } from 'next/navigation'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/lab/Autocomplete'
import { withStyles } from '@mui/styles'
import { BehaviorSubject } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators'
import moment from 'moment'
import { Button } from 'primereact/button'
import { Box, Checkbox, CircularProgress, Snackbar } from '@mui/material'
import { Alert } from '@mui/lab'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import { Toast } from 'primereact/toast'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import RoleService from '@/services/utility/role'
import { MemberService } from '@/services/remote-api/api/member-services/member.services'
import { ProspectService } from '@/services/remote-api/api/client-services/prospect.services'
import { MemberProcessService } from '@/services/remote-api/api/member-services/member.process.service'
import { replaceAll, toTitleCase } from '@/services/utility'
import { FettleDataGrid } from '../shared-component/components/fettle.data.grid'
import { MemberFieldConstants } from './MemberFieldConstants'

const PAGE_NAME = 'MEMBER'
const roleService = new RoleService()
const prospectService = new ProspectService()
const memberService = new MemberService()
const memberProcessService = new MemberProcessService()

const prospectDataSource$: any = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true
  }
) => {
  pageRequest.sort = ['rowLastUpdatedDate dsc']

  if (pageRequest.searchKey) {
    pageRequest['code'] = pageRequest.searchKey.trim()
    pageRequest['displayName'] = pageRequest.searchKey.trim()
    pageRequest['mobileNo'] = pageRequest.searchKey.trim()
  }

  delete pageRequest.searchKey

  return prospectService.getProspects(pageRequest)
}

const useStyles = (theme: any) => ({
  formControl: {
    width: '100%'
  },
  searchBoxContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  searchMemberBox: {
    width: '100%'
  }
})

const s = new BehaviorSubject({})
const observable = s.asObservable()
let memberPageRequest: any = {
  page: 0,
  size: 10,
  summary: true,
  active: true,
  policyStatus: 'ACTIVE',
  sort: ['rowCreatedDate dsc']
}

const handleState2Change = (component: any, key: any, value: any) => {
  component.setState(
    (prevState: any) => ({
      state2: {
        ...prevState.state2,
        [key]: value
      }
    }),
    () => {
      component.logState()
    }
  )
}

function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()

    return <Component {...props} router={router} />
  }
}

class MemberListComponent extends React.Component<any, any> {
  toast: any
  configuration: any
  handleState2Change: (key: any, value: any) => void
  statealertMsg: any
  fileInput: any
  constructor(props: any) {
    super(props)
    this.toast = React.createRef()
    this.state = {
      searchType: 1,
      searchResult: [],
      columnsDefinations: [],
      selectedId: '',
      textInput: '',
      reloadTable: false,
      vipOrPoliticalData: [],
      openSnack: false,
      alertMsg: '',
      sourceId: '',
      memberId: '',
      isLoading: false,
      selectedImage: {
        documentType: '',
        docFormat: '',
        documentName: '',
        documentOriginalName: ''
      },

      state2: {
        policyStartDate: new Date(),
        policyEndDate: new Date()
      }
    }
    this.handleState2Change = (key: any, value: any) => handleState2Change(this, key, value)
    this.logState = this.logState.bind(this)
    this.configuration = {
      enableSelection: false,
      scrollHeight: '200px',
      pageSize: 10,
      isCheckbox: true,
      actionButtons: roleService.checkActionPermission(PAGE_NAME, '', () => { }, this.actionBtnList),
      header: {
        enable: true,
        addCreateButton: this.hasAccess('CREATE', this.actionBtnList),
        onCreateButtonClick: this.handleOpen,
        text: 'Member Management',
        enableGlobalSearch: false,
        searchText: 'Search by code, name, mobile'
      }
    }

    this.getMemberConfiguration()
  }
  openEditSection = (receipt: any) => {
    // let id = receipt.membershipNo.replace(/\//g, "-");
    this.props.router.push(`/member-upload/member/details/${receipt?.id}`)
  }
  logState() {
    console.log(this.state)
  }

  actionBtnList = [
    {
      key: 'update_receipt',
      icon: 'pi pi-eye',
      className: 'ui-button-warning',
      onClick: this.openEditSection
    }
  ]

  doChangeSearchType = (e: any) => {
    const { value } = e.target

    this.setState({ ...this.state, searchType: value })
    memberPageRequest.page = 0
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    // Check if 'count' has been updated
    // if (prevState.searchType !== this.state.searchType) {
    console.log('State has been updated:', this.state.searchType)

    // You can add additional logic here if needed
    // }
  }

  onButtonClick2 = () => {
    this.setState({ ...this.state.state2, isLoading: true })
    this.setState({ ...this.state.state2, reloadTable: true })
  }
  onButtonClick = () => {
    this.setState({ ...this.state, isLoading: true })
    this.setState({ ...this.state, reloadTable: true })
  }

  doSearch = (e: any) => {
    console.log("asd", e)
    // const txt = e.target.value

    observable
      .pipe(
        filter(searchTerm => e && e.length > 2),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(searchKey => {
          return prospectDataSource$({ searchKey: e, page: 0, size: 10 })
        })
      )
      .subscribe((res: any) => {
        if (res?.content?.length) {
          this.setState({ searchResult: res.content })
        }
      })
  }

  doSelectValue = (e: any, newValue: any) => {
    if (newValue && newValue.id) {
      memberPageRequest.prospectId = newValue.id
      memberPageRequest.status = 'POLICY_CREATED'
      // memberPageRequest.policyStatus = 'ACTIVE'
      this.setState({
        ...this.state,
        selectedId: newValue.id
      })
      this.setState({ ...this.state, reloadTable: true });
    }
  }

  handleCheckboxChange = (e: any, id: any) => {
    const { name, checked } = e.target
    const data = [...this.state.vipOrPoliticalData]
    const index = data.findIndex(item => item.id === id)

    data[index][name] = checked
    this.setState({ ...this.state, vipOrPoliticalData: data })
  }

  //Profile upload an image function
  handleImage = (e: any) => {
    const file = e.target['files'][0]
    const reader = new FileReader()

    reader.onload = () => {
      const { selectedImage } = this.state
      const formData = new FormData()

      formData.append('docType', 'PROFILE_IMAGE')
      formData.append('filePart', file)
      memberService.uploadProfile(formData, this.state.memberId).subscribe(response => {
        selectedImage['documentName'] = response.id
        selectedImage['docFormat'] = response.docFormat
        this.setState({ selectedImage })
        this.toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'File Uploaded Successfully!!',
          life: 3000
        })
        window.location.reload()
      })
    }

    reader.readAsDataURL(file)
  }

  getMemberConfiguration = () => {
    memberService.getMemberConfiguration().subscribe((res: any) => {
      if (res.content && res.content.length > 0) {
        const colDef = res.content[0].fields.map((r: { name: keyof typeof MemberFieldConstants }) => ({
          field: MemberFieldConstants[r.name.toUpperCase() as keyof typeof MemberFieldConstants],
          headerName: toTitleCase(replaceAll(r.name, '_', ' '))
        }))

        const newObj1 = {
          field: 'hello',
          headerName: 'Is Political?',
          checkbox: true,
          body: (rowData: any) => {
            const data = this.state.vipOrPoliticalData.filter((item: any) => item.id === rowData.id)

            return (
              <Checkbox
                name='political'
                checked={data[0]?.political}
                onChange={e => this.handleCheckboxChange(e, rowData.id)}
              />
            )
          }
        }

        const newObj2 = {
          field: 'hello1',
          headerName: 'Is VIP?',
          checkbox: true,
          body: (rowData: any) => {
            const data = this.state.vipOrPoliticalData.filter((item: any) => item.id === rowData.id)

            return (
              <Checkbox name='vip' checked={data[0]?.vip} onChange={e => this.handleCheckboxChange(e, rowData.id)} />
            )
          }
        }

        const newObj3 = {
          field: 'image',
          headerName: 'PROFILE UPLOAD',
          body: (rowData: any) => {
            return (
              <div>
                {' '}
                <AddAPhotoIcon
                  onClick={() => {
                    this.setState({ ...this.state, memberId: rowData?.memberId })
                    this.fileInput.click()
                  }}
                />
                <input
                  type='file'
                  ref={input => {
                    this.fileInput = input // Assign input, but don't return anything
                  }}
                  onChange={e => this.handleImage(e)}
                  accept='image/jpeg, image/png'
                  style={{ display: 'none' }}
                />
              </div>
            )
          }
        }

        colDef.push(newObj1)
        colDef.push(newObj2)
        colDef.push(newObj3)
        this.setState({
          ...this.state,
          columnsDefinations: colDef
        })
      }
    })
  }

  hasAccess = (accessName: any, method: any) => { }

  handleOpen = () => { }

  style = {
    fontSize: '12px',
    whiteSpace: 'nowrap',

    // width: "100%",
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }

  handleSave = () => {
    memberService.saveMemberType(this.state.vipOrPoliticalData).subscribe(res => {
      // memberService.saveMemberType(this.state.vipOrPoliticalData, this.state.sourceId).subscribe(res => {
      this.setState({ ...this.state, openSnack: true, alertMsg: 'Member types updated' })
      window.location.reload()
    })
  }

  handleMsgErrorClose = () => {
    this.setState({ ...this.state, openSnack: false, alertMsg: '' })
  }
  render() {
    const { classes } = this.props
    const { searchType, searchResult, selectedId, textInput, reloadTable, state2 } = this.state
    console.log("asdfg", searchResult)

    const dataSource1$: any = (pageRequest: any) => {
      memberPageRequest = { ...memberPageRequest, ...pageRequest }
      const resetKeys = (keys: any) => {
        keys.forEach((key: any) => delete memberPageRequest[key]);
      };

      if (searchType === 1) {
        resetKeys(["key", "value", "qutationNumber", "name"]);
      } else if (searchType === 2) {
        resetKeys(["key", "value", "prospectId", "name"]);
        memberPageRequest.qutationNumber = textInput.trim();
      } else if (searchType === 3) {
        resetKeys(["qutationNumber", "prospectId", "name"]);
        Object.assign(memberPageRequest, { key: "MEMBERSHIP_No", value: textInput.trim() });
      } else if (searchType === 4) {
        resetKeys(["qutationNumber", "prospectId", "MEMBERSHIP_No", "key", "value"]);
        memberPageRequest.name = textInput.trim();
      }
      if (searchType === 5) {

        const formatDate = (value: any) => {
          const renewalDate = new Date(value);
          renewalDate.setTime(renewalDate.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours
          return renewalDate.getTime();
        };

        // Remove unnecessary properties
        delete memberPageRequest.key;
        delete memberPageRequest.value;
        delete memberPageRequest.sort;
        delete memberPageRequest['prospectId'];
        memberPageRequest['qutationNumber'] = textInput.trim();

        // Format the dates and set them in the request
        memberPageRequest['fromDate'] = formatDate(state2.policyStartDate);
        memberPageRequest['toDate'] = formatDate(state2.policyEndDate);
      }

      // if (searchType === 1) {
      //   delete memberPageRequest.key
      //   delete memberPageRequest.value
      //   delete memberPageRequest['qutationNumber']
      // }

      return memberProcessService.getMemberRequests(memberPageRequest).pipe(
        tap((data: any) => {
          this.setState({ ...this.state, sourceId: data?.content[0]?.sourceId, memberId: data?.content[0]?.memberId })
        }),
        map((data: any) => {
          this.setState({ ...this.state, reloadTable: false })
          const content: any = data.content
          const temp: any = []

          content.map((el: any) => {
            const obj = {
              id: el?.id,
              vip: el?.vip,
              political: el?.political
            }

            temp.push(obj)
          })
          this.setState({ ...this.state, vipOrPoliticalData: temp })

          const records = content.map((item: any) => {
            item['dateOfBirth'] = moment(item.dateOfBirth).format('DD MMM YYYY')

            return item
          })

          data.content = records
          this.setState({ ...this.state, isLoading: false })

          return data
        })
      )
    }

    return (
      <>
        <Toast ref={this.toast} />{' '}
        <div className='grid-type'>
          <Snackbar
            open={this.state.openSnack}
            autoHideDuration={4000}
            onClose={this.handleMsgErrorClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert onClose={this.handleMsgErrorClose} severity='error'>
              {this.statealertMsg}
            </Alert>
          </Snackbar>
          <Grid container spacing={7}>
            <Grid item xs={12} className={classes.searchBoxContainer}>
              <Grid
                item
                xs={2}
                className='grid-type-drop'
                style={{ marginInline: '17px', marginTop: '0px', paddingBottom: '13px' }}
              >
                <FormControl variant='outlined' className={classes.formControl}>
                  <InputLabel id='member-type-select-outlined-label'>Type</InputLabel>
                  <Select
                    labelId='member-type-select-outlined-label'
                    id='member-type-select-outlined'
                    label='Type'
                    value={searchType}
                    onChange={this.doChangeSearchType}
                  >
                    <MenuItem value={1}>Proposer</MenuItem>
                    <MenuItem value={2}>Quotation</MenuItem>
                    <MenuItem value={3}>Membership Number</MenuItem>
                    <MenuItem value={4}>Member Name</MenuItem>
                    <MenuItem value={5}>Date</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                {searchType === 1 ? (
                  <Autocomplete
                    id="search-member-box"
                    options={searchResult}
                    getOptionLabel={(option) => option?.displayName || ''}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {option.displayName} ({option.mobileNo})
                      </li>
                    )}
                    className={classes.searchMemberBox}
                    onChange={this.doSelectValue}
                    onInputChange={(event, value) => this.doSearch(value)}
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" label="Search Member" />
                    )}
                  />
                ) : searchType === 5 ? (
                  <Box display={'flex'} alignItems={'center'} minWidth={'400px'}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        views={['year', 'month', 'day']}
                        label='Policy Start Date'
                        value={this.state.state2.policyStartDate}
                        onChange={(date: any) => this.handleState2Change('policyStartDate', date)}
                        renderInput={params => (
                          <TextField {...params} margin='normal' style={{ marginTop: '0px' }} variant='outlined' />
                        )}
                      />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        views={['year', 'month', 'day']}
                        label='Policy End Date'
                        value={this.state.state2.policyEndDate}
                        onChange={(date: any) => this.handleState2Change('policyEndDate', date)}
                        renderInput={params => (
                          <TextField {...params} margin='normal' style={{ marginTop: '0px' }} variant='outlined' />
                        )}
                      />
                    </LocalizationProvider>
                    <Button
                      type='button'
                      onClick={this.onButtonClick2}
                      style={{ margin: '10px 0px 10px 10px', minWidth: '65px', textAlign: 'center' }}
                    >
                      {this.state.isLoading ? (
                        <CircularProgress style={{ color: 'white', width: '15px', height: '15px' }} />
                      ) : (
                        'Search'
                      )}
                    </Button>
                  </Box>
                ) : (
                  <Box display={'flex'}>
                    <TextField
                      variant='outlined'
                      onChange={e => this.setState({ ...this.state, textInput: e.target.value })}
                    />
                    <Button type='button' onClick={this.onButtonClick} style={{ margin: '10px 0px 10px 10px' }}>
                      {this.state.isLoading ? (
                        <CircularProgress style={{ color: 'white', width: '15px', height: '15px' }} />
                      ) : (
                        'Search'
                      )}
                    </Button>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Box display={'flex'} justifyContent={'flex-end'} marginBottom={'10px'}>
            <Button onClick={this.handleSave}>Save changes</Button>
          </Box>

          <FettleDataGrid
            $datasource={dataSource1$}
            config={this.configuration}
            columnsdefination={this.state.columnsDefinations}
            onEdit={this.openEditSection}
            selectedId={selectedId}
            style={this.style}
            reloadtable={reloadTable}
          />
        </div>
      </>
    )
  }
}
export default withRouter(withStyles(useStyles)(MemberListComponent))
