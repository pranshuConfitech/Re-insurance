
import React, { useRef } from 'react'

import { useRouter } from 'next/navigation'

import { withStyles } from '@mui/styles'

import { ParametersService } from '@/services/remote-api/api/master-services/parameters.service'
import RoleService from '@/services/utility/role'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'
import { IndustryService, SectorsService } from '@/services/remote-api/fettle-remote-api'
import { Toast } from 'primereact/toast'

const PAGE_NAME = 'PARAMETER'
const roleService = new RoleService()

const industryService = new IndustryService()
let industryService$ = industryService.getAllIndustry()

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

  return (industryService$ = industryService.getAllIndustry(pageRequest))
}

const columnsDefinations = [{ field: 'name', headerName: 'Name' }, { field: 'code', headerName: 'Code' }]

function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()
    const toast: any = useRef(null)

    return <Component {...props} router={router} toast={toast} />
  }
}

class IndustryListComponent extends React.Component<any, any> {
  configuration: any
  constructor(props: any) {
    super(props)

    this.state = {
      parameterList: [],
      reloadTable: false,
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
      enableSelection: false,
      scrollHeight: '300px',
      pageSize: 10,
      // actionButtons: roleService.checkActionPermission(PAGE_NAME, 'UPDATE', this.openEditSection),
      actionButtons: [
        // {
        //   key: 'update_sector',
        //   icon: 'pi pi-pencil',
        //   onClick: this.openEditSection,
        //   tooltip: 'Edit'
        // },
        {
          key: 'delete_sector',
          icon: 'pi pi-trash',
          onClick: this.deleteSector,
          tooltip: 'Delete'
        },
      ],
      header: {
        enable: true,
        addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
        onCreateButtonClick: this.handleOpen,
        text: 'Industry',
        enableGlobalSearch: true

        //   onSelectionChange: handleSelectedRows,
        //   selectionMenus: [{ icon: "", text: "Blacklist", disabled: selectionBlacklistMenuDisabled, onClick: openBlacklist }],
        //   selectionMenuButtonText: "Action"
      }
    }
  }


  handleOpen = () => {
    this.props.router.push('/masters/industries?mode=create')
  }

  openEditSection: any = (row: any) => {
    this.props.router.push(`/masters/industries/${row.id}?mode=edit`)
  }

  deleteSector: any = (row: any) => {
    industryService.deleteIndustry(row.id).subscribe((resp: any) => {
      this.props.toast.current.show({ severity: 'success', summary: 'Success', detail: 'Industry deleted successfully', life: 3000 });
      this.setState({
        ...this.state,
        reloadTable: true
      })
      setTimeout(() => {
        this.setState({
          ...this.state,
          reloadTable: false
        })
      }, 1000);
    })
  }

  render() {
    const { classes } = this.props

    return (
      <>
        <Toast ref={this.props.toast} />
        <FettleDataGrid
          $datasource={dataSource$}
          config={this.configuration}
          columnsdefination={columnsDefinations}
          onEdit={this.openEditSection}
          reloadtable={this.state.reloadTable}
        />
      </>
    )
  }
}
export default withRouter(withStyles(useStyles)(IndustryListComponent))
