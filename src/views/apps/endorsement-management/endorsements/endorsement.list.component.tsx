import 'date-fns'
import React, { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { makeStyles } from '@mui/styles'

import { map } from 'rxjs/operators'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add'


// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
// import DateFnsUtils from '@date-io/date-fns';
// import { Button } from 'primereact/button'
import { Button } from '@mui/material'

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { Box, Modal, TextField, Typography, useTheme } from '@mui/material'

import { CloseOutlined, Edit, Visibility } from '@mui/icons-material'

import { EndorsementService } from '@/services/remote-api/api/endorsement-services'
import { CategoryService } from '@/services/remote-api/api/master-services'
import { PlanService } from '@/services/remote-api/api/plan-services'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const useStyles = makeStyles((theme: any) => ({
  tableBg: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  },
  formControl: {
    margin: theme.spacing ? theme.spacing(1) : '8px',
    minWidth: 120
  },
  categoryButton: {
    marginLeft: '5px',
    marginBottom: '5px'
  }
}))

const modalStyle: any = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  background: '#fff',

  // border: '2px solid #000',
  boxShadow: 24,
  padding: '2% 3%',
  borderRadius: '20px'
}

const endorsementservice = new EndorsementService()
const planservice = new PlanService()
const categoryservice = new CategoryService()

const pls$ = planservice.getPlans()
const ct$ = categoryservice.getCategories()

const columnsDefinations = [
  { field: 'id', headerName: 'Endorsement Number', align: 'left' },
  { field: 'endorsementDateVal', headerName: 'Endorsement Date', align: 'center' },
  // { field: 'EndorsementType', headerName: 'Endorsement Type' },
  { field: 'ProposerName', headerName: 'Proposer Name', align: 'center' },
  { field: 'status', headerName: 'Status', align: 'center' }
  // { field: 'status', headerName: 'Status' }
]

export default function EndorsementListComponent(props: any) {
  const history = useRouter()
  const router = useRouter()
  const [rows, setRows] = React.useState(props.rows)
  const [planList, setPlanList] = React.useState([])
  const [categoryList, setCategoryList] = React.useState([])
  const [generateInvoiceMenuDisabled, setGenerateInvoiceMenuDisabled] = React.useState(true)
  const [open, setOpen] = React.useState(false)
  const [searchType, setSearchType] = React.useState()
  const [endorsementStartDate, setEndorsementStartDate] = React.useState<any>()
  const [endorsementEndDate, setEndorsementEndDate] = React.useState<any>()
  const [reloadTable, setReloadTable] = React.useState(false)
  const [selectedEndorsements, setSelectedEndorsements] = React.useState<any>([])
  const [selectedPolicyId, setSelectedPolicyId] = React.useState(null)
  const [dashCount, setDashCount] = React.useState<any>({});
  const [filterType, setFilterType] = React.useState<any>({
    action: '',
    status: ''
  });
  const theme = useTheme()

  const dataSource$: any = (
    pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true
    },
    page = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      endorsementStartDate: endorsementStartDate === '' ? 0 : endorsementStartDate - 5.5 * 60 * 60 * 1000,
      endorsementEndDate:
        endorsementEndDate === ''
          ? endorsementStartDate === ''
            ? 0
            : Number(endorsementStartDate) - 5.5 * 60 * 60 * 1000
          : !endorsementEndDate
            ? Number(endorsementStartDate) - 5.5 * 60 * 60 * 1000
            : Number(endorsementEndDate) - 5.5 * 60 * 60 * 1000
    }
  ) => {
    pageRequest.sort = ['rowLastUpdatedDate dsc']

    if (pageRequest.searchKey) {
      pageRequest['id'] = pageRequest.searchKey.trim()
    }

    delete pageRequest.searchKey

    if (filterType.status && filterType.status !== '') {
      pageRequest['status'] = filterType.status
    }

    if (filterType.action && filterType.action !== '') {
      pageRequest['action'] = filterType.action
    }

    return endorsementservice.getEndorsements(searchType === 1 ? page : pageRequest).pipe(
      map(data => {
        const content = data.content

        const records = content.map(item => {
          item['endorsementDateVal'] = new Date(item.endorsementDate).toLocaleDateString()

          return item
        })

        data.content = records

        return data
      })
    )
  }

  const useObservable2 = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        const tableArr: any = []

        if (result.content && result.content.length > 0) {
          result.content.forEach((ele: any) => {
            tableArr.push({
              name: ele.name,
              id: ele.id
            })
          })
        }

        setter(tableArr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable2(pls$, setPlanList)
  useObservable(ct$, setCategoryList)

  const classes = useStyles()

  const handleOpen = () => {
    history.push('/endorsements?mode=create')
  }

  React.useEffect(() => {
    setRows(props.rows)
  }, [props.rows])

  useEffect(() => countDash(), [])

  const openEditSection = (provider: any) => {
    history.push(`/endorsements/${provider.id}?mode=edit`)
  }

  const isSelectable = (rowData: any) => {
    if (!selectedPolicyId) {
      if (rowData.status !== 'APPROVED') {
        alert('Only APPROVED endorsements can be selected')

        return false
      }

      return true
    }

    const isSelectableRow = rowData.policyId === selectedPolicyId

    if (rowData.status !== 'APPROVED') {
      alert('Only APPROVED endorsements can be selected')

      return false
    }

    if (!isSelectableRow) {
      alert('You cannot select endorsements of different policies')

      return false
    }

    return isSelectableRow
  }

  const handleSelectedRows = (selectedEndorsements: any) => {
    if (selectedEndorsements.length === 0) {
      setGenerateInvoiceMenuDisabled(true)
      setSelectedPolicyId(null)
    } else {
      setGenerateInvoiceMenuDisabled(false)
      setSelectedEndorsements(selectedEndorsements)

      if (!selectedPolicyId) {
        setSelectedPolicyId(selectedEndorsements[0].policyId)
      }
    }
  }

  const generateInvoice = (e: any) => {
    if (selectedEndorsements.length > 0) {
      const EndorsementIds: any = []

      selectedEndorsements.forEach((el: any) => {
        EndorsementIds.push(el.id)
      })
      history.push(
        `/invoices?mode=create&policy=${selectedEndorsements[0]?.policyId}&client=${selectedEndorsements[0]?.clientId}&id=${EndorsementIds}`
      )
    } else {
      alert('Please select Endorsement!!!')
    }
  }

  const xlsColumns = ['id', 'endorsementDateVal', 'policyId', 'adjustPremiumAmt']

  const handleAppove = (endorsement: any) => {
    endorsementservice.approveEndorsement(endorsement.id).subscribe(res => {
      setReloadTable(true)
      setTimeout(() => {
        setReloadTable(false)
      }, 1000)
    })
  }
  const countDash = () => {
    endorsementservice.getEndorsementDashCount('').subscribe(res => setDashCount(res))
  }


  const actionBtnList = [
    { key: 'update_provider', icon: <Visibility fontSize="small" />, color: '#18a2b8', className: `ui-button-warning ${classes.categoryButton}`, onClick: openEditSection },
    { key: 'update_quotation', icon: <Edit fontSize="small" />, color: '#fbac05', disabled: (q: any) => q.status !== 'PREMIUM_CALCULATION_COMPLETED', className: `ui-button-warning ${classes.categoryButton}`, onClick: handleAppove }
  ]
  const configuration: any = {
    useAccordionMode: true,
    enableSelection: true,
    hideStatusDot: false,
    scrollHeight: '600px',
    actionButtons: actionBtnList,
    pageSize: 10,
    expandableConfig: {
      gridTemplate: '60px 1fr 1fr 1fr 1fr 80px',
      getStatusColor: (row: any) => {
        const actionMapping: { [key: string]: string } = {
          'ADDITION': '#28a745',                     // Green - Addition of Member
          'DELETION': '#17a2b8',                     // Teal - Deletion of Member
          'UPDATE_BASIC_DETAILS': '#fc862b',         // Orange - Update Endorsement
          'PLAN_CATEGORY_CHANGE': '#007bff',        // Bright Blue - Plan Category Change
          'SUM_INSURED_CHANGE': '#dc3545',          // Red - Sum Insured Change
          'SUSPENTION': '#6f42c1',                  // Purple - Suspension Of Member (note the typo in data)
          'SUSPENSION_OF_MEMBER': '#6f42c1',        // Purple - Suspension Of Member
          'REINSTATEMENT': '#20c997',               // Mint Green - Reinstatement
          'SUSPENSION_OF_POLICY': '#d80f51',       // Magenta - Suspension of Policy
          'REINSTATEMENT_OF_POLICY': '#795548',    // Brown - Reinstatement of Policy
          'SUSPENSION_OF_BENEFIT': '#6610f2',      // Deep Violet - Suspension of Benefit
          'REINSTATEMENT_OF_BENEFIT': '#e83e8c'    // Pink - Reinstatement of Benefit
        };
        return actionMapping[row.action] || '#28a745';
      },
      renderExpandedContent: (row: any) => (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px', padding: '0 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Policy No.</span>
            <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
              {row?.policyNo || 'N/A'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Source</span>
            <span
              style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}
            // onClick={() => setCategoryModal(true)}
            >
              {row?.sourceType || 'N/A'}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Premium Amount</span>

            <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
              {row?.totalPremium}
            </span>
          </div>
          {/* <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Status</span>
            <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
              {row?.status || row.providerBasicDetails?.primaryEmail || row.providerBasicDetails?.email || 'N/A'}
            </span>
          </div> */}
        </div>
      )
    },
    // actionButtons: [
    //   {
    //     icon: 'pi pi-user-edit',
    //     className: 'ui-button-warning',
    //     onClick: openEditSection,
    //     disabled: (q: any) => q.status === 'APPROVED'
    //   },
    //   {
    //     key: 'update_quotation',
    //     icon: 'pi pi-check',
    //     onClick: handleAppove,
    //     tooltip: 'Approve',
    //     disabled: (q: any) => q.status !== 'PREMIUM_CALCULATION_COMPLETED'
    //   }
    // ],
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      addCreateButton: false,
      onCreateButtonClick: handleOpen,
      // text: 'Endorsement Management',
      enableGlobalSearch: true,
      colorLegend: [
        { color: '#28a745', label: 'Addition of Member', onClick: () => handleActionClick("ADDITION"), isActive: filterType.action === "ADDITION" ? true : false },
        { color: '#17a2b8', label: 'Deletion of Member', onClick: () => handleActionClick("DELETION"), isActive: filterType.action === "DELETION" ? true : false },
        { color: '#fc862b', label: 'Update Endorsement', onClick: () => handleActionClick("UPDATE_BASIC_DETAILS"), isActive: filterType.action === "UPDATE_BASIC_DETAILS" ? true : false },
        { color: '#007bff', label: 'Plan Category Change', onClick: () => handleActionClick("CATEGORY_CHANGE"), isActive: filterType.action === "CATEGORY_CHANGE" ? true : false },
        { color: '#dc3545', label: 'Sum Insured Change', onClick: () => handleActionClick("SUM_INSURED_CHANGED"), isActive: filterType.action === "SUM_INSURED_CHANGED" ? true : false },
        { color: '#6f42c1', label: 'Suspension Of Member', onClick: () => handleActionClick("SUSPENTION"), isActive: filterType.action === "SUSPENTION" ? true : false },
        { color: '#20c997', label: 'Reinstatement', onClick: () => handleActionClick("REINSTATEMENT"), isActive: filterType.action === "REINSTATEMENT" ? true : false },
        { color: '#d80f51', label: 'Suspension of Policy', onClick: () => handleActionClick("SUSPENSION_OF_POLICY"), isActive: filterType.action === "SUSPENSION_OF_POLICY" ? true : false },
        { color: '#795548', label: 'Reinstatement of Policy', onClick: () => handleActionClick("REINSTATEMENT_OF_POLICY"), isActive: filterType.action === "REINSTATEMENT_OF_POLICY" ? true : false },
        { color: '#6610f2', label: 'Suspension of Benefit', onClick: () => handleActionClick("ADDISUSPENSION_OF_BENEFITTION"), isActive: filterType.action === "ADDISUSPENSION_OF_BENEFITTION" ? true : false },
        { color: '#e83e8c', label: 'Reinstatement of Benefit', onClick: () => handleActionClick("REINSTATEMENT_OF_BENEFIT"), isActive: filterType.action === "REINSTATEMENT_OF_BENEFIT" ? true : false },
      ],


      searchText: 'Search by Endorsement number',
      onSelectionChange: handleSelectedRows,
      selectionMenus: [{ icon: '', label: 'Generate Invoice', onClick: generateInvoice }],
      selectionMenuButtonText: 'Action'
    }
  }

  const onSearch = () => {
    setOpen(false)
    setReloadTable(true)
    setTimeout(() => {
      setReloadTable(false)
      setEndorsementStartDate(null)
      setEndorsementEndDate(null)
    }, 1000)
  }

  function handleCountClick(type: any) {
    setFilterType({ ...filterType, status: type });
    setReloadTable(true)
    setTimeout(() => {
      setReloadTable(false)
      setEndorsementStartDate(null)
      setEndorsementEndDate(null)
    }, 1000)
  }

  function handleActionClick(type: any) {
    setFilterType({ ...filterType, action: type });
    setReloadTable(true)
    setTimeout(() => {
      setReloadTable(false)
      setEndorsementStartDate(null)
      setEndorsementEndDate(null)
    }, 1000)
  }

  return (
    <div>
      <div style={{
        fontSize: '24px',
        fontWeight: '600',
        color: '#212529',
        marginBottom: '20px',
        padding: '0'
      }}>
        Endorsement Management
      </div>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',  // 1 column on extra small screens
            sm: 'repeat(2, 1fr)',  // 2 columns on small screens
            md: 'repeat(4, 1fr)',  // 4 columns on medium and up
          },
          gap: 2,
          marginBottom: '22px',
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0px 3px 6px #00000029',
        }}
      >
        {/* Total Endorsements */}
        <Box
          onClick={() => handleCountClick('')}
          sx={{
            borderRadius: '8px',
            border: '1px solid #d80f51',
            padding: '12px 16px',
            color: filterType.status === '' ? '#fff' : '#d80f51',
            fontSize: { xs: '12px', sm: '13px' },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minHeight: '50px',
            backgroundColor: filterType.status === '' ? '#d80f51' : 'transparent',
            cursor: "pointer"
          }}
        >
          <ThumbUpAltIcon sx={{ width: '20px', height: '20px', flexShrink: 0 }} />
          <Box sx={{ overflow: 'hidden' }}>
            <Box component="span" sx={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              Total Endorsements <Box component="span" sx={{ fontWeight: 700 }}>({dashCount?.total})</Box>
            </Box>
          </Box>
        </Box>

        {/* Pending Approval */}
        <Box
          onClick={() => handleCountClick('PENDING')}
          sx={{
            borderRadius: '8px',
            border: '1px solid #fbad03',
            padding: '12px 16px',
            color: filterType.status === 'PENDING' ? '#fff' : '#fbad03',
            fontSize: { xs: '12px', sm: '13px' },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minHeight: '50px',
            cursor: "pointer",
            backgroundColor: filterType.status === 'PENDING' ? '#fbad03' : 'transparent',
          }}
        >
          <HourglassEmptyIcon sx={{ width: '20px', height: '20px', flexShrink: 0 }} />
          <Box sx={{ overflow: 'hidden' }}>
            <Box component="span" sx={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              Pending Approval <Box component="span" sx={{ fontWeight: 700 }}>({dashCount?.pendindApproval})</Box>
            </Box>
          </Box>
        </Box>

        {/* Approved */}
        <Box
          onClick={() => handleCountClick('APPROVED')}
          sx={{
            borderRadius: '8px',
            border: '1px solid #20c997',
            padding: '12px 16px',
            color: filterType.status === 'APPROVED' ? '#fff' : '#20c997',
            fontSize: { xs: '12px', sm: '13px' },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minHeight: '50px',
            cursor: "pointer",
            backgroundColor: filterType.status === 'APPROVED' ? '#20c997' : 'transparent',
          }}
        >
          <CheckCircleIcon sx={{ width: '20px', height: '20px', flexShrink: 0 }} />
          <Box sx={{ overflow: 'hidden' }}>
            <Box component="span" sx={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              Approved <Box component="span" sx={{ fontWeight: 700 }}>({dashCount?.approved})</Box>
            </Box>
          </Box>
        </Box>

        {/* Rejected */}
        <Box
          onClick={() => handleCountClick('REJECTED')}
          sx={{
            borderRadius: '8px',
            border: '1px solid #a9132fff',
            padding: '12px 16px',
            color: filterType.status === 'REJECTED' ? '#fff' : '#a9132fff',
            fontSize: { xs: '12px', sm: '13px' },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minHeight: '50px',
            cursor: "pointer",
            backgroundColor: filterType.status === 'REJECTED' ? '#a9132fff' : 'transparent',
          }}
        >
          <CancelIcon sx={{ width: '20px', height: '20px', flexShrink: 0 }} />
          <Box sx={{ overflow: 'hidden' }}>
            <Box component="span" sx={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              Rejected <Box component="span" sx={{ fontWeight: 700 }}>({dashCount?.rejected})</Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <div>
        {/* Header Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '0px 16px',
          }}
        >
          <Button
            variant='contained'
            size='small'
            onClick={handleOpen}
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: '#28a745',
              borderRadius: '6px 6px 0px 0px',
              '&:hover': { backgroundColor: '#218838' },
            }}
          >
            Create
          </Button>
        </div>

        {/* Data Grid */}
        <div
          style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0px 3px 6px #00000029',
          }}
        >
          <FettleDataGrid
            $datasource={dataSource$}
            columnsdefination={columnsDefinations}
            onEdit={openEditSection}
            config={configuration}
            isRowSelectable={isSelectable}
            reloadtable={reloadTable}
          />
        </div>
      </div>



      <Modal open={open} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
        <Box style={modalStyle}>
          <Box>
            <Box id='alert-dialog-slide-description'>
              {searchType == 1 && (
                <>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Box component='h3' marginBottom={'10px'}>
                      Endorsement Date
                    </Box>
                    <CloseOutlined onClick={() => setOpen(false)} style={{ cursor: 'pointer' }} />
                  </Box>
                  <Box display={'flex'} marginBottom={'10px'}>
                    <Box display={'flex'}>
                      <Typography
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '14px',
                          fontWeight: '700',
                          textTransform: 'capitalize'
                        }}
                      >
                        From
                      </Typography>
                      &nbsp;
                      <span style={{ display: 'flex', alignItems: 'center' }}>:</span>&nbsp;
                      <Box style={{ marginBottom: '10px' }}>
                        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            views={['year', 'month', 'date']}
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            autoOk={true}
                            id="date-picker-inline"
                            value={endorsementStartDate}
                            onChange={date => setEndorsementStartDate(date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            value={endorsementStartDate}
                            onChange={(date: any) => setEndorsementStartDate(date)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                margin='normal'
                                style={{ marginBottom: '0px' }}
                                variant='outlined'
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Box>
                    <Box display={'flex'} marginLeft={'3%'}>
                      <Typography
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '14px',
                          fontWeight: '700',
                          textTransform: 'capitalize'
                        }}
                      >
                        To
                      </Typography>
                      &nbsp;
                      <span style={{ display: 'flex', alignItems: 'center' }}>:</span>&nbsp;
                      <Box style={{ marginBottom: '10px' }}>
                        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            views={['year', 'month', 'date']}
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            autoOk={true}
                            id="date-picker-inline"
                            value={endorsementEndDate}
                            onChange={date => setEndorsementEndDate(date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            value={endorsementEndDate}
                            onChange={(date: any) => setEndorsementEndDate(date)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                margin='normal'
                                style={{ marginBottom: '0px' }}
                                variant='outlined'
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Box>
          <Box marginTop={'10%'}>
            <Button
              style={{ backgroundColor: theme?.palette?.primary?.main || '#D80E51', color: '#fff' }}
              onClick={onSearch}
            >
              Search
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}
