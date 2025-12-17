
import React from 'react'

import { useRouter } from 'next/navigation'

import { withStyles } from '@mui/styles'

import { BenefitStructureService } from '@/services/remote-api/api/benefit-structure-services/benefit-structure.service'
import RoleService from '@/services/utility/role'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

/* import { of } from 'rxjs'; */

const PAGE_NAME = 'BENEFIT'
const roleService = new RoleService()

const benefitStructureService = new BenefitStructureService()

const useStyles = (theme: any) => ({
  tableBg: {
    height: 505,
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
  pageRequest.sort = ['rowLastUpdatedDate dsc']

  if (pageRequest.searchKey) {
    pageRequest['code'] = pageRequest.searchKey.trim()

    // pageRequest['type'] = pageRequest.searchKey;
    pageRequest['description'] = pageRequest.searchKey.trim()

    // pageRequest['contactNo'] = pageRequest.searchKey;
  }

  delete pageRequest.searchKey

  return benefitStructureService.getAllBenefitStructures(pageRequest)
}

const columnsDefinations = [
  { field: 'hierarchyCd', headerName: 'Hierarchy Code' },
  { field: 'description', headerName: 'Hierarchy Name' }
]

function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()

    return <Component {...props} router={router} />
  }
}

class BenefitHierarchyListComponent extends React.Component<any, any> {
  selectedRow: any[]
  configuration: any
  constructor(props: any) {
    super(props)

    this.state = { selectedRow: [] }
    this.selectedRow = []

    this.initConfig()
  }

  initConfig = () => {
    this.configuration = {
      enableSelection: true,
      scrollHeight: '285px',
      pageSize: 10,
      actionButtons: roleService.checkActionPermission(PAGE_NAME, 'UPDATE', this.openEditSection),
      header: {
        enable: true,
        addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
        onCreateButtonClick: this.handleOpen,
        text: 'Benefit Management',
        enableGlobalSearch: true,
        onSelectionChange: this.handleSelectedRows,
        selectionMenus: [
          {
            icon: '',
            label: 'Sign Off',
            disabled: this.selectedRow.length == 0,
            onClick: this.approveBenefit
          }
        ],
        searchText: 'Search by Hierarchy Code, Hierarchy Name'

        //   onSelectionChange: handleSelectedRows,
        //   selectionMenus: [{ icon: "", text: "Blacklist", disabled: selectionBlacklistMenuDisabled, onClick: openBlacklist }],
        //   selectionMenuButtonText: "Action"
      }
    }
  }

  hasAccess = (accessName: any) => {
    const access_details: any = JSON.parse(localStorage.getItem('access_details') || '')
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

  handleSelectedRows = (selected: any) => {
    this.selectedRow = selected
    this.setState({ ...this.state, selectedRow: selected })
    this.initConfig()
  }

  approveBenefit = () => {
    this.state.selectedRow.forEach((row: any) => {
      if (row.benefitStructureStatus !== 'APPROVED') {
        benefitStructureService.approveBenefit(row.id).subscribe(resp => { })
      } else {
        alert(`${row.description} already approved`)
      }
    })
  }

  handleOpen = () => {
    this.props.router.push('/masters/benefit-hierarchy?mode=create')
  }

  openEditSection: any = (benefit: any) => {
    this.props.router.push(`/masters/benefit-hierarchy/${benefit.id}?mode=edit`)
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

export default withRouter(withStyles(useStyles)(BenefitHierarchyListComponent))
