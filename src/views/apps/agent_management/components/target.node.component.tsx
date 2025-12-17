import React, { useEffect, useState } from 'react'

import {
  Button,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { Alert } from '@mui/lab'
import { makeStyles } from '@mui/styles'

import { AgentsService } from '@/services/remote-api/api/agents-services'

const useStyles = makeStyles((theme: any) => ({
  table: {
    minWidth: 650
  },
  selectYear: {
    margin: theme?.spacing ? theme?.spacing(2) : '8px',
    minWidth: 270
  },
  submitButton: {
    marginLeft: theme?.spacing ? theme?.spacing(2) : '8px'
  }
}))

const agentservice = new AgentsService()

const NodeComponent = ({
  node,
  groupTypes,
  selectedYear,
  months
}: {
  node: any
  groupTypes: any
  selectedYear: any
  months: any
}) => {
  const classes = useStyles()
  const [tableData, setTableData] = useState([])
  const [isSuccess, setIsSuccess] = useState(false)
  const [open, setOpen] = useState(false)
  const columns = groupTypes.map((gr: any) => gr.name) //['RETAIL', 'CORPORATE', 'SME', 'COMMUNITY'];

  const handleSubmit = (row: any) => {
    const targetRow: any = tableData.find((trow: any) => trow.period === row.period)
    const period = targetRow.period

    delete targetRow.period
    delete targetRow.id

    const filteredArray = Object.entries(targetRow)
      .filter(([key, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => ({ [key]: value }))

    const findDataType = filteredArray.map((obj: any) => {
      const key = Object.keys(obj)[0]

      return {
        ...groupTypes.find((group: any) => group.name.toLowerCase() === key),
        value: +obj[key]
      }
    })

    const dataypes = [...findDataType]

    const dto = dataypes.map(type => {
      delete type.id

      return type
    })

    const payload: any = {
      period: period,
      hierarchyCode: node.id,
      childDto: dto
    }

    agentservice.saveAgentTarget(payload).subscribe({
      next: result => {
        setIsSuccess(true)
        setOpen(true)
        initializeTable()
        setTimeout(() => setOpen(false), 3000)
      },
      error: error => {
        setIsSuccess(false)
        setOpen(true)
        initializeTable()
        setTimeout(() => setOpen(false), 3000)
      }
    })
  }

  const initializeTable = () => {
    if (groupTypes.length > 0) {
      const newTableData = months.map((month: any, index: number) => {
        const row: any = {
          id: index + 1,
          period: `${month}-${selectedYear}`
        }

        groupTypes.forEach((group: { name: string }) => {
          row[group.name.toLowerCase()] = null
        })

        return row
      })

      setTableData(newTableData)
    }
  }

  useEffect(() => {
    if (groupTypes.length > 0) {
      initializeTable()
    }
  }, [groupTypes, selectedYear])

  const handleInputChange = (id: any, column: string, value: string) => {
    setTableData((prevData: any) =>
      prevData.map((row: any) => (row.id === id ? { ...row, [column.toLowerCase()]: value } : row))
    )
  }

  return (
    <>
      {open && isSuccess && (
        <Alert severity='success' color='info'>
          Target saved successfully!
        </Alert>
      )}
      {open && !isSuccess && (
        <Alert variant='outlined' severity='error'>
          Something went wrong!
        </Alert>
      )}
      <Card elevation={0}>
        <CardContent>
          <Typography variant='h6'>{node.name}</Typography>
          <Typography color='textSecondary'>Type: {node.type}</Typography>
          <div>
            <TableContainer component={Paper}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>PERIOD</TableCell>
                    {columns.map((column: any) => (
                      <TableCell key={column}>{column}</TableCell>
                    ))}
                    <TableCell>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row: any) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.period}</TableCell>
                      {columns.map((column: any) => (
                        <TableCell key={`${row.id}-${column}`}>
                          <TextField
                            value={row[column.toLowerCase()]}
                            label='amount'
                            onChange={e => handleInputChange(row.id, column, e.target.value.replace(/\D/g, ''))}
                          />
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          variant='text'
                          color='primary'
                          className={classes.submitButton}
                          onClick={() => handleSubmit(row)}
                        >
                          SUBMIT
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default NodeComponent
