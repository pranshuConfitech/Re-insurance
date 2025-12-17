
import React from 'react'

// import { withRouter } from 'react-router-dom';
import { useRouter } from 'next/navigation'

import { withStyles } from '@mui/styles'

// import { ProductService } from '../../remote-api/api/product-services';
import { ProductService } from '@/services/remote-api/api/product-services'
import { FettleDataGrid } from '@/views/apps/shared-component'
import RoleService from '@/services/utility/role'

/* import { of } from 'rxjs'; */

const PAGE_NAME = 'PRODUCT'
const roleService = new RoleService()
const productService = new ProductService()

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
  pageRequest.sort = ['rowCreatedDate dsc']

  if (pageRequest.searchKey) {
    pageRequest['code'] = pageRequest.searchKey.trim()

    // pageRequest['type'] = pageRequest.searchKey;
    pageRequest['name'] = pageRequest.searchKey.trim()

    // pageRequest['contactNo'] = pageRequest.searchKey;

    delete pageRequest.active
  } else {
    pageRequest.summary = true
    pageRequest.active = true
  }

  delete pageRequest.searchKey

  return productService.getProducts(pageRequest)
}

const columnsDefinations = [
  { field: 'productBasicDetails.name', headerName: 'Product Name' },
  { field: 'code', headerName: 'Product Code' },
  { field: 'productBasicDetails.productTypeId', headerName: 'Product Type Id' }
]

function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()

    return <Component {...props} router={router} />
  }
}

class ProductPremiumListComponent extends React.Component<any, any> {
  configuration: any
  constructor(props: any) {
    super(props)

    this.configuration = {
      enableSelection: false,
      scrollHeight: '300px',
      pageSize: 10,
      actionButtons: [
        {
          icon: 'pi pi-pencil',
          tooltip: 'Edit',
          className: 'ui-button-error',
          onClick: (product: any) => this.props.router.push(`/premium/${product.id}?mode=edit`)
        }
      ],
      header: {
        enable: true,
        text: "Product's Premium Management",
        enableGlobalSearch: true,
        searchText: 'Search by Code, Name'

        //   onSelectionChange: handleSelectedRows,
        //   selectionMenus: [{ icon: "", text: "Blacklist", disabled: selectionBlacklistMenuDisabled, onClick: openBlacklist }],
        //   selectionMenuButtonText: "Action"
      }
    }

    this.state = {
      expandedRows: null
    }

    if (localStorage.getItem('productId')) {
      localStorage.removeItem('productId')
    }
  }

  openEditSection = (product: any) => {
    this.props.router.push(`/premium/${product.id}?mode=edit`)
  }

  rowExpansionTemplate = (data: any) => {
    return (
      <div className='orders-subtable'>
        <h5>Orders for </h5>
        {/* <DataTable value={data.orders} responsiveLayout="scroll">
          <Column field="id" header="Id" sortable></Column>
          <Column field="customer" header="Customer" sortable></Column>
          <Column field="date" header="Date" sortable></Column>
          <Column field="amount" header="Amount" body={amountBodyTemplate} sortable></Column>
          <Column field="status" header="Status" body={statusOrderBodyTemplate} sortable></Column>
          <Column headerStyle={{ width: '4rem' }} body={searchBodyTemplate}></Column>
        </DataTable> */}
      </div>
    )
  }

  onRowToggle = (e: any) => {
    this.setState({ expandedRows: e.data })
  }

  render() {
    const { classes } = this.props

    return (
      <FettleDataGrid
        $datasource={dataSource$}
        config={this.configuration}
        columnsdefination={columnsDefinations}
        onEdit={this.openEditSection}
        onRowToggle={this.onRowToggle}
        rowExpansionTemplate={this.rowExpansionTemplate}
        expandedRows={this.state.expandedRows}
      />
    )
  }
}

export default withRouter(withStyles(useStyles)(ProductPremiumListComponent))
