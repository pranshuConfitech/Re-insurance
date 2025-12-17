import * as React from 'react'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material'
import { AddCircleOutlined } from '@mui/icons-material'
import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutline'
import { Autocomplete } from '@mui/lab'
import { Button } from 'primereact/button'

import { ServiceTypeService } from '@/services/remote-api/api/master-services/service.type.service'

const styles = {
  inputStyles: {
    formControl: {
      minWidth: 200,
      width: '100%'
    },
    textField: {
      width: '100%'
    }
  }
}

export default function InvoiceDetailsModal(props: any) {
  const {
    isOpen,
    onClose,
    onSubmit,
    changeInvoiceItems,
    selectedInvoiceItemIndex,
    selectedInvoiceItems,
    handleAddInvoiceItemRow,
    handleDeleteInvoiceItemRow,
    benefitOptions,
    benefitsWithCost
  } = props

  const [detailList, setDetailList] = React.useState([{}])
  const [serviceTypeList, setServiceTypeList] = React.useState<any>()
  const [expenseHeadMap, setExpenseHeadMap] = React.useState<{[key: string]: any[]}>({})
  const [id, setID] = React.useState<any>()

  const serviceTypeService = new ServiceTypeService()

  const getServiceTypes = () => {
    const serviceTypeService$ = serviceTypeService.getServiceTypes()

    serviceTypeService$.subscribe(response => {
      const filtered = response.content.filter((el: any) => el?.name !== 'Diagnosis')
      setServiceTypeList(filtered)
    })
  }

  const getExpenseHead = (id: any, name?: string, rowIndex?: number) => {
    const expenseHeadService$ = serviceTypeService.getExpenseHead(id, name)

    expenseHeadService$.subscribe(response => {
      const temp: any = response.content.map(el => ({
        label: el?.name,
        value: el?.id
      }))
      
      setExpenseHeadMap(prev => ({
        ...prev,
        [id]: temp
      }))
    })
  }

  React.useEffect(() => {
    getServiceTypes()
  }, [])

  const handleServiceTypeChange = (e: any, rowIndex: number) => {
    const serviceTypeId = e.target.value
    setID(serviceTypeId)
    
    // Get expense heads for the selected service type if not already loaded
    if (!expenseHeadMap[serviceTypeId]) {
      getExpenseHead(serviceTypeId)
    }
    
    changeInvoiceItems(e, selectedInvoiceItemIndex, rowIndex)
  }

  const handleRemoveRow = (index: any) => {
    setDetailList(oldList => {
      return [...oldList.slice(0, index), ...oldList.slice(index + 1)]
    })
  }

  const lastRowIndex = detailList.length - 1

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth='lg' aria-labelledby='form-dialog-title' disableEnforceFocus>
      <DialogTitle id='form-dialog-title'>Invoice Items</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid item md={4}>
            Invoice no: {props.invoiceNo}
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Benefit</TableCell>
                    <TableCell>Service Type</TableCell>
                    <TableCell>Expense Head</TableCell>
                    <TableCell>Rate(KSH)</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Total(KSH)</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedInvoiceItems.map((detail: any, index: any) => {
                    const currentServiceTypeId = detail.serviceType
                    const currentExpenseHeadList = currentServiceTypeId ? expenseHeadMap[currentServiceTypeId] || [] : []
                    
                    return (
                      <TableRow key={`TableRow-${index}`} style={{ marginBottom: '20px' }}>
                        <TableCell align='center'>
                          {selectedInvoiceItems.length - 1 === index && (
                            <IconButton
                              onClick={() => handleAddInvoiceItemRow(selectedInvoiceItemIndex)}
                              aria-label='Add a row below'
                            >
                              <AddCircleOutlined />
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell align='center'>
                          <BenefitCostComponent
                            key={index}
                            x={detail}
                            selectedInvoiceItemIndex={selectedInvoiceItemIndex}
                            changeInvoiceItems={changeInvoiceItems}
                            i={index}
                            benefitOptions={benefitOptions}
                            benefitsWithCost={benefitsWithCost}
                            styles={styles.inputStyles}
                          />
                        </TableCell>
                        <TableCell align='center'>
                          <FormControl style={styles.inputStyles.formControl}>
                            <Select
                              label='Service Type'
                              name='serviceType'
                              value={detail.serviceType || ''}
                              onChange={(e) => handleServiceTypeChange(e, index)}
                              size='small'
                            >
                              {serviceTypeList?.map((ele: any) => {
                                return (
                                  <MenuItem key={ele?.id} value={ele?.id}>
                                    {ele?.displayName}
                                  </MenuItem>
                                )
                              })}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell align='center'>
                          <FormControl style={styles.inputStyles.formControl}>
                            <Autocomplete
                              options={currentExpenseHeadList}
                              getOptionLabel={(option: any) => option?.label || ''}
                              value={currentExpenseHeadList?.find((head: any) => head.value === detail.expenseHead) || null}
                              onChange={(event, newValue) => {
                                changeInvoiceItems(
                                  null,
                                  selectedInvoiceItemIndex,
                                  index,
                                  'expenseHead',
                                  newValue?.value || null
                                )
                              }}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  size='small'
                                  onChange={e => currentServiceTypeId && getExpenseHead(currentServiceTypeId, e.target.value)}
                                  placeholder='Search Expense Head'
                                  style={styles.inputStyles.textField}
                                />
                              )}
                              size='small'
                            />
                          </FormControl>
                        </TableCell>
                        <TableCell align='center'>
                          <FormControl style={styles.inputStyles.formControl}>
                            <TextField
                              name='rateKes'
                              type='number'
                              value={detail.rateKes || ''}
                              onChange={e => changeInvoiceItems(e, selectedInvoiceItemIndex, index)}
                              size='small'
                              style={styles.inputStyles.textField}
                            />
                          </FormControl>
                        </TableCell>
                        <TableCell align='center'>
                          <FormControl style={styles.inputStyles.formControl}>
                            <TextField
                              name='unit'
                              type='number'
                              value={detail.unit || ''}
                              onChange={e => changeInvoiceItems(e, selectedInvoiceItemIndex, index)}
                              size='small'
                              style={styles.inputStyles.textField}
                            />
                          </FormControl>
                        </TableCell>
                        <TableCell align='center'>
                          <FormControl style={styles.inputStyles.formControl}>
                            <TextField
                              name='totalKes'
                              disabled
                              value={detail.totalKes || ''}
                              onChange={e => changeInvoiceItems(e, selectedInvoiceItemIndex, index)}
                              size='small'
                              style={styles.inputStyles.textField}
                            />
                          </FormControl>
                        </TableCell>
                        <TableCell align='center'>
                          {selectedInvoiceItems.length !== 1 && (
                            <IconButton
                              onClick={() => handleDeleteInvoiceItemRow(selectedInvoiceItemIndex, index)}
                              aria-label='Remove this row'
                            >
                              <RemoveCircleOutline style={{ color: '#dc3545' }} />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button className='p-button-text' onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSubmit} color='primary'>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const BenefitCostComponent = (props: any) => {
  const { x, i, changeInvoiceItems, selectedInvoiceItemIndex, benefitOptions, styles } = props

  const handleBenefitChange = (e: any, val: any, i: number) => {
    const eData = {
      target: {
        name: 'benefitId',
        value: val?.benefitStructureId || null
      }
    }

    changeInvoiceItems(eData, selectedInvoiceItemIndex, i)
  }

  return (
    <FormControl style={styles.formControl}>
      <Autocomplete
        value={x.benefitId ? benefitOptions.find((item: any) => item.benefitStructureId === x.benefitId) || null : null}
        onChange={(e, val) => handleBenefitChange(e, val, i)}
        id={`benefit-autocomplete-${i}`}
        options={benefitOptions}
        getOptionLabel={(option: any) => option?.label || ''}
        isOptionEqualToValue={(option: any, value: any) => option?.benefitStructureId === value?.benefitStructureId}
        renderInput={params => (
          <TextField {...params} size='small' style={styles.textField} placeholder='Select Benefit' />
        )}
        size='small'
      />
    </FormControl>
  )
}
