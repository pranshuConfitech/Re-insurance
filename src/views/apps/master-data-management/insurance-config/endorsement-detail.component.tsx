'use client'
import React, { useEffect, useState } from 'react'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { Add, Assignment, CloudUpload, DockTwoTone, DoneOutlineOutlined, ExpandMore, Search } from '@mui/icons-material'
import * as Yup from 'yup'
import { Form, Formik } from 'formik'

import { ProviderTypeService } from '@/services/remote-api/fettle-remote-api'

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

const Providertypeservice = new ProviderTypeService()

const CallDetailComponent = () => {
  const [active, setActive] = useState(0)

  return active == 0 ? <CallDetailComponentTable setActive={setActive} /> : <CallDetailComponentForm />
}

export default CallDetailComponent

const CallDetailComponentTable = ({ setActive }: { setActive: any }) => {
  const [tableData, setTableData] = useState([])
  const [searchType, setSearchType] = useState('')

  const convertMillisecondsToDate = (milliseconds: any) => {
    const date = new Date(milliseconds)

    return date.toLocaleDateString() // This will give you a formatted date string
  }

  useEffect(() => {
    Providertypeservice.getCallManagementDetails().subscribe((res: any) => {
      setTableData(res?.content)
    })
  }, [])

  return (
    <>
      <Paper>
        <Paper style={{ padding: '1rem 0.7rem', backgroundColor: '#eeeeee', margin: '0rem 0rem 0.5rem 0rem' }}>
          Call Management
        </Paper>
        <Box sx={{ display: 'flex' }}>
          {/* <div style={{width:"50%",display:"flex",flexDirection:"column",justifyContent:"center"}}>
                    <hr/>
                </div> */}
          <div
            style={{
              display: 'flex',

              // width: '50%',
              //   border: '1px solid red',
              justifyContent: 'space-between',

              // alignItems: 'center',
              gap: '10px'
            }}
          >
            <div>
              <FormControl variant='outlined' style={{ width: '200px', marginTop: '16px' }}>
                <InputLabel id='demo-simple-select-label'>Search Type</InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  label='Search Type'
                  name='inquiryCategory'
                  value={searchType}
                  onChange={event => setSearchType(event.target.value)}
                  // value={values.country}
                  // onFocus={handleCountry}
                  //   onChange={event => handleChange2(event, setFieldValue)}
                  //   helperText={touched.inquiryCategory && errors.inquiryCategory ? errors.inquiryCategory : ''}
                  //   error={touched.inquiryCategory && Boolean(errors.inquiryCategory)}
                  // disabled={Boolean(values.country)}
                  style={{ width: '100%' }}
                >
                  {/* <MenuItem value={values?.country}>Request</MenuItem>
                          <MenuItem value={values?.country}>Enquiry</MenuItem>
                          <MenuItem value={values?.country}>Grievance</MenuItem> */}
                  {/* <MenuItem value={values?.inquiryCategory}>{values?.inquiryCategory}</MenuItem> */}
                  {['Inbound', 'Outbound']?.map(item => {
                    return (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    )
                  })}
                  {/* {countryDetails?.map(item => {
                              return (
                                <MenuItem key={item?.name} value={item?.name}>
                                  {item?.name}
                                </MenuItem>
                              );
                            })} */}
                </Select>
              </FormControl>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                variant='outlined'
                style={{ width: '100%' }}
                //   label="Name"
                name='communicationDate'
                type='date'
                fullWidth
                margin='normal'

                // disabled={Boolean(values.insuranceName)}
              />
              {/* <ErrorMessage name="insuranceName" component="div" /> */}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                variant='outlined'
                style={{ width: '100%' }}
                //   label="Name"
                name='communicationDate'
                type='date'
                fullWidth
                margin='normal'

                // disabled={Boolean(values.insuranceName)}
              />
              {/* <ErrorMessage name="insuranceName" component="div" /> */}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button style={{ backgroundColor: '#ed2264', color: 'white', fontSize: '1rem' }}>Go</Button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Assignment style={{ color: '#0edb8a', width: '2.5rem', height: '2.5rem' }} />
            </div>
          </div>
        </Box>
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'end', marginTop: '2.5rem' }}>
        <Fab color='primary' aria-label='add' onClick={() => setActive(1)}>
          <Add />
        </Fab>
      </Box>
      <Paper style={{ marginTop: '1rem' }}>
        <Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow style={{ backgroundColor: '#D80E51' }}>
                  <TableCell style={{ color: 'white', whiteSpace: 'nowrap' }}>Received From</TableCell>
                  <TableCell style={{ color: 'white', whiteSpace: 'nowrap' }} align='right'>
                    Received On
                  </TableCell>
                  <TableCell style={{ color: 'white', whiteSpace: 'nowrap' }} align='right'>
                    Call For
                  </TableCell>
                  <TableCell style={{ color: 'white', whiteSpace: 'nowrap' }} align='right'>
                    Call Sub For
                  </TableCell>
                  <TableCell style={{ color: 'white', whiteSpace: 'nowrap' }} align='right'>
                    Claim No
                  </TableCell>
                  <TableCell style={{ color: 'white', whiteSpace: 'nowrap' }} align='right'>
                    Member No
                  </TableCell>
                  <TableCell style={{ color: 'white', whiteSpace: 'nowrap' }} align='right'>
                    Policy No
                  </TableCell>
                  <TableCell style={{ color: 'white', whiteSpace: 'nowrap' }} align='right'>
                    Claim Remarks
                  </TableCell>
                  <TableCell style={{ color: 'white', whiteSpace: 'nowrap' }} align='right'>
                    Member Remarks
                  </TableCell>
                  <TableCell style={{ color: 'white', whiteSpace: 'nowrap' }} align='right'>
                    Caller Name
                  </TableCell>
                  <TableCell style={{ color: 'white', whiteSpace: 'nowrap' }} align='right'>
                    Caller Contact No
                  </TableCell>
                  <TableCell style={{ color: 'white', whiteSpace: 'nowrap' }} align='right'>
                    Call Remarks
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row: any, index: number) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component='th' scope='row'>
                      {row.receivedBy}
                    </TableCell>
                    <TableCell align='right'>{convertMillisecondsToDate(row.communicationDate)}</TableCell>
                    <TableCell align='right'>{''}</TableCell>
                    <TableCell align='right'>{''}</TableCell>
                    <TableCell align='right'>{''}</TableCell>
                    <TableCell align='right'>{row.memberNo}</TableCell>
                    <TableCell align='right'>{row.policyNo}</TableCell>
                    <TableCell align='right'>{row.d}</TableCell>
                    <TableCell align='right'>{row.e}</TableCell>
                    <TableCell align='right'>{row.callerName}</TableCell>
                    <TableCell align='right'>{row.callerContactInfo}</TableCell>
                    <TableCell align='right'>{''}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </>
  )
}

// export default CallDetailComponent;

const CallDetailComponentForm = () => {
  const initialValues = {
    communicationDate: '',
    callerContactInfo: '',
    inquiryCategory: '',
    callerName: '',
    communicationType: '',
    inquiryType: '',
    policyNo: '',
    memberNo: '',
    address: '',
    notes: '',
    relation: '',
    receivedBy: '',
    callClose: '',
    memberName: '',
    document: ''
  }

  const [initialData, setInitialData] = useState(initialValues)
  const [save, setSave] = useState(false)

  const validationSchema = Yup.object({
    communicationDate: Yup.string().required('Date is required'),
    callerContactInfo: Yup.number()
      .typeError('Must be a number')
      .required('Contact is required')
      .min(1000000000, 'Number should be 10 digits'),
    policyNo: Yup.number().required('PolicyNo is required'),
    callerName: Yup.string().required('Caller Name is required'),
    communicationType: Yup.string().required('Type is required'),
    notes: Yup.string().required('Notes is required'),
    relation: Yup.string().required('Relation is required'),
    receivedBy: Yup.string().required('ReceivedBy is required'),
    callClose: Yup.string().required('Call Close is required')
  })

  const onSubmit = (values: any, { setSubmitting }: { setSubmitting: any }) => {
    // const formData = new FormData();
    // for (const key in values) {
    //   formData.append(key, values[key]);
    // }
    const formData = new FormData()

    for (const key in values) {
      formData.append(key, values[key])
    }

    // // formData.append('signature', '');
    // // formData.append('logo', '');

    Providertypeservice.saveCallManagement(formData).subscribe(res => {
      if (res) {
        setSave(true)
      }
    })

    // setSubmitting(false);
  }

  const handleChange2 = (event: any, setFieldValue: any) => {
    const { name, value, files } = event.target

    if (files) {
      setFieldValue(name, files[0])
    } else {
      setFieldValue(name, value)
      setInitialData({ ...initialData, [name]: value })
    }
  }

  const handleDate = (event: any, setFieldValue: any) => {
    const { name, value, files } = event.target

    const date = new Date(value)

    // Get the time in milliseconds since January 1, 1970, 00:00:00 UTC
    const milliseconds = date.getTime()

    setFieldValue(name, milliseconds)
    setInitialData({ ...initialData, [name]: milliseconds })
  }

  function convertMillisecondsToDateString(milliseconds: any) {
    const date = new Date(milliseconds)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')

    const day = date.getDate().toString().padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const [expanded, setExpanded]: any = useState(false)

  const handleChange = (panel: any) => (event: any, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  type FormikPropsType = {
    isSubmitting: boolean
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
    handleBlur: (event: React.FocusEvent<any>) => void
    values: any
    errors: any
    touched: any
  }

  return (
    <>
      <Paper style={{ padding: '1rem 0.7rem', backgroundColor: '#eeeeee', margin: '0rem 0rem 2rem 0rem' }}>
        Call Management
      </Paper>

      <Paper>
        <Paper style={{ padding: '1rem 0.7rem', backgroundColor: '#D80E51', color: 'white' }}>
          Call Management-Entry
        </Paper>
        <Formik enableReinitialize initialValues={initialData} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting, setFieldValue, handleBlur, values, errors, touched }: FormikPropsType) => {
            return (
              <Form style={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                  <Box sx={{ width: '20%' }}>
                    <div style={{ margin: '1rem 0rem' }}>
                      <TextField
                        variant='outlined'
                        style={{ width: '100%' }}
                        //   label="Name"
                        name='communicationDate'
                        type='date'
                        value={convertMillisecondsToDateString(values.communicationDate)}
                        onChange={event => handleDate(event, setFieldValue)}
                        onBlur={handleBlur}
                        helperText={
                          touched.communicationDate && errors.communicationDate ? errors.communicationDate : ''
                        }
                        error={touched.communicationDate && Boolean(errors.communicationDate)}
                        fullWidth
                        //   InputProps={{
                        //     endAdornment: (
                        //       <InputAdornment position="center" >
                        //         {fetchL && <CircularProgress size={20}/>}
                        //       </InputAdornment>
                        //     )
                        //   }}
                        margin='normal'

                        // disabled={Boolean(values.insuranceName)}
                      />
                      {/* <ErrorMessage name="insuranceName" component="div" /> */}
                    </div>
                    <div style={{ margin: '1rem 0rem' }}>
                      <TextField
                        variant='outlined'
                        style={{ width: '100%' }}
                        label='Caller Contact Info'
                        name='callerContactInfo'
                        type='number'
                        value={values.callerContactInfo}
                        onChange={event => handleChange2(event, setFieldValue)}
                        onBlur={handleBlur}
                        helperText={
                          touched.callerContactInfo && errors.callerContactInfo ? errors.callerContactInfo : ''
                        }
                        error={touched.callerContactInfo && Boolean(errors.callerContactInfo)}
                        fullWidth
                        //   InputProps={{
                        //     endAdornment: (
                        //       <InputAdornment position="center" >
                        //         {fetchL && <CircularProgress size={20}/>}
                        //       </InputAdornment>
                        //     )
                        //   }}
                        margin='normal'

                        // disabled={Boolean(values.insuranceName)}
                      />
                      {/* <ErrorMessage name="insuranceName" component="div" /> */}
                    </div>
                    <div style={{ margin: '1rem 0rem' }}>
                      <FormControl variant='outlined' style={{ width: '100%' }}>
                        <InputLabel id='demo-simple-select-label'>Inquiry Category</InputLabel>
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label='Inquiry Category'
                          name='inquiryCategory'
                          value={values.inquiryCategory}
                          // onFocus={handleCountry}
                          onChange={event => handleChange2(event, setFieldValue)}
                          //   helperText={touched.inquiryCategory && errors.inquiryCategory ? errors.inquiryCategory : ''}
                          //   error={touched.inquiryCategory && Boolean(errors.inquiryCategory)}
                          // disabled={Boolean(values.country)}
                          style={{ width: '100%' }}
                        >
                          {/* <MenuItem value={values?.country}>Request</MenuItem>
                          <MenuItem value={values?.country}>Enquiry</MenuItem>
                          <MenuItem value={values?.country}>Grievance</MenuItem> */}
                          <MenuItem value={values?.inquiryCategory}>{values?.inquiryCategory}</MenuItem>
                          {['Request', 'Enquiry', 'Grievance']?.map(item => {
                            return (
                              <MenuItem key={item} value={item}>
                                {item}
                              </MenuItem>
                            )
                          })}
                          {/* {countryDetails?.map(item => {
                              return (
                                <MenuItem key={item?.name} value={item?.name}>
                                  {item?.name}
                                </MenuItem>
                              );
                            })} */}
                        </Select>
                      </FormControl>
                    </div>
                    <div style={{ margin: '1rem 0rem' }}>
                      <TextField
                        variant='outlined'
                        style={{ width: '100%' }}
                        label='Policy Number'
                        name='policyNo'
                        type='number'
                        value={values.policyNo}
                        onChange={event => handleChange2(event, setFieldValue)}
                        onBlur={handleBlur}
                        helperText={touched.policyNo && errors.policyNo ? errors.policyNo : ''}
                        error={touched.policyNo && Boolean(errors.policyNo)}
                        fullWidth
                        margin='normal'

                        // disabled={Boolean(values.insuranceName)}
                      />
                      {/* <ErrorMessage name="insuranceName" component="div" /> */}
                    </div>
                    <div style={{ margin: '1rem 0rem' }}>
                      <TextField
                        id='outlined-multiline-static'
                        label='Address'
                        multiline
                        rows={4}
                        //    defaultValue="Default Value"
                        variant='outlined'
                        style={{ width: '100%' }}
                        name='address'
                        //   type='number'
                        value={values.address}
                        onChange={event => handleChange2(event, setFieldValue)}
                        onBlur={handleBlur}
                        helperText={touched.address && errors.address ? errors.address : ''}
                        error={touched.address && Boolean(errors.address)}
                        fullWidth
                        //   InputProps={{
                        //     endAdornment: (
                        //       <InputAdornment position="center" >
                        //         {fetchL && <CircularProgress size={20}/>}
                        //       </InputAdornment>
                        //     )
                        //   }}
                        margin='normal'

                        // disabled={Boolean(values.insuranceName)}
                      />
                      {/* <ErrorMessage name="insuranceName" component="div" /> */}
                    </div>
                  </Box>
                  <Box sx={{ width: '20%' }}>
                    <div style={{ margin: '1rem 0rem' }}>
                      <TextField
                        variant='outlined'
                        style={{ width: '100%' }}
                        label='Caller Name'
                        name='callerName'
                        value={values.callerName}
                        onChange={event => handleChange2(event, setFieldValue)}
                        onBlur={handleBlur}
                        helperText={touched.callerName && errors.callerName ? errors.callerName : ''}
                        error={touched.callerName && Boolean(errors.callerName)}
                        fullWidth
                        //   InputProps={{
                        //     endAdornment: (
                        //       <InputAdornment position="center" >
                        //         {fetchL && <CircularProgress size={20}/>}
                        //       </InputAdornment>
                        //     )
                        //   }}
                        margin='normal'

                        // disabled={Boolean(values.insuranceName)}
                      />
                      {/* <ErrorMessage name="insuranceName" component="div" /> */}
                    </div>
                    <div style={{ margin: '1rem 0rem' }}>
                      <FormControl variant='outlined' style={{ width: '100%' }}>
                        <InputLabel id='demo-simple-select-label'>Communication Type</InputLabel>
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label='Communication Type'
                          name='communicationType'
                          value={values.communicationType}
                          //   onFocus={handleCountry}
                          onChange={event => handleChange2(event, setFieldValue)}
                          // helperText={touched.communicationType && errors.communicationType ? errors.communicationType : ''}
                          error={touched.communicationType && Boolean(errors.communicationType)}
                          // disabled={Boolean(values.country)}
                          style={{ width: '100%' }}
                        >
                          <MenuItem value={values?.communicationType}>{values?.communicationType}</MenuItem>
                          {['Inbound', 'Outbound']?.map(item => {
                            return (
                              <MenuItem key={item} value={item}>
                                {item}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      </FormControl>
                    </div>
                    <div style={{ margin: '1rem 0rem' }}>
                      <FormControl variant='outlined' style={{ width: '100%' }}>
                        <InputLabel id='demo-simple-select-label'>Inquiry Type</InputLabel>
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label='Inquiry Type'
                          name='inquiryType'
                          value={values.inquiryType}
                          // onFocus={handleCountry}
                          onChange={event => handleChange2(event, setFieldValue)}
                          // disabled={Boolean(values.country)}
                          style={{ width: '100%' }}
                        >
                          {/* <MenuItem value={values?.country}>{values?.country}</MenuItem>
                            {countryDetails?.map(item => {
                              return (
                                <MenuItem key={item?.name} value={item?.name}>
                                  {item?.name}
                                </MenuItem>
                              );
                            })} */}
                        </Select>
                      </FormControl>
                    </div>
                    <div style={{ margin: '1rem 0rem' }}>
                      <FormControl variant='outlined' style={{ width: '100%' }}>
                        <InputLabel id='demo-simple-select-label'>Member No.</InputLabel>
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label='Member No.'
                          name='memberNo'
                          value={values.memberNo}
                          //   onFocus={handleCountry}
                          onChange={event => handleChange2(event, setFieldValue)}
                          // disabled={Boolean(values.country)}
                          style={{ width: '100%' }}
                        >
                          {/* <MenuItem value={values?.country}>{values?.country}</MenuItem>
                            {countryDetails?.map(item => {
                              return (
                                <MenuItem key={item?.name} value={item?.name}>
                                  {item?.name}
                                </MenuItem>
                              );
                            })} */}
                        </Select>
                      </FormControl>
                    </div>
                    <div style={{ margin: '1rem 0rem' }}>
                      <TextField
                        id='outlined-multiline-static'
                        label='Notes'
                        multiline
                        rows={4}
                        //    defaultValue="Default Value"
                        variant='outlined'
                        style={{ width: '100%' }}
                        // label="Address"
                        name='notes'
                        //   type='number'
                        value={values.notes}
                        onChange={event => handleChange2(event, setFieldValue)}
                        onBlur={handleBlur}
                        helperText={touched.notes && errors.notes ? errors.notes : ''}
                        error={touched.notes && Boolean(errors.notes)}
                        fullWidth
                        //   InputProps={{
                        //     endAdornment: (
                        //       <InputAdornment position="center" >
                        //         {fetchL && <CircularProgress size={20}/>}
                        //       </InputAdornment>
                        //     )
                        //   }}
                        margin='normal'

                        // disabled={Boolean(values.insuranceName)}
                      />
                      {/* <ErrorMessage name="insuranceName" component="div" /> */}
                    </div>
                  </Box>
                  <Box sx={{ width: '20%', marginTop: '1rem' }}>
                    <div style={{ margin: '1rem 0rem' }}>
                      <FormControl variant='outlined' style={{ width: '100%' }}>
                        <InputLabel id='demo-simple-select-label'>Relation</InputLabel>
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label='Relation'
                          name='relation'
                          value={values.relation}
                          //   onFocus={handleCountry}
                          onChange={event => handleChange2(event, setFieldValue)}
                          // disabled={Boolean(values.country)}
                          // helperText={touched.relation && errors.relation ? errors.relation : ''}
                          error={touched.relation && Boolean(errors.relation)}
                          style={{ width: '100%' }}
                        >
                          <MenuItem value={values?.relation}>{values?.relation}</MenuItem>
                          {['Member', 'Provider', 'Insurance', 'Corporate', 'Agent']?.map(item => {
                            return (
                              <MenuItem key={item} value={item}>
                                {item}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      </FormControl>
                    </div>
                    <div style={{ margin: '1rem 0rem' }}>
                      <FormControl variant='outlined' style={{ width: '100%' }}>
                        <InputLabel id='demo-simple-select-label'>Received By</InputLabel>
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label='Received By'
                          name='receivedBy'
                          value={values.receivedBy}
                          //   onFocus={handleCountry}
                          onChange={event => handleChange2(event, setFieldValue)}
                          // helperText={touched.receivedBy && errors.receivedBy ? errors.receivedBy : ''}
                          error={touched.receivedBy && Boolean(errors.receivedBy)}
                          // disabled={Boolean(values.country)}
                          style={{ width: '100%' }}
                        >
                          <MenuItem value={values?.receivedBy}>{values?.receivedBy}</MenuItem>
                          {['Courier', 'In Person', 'Letter', 'Phone', 'E-mail']?.map(item => {
                            return (
                              <MenuItem key={item} value={item}>
                                {item}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      </FormControl>
                    </div>
                    <div style={{ margin: '1rem 0rem' }}>
                      <FormControl variant='outlined' style={{ width: '100%' }}>
                        <InputLabel id='demo-simple-select-label'>Call Close.</InputLabel>
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label='Call Close.'
                          name='callClose'
                          value={values.callClose}
                          //   onFocus={handleCountry}
                          onChange={event => handleChange2(event, setFieldValue)}
                          // helperText={touched.callClose && errors.callClose ? errors.callClose : ''}
                          error={touched.callClose && Boolean(errors.callClose)}
                          // disabled={Boolean(values.country)}
                          style={{ width: '100%' }}
                        >
                          <MenuItem value={values?.callClose}>{values?.callClose}</MenuItem>
                          {['Yes', 'No']?.map(item => {
                            return (
                              <MenuItem key={item} value={item}>
                                {item}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      </FormControl>
                    </div>
                    <div style={{ margin: '1rem 0rem' }}>
                      <TextField
                        variant='outlined'
                        style={{ width: '100%' }}
                        label='Member Name'
                        name='memberName'
                        //   type='number'
                        value={values.memberName}
                        onChange={event => handleChange2(event, setFieldValue)}
                        onBlur={handleBlur}
                        //   helperText={touched.insuranceName && errors.insuranceName ? errors.insuranceName : ''}
                        //   error={touched.insuranceName && Boolean(errors.insuranceName)}
                        fullWidth
                        //   InputProps={{
                        //     endAdornment: (
                        //       <InputAdornment position="center" >
                        //         {fetchL && <CircularProgress size={20}/>}
                        //       </InputAdornment>
                        //     )
                        //   }}
                        margin='normal'

                        // disabled={Boolean(values.insuranceName)}
                      />
                      {/* <ErrorMessage name="insuranceName" component="div" /> */}
                    </div>
                    <div>
                      <Button
                        component='label'
                        role={undefined}
                        style={{
                          color: values.document && 'white',
                          backgroundColor: values.document && '#0edb8a',
                          minWidth: '8.7rem'
                        }}
                        tabIndex={-1}
                        startIcon={<CloudUpload style={{ color: values.document && 'white' }} />}
                      >
                        Upload file
                        <VisuallyHiddenInput
                          type='file'
                          name='document'
                          onChange={event => handleChange2(event, setFieldValue)}
                        />
                      </Button>
                      <div style={{ fontSize: '10px', color: 'gray' }}>{values?.document?.name}</div>
                    </div>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <div>
                    <Button
                      variant='contained'
                      type='submit'
                      style={
                        save
                          ? { backgroundColor: '#0edb8a', color: 'white', margin: '2rem' }
                          : { backgroundColor: '#ed2264', color: 'white', margin: '2rem' }
                      }

                      //   disabled={disable}>
                    >
                      {save ? 'Member & Claim Saved' : 'Member & Claim Search'}
                      {save ? (
                        <DoneOutlineOutlined style={{ width: '15px', marginLeft: '5px' }} />
                      ) : (
                        <Search style={{ width: '15px', marginLeft: '5px' }} />
                      )}
                    </Button>
                  </div>
                  <div>
                    <Button
                      variant='contained'
                      //   type="submit"
                      style={{ backgroundColor: '#ed2264', color: 'white', margin: '2rem' }}

                      //   disabled={disable}>
                    >
                      Previous Communication
                      <DockTwoTone style={{ width: '15px', marginLeft: '5px' }} />
                    </Button>
                  </div>
                </Box>
              </Form>
            )
          }}
        </Formik>
      </Paper>

      {/* --------------------------------------------------------------------------------Accordin Start From Hrere ===================================================================== */}

      <Paper
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '2rem 0rem',
          backgroundColor: 'transparent',
          padding: '2rem 0rem'
        }}
      >
        <div style={{ width: '80%' }}>
          <Paper style={{ padding: '0.5rem 0.7rem', backgroundColor: '#D80E51', color: 'white' }}>FAQ</Paper>
          <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary expandIcon={<ExpandMore />} aria-controls='panel1bh-content' id='panel1bh-header'>
              <Typography sx={{ width: '33%', flexShrink: 0 }}>General settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget maximus est, id
                dignissim quam.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
            <AccordionSummary expandIcon={<ExpandMore />} aria-controls='panel2bh-content' id='panel2bh-header'>
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Users</Typography>
              <Typography sx={{ color: 'text.secondary' }}>You are currently not an owner</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus, varius pulvinar diam eros in
                elit. Pellentesque convallis laoreet laoreet.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
            <AccordionSummary expandIcon={<ExpandMore />} aria-controls='panel3bh-content' id='panel3bh-header'>
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Advanced settings</Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Filtering has been entirely disabled for whole web server
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros, vitae egestas
                augue. Duis vel est augue.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
            <AccordionSummary expandIcon={<ExpandMore />} aria-controls='panel4bh-content' id='panel4bh-header'>
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Personal data</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros, vitae egestas
                augue. Duis vel est augue.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </Paper>
    </>
  )
}

// export default CallDetailComponent;
