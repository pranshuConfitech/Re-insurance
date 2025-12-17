import React from 'react'

import { useRouter } from 'next/navigation'

import { makeStyles } from '@mui/styles'

import { map } from 'rxjs/operators'

import { FundService } from '@/services/remote-api/api/fund-services/fund.services'
import RoleService from '@/services/utility/role'
import { FettleDataGrid } from '@/views/apps/shared-component/components/fettle.data.grid'

const PAGE_NAME = 'PLAN'
const roleService = new RoleService()
const fundService = new FundService()

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
  }
}))

const dataSource$ = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true
  }
) => {
  return fundService.getConfigs(pageRequest).pipe(
    map((data: any) => {
      data.content = data.content.map((item: any) => {
        return {
          ...item,

          // ['percentageOfFundExhausted']:item.percentageOfFundExhausted? 'yes':'no',
          alertMode: [
            item.alertModeEmail ? 'Email,' : '',
            item.alertModeSms ? 'SMS,' : '',
            item.alertModeWhatsapp ? 'Whatspp' : ''
          ],
          ['restrictClaim']: item.restrictClaim ? 'Yes' : 'No',
          ['groupClient']: item.groupClient.map((item: any) => ` ${item} `)
        }
      })

      return data
    })
  )
}

const columnsDefinations = [
  { field: 'id', headerName: 'Id' },
  { field: 'percentageOfFundExhausted', headerName: 'Percentage of Fund Exuasted' },
  { field: 'alertMessage', headerName: 'Alert Message ' }, //fetch by product ID replace by product name
  { field: 'restrictClaim', headerName: 'Restrict Claim Process ' }, //fetch by plan ID replace by plan name
  { field: 'groupClient', headerName: 'Group Client' },
  { field: `alertMode`, headerName: 'Alert Mode' }
]

const FundConfigListComponent = () => {
  const history = useRouter()

  const handleOpen = () => {
    history.push('/funds/config?mode=create')
  }

  const openEditSection: any = (config: any) => {
    history.push(`/funds/config/${config.id}?mode=edit`)
  }

  const configuration = {
    enableSelection: false,
    scrollHeight: '300px',
    pageSize: 10,
    actionButtons: roleService.checkActionPermission(PAGE_NAME, 'UPDATE', openEditSection),
    header: {
      enable: true,

      //  addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
      addCreateButton: true,
      onCreateButtonClick: handleOpen,
      text: 'Fund Config',
      enableGlobalSearch: true,
      searchText: 'Search by code, name, type, contact'

      //   onSelectionChange: handleSelectedRows,
      //   selectionMenus: [{ icon: "", text: "Blacklist", disabled: selectionBlacklistMenuDisabled, onClick: openBlacklist }],
      //   selectionMenuButtonText: "Action"
    }
  }

  return (
    <>
      <FettleDataGrid
        $datasource={dataSource$}
        config={configuration}
        columnsdefination={columnsDefinations}
        onEdit={openEditSection}
      />
    </>
  )
}

export default FundConfigListComponent
