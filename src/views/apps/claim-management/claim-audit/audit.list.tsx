import * as React from 'react'

import type { CSSProperties } from 'react'

import PropTypes from 'prop-types'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  alpha
} from '@mui/material'

import './audit.css'

const TypographyStyle2: CSSProperties = {
  fontSize: '10px',
  fontWeight: '500',
  textTransform: 'capitalize'
}

const TypographyStyle1: CSSProperties = {
  fontSize: '10px',
  fontWeight: '900',
  textTransform: 'capitalize'
}

const ThStyle: CSSProperties = {
  fontSize: '10px',
  fontWeight: '900',
  textTransform: 'capitalize',
  backgroundColor: '#eeeeee',
  padding: '10px',
  width: '10%'
}

const TrStyle: CSSProperties = {
  fontSize: '10px',
  fontWeight: '500',
  textTransform: 'capitalize'
}

const style = { display: 'flex' }

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein
  }
}

const rows = [
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Donut', 452, 25.0, 51, 4.9),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Honeycomb', 408, 3.2, 87, 6.5),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Jelly Bean', 375, 0.0, 94, 0.0),
  createData('KitKat', 518, 26.0, 65, 7.0),
  createData('Lollipop', 392, 0.2, 98, 0.0),
  createData('Marshmallow', 318, 0, 81, 2.0),
  createData('Nougat', 360, 19.0, 9, 37.0),
  createData('Oreo', 437, 18.0, 63, 4.0)
]

function descendingComparator(a: any, b: any, orderBy: string | number) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }

  if (b[orderBy] > a[orderBy]) {
    return 1
  }

  
return 0
}

function getComparator(order: any, orderBy: any) {
  return order === 'desc'
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy)
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array: any, comparator: any) {
  const stabilizedThis = array.map((el: any, index: any) => [el, index])

  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0])

    if (order !== 0) {
      return order
    }

    
return a[1] - b[1]
  })
  
return stabilizedThis.map((el: any) => el[0])
}

const headCells = [
  {
    id: 'claimDetail',
    numeric: false,
    disablePadding: false,
    label: 'Claim Detail'
  },
  {
    id: 'breakupDetail',
    numeric: false,
    disablePadding: false,
    label: 'Breakup Detail'
  }
]

function EnhancedTableHead(props: any) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props

  const createSortHandler = (property: any) => (event: any) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            style={{ fontSize: '16px', fontWeight: 'bold' }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
}

function EnhancedTableToolbar(props: any) {
  const { numSelected } = props

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: theme => alpha(theme?.palette?.primary?.main || '#D80E51', theme?.palette?.action?.activatedOpacity)
        })
      }}
    >
      <Typography sx={{ flex: '1 1 100%' }} variant='h3' id='tableTitle' component='div'>
        Claim Details
      </Typography>
    </Toolbar>
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
}

export default function AuditTable() {
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('calories')
  const [selected, setSelected] = React.useState<any>([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const handleRequestSort = (event: any, property: any) => {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: any) => {
    if (event.target.checked) {
      const newSelected: any = rows.map(n => n.name)

      setSelected(newSelected)
      
return
    }

    setSelected([])
  }

  const handleClick = (event: any, name: any) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected: any = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }

    setSelected(newSelected)
  }

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const visibleRows = React.useMemo(
    () => stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage]
  )

  return (
    <div className='custom-table-container'>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar numSelected={0} />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size={dense ? 'small' : 'medium'}>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                numSelected={0}
              />
              <TableBody>
                {visibleRows.map((row: any, index: number) => {
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row.name)}
                      role='checkbox'
                      tabIndex={-1}
                      key={row.name}
                      style={{ cursor: 'pointer', borderBottom: 'none' }}
                    >
                      <TableCell component='th' id={labelId} scope='row' padding='none' style={style}>
                        <Box>
                          <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                            <Typography style={TypographyStyle1}>Claim No</Typography>&nbsp;
                            <span>:</span>&nbsp;
                            <Typography style={TypographyStyle2}>DP2307070001</Typography>
                          </Box>
                          <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                            <Typography style={TypographyStyle1}>Cliam Sub-Type</Typography>&nbsp;
                            <span>:</span>&nbsp;
                            <Typography style={TypographyStyle2}>OUT-PATIENT</Typography>
                          </Box>
                          <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                            <Typography style={TypographyStyle1}>Membership No</Typography>&nbsp;
                            <span>:</span>&nbsp;
                            <Typography style={TypographyStyle2}>data?.policyNumberG</Typography>
                          </Box>
                          <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                            <Typography style={TypographyStyle1}>Name</Typography>&nbsp;
                            <span>:</span>&nbsp;
                            <Typography style={TypographyStyle2}>KE02476800</Typography>
                          </Box>
                          <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                            <Typography style={TypographyStyle1}>Barcode</Typography>&nbsp;
                            <span>:</span>&nbsp;
                            <Typography style={TypographyStyle2}>BAR-07072023</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell component='th' id={labelId} scope='row' padding='none'>
                        <table style={{ height: '140px' }}>
                          <thead>
                            <tr>
                              <th style={ThStyle}>Bill No</th>
                              <th style={ThStyle}>Provider</th>
                              <th style={ThStyle}>Claim Amt</th>
                              <th style={ThStyle}>Adm Amt</th>
                              <th style={ThStyle}>Payee</th>
                              <th style={ThStyle}>Reason</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td style={TrStyle}>07072023-PART-001</td>
                              <td style={TrStyle}>AGAKHAN HOSPITAL NAIROBI</td>
                              <td style={TrStyle}>123,717.60</td>
                              <td style={TrStyle}>123,717.60</td>
                              <td style={TrStyle}>AGAKHAN HOSPITAL NAIROBI</td>
                              <td style={TrStyle}></td>
                            </tr>
                          </tbody>
                        </table>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </div>
  )
}
