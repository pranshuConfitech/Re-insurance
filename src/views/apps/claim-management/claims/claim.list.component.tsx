
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { makeStyles } from '@mui/styles'
import { map } from 'rxjs/operators'
import { Typography } from '@mui/material'
import { TreeItem, TreeView } from '@mui/lab'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { AgentsService } from '@/services/remote-api/api/agents-services'
import { ReimbursementService } from '@/services/remote-api/api/claims-services/claim.reimbursement.services'
import { InvoiceService } from '@/services/remote-api/api/invoice-services'
import claimsReviewModel, { REIM_STATUS_MSG_MAP } from './shared'
import { PoliticalDot, VIPDot } from '../common/dot.comnponent'
import { BenefitService, ProvidersService } from '@/services/remote-api/fettle-remote-api'
import RoleService from '@/services/utility/role'
import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'
import { TabPanel, TabView } from 'primereact/tabview'

const roleService = new RoleService()
const PAGE_NAME = 'AGENT'

const useStyles = makeStyles(theme => ({
  tableBg: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  },
  agentListButton: {
    marginLeft: '5px'
  },
  categoryButton: {
    marginLeft: '5px',
    marginBottom: '5px'
  },
  root: {}
}))

const invoiceService = new InvoiceService()
const agentsService = new AgentsService()
const reimbursementService = new ReimbursementService()
const benefitService = new BenefitService()
const providerService = new ProvidersService()

const dataSource$ = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true,
    claimCategory: 'CLAIM',
    claimSource: 'PRE_AUTH'
  }
) => {
  pageRequest.sort = ['rowCreatedDate dsc']

  if (pageRequest.searchKey) {
    pageRequest['memberShipNo'] = pageRequest.searchKey
    pageRequest['preAuthStatus'] = pageRequest.searchKey
    pageRequest['policyNo'] = pageRequest.searchKey
    pageRequest['memberName'] = pageRequest.searchKey
    pageRequest['claimStatus'] = pageRequest.searchKey
  }

  return reimbursementService.getAllReimbursements(pageRequest).pipe(
    map(data => {
      const content = data.content

      const records = content.map((item: any) => {
        item['admissionDate'] = new Date(item.expectedDOA).toLocaleDateString()
        item['dischargeDate'] = new Date(item.expectedDOD).toLocaleDateString()
        item['status'] = item.reimbursementStatus
          ? REIM_STATUS_MSG_MAP[item.reimbursementStatus as keyof typeof REIM_STATUS_MSG_MAP]
          : null

        return item
      })

      data.content = records

      return data
    })
  )
}
const dataSourceCredit$ = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true,
    claimCategory: 'CREDIT_CLAIM',
    claimSource: 'CI'
  }
) => {
  pageRequest.sort = ['rowCreatedDate dsc']

  if (pageRequest.searchKey) {
    pageRequest['memberShipNo'] = pageRequest.searchKey
    pageRequest['preAuthStatus'] = pageRequest.searchKey
    pageRequest['policyNo'] = pageRequest.searchKey
    pageRequest['memberName'] = pageRequest.searchKey
    pageRequest['claimStatus'] = pageRequest.searchKey
  }

  return reimbursementService.getAllReimbursements(pageRequest).pipe(
    map(data => {
      const content = data.content

      const records = content.map((item: any) => {
        item['admissionDate'] = new Date(item.expectedDOA).toLocaleDateString()
        item['dischargeDate'] = new Date(item.expectedDOD).toLocaleDateString()
        item['status'] = item.reimbursementStatus
          ? REIM_STATUS_MSG_MAP[item.reimbursementStatus as keyof typeof REIM_STATUS_MSG_MAP]
          : null

        return item
      })

      data.content = records

      return data
    })
  )
}

const dataSourceReim$ = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true,
    claimCategory: 'REIMBURSEMENT_CLAIM',
    claimSource: 'NONE'
  },
  // dateOfAdmission = {
  //   page: 0,
  //   size: 10,
  //   summary: true,
  //   active: true,
  //   fromExpectedDOA: policyStartDate === '' ? 0 : policyStartDate - 5.5 * 60 * 60 * 1000,
  //   toExpectedDOA:
  //     policyEndDate === ''
  //       ? policyStartDate === ''
  //         ? 0
  //         : Number(policyStartDate) - 5.5 * 60 * 60 * 1000
  //       : !policyEndDate
  //         ? Number(policyStartDate) - 5.5 * 60 * 60 * 1000
  //         : Number(policyEndDate) - 5.5 * 60 * 60 * 1000
  // },
  // dateofDischarge = {
  //   page: 0,
  //   size: 10,
  //   summary: true,
  //   active: true,
  //   fromExpectedDOD: toPolicyStartDate === '' ? 0 : toPolicyStartDate - 5.5 * 60 * 60 * 1000,
  //   toExpectedDOD:
  //     toPolicyEndDate === ''
  //       ? toPolicyStartDate === ''
  //         ? 0
  //         : toPolicyStartDate - 5.5 * 60 * 60 * 1000
  //       : !toPolicyEndDate
  //         ? toPolicyStartDate - 5.5 * 60 * 60 * 1000
  //         : toPolicyEndDate - 5.5 * 60 * 60 * 1000
  // }
) => {
  pageRequest.sort = ['rowCreatedDate dsc']
  pageRequest.claimType = ['REIMBURSEMENT_CLAIM']

  if (pageRequest.searchKey) {
    pageRequest['memberShipNo'] = pageRequest.searchKey.toUpperCase().trim()
    pageRequest['claimStatus'] = pageRequest.searchKey.toUpperCase().trim()
    pageRequest['policyNo'] = pageRequest.searchKey.toUpperCase().trim()
    pageRequest['id'] = pageRequest.searchKey.toUpperCase().trim()
    pageRequest['memberName'] = pageRequest.searchKey.toUpperCase().trim()
    delete pageRequest.searchKey
  }

  return reimbursementService
    // .getAllReimbursements(policyStartDate ? dateOfAdmission : toPolicyStartDate ? dateofDischarge : pageRequest)
    .getAllReimbursements(pageRequest)
    .pipe(
      map(data => {
        const content = data.content

        const records = content.map((item: any) => {
          item['admissionDate'] = new Date(item.expectedDOA).toLocaleDateString()
          item['dischargeDate'] = new Date(item.expectedDOD).toLocaleDateString()
          item['status'] = item.reimbursementStatus
            ? REIM_STATUS_MSG_MAP[item.reimbursementStatus as keyof typeof REIM_STATUS_MSG_MAP]
            : null

          return item
        })

        data.content = records

        return data
      })
    )
}

const getColor = (status: any) => {
  switch (status) {
    case 'Pending Evaluation':
      return { background: 'rgba(149,48,55,0.5)', border: 'rgba(149,48,55,1)' }
    case 'Evaluation in progress':
      return {
        background: 'rgba(255, 252, 127, 0.5)'
      }
    case 'Requested for evaluation':
      return {
        background: '#002776',
        border: 'rgba(4, 59, 92, 1)',
        color: '#f1f1f1'
      }
    case 'Approved':
      return {
        background: 'rgba(1, 222, 116, 0.5)',
        border: 'rgba(1, 222, 116, 1)'
      }
    case 'Rejected':
      return { background: 'rgba(255,50,67,0.5)', border: 'rgba(255,50,67,1)' }
    case 'Document Requested':
      return {
        background: '#ffc107',
        color: '#212529'
      }
    case 'Approved failed':
      return { background: 'rgb(139, 0, 0,0.5)', border: 'rgb(139, 0, 0)' }
    case 'Draft':
      return {
        background: '#17a2b8',
        color: '#f1f1f1'
      }
    case 'Waiting for Claim':
      return {
        background: '#ffc107',
        color: '#212529'
      }
    case 'Cancelled':
      return { background: '#c70000', color: '#f1f1f1' }
    case 'Reverted':
      return {
        background: '#808000',
        color: '#f1f1f1'
      }
    case 'Claim Initiated':
      return {
        background: 'rgba(38,194, 129, 0.5)',
        border: 'rgba(38, 194, 129, 1)'
      }
    case 'Document Submited':
      return {
        background: '#D80E51',
        color: '#f1f1f1'
      }
    default:
      return {
        background: 'rgba(227, 61, 148, 0.5)',
        border: 'rgba(227, 61, 148, 1)'
      }
  }
}

export default function ClaimsListComponent(props: any) {
  const history = useRouter()
  const [rows, setRows] = React.useState(props.rows)
  const [openAgentListModal, setOpenAgentListModal] = React.useState(false)
  const [reloadTable, setReloadTable] = React.useState<boolean>(false)
  const [reversalModal, setReversalModal] = React.useState(false)
  const [selectedAgentsList, setSelectedAgentsList] = React.useState([])
  const [selectedInvoiceForReversal, setSelectedInvoiceForReversal] = React.useState('')
  const [tabvalue, setTabValue] = React.useState(0)
  const [selectedReimForReview, setSelectedReimForReview] = React.useState(claimsReviewModel())
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [benefits, setBenefits] = useState()
  const [providers, setProviders] = useState<any>()

  const handleTabChange = (event: any, newValue: any) => {
    setTabValue(newValue)
  }

  const classes = useStyles()

  useEffect(() => {
    const subscription = benefitService
      .getAllBenefit({ page: 0, size: 1000, summary: true, active: true, sort: ['rowCreatedDate dsc'] })
      .subscribe((result: any) => {
        setBenefits(result.content)
      })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const subscription = providerService
      .getProviders({ page: 0, size: 10000, summary: true, active: true, sort: ['rowCreatedDate dsc'] })
      .subscribe((result: any) => {
        setProviders(result.content)
      })

    return () => subscription.unsubscribe()
  }, [])

  const renderBenefitWithCost = (rowData: any) => {
    const benefitsWithCost = rowData.benefitsWithCost?.map((ben: any, index: number) => {
      const provider = providers?.find((p: any) => p?.id === ben?.providerId)

      return (
        <li key={`${ben?.providerId}-${ben?.benefitId}-${index}`}>
          {provider?.providerBasicDetails?.name} | {ben.benefitName} | {ben.iname} | {ben.diagnosisName} :
          <b>{ben.estimatedCost}</b>
        </li>
      )
    })

    return <span>{benefitsWithCost}</span>
  }

  const columnsDefinations = [
    {
      field: 'id',
      headerName: 'Claim No.',
      body: (rowData: any) => (
        <span
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => handleMembershipClick(rowData, 'membershipNo')}
        >
          {rowData.id}
        </span>
      )
    },
    { field: 'memberShipNo', headerName: 'Membership No.' },
    {
      field: 'memberName',
      headerName: 'Name',
      body: (rowData: any) => (
        <span>
          {rowData?.memberName}
          {rowData.vip && <VIPDot />}
          {rowData.political && <PoliticalDot />}
        </span>
      )
    },
    { field: 'policyNumber', headerName: 'Policy', expand: true },
    { field: 'admissionDate', headerName: 'Admission Date', expand: true },
    { field: 'dischargeDate', headerName: 'Discharge Date', expand: true },

    // {
    //   field: 'provider',
    //   headerName: 'Providers & Cost',
    //   body: handleProvider,
    // },
    {
      field: 'benefitWithCost',
      headerName: 'Estimated Cost',
      body: (rowData: any) => (
        <p style={{ width: '250px', whiteSpace: 'break-spaces' }}>{renderBenefitWithCost(rowData)}</p>
      )
    },

    // { field: 'claimCategory', headerName: 'Claim Category' },
    // {
    //   field: 'vip',
    //   headerName: 'Is Vip ?',
    //   body: (rowData:any )=> <span>{rowData.vip ? 'Yes' : 'No'}</span>,
    // },
    // {
    //   field: 'political',
    //   headerName: 'Is Political ?',
    //   body: (rowData:any )=> <span>{rowData.political ? 'Yes' : 'No'}</span>,
    // },
    {
      field: 'status',
      headerName: 'Status',
      body: (rowData: any) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <span
            style={{
              backgroundColor: getColor(rowData.status).background,

              // opacity: '0.9',
              color: getColor(rowData.status).color ? getColor(rowData.status).color : '#3c3c3c',
              fontSize: '12px',
              fontWeight: '600',
              borderRadius: '8px',
              padding: '6px'
            }}
          >
            {rowData.status}
          </span>
        </div>
      )
    }
  ]

  const columnsDefinationsCredit = [
    {
      field: 'id',
      headerName: 'Claim No.',
      body: (rowData: any) => (
        <span
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => handleMembershipClick(rowData, 'membershipNo')}
        >
          {rowData.id}
        </span>
      )
    },
    { field: 'memberShipNo', headerName: 'Membership No.' },
    {
      field: 'memberName',
      headerName: 'Name',
      body: (rowData: any) => (
        <span>
          {rowData?.memberName}
          {rowData.vip && <VIPDot />}
          {rowData.political && <PoliticalDot />}
        </span>
      )
    },
    { field: 'policyNumber', headerName: 'Policy', expand: true },
    { field: 'admissionDate', headerName: 'Admission Date', expand: true },
    { field: 'dischargeDate', headerName: 'Discharge Date', expand: true },
    {
      field: 'benefitWithCost',
      headerName: 'Estimated Cost',
      body: (rowData: any) => (
        <p style={{ width: '250px', whiteSpace: 'break-spaces' }}>{renderBenefitWithCost(rowData)}</p>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      body: (rowData: any) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <span
            style={{
              backgroundColor: getColor(rowData.status).background,

              // opacity: '0.9',
              color: getColor(rowData.status).color ? getColor(rowData.status).color : '#3c3c3c',
              fontSize: '12px',
              fontWeight: '600',
              borderRadius: '8px',
              padding: '6px'
            }}
          >
            {rowData.status}
          </span>
        </div>
      )
    }
  ]

  const columnsDefinationsReim = [
    {
      field: 'id',
      headerName: 'Claim No.',
      body: (rowData: any) => (
        <span
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => handleMembershipClick(rowData, 'membershipNo')}
        >
          {rowData.id}
        </span>
      )
    },
    { field: 'memberShipNo', headerName: 'Membership No.' },
    {
      field: 'memberName',
      headerName: 'Name',
      body: (rowData: any) => (
        <span>
          {rowData?.memberName}
          {rowData.vip && <VIPDot />}
          {rowData.political && <PoliticalDot />}
        </span>
      )
    },

    { field: 'policyNumber', headerName: 'Policy', expand: true },
    { field: 'admissionDate', headerName: 'Admission Date', expand: true },
    { field: 'dischargeDate', headerName: 'Discharge Date', expand: true },
    {
      field: 'benefitWithCost',
      headerName: 'Estimated Cost',
      body: (rowData: any) => (
        <p style={{ width: '250px', whiteSpace: 'break-spaces' }}>{renderBenefitWithCost(rowData)}</p>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      body: (rowData: any) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <span
            style={{
              backgroundColor: getColor(rowData.status).background,

              // opacity: '0.9',
              color: getColor(rowData.status).color ? getColor(rowData.status).color : '#3c3c3c',
              fontSize: '12px',
              fontWeight: '600',
              borderRadius: '8px',
              padding: '6px'
            }}
          >
            {rowData.status}
          </span>
        </div>
      )
    }
  ]

  const handleMembershipClick = (rowData: any, field: any) => {
    history.push(`/claims/claims-details/${rowData.id}?mode=viewOnly`)
  }

  const handleOpen = () => {
    history.push('/claims/claims?mode=create')
  }

  const handleReimOpen = () => {
    history.push('/claims/claims-reimbursement?mode=create')
  }

  const handleCreditOpen = () => {
    history.push('/claims/credit?mode=create')
  }

  React.useEffect(() => {
    setRows(props.rows)
  }, [props.rows])

  const openEditSection = (reim: any) => {
    history.push(`/claims/claims-details/${reim.id}?mode=edit`)
  }

  const openEditSectionReim = (reim: any) => {
    history.push(`/claims/claims-reimbursement/${reim.id}?mode=view`)
  }

  const openReviewSection = (reim: any) => {
    history.push(`/claims/claims/review/${reim.id}`)
  }

  const onRequestForReview = (reim: any) => {
    reimbursementService.editReimbursement({}, reim.id, 'requested').subscribe(res => {
      history.push('/claims/claims?mode=viewList')
      setReloadTable(true)
    })
  }

  const disableEnhance = (item: any) => {
    return item.reimbursementStatus != 'PENDING_EVALUATION' && item.reimbursementStatus != 'DRAFT'
  }

  const disableReviewButton = (item: any) => {
    return item.reimbursementStatus == 'PENDING_EVALUATION'
  }

  const disableRequestButton = (item: any) => {
    return item.reimbursementStatus != 'PENDING_EVALUATION'
  }

  const xlsColumns = [
    'id',
    'memberShipNo',
    'memberName',
    'policyNumber',
    'admissionDate',
    'dischargeDate',
    'provider',
    'benefitWithCost',
    'status'
  ]
  const [userType, setUserType] = React.useState<any>(null)

  const configuration = {
    enableSelection: false,
    rowExpand: true,
    scrollHeight: '300px',
    pageSize: 10,
    actionButtons: [
      {
        key: 'update_preauth',
        icon: 'pi pi-pencil',
        disabled: disableEnhance,
        className: classes.categoryButton,
        onClick: openEditSection,
        tooltip: 'Enhance'
      }
    ],

    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      addCreateButton: true,
      onCreateButtonClick: handleOpen,
      text: 'Claims',
      enableGlobalSearch: true,
      searchText: 'Search by Membership No, Name, Policy'
    }
  }

  const configurationCredit = {
    enableSelection: false,
    rowExpand: true,
    scrollHeight: '300px',
    pageSize: 10,
    actionButtons: [
      {
        key: 'update_preauth',
        icon: 'pi pi-pencil',
        disabled: disableEnhance,
        className: classes.categoryButton,
        onClick: openEditSection,
        tooltip: 'Enhance'
      }
    ],

    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      addCreateButton: true,
      onCreateButtonClick: handleCreditOpen,
      text: 'Credit Claims',
      enableGlobalSearch: true,
      searchText: 'Search by Membership No, Name, Policy'
    }
  }

  const configurationReim = {
    enableSelection: false,
    rowExpand: true,
    scrollHeight: '300px',
    pageSize: 10,
    actionButtons: [
      {
        key: 'update_preauth',
        icon: 'pi pi-pencil',
        disabled: disableEnhance,
        className: classes.categoryButton,
        onClick: openEditSection,
        tooltip: 'Enhance'
      }
    ],

    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      addCreateButton: true,
      onCreateButtonClick: handleReimOpen,
      text: 'Claim Reimbursement',
      enableGlobalSearch: true,
      searchText: 'Search by Claim No, Membership No, Name, Policy id or Status',
      selectionMenuButtonText: 'Search',
      // selectionMenus: [
      //   { icon: '', label: 'Date Of Admission', onClick: dateofAdmission },
      //   { icon: '', label: 'Date Of Discharge', onClick: dateofDischarge }
      // ]

      // selectionMenuButtonText: 'Action',
    }
  }

  return (
    // <FettleDataGrid
    //   $datasource={dataSource$}
    //   config={configuration}
    //   columnsdefination={columnsDefinations}
    //   onEdit={openEditSection}
    //   reloadtable={reloadTable}
    // />
    <TabView
      scrollable
      style={{ fontSize: '14px' }}
      activeIndex={activeIndex}
      onTabChange={(e: any) => setActiveIndex(e.index)}
    >
      <TabPanel leftIcon='pi pi-user mr-2' header='Claims'>
        <FettleDataGrid
          $datasource={dataSource$}
          config={configuration}
          columnsdefination={columnsDefinations}
          onEdit={openEditSection}
          reloadtable={reloadTable}
        />
      </TabPanel>
      <TabPanel leftIcon='pi pi-user mr-2' header='Credit Claims'>
        <FettleDataGrid
          $datasource={dataSourceCredit$}
          config={configurationCredit}
          columnsdefination={columnsDefinationsCredit}
          onEdit={openEditSection}
          reloadtable={reloadTable}
        />
      </TabPanel>
      <TabPanel leftIcon='pi pi-user mr-2' header='Reimbursement Claims'>
        <FettleDataGrid
          $datasource={dataSourceReim$}
          config={configurationReim}
          columnsdefination={columnsDefinationsReim}
          onEdit={openEditSectionReim}
          reloadtable={reloadTable}
        />
      </TabPanel>
    </TabView>
  )
}
