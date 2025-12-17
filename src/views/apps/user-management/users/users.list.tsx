import React from 'react'

import { useRouter } from 'next/navigation'

import { withStyles } from '@mui/styles'

import { map } from 'rxjs/operators'

import { UsersService } from '@/services/remote-api/api/user-management-service'
import RoleService from '@/services/utility/role'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const PAGE_NAME = 'USER'
const roleService = new RoleService()

const usersService = new UsersService()
let usersService$ = usersService.getUsers()

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
    pageRequest['firstName'] = pageRequest.searchKey.trim()
    pageRequest['lastName'] = pageRequest.searchKey.trim()
    pageRequest['userName'] = pageRequest.searchKey.trim()
    pageRequest['email'] = pageRequest.searchKey.trim()
    pageRequest['roles'] = pageRequest.searchKey.trim()
  }

  delete pageRequest.searchKey

  return (usersService$ = usersService.getUsers().pipe(
    map(res => {
      const newContent = res?.content?.map(v => ({
        ...v,
        roleList: v.roles.join(', ')
      }))

      res.content = newContent

      return res
    })
  ))
}

const columnsDefinations = [
  { field: 'userName', headerName: 'Username' },
  { field: 'email', headerName: 'Email' },
  { field: 'roleList', headerName: 'Roles' }
]

function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()

    return <Component {...props} router={router} />
  }
}

class UsersListComponent extends React.Component<any, any> {
  configuration: any
  constructor(props: any) {
    super(props)

    this.state = {
      userList: []
    }

    this.initConfig()
  }

  // componentDidMount() {
  //   usersService$.subscribe(response => {
  //     this.setState({
  //       ...this.state,
  //       userList: response.content
  //     })
  //   })
  // }

  initConfig = () => {
    this.configuration = {
      enableSelection: false,
      scrollHeight: '300px',
      pageSize: 10,
      actionButtons: roleService.checkActionPermission(PAGE_NAME, 'UPDATE', this.openEditSection),
      header: {
        enable: true,
        addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
        onCreateButtonClick: this.handleOpen,
        text: 'Users Management',
        enableGlobalSearch: true

        //   onSelectionChange: handleSelectedRows,
        //   selectionMenus: [{ icon: "", text: "Blacklist", disabled: selectionBlacklistMenuDisabled, onClick: openBlacklist }],
        //   selectionMenuButtonText: "Action"
      }
    }
  }

  handleOpen = () => {
    this.props.router.push('/user-management/users?mode=create')
  }

  openEditSection: any = (row: any) => {
    this.props.router.push(`/user-management/users/${row.userName}?mode=edit`)
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
export default withRouter(withStyles(useStyles)(UsersListComponent))
