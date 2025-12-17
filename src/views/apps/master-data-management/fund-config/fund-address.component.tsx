'use client'
import React, { useEffect, useRef, useState } from 'react'

import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'

import Paper from '@mui/material/Paper'

import { Button } from 'primereact/button'
import {
  Dialog,
  DialogActions,
  DialogContent,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material'
import { Toast } from 'primereact/toast'
import { Delete, Edit } from '@mui/icons-material'

import { ProviderTypeService } from '@/services/remote-api/api/master-services'

const providertypeservice = new ProviderTypeService()

const Transition = React.forwardRef(function Transition(props: any, ref: any) {
  return <Slide direction='up' ref={ref} {...props} />
})

export default function FundAddressConfig() {
  const [active, setActive] = React.useState(1)
  const [showInput, setShowInput] = React.useState(false)
  const [selectedOption, setSelectedOption] = React.useState('')
  const [fundData, setFundData] = useState([])
  const [idEdit, setEditId] = useState()
  const [handleEditName, setHandleEditName] = useState('')
  const [showError, setShowError] = useState(false)

  const toast: any = useRef(null)

  const [open, setOpen] = React.useState(false)

  const handleClickOpen = (id: any) => {
    setEditId(id)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  // make an active button on proposer section
  const makeActive = (select: any) => {
    if (select === 1) {
      setActive(1)
      setShowInput(false)
    }
  }

  const handleAddFieldClick = () => {
    setShowInput(true)
  }

  const handleSelectChange = (event: any) => {
    setSelectedOption(event.target.value)
  }

  const fetchFundData = () => {
    try {
      providertypeservice.getProviderList(0).subscribe((res: any) => {
        setFundData(res?.content)
      })

      // setShowInput(false);
    } catch (error) {
      console.error('Error saving the value:', error)
    }
  }

  const handleDeleteFund = (id: any) => {
    try {
      providertypeservice.deleteFundList(id).subscribe(res => {
        // setFundData(res?.content)
        fetchFundData()
      })

      // setShowInput(false);
    } catch (error) {
      console.error('Error saving the value:', error)
    }
  }

  const handleEditApi = (id: any) => {
    try {
      handleEditName.length > 0 &&
        providertypeservice.editFundList(id, handleEditName).subscribe(res => {
          // setFundData(res?.content)
          fetchFundData()
          handleClose()
          setHandleEditName('')
        })

      // setShowInput(false);
    } catch (error) {
      console.error('Error saving the value:', error)
    }
  }

  const handleSaveClickCategory = async () => {
    if (selectedOption) {
      const payload = {
        name: selectedOption
      }

      try {
        providertypeservice.addFundCategoryType(payload).subscribe((res: any) => {
          if (res?.id) {
            toast.current.show({
              severity: 'success',
              summary: 'Success',
              detail: 'SucessFully Added Fund',
              life: 2000
            })
            setShowInput(false)
          }
        })
        fetchFundData()
        setShowInput(false)
      } catch (error) {
        console.error('Error saving the value:', error)
      }
    } else {
      setShowError(true)
    }
  }

  useEffect(() => {
    fetchFundData()
  }, [])

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogContent>
          <div id='alert-dialog-slide-description'>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <Edit />
              <h1 style={{ fontSize: '1.5rem' }}>Edit Name</h1>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: '1.5rem' }}>
              <TextField
                onChange={e => setHandleEditName(e.target.value)}
                id='outlined-basic'
                value={handleEditName}
                label='Edit Name'
                variant='outlined'
                style={{ width: '400px' }}
              />
              <Button style={{ padding: '15px', fontSize: '1rem' }} onClick={() => handleEditApi(idEdit)}>
                Save
              </Button>
            </Box>
          </div>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose}>Agree</Button> */}
        </DialogActions>
      </Dialog>
      <Paper elevation={0}>
        <Box p={3} my={2}>
          <>
            {active === 1 && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'end', flexDirection: 'column', paddingRight: '20px' }}>
                  {!showInput && (
                    <Button color='primary' onClick={handleAddFieldClick}>
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

                      <Button style={{ display: 'flex' }} color='secondary' onClick={handleSaveClickCategory}>
                        Save
                      </Button>
                    </>
                  )}
                </Box>
              </>
            )}
            <Grid container item xs={12}>
              {/* <Button
                style={active === 1 ? { color: 'white', backgroundColor: '#41e276', margin: '2px' } : { margin: '2px' }}
                onClick={() => makeActive(1)}>
                FUND TYPE
              </Button> */}
            </Grid>
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
                    {fundData?.map((item: any) => {
                      return (
                        <TableRow key={item.code}>
                          <TableCell>{item?.name}</TableCell>
                          <TableCell align='center'>{item?.code}</TableCell>
                          <TableCell align='center'>
                            <Edit
                              onClick={() => handleClickOpen(item?.id)}
                              style={{ marginRight: '25px', cursor: 'pointer' }}
                            />
                            <Delete onClick={() => handleDeleteFund(item?.id)} style={{ cursor: 'pointer' }} />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <span></span>&nbsp;
          </>
        </Box>
      </Paper>
    </>
  )
}
