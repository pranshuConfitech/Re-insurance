'use client'
import React from 'react'

import { useRouter } from 'next/navigation'

import { withStyles } from '@mui/styles'

import { map, switchMap } from 'rxjs'

/* import { of } from 'rxjs'; */
import { Box, Modal, TextField, Typography } from '@mui/material'

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@mui/x-date-pickers';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { CloseOutlined } from '@mui/icons-material'
import { Button } from 'primereact/button'

import RoleService from '@/services/utility/role'
import { ClientTypeService, ProductService } from '@/services/remote-api/fettle-remote-api'
import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const PAGE_NAME = 'PRODUCT'
const roleService = new RoleService()
const productService = new ProductService()
const clienttypeervice = new ClientTypeService()

interface ProductListProps {
  classes: Record<string, string> // Define the injected classes prop type.
  history: any // Add other props if necessary.
}

const useStyles = (theme: any) => ({
  tableBg: {
    height: 505,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  }
})

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  background: '#fff',

  // border: '2px solid #000',
  boxShadow: 24,
  padding: '2% 3%'
}

const columnsDefinations = [
  {
    field: 'productBasicDetails.name',
    headerName: 'Product Name',
    body: (rowData: any) => <span style={{ textTransform: 'capitalize' }}>{rowData?.productBasicDetails.name}</span>
  },
  { field: 'code', headerName: 'Product Code' },
  { field: 'clientType', headerName: 'Client Type' }
]

function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()

    return <Component {...props} router={router} />
  }
}

class ProductListComponent extends React.Component<any, any> {
  configuration: any

  // openEditSection:any
  constructor(props: any) {
    super(props)
    this.configuration = {
      enableSelection: false,
      scrollHeight: '285px',
      pageSize: 10,
      actionButtons: roleService.checkActionPermission(PAGE_NAME, 'UPDATE', this.openEditSection),
      header: {
        enable: true,
        addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
        onCreateButtonClick: this.handleOpen,
        text: 'Product Management',
        enableGlobalSearch: true,
        searchText: 'Search by Code, Name, Client Type',
        // selectionMenus: [
        //   { icon: '', label: 'Validity Period Start', onClick: this.openBlacklist },
        //   { icon: '', label: 'Validity Period End', onClick: this.openBlacklists }
        // ]
      }
    }

    this.state = {
      expandedRows: null,
      modal: false,
      searchType: '',
      creationStartDate: null,
      creationEndDate: null,
      validStartDate: null,
      validEndDate: null,
      reloadTable: false
    }

    if (localStorage.getItem('productId')) {
      localStorage.removeItem('productId')
    }
  }

  dataSource$ = (
    pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true
    },
    craetionPayload = {
      page: 0,
      size: 10,
      validFromStart: this.state.creationStartDate - 5.5 * 60 * 60 * 1000,
      validFromEnd: !this.state.creationEndDate
        ? this.state.creationStartDate - 5.5 * 60 * 60 * 1000
        : this.state.creationEndDate - 5.5 * 60 * 60 * 1000
    },
    validProduct = {
      page: 0,
      size: 10,
      validToStart: this.state.validStartDate - 5.5 * 60 * 60 * 1000,
      validToEnd: !this.state.validEndDate
        ? this.state.validStartDate - 5.5 * 60 * 60 * 1000
        : this.state.validEndDate - 5.5 * 60 * 60 * 1000
    }
  ) => {
    pageRequest.sort = ['rowCreatedDate dsc']

    if (pageRequest.searchKey) {
      pageRequest['code'] = pageRequest.searchKey.trim()

      // pageRequest['type'] = pageRequest.searchKey;
      pageRequest['name'] = pageRequest.searchKey.trim()
      pageRequest['clientTypeId'] = pageRequest.searchKey.trim()
      delete pageRequest.active
    } else {
      pageRequest.summary = true
      pageRequest.active = true
    }

    delete pageRequest.searchKey

    return productService
      .getProducts(
        this.state.creationStartDate ? craetionPayload : this.state.validStartDate ? validProduct : pageRequest
      )
      .pipe(
        switchMap(data => {
          return clienttypeervice.getCleintTypes().pipe(
            map(ct => {
              data.content.forEach((cl: any) => {
                ct.content.forEach(clienttype => {
                  if (cl.productBasicDetails.clientTypeId === clienttype.code) {
                    cl['clientType'] = clienttype.name
                  }
                })
              })

              return data
            })
          )
        })
      )
  }
  openBlacklist = () => {
    this.setState({ modal: true, searchType: 1 }, () => {
      console.log('State updated:', this.state.modal, this.state.searchType)
    })
  }
  openBlacklists = () => {
    this.setState({ modal: true, searchType: 2 }, () => {
      console.log('State updated:', this.state.modal, this.state.searchType)
    })
  }

  //  theme = useTheme();

  handleOpen = () => {
    this.props.router.push('/products?mode=create&step=0')
  }

  openEditSection = (product?: any) => {
    if (product) this.props.router.push(`/products/${product.id}?mode=edit&step=0`)
  }

  onSearch = () => {
    this.setState({ modal: false, reloadTable: true })
    setTimeout(() => {
      this.setState({ reloadTable: false, creationStartDate: null, creationEndDate: null })
    }, 1000)
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
      <>
        <FettleDataGrid
          $datasource={this.dataSource$}
          config={this.configuration}
          columnsdefination={columnsDefinations}
          onEdit={this.openEditSection}
          onRowToggle={this.onRowToggle}
          rowExpansionTemplate={this.rowExpansionTemplate}
          expandedRows={this.state.expandedRows}
          reloadtable={this.state.reloadTable}
        />
        {this.state.modal === true && (
          <Modal open={this.state.modal} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
            <Box sx={modalStyle}>
              <Box>
                <Box id='alert-dialog-slide-description'>
                  {this.state.searchType === 1 && (
                    <>
                      <Box display={'flex'} justifyContent={'space-between'}>
                        <Box component='h3' marginBottom={'10px'}>
                          Validity Period Start
                        </Box>
                        <CloseOutlined onClick={() => this.setState({ modal: false })} style={{ cursor: 'pointer' }} />
                      </Box>
                      <Box display={'flex'} marginBottom={'10px'}>
                        <Box display={'flex'}>
                          <Typography
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: '14px',
                              fontWeight: '700',
                              textTransform: 'capitalize'
                            }}
                          >
                            From
                          </Typography>
                          &nbsp;
                          <span style={{ display: 'flex', alignItems: 'center' }}>:</span>&nbsp;
                          <Box style={{ marginBottom: '10px' }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                views={['year', 'month', 'day']}
                                value={this.state.creationStartDate}
                                onChange={date => this.setState({ creationStartDate: date })}
                                renderInput={params => (
                                  <TextField
                                    {...params}
                                    margin='normal'
                                    style={{ marginBottom: '0px' }}
                                    variant='outlined'
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          </Box>
                        </Box>
                        <Box display={'flex'} marginLeft={'3%'}>
                          <Typography
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: '14px',
                              fontWeight: '700',
                              textTransform: 'capitalize'
                            }}
                          >
                            To
                          </Typography>
                          &nbsp;
                          <span style={{ display: 'flex', alignItems: 'center' }}>:</span>&nbsp;
                          <Box style={{ marginBottom: '10px' }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                views={['year', 'month', 'day']}
                                value={this.state.creationEndDate}
                                onChange={date => this.setState({ creationEndDate: date })}
                                renderInput={params => (
                                  <TextField
                                    {...params}
                                    margin='normal'
                                    style={{ marginBottom: '0px' }}
                                    variant='outlined'
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          </Box>
                        </Box>
                      </Box>
                    </>
                  )}
                </Box>
                <Box id='alert-dialog-slide-description'>
                  {this.state.searchType === 2 && (
                    <>
                      <Box display={'flex'} justifyContent={'space-between'}>
                        <Box component='h3' marginBottom={'10px'}>
                          Validity Period End
                        </Box>
                        <CloseOutlined onClick={() => this.setState({ modal: false })} style={{ cursor: 'pointer' }} />
                      </Box>
                      <Box display={'flex'} marginBottom={'10px'}>
                        <Box display={'flex'}>
                          <Typography
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: '14px',
                              fontWeight: '700',
                              textTransform: 'capitalize'
                            }}
                          >
                            From
                          </Typography>
                          &nbsp;
                          <span style={{ display: 'flex', alignItems: 'center' }}>:</span>&nbsp;
                          <Box style={{ marginBottom: '10px' }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                views={['year', 'month', 'day']}
                                value={this.state.validStartDate}
                                onChange={date => this.setState({ validStartDate: date })}
                                renderInput={params => (
                                  <TextField
                                    {...params}
                                    margin='normal'
                                    style={{ marginBottom: '0px' }}
                                    variant='outlined'
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          </Box>
                        </Box>
                        <Box display={'flex'} marginLeft={'3%'}>
                          <Typography
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: '14px',
                              fontWeight: '700',
                              textTransform: 'capitalize'
                            }}
                          >
                            To
                          </Typography>
                          &nbsp;
                          <span style={{ display: 'flex', alignItems: 'center' }}>:</span>&nbsp;
                          <Box style={{ marginBottom: '10px' }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                views={['year', 'month', 'day']}
                                value={this.state.validEndDate}
                                onChange={date => this.setState({ validEndDate: date })}
                                renderInput={params => (
                                  <TextField
                                    {...params}
                                    margin='normal'
                                    style={{ marginBottom: '0px' }}
                                    variant='outlined'
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          </Box>
                        </Box>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
              <Box marginTop={'10%'}>
                <Button onClick={this.onSearch}>Search</Button>
              </Box>
            </Box>
          </Modal>
        )}
      </>
    )
  }
}

export default withRouter(withStyles(useStyles)(ProductListComponent))
