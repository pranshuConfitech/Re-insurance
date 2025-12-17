import React from 'react'

import { useRouter } from 'next/navigation'

import moment from 'moment'

import RoleService from '@/services/utility/role'
import { ProviderNegotiationService } from '@/services/remote-api/api/master-services'
import { FettleDataGrid } from '@/views/apps/shared-component/components/fettle.data.grid'

const PAGE_NAME = 'Negotiation'

// const PAGE_NAME = 'PROVIDER';
const roleService = new RoleService()

// const roleService = new RoleService();
// const quotationService = new QuotationService();
const providernegotiationservice = new ProviderNegotiationService()

const sampleData = [
  {
    id: '#9GFD',
    name: 'Aga Khan',
    date: '5/04/2024',
    today: 10,
    thisWeek: 20,
    thisMonth: 30,
    thisYear: 40
  },
  {
    id: '#GGSH',
    name: 'UVS Pvt Ltd',
    date: '5/04/2024',
    today: 20,
    thisWeek: 30,
    thisMonth: 50,
    thisYear: 100
  }
]

// const data$ = new Observable(subscriber => {
//     subscriber.next(sampleData);
//   });

//   const dataSource$ = () => {
//     return data$.pipe(map(data => {
//       data.content = data;
//       return data;
//     }));
//   };

const dataSource$: any = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true
  }
) => {
  pageRequest.sort = ['rowCreatedDate dsc']

  if (pageRequest.searchKey) {
    pageRequest['name'] = pageRequest.searchKey
  }

  return providernegotiationservice.getNegotiations(pageRequest)
}

const actionBtnList = [
  {
    key: 'update_provider',
    icon: 'pi pi-user-edit',
    className: 'ui-button-warning'

    // onClick: openEditSection,
    // className: classes.categoryButton,
  }

  // {
  //   key: 'update_quotation',
  //   icon: 'pi pi-book',
  //   className: 'ui-button-warning',
  //   onClick: openCategorize,
  //   className: classes.categoryButton,
  // },
]

const columnsDefinations = [
  { field: 'id', headerName: 'ID' },
  { field: 'providerType', headerName: 'Provider Type' },
  { field: 'providerId', headerName: 'Provider ID' },
  { field: 'providerCategory', headerName: 'Provider Category' },
  {
    field: 'validFrom',
    headerName: 'Valid From',
    body: (rowData: any) => moment(rowData.validFrom).format('DD/MM/YYY')
  },
  { field: 'validTo', headerName: 'Valid To', body: (rowData: any) => moment(rowData.validTo).format('DD/MM/YYY') },
  { field: 'industryType', headerName: 'Industry Type' },
  { field: 'corporate', headerName: 'Corporate' },
  { field: 'plan', headerName: 'Plan' },
  { field: 'category', headerName: 'Category' }
]

const NegotiationListComponent = (props: any) => {
  const history = useRouter()

  const handleOpen = () => {
    history.push('/provider/negotiation?mode=create')
  }

  const configuration = {
    enableSelection: false,
    scrollHeight: '300px',
    pageSize: 10,
    actionButtons: roleService.checkActionPermission(PAGE_NAME, '', () => {}, actionBtnList),

    //  actionButtons: roleService.checkActionPermission(PAGE_NAME, 'UPDATE', openEditSection),
    header: {
      enable: true,

      //  addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
      addCreateButton: true,
      onCreateButtonClick: handleOpen,
      text: 'Negotiation',
      enableGlobalSearch: true,
      searchText: 'Search by code, name, type, contact'

      // onSelectionChange: handleSelectedRows,
      //   selectionMenus: [{ icon: "", text: "Blacklist", disabled: selectionBlacklistMenuDisabled, onClick: openBlacklist }],
      //   selectionMenuButtonText: "Action"
    }
  }

  return <FettleDataGrid $datasource={dataSource$} config={configuration} columnsdefination={columnsDefinations} />
}

export default NegotiationListComponent
