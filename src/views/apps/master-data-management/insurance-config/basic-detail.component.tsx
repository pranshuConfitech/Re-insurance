'use client'
import React, { useEffect, useState } from 'react'

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  styled,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Tabs,
  Tab
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { CheckCircleOutlineOutlined, CloudUpload, FileCopySharp, Image, Edit, LocationOn, Notifications } from '@mui/icons-material'
import { makeStyles } from '@mui/styles'

import { ProviderTypeService, UsersService } from '@/services/remote-api/fettle-remote-api'
import Asterisk from '../../shared-component/components/red-asterisk'
import NotificationDetailComponent from './notification-detail.component'

const Providertypeservice = new ProviderTypeService()
const usersService = new UsersService()

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const useStyles = makeStyles(theme => ({
  root: {
    flexDirection: 'column'
  },
  formControl: {
    minWidth: '90%'
  },
  button: {
    marginRight: '8px'
  },
  heading: {
    fontSize: '15px',
    flexShrink: 0,
    fontWeight: 700
  },
  secondaryHeading: {
    fontSize: '15px',
    color: 'secondary'
  },
  paper: {
    padding: '2rem',
    borderRadius: '0px',
    // boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e9ecef',
    backgroundColor: '#ffffff'
  },
  tabContainer: {
    // marginBottom: '0.5rem',
    backgroundColor: 'white',
    borderRadius: '8px 8px 0 0',
    // padding: '0.5rem 1rem 0 1rem',
    border: '1px solid #e0e0e0',
    borderBottom: 'none'
  },
  tab: {
    minHeight: '50px',
    minWidth: '120px',
    textTransform: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#666',
    borderRadius: '6px 6px 0 0',
    marginRight: '4px',
    padding: '8px 16px',
    '&.Mui-selected': {
      backgroundColor: '#e0e0e0',
      color: '#333',
      fontWeight: 600
    },
    '&:hover': {
      backgroundColor: '#f0f0f0',
      color: '#333'
    }
  },
  tabIndicator: {
    backgroundColor: '#d32f2f',
    height: '3px'
  }
}))

const BasicDetailComponent = () => {
  const classes = useStyles()
  const [activeTab, setActiveTab] = useState(0)

  const initialValues = {
    insuranceName: '',
    address: '',
    country: '',
    websiteURL: '',
    phoneNo: '',
    phoneNo1: '',
    emailId: '',
    emailId1: '',
    signature: '',
    logo: '',
    licenseNo: '',
    pin: '',
    gmUserId: ''
  }

  const [countryDetails, setCountryDetails] = useState([])
  const [updateID, setUpdateID] = useState(null)
  const [allow, setAllow] = useState(false)
  const [signUploadedFile, setSignUploadedFile] = useState('')
  const [logoUploadedFile, setLogoUploadedFile] = useState('')
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null)
  const [newSignatureFile, setNewSignatureFile] = useState<File | null>(null)
  const [open, setOpen] = useState(false)
  const [activated, setActivated] = useState('')
  const [updatedDone, setUpadetedDone] = useState(false)
  const [fetchL, setFetchL] = useState(true)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }
  const [managersList, setManagersList] = React.useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const validationSchema = Yup.object({
    insuranceName: Yup.string().required('Name is required'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('Country is required'),
    phoneNo: Yup.number()
      .typeError('Primary contact must be a number')
      .required('Primary contact is required')
      .test('len', 'Primary contact must be exactly 10 digits', function (val) {
        if (!val) return false;
        return val.toString().length === 10;
      }),
    phoneNo1: Yup.number()
      .typeError('Secondary contact must be a number')
      .required('Secondary contact is required')
      .test('len', 'Secondary contact must be exactly 10 digits', function (val) {
        if (!val) return false;
        return val.toString().length === 10;
      }),
    emailId: Yup.string()
      .email('Invalid email format')
      .required('Email is required')
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values: any, { setSubmitting, resetForm }) => {
      console.log('Form submitted with values:', values); // Ensure this is logged
      if (allow) {
        const formData = new FormData()

        for (const key in values) {
          if (key === 'signature' || key === 'logo') {
            try {
              formData.append(key, values[key])
            } catch (error) {
              console.error(`Error converting ${key} base64 to file:`, error)
            }
          } else {
            formData.append(key, values[key])
          }
        }

        Providertypeservice.updateBasicDetail(updateID, formData).subscribe(
          res => {
            if (res) {
              setUpadetedDone(true)
              setAllow(false)
              setSnackbar({
                open: true,
                message: 'Insurance details updated successfully',
                severity: 'success'
              })
              resetForm()
            }
          },
          error => {
            console.error('Error updating basic detail:', error)
            setSnackbar({
              open: true,
              message: 'Error updating insurance details',
              severity: 'error'
            })
          }
        )
      } else {
        const formData = new FormData()

        for (const key in values) {
          if (values[key] instanceof File) {
            formData.append(key, values[key])
          } else {
            formData.append(key, values[key])
          }
        }

        Providertypeservice.saveBasicDetail(formData).subscribe(
          res => {
            if (res) {
              setSnackbar({
                open: true,
                message: 'Insurance details saved successfully',
                severity: 'success'
              })
            }
          },
          error => {
            console.error('Error saving basic detail:', error)
            setSnackbar({
              open: true,
              message: 'Error saving insurance details',
              severity: 'error'
            })
          }
        )
      }
    }
  })

  const handleChange = async (event: any) => {
    const { name, value, files } = event.target

    if (files) {
      if (name === 'logo') {
        setNewLogoFile(files[0])
        formik.setFieldValue(name, files[0])
      } else if (name === 'signature') {
        setNewSignatureFile(files[0])
        formik.setFieldValue(name, files[0])
      } else {
        formik.setFieldValue(name, files[0])
      }
    } else {
      formik.handleChange(event)
    }
  }

  const handleSubmit = async () => {
    if (allow) {
      const formData = new FormData()

      for (const key in formik.values) {
        if (key === 'signature' || key === 'logo') {
          try {
            formData.append(key, formik.values[key])
          } catch (error) {
            console.error(`Error converting ${key} base64 to file:`, error)
          }
        } else {
          formData.append(key, formik.values[key])
        }
      }

      Providertypeservice.updateBasicDetail(updateID, formData).subscribe(
        res => {
          if (res) {
            setUpadetedDone(true)
            setAllow(false)
            setSnackbar({
              open: true,
              message: 'Insurance details updated successfully',
              severity: 'success'
            })
            // resetForm()
          }
        },
        error => {
          console.error('Error updating basic detail:', error)
          setSnackbar({
            open: true,
            message: 'Error updating insurance details',
            severity: 'error'
          })
        }
      )
    } else {
      const formData = new FormData()

      for (const key in formik.values) {
        if (formik.values[key] instanceof File) {
          formData.append(key, formik.values[key])
        } else {
          formData.append(key, formik.values[key])
        }
      }

      Providertypeservice.saveBasicDetail(formData).subscribe(
        res => {
          if (res) {
            setSnackbar({
              open: true,
              message: 'Insurance details saved successfully',
              severity: 'success'
            })
          }
        },
        error => {
          console.error('Error saving basic detail:', error)
          setSnackbar({
            open: true,
            message: 'Error saving insurance details',
            severity: 'error'
          })
        }
      )
    }
  }

  const fetchData = () => {
    Providertypeservice.getBasicDetail().subscribe((res: any) => {
      if (res[0]?.insuranceName && res[0]?.country) {
        setAllow(true)
      } else {
        setAllow(false)
      }

      setUpdateID(res[0]?.id)
      setFetchL(false)
      Object.keys(res[0]).forEach(key => {
        if (key == 'logo') {
          setTimeout(() => {
            setLogoUploadedFile(res[0][key])
          }, 200)
        } else if (key == 'signature') {
          setTimeout(() => {
            setSignUploadedFile(res[0][key])
          }, 200)
        } else {
          formik.setFieldValue(key, res[0][key])
        }
      })
    })
  }

  const getManagers = () => {
    const pageRequest = {
      page: 0,
      size: 1000,
      summary: true,
      active: true
    }
    usersService.getAgent('Super_Admin').subscribe({
      next: (response: any) => {
        const list = response?.map((agent: any) => ({
          value: agent.userName,
          label: `${agent.firstName ? agent.firstName : ''} ${agent.lastName ? agent.lastName : ''}`
        }))
        setManagersList(list)
      }
    })
  }

  useEffect(() => {
    fetchData();
    handleCountry();
    getManagers();
  }, [])

  const handleCountry = () => {
    Providertypeservice.getCountryDetail().subscribe({
      next: (response: any) => {
        console.log('Fetching country details...', response)
        const list = response?.content?.map((el: any) => ({
          value: el.name,
          label: el.name,
          name: el.name
        }))
        setCountryDetails(list)
      }
    })
    // setCountryDetails(response?.content)
  }

  const handleClickOpen = (val: any) => {
    setActivated(val)
    setOpen(true)
  }

  const handleClose = (value: any) => {
    setOpen(false)
  }

  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbar({ ...snackbar, open: false })
  }
  console.log('snackbar', formik.values, formik.isSubmitting)
  return (
    <>
      {updatedDone && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '70vw',
            height: '70vh',
            backgroundColor: 'transparent',
            zIndex: '5',
            backdropFilter: 'blur(1px)'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#fff',
              padding: '50px',
              borderRadius: '5px',
              boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
            }}
          >

            <div>
              <CheckCircleOutlineOutlined style={{ color: '#0edb8a', width: '150px', height: '150px' }} />
            </div>
            <div style={{ fontWeight: '600', textAlign: 'center', color: 'gray' }}>Updated Successfully !!</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant='contained'
                style={{
                  color: 'white',
                  backgroundColor: '#0edb8a',
                  minWidth: '8.7rem',
                  marginTop: '2px'
                }}
                onClick={() => {
                  fetchData()
                  setUpadetedDone(false)
                }}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <Box className={classes.tabContainer}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="inherit"
          variant="standard"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#d32f2f',
              height: '3px'
            },
            '& .MuiTab-root': {
              minHeight: '50px',
              minWidth: '120px',
              fontSize: '0.9rem',
              fontWeight: 500,
              textTransform: 'none',
              padding: '8px 16px'
            }
          }}
        >
          <Tab
            label={
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
                <LocationOn sx={{
                  fontSize: '1rem',
                  color: activeTab === 0 ? '#333' : '#666'
                }} />
                <Typography sx={{
                  fontSize: '0.9rem',
                  fontWeight: activeTab === 0 ? 600 : 500,
                  color: activeTab === 0 ? '#333' : '#666'
                }}>
                  Basic Details
                </Typography>
              </Box>
            }
            className={classes.tab}
          />
          <Tab
            label={
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
                <Notifications sx={{
                  fontSize: '1rem',
                  color: activeTab === 1 ? '#333' : '#666'
                }} />
                <Typography sx={{
                  fontSize: '0.9rem',
                  fontWeight: activeTab === 1 ? 600 : 500,
                  color: activeTab === 1 ? '#333' : '#666'
                }}>
                  Notification Details
                </Typography>
              </Box>
            }
            className={classes.tab}
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 ? (
        <Paper elevation={0} className={classes.paper}>
          {/* <Typography variant="h5" sx={{ mb: 6, fontWeight: 600, color: '#000' }}>
            Insurance Details
          </Typography> */}
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Insurance Name"
                    name="insuranceName"
                    value={formik.values.insuranceName}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.insuranceName && Boolean(formik.errors.insuranceName)}
                    helperText={(formik.touched.insuranceName && formik.errors.insuranceName as string) || ''}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {fetchL && <CircularProgress size={20} />}
                        </InputAdornment>
                      )
                    }}
                    disabled={Boolean(formik.values.insuranceName)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Country</InputLabel>
                    <Select
                      label="Country"
                      name="country"
                      value={formik.values.country}
                      // onFocus={handleCountry}
                      onChange={handleChange}
                      disabled={Boolean(formik.values.country)}
                    >
                      <MenuItem value={formik.values.country}>{formik.values.country}</MenuItem>
                      {countryDetails?.map((item: any) => (
                        <MenuItem key={item?.name} value={item?.name}>
                          {item?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Primary Contact"
                    name="phoneNo"
                    value={formik.values.phoneNo}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                    inputProps={{
                      maxLength: 10,
                      inputMode: 'numeric',
                      pattern: '[0-9]*'
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Primary Email"
                    name="emailId"
                    value={formik.values.emailId}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.emailId && Boolean(formik.errors.emailId)}
                    helperText={(formik.touched.emailId && formik.errors.emailId as string) || ''}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Secondary Contact"
                    name="phoneNo1"
                    value={formik.values.phoneNo1}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                    inputProps={{
                      maxLength: 10,
                      inputMode: 'numeric',
                      pattern: '[0-9]*'
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Secondary Email"
                    name="emailId1"
                    value={formik.values.emailId1}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="License Number"
                    name="licenseNo"
                    value={formik.values.licenseNo}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="PIN"
                    name="pin"
                    value={formik.values.pin}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Website URL"
                    name="websiteURL"
                    value={formik.values.websiteURL}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl} fullWidth variant="outlined" size="small" error={formik.touched.regionManager && Boolean(formik.errors.regionManager)}>
                  <InputLabel id="gmUserId">
                    User <Asterisk />
                  </InputLabel>
                  <Select
                    labelId="gmUserId"
                    id="gmUserId"
                    name="gmUserId"
                    value={formik.values.gmUserId}
                    onChange={formik.handleChange}
                    // className={classes.select}
                    displayEmpty
                    label="User" // Must match the text part of InputLabel for floating effect
                  >
                    {managersList.map((el: any) => (
                      <MenuItem key={el.value} value={el.value}>
                        {el.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600, color: 'gray' }}>
                    Logo
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '200px',
                        border: '1px dashed #ccc',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: '#0edb8a',
                          backgroundColor: 'rgba(14, 219, 138, 0.05)'
                        }
                      }}
                      onClick={() => (document.querySelector('input[name="logo"]') as HTMLInputElement)?.click()}
                    >
                      {newLogoFile ? (
                        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                          <img
                            src={URL.createObjectURL(newLogoFile)}
                            alt="New Logo"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain'
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              color: 'white',
                              padding: '4px',
                              textAlign: 'center'
                            }}
                          >
                            <Typography variant="body2">New Logo</Typography>
                          </Box>
                        </Box>
                      ) : logoUploadedFile ? (
                        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                          <img
                            src={`data:image/jpeg;base64,${logoUploadedFile}`}
                            alt="Current Logo"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain'
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              color: 'white',
                              padding: '4px',
                              textAlign: 'center'
                            }}
                          >
                            <Typography variant="body2">Current Logo</Typography>
                          </Box>
                        </Box>
                      ) : (
                        <>
                          <Image sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                          <Typography variant="body2" color="textSecondary">
                            Click to upload logo
                          </Typography>
                        </>
                      )}
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<Edit />}
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          minWidth: 'auto',
                          padding: '4px 8px'
                        }}
                      >
                        <VisuallyHiddenInput
                          type="file"
                          name="logo"
                          accept=".jpg, .jpeg, .png"
                          onChange={handleChange}
                        />
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600, color: 'gray' }}>
                    Signature
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '200px',
                        border: '1px dashed #ccc',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: '#0edb8a',
                          backgroundColor: 'rgba(14, 219, 138, 0.05)'
                        }
                      }}
                      onClick={() => (document.querySelector('input[name="signature"]') as HTMLInputElement)?.click()}
                    >
                      {newSignatureFile ? (
                        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                          <img
                            src={URL.createObjectURL(newSignatureFile)}
                            alt="New Signature"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain'
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              color: 'white',
                              padding: '4px',
                              textAlign: 'center'
                            }}
                          >
                            <Typography variant="body2">New Signature</Typography>
                          </Box>
                        </Box>
                      ) : signUploadedFile ? (
                        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                          <img
                            src={`data:image/jpeg;base64,${signUploadedFile}`}
                            alt="Current Signature"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain'
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              color: 'white',
                              padding: '4px',
                              textAlign: 'center'
                            }}
                          >
                            <Typography variant="body2">Current Signature</Typography>
                          </Box>
                        </Box>
                      ) : (
                        <>
                          <Image sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                          <Typography variant="body2" color="textSecondary">
                            Click to upload signature
                          </Typography>
                        </>
                      )}
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<Edit />}
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          minWidth: 'auto',
                          padding: '4px 8px'
                        }}
                      >
                        <VisuallyHiddenInput
                          type="file"
                          name="signature"
                          accept=".jpg, .jpeg, .png"
                          onChange={handleChange}
                        />
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    label="Address"
                    name="address"
                    value={formik.values.address}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    helperText={(formik.touched.address && formik.errors.address as string) || ''}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Button
                    variant="contained"
                    type="submit"
                    onClick={handleSubmit}
                    disabled={formik.isSubmitting}
                    sx={{
                      backgroundColor: 'transparent',
                      color: '#d90d51',
                      width: '200px',
                      fontSize: '1rem',
                      border: '2px solid red',
                      '&:hover': {
                        backgroundColor: '#d90d51',
                        color: 'white'
                      }
                    }}
                  >
                    {allow ? 'Update' : 'Save'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      ) : (
        <NotificationDetailComponent />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity as any}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default BasicDetailComponent

const SimpleDocumentDialog = ({ open, onClose, value }: { open: boolean; onClose: any; value: any }) => {
  const handleClose = () => {
    onClose()
  }

  return (
    // <Dialog onClose={handleClose} open={open} sx={{ width: '1500px', maxWidth: '1500px' }}>
    // <DialogTitle>Uploaded Document</DialogTitle>
    <img src={`data:image/jpeg;base64,${value}`} alt='uploaded document' />
    // </Dialog>
  )
}
