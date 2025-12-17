
import React from 'react'

import { useRouter } from 'next/navigation'

import { withStyles } from '@mui/styles'

import RoleService from '@/services/utility/role'
import { ServiceGroupingsService } from '@/services/remote-api/api/master-services/service.groupings.service'
import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const PAGE_NAME = 'SERVICE'
const roleService = new RoleService()

const serviceGroupingsService = new ServiceGroupingsService()
let serviceGroupingsService$ = serviceGroupingsService.getAllServiceGroupings()

const useStyles = (theme: any) => ({
  tableBg: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  }
})

const dataSource$ = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true
  }
) => {
  if (pageRequest.searchKey) {
    pageRequest['code'] = pageRequest.searchKey.trim()
    pageRequest['type'] = pageRequest.searchKey.trim()
    pageRequest['name'] = pageRequest.searchKey.trim()
    pageRequest['contactNo'] = pageRequest.searchKey.trim()
  }

  delete pageRequest.searchKey

  return (serviceGroupingsService$ = serviceGroupingsService.getAllServiceGroupings(pageRequest))
}

const columnsDefinations = [
  { field: 'groupName', headerName: 'Group Name' },
  { field: 'serviceType', headerName: 'Service Type' }
]

function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()

    return <Component {...props} router={router} />
  }
}

class ServiceGroupingList extends React.Component<any, any> {
  constructor(props: {}) {
    super(props)

    this.state = {
      serviceGroupingsList: []
    }
  }

  componentDidMount() {
    // serviceGroupingsService$.subscribe((response: any) => {
    //   this.setState({
    //     ...this.state,
    //     serviceGroupingsList: response.content
    //   })
    // })
  }

  // initConfig = () => {
  //   this.configuration = {
  //     enableSelection: false,
  //     scrollHeight: '300px',
  //     pageSize: 10,
  //     actionButtons: roleService.checkActionPermission(PAGE_NAME, 'UPDATE', this.openEditSection),
  //     header: {
  //       enable: true,
  //       addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
  //       onCreateButtonClick: this.handleOpen,
  //       text: 'Service Grouping',
  //       enableGlobalSearch: true,
  //       searchText: 'Search by Service Type, Group Name',
  //       //   onSelectionChange: handleSelectedRows,
  //       //   selectionMenus: [{ icon: "", text: "Blacklist", disabled: selectionBlacklistMenuDisabled, onClick: openBlacklist }],
  //       //   selectionMenuButtonText: "Action"
  //     },
  //   };
  // };

  hasAccess = (accessName: any) => {
    const access_details = JSON.parse(localStorage.getItem('access_details') || '[]')
    const accessList = access_details.filter((ad: any) => ad.indexOf(PAGE_NAME) > -1).map((ac: any) => ac.split('_')[0])
    const status = accessList.some((a: any) => a.indexOf(accessName) > -1)

    if (accessName === 'UPDATE') {
      if (status) {
        return [
          {
            icon: 'pi pi-user-edit',
            className: 'ui-button-warning',
            onClick: this.openEditSection
          }
        ]
      } else {
        return []
      }
    } else {
      return status
    }
  }

  handleOpen = () => {
    this.props.router.push('/masters/service-grouping?mode=create')
  }

  openEditSection: any = (row: any) => {
    this.props.router.push(`/masters/service-grouping/${row.id}?mode=edit`)
  }

  render() {
    const configuration = {
      enableSelection: false,
      scrollHeight: '300px',
      pageSize: 10,
      actionButtons: roleService.checkActionPermission(PAGE_NAME, 'UPDATE', this.openEditSection),
      header: {
        enable: true,
        addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
        onCreateButtonClick: this.handleOpen,
        text: 'Service Grouping',
        enableGlobalSearch: true,
        searchText: 'Search by Service Type, Group Name'

        //   onSelectionChange: handleSelectedRows,
        //   selectionMenus: [{ icon: "", text: "Blacklist", disabled: selectionBlacklistMenuDisabled, onClick: openBlacklist }],
        //   selectionMenuButtonText: "Action"
      }
    }

    return (
      <FettleDataGrid
        $datasource={dataSource$}
        config={configuration}
        columnsdefination={columnsDefinations}
        onEdit={this.openEditSection}
      />
    )
  }
}
export default withRouter(withStyles(useStyles)(ServiceGroupingList))
