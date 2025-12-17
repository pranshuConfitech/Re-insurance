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
import { ArrowBack, ArrowForward, Delete, Edit } from '@mui/icons-material'
import { Pagination, PaginationItem } from '@mui/lab'
import { TabView, TabPanel } from 'primereact/tabview'

import { ProviderTypeService } from '@/services/remote-api/api/master-services'

const Transition = React.forwardRef(function Transition(props: any, ref: any) {
  return <Slide direction='up' ref={ref} {...props} />
})

const providertypeservice = new ProviderTypeService()
const pt$ = providertypeservice.getProviderTypes()
const ptq$ = providertypeservice.getProviderOwnerTypes()
const ptr$ = providertypeservice.getProviderCategory()

export default function ProviderAddressConfig() {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [showInput, setShowInput] = React.useState(false)
  const [selectedOption, setSelectedOption] = React.useState('')
  const [providerTypes, setProviderTypes] = React.useState([])
  const [providerOwnerTypes, setProviderOwnerTypes] = React.useState([])
  const [categoryTypes, setCategoryTypes] = React.useState([])

  const [mainData, setMainData]: any = useState([])
  const [handleEditName, setHandleEditName] = useState('')

  // const[editId,setEditId] = useState();
  const [open, setOpen] = useState(false)
  const toast: any = useRef(null)
  const [idEdit, setEditId] = useState()

  // setthe get provider type value
  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      let subscription = observable.subscribe((result: { content: any[] }) => {
        setter(result.content);
      });
      return () => subscription.unsubscribe();
    }, [observable, setter]);
  }

  const handleClose = () => {
    // setOpen(false)
    setShowInput(false)
  }

  const handleClickOpen = (id: any) => {
    setEditId(id)
    setOpen(true)
  }

  // hold the get data in the state for a dropdown
  useObservable(pt$, setProviderTypes)
  useObservable(ptq$, setProviderOwnerTypes)
  useObservable(ptr$, setCategoryTypes)

  // make an active button on proposer section
  const makeActive = (select: any) => {
    if (select === 1) {
      setActiveIndex(1)
      setShowInput(false)
    }

    if (select === 2) {
      setActiveIndex(2)
      setShowInput(false)
    }

    if (select === 3) {
      setActiveIndex(3)
      setShowInput(false)
    }
  }

  const handleAddFieldClick = () => {
    setShowInput(true)
  }

  const handleSelectChange = (event: any) => {
    setSelectedOption(event.target.value)
  }

  const fetchProviderLabel = () => {
    try {
      providertypeservice.getProviderLabel().subscribe((res: any) => {
        setMainData(res)
      })
    } catch (error) {
      console.error('Error saving the value:', error)
    }
  }

  const fetchProviderOwnerType = () => {
    try {
      providertypeservice.getProviderOwner().subscribe((res: any) => {
        setMainData(res)
      })
    } catch (error) {
      console.error('Error saving the value:', error)
    }
  }
  useEffect(() => {
    if (activeIndex === 0) {
      fetchProviderLabel()
    } else if (activeIndex === 1) {
      fetchProviderType()
    } else if (activeIndex === 2) {
      fetchProviderOwnerType()
    }
  }, [activeIndex])
  const fetchProviderType = () => {
    try {
      providertypeservice.getProviderType().subscribe((res: any) => {
        setMainData(res)
      })
    } catch (error) {
      console.error('Error saving the value:', error)
    }
  }

  const handleSaveClick = async () => {
    if (selectedOption) {
      const payload = {
        name: selectedOption
      }

      try {
        providertypeservice.addProviderType(payload).subscribe(res => {
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully Added Provider Type',
            life: 2000
          })
          setShowInput(false)
          fetchProviderType()
        })
      } catch (error) {
        console.error('Error saving the value:', error)
      }
    } else {
      console.log('Input value is empty')
    }
  }

  const handleSaveClickOwnerType = async () => {
    if (selectedOption) {
      const payload = {
        name: selectedOption
      }

      try {
        providertypeservice.addProviderOwner(payload).subscribe((res: any) => {
          if (res?.id) {
            toast.current.show({
              severity: 'success',
              summary: 'Success',
              detail: 'Successfully Added Provider Owner Type',
              life: 2000
            })
            setShowInput(false)
            fetchProviderOwnerType()
          }
        })
      } catch (error) {
        console.error('Error saving the value:', error)
      }
    } else {
      console.log('Input value is empty')
    }
  }

  // const fetchFundData = () => {
  //   try {
  //     providertypeservice.getProviderList(0).subscribe(res => {
  //       // setFundData(res?.content)
  //     });

  //   } catch (error) {
  //     console.error('Error saving the value:', error);
  //   }
  // };

  const handleEditApi = (id: any) => {
    if (activeIndex == 1) {
      try {
        handleEditName.length > 0 &&
          providertypeservice.editProviderList(id, handleEditName).subscribe((res: any) => {
            // setFundData(res?.content)
            // fetchFundData();
            fetchProviderLabel()
            handleClose()
            setHandleEditName('')
          })

        // setShowInput(false);
      } catch (error) {
        console.error('Error saving the value:', error)
      }
    } else if (activeIndex == 2) {
      try {
        handleEditName.length > 0 &&
          providertypeservice.editProviderType(id, handleEditName).subscribe(res => {
            // setFundData(res?.content)
            // fetchFundData();
            fetchProviderType()
            handleClose()
            setHandleEditName('')
          })

        // setShowInput(false);
      } catch (error) {
        console.error('Error saving the value:', error)
      }
    } else {
      try {
        handleEditName.length > 0 &&
          providertypeservice.editOwnerProviderType(id, handleEditName).subscribe(res => {
            // setFundData(res?.content)
            // fetchFundData();

            fetchProviderOwnerType()
            handleClose()
            setHandleEditName('')
          })

        // setShowInput(false);
      } catch (error) {
        console.error('Error saving the value:', error)
      }
    }
  }

  const handleDelete = (id: any) => {
    if (activeIndex == 1) {
      try {
        providertypeservice.deleteProviderList(id).subscribe(res => {
          // setFundData(res?.content)
          // fetchFundData();
          fetchProviderLabel()
        })

        // setShowInput(false);
      } catch (error) {
        console.error('Error saving the value:', error)
      }
    } else if (activeIndex == 2) {
      try {
        providertypeservice.deleteProviderTypesList(id).subscribe(res => {
          // setFundData(res?.content)
          // fetchFundData();
          fetchProviderType()
        })

        // setShowInput(false);
      } catch (error) {
        console.error('Error saving the value:', error)
      }
    } else {
      try {
        providertypeservice.deleteProviderOwnerTypesList(id).subscribe(res => {
          // setFundData(res?.content)
          // fetchFundData();
          fetchProviderOwnerType()
        })

        // setShowInput(false);
      } catch (error) {
        console.error('Error saving the value:', error)
      }
    }
  }

  const handleSaveClickCategory = async () => {
    if (selectedOption) {
      const payload = {
        name: selectedOption
      }

      try {
        providertypeservice.addProviderCategoryType(payload).subscribe((res: any) => {
          if (res?.id) {
            toast.current.show({
              severity: 'success',
              summary: 'Success',
              detail: 'SucessFully Added Provider Label',
              life: 2000
            })
            setShowInput(false)
          }
        })
        setTimeout(() => {
          fetchProviderLabel()
        }, 1000)
        setShowInput(false)
      } catch (error) {
        console.error('Error saving the value:', error)
      }
    } else {
      console.log('Input value is empty')
    }
  }

  const handleSaveClicked = async () => {
    if (selectedOption) {
      const payload = {
        name: selectedOption
      }

      try {
        providertypeservice.addProviderOwnerType(payload).subscribe(res => {
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'SucessFully Added Provider OwnerType',
            life: 2000
          })
          setShowInput(false)
        })

        setShowInput(false)
      } catch (error) {
        console.error('Error saving the value:', error)
      }
    } else {
      console.log('Input value is empty')
    }
  }

  return (
    <div>
      <TabView
        scrollable
        style={{ fontSize: '14px' }}
        activeIndex={activeIndex}
        onTabChange={e => setActiveIndex(e.index)}
      >
        <TabPanel leftIcon='pi pi-tag mr-2' header='Provider Level'>
          <Paper elevation={0}>
            <Box p={3} my={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    onClick={handleAddFieldClick}
                    style={{ marginBottom: '20px', }}
                    className='p-button-raised p-button-rounded'
                  >
                    Add Provider Level
                  </Button>
                </Grid>
                {activeIndex === 0 && (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'end', flexDirection: 'column', paddingRight: '20px' }} mt={4}>
                      {/* {!showInput && (
                        <Button color='primary' onClick={handleAddFieldClick}>
                          Add New
                        </Button>
                      )} */}

                      {showInput && (
                        <>
                          <Dialog open={showInput} TransitionComponent={Transition} keepMounted onClose={handleClose}>
                            <FormControl variant='outlined' margin='normal' style={{ width: '200px', margin: '20px 40px' }}>
                              <TextField
                                label='Provider Level'
                                value={selectedOption}
                                onChange={handleSelectChange}
                                variant='outlined'
                                margin='normal'
                              />
                            </FormControl>

                            <Button
                              style={{ display: 'flex', justifyContent: 'center', margin: '5px 20px' }}
                              color='secondary'
                              onClick={handleSaveClickCategory}
                            >
                              Save
                            </Button>
                          </Dialog>
                        </>
                      )}
                    </Box>
                  </>
                )}
                {mainData?.content?.length > 0 && (
                  <>
                    {' '}
                    <Box sx={{ marginTop: '10px' ,width: '100%'}}>
                      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '8px' }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ color: '#666', fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>Name</TableCell>
                              <TableCell align='center' sx={{ color: '#666', fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>Code</TableCell>
                              <TableCell align='center' sx={{ color: '#666', fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {mainData?.content?.map((item: any) => {
                              return (
                                <TableRow key={item.code} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                  <TableCell sx={{ color: '#333', borderBottom: '1px solid #e0e0e0' }}>{item?.name || item?.code?.substring(0, 3)}</TableCell>
                                  <TableCell align='center' sx={{ color: '#333', borderBottom: '1px solid #e0e0e0' }}>{item?.code}</TableCell>
                                  <TableCell align='center' sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                    <Edit
                                      style={{ marginRight: '25px', cursor: 'pointer', color: '#666' }}
                                      onClick={() => handleClickOpen(item?.id)}
                                    />
                                    <Delete style={{ cursor: 'pointer', color: '#666' }} onClick={() => handleDelete(item?.id)} />
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <Pagination
                          count={mainData?.totalPages}
                          renderItem={(item: any) => (
                            <PaginationItem 
                              slots={{ previous: ArrowBack, next: ArrowForward }} 
                              {...item} 
                              sx={{
                                '& .MuiPaginationItem-root': {
                                  color: '#666',
                                  '&.Mui-selected': {
                                    backgroundColor: '#e0e0e0',
                                    color: '#333'
                                  }
                                }
                              }}
                            />
                          )}
                        />
                      </Box>
                    </Box>
                  
                  </>
                )}
              </Grid>
            </Box>
          </Paper>
        </TabPanel>
        <TabPanel leftIcon='pi pi-briefcase mr-2' header='Provider Type'>
          <Paper elevation={0}>
            <Box p={3} my={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    onClick={handleAddFieldClick}
                    style={{ marginBottom: '20px' }}
                    className='p-button-raised p-button-rounded'
                  >
                    Add Provider Type
                  </Button>
                </Grid>
                {activeIndex === 1 && (
                  <Box sx={{ display: 'flex', alignItems: 'end', flexDirection: 'column', paddingRight: '20px' }} mt={4}>
                    <Dialog open={showInput} TransitionComponent={Transition} keepMounted onClose={handleClose}>
                      <FormControl variant='outlined' margin='normal' style={{ width: '200px', margin: '20px 40px' }}>
                        <TextField
                          label='Provider Type'
                          value={selectedOption}
                          onChange={handleSelectChange}
                          variant='outlined'
                          margin='normal'
                        />
                      </FormControl>
                      <Button
                        style={{ display: 'flex', justifyContent: 'center', margin: '5px 20px' }}
                        color='secondary'
                        onClick={handleSaveClick}
                      >
                        Save
                      </Button>
                    </Dialog>
                  </Box>
                )}
                {providerTypes?.length > 0 && (
                  <Grid item xs={12}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ color: '#666', fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>Name</TableCell>
                            <TableCell align='center' sx={{ color: '#666', fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>Code</TableCell>
                            <TableCell align='center' sx={{ color: '#666', fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {providerTypes?.map((item: any) => (
                            <TableRow key={item.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                              <TableCell sx={{ color: '#333', borderBottom: '1px solid #e0e0e0' }}>{item.name}</TableCell>
                              <TableCell align='center' sx={{ color: '#333', borderBottom: '1px solid #e0e0e0' }}>{item.code}</TableCell>
                              <TableCell align='center' sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                <Edit
                                  style={{ marginRight: '25px', cursor: 'pointer', color: '#666' }}
                                  onClick={() => handleClickOpen(item.id)}
                                />
                                <Delete 
                                  style={{ cursor: 'pointer', color: '#666' }} 
                                  onClick={() => handleDelete(item.id)} 
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Paper>
        </TabPanel>
        <TabPanel leftIcon='pi pi-building mr-2' header='Provider Owner Type'>
          <Paper elevation={0}>
            <Box p={3} my={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    onClick={handleAddFieldClick}
                    style={{ marginBottom: '20px' }}
                    className='p-button-raised p-button-rounded'
                  >
                    Add Provider Owner Type
                  </Button>
                </Grid>
                {activeIndex === 2 && (
                  <Box sx={{ display: 'flex', alignItems: 'end', flexDirection: 'column', paddingRight: '20px' }} mt={4}>
                    <Dialog open={showInput} TransitionComponent={Transition} keepMounted onClose={handleClose}>
                      <FormControl variant='outlined' margin='normal' style={{ width: '200px', margin: '20px 40px' }}>
                        <TextField
                          label='Provider Owner Type'
                          value={selectedOption}
                          onChange={handleSelectChange}
                          variant='outlined'
                          margin='normal'
                        />
                      </FormControl>
                      <Button
                        style={{ display: 'flex', justifyContent: 'center', margin: '5px 20px' }}
                        color='secondary'
                        onClick={handleSaveClickOwnerType}
                      >
                        Save
                      </Button>
                    </Dialog>
                  </Box>
                )}
                {providerOwnerTypes?.length > 0 && (
                  <Grid item xs={12}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ color: '#666', fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>Name</TableCell>
                            <TableCell align='center' sx={{ color: '#666', fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>Code</TableCell>
                            <TableCell align='center' sx={{ color: '#666', fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {providerOwnerTypes?.map((item: any) => (
                            <TableRow key={item.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                              <TableCell sx={{ color: '#333', borderBottom: '1px solid #e0e0e0' }}>{item.name}</TableCell>
                              <TableCell align='center' sx={{ color: '#333', borderBottom: '1px solid #e0e0e0' }}>{item.code}</TableCell>
                              <TableCell align='center' sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                <Edit
                                  style={{ marginRight: '25px', cursor: 'pointer', color: '#666' }}
                                  onClick={() => handleClickOpen(item.id)}
                                />
                                <Delete 
                                  style={{ cursor: 'pointer', color: '#666' }} 
                                  onClick={() => handleDelete(item.id)} 
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Paper>
        </TabPanel>
      </TabView>
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
    </div>
  )
}
