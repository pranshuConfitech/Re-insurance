import React from 'react'

import { useRouter } from 'next/navigation'

import { makeStyles } from '@mui/styles'

import { map } from 'rxjs/operators'

import { BankService } from '@/services/remote-api/api/banks-services/bank.services'
import RoleService from '@/services/utility/role'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const PAGE_NAME = 'BANK'
const roleService = new RoleService()

const useStyles = makeStyles((theme: any) => ({
  tableBg: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  }
}))

const bankService = new BankService()

const dataSource$: any = (
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
    pageRequest['bankName'] = pageRequest.searchKey.trim()
    pageRequest['contactPersonName'] = pageRequest.searchKey.trim()
    pageRequest['contactPersonContactNo'] = pageRequest.searchKey.trim()
    pageRequest['contactPersonEmailId'] = pageRequest.searchKey.trim()
  }

  delete pageRequest.searchKey

  return bankService.getBanks(pageRequest).pipe(
    map(data => {
      const content = data.content

      const records = content.map(item => {
        return item
      })

      data.content = records

      return data
    })
  )
}

// const dataSource$ = (pageRequest = {
//   page: 0,
//   size: 5,
//   summary: true,
//   active: true
// }) => {
//   BankService.getAgents(pageRequest).
//     map(val => {
//     val.content.forEach(ele => {
//       ele['primaryContact'] = ele.agentBasicDetails.contactNos[0].contactNo
//     })
//     return val
//   })
// };
const columnsDefinations = [
  { field: 'bankBasicDetails.bankName', headerName: 'Bank Name' },
  { field: 'bankBasicDetails.code', headerName: 'Bank Code' },
  {
    field: 'bankBasicDetails.contactNo',
    headerName: 'Contact No'
  },
  {
    field: 'bankAddressDetails.bankContactPersonDetails.name',
    headerName: 'Contact Person Name'
  },
  {
    field: 'bankAddressDetails.bankContactPersonDetails.contactNo',
    headerName: 'Contact Person Number'
  }
]

export default function BankListComponent(props: any) {
  const router = useRouter()
  const [rows, setRows] = React.useState(props.rows)

  const classes = useStyles()

  const handleOpen = () => {
    router.push('/bank-management/banks?mode=create')
  }

  React.useEffect(() => {
    setRows(props.rows)
  }, [props.rows])

  const openEditSection: any = (agent: any) => {
    router.push(`/bank-management/banks/${agent.id}?mode=edit`)
  }

  const xlsColumns = [
    'clientType',
    'agentType',
    'validFrom',
    'bankBasicDetails.bankName',
    'bankBasicDetails.code',
    'bankBasicDetails.contactNo',
    'bankAddressDetails.bankContactPersonDetails.name',
    'bankAddressDetails.bankContactPersonDetails.contactNo'
  ]

  const configuration = {
    enableSelection: false,
    scrollHeight: '300px',
    pageSize: 10,
    actionButtons: roleService.checkActionPermission(PAGE_NAME, 'UPDATE', openEditSection),
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
      onCreateButtonClick: handleOpen,
      text: 'Bank Management',
      enableGlobalSearch: true,
      searchText: 'Search by code, name, person name, person number'
    }
  }

  return (
    <div>
      {/* <DataGrid rows={rows} columns={props.columns} pageSize={10} /> */}
      <FettleDataGrid
        $datasource={dataSource$}
        config={configuration}
        columnsdefination={columnsDefinations}
        onEdit={openEditSection}
      />
    </div>
  )
}
