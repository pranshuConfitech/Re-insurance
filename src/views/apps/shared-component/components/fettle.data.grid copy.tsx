import React, { useEffect, useState } from 'react'

import { Column } from 'primereact/column'
import { Button as PButton } from 'primereact/button'
import { Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators'

import './abc.css'

// import { styled } from "@mui/material/styles";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup'
import 'primeflex/primeflex.css'
import toWords from 'split-camelcase-to-words'

// import { useLocation } from 'react-router-dom';
// import { Grid } from '@material-ui/core';
import ExcelJS from 'exceljs'

import moment from 'moment'
import LinearProgress from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'

import Grid from '@mui/material/Grid'
import type {
  DataTableExpandedRows,
  DataTableStateEvent
} from 'primereact/datatable'
import { DataTable } from 'primereact/datatable'

import { saveAs } from 'file-saver'

import FettleDataGridPropTypes from './fettle.data.grid.props.types'
import { logobase64 } from './logoBASE64'
import { FettleSearchBox } from './fettle.search.box'
import { FettleActionMenu } from './fettle.action.menu'

// Explicitly define ActionButtonPropTypes here
export type ActionButtonPropTypes = {
  label?: string;
  icon?: string | React.ReactNode;
  tooltip?: string;
  disabled?: boolean | ((params?: any) => any);
  onClick: (params?: any) => any;
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5
}))

let lastSearchKey = ''

export const FettleDataGrid = (props: FettleDataGridPropTypes) => {
  const [loading, setLoading] = useState(true)
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(props.config.pageSize || 10)
  const [totalRecords, setTotalRecords] = useState(0)
  const [items, setItems] = useState([])
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | undefined>(undefined)

  const renderGrid = (pageData: any) => {
    setTotalRecords(pageData?.totalElements)
    setItems(pageData?.content)
    setLoading(false)
  }

  useEffect(() => {
    if (props.hasOwnProperty('selectedId')) {
      renderGrid({ totalElements: 0, content: [] })
    } else {
      if (typeof props.$datasource === 'function') {
        // Call the function and subscribe to the returned Observable
        props.$datasource().subscribe(renderGrid)
      } else if (props.$datasource instanceof Observable) {
        // Directly subscribe if it's already an Observable
        props.$datasource.subscribe(renderGrid)
      } else {
        console.error('Invalid $datasource type')
      }
    }
  }, [])

  useEffect(() => {
    if (typeof props.$datasource === 'function') {
      // Call the function and subscribe to the returned Observable
      if (props.selectedId) {
        props.$datasource().subscribe(renderGrid)
      }

      if (props.reloadtable) {
        setLoading(true)
        props.$datasource().subscribe(renderGrid)
      }
    } else if (props.$datasource instanceof Observable) {
      if (props.selectedId) {
        props.$datasource.subscribe(renderGrid)
      }

      if (props.reloadtable) {
        setLoading(true)
        props.$datasource.subscribe(renderGrid)
      }
    } else {
      console.error('Invalid $datasource type')
    }
  }, [props.selectedId, props.reloadtable])

  const buildSearchBox = () => {
    const s = new Subject<string>()
    const observable = s.asObservable()

    observable
      .pipe(filter(searchTerm => searchTerm?.length > 2))
      .pipe(debounceTime(500))
      .pipe(distinctUntilChanged())
      .pipe(
        switchMap((searchKey: string) => {
          lastSearchKey = searchKey
          setLoading(true)

          if (typeof props?.$datasource === 'function') {
            return props?.$datasource({ searchKey, page: 0, size: rows, active: true })
          } else {
            return props?.$datasource
          }

          // return typeof props?.$datasource === (((params?: any) => Observable<any>))? props?.$datasource({ searchKey, page: 0, size: rows, active: true }):props?.$datasource;
        })
      )
      .subscribe(renderGrid)
    let debounceTimeout: string | number | NodeJS.Timeout | undefined

    const onChange = (data: any) => {
      clearTimeout(debounceTimeout)
      debounceTimeout = setTimeout(() => {
        if (!data && !!lastSearchKey) {
          lastSearchKey = data

          if (typeof props?.$datasource === 'function') {
            props.$datasource({ searchKey: data, page: 0, size: rows, active: true }).subscribe(renderGrid)
          } else {
            props?.$datasource.subscribe(renderGrid)
          }
        } else {
          s.next(data)
        }
      }, 1000)
    }
    return <FettleSearchBox onChange={onChange} label={props.config.header?.searchText as string} loading={loading} lastSearchKey={lastSearchKey} />
    // return null
    // return <FettleSearchBox  onChange={onChange} label={props.config.header?.searchText as string} />
  }

  const buildFettleActionMenu = () => {
    return (
      <FettleActionMenu
        menus={props.config.header?.selectionMenus}
        title={props.config.header?.selectionMenuButtonText}
      ></FettleActionMenu>
    )
  }

  const exportExcel = () => {
    setLoading(true)

    try {
      const xlsColumns = props.config?.header?.downloadbleColumns || []

      if (xlsColumns.length < 1) {
        return
      }

      const convertedData = items.map(rowObj => {
        const convertedObj: any = {}

        xlsColumns.forEach((path: any) => {
          const lastKey = path.split('.').pop()

          const fieldValue = path
            .split('.')
            .reduce((obj: { [x: string]: any }, part: string | number) => obj && obj[part], rowObj)

          if (lastKey.toLowerCase().includes('date')) {
            convertedObj[toWords(lastKey)] = moment(new Date(fieldValue)).format('DD/MM/YYYY')
          } else {
            convertedObj[toWords(lastKey)] = fieldValue
          }
        })

        return convertedObj
      })

      if (convertedData.length < 1) {
        setLoading(false)

        return
      }

      const workbook = new ExcelJS.Workbook()

      const bglogoID = workbook.addImage({
        base64: logobase64,
        extension: 'png'
      })

      const worksheet = workbook.addWorksheet('Data', { properties: { defaultColWidth: 20 } })

      worksheet.addImage(bglogoID, {
        tl: { col: 1, row: 0.3 } as any,
        br: { col: 2, row: 2.5 } as any,
        editAs: 'absolute'
      })
      const headerRow = worksheet.addRow(Object.keys(convertedData[0]))

      headerRow.eachCell(cell => {
        cell.font = { bold: true, color: { argb: 'ffffff' } }
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }

        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '313C96' }
        }
      })
      headerRow.height = 20

      convertedData.forEach(data => {
        worksheet.addRow(Object.values(data))
      })

      workbook.xlsx.writeBuffer().then((buffer: any) => {
        saveAsExcelFile(buffer, 'data.xlsx')
        setLoading(false)
      })
    } catch (err) {
      console.log('xls error', err)
    }
  }

  const saveAsExcelFile = (buffer: BlobPart, fileName: string) => {
    // import('file-saver').then(FileSaver => {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const EXCEL_EXTENSION = '.xlsx'

    const data = new Blob([buffer], {
      type: EXCEL_TYPE
    })

    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION)
    setLoading(false)

    // })
  }

  const renderHeader = () => {
    if (props.config.header && props.config.header.enable)
      return (
        <div className='flex align-items-center flex-wrap row-gap-2'>
          <div className='w-full lg:w-auto'>
            <h3>{props.config.header.text}</h3>
          </div>
          <div className='w-full lg:w-auto md:flex-1 md:justify-content-center md:flex px-2 md:px-6 lg:px-12'>
            {props.config.header.enableGlobalSearch && buildSearchBox()}
            {props.config.header.downloadButtonInHeader && (
              <PButton
                tooltip={props.config.header.downloadButtonInHeader.tooltip}
                tooltipOptions={{
                  position: 'bottom',
                  mouseTrack: true,
                  mouseTrackTop: 15
                }}
                style={{ width: '32px', height: '32px', marginRight: '4px', backgroundColor: 'blue', color: 'white' }}
                severity='secondary'
                rounded
                raised
                text
                outlined
                icon={props.config.header.downloadButtonInHeader.icon}
                onClick={props.config.header.downloadButtonInHeader.onClick}
                disabled={props.config.header.downloadButtonInHeader.disabled}
              />
            )}
          </div>
          <div className='w-full lg:w-auto flex justify-content-end align-items-center'>
            {props.config.header.enableDownload && (
              <PButton
                tooltip={'Excel Download'}
                tooltipOptions={{
                  position: 'bottom',
                  mouseTrack: true,
                  mouseTrackTop: 15
                }}
                style={{ width: '32px', height: '32px', marginRight: '4px' }}
                severity='secondary'
                rounded
                raised
                text
                outlined
                icon={'pi pi-file-excel'}
                onClick={exportExcel}
              />
            )}
            {props.config.header.selectionMenus && buildFettleActionMenu()}
            {props.config.header.addCreateButton && (
              <PButton
                tooltip={props.config.header.createButtonText || 'Create'}
                tooltipOptions={{
                  position: 'bottom',
                  mouseTrack: true,
                  mouseTrackTop: 15
                }}
                style={{ width: '32px', height: '32px' }}
                severity='secondary'
                rounded
                raised
                text
                outlined
                icon={props.config.header?.createButtonIcon || 'pi pi-plus'}
                onClick={() => {
                  typeof props.config.header?.onCreateButtonClick === 'function' &&
                    props.config.header?.onCreateButtonClick()
                }}
              />
            )}
          </div>
        </div>
      )
  }

  const onPage = (event: DataTableStateEvent) => {
    setLoading(true)
    const startIndex = event.first

    setFirst(startIndex)

    if (rows != event.rows) {
      setRows(event.rows)
    }

    if (typeof props?.$datasource === 'function') {
      props
        .$datasource({
          page: event.page,
          size: event.rows,
          summary: true,
          active: true,
          searchKey: lastSearchKey
        })
        .subscribe((page: { content: React.SetStateAction<never[]> }) => {
          setItems(page.content)
          setLoading(false)
        })
    } else {
      props.$datasource.subscribe((page: { content: React.SetStateAction<never[]> }) => {
        setItems(page.content)
        setLoading(false)
      })
    }
  }

  const accept = (
    button: any,
    rowData: any
  ) => {
    Object.prototype.toString.call(button.onClick) == '[object Function]' && button.onClick(rowData)
  }

  const reject = (button: any) => { }

  const confirm = (event: any, button: any, rowData: any) => {
    confirmPopup({
      target: event.currentTarget,
      message: `Are you sure you want to ${button.tooltip ? button.tooltip : 'proceed'}?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => accept(button, rowData),
      reject: () => reject(button)
    })
  }

  const actionTemplate = (rowData: any, column: any) => {
    return (
      <Grid container sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '1px' }}>
        {props.config.actionButtons?.map((button: any, id: number) => (
          <PButton
            key={`btn-${id}`}
            rounded
            type='button'
            icon={typeof button.icon === 'string' ? button.icon : undefined}
            style={{ width: '16px', height: '16px', minWidth: '16px', minHeight: '16px', padding: '0px', fontSize: '0.7rem', border: 'none', background: 'transparent', whiteSpace: 'normal' }}
            tooltipOptions={{
              showOnDisabled: true,
              mouseTrack: true,
              position: 'left'
            }}
            tooltip={button.tooltip && !button.disabled ? button.tooltip : ''}
            disabled={
              button.disabled && typeof button.disabled == 'function' ? button.disabled(rowData) : button.disabled
            }
            onClick={e => {
              e.stopPropagation()
              if (props?.isCopy) accept(button, rowData)
              else if (props?.config?.disableConfirm) accept(button, rowData)
              else confirm(e, button, rowData)
            }}
          >
            {typeof button.icon !== 'string' ? button.icon : null}
            {button?.label}
          </PButton>
        ))}
      </Grid>
    )
  }

  const progressTemplate = (rowData: { progressPercentage: number | undefined }) => {
    return (
      <BorderLinearProgress variant='determinate' value={rowData.progressPercentage ? rowData.progressPercentage : 0} />
    )
  }

  const columnDefination = (column: FettleDataGridPropTypes['columnsdefination'][number]) => {
    let handleCellEditComplete = null

    if (props?.config?.editCell) {
      handleCellEditComplete = column.onCellEditComplete ? column.onCellEditComplete : null
    }

    return (
      <Column
        field={column.field}
        key={column.field}
        header={column.headerName}
        body={column.body}
        style={column.style}
        headerStyle={column.headerStyle}
        bodyStyle={column.bodyStyle}
        editor={props?.config?.editCell && column.editor ? column.editor : null}
        expander={column.expand}
        {...(handleCellEditComplete ? { onCellEditComplete: (e: any) => onCellEditComplete(e, handleCellEditComplete) } : {})}
      ></Column>
    )
  }

  const buildActionColumn = () => {
    return <Column header='Action' key='action' body={actionTemplate} style={{ width: '40rem' }} bodyStyle={{ padding: '0px' }}></Column>
  }

  const buildProgressColumn = () => {
    return <Column header='Progress' key='progress' body={progressTemplate}></Column>
  }

  // const allowExpansion = rowData => {
  //   return rowData.orders.length > 0;
  // };

  const buildColumns = () => {
    const columns: any[] = []

    if (props.config.enableSelection) {
      const mode = props.config.singleSelectionMode ? 'single' : 'multiple'
      const selectionColumn = <Column selectionMode={mode} style={{ width: '3em' }} key='selection' />

      columns.push(selectionColumn)
    }

    if (props.config.rowExpand === true) {
      columns.push(<Column expander={true} style={{ width: '20px' }} key='rowExpand' />)
    }

    props.columnsdefination.map((column: FettleDataGridPropTypes['columnsdefination'][number]) => columnDefination(column)).forEach(item => {
      if (!item?.props?.expander || (item.props.expander && item.props.expander !== true)) {

        columns.push(item)
      }
    })

    if (props.config && props.config.progressColumn) {
      columns.push(buildProgressColumn())
    }

    if (props.config && props.config.actionButtons && props.config.actionButtons?.length > 0) {
      columns.push(buildActionColumn())
    }

    return columns
  }

  const onSelectionChange = (e: any) => {
    // Filter selected rows based on the isRowSelectable logic
    const filteredSelection = e.value.filter((row: any) => {
      // Apply your row selection condition here
      return props.isRowSelectable ? props.isRowSelectable(row) : true
    })

    // Update selected items with the filtered rows
    setSelectedItems(filteredSelection)

    // Call the parent callback if it exists
    props.config.header?.enable &&
      typeof props.config.header.onSelectionChange === 'function' &&
      props.config.header.onSelectionChange(filteredSelection)
  }

  const isSelectable = (value: string, field: string) => {
    let isSelectable = true

    if (field === 'id' && value === '1001') {
      isSelectable = false
    }

    return isSelectable
  }

  const isRowSelectable = (event: { data: any }) => {
    const data = event.data

    return isSelectable(data.id, 'id')
  }

  const onCellEditComplete = (e: any, columnOnCellEditComplete: ((arg0: any, arg1: any[]) => void) | null) => {
    const _products: any = [...items]
    const { newRowData, rowIndex, rowData, newValue, field, originalEvent: event } = e

    // if (newValue?.trim().length > 0) { //this worked
    _products[rowIndex] = { ...newRowData }
    setItems(_products)

    if (columnOnCellEditComplete) {
      columnOnCellEditComplete(e, _products)
    }

    // } else { //this worked
    //   event.preventDefault();
    // }
  }

  const onRowEditComplete = (e: any) => {
    const _products: any = [...items]
    const { newData, index } = e

    _products[index] = newData
    setItems(_products)
    props?.config?.editRows &&
      typeof props.config.onRowEditComplete === 'function' &&
      props.config.onRowEditComplete(e, _products)
  }

  useEffect(() => {
    const onLoadedData = (items: any) => {
      if (props.config.onLoadedData && typeof props.config.onLoadedData === 'function') {
        props.config.onLoadedData(items)
      }
    }

    onLoadedData(items)
  }, [items])

  const buildExpansionColumns = () => {
    return props.columnsdefination.map((column: FettleDataGridPropTypes['columnsdefination'][number]) => columnDefination(column)).filter(item => {

      return item.props.expander || (item.props.expander && item.props.expander === true)
    })
  }

  const rowExpansionTemplate = (data: any) => {
    const expansionColumns = buildExpansionColumns();


    return (

      // <DataTable emptyMessage='No data found' value={[data]}>
      //   {expansionColumns}
      // </DataTable>
      <DataTable emptyMessage="No data found" value={[data]}>
        {expansionColumns.length > 0 ? (
          expansionColumns.map((col: any, index: number) => (
            <Column key={index} {...col.props} expander={false} />
          ))
        ) : (
          <Column field="noData" header="No Data" />
        )}
      </DataTable>
    )
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--surface-f)',
        borderRadius: '0 0 8px 8px'
      }}
    >
      <ConfirmPopup />
      <DataTable
        header={renderHeader()}
        expandedRows={expandedRows}
        onRowToggle={(e: any) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey='id'
        value={items}
        editMode={props?.config?.editRows ? 'rows' : props?.config?.editCell ? 'cell' : undefined}
        stripedRows
        size='small'
        style={props?.style}
        rows={rows}
        resizableColumns
        showGridlines
        lazy
        onPage={onPage}
        loading={loading}
        selectionMode='multiple' // Set to 'multiple' for checkboxes
        selection={selectedItems} // Bind the selection state
        columnResizeMode='expand'
        onSelectionChange={onSelectionChange} // Handle selection changes
        onRowEditComplete={onRowEditComplete}
        className='custom-datatable shadow-6'
        emptyMessage='No data found'
        first={first}
        totalRecords={totalRecords}
        paginator={props.config.paginator === false ? false : true}
        currentPageReportTemplate='Showing {first} to {last} of {totalRecords} entries'
        paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
        rowsPerPageOptions={[5, 10, 15, 20, 25, 50, 100]}
        tableStyle={{ minWidth: props?.width || '' }}

      // {...props}
      >
        {buildColumns()}
      </DataTable>
    </div>
  )
}

// FettleDataGrid.defaultProps = {
//   config: { actionButtons: [], pageSize: 10, enableSelection: true, header: null },
//   $datasource: null,
//   columnsdefination: [],
// };
