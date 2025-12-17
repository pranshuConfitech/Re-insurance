'use client'
import React, { useEffect, useState } from 'react'

import {
  Box,
  Button,
  FormControl,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material'

import Edit from '@mui/icons-material/Edit'
import Delete from '@mui/icons-material/Delete'
import { Toast } from 'primereact/toast'

import { ProviderTypeService } from '@/services/remote-api/api/master-services/provider.type.service'

const providertypeservice = new ProviderTypeService()

const CommissionConfig = () => {
  const [commissionRole, setCommissionRole]: any = useState([])
  const [showInput, setShowInput] = useState(false)
  const [selectedOption, setSelectedOption] = useState('')
  const [showError, setShowError] = useState(false)
  const toast = React.useRef<any>(null)

  const handleAddFieldClick = () => {
    setShowInput(true)
  }

  const handleSelectChange = (e: any) => {
    setSelectedOption(e.target.value)
  }

  const handleSaveClickCategory = () => {
    if (selectedOption.length > 3) {
      const payload = {
        name: selectedOption
      }

      try {
        providertypeservice.addCommissionRole(payload).subscribe({
          next: (res: any) => {
            toast.current?.show({
              severity: 'success',
              summary: 'Success',
              detail: 'Commission role added successfully',
              life: 2000
            })
            setSelectedOption('')
            setShowInput(false)
          },
          error: (err: any) => {
            toast.current?.show({
              severity: 'error',
              summary: 'Error',
              detail: 'Something went wrong',
              life: 2000
            })
          }
        })
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong',
          life: 2000
        })
        console.error('Error saving the value:', error)
      }
    } else {
      setShowError(true)
    }
  }

  useEffect(() => {
    if (!showInput) {
      try {
        providertypeservice.getCommissionRole().subscribe((res: any) => {
          setCommissionRole(res)
        })
      } catch (error) {
        console.error('Error saving the value:', error)
      }
    }
  }, [showInput])

  return (
    <>
      <Toast ref={toast} />
      <Paper elevation={0}>
        <Box p={3} my={2}>
          <Box sx={{ display: 'flex', alignItems: 'end', flexDirection: 'column', paddingRight: '20px' }}>
            {!showInput && (
              <Button variant='contained' color='primary' onClick={handleAddFieldClick}>
                Add New
              </Button>
            )}

            {showInput && (
              <>
                <FormControl variant='outlined' margin='normal' style={{ width: '200px', marginTop: '-12px' }}>
                  <TextField
                    label='Fund Type'
                    value={selectedOption}
                    onChange={handleSelectChange}
                    variant='outlined'
                    margin='normal'
                    error={showError}
                    helperText={showError ? 'Name Should have Atleast 3 words' : ''}
                  />
                </FormControl>

                <Button
                  style={{ display: 'flex' }}
                  variant='contained'
                  color='secondary'
                  onClick={handleSaveClickCategory}
                >
                  Save
                </Button>
              </>
            )}
          </Box>
          <Box sx={{ marginTop: '10px' }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align='center'>Code</TableCell>
                    <TableCell align='center'>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {commissionRole?.content?.map((item: any) => {
                    return (
                      <TableRow key={item.code}>
                        <TableCell>{item?.name}</TableCell>
                        <TableCell align='center'>{item?.code}</TableCell>
                        <TableCell align='center'>
                          <Edit style={{ marginRight: '25px', cursor: 'pointer' }} />
                          <Delete style={{ cursor: 'pointer' }} />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Paper>
    </>
  )
}

export default CommissionConfig
