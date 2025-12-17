import React, { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { makeStyles } from '@mui/styles'

import 'date-fns'

import { map, switchMap } from 'rxjs/operators'

import { Toast } from 'primereact/toast'

import ProviderBlacklistModal from './modals/provider.blackist.modal'
import ProviderCategoryHistoryModal from './modals/provider.category.history.modal'
import ProviderCategoryListModal from './modals/provider.category.list.modal'
import ProviderCategorizeModal from './modals/provider.category.modal'
import ProviderUnBlacklistModal from './modals/provider.unblacklist.modal'
import ProviderContractDetailsModal from './modals/providercontractDetails.modal'
import RoleService from '@/services/utility/role'
import { ProviderTypeService } from '@/services/remote-api/api/master-services/provider.type.service'
import { ProvidersService } from '@/services/remote-api/api/provider-services/provider.services'
import { PlanService } from '@/services/remote-api/api/plan-services/plan.service'
import { CategoryService } from '@/services/remote-api/api/master-services/category.service'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material'
import { useFormik } from 'formik'
import { Visibility, Edit, CheckCircle, Cancel } from '@mui/icons-material'

const PAGE_NAME = 'PROVIDER'
const roleService = new RoleService()
const providertypeservice = new ProviderTypeService()

const ModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: '#FFF',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

const useStyles = makeStyles((theme: any) => ({
  tableBg: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  },
  formControl: {
    margin: theme?.spacing ? theme.spacing(1) : '8px',
    minWidth: 120
  },
  categoryButton: {
    marginLeft: '5px',
    marginBottom: '5px'
  }
}))

const providerService = new ProvidersService()
const planservice = new PlanService()
const categoryservice = new CategoryService()

const pls$ = planservice.getPlans()
const ct$ = categoryservice.getCategories()

interface Provider {
  id: string | number;
  // Add other provider properties as needed
}

interface DecisionDialogState {
  open: boolean;
  type: 'APPROVED' | 'REJECTED' | '';
  provider: Provider | null;
}

export default function ProviderPendingListComponent(props: { filterTypeCode?: string; reloadTrigger?: number }) {
  const history = useRouter()
  const [rows, setRows] = React.useState()
  const [planList, setPlanList] = React.useState([])
  const [categoryList, setCategoryList] = React.useState([])
  const [data, setData] = React.useState([])
  const [selectionBlacklistMenuDisabled, setSelectionBlacklistMenuDisabled] = React.useState(true)
  const [selectionUnBlacklistMenuDisabled, setSelectionUnBlacklistMenuDisabled] = React.useState(true)
  const [reloadTable, setReloadTable] = React.useState(false)
  const [categoryModal, setCategoryModal] = React.useState(false)
  const [categoryData, setCategoryData] = React.useState([])
  const [selectedStatus, setSelectedStatus] = React.useState('active')
  const toast: any = React.useRef(null)

  const [state, setState] = React.useState({
    action: '',
    openBlacklistModal: false,
    openUnBlacklistModal: false,
    openContractDetailsModal: false,
    openCategoryModal: false,
    openCategoryListModal: false,
    providerCategoryHistorys: [],
    providerIds: [],
    blackListedProviderids: []
  })

  const [provider, setProvider] = React.useState('')

  const [decisionDialog, setDecisionDialog] = React.useState<DecisionDialogState>({
    open: false,
    type: '',
    provider: null
  })

  const formik = useFormik({
    initialValues: {
      comment: ''
    },
    onSubmit: (values) => {
      if (!decisionDialog.provider) return;

      const payload = {
        action: decisionDialog.type,
        comment: values.comment?.trim() || ''
      }

      providerService.approveProvider(String(decisionDialog.provider.id ?? ''), payload).subscribe({
        next: (res) => {
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: `Provider ${decisionDialog.type === 'APPROVED' ? 'Approved' : 'Rejected'} successfully`,
            life: 3000
          })
          setDecisionDialog({ open: false, type: '', provider: null })
          formik.resetForm()
          setReloadTable(true)
        },
        error: (error) => {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to process request',
            life: 3000
          })
        }
      })
    }
  })

  const dataSource$ = (
    pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: selectedStatus === 'active'
    }
  ) => {
    pageRequest.sort = ['rowLastUpdatedDate dsc']
    pageRequest.active = selectedStatus === 'active'

    if (pageRequest.searchKey) {
      const searchKey = pageRequest.searchKey.trim()
      pageRequest['code'] = searchKey
      pageRequest['type'] = searchKey
      pageRequest['name'] = searchKey
      pageRequest['contactNo'] = searchKey
      // Add specialization and county/city to search
      pageRequest['specialization'] = searchKey
      pageRequest['county'] = searchKey
      pageRequest['city'] = searchKey
    }

    delete pageRequest.searchKey

    return providerService
      .getPendingProviders(pageRequest)
      .pipe(
        map(data => {
          const content: any = data.content

          setData(content)

          const records = content.map((item: any) => {
            item['providerBasicDetails']['primaryContact'] = item.providerBasicDetails.contactNos[0].contactNo
            item['blacklist'] = item.blackListed ? 'Yes' : 'No'
            item['contracted'] = item.providerBasicDetails?.contracted ?? false
            item['suspended'] = item.suspended || item.isSuspended ? 'Yes' : 'No'
            item['category'] = item?.providerCategoryHistorys[0]?.categoryId
            // Format email
            const primaryEmail = item?.providerBasicDetails?.emails?.find((e: any) => e.contactType === 'PRIMARY')?.emailId;
            item['providerBasicDetails']['email'] = primaryEmail || item?.providerBasicDetails?.primaryEmail || item?.providerBasicDetails?.email || 'N/A';
            // Format specializations
            const specializations = item?.providerBasicDetails?.specializations || [];
            item['specializations'] = specializations.length > 0
              ? specializations.map((spec: any) => spec.name || spec).join(', ')
              : 'N/A';
            // Add county/city for searchability
            const addresses = item?.providerAddresses?.addresses || [];
            const countyCityList: string[] = [];
            addresses.forEach((addr: any) => {
              const addrDetails = addr?.addressDetails || {};
              if (addrDetails.county) countyCityList.push(addrDetails.county);
              if (addrDetails.city) countyCityList.push(addrDetails.city);
            });
            item['searchableCountyCity'] = countyCityList.join(', ') || 'N/A';

            return item
          })

          data.content = records

          return data
        })
      )
      .pipe(
        switchMap(data => {
          return providertypeservice.getProviderTypes().pipe(
            map(pt => {
              data.content.forEach((pr: any) => {
                pt.content.forEach(providertype => {
                  if (pr.providerBasicDetails.type === providertype.code) {
                    pr['providerTypeName'] = providertype.name
                  }
                })
              })

              return data
            })
          )
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

  useEffect(() => {
    if (props?.filterTypeCode !== undefined) {
      setReloadTable(prev => !prev)
    }
  }, [props?.filterTypeCode])

  useEffect(() => {
    if (props?.reloadTrigger !== undefined && props?.reloadTrigger > 0) {
      setReloadTable(prev => !prev)
    }
  }, [props?.reloadTrigger])

  const classes = useStyles()

  const handleOpen = () => {
    history.push('/provider?mode=create')
  }

  const closeBlacklistModal = () => {
    setState({
      ...state,
      openBlacklistModal: false
    })
  }

  const closeUnBlacklistModal = () => {
    setState({
      ...state,
      openUnBlacklistModal: false
    })
  }

  const closeContractDetailsModal = () => {
    setState({
      ...state,
      openContractDetailsModal: false
    })
  }

  const closeCategorizeModal = () => {
    setState({
      ...state,
      openCategoryModal: false
    })
  }

  const closeCategoryListModal = () => {
    setState({
      ...state,
      openCategoryListModal: false
    })
  }

  const closeCategoryHistoryModal = () => {
    setCategoryModal(false)
  }

  const openEditSection = (provider: any) => {
    history.push(`/provider/${provider.id}?mode=edit`)
  }

  const openViewSection = (provider: any) => {
    history.push(`/provider/${provider.id}?mode=view`)
  }

  const handleSelectedRows = (selectedProviders: any) => {
    if (selectedProviders.length == 0) {
      setSelectionBlacklistMenuDisabled(true)
      setSelectionUnBlacklistMenuDisabled(true)
    } else {
      let sp = []
      let blp = []
      const filteredLength = selectedProviders.filter((p: any) => !p.blackListed).length
      const blFilterdLength = selectedProviders.filter((p: any) => p.blackListed).length

      setSelectionBlacklistMenuDisabled(filteredLength != selectedProviders.length)
      setSelectionUnBlacklistMenuDisabled(blFilterdLength != selectedProviders.length)
      sp = selectedProviders.filter((p: any) => !p.blackListed).map((ele: any) => ele.id)
      blp = selectedProviders.filter((p: any) => p.blackListed).map((ele: any) => ele.id)
      setState({
        ...state,
        providerIds: sp,
        blackListedProviderids: blp
      })
      setProvider(blp.toString())
    }
  }

  const handleBlacklistSubmit = (payload: any) => {
    payload['providerIds'] = state.providerIds
    providerService.blacklistProvider(payload).subscribe(res => {
      closeBlacklistModal()
      setReloadTable(true)
    })
  }

  const handleUnBlacklistSubmit = (payload: any) => {
    payload['providerIds'] = state.blackListedProviderids
    providerService.unblacklistProvider(payload).subscribe(res => {
      closeBlacklistModal()
      setReloadTable(true)
    })
  }

  const handleContractDetails = (payload: any) => {
    providerService.getProviderAllDetails(payload, state?.providerIds.toString() || provider).subscribe(res => {
      closeContractDetailsModal()
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'SuccessFully Added',
        life: 3000
      })
      setReloadTable(true)
    })
  }

  const handleCategorizeSubmit = (payload: any) => {
    closeCategorizeModal()
    payload['providerIds'] = state.providerIds
    providerService.categorizeProvider(payload).subscribe(res => {
      closeCategorizeModal()
      setReloadTable(true)
    })
  }

  const openBlacklist = (e: any) => {
    setState({
      ...state,
      openBlacklistModal: true
    })
  }

  const openUnBlacklist = (e: any) => {
    setState({
      ...state,
      openUnBlacklistModal: true
    })
  }

  const openContractDetails = (e: any) => {
    setState({
      ...state,
      openContractDetailsModal: true
    })
  }

  const openCategorize = (provider: any) => {
    setState({
      ...state,
      openCategoryModal: true
    })
  }

  const showCategoryList = (val: any) => {
    val.providerCategoryHistorys.forEach((value: any, i: number) => {
      value['startDate'] = new Date(value.startDate)
      value['id'] = i
      planList.forEach((pln: any) => {
        if (value.planId === pln.id) {
          value['planName'] = pln.name
        }
      })
      categoryList.forEach((cat: any) => {
        if (value.categoryId === cat.id) {
          value['catName'] = cat.name
        }
      })
    })
    setState({
      ...state,
      openCategoryListModal: true,
      providerCategoryHistorys: val.providerCategoryHistorys
    })
  }

  const handleDecisionClick = (provider: Provider, type: 'APPROVED' | 'REJECTED') => {
    setDecisionDialog({
      open: true,
      type,
      provider
    })
  }

  const handleCloseDecisionDialog = () => {
    setDecisionDialog({ open: false, type: '', provider: null })
    formik.resetForm()
  }

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus)
    setReloadTable(!reloadTable)
  }

  const onCategoryClick = (rowData: any) => {
    setCategoryModal(true)
    const temp: any = data.filter((item: any) => {
      return item.id === rowData.id
    })
    setCategoryData(temp[0]?.providerCategoryHistorys)
  }

  const actionBtnList = [
    {
      key: 'view_provider',
      icon: <Visibility fontSize="small" />,
      color: '#18a2b8',
      className: `ui-button-info ${classes.categoryButton}`,
      onClick: openViewSection
    },
    {
      key: 'update_provider',
      icon: <Edit fontSize="small" />,
      color: '#fbac05',
      className: `ui-button-warning ${classes.categoryButton}`,
      onClick: openEditSection
    },
    {
      key: 'update_quotation',
      icon: <CheckCircle fontSize="small" />,
      color: '#4caf50',
      className: `ui-button-success ${classes.categoryButton}`,
      onClick: (provider: any) => handleDecisionClick(provider, 'APPROVED')
    },
    {
      key: 'reject_provider',
      icon: <Cancel fontSize="small" />,
      color: '#f44336',
      className: `ui-button-danger ${classes.categoryButton}`,
      onClick: (provider: any) => handleDecisionClick(provider, 'REJECTED')
    }
  ]

  const xlsColumns = [
    'providerBasicDetails.name',
    'providerBasicDetails.code',
    'providerBasicDetails.email',
    'providerTypeName',
    'providerBasicDetails.primaryContact',
    'specializations',
    'category',
    'blacklist'
  ]

  const columnsDefinations = [
    {
      field: 'providerBasicDetails.name',
      headerName: 'Provider Name',
      align: 'left'
    },
    {
      field: 'providerBasicDetails.code',
      headerName: 'Provider Code',
      align: 'center'
    },
    {
      field: 'providerBasicDetails.email',
      headerName: 'Email',
      align: 'center'
    },
    {
      field: 'providerBasicDetails.primaryContact',
      headerName: 'Contact',
      align: 'center'
    },
    {
      field: 'specializations',
      headerName: 'Specialization',
      align: 'center'
    }
  ]

  const configuration: any = {
    useAccordionMode: true, // Enable accordion mode
    enableSelection: false, // Disable checkboxes in accordion mode
    scrollHeight: '600px',
    pageSize: 10,
    actionButtons: actionBtnList,
    columnOptions: {
      enableSorting: true,
      enableColumnMenu: true,
      enableFiltering: true,
      enableColumnVisibility: false
    },

    // Expandable configuration for accordion mode
    expandableConfig: {
      gridTemplate: '60px 1fr 1fr 1fr 1fr 1fr 1fr auto', // Use 'auto' for action column to fit content

      // Disable status color dot by returning transparent
      getStatusColor: () => 'transparent',

      // Render expanded content
      renderExpandedContent: (row: any) => (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: '20px',
          padding: '0 20px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>
              Email
            </span>
            <span style={{ color: '#212529', fontSize: '14px', fontWeight: '500' }}>
              {row.providerBasicDetails?.emails?.[0]?.emailId ||
                row.providerBasicDetails?.primaryEmail ||
                row.providerBasicDetails?.email ||
                'N/A'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>
              Category
            </span>
            <span
              style={{
                color: '#007bff',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              onClick={() => onCategoryClick(row)}
            >
              {row.category || 'N/A'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>
              Provider ID
            </span>
            <span style={{ color: '#212529', fontSize: '14px', fontWeight: '500' }}>
              {row.id || 'N/A'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>
              Last Updated
            </span>
            <span style={{ color: '#212529', fontSize: '14px', fontWeight: '500' }}>
              {row.rowLastUpdatedDate ? new Date(row.rowLastUpdatedDate).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      )
    },

    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      // text: 'Provider Management',

      // Enable status toggle
      enableStatusToggle: true,
      onStatusChange: handleStatusChange,

      // Enable global search
      enableGlobalSearch: true,
      searchText: 'Search by code, name, specialization & county / city',

      // Color legend (disabled as per requirement)
      // colorLegend: [
      //   { color: '#28a745', label: 'Contracted' },
      //   { color: '#17a2b8', label: 'Non-contracted' },
      //   { color: '#dc3545', label: 'Suspended' }
      // ]
    }
  }

  return (
    <div>
      <Toast ref={toast} />
      <FettleDataGrid
        $datasource={dataSource$}
        columnsdefination={columnsDefinations}
        onEdit={openEditSection}
        config={configuration}
        reloadtable={reloadTable}
      />

      {/* Decision Dialog */}
      <Dialog
        open={decisionDialog.open}
        onClose={handleCloseDecisionDialog}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {decisionDialog.type === 'APPROVED' ? 'Approve Provider' : 'Reject Provider'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              name="comment"
              label="Reason"
              multiline
              rows={4}
              value={formik.values.comment}
              onChange={formik.handleChange}
              placeholder="Please enter the reason for your decision"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={handleCloseDecisionDialog}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color={decisionDialog.type === 'APPROVED' ? 'success' : 'error'}
              disabled={formik.isSubmitting}
            >
              {decisionDialog.type === 'APPROVED' ? 'Approve' : 'Reject'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {state.openBlacklistModal ? (
        <ProviderBlacklistModal
          closeBlacklistModal={closeBlacklistModal}
          openBlacklistModal={state.openBlacklistModal}
          handleBlacklistSubmit={handleBlacklistSubmit}
        />
      ) : null}
      {state.openUnBlacklistModal ? (
        <ProviderUnBlacklistModal
          closeUnBlacklistModal={closeUnBlacklistModal}
          openUnBlacklistModal={state.openUnBlacklistModal}
          handleUnBlacklistSubmit={handleUnBlacklistSubmit}
        />
      ) : null}
      {state.openContractDetailsModal ? (
        <ProviderContractDetailsModal
          closeContractDetailsModal={closeContractDetailsModal}
          openContractDetailsModal={state.openContractDetailsModal}
          handleContractDetails={handleContractDetails}
        />
      ) : null}
      {state.openCategoryModal ? (
        <ProviderCategorizeModal
          closeCategorizeModal={closeCategorizeModal}
          openCategoryModal={state.openCategoryModal}
          handleCategorizeSubmit={handleCategorizeSubmit}
          providerIds={state.providerIds}
          planList={planList}
          categoryList={categoryList}
        />
      ) : null}

      {state.openCategoryListModal ? (
        <ProviderCategoryListModal
          openCategoryListModal={state.openCategoryListModal}
          closeCategoryListModal={closeCategoryListModal}
          planList={planList}
          categoryList={categoryList}
          providerCategoryHistorys={state.providerCategoryHistorys}
        />
      ) : null}

      {categoryModal ? (
        <ProviderCategoryHistoryModal
          openCategoryListModal={categoryModal}
          closeCategoryListModal={closeCategoryHistoryModal}
          categoryList={categoryData}
        />
      ) : null}
    </div>
  )
}
