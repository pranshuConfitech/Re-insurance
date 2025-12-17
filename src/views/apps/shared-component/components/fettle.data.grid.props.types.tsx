import type { Observable } from 'rxjs'

export type ActionButtonPropTypes = {
  label?: string
  icon?: string | React.ReactNode
  tooltip?: string
  color?: string
  disabled?: boolean | ((params?: any) => any)
  onClick: (params?: any) => any
}

type HeaderPropTypes = {
  text: string
  enable?: boolean
  enableDownload?: boolean
  downloadbleColumns?: string[]
  searchText?: string
  enableGlobalSearch?: boolean
  clientSideSearch?: boolean
  minSearchLength?: number
  selectionMenus?: {
    label: string
    icon: string
    onClick: (params?: any) => any
  }[]
  onSelectionChange?: (params?: any) => any
  selectionMenuButtonText?: string
  onCreateButtonClick?: () => any
  addCreateButton?: boolean
  createButtonText?: string
  createButtonIcon?: string
  createButtonDisabled?: boolean
  downloadButtonInHeader?: {
    tooltip?: string;
    icon?: string;
    disabled?: boolean;
    onClick?: () => void;
  };
  enableStatusToggle?: boolean;
  onStatusChange?: (status: boolean) => void;
  colorLegend?: { label: string; color: string }[]
  customRightButtons?: {
    icon?: React.ReactNode;
    label?: string;
    onClick?: (e?: React.MouseEvent<HTMLElement>) => void;
    tooltip?: string;
    sx?: any;
  }[]
  enableDateFilter?: boolean
  onDateFilterClick?: () => void
  dateFilterStartDate?: Date | null
  dateFilterEndDate?: Date | null
}

type ColumnOptionsPropTypes = {
  enableSorting?: boolean
  enableColumnMenu?: boolean
  enableFiltering?: boolean
  enableColumnVisibility?: boolean
}

type FettleDataGridPropTypes = {
  isRowSelectable?: any
  rowExpansionTemplate?: any
  expandedRows?: any
  onRowToggle?: any
  style?: any
  isMultiFieldSearch?: boolean
  config: {
    paginator?: any
    progressColumn?: any
    rowExpand?: any
    singleSelectionMode?: any
    editCell?: any
    disableConfirm?: any
    onLoadedData?: any
    onRowEditComplete?: any
    editRows?: boolean
    actionButtons?: ActionButtonPropTypes[]
    scrollHeight?: string
    pageSize: number
    enableSelection?: boolean
    header?: HeaderPropTypes
    selectionMenus?: any[]
    expandableConfig?: any
    useAccordionMode?: any
    onAccordionExpand?: (row: any) => void
    columnOptions?: ColumnOptionsPropTypes
    hidePagination?: boolean
  }
  $datasource: Observable<any> | ((params?: any) => Observable<any>)
  columnsdefination: {
    field: string
    headerName: string
    body?: (...params: any) => any
    style?: object
    expand?: boolean
    headerStyle?: object
    bodyStyle?: object
    editor?: () => any
    onCellEditComplete?: (e: any, products: any[]) => void
  }[]
  onEdit?: (params?: any) => any
  selectedId?: string
  reloadtable?: boolean
  isCopy?: boolean
  width?: string
  onDownload?: () => void
  paginationModel?: { pageSize: number; page: number }
  rowsPerPageOptions?: number[]
  onPaginationModelChange?: (model: { pageSize: number; page: number }) => void
  showSearch?: boolean
  disableMultipleRowSelection?: boolean;
  onRowSelectionModelChange?: (newSelectionModel: any) => void;
}

export default FettleDataGridPropTypes
