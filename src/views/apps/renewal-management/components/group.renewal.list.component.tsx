import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { makeStyles } from '@mui/styles'

// import { FundService } from '../@/app/api/remote-api/api/fund-services';
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'

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
  { field: 'policyNumber', headerName: 'Policy No' },
  { field: 'clientName', headerName: 'Client' },
  { field: 'accounHandler', headerName: 'Account handler' },
  { field: 'policyStartDate', headerName: 'Start date' },
  { field: 'policyEndDate', headerName: 'End date' },
  { field: 'transactionCurrency', headerName: 'Transaction Currency' }
]

interface GroupRenewalListProps {
  selectedDays?: number | null
}

const GroupRenewalListComponent = ({ selectedDays }: GroupRenewalListProps) => {
  const classes = useStyles()
  const router = useRouter()
  const [selectedItems, setSelectedItems]: any = useState([])

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
      // If a card is clicked, use the findPolicies API
      if (selectedDays !== null && selectedDays !== undefined) {
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

            return item
          })

          data.content = records

          return data
        })
      )
    },
    [selectedDays]
  )
  const [disableRenew, setDisableRenew] = useState(true)

  const handleOpen = () => {
    router.push('/renewals/pending?mode=create')
  }

  const openEditSection = (policy: any) => {
    checkQuotationByPolicy(policy.id)

    // checkQuotationByPolicy(`/renewals/pending/${policy.id}?mode=edit`);
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

  const configuration: any = {
    enableSelection: true,
    scrollHeight: '300px',
    isRowSelectable: selectableRow,
    pageSize: 10,
    actionButtons: [
      {
        label: 'RENEW',
        variant: 'text',
        className: 'ui-button-warning',
        onClick: openEditSection
      }
    ],
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
      searchText: 'Search by code, name, type, contact',
      onSelectionChange: handleSelectedRows
    }
  }

  return (
    <>
      <FettleDataGrid
        key={`group-grid-${selectedDays}`}
        $datasource={dataSource$}
        config={configuration}
        columnsdefination={columnsDefinations}
        onEdit={openEditSection}
      />
    </>
  )
}

export default GroupRenewalListComponent
