
import React from 'react'

import { useRouter } from 'next/navigation'

import { withStyles } from '@mui/styles'

import { ParametersService } from '@/services/remote-api/api/master-services/parameters.service'
import RoleService from '@/services/utility/role'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const PAGE_NAME = 'PARAMETER'
const roleService = new RoleService()

const parametersService = new ParametersService()
let parametersService$ = parametersService.getAllParameters()

const useStyles = (theme: any) => ({
  tableBg: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  }
})

const dataSource$: any = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true
  }
) => {
  if (pageRequest.searchKey) {
    // pageRequest['code'] = pageRequest.searchKey;
    // pageRequest['type'] = pageRequest.searchKey;
    pageRequest['name'] = pageRequest.searchKey.trim()

    // pageRequest['contactNo'] = pageRequest.searchKey;
  }

  delete pageRequest.searchKey

  return (parametersService$ = parametersService.getAllParameters(pageRequest))
}

const columnsDefinations = [{ field: 'name', headerName: 'Rule Name' }]

function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()

    return <Component {...props} router={router} />
  }
}

class ParametersListComponent extends React.Component<any, any> {
  configuration: any
  constructor(props: any) {
    super(props)

    this.state = {
      parameterList: []
    }

    this.initConfig()
  }

  // componentDidMount() {
  //   parametersService$.subscribe(response => {
  //     this.setState({
  //       ...this.state,
  //       parameterList: response.content
  //     })
  //   })
  // }

  initConfig = () => {
    this.configuration = {
      enableSelection: true,
      scrollHeight: '300px',
      pageSize: 10,
      actionButtons: roleService.checkActionPermission(PAGE_NAME, 'UPDATE', this.openEditSection),
      header: {
        enable: true,
        addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
        onCreateButtonClick: this.handleOpen,
        text: 'Parameter Management',
        enableGlobalSearch: true

        //   onSelectionChange: handleSelectedRows,
        //   selectionMenus: [{ icon: "", text: "Blacklist", disabled: selectionBlacklistMenuDisabled, onClick: openBlacklist }],
        //   selectionMenuButtonText: "Action"
      }
    }
  }

  hasAccess = (accessName: any) => {
    const access_details = JSON.parse(localStorage.getItem('access_details') || '')
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
    this.props.router.push('/masters/parameters?mode=create')
  }

  openEditSection: any = (row: any) => {
    this.props.router.push(`/masters/parameters/${row.id}?mode=edit`)
  }

  render() {
    const { classes } = this.props

    return (
      <FettleDataGrid
        $datasource={dataSource$}
        config={this.configuration}
        columnsdefination={columnsDefinations}
        onEdit={this.openEditSection}
      />
    )
  }
}
export default withRouter(withStyles(useStyles)(ParametersListComponent))
