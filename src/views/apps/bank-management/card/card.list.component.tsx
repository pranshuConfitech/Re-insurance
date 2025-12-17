import React from 'react'

import { useRouter } from 'next/navigation'

import { makeStyles } from '@mui/styles'

import { map, switchMap } from 'rxjs/operators'

import { CardService } from '@/services/remote-api/api/banks-services/card.services'
import { CardTypeService } from '@/services/remote-api/api/master-services/cardtype.services'
import RoleService from '@/services/utility/role'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const PAGE_NAME = 'CARD'
const roleService = new RoleService()

const useStyles = makeStyles(theme => ({
  tableBg: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  }
}))

const cardservice = new CardService()
const cardtype = new CardTypeService()

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
    pageRequest['product'] = pageRequest.searchKey.trim()
    pageRequest['plan'] = pageRequest.searchKey.trim()
    pageRequest['currency'] = pageRequest.searchKey.trim()
    pageRequest['cardType'] = pageRequest.searchKey.trim()

    // pageRequest['validFrom'] = pageRequest.searchKey.trim();
  }

  delete pageRequest.searchKey

  return cardservice
    .getCards(pageRequest)
    .pipe(
      switchMap(data => {
        return cardtype.getCardTypes().pipe(
          map(ct => {
            data.content.forEach((cl: any) => {
              ct.content.forEach((cardtype: any) => {
                if (cl.cardType === cardtype.code) {
                  cl['cardType'] = cardtype.name
                }
              })
            })

            return data
          })
        )
      })
    )
    .pipe(
      map(data => {
        const content = data.content

        const records = content.map((item: any) => {
          item['validFromDate'] = new Date(item.validFrom).toLocaleDateString()
          item['product'] = item.product === '' ? 'All' : item.product
          item['plan'] = item.plan === '' ? 'All' : item.plan

          return item
        })

        data.content = records

        return data
      })
    )
}

const columnsDefinations = [
  { field: 'code', headerName: 'Code' },
  {
    field: 'product',
    headerName: 'Product',
    body: (rowData: any) => <span style={{ lineBreak: 'anywhere' }}>{rowData.product}</span>
  },
  {
    field: 'plan',
    headerName: 'Plan',
    body: (rowData: any) => <span style={{ lineBreak: 'anywhere' }}>{rowData.plan}</span>
  },
  { field: 'cardType', headerName: 'Card Type' },
  { field: 'currency', headerName: 'Currency' },
  { field: 'cardRate', headerName: 'Card Rate' },
  { field: 'validFromDate', headerName: 'Valid from' }
]

export default function CardListComponent(props: any) {
  const router = useRouter()
  const [rows, setRows] = React.useState(props.rows)

  const classes = useStyles()

  const handleOpen = () => {
    router.push('/bank-management/cards?mode=create')
  }

  React.useEffect(() => {
    setRows(props.rows)
  }, [props.rows])

  const openEditSection: any = (card: any) => {
    router.push(`/bank-management/cards/${card.id}?mode=edit`)
  }

  const xlsColumns = ['code', 'product', 'plan', 'cardType', 'currency', 'cardRate', 'validFromDate']

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
      text: 'Card Management',
      enableGlobalSearch: true,
      searchText: 'Search by code, product, plan, type'
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
