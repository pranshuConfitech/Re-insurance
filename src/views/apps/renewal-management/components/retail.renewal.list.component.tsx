import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { makeStyles } from '@mui/styles'

import { map } from 'rxjs/operators'

import { RenewalService } from '@/services/remote-api/api/renewal-services'

import { ClientService, PolicyService } from '@/services/remote-api/fettle-remote-api'
import { QuotationService } from '@/services/remote-api/api/quotation-services'
import RoleService from '@/services/utility/role'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const PAGE_NAME = 'PLAN'
const roleService = new RoleService()
const renewalService = new RenewalService()
const policyService = new PolicyService()
const quotationService = new QuotationService()
const clientService = new ClientService()


const useStyles = makeStyles(theme => ({
  tableBg: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  },
  renewalListButton: {
    marginLeft: '5px'
  }
}))

const columnsDefinations = [
  { field: 'policyNumber', headerName: 'Policy No', align: 'left', width: 150 },
  { field: 'clientName', headerName: 'Client', align: 'left', width: 200 },
  {
    field: 'policyStartDate',
    headerName: 'Policy Date',
    align: 'center',
    width: 180,
    body: (rowData: any) => (
      <span>{rowData.policyStartDate} - {rowData.policyEndDate}</span>
    )
  },
  { field: 'members', headerName: 'No of Members', align: 'center', width: 120 },
  { field: 'lossRatio', headerName: 'Loss Ratio', align: 'center', width: 100 },
  {
    field: 'totalPremiumAmountWithTax',
    headerName: 'Premium',
    align: 'right',
    width: 120,
    body: (rowData: any) => {
      const premium = rowData.totalPremiumAmountWithTax || 0
      return premium.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  }
]

interface RetailRenewalListProps {
  selectedDays?: number | null
}

const RetailRenewalListComponent = ({ selectedDays }: RetailRenewalListProps) => {
  const classes = useStyles()
  const router = useRouter()
  const [selectedItems, setSelectedItems]: any = useState([])
  const [disableRenew, setDisableRenew] = useState(true)

  useEffect(() => {
    console.log('RetailRenewalListComponent - selectedDays changed:', selectedDays)
  }, [selectedDays])

  const dataSource$: any = React.useCallback(
    (
      pageRequest: any = {
        page: 0,
        size: 10,
        summary: true,
        active: true,
        availableForRenewal: true
      }
    ) => {
      console.log('dataSource$ called with selectedDays:', selectedDays)
      // If a card is clicked, use the findPolicies API
      if (selectedDays !== null && selectedDays !== undefined) {
        console.log('Calling findPolicies API with days:', selectedDays)
        return policyService.findPolicies(selectedDays).pipe(
          map(data => {
            // Transform the data to match the expected format
            const records = (data || []).map((item: any) => {
              item['policyStartDate'] = new Date(item.policyStartDate).toLocaleDateString()
              const date = new Date(item.policyEndDate)
              const month = date.getUTCMonth() + 1
              const day = date.getUTCDate()
              const year = date.getUTCFullYear()
              let ed = `${month}/${day}/${year}`
              item['policyEndDate'] = ed
              item['productName'] = item.productName || 'Product Info'
              return item
            })

            // Return in page format
            return {
              content: records,
              totalElements: records.length,
              totalPages: 1,
              size: records.length,
              number: 0
            }
          })
        )
      }

      // Otherwise use the original renewal service
      pageRequest.sort = ['rowCreatedDate dsc']

      if (pageRequest.searchKey) {
        // Add search parameters for policyNo and clientName
        pageRequest['policyNo'] = pageRequest.searchKey.trim()
        pageRequest['clientName'] = pageRequest.searchKey.trim()
        pageRequest['availableForRenewal'] = true

        delete pageRequest.active
      } else {
        pageRequest.summary = true
        pageRequest.active = true
        pageRequest.availableForRenewal = true
      }

      delete pageRequest.searchKey

      return renewalService.getRenewalPolicy(pageRequest).pipe(
        map(data => {
          const content = data.content

          const records = content.map((item: any) => {
            item['policyStartDate'] = new Date(item.policyStartDate).toLocaleDateString()
            const date = new Date(item.policyEndDate)
            const month = date.getUTCMonth() + 1
            const day = date.getUTCDate()
            const year = date.getUTCFullYear()
            let ed = `${month}/${day}/${year}`
            item['policyEndDate'] = ed

            // Add product name placeholder (you may need to fetch this from another API)
            item['productName'] = item.productName || 'Product Info'

            return item
          })

          data.content = records

          return data
        })
      )
    },
    [selectedDays]
  )

  const handleOpen = () => {
    router.push('/renewals/pending?mode=create')
  }

  const openEditSection = (policy: any) => {
    checkQuotationByPolicy(policy.id)
  }

  const handleSelectedRows = (selectedRows: any) => {
    if (selectedRows.length !== 0) {
      setSelectedItems(selectedRows)

      if (selectedRows.length == 1) {
        setDisableRenew(false)
      } else {
        setDisableRenew(true)
      }
    } else {
      setSelectedItems([])
      setDisableRenew(true)
    }
  }

  const checkQuotationByPolicy = (policyId: any) => {
    const pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      renewalPolicyId: policyId
    }

    quotationService.getQuoationDetails(pageRequest).subscribe(data => {
      if (data.content && data.content.length != 0) {
        const quotationDta = data.content[0]

        if (quotationDta.renewalPolicyId) {
          router.push(`/quotations/${quotationDta.id}?mode=edit&type=renewal`)
        }

        if (!quotationDta.renewalPolicyId) {
          router.push(`/quotations/?mode=create&type=renewal&policyId=` + policyId)
        }
      }

      if (data.content && data.content.length == 0) {
        router.push(`/quotations/?mode=create&type=renewal&policyId=` + policyId)
      }
    })
  }

  const handleRenew = () => {
    if (selectedItems.length !== 0) {
      const policyId = selectedItems[0].id

      checkQuotationByPolicy(policyId)
    }
  }

  const selectableRow = (e: any) => {
    return true
  }

  const xlsColumns = [
    'policyNumber',
    'corporateName',
    'accounHandler',
    'policyStartDate',
    'policyEndDate',
    'transactionCurrency'
  ]

  const handleAccordionExpand = React.useCallback((row: any) => {
    const policyId = row.id
    console.log('Accordion expanded for policy ID:', policyId)
  }, [])

  const configuration: any = {
    useAccordionMode: true,
    enableSelection: true,
    scrollHeight: '600px',
    isRowSelectable: selectableRow,
    pageSize: 10,
    onAccordionExpand: handleAccordionExpand,
    expandableConfig: {
      gridTemplate: '60px 60px 150px 200px 180px 120px 100px 120px',
      renderExpandedContent: (row: any) => {
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px', padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Plan Name</span>
              <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                {row.planName || 'N/A'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Category</span>
              <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                {row.policyOrigin || 'N/A'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Contact</span>
              <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                {row.clientCode || 'N/A'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Product Name</span>
              <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                {row.productName || 'N/A'}
              </span>
            </div>
          </div>
        )
      }
    },
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      addCreateButton: true,
      createButtonText: 'Renew',
      onCreateButtonClick: handleRenew,
      createButtonDisabled: disableRenew,
      text: 'Renewal',
      enableGlobalSearch: true,
      searchText: 'Search by policy number, client name',
      onSelectionChange: handleSelectedRows
    }
  }

  return (
    <FettleDataGrid
      key={`retail-grid-${selectedDays}`}
      $datasource={dataSource$}
      config={configuration}
      columnsdefination={columnsDefinations}
      onEdit={openEditSection}
    />
  )
}

export default RetailRenewalListComponent
