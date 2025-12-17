'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback, MouseEvent as ReactMouseEvent } from 'react'
import { DataGrid, GridCellParams, useGridApiContext, useGridSelector, GridToolbarContainer, GridPagination } from "@mui/x-data-grid"
import {
  Button,
  IconButton,
  Grid,
  Tooltip,
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Pagination,
  Collapse,
  Menu,
  ListItemIcon,
  ListItemText,
  TextField,
  Divider,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from "@mui/material"
import {
  Add,
  Download,
  ChevronRight,
  Edit,
  MoreVert,
  ArrowUpward,
  ArrowDownward,
  FilterList,
  ViewColumn,
  Restore
} from "@mui/icons-material"
import { debounceTime, distinctUntilChanged, filter, Observable, Subject, switchMap } from "rxjs"

import type FettleDataGridPropTypes from './fettle.data.grid.props.types'
import { FettleActionMenu } from "./fettle.action.menu"
import { FettleSearchBox } from "./fettle.search.box"
import { getStatusCategory } from "./utils/stattus-determination"
import DataGridSkeleton from "./utils/datagrid-skeleton"
import { useRouter } from 'next/navigation'

let lastSearchKey = ''

function CustomPagination(props: any) {
  return (
    <GridToolbarContainer sx={{ justifyContent: 'flex-end', alignItems: 'center', p: 1 }}>
      {props.onDownload && (
        <Tooltip title="Download file" arrow>
          <IconButton
            color="primary"
            aria-label="download"
            onClick={props.onDownload}
            size="small"
            sx={{ mr: 1 }}
          >
            <Download />
          </IconButton>
        </Tooltip>
      )}
      <GridPagination />
    </GridToolbarContainer>
  );
}

export function FettleDataGrid(props: FettleDataGridPropTypes) {
  console.log("props", props);

  const [loading, setLoading] = useState(true)
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)
  const [totalRecords, setTotalRecords] = useState(0)
  const [items, setItems] = useState<{ id: string | number;[key: string]: any }[]>([])
  const [paginationModel, setPaginationModel] = useState(
    props.paginationModel || { page: 0, pageSize: props.rowsPerPageOptions?.[0] || 10 }
  )
  const [selectionModel, setSelectionModel] = useState<any[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set());
  const [selectedStatus, setSelectedStatus] = useState('active');
  const createInitialColumnVisibility = () => {
    const visibility: Record<string, boolean> = {}
    props.columnsdefination.forEach((col: any) => {
      visibility[col.field] = true
    })
    return visibility
  }
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(createInitialColumnVisibility)
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})
  const [sorting, setSorting] = useState<{ field?: string; direction?: 'asc' | 'desc' }>({})
  const [columnMenuState, setColumnMenuState] = useState<{ field: string | null; anchorEl: HTMLElement | null }>({
    field: null,
    anchorEl: null
  })
  const [dateFilterMenuPosition, setDateFilterMenuPosition] = useState<{ top: number; left: number } | null>(null)
  const [manageColumnsOpen, setManageColumnsOpen] = useState(false)
  const rowsPerPageOptions = props.rowsPerPageOptions || [10, 25]
  const router = useRouter()

  // Use accordion mode if enabled in config
  const useAccordionMode = props.config?.useAccordionMode || false;
  const expandableConfig = props.config?.expandableConfig;
  const columnOptions = props.config?.columnOptions || {}
  const enableSorting = !!columnOptions.enableSorting
  const enableColumnMenu = !!columnOptions.enableColumnMenu
  const enableFiltering = !!columnOptions.enableFiltering
  const enableColumnVisibility = !!columnOptions.enableColumnVisibility

  useEffect(() => {
    setColumnVisibility(prev => {
      const updated: Record<string, boolean> = {}
      props.columnsdefination.forEach((col: any) => {
        updated[col.field] = prev[col.field] !== undefined ? prev[col.field] : true
      })
      return updated
    })
    setColumnFilters(prev => {
      const updated: Record<string, string> = {}
      props.columnsdefination.forEach((col: any) => {
        if (prev[col.field]) {
          updated[col.field] = prev[col.field]
        }
      })
      return updated
    })
  }, [props.columnsdefination])

  const visibleColumns = useMemo(
    () => props.columnsdefination.filter((col: any) => columnVisibility[col.field] !== false),
    [props.columnsdefination, columnVisibility]
  )
  const hasActionColumn = Array.isArray(props.config?.actionButtons) && props.config.actionButtons.length > 0
  const computedGridTemplate = useMemo(() => {
    if (expandableConfig?.gridTemplate) return expandableConfig.gridTemplate
    const dynamicColumns = visibleColumns.map((col: any) => (col.width ? `${col.width}px` : '1fr'))
    const templateParts = ['60px', ...dynamicColumns]
    if (hasActionColumn) {
      templateParts.push('auto')
    }
    return templateParts.join(' ')
  }, [visibleColumns, expandableConfig?.gridTemplate, hasActionColumn])

  const getCellValue = (row: any, field: string) => {
    if (!field) return undefined
    return field.split('.').reduce((obj: any, key: string) => (obj ? obj[key] : undefined), row)
  }

  const collator = useMemo(() => new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }), [])

  const displayedItems = useMemo(() => {
    let data = [...items]

    Object.entries(columnFilters).forEach(([field, value]) => {
      if (value && value.trim()) {
        const searchValue = value.trim().toLowerCase()
        data = data.filter(row => {
          const cellValue = getCellValue(row, field)
          if (cellValue === undefined || cellValue === null) return false
          return String(cellValue).toLowerCase().includes(searchValue)
        })
      }
    })

    if (sorting.field && sorting.direction) {
      data = [...data].sort((a, b) => {
        const aValue = getCellValue(a, sorting.field as string)
        const bValue = getCellValue(b, sorting.field as string)

        if (aValue == null && bValue == null) return 0
        if (aValue == null) return sorting.direction === 'asc' ? -1 : 1
        if (bValue == null) return sorting.direction === 'asc' ? 1 : -1

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sorting.direction === 'asc' ? aValue - bValue : bValue - aValue
        }

        const comparison = collator.compare(String(aValue), String(bValue))
        return sorting.direction === 'asc' ? comparison : -comparison
      })
    }

    return data
  }, [items, columnFilters, sorting, collator])

  const handlePaginationModelChange = props.onPaginationModelChange || ((newPaginationModel: { pageSize: number, page: number }) => {
    setLoading(true)
    setFirst(newPaginationModel.page)
    setPaginationModel(newPaginationModel)

    if (typeof props.$datasource === 'function') {
      props.$datasource({
        page: newPaginationModel.page,
        size: newPaginationModel.pageSize,
        summary: true,
        active: true,
        searchKey: lastSearchKey
      }).subscribe((page: any) => {
        setItems(page?.content || [])
        setLoading(false)
      })
    } else {
      props.$datasource.subscribe((page: any) => {
        setItems(page.content)
        setLoading(false)
      })
    }
  })

  const renderGrid = (pageData: any) => {
    setTotalRecords(pageData?.totalElements)
    setItems(pageData?.content)
    setLoading(false)
  }

  const handleCheckboxChange = (rowId: string | number) => {
    setSelectionModel(prev => {
      const newSelection = prev.includes(rowId)
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId]

      // Notify parent component of selection change
      if (props.config.header?.onSelectionChange) {
        const selectedRows = items.filter((item: any) => newSelection.includes(item.id))
        props.config.header.onSelectionChange(selectedRows)
      }

      return newSelection
    })
  }

  const toggleRowExpansion = (rowId: string | number, row?: any) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      const isExpanding = !newSet.has(rowId);

      if (newSet.has(rowId)) {
        // Collapsing the row
        newSet.delete(rowId);
      } else {
        // Expanding the row
        // If accordion mode is enabled, clear all other expanded rows first
        if (useAccordionMode) {
          newSet.clear();
        }
        newSet.add(rowId);

        // Find the row data if not provided as parameter
        const rowData = row || items.find(item => item.id === rowId);

        if (rowData) {
          // Call onAccordionExpand callback when expanding (for agents)
          if (props.config?.onAccordionExpand) {
            props.config.onAccordionExpand(rowData);
          }

          // Call onExpand callback when expanding (for providers)
          if (expandableConfig?.onExpand) {
            expandableConfig.onExpand(rowData);
          }
        }
      }
      return newSet;
    });
  };

  const getStatusColor = (row: any) => {
    if (expandableConfig?.getStatusColor) {
      return expandableConfig.getStatusColor(row);
    }
    // Default color logic
    return row.status === 'active' ? '#28a745' : '#17a2b8';
  };

  const handleHeaderSortClick = (field: string) => {
    if (!enableSorting) return
    setSorting(prev => {
      if (prev.field !== field) return { field, direction: 'asc' }
      if (prev.direction === 'asc') return { field, direction: 'desc' }
      return {}
    })
  }

  const applySorting = (field: string | null, direction?: 'asc' | 'desc') => {
    if (!field) return
    if (!direction) {
      setSorting({})
      return
    }
    setSorting({ field, direction })
  }

  const handleFilterValueChange = (field: string | null, value: string) => {
    if (!field) return
    setColumnFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleHideColumn = (field: string | null) => {
    if (!field) return
    const visibleCount = Object.entries(columnVisibility).filter(([key, value]) => key !== field && value !== false).length
    if (visibleCount === 0) {
      closeColumnMenu()
      return
    }
    setColumnVisibility(prev => ({
      ...prev,
      [field]: false
    }))
    closeColumnMenu()
  }

  const openColumnMenu = (field: string, event: ReactMouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setColumnMenuState({ field, anchorEl: event.currentTarget })
  }

  const closeColumnMenu = () => {
    setColumnMenuState({ field: null, anchorEl: null })
  }

  const handleColumnVisibilityChange = (field: string, visible: boolean) => {
    if (!visible) {
      const visibleCount = Object.entries(columnVisibility).filter(([key, value]) => key !== field && value !== false).length
      if (visibleCount === 0) {
        return
      }
    }
    setColumnVisibility(prev => ({
      ...prev,
      [field]: visible
    }))
  }

  const resetColumnVisibility = () => {
    const visibility: Record<string, boolean> = {}
    props.columnsdefination.forEach((col: any) => {
      visibility[col.field] = true
    })
    setColumnVisibility(visibility)
  }

  // Action column configuration
  const actionColumn = {
    field: 'action',
    headerName: 'Action',
    width: 250,
    sortable: false,
    filterable: false,
    cellClassName: 'action-column',
    headerClassName: 'action-column-header',
    renderCell: (params: { row: any }) => (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center', gap: '4px', padding: '4px', width: '100%', boxSizing: 'border-box' }}>
        {props.config.actionButtons?.map((button, id) => {
          const isDisabled = typeof button.disabled === 'function'
            ? button.disabled(params.row)
            : (typeof button.disabled === 'boolean' ? button.disabled : false);

          return (
            <Tooltip key={`acbtns-${id}`} title={!isDisabled ? button.tooltip : ''} arrow disableHoverListener={isDisabled}>
              <IconButton
                size="small"
                disabled={isDisabled}
                onClick={(e) => {
                  e.stopPropagation()
                  if (typeof button.onClick === 'function') {
                    button.onClick(params.row)
                  }
                }}
                sx={{ color: button.color || getStatusCategory(button.tooltip || 'info'), padding: '4px', flexShrink: 0 }}
              >
                {typeof button.icon === 'string' ? (
                  <span className={button.icon} />
                ) : (
                  button.icon
                )}
              </IconButton>
            </Tooltip>
          )
        })}
      </Box>
    )
  }

  const buildColumns = () => {
    const columns = props.columnsdefination.map((column: any) => {
      const isNested = column.field.includes('.')
      const newCol: any = {
        field: isNested ? column.field.replace(/\./g, '_') : column.field,
        headerName: column.headerName,
        flex: 1,
        minWidth: 180,
        width: column.width || undefined,
      }

      if (column.field === 'agentBasicDetails.name') {
        newCol.renderCell = (params: any) => {
          const handleNameClick = (e: React.MouseEvent) => {
            e.stopPropagation()
            const agentId = params.row.id
            router.push(`/agents/management?mode=viewOnly&selectedAgent=${agentId}`)
          }

          return (
            <span
              onClick={handleNameClick}
              style={{
                cursor: 'pointer',
                color: '#6b7280',
                textDecoration: 'underline',
                fontWeight: 400,
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#4b5563'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#6b7280'
              }}
            >
              {params.value !== null && params.value !== undefined ? params.value : 'N/A'}
            </span>
          )
        }
      } else if (column.body) {
        newCol.renderCell = (params: any) => column.body(params.row, newCol)
      }

      if (isNested) {
        const path = column.field.split('.')
        newCol.valueGetter = (params: any) =>
          path.reduce((obj: any, key: string) => (obj ? obj[key] : undefined), params.row)
      }

      return newCol
    })

    if (props.config?.actionButtons?.length) {
      columns.push(actionColumn)
    }

    return columns
  }

  const searchSubjectRef = useRef<Subject<string> | null>(null)
  const searchSubscriptionRef = useRef<any>(null)

  // Initialize search subject and observable once
  useEffect(() => {
    if (!searchSubjectRef.current) {
      searchSubjectRef.current = new Subject<string>()
      const observable = searchSubjectRef.current.asObservable()
        .pipe(filter(searchTerm => {
          const minLen = props.config.header?.minSearchLength ?? 1
          return (searchTerm ?? '').length >= minLen
        }))
        .pipe(debounceTime(500))
        .pipe(distinctUntilChanged())
        .pipe(
          switchMap((searchKey: string) => {
            lastSearchKey = searchKey
            setLoading(true)
            // If client-side search is enabled, filter locally without new API call
            if (props.config.header?.clientSideSearch) {
              // Access current items from state using a callback
              setItems(currentItems => {
                const filtered = currentItems.filter((row: any) => {
                  const values = Object.values(row || {})
                    .map((v: any) => (typeof v === 'object' ? JSON.stringify(v) : String(v || '')))
                    .join(' ') // coarse, across-row search
                    .toLowerCase()
                  return values.includes(searchKey.toLowerCase())
                })
                setTotalRecords(filtered.length)
                setLoading(false)
                return filtered
              })
              // Return a dummy observable to satisfy the chain
              return new Observable((subscriber) => {
                subscriber.next({ totalElements: 0, content: [] })
                subscriber.complete()
              })
            }

            return typeof props.$datasource === 'function'
              ? props.$datasource({ searchKey, page: 0, size: rows, active: true })
              : props.$datasource
          })
        )

      searchSubscriptionRef.current = observable.subscribe(renderGrid)
    }

    // Cleanup on unmount
    return () => {
      if (searchSubscriptionRef.current) {
        searchSubscriptionRef.current.unsubscribe()
        searchSubscriptionRef.current = null
      }
      if (searchSubjectRef.current) {
        searchSubjectRef.current.complete()
        searchSubjectRef.current = null
      }
    }
  }, [])

  // Stable onChange handler
  const handleSearchChange = useCallback((data: string) => {
    if (!data && !!lastSearchKey) {
      lastSearchKey = data
      if (props.config.header?.clientSideSearch) {
        setLoading(true)
        if (typeof props.$datasource === 'function') {
          props.$datasource({ page: 0, size: rows, active: true }).subscribe(renderGrid)
        } else if (props.$datasource instanceof Observable) {
          props.$datasource.subscribe(renderGrid)
        }
      } else {
        if (typeof props.$datasource === 'function') {
          props.$datasource({ searchKey: data, page: 0, size: rows, active: true }).subscribe(renderGrid)
        } else {
          props.$datasource.subscribe(renderGrid)
        }
      }
    } else if (searchSubjectRef.current) {
      searchSubjectRef.current.next(data)
    }
  }, [props.config.header?.clientSideSearch, props.$datasource, rows])

  const buildSearchBox = () => {
    if (!props.config.header?.enableGlobalSearch) return null
    return (
      <FettleSearchBox
        loading={loading}
        lastSearchKey={lastSearchKey}
        onChange={handleSearchChange}
        label={props.config.header?.searchText as string}
      />
    )
  }

  const RenderHeader = () => {
    if (!props.config.header?.enable) return null

    return (
      <Grid container
        className="flex flex-wrap items-center gap-y-2 mb-2"
        sx={{
          borderTopRightRadius: '10px',
          borderTopLeftRadius: '10px'
        }}
      >
        <Grid item className='flex'>
          <h3 className="text-lg font-semibold">{props.config.header.text}</h3>
        </Grid>

        {/* Status Toggle (if enabled) */}
        {props.config.header?.enableStatusToggle && (
          <Grid item>
            <div
              onClick={() => {
                const newStatus = selectedStatus === 'active' ? 'inactive' : 'active'
                setSelectedStatus(newStatus)
                if (props.config.header?.onStatusChange) {
                  props.config.header.onStatusChange(newStatus === 'active')
                }
              }}
              style={{
                position: 'relative',
                width: '50px',
                height: '24px',
                marginLeft: '10px',
                backgroundColor: selectedStatus === 'active' ? '#28a745' : '#cccccc',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
            >
              <div style={{
                position: 'absolute',
                top: '2px',
                left: selectedStatus === 'active' ? '26px' : '2px',
                width: '20px',
                height: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '50%',
                transition: 'left 0.2s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
              }}></div>
            </div>
          </Grid>
        )}

        <Grid item className="flex flex-1 justify-center gap-2 px-2 md:px-6 lg:px-12">
          {props.config.header.enableGlobalSearch && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '800px', justifyContent: 'center' }}>
              {buildSearchBox()}
              {props.config.header?.enableDateFilter && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        setDateFilterMenuPosition({
                          top: rect.bottom + window.scrollY,
                          left: rect.left + window.scrollX
                        });
                      }}
                      sx={{
                        padding: '4px',
                        color: (props.config.header?.dateFilterStartDate || props.config.header?.dateFilterEndDate) ? '#d80f51' : '#6c757d',
                        '&:hover': { backgroundColor: '#f0f0f0' }
                      }}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                    {(props.config.header?.dateFilterStartDate || props.config.header?.dateFilterEndDate) && (
                      <Chip
                        label={
                          props.config.header?.dateFilterStartDate && props.config.header?.dateFilterEndDate
                            ? `${new Date(props.config.header.dateFilterStartDate).toLocaleDateString()} - ${new Date(props.config.header.dateFilterEndDate).toLocaleDateString()}`
                            : props.config.header?.dateFilterStartDate
                              ? `From: ${new Date(props.config.header.dateFilterStartDate).toLocaleDateString()}`
                              : `To: ${new Date(props.config.header.dateFilterEndDate!).toLocaleDateString()}`
                        }
                        size="small"
                        onClick={() => {
                          if (props.config.header?.onDateFilterClick) {
                            props.config.header.onDateFilterClick();
                          }
                        }}
                        sx={{
                          height: '24px',
                          fontSize: '11px',
                          backgroundColor: '#fff3e0',
                          color: '#d80f51',
                          border: '1px solid #d80f51',
                          cursor: 'pointer',
                          '& .MuiChip-label': {
                            padding: '0 8px'
                          },
                          '&:hover': {
                            backgroundColor: '#ffe0b2'
                          }
                        }}
                      />
                    )}
                  </Box>
                  <Menu
                    anchorReference="anchorPosition"
                    anchorPosition={
                      dateFilterMenuPosition
                        ? { top: dateFilterMenuPosition.top, left: dateFilterMenuPosition.left }
                        : undefined
                    }
                    open={Boolean(dateFilterMenuPosition)}
                    onClose={() => setDateFilterMenuPosition(null)}
                  >
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        if (props.config.header?.onDateFilterClick) {
                          props.config.header.onDateFilterClick();
                        }
                        setDateFilterMenuPosition(null);
                      }}
                    >
                      Filter by date
                    </MenuItem>
                  </Menu>
                </>
              )}
            </div>
          )}
          {props.config.header.selectionMenus && (
            <FettleActionMenu
              menus={props.config.header.selectionMenus}
              title={props.config.header.selectionMenuButtonText}
            />
          )}
          {enableColumnVisibility && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<ViewColumn fontSize="small" />}
              onClick={() => setManageColumnsOpen(true)}
            >
              Columns
            </Button>
          )}
        </Grid>

        {/* Color Legend (if enabled) */}
        {props.config.header?.colorLegend && (
          <Grid item sx={{ display: 'flex', gap: 2.5, mr: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            {props.config.header.colorLegend.map((legend: any, idx: number) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: legend.onClick ? 'pointer' : 'default',
                  opacity: legend.isActive ? 1 : (legend.onClick ? 0.8 : 1),
                  padding: legend.onClick ? '4px 8px' : '0',
                  borderRadius: legend.onClick ? '4px' : '0',
                  backgroundColor: legend.isActive ? `${legend.color}20` : 'transparent',
                  transition: 'all 0.2s ease'
                }}
                onClick={legend.onClick || undefined}
              >
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: legend.color,
                  borderRadius: '50%'
                }}></div>
                <span style={{ fontSize: '13px', color: '#495057', fontWeight: legend.isActive ? '600' : '400' }}>{legend.label}</span>
              </div>
            ))}
          </Grid>
        )}
        {props.config.header.addCreateButton && (
          <Grid item>
            <Button
              size="small"
              sx={{
                backgroundColor: '#28a745',
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: '#218838'
                },
                '&.Mui-disabled': {
                  backgroundColor: '#6c757d',
                  color: '#fff'
                }
              }}
              variant="contained"
              onClick={props.config.header?.onCreateButtonClick}
              disabled={props.config.header?.createButtonDisabled || false}
            // startIcon={props.config.header.createButtonText ? undefined : <Add fontSize="small" />}
            >
              {props.config.header.createButtonText || <Add fontSize="small" />}
            </Button>
          </Grid>
        )}
      </Grid>
    )
  }

  // Accordion Style Table Renderer
  const renderAccordionTable = () => {
    return (
      <div style={{
        backgroundColor: '#f1f1f1',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: computedGridTemplate,
          backgroundColor: '#f1f1f1',
          borderBottom: '1px solid #dee2e6',
          padding: '12px 16px',
          fontWeight: 'bold',
          fontSize: '14px',
          color: '#495057'
        }}>
          <div style={{ textAlign: 'center' }}></div>
          {/* Checkbox Header (if selection is enabled) */}
          {props.config?.enableSelection && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Checkbox
                checked={selectionModel.length > 0 && selectionModel.length === displayedItems.length}
                indeterminate={selectionModel.length > 0 && selectionModel.length < displayedItems.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    const allIds = displayedItems.map((item: any) => item.id)
                    setSelectionModel(allIds)
                    if (props.config.header?.onSelectionChange) {
                      props.config.header.onSelectionChange(displayedItems)
                    }
                  } else {
                    setSelectionModel([])
                    if (props.config.header?.onSelectionChange) {
                      props.config.header.onSelectionChange([])
                    }
                  }
                }}
              />
            </div>
          )}
          {visibleColumns.map((col: any) => {
            const isSorted = sorting.field === col.field
            const filterActive = !!columnFilters[col.field]
            const justifyContent =
              col.align === 'center' ? 'center' : col.align === 'right' ? 'flex-end' : 'flex-start'
            return (
              <div
                key={col.field}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: justifyContent,
                  gap: 6
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    cursor: enableSorting ? 'pointer' : 'default',
                    userSelect: 'none'
                  }}
                  onClick={() => enableSorting && handleHeaderSortClick(col.field)}
                >
                  {col.headerName}
                  {enableSorting && isSorted && (
                    sorting.direction === 'asc' ? (
                      <ArrowUpward fontSize="inherit" style={{ fontSize: '16px' }} />
                    ) : (
                      <ArrowDownward fontSize="inherit" style={{ fontSize: '16px' }} />
                    )
                  )}
                </span>
                {enableFiltering && filterActive && (
                  <FilterList fontSize="inherit" color="primary" style={{ fontSize: '16px' }} />
                )}
                {enableColumnMenu && (
                  <IconButton
                    size="small"
                    onClick={(event) => openColumnMenu(col.field, event)}
                    sx={{ padding: '2px' }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                )}
              </div>
            )
          })}
          {hasActionColumn && (
            <div style={{ textAlign: 'center' }}>Action</div>
          )}
        </div>

        {/* Table Rows */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
            Loading...
          </div>
        ) : displayedItems.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6c757d', fontSize: '16px' }}>
            No data available
          </div>
        ) : (
          displayedItems.map((row: any) => (
            <div key={row.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
              {/* Main Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: computedGridTemplate,
                padding: '12px 16px',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                transition: 'background-color 0.2s',
              }}>
                {/* Expand Button (status dot moved next to provider name) */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {expandableConfig && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleRowExpansion(row.id, row)
                      }}
                    >
                      <ChevronRight
                        style={{
                          transform: expandedRows.has(row.id) ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease-in-out'
                        }}
                      />
                    </IconButton>
                  )}
                </div>

                {/* Checkbox Column (if selection is enabled) */}
                {props.config?.enableSelection && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Checkbox
                      checked={selectionModel.includes(row.id)}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleCheckboxChange(row.id)
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}

                {/* Data Columns */}
                {visibleColumns.map((col: any, idx: number) => {
                  const value = getCellValue(row, col.field)

                  return (
                    <div key={col.field} style={{
                      color: idx === 0 ? '#212529' : '#6c757d',
                      fontWeight: idx === 0 ? '500' : 'normal',
                      fontSize: '14px',
                      textAlign: col.align || 'left',
                      display: idx === 0 ? 'inline-flex' : undefined,
                      alignItems: idx === 0 ? 'center' : undefined,
                      gap: idx === 0 ? '8px' : undefined
                    }}>
                      {idx === 0 ? (
                        <>
                          <span style={{ whiteSpace: 'nowrap' }}>{col.body ? col.body(row, col) : (value !== null && value !== undefined ? value : 'N/A')}</span>
                          <span
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: getStatusColor(row),
                              flexShrink: 0
                            }}
                          ></span>
                        </>
                      ) : (
                        <>{col.body ? col.body(row, col) : (value !== null && value !== undefined ? value : 'N/A')}</>
                      )}

                    </div>
                  );
                })}

                {/* Action Buttons */}
                {hasActionColumn && (
                  <div style={{ display: 'flex', justifyContent: (props.config as any)?.actionButtonAlign || 'flex-end', gap: '4px' }}>
                    {props.config.actionButtons?.map((button: any, btnIdx: number) => {
                      const isDisabled = typeof button.disabled === 'function'
                        ? button.disabled(row)
                        : button.disabled || false;

                      const iconContent = typeof button.icon === 'function'
                        ? button.icon(row)
                        : typeof button.icon === 'string'
                          ? <span className={button.icon} />
                          : button.icon;

                      const tooltipText = typeof button.tooltip === 'function'
                        ? button.tooltip(row)
                        : button.tooltip || '';

                      const buttonColor = typeof button.color === 'function'
                        ? button.color(row)
                        : button.color || getStatusCategory(tooltipText || 'info');

                      return (
                        <Tooltip key={btnIdx} title={tooltipText}>
                          <span>
                            <IconButton
                              size="small"
                              disabled={isDisabled}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (typeof button.onClick === 'function') {
                                  button.onClick(row)
                                }
                              }}
                              style={{ color: buttonColor }}
                            >
                              {iconContent}
                            </IconButton>
                          </span>
                        </Tooltip>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Expanded Content */}
              {expandedRows.has(row.id) && expandableConfig?.renderExpandedContent && (
                <div style={{
                  backgroundColor: '#fff',
                  borderBottom: '1px solid #dee2e6',
                  padding: '16px',
                }}>
                  {expandableConfig.renderExpandedContent(row)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  const columnMenuField = columnMenuState.field
  const columnMenuFilterValue = columnMenuField ? (columnFilters[columnMenuField] || '') : ''

  const renderColumnMenu = () => (
    <Menu
      anchorEl={columnMenuState.anchorEl}
      open={Boolean(columnMenuState.anchorEl)}
      onClose={closeColumnMenu}
      keepMounted
    >
      {enableSorting && [
        <MenuItem
          key="sort-asc"
          onClick={() => {
            applySorting(columnMenuField, 'asc')
            closeColumnMenu()
          }}
        >
          <ListItemIcon>
            <ArrowUpward fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sort ascending</ListItemText>
        </MenuItem>,
        <MenuItem
          key="sort-desc"
          onClick={() => {
            applySorting(columnMenuField, 'desc')
            closeColumnMenu()
          }}
        >
          <ListItemIcon>
            <ArrowDownward fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sort descending</ListItemText>
        </MenuItem>,
        <MenuItem
          key="sort-clear"
          onClick={() => {
            applySorting(columnMenuField, undefined)
            closeColumnMenu()
          }}
        >
          <ListItemIcon>
            <Restore fontSize="small" />
          </ListItemIcon>
          <ListItemText>Clear sorting</ListItemText>
        </MenuItem>,
        (enableFiltering || enableColumnVisibility) && <Divider key="divider-1" />
      ]}
      {enableFiltering && columnMenuField && (
        <Box sx={{ px: 2, py: 1 }} onClick={e => e.stopPropagation()}>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            Filter value
          </Typography>
          <TextField
            size="small"
            fullWidth
            value={columnMenuFilterValue}
            onChange={e => handleFilterValueChange(columnMenuField, e.target.value)}
            placeholder="Contains..."
          />
          {columnMenuFilterValue && (
            <Button
              size="small"
              sx={{ mt: 1 }}
              onClick={() => handleFilterValueChange(columnMenuField, '')}
            >
              Clear filter
            </Button>
          )}
          {enableColumnVisibility && <Divider sx={{ mt: 1 }} />}
        </Box>
      )}
      {enableColumnVisibility && [
        <MenuItem
          key="hide-column"
          disabled={!columnMenuField}
          onClick={() => {
            if (columnMenuField) {
              handleHideColumn(columnMenuField)
            }
          }}
        >
          <ListItemIcon>
            <ViewColumn fontSize="small" />
          </ListItemIcon>
          <ListItemText>Hide column</ListItemText>
        </MenuItem>,
        <MenuItem
          key="manage-columns"
          onClick={() => {
            setManageColumnsOpen(true)
            closeColumnMenu()
          }}
        >
          <ListItemIcon>
            <ViewColumn fontSize="small" />
          </ListItemIcon>
          <ListItemText>Manage columns</ListItemText>
        </MenuItem>
      ]}
    </Menu>
  )

  const renderManageColumnsDialog = () => (
    <Dialog open={manageColumnsOpen} onClose={() => setManageColumnsOpen(false)} maxWidth="xs" fullWidth>
      <DialogTitle>Manage columns</DialogTitle>
      <DialogContent dividers>
        {props.columnsdefination.map((col: any) => (
          <FormControlLabel
            key={col.field}
            control={
              <Checkbox
                checked={columnVisibility[col.field] !== false}
                onChange={(e) => handleColumnVisibilityChange(col.field, e.target.checked)}
              />
            }
            label={col.headerName}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={resetColumnVisibility}>Reset</Button>
        <Button onClick={() => setManageColumnsOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  )

  useEffect(() => {
    if (props.hasOwnProperty('selectedId')) {
      renderGrid({ totalElements: 0, content: [] })
    } else {
      if (typeof props.$datasource === 'function') {
        props.$datasource().subscribe(renderGrid)
      } else if (props.$datasource instanceof Observable) {
        props.$datasource.subscribe(renderGrid)
      } else {
        console.error('Invalid $datasource type')
      }
    }
  }, [])

  useEffect(() => {
    // Refresh whenever selectedId or reloadtable changes (even if reloadtable toggles false/true)
    if (typeof props.$datasource === 'function') {
      setLoading(true)
      props.$datasource().subscribe(renderGrid)
    } else if (props.$datasource instanceof Observable) {
      setLoading(true)
      props.$datasource.subscribe(renderGrid)
    }
  }, [props.selectedId, props.reloadtable])

  const onRowSelectionModelChange = (newSelectionModel: any) => {
    if (props.disableMultipleRowSelection) {
      setSelectionModel(newSelectionModel.slice(-1));
    } else {
      setSelectionModel(newSelectionModel);
    }

    const selectedRows = items.filter((row) =>
      newSelectionModel.includes(row.id)
    );

    if (typeof props.onRowSelectionModelChange === 'function') {
      props.onRowSelectionModelChange(selectedRows);
    }

    props.config.header?.enable &&
      typeof props.config.header.onSelectionChange === 'function' &&
      props.config.header.onSelectionChange(selectedRows);
  };

  // Render accordion mode or standard DataGrid
  if (useAccordionMode) {
    return (
      <>
        <div style={{ width: '100%', padding: '4px' }}>
          <RenderHeader />
          {renderAccordionTable()}

          {/* Enhanced Pagination for Accordion Mode */}
          {!props.config?.hidePagination && totalRecords > 0 && (
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderTop: '1px solid #e0e0e0',
              backgroundColor: '#fafafa',
              flexWrap: 'wrap',
              gap: 2
            }}>
              {/* Left side - Rows per page */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Rows per page:
                </Typography>
                <FormControl size="small" sx={{ minWidth: 80 }}>
                  <Select
                    value={paginationModel.pageSize}
                    onChange={(e) => {
                      handlePaginationModelChange({
                        page: 0,
                        pageSize: Number(e.target.value)
                      })
                    }}
                    sx={{
                      height: 32,
                      '& .MuiSelect-select': { py: 0.5 }
                    }}
                  >
                    {[10, 15, 20, 30, 50, 100].map((size) => (
                      <MenuItem key={size} value={size}>{size}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  {`${paginationModel.page * paginationModel.pageSize + 1}-${Math.min((paginationModel.page + 1) * paginationModel.pageSize, totalRecords)} of ${totalRecords}`}
                </Typography>
              </Box>

              {/* Right side - Page navigation */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Go to page input */}
                <Typography variant="body2" color="text.secondary">
                  Go to page:
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  sx={{
                    width: 70,
                    '& .MuiInputBase-input': {
                      py: 0.5,
                      textAlign: 'center'
                    }
                  }}
                  inputProps={{
                    min: 1,
                    max: Math.ceil(totalRecords / paginationModel.pageSize)
                  }}
                  defaultValue={paginationModel.page + 1}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement
                      const pageNum = parseInt(target.value, 10)
                      const maxPage = Math.ceil(totalRecords / paginationModel.pageSize)
                      if (pageNum >= 1 && pageNum <= maxPage) {
                        handlePaginationModelChange({
                          page: pageNum - 1,
                          pageSize: paginationModel.pageSize
                        })
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const pageNum = parseInt(e.target.value, 10)
                    const maxPage = Math.ceil(totalRecords / paginationModel.pageSize)
                    if (pageNum >= 1 && pageNum <= maxPage) {
                      handlePaginationModelChange({
                        page: pageNum - 1,
                        pageSize: paginationModel.pageSize
                      })
                    }
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  of {Math.ceil(totalRecords / paginationModel.pageSize)}
                </Typography>

                {/* Pagination buttons */}
                <Pagination
                  count={Math.ceil(totalRecords / paginationModel.pageSize)}
                  page={paginationModel.page + 1}
                  onChange={(e, page) => {
                    handlePaginationModelChange({
                      page: page - 1,
                      pageSize: paginationModel.pageSize
                    })
                  }}
                  color="primary"
                  showFirstButton
                  showLastButton
                  siblingCount={1}
                  boundaryCount={1}
                  size="small"
                />
              </Box>
            </Box>
          )}
        </div>
        {renderColumnMenu()}
        {renderManageColumnsDialog()}
      </>
    );
  }

  // Standard DataGrid mode
  return (
    <>
      <div style={{ height: props.isMultiFieldSearch ? props.config.scrollHeight : '500px', width: '100%', padding: '4px' }}>
        <Box sx={{
          height: props.isMultiFieldSearch ? props.config.scrollHeight : '500px',
          width: '100%',
          overflowX: 'auto',
          '& .action-column': {
            position: 'sticky',
            right: 0,
            backgroundColor: '#fff',
            zIndex: 1,
          },
          '& .action-column-header': {
            position: 'sticky',
            right: 0,
            backgroundColor: '#f5f5f5',
            zIndex: 2,
          },
        }}>
          <DataGrid
            slots={{
              toolbar: RenderHeader,
              loadingOverlay: () => DataGridSkeleton({
                rows: 10,
                columns: props.columnsdefination?.length || 0,
                checkboxSelection: true
              }),
              pagination: () => <CustomPagination onDownload={props.onDownload} />,
            }}
            columns={buildColumns()}
            checkboxSelection={props.config?.enableSelection}
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={onRowSelectionModelChange}
            getRowId={(row) => row.id || row[Object.keys(row)[0]]}
            rows={items}
            disableRowSelectionOnClick={props.disableMultipleRowSelection}
            pageSizeOptions={rowsPerPageOptions}
            loading={loading}
            paginationMode="server"
            rowCount={totalRecords}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: first } }
            }}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            localeText={{
              noRowsLabel: 'No data available'
            }}
            sx={{
              backgroundColor: 'background.default',
              "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                outline: "none !important"
              },
              '& .MuiDataGrid-row': loading ? { display: 'none' } : {
                minHeight: 120,
                maxHeight: 120,
                height: 120,
              },
              '--DataGrid-overlayHeight': '500px',
              '& .mui-4wo9z7-MuiDataGrid-root .MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell': {
                minHeight: 120,
                maxHeight: 120,
                height: 120,
              },
              '& .MuiDataGrid-columnHeaders': {
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              },
            }}
          />
        </Box>
      </div>
      {renderColumnMenu()}
      {renderManageColumnsDialog()}
    </>
  )
}
