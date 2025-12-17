// import React, { useEffect } from 'react'

// import { useParams, useRouter, useSearchParams } from 'next/navigation'

// import { Button } from 'primereact/button'
// import FormControl from '@mui/material/FormControl'
// import Grid from '@mui/material/Grid'
// import InputLabel from '@mui/material/InputLabel'
// import MenuItem from '@mui/material/MenuItem'
// import Select from '@mui/material/Select'
// import Snackbar from '@mui/material/Snackbar'
// import { makeStyles } from '@mui/styles'
// import TextField from '@mui/material/TextField'
// import MuiAlert from '@mui/lab/Alert'
// import { useFormik } from 'formik'
// import * as yup from 'yup'

// import type { AlertProps } from '@mui/material'
// import { Paper } from '@mui/material'

// import { ProspectService } from '@/services/remote-api/api/client-services'
// import {
//   ClientTypeService,
//   GroupTypeService,
//   PrefixTypeService,
//   SuffixTypeService
// } from '@/services/remote-api/api/master-services'
// import Asterisk from '../../shared-component/components/red-asterisk'
// import { EmailAvailability } from '@/services/utility'

// const prospectService = new ProspectService()
// const grouptypeService = new GroupTypeService()
// const clienttypeervice = new ClientTypeService()
// const prefixservice = new PrefixTypeService()
// const suffixservice = new SuffixTypeService()

// const gt$ = grouptypeService.getGroupTypes()
// const ct$ = clienttypeervice.getCleintTypes()
// const prefx$ = prefixservice.getPrefixTypes()
// const sufx$ = suffixservice.getSuffixTypes()

// // function useQuery() {
// //   return new URLSearchParams(useLocation().search);
// // }

// const useStyles = makeStyles(theme => ({
//   formBg: {
//     padding: '20px',
//     backgroundColor: '#fff',
//     boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
//     borderRadius: '4px',
//     '& .MuiFormLabel-asterisk.MuiInputLabel-asterisk': {
//       color: 'red'
//     }
//   },
//   formControl: {
//     minWidth: '90%'
//   }
// }))

// const regex = /^[\w&., \-]*$/
// const phoneRegExp =
//   /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

// const validationSchema = yup.object({
//   firstName: yup.string().required('First Name is required') /* 
//         .matches(regex, "Special character not allowed") */,
//   lastName: yup.string().required('Last Name is required') /* 
//         .matches(regex, "Special character not allowed") */,
//   middletName: yup.string() /* 
//         .matches(regex, "Special character not allowed") */,
//   mobileNo: yup
//     .string()
//     .matches(phoneRegExp, 'Contact number is not valid')
//     .max(10, 'Contact no. must be 10 digit')
//     .min(10, 'Contact no. must be 10 digit')
//     .required('Contact No is required'),
//   alternateMobileNo: yup
//     .string()
//     .matches(phoneRegExp, 'Alternate Contact no is not valid')
//     .max(10, 'Alternate Contact no. must be 10 digit')
//     .min(10, 'Alternate Contact no. must be 10 digit')
//     .nullable(),
//   emailId: yup
//     .string()
//     .required('Email is required'),
//   alternateEmailId: yup.string().email('Enter a valid Email ID').nullable()
// })

// export default function ProspectManagementForm(props: any) {
//   const router = useRouter()
//   const query = useSearchParams()
//   const classes = useStyles()
//   const [openEmailMsg, setOpenEmailMsg] = React.useState(false)
//   const [clientTypes, setClientTypes] = React.useState([])
//   const [groupTypes, setGroupTypes] = React.useState([])
//   const [prefixes, setPrefixes] = React.useState([])
//   const [suffixes, setSuffixes] = React.useState([])
//   const [openRequired, setOpenRequired] = React.useState(false)

//   const [state, setState] = React.useState({
//     prospectManagementForm: {
//       clientTypeName: props.clientTypeName,
//       clientType: '',
//       groupType: '',
//       prefix: '',
//       firstName: '',
//       middletName: '',
//       lastName: '',
//       suffix: '',
//       displayName: '',
//       mobileNo: '',
//       alternateMobileNo: '',
//       emailId: '',
//       alternateEmailId: '',
//       addresses: '',
//       code: '',
//       expectedRevenue: 0,
//       leadStatus: '',
//       industry: '',
//       sector: '',
//       leadSourceName: '',
//       leadSourceType: '',
//       isTaxExempted: false, // default to false
//     }
//   })

//   const params = useParams()
//   const id: any = params.id


//   function Alert(props: React.JSX.IntrinsicAttributes & AlertProps) {
//     return <MuiAlert elevation={6} variant='filled' {...props} />
//   }

//   const useObservable = (observable: any, setter: any, type = '') => {
//     useEffect(() => {
//       const subscription = observable.subscribe((result: { content: any[] }) => {
//         if (type === 'clientType') {
//           const clType = result.content.filter((ct: { name: any }) => ct.name == props.clientTypeName)

//           if (clType.length > 0) {
//             setState({
//               prospectManagementForm: {
//                 ...state.prospectManagementForm,
//                 clientType: clType[0].code
//               }
//             })
//           }
//         }

//         setter(result.content)
//       })

//       return () => subscription.unsubscribe()
//     }, [observable, setter])
//   }

//   useObservable(gt$, setGroupTypes)
//   useObservable(ct$, setClientTypes, 'clientType')
//   useObservable(prefx$, setPrefixes)
//   useObservable(sufx$, setSuffixes)

//   React.useEffect(() => {
//     if (id) {
//       setTimeout(() => {
//         populateDetails(id)
//       }, 1000)
//     }
//   }, [id])

//   const populateDetails = (id: string) => {
//     prospectService.getProspectDetails(id).subscribe((result: any) => {
//       console.log('result', result, formik.values, state.prospectManagementForm)

//       setState({ prospectManagementForm: { ...result, isTaxExempted: result.taxEmempted ?? false, addresses: result.addresses[0].addressDetails.AddressLine1, } })
//       formik.setValues({ ...result, isTaxExempted: result.taxEmempted ?? false, addresses: result.addresses[0].addressDetails.AddressLine1 })
//     })
//   }

//   const handleSubmit = async (event?: any) => {
//     const isEmailConfirmed = await EmailAvailability(formik.values.emailId)

//     if (isEmailConfirmed && !id) {
//       setOpenEmailMsg(true)

//       return // Stop execution if email is confirmed
//     }

//     if (state.prospectManagementForm.lastName == '' && state.prospectManagementForm.clientTypeName == 'Retail') {
//       setOpenRequired(true)

//       return
//     }

//     const prospectParam: any = {
//       ...state.prospectManagementForm,
//       taxEmempted: state.prospectManagementForm.isTaxExempted, // map to correct payload field
//       addresses: [
//         {
//           addressDetails: {
//             AddressLine1: state.prospectManagementForm.addresses
//           },
//           addressType: 'CURRENT_ADDRESS'
//         }
//       ]
//     }
//     delete prospectParam.isTaxExempted;

//     if (state.prospectManagementForm.alternateEmailId == '') {
//       prospectParam['alternateEmailId'] = null
//     }

//     if (state.prospectManagementForm.alternateMobileNo == '') {
//       prospectParam['alternateMobileNo'] = null
//     }

//     if (id) {
//       prospectParam['id'] = id
//       prospectParam['code'] = ''

//       prospectService.editProspect(prospectParam, id).subscribe(ele => {
//         handleClose()
//       })
//     } else {
//       prospectService.saveProspect(prospectParam).subscribe((res: any) => {
//         if (query.get('navigate') && res.id) {
//           router.push(`/${query.get('navigate')}?prospectId=${res.id}&mode=create`)
//         } else {
//           handleClose()
//         }
//       })
//     }
//   }

//   const handleChange = (event: any) => {
//     const { name, value } = event.target
//     console.log("qwertyu", name, value)

//     let dname = {}

//     if (state.prospectManagementForm.clientTypeName !== 'Group') {
//       if (name === 'firstName') {
//         dname = {
//           displayName:
//             value + ' ' + state.prospectManagementForm.middletName + ' ' + state.prospectManagementForm.lastName
//         }
//       } else if (name === 'middletName') {
//         dname = {
//           displayName:
//             state.prospectManagementForm.firstName + ' ' + value + ' ' + state.prospectManagementForm.lastName
//         }
//       } else if (name === 'lastName') {
//         dname = {
//           displayName:
//             state.prospectManagementForm.firstName + ' ' + state.prospectManagementForm.middletName + ' ' + value
//         }
//       }
//     } else if (name === 'firstName') {
//       dname = { displayName: value }
//     }

//     let clientTypeName = ''

//     if (name === 'clientType') {
//       const clType: any = clientTypes.filter((ct: any) => ct.code == value)

//       if (clType.length > 0) {
//         clientTypeName = clType[0].name
//       }
//     }
//     setState({
//       prospectManagementForm: {
//         ...state.prospectManagementForm,
//         [name]: value,
//         ...(name === 'clientType' && { clientTypeName }),
//         ...dname
//       }
//     })
//   }

//   const handleClose = () => {
//     router.push('/client/prospects?mode=viewList')
//     // window.location.reload()
//   }

//   const handleEmailSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
//     setOpenEmailMsg(false)
//   }

//   const formik = useFormik({
//     initialValues: {
//       ...state.prospectManagementForm
//     },
//     validationSchema: validationSchema,
//     onSubmit: values => {
//       // alert(JSON.stringify(values, null, 2));
//       handleSubmit()
//     }
//   })

//   const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
//     setOpenRequired(false)
//   }

//   if (state.prospectManagementForm.clientTypeName === 'Group') {
//     delete formik.errors.lastName
//   }

//   useEffect(() => {
//     const dName = state.prospectManagementForm.displayName.replace(/\s+/g, ' ')

//     setState({
//       prospectManagementForm: {
//         ...state.prospectManagementForm,
//         displayName: dName
//       }
//     })
//   }, [state.prospectManagementForm.displayName])
//   console.log("uytrewq", state.prospectManagementForm)
//   return (
//     <Paper elevation={0} style={{ padding: '16px' }}>
//       <form onSubmit={formik.handleSubmit} noValidate>
//         <Snackbar open={openRequired} autoHideDuration={6000} onClose={handleSnackClose}>
//           <Alert onClose={handleSnackClose} severity='error'>
//             Please fill up Last name *
//           </Alert>
//         </Snackbar>
//         <Snackbar open={openEmailMsg} autoHideDuration={6000} onClose={handleEmailSnackClose}>
//           <Alert onClose={handleEmailSnackClose} severity='error'>
//             Email Id Already Exist, Please use another.
//           </Alert>
//         </Snackbar>
//         <Grid container spacing={3} style={{ marginBottom: '20px' }}>
//           <Grid item xs={12} sm={6} md={4}>
//             <FormControl className={classes.formControl}>
//               <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
//                 Client type <Asterisk />
//               </InputLabel>
//               <Select
//                 labelId='demo-simple-select-label'
//                 label='Client Type'
//                 id='demo-simple-select'
//                 name='clientType'
//                 value={state.prospectManagementForm.clientType ? state.prospectManagementForm.clientType : ''}
//                 onChange={handleChange}
//               >
//                 {clientTypes.map((ele: any) => {
//                   return (
//                     <MenuItem key={ele.id} value={ele.code}>
//                       {ele.name}
//                     </MenuItem>
//                   )
//                 })}
//               </Select>
//             </FormControl>
//           </Grid>
//           {/* Is Tax Exempted radio group */}
//           <Grid item xs={12} sm={6} md={4}>
//             <FormControl component="fieldset" className={classes.formControl}>
//               <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
//                 <div>
//                   Is Tax exempted :
//                 </div>
//                 <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 16 }}>
//                   <label style={{ marginRight: 16, marginBottom: 0 }}>
//                     <input
//                       type="radio"
//                       name="isTaxExempted"
//                       style={{ marginRight: 4 }}
//                       checked={state.prospectManagementForm.isTaxExempted === true}
//                       onChange={() => setState({
//                         prospectManagementForm: {
//                           ...state.prospectManagementForm,
//                           isTaxExempted: true
//                         }
//                       })}
//                     />
//                     Yes
//                   </label>
//                   <label style={{ marginBottom: 0 }}>
//                     <input
//                       type="radio"
//                       name="isTaxExempted"
//                       style={{ marginRight: 4 }}
//                       checked={state.prospectManagementForm.isTaxExempted === false}
//                       onChange={() => setState({
//                         prospectManagementForm: {
//                           ...state.prospectManagementForm,
//                           isTaxExempted: false
//                         }
//                       })}
//                     />
//                     No
//                   </label>
//                 </div>
//               </div>
//             </FormControl>
//           </Grid>
//           {state.prospectManagementForm.clientTypeName === 'Group' || state.prospectManagementForm.clientType == 'GROUP' && (
//             <Grid item xs={12} sm={6} md={4}>
//               <FormControl className={classes.formControl}>
//                 <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
//                   Group type
//                 </InputLabel>
//                 <Select
//                   labelId='demo-simple-select-label'
//                   id='demo-simple-select'
//                   label='Group Type'
//                   name='groupType'
//                   value={state.prospectManagementForm.groupType}
//                   onChange={handleChange}
//                 >
//                   {groupTypes.map((ele: any) => {
//                     return (
//                       <MenuItem key={ele.id} value={ele.code}>
//                         {ele.name}
//                       </MenuItem>
//                     )
//                   })}
//                 </Select>
//               </FormControl>
//             </Grid>
//           )}
//         </Grid>
//         {state.prospectManagementForm.clientTypeName === 'Group' ? (
//           <Grid container spacing={3} style={{ marginBottom: '20px' }}>
//             <Grid item xs={12} sm={6} md={4}>
//               <FormControl className={classes.formControl}>
//                 <TextField
//                   id='standard-basic'
//                   name='firstName'
//                   value={formik.values.firstName}
//                   onChange={formik.handleChange}
//                   onKeyUp={handleChange}
//                   label='Name'
//                   required
//                   error={formik.touched.firstName && Boolean(formik.errors.firstName)}
//                   helperText={formik.touched.firstName && formik.errors.firstName}
//                 />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6} md={4}>
//               <FormControl className={classes.formControl}>
//                 <TextField
//                   id='standard-basic'
//                   name='displayName'
//                   value={state.prospectManagementForm.displayName}
//                   onChange={handleChange}
//                   label='Display Name'
//                 />
//               </FormControl>
//             </Grid>
//           </Grid>
//         ) : (
//           <>
//             <Grid container spacing={3} style={{ marginBottom: '20px' }}>
//               <Grid item xs={12} sm={6} md={4}>
//                 <FormControl className={classes.formControl}>
//                   <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
//                     Prefix
//                   </InputLabel>
//                   <Select
//                     labelId='demo-simple-select-label'
//                     label='Prefix'
//                     name='prefix'
//                     value={state.prospectManagementForm.prefix ?? ''}
//                     onChange={handleChange}

//                   // onSelect={handleChange}
//                   >
//                     {prefixes.map((ele: any) => {
//                       return (
//                         <MenuItem key={ele.id} value={ele.code}>
//                           {ele.abbreviation}
//                         </MenuItem>
//                       )
//                     })}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 <FormControl className={classes.formControl}>
//                   <TextField
//                     id='standard-basic'
//                     name='firstName'
//                     value={formik.values.firstName}
//                     onChange={formik.handleChange}
//                     onInput={(e: any) => {
//                       e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')
//                     }}
//                     onKeyUp={handleChange}
//                     label={
//                       <span>
//                         First Name <Asterisk />
//                       </span>
//                     }
//                     // required
//                     error={formik.touched.firstName && Boolean(formik.errors.firstName)}
//                     helperText={formik.touched.firstName && formik.errors.firstName}
//                   />
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 <FormControl className={classes.formControl}>
//                   <TextField
//                     id='standard-basic'
//                     name='middletName'
//                     value={formik.values.middletName ?? ''}
//                     onChange={formik.handleChange}
//                     onInput={(e: any) => {
//                       e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')
//                     }}
//                     onKeyUp={handleChange}
//                     label='Middle Name'
//                   // error={formik.touched.middletName && Boolean(formik.errors.middletName)}
//                   // helperText={formik.touched.middletName && formik.errors.middletName}
//                   />
//                 </FormControl>
//               </Grid>
//             </Grid>
//             <Grid container spacing={3} style={{ marginBottom: '20px' }}>
//               <Grid item xs={12} sm={6} md={4}>
//                 <FormControl className={classes.formControl}>
//                   <TextField
//                     id='standard-basic'
//                     name='lastName'
//                     value={formik.values.lastName ?? ''}
//                     onChange={formik.handleChange}
//                     onInput={(e: any) => {
//                       e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')
//                     }}
//                     onKeyUp={handleChange}
//                     label={
//                       <span>
//                         Last Name <Asterisk />
//                       </span>
//                     }
//                     // required
//                     error={formik.touched.lastName && Boolean(formik.errors.lastName)}
//                     helperText={formik.touched.lastName && formik.errors.lastName}
//                   />
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 <FormControl className={classes.formControl}>
//                   <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
//                     Suffix
//                   </InputLabel>
//                   <Select
//                     labelId='demo-simple-select-label'
//                     name='suffix'
//                     label='Suffix'
//                     value={state.prospectManagementForm.suffix ?? ''}
//                     onChange={handleChange}

//                   // onKeyUp={handleChange}
//                   >
//                     {suffixes.map((ele: any) => {
//                       return (
//                         <MenuItem key={ele.id} value={ele.id}>
//                           {ele.abbreviation}
//                         </MenuItem>
//                       )
//                     })}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 <FormControl className={classes.formControl}>
//                   <TextField
//                     id='standard-basic'
//                     name='displayName'
//                     value={state.prospectManagementForm.displayName}
//                     onChange={handleChange}
//                     label='Display Name'
//                     error={formik.touched.displayName && Boolean(formik.errors.displayName)}
//                     helperText={formik.touched.displayName && formik.errors.displayName}
//                   />
//                 </FormControl>
//               </Grid>
//             </Grid>
//           </>
//         )}

//         <Grid container spacing={3} style={{ marginBottom: '20px' }}>
//           <Grid item xs={12} sm={6} md={4}>
//             <FormControl className={classes.formControl}>
//               <TextField
//                 id='standard-basic'
//                 type='text'
//                 onKeyPress={event => {
//                   if (!/[0-9]/.test(event.key)) {
//                     event.preventDefault()
//                   }
//                 }}
//                 name='mobileNo'
//                 value={formik.values.mobileNo}
//                 onChange={formik.handleChange}
//                 onKeyUp={handleChange}
//                 label={
//                   <span>
//                     Contact No <Asterisk />
//                   </span>
//                 }
//                 // required
//                 error={formik.touched.mobileNo && Boolean(formik.errors.mobileNo)}
//                 helperText={formik.touched.mobileNo && formik.errors.mobileNo}
//               />
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={6} md={4}>
//             <FormControl className={classes.formControl}>
//               <TextField
//                 id='standard-basic'
//                 name='emailId'
//                 value={formik.values.emailId}
//                 onChange={formik.handleChange}
//                 onKeyUp={handleChange}
//                 label={
//                   <span>
//                     Email id <Asterisk />
//                   </span>
//                 }
//                 // required
//                 error={formik.touched.emailId && Boolean(formik.errors.emailId)}
//                 helperText={formik.touched.emailId && formik.errors.emailId}
//               />
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={6} md={4}>
//             <FormControl className={classes.formControl}>
//               <TextField
//                 id='standard-basic'
//                 name='addresses'
//                 multiline
//                 value={formik.values.addresses}
//                 onChange={formik.handleChange}
//                 onKeyUp={handleChange}
//                 label='Address'
//               />
//             </FormControl>
//           </Grid>
//         </Grid>
//         <Grid container spacing={3} style={{ marginBottom: '20px' }}>
//           <Grid item xs={12} sm={6} md={4}>
//             <FormControl className={classes.formControl}>
//               <TextField
//                 id='standard-basic'
//                 type='text'
//                 onKeyPress={event => {
//                   if (!/[0-9]/.test(event.key)) {
//                     event.preventDefault()
//                   }
//                 }}
//                 name='alternateMobileNo'
//                 value={formik.values.alternateMobileNo ?? ''}
//                 onChange={formik.handleChange}
//                 onKeyUp={handleChange}
//                 /* value={state.prospectManagementForm.alternateMobileNo}
//                             onChange={handleChange} */
//                 label='Alt. Contact No'
//                 error={formik.touched.alternateMobileNo && Boolean(formik.errors.alternateMobileNo)}
//                 helperText={formik.touched.alternateMobileNo && formik.errors.alternateMobileNo}
//               />
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={6} md={4}>
//             <FormControl className={classes.formControl}>
//               <TextField
//                 id='standard-basic'
//                 name='alternateEmailId'
//                 value={formik.values.alternateEmailId ?? ''}
//                 onChange={formik.handleChange}
//                 onKeyUp={handleChange}
//                 /* value={state.prospectManagementForm.alternateEmailId}
//                             onChange={handleChange} */
//                 label='Alt. Email id'
//                 error={formik.touched.alternateEmailId && Boolean(formik.errors.alternateEmailId)}
//                 helperText={formik.touched.alternateEmailId && formik.errors.alternateEmailId}
//               />
//             </FormControl>
//           </Grid>
//           {query.get('mode') === 'edit' ? (
//             <Grid item xs={12} sm={6} md={4}>
//               <FormControl className={classes.formControl}>
//                 <TextField
//                   id='standard-basic'
//                   name='code'
//                   value={formik.values.code}
//                   onChange={formik.handleChange}
//                   onKeyUp={handleChange}
//                   label='Code'
//                   disabled
//                 />
//               </FormControl>
//             </Grid>
//           ) : null}
//         </Grid>

//         <Grid container spacing={3} style={{ marginBottom: '20px' }}>
//           <Grid item xs={12} sm={6} md={4}>
//             <FormControl className={classes.formControl}>
//               <TextField
//                 id='standard-basic'
//                 name='expectedRevenue'
//                 value={formik.values.expectedRevenue ?? 0}
//                 onChange={formik.handleChange}
//                 onKeyUp={handleChange}
//                 label='Expected Revenue'
//               />
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={6} md={4}>
//             <FormControl className={classes.formControl}>
//               <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
//                 Lead Status
//               </InputLabel>
//               <Select
//                 labelId='demo-simple-select-label'
//                 label='Lead Status'
//                 name='leadStatus'
//                 value={state.prospectManagementForm.leadStatus ?? ''}
//                 onChange={handleChange}
//               // onKeyUp={handleChange}
//               >
//                 {['Hot', 'Warm', 'Cold'].map((ele: any) => {
//                   return (
//                     <MenuItem key={ele} value={ele}>
//                       {ele}
//                     </MenuItem>
//                   )
//                 })}
//               </Select>
//             </FormControl>
//           </Grid>
//         </Grid>
//         <Grid container spacing={3} style={{ marginBottom: '20px' }}>
//           <Grid item xs={12} sm={6} md={4}>
//             <FormControl className={classes.formControl}>
//               <TextField
//                 id='standard-basic'
//                 name='sector'
//                 value={formik.values.sector ?? ''}
//                 onChange={formik.handleChange}
//                 onKeyUp={handleChange}
//                 label='Sector'
//               />
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={6} md={4}>
//             <FormControl className={classes.formControl}>
//               <TextField
//                 id='standard-basic'
//                 name='industry'
//                 value={formik.values.industry ?? ''}
//                 onChange={formik.handleChange}
//                 onKeyUp={handleChange}
//                 label='Industry'
//               />
//             </FormControl>
//           </Grid>
//         </Grid>
//         <Grid container spacing={3} style={{ marginBottom: '20px' }}>
//           <Grid item xs={12} sm={6} md={4}>
//             <FormControl className={classes.formControl}>
//               <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
//                 Lead Source Type
//               </InputLabel>
//               <Select
//                 labelId="lead-source-type-label"
//                 label="Lead Source Type"
//                 name="leadSourceType"
//                 value={state.prospectManagementForm.leadSourceType ?? ""}
//                 onChange={handleChange}
//               >
//                 {["FRIEND", "INHOUSE"].map((ele) => (
//                   <MenuItem key={ele} value={ele}>
//                     {ele.charAt(0).toUpperCase() + ele.slice(1).toLowerCase()}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={6} md={4}>
//             <FormControl className={classes.formControl}>
//               <TextField
//                 id='standard-basic'
//                 name='leadSourceName'
//                 value={formik.values.leadSourceName ?? ''}
//                 onChange={formik.handleChange}
//                 onKeyUp={handleChange}
//                 label='Lead Source Name'
//               />
//             </FormControl>
//           </Grid>
//         </Grid>

//         <Grid container spacing={3}>
//           <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
//             <Button color='secondary' style={{ marginRight: '5px' }} type='submit'>
//               Save
//             </Button>
//             <Button color='primary' onClick={handleClose} className='p-button-text'>
//               Cancel
//             </Button>
//           </Grid>
//         </Grid>
//       </form>
//     </Paper>
//   )
// }














import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Button } from 'primereact/button'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Snackbar from '@mui/material/Snackbar'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import MuiAlert from '@mui/lab/Alert'
import { useFormik } from 'formik'
import * as yup from 'yup'
import type { AlertProps } from '@mui/material'
import { Paper, CircularProgress, Box } from '@mui/material'

import { ProspectService } from '@/services/remote-api/api/client-services'
import {
  ClientTypeService,
  GroupTypeService,
  PrefixTypeService,
  SuffixTypeService
} from '@/services/remote-api/api/master-services'
import Asterisk from '../../shared-component/components/red-asterisk'
import { EmailAvailability } from '@/services/utility'

const prospectService = new ProspectService()
const grouptypeService = new GroupTypeService()
const clienttypeervice = new ClientTypeService()
const prefixservice = new PrefixTypeService()
const suffixservice = new SuffixTypeService()

const gt$ = grouptypeService.getGroupTypes()
const ct$ = clienttypeervice.getCleintTypes()
const prefx$ = prefixservice.getPrefixTypes()
const sufx$ = suffixservice.getSuffixTypes()

const useStyles = makeStyles(theme => ({
  formBg: {
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px',
    '& .MuiFormLabel-asterisk.MuiInputLabel-asterisk': {
      color: 'red'
    }
  },
  formControl: {
    minWidth: '90%'
  },
  emailFieldContainer: {
    position: 'relative'
  },
  emailLoadingIcon: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)'
  }
}))

const regex = /^[\w&., \-]*$/
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const validationSchema = yup.object({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  middletName: yup.string(),
  mobileNo: yup
    .string()
    .matches(phoneRegExp, 'Contact number is not valid')
    .max(10, 'Contact no. must be 10 digit')
    .min(10, 'Contact no. must be 10 digit')
    .required('Contact No is required'),
  alternateMobileNo: yup
    .string()
    .matches(phoneRegExp, 'Alternate Contact no is not valid')
    .max(10, 'Alternate Contact no. must be 10 digit')
    .min(10, 'Alternate Contact no. must be 10 digit')
    .nullable(),
  emailId: yup
    .string()
    .required('Email is required'),
  alternateEmailId: yup.string().email('Enter a valid Email ID').nullable()
})

export default function ProspectManagementForm(props: any) {
  const router = useRouter()
  const query = useSearchParams()
  const classes = useStyles()
  const [openRequired, setOpenRequired] = React.useState(false)
  const [clientTypes, setClientTypes] = React.useState([])
  const [groupTypes, setGroupTypes] = React.useState([])
  const [prefixes, setPrefixes] = React.useState([])
  const [suffixes, setSuffixes] = React.useState([])

  // Email validation states
  const [emailValidationState, setEmailValidationState] = useState({
    isChecking: false,
    isEmailTaken: false,
    emailError: '',
    isEmailAvailable: false
  })
  const [emailCheckTimeout, setEmailCheckTimeout] = useState<NodeJS.Timeout | null>(null)

  // Success/Error message states
  const [messageState, setMessageState] = useState({
    showSuccess: false,
    showError: false,
    successMessage: '',
    errorMessage: ''
  })

  const [otpState, setOtpState] = useState<{
    isOtpSent: boolean,
    isOtpVerified: boolean,
    otp: string,
    loading: boolean,
    error: string,
    id: string,
    status: string | null, // pending | verified | failed
  }>({
    isOtpSent: false,
    isOtpVerified: false,
    otp: '',
    loading: false,
    error: '',
    id: '',
    status: null, // pending | verified | failed
  })

  const [state, setState] = React.useState({
    prospectManagementForm: {
      clientTypeName: props.clientTypeName,
      clientType: '',
      groupType: '',
      prefix: '',
      firstName: '',
      middletName: '',
      lastName: '',
      suffix: '',
      displayName: '',
      mobileNo: '',
      alternateMobileNo: '',
      emailId: '',
      alternateEmailId: '',
      addresses: '',
      code: '',
      expectedRevenue: 0,
      leadStatus: '',
      industry: '',
      sector: '',
      leadSourceName: '',
      leadSourceType: '',
      isTaxExempted: false,
    }
  })

  const params = useParams()
  const id: any = params.id

  function Alert(props: React.JSX.IntrinsicAttributes & AlertProps) {
    return <MuiAlert elevation={6} variant='filled' {...props} />
  }

  // Show message helper function
  const showMessage = (type: 'success' | 'error', message: string) => {
    setMessageState({
      showSuccess: type === 'success',
      showError: type === 'error',
      successMessage: type === 'success' ? message : '',
      errorMessage: type === 'error' ? message : ''
    })
  }

  // Hide messages
  const hideMessages = () => {
    setMessageState({
      showSuccess: false,
      showError: false,
      successMessage: '',
      errorMessage: ''
    })
  }

  // Debounced email availability check
  const checkEmailAvailability = useCallback(async (email: string, isEdit: boolean = false) => {
    // Skip validation if in edit mode or email is empty
    if (isEdit || !email || email.trim() === '') {
      setEmailValidationState({
        isChecking: false,
        isEmailTaken: false,
        emailError: '',
        isEmailAvailable: false
      })
      return
    }

    // Basic email format validation first
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailValidationState({
        isChecking: false,
        isEmailTaken: false,
        emailError: 'Please enter a valid email address',
        isEmailAvailable: false
      })
      return
    }

    setEmailValidationState(prev => ({
      ...prev,
      isChecking: true,
      emailError: '',
      isEmailAvailable: false
    }))

    try {
      const isEmailConfirmed = await EmailAvailability(email)
      setEmailValidationState({
        isChecking: false,
        isEmailTaken: Boolean(isEmailConfirmed),
        emailError: isEmailConfirmed ? 'Email ID already exists, please use another.' : '',
        isEmailAvailable: !isEmailConfirmed
      })
    } catch (error) {
      console.error('Email availability check failed:', error)
      setEmailValidationState({
        isChecking: false,
        isEmailTaken: false,
        emailError: 'Unable to verify email availability. Please try again.',
        isEmailAvailable: false
      })
    }
  }, [])

  // Handle email field changes with debouncing
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value

    // Update formik values immediately for UI responsiveness
    formik.handleChange(event)

    // Clear existing timeout
    if (emailCheckTimeout) {
      clearTimeout(emailCheckTimeout)
    }

    // Reset email validation state immediately
    setEmailValidationState(prev => ({
      ...prev,
      isEmailTaken: false,
      emailError: '',
      isEmailAvailable: false
    }))

    // Set new timeout for email validation (500ms delay)
    const newTimeout = setTimeout(() => {
      checkEmailAvailability(email, !!id)
    }, 500)

    setEmailCheckTimeout(newTimeout)
  }

  const useObservable = (observable: any, setter: any, type = '') => {
    useEffect(() => {
      const subscription = observable.subscribe((result: { content: any[] }) => {
        if (type === 'clientType') {
          const clType = result.content.filter((ct: { name: any }) => ct.name == props.clientTypeName)

          if (clType.length > 0) {
            setState({
              prospectManagementForm: {
                ...state.prospectManagementForm,
                clientType: clType[0].code
              }
            })
          }
        }

        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(gt$, setGroupTypes)
  useObservable(ct$, setClientTypes, 'clientType')
  useObservable(prefx$, setPrefixes)
  useObservable(sufx$, setSuffixes)

  React.useEffect(() => {
    if (id) {
      setTimeout(() => {
        populateDetails(id)
      }, 1000)
    }
  }, [id])

  const populateDetails = (id: string) => {
    prospectService.getProspectDetails(id).subscribe({
      next: (result: any) => {
        console.log('result', result, formik.values, state.prospectManagementForm)

        setState({
          prospectManagementForm: {
            ...result,
            isTaxExempted: result.taxEmempted ?? false,
            addresses: result.addresses[0]?.addressDetails?.AddressLine1 || '',
          }
        })
        formik.setValues({
          ...result,
          isTaxExempted: result.taxEmempted ?? false,
          addresses: result.addresses[0]?.addressDetails?.AddressLine1 || ''
        })

        showMessage('success', 'Prospect details loaded successfully.')
      },
      error: (error) => {
        console.error('Error loading prospect details:', error)
        showMessage('error', 'Failed to load prospect details. Please refresh the page and try again.')
      }
    })
  }

  const handleSubmit = async (event?: any) => {
    // Hide any existing messages
    hideMessages()

    if (!otpState.isOtpVerified) {
      showMessage('error', 'Please verify your email with OTP before saving.')
      return
    }

    // Check if email is taken (for new prospects only)
    if (!id && emailValidationState.isEmailTaken) {
      showMessage('error', 'Cannot proceed: Email address is already in use. Please use a different email.')
      return
    }

    // Check if email validation is still in progress
    if (emailValidationState.isChecking) {
      showMessage('error', 'Please wait for email validation to complete.')
      return
    }

    if (state.prospectManagementForm.lastName == '' && state.prospectManagementForm.clientTypeName == 'Retail') {
      setOpenRequired(true)
      return
    }

    try {
      const prospectParam: any = {
        ...state.prospectManagementForm,
        taxEmempted: state.prospectManagementForm.isTaxExempted,
        addresses: [
          {
            addressDetails: {
              AddressLine1: state.prospectManagementForm.addresses
            },
            addressType: 'CURRENT_ADDRESS'
          }
        ]
      }
      delete prospectParam.isTaxExempted

      if (state.prospectManagementForm.alternateEmailId == '') {
        prospectParam['alternateEmailId'] = null
      }

      if (state.prospectManagementForm.alternateMobileNo == '') {
        prospectParam['alternateMobileNo'] = null
      }

      if (id) {
        // Update existing prospect
        prospectParam['id'] = id
        prospectParam['code'] = ''

        prospectService.editProspect(prospectParam, id).subscribe({
          next: (response) => {
            showMessage('success', 'Prospect updated successfully!')
            setTimeout(() => {
              handleClose()
            }, 1500)
          },
          error: (error) => {
            console.error('Error updating prospect:', error)
            showMessage('error', 'Failed to update prospect. Please try again or contact support.')
          }
        })
      } else {
        // Create new prospect
        prospectService.saveProspect(prospectParam).subscribe({
          next: (res: any) => {
            showMessage('success', 'Prospect created successfully!')

            if (query.get('navigate') && res.id) {
              setTimeout(() => {
                router.push(`/${query.get('navigate')}?prospectId=${res.id}&mode=create`)
              }, 1500)
            } else {
              setTimeout(() => {
                handleClose()
              }, 1500)
            }
          },
          error: (error) => {
            console.error('Error creating prospect:', error)
            if (error.message && error.message.includes('email')) {
              showMessage('error', 'Email address is already registered. Please use a different email.')
            } else if (error.status === 400) {
              showMessage('error', 'Invalid data provided. Please check all required fields and try again.')
            } else if (error.status === 500) {
              showMessage('error', 'Server error occurred. Please try again later or contact support.')
            } else {
              showMessage('error', 'Failed to create prospect. Please check your connection and try again.')
            }
          }
        })
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      showMessage('error', 'An unexpected error occurred. Please try again.')
    }
  }

  const handleChange = (event: any) => {
    const { name, value } = event.target
    console.log("qwertyu", name, value)

    let dname = {}

    if (state.prospectManagementForm.clientTypeName !== 'Group') {
      if (name === 'firstName') {
        dname = {
          displayName:
            value + ' ' + state.prospectManagementForm.middletName + ' ' + state.prospectManagementForm.lastName
        }
      } else if (name === 'middletName') {
        dname = {
          displayName:
            state.prospectManagementForm.firstName + ' ' + value + ' ' + state.prospectManagementForm.lastName
        }
      } else if (name === 'lastName') {
        dname = {
          displayName:
            state.prospectManagementForm.firstName + ' ' + state.prospectManagementForm.middletName + ' ' + value
        }
      }
    } else if (name === 'firstName') {
      dname = { displayName: value }
    }

    let clientTypeName = ''

    if (name === 'clientType') {
      const clType: any = clientTypes.filter((ct: any) => ct.code == value)

      if (clType.length > 0) {
        clientTypeName = clType[0].name
      }
    }
    setState({
      prospectManagementForm: {
        ...state.prospectManagementForm,
        [name]: value,
        ...(name === 'clientType' && { clientTypeName }),
        ...dname
      }
    })
  }

  const handleClose = () => {
    router.push('/client/prospects?mode=viewList')
  }

  const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setOpenRequired(false)
  }

  const handleSuccessClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return
    hideMessages()
  }

  const handleErrorClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return
    hideMessages()
  }

  // Send OTP
  const handleSendOtp = () => {
    if (!formik.values.emailId) {
      showMessage('error', 'Please enter email before requesting OTP.')
      return
    }
    try {
      setOtpState({ ...otpState, loading: true, error: '' })
      prospectService.generateOtp({
        "contactType": "EMAIL",
        "contactTypeValue": formik.values.emailId
      }).subscribe(((res: any) => {
        console.log("122345", res)
        setOtpState({ ...otpState, loading: false, isOtpSent: true, id: res.id })
        showMessage('success', 'OTP sent to your email!')
      })) // call backend
    } catch (err) {
      setOtpState({ ...otpState, loading: false, error: 'Failed to send OTP' })
    }
  }

  // Verify OTP
  const handleVerifyOtp = async () => {
    try {
      setOtpState({ ...otpState, loading: true, error: '' })
      prospectService.verifyOtp({
        "otp": otpState.otp
      }, otpState.id).subscribe((res: any) => {
        // if (res.success) {
        // setOtpState({ ...otpState, loading: false, isOtpVerified: true })
        // showMessage('success', 'OTP verified successfully!')
        pollOtpStatus(otpState.id);
        // } else {
        //   setOtpState({ ...otpState, loading: false, error: 'Invalid OTP' })
        // }
      })
    } catch (err) {
      setOtpState({ ...otpState, loading: false, error: 'Verification failed' })
    }
  }

  const pollOtpStatus = (requestId: string) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;

      prospectService.otpStatus(requestId).subscribe((res: any) => {
        if (res.otpStatus === "VERIFIED") {
          clearInterval(interval);
          setOtpState({
            ...otpState,
            isOtpVerified: true,
            loading: false,
            status: "verified",
          });
          showMessage('success', 'Email verified successfully!')
          // enqueueSnackbar("Email verified successfully!", { variant: "success" });
        } else if (res.otpStatus === "INVALID" || attempts > 5) {
          clearInterval(interval);
          setOtpState({ ...otpState, loading: false, status: "failed" });
          showMessage('error', 'Invalid Otp!')
          // enqueueSnackbar("OTP verification failed", { variant: "error" });
        }
      })

      // try {
      //   const res = await api.checkOtpStatus(requestId);

      //   if (res.status === "VERIFIED") {
      //     clearInterval(interval);
      //     setOtpState({
      //       ...otpState,
      //       isOtpVerified: true,
      //       loading: false,
      //       status: "verified",
      //     });
      //     enqueueSnackbar("Email verified successfully!", { variant: "success" });
      //   } else if (res.status === "FAILED" || attempts > 5) {
      //     clearInterval(interval);
      //     setOtpState({ ...otpState, loading: false, status: "failed" });
      //     enqueueSnackbar("OTP verification failed", { variant: "error" });
      //   }
      // } catch (err) {
      //   clearInterval(interval);
      //   setOtpState({ ...otpState, loading: false });
      //   enqueueSnackbar("Error checking OTP status", { variant: "error" });
      // }
    }, 3000); // check every 3s
  };



  const formik = useFormik({
    initialValues: {
      ...state.prospectManagementForm
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      handleSubmit()
    }
  })

  if (state.prospectManagementForm.clientTypeName === 'Group') {
    delete formik.errors.lastName
  }

  useEffect(() => {
    const dName = state.prospectManagementForm.displayName.replace(/\s+/g, ' ')

    setState({
      prospectManagementForm: {
        ...state.prospectManagementForm,
        displayName: dName
      }
    })
  }, [state.prospectManagementForm.displayName])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (emailCheckTimeout) {
        clearTimeout(emailCheckTimeout)
      }
    }
  }, [emailCheckTimeout])



  return (
    <Paper elevation={0} style={{ padding: '16px' }}>
      <form onSubmit={formik.handleSubmit} noValidate>
        {/* Success Message */}
        <Snackbar
          open={messageState.showSuccess}
          autoHideDuration={4000}
          onClose={handleSuccessClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleSuccessClose} severity='success' sx={{ width: '100%' }}>
            {messageState.successMessage}
          </Alert>
        </Snackbar>

        {/* Error Message */}
        <Snackbar
          open={messageState.showError}
          autoHideDuration={6000}
          onClose={handleErrorClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleErrorClose} severity='error' sx={{ width: '100%' }}>
            {messageState.errorMessage}
          </Alert>
        </Snackbar>

        {/* Required Field Warning */}
        <Snackbar open={openRequired} autoHideDuration={6000} onClose={handleSnackClose}>
          <Alert onClose={handleSnackClose} severity='warning'>
            Please fill up Last name - it is required for Retail clients.
          </Alert>
        </Snackbar>

        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                Client type <Asterisk />
              </InputLabel>
              <Select
                labelId='demo-simple-select-label'
                label='Client Type'
                id='demo-simple-select'
                name='clientType'
                value={state.prospectManagementForm.clientType ? state.prospectManagementForm.clientType : ''}
                onChange={handleChange}
              >
                {clientTypes.map((ele: any) => {
                  return (
                    <MenuItem key={ele.id} value={ele.code}>
                      {ele.name}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl component="fieldset" className={classes.formControl}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <div>
                  Is Tax exempted :
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 16 }}>
                  <label style={{ marginRight: 16, marginBottom: 0 }}>
                    <input
                      type="radio"
                      name="isTaxExempted"
                      style={{ marginRight: 4 }}
                      checked={state.prospectManagementForm.isTaxExempted === true}
                      onChange={() => setState({
                        prospectManagementForm: {
                          ...state.prospectManagementForm,
                          isTaxExempted: true
                        }
                      })}
                    />
                    Yes
                  </label>
                  <label style={{ marginBottom: 0 }}>
                    <input
                      type="radio"
                      name="isTaxExempted"
                      style={{ marginRight: 4 }}
                      checked={state.prospectManagementForm.isTaxExempted === false}
                      onChange={() => setState({
                        prospectManagementForm: {
                          ...state.prospectManagementForm,
                          isTaxExempted: false
                        }
                      })}
                    />
                    No
                  </label>
                </div>
              </div>
            </FormControl>
          </Grid>

          {(state.prospectManagementForm.clientTypeName === 'Group' || state.prospectManagementForm.clientType == 'GROUP') && (
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                  Group type
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  label='Group Type'
                  name='groupType'
                  value={state.prospectManagementForm.groupType}
                  onChange={handleChange}
                >
                  {groupTypes.map((ele: any) => {
                    return (
                      <MenuItem key={ele.id} value={ele.code}>
                        {ele.name}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>

        {/* Rest of the form remains the same until the email field */}
        {state.prospectManagementForm.clientTypeName === 'Group' ? (
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <TextField
                  id='standard-basic'
                  name='firstName'
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onKeyUp={handleChange}
                  label='Name'
                  required
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <TextField
                  id='standard-basic'
                  name='displayName'
                  value={state.prospectManagementForm.displayName}
                  onChange={handleChange}
                  label='Display Name'
                />
              </FormControl>
            </Grid>
          </Grid>
        ) : (
          <>
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Prefix
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    label='Prefix'
                    name='prefix'
                    value={state.prospectManagementForm.prefix ?? ''}
                    onChange={handleChange}
                  >
                    {prefixes.map((ele: any) => {
                      return (
                        <MenuItem key={ele.id} value={ele.code}>
                          {ele.abbreviation}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <TextField
                    id='standard-basic'
                    name='firstName'
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onInput={(e: any) => {
                      e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')
                    }}
                    onKeyUp={handleChange}
                    label={
                      <span>
                        First Name <Asterisk />
                      </span>
                    }
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <TextField
                    id='standard-basic'
                    name='middletName'
                    value={formik.values.middletName ?? ''}
                    onChange={formik.handleChange}
                    onInput={(e: any) => {
                      e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')
                    }}
                    onKeyUp={handleChange}
                    label='Middle Name'
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <TextField
                    id='standard-basic'
                    name='lastName'
                    value={formik.values.lastName ?? ''}
                    onChange={formik.handleChange}
                    onInput={(e: any) => {
                      e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')
                    }}
                    onKeyUp={handleChange}
                    label={
                      <span>
                        Last Name <Asterisk />
                      </span>
                    }
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Suffix
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    name='suffix'
                    label='Suffix'
                    value={state.prospectManagementForm.suffix ?? ''}
                    onChange={handleChange}
                  >
                    {suffixes.map((ele: any) => {
                      return (
                        <MenuItem key={ele.id} value={ele.id}>
                          {ele.abbreviation}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <TextField
                    id='standard-basic'
                    name='displayName'
                    value={state.prospectManagementForm.displayName}
                    onChange={handleChange}
                    label='Display Name'
                    error={formik.touched.displayName && Boolean(formik.errors.displayName)}
                    helperText={formik.touched.displayName && formik.errors.displayName}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </>
        )}

        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Contact Number */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              type="text"
              name="mobileNo"
              label={
                <span>
                  Contact No <Asterisk />
                </span>
              }
              value={formik.values.mobileNo}
              onChange={formik.handleChange}
              onKeyUp={handleChange}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) event.preventDefault();
              }}
              error={formik.touched.mobileNo && Boolean(formik.errors.mobileNo)}
              helperText={formik.touched.mobileNo && formik.errors.mobileNo}
            />
          </Grid>

          {/* Email + OTP */}
          <Grid item xs={12} sm={6} md={4}>
            <Box display="flex" alignItems="center" gap={1}>
              <TextField
                fullWidth
                name="emailId"
                label={
                  <span>
                    Email ID <Asterisk />
                  </span>
                }
                value={formik.values.emailId}
                onChange={handleEmailChange}
                onKeyUp={handleChange}
                error={
                  (formik.touched.emailId && Boolean(formik.errors.emailId)) ||
                  Boolean(emailValidationState.emailError)
                }
                helperText={
                  emailValidationState.emailError ||
                  (formik.touched.emailId && formik.errors.emailId) ||
                  (emailValidationState.isEmailAvailable && !emailValidationState.isChecking
                    ? otpState.isOtpSent ? "" : "✓ Email is available"
                    : "")
                }
                FormHelperTextProps={{
                  style: {
                    color:
                      emailValidationState.isEmailAvailable && !emailValidationState.emailError
                        ? "#4caf50"
                        : undefined,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <>
                      {emailValidationState.isChecking && (
                        <CircularProgress size={18} sx={{ mr: 1 }} />
                      )}
                      {emailValidationState.isEmailAvailable && (
                        <Button
                          size="small"
                          // variant={otpState.isOtpVerified ? "contained" : "outlined"}
                          color={otpState.isOtpVerified ? "success" : "primary"}
                          onClick={handleSendOtp}
                          disabled={otpState.loading || otpState.isOtpVerified}
                        >
                          {otpState.isOtpVerified ? "Verified" : "Send OTP"}
                        </Button>
                      )}
                    </>
                  ),
                }}
              />
            </Box>

            {/* OTP Field */}
            {otpState.isOtpSent && !otpState.isOtpVerified && (
              <Box display="flex" alignItems="center" gap={1} mt={2}>
                <TextField
                  fullWidth
                  id="otp"
                  name="otp"
                  label="Enter OTP"
                  value={otpState.otp}
                  onChange={(e) => setOtpState({ ...otpState, otp: e.target.value })}
                  InputProps={{
                    endAdornment: (
                      <Button
                        // variant="contained"
                        color="primary"
                        size='small'
                        onClick={handleVerifyOtp}
                        disabled={otpState.loading}
                      >
                        Verify
                      </Button>
                    ),
                  }}
                />
                {/* <Button
                  // variant="contained"
                  color="primary"
                  onClick={handleVerifyOtp}
                  disabled={otpState.loading}
                >
                  Verify
                </Button> */}
              </Box>
            )}
          </Grid>

          {/* Address */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="addresses"
              label="Address"
              value={formik.values.addresses}
              onChange={formik.handleChange}
              onKeyUp={handleChange}
            />
          </Grid>
        </Grid>


        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id='standard-basic'
                type='text'
                onKeyPress={event => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault()
                  }
                }}
                name='alternateMobileNo'
                value={formik.values.alternateMobileNo ?? ''}
                onChange={formik.handleChange}
                onKeyUp={handleChange}
                label='Alt. Contact No'
                error={formik.touched.alternateMobileNo && Boolean(formik.errors.alternateMobileNo)}
                helperText={formik.touched.alternateMobileNo && formik.errors.alternateMobileNo}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id='standard-basic'
                name='alternateEmailId'
                value={formik.values.alternateEmailId ?? ''}
                onChange={formik.handleChange}
                onKeyUp={handleChange}
                label='Alt. Email id'
                error={formik.touched.alternateEmailId && Boolean(formik.errors.alternateEmailId)}
                helperText={formik.touched.alternateEmailId && formik.errors.alternateEmailId}
              />
            </FormControl>
          </Grid>
          {query.get('mode') === 'edit' ? (
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <TextField
                  id='standard-basic'
                  name='code'
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  onKeyUp={handleChange}
                  label='Code'
                  disabled
                />
              </FormControl>
            </Grid>
          ) : null}
        </Grid>

        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id='standard-basic'
                name='expectedRevenue'
                value={formik.values.expectedRevenue ?? 0}
                onChange={formik.handleChange}
                onKeyUp={handleChange}
                label='Expected Revenue'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                Lead Status
              </InputLabel>
              <Select
                labelId='demo-simple-select-label'
                label='Lead Status'
                name='leadStatus'
                value={state.prospectManagementForm.leadStatus ?? ''}
                onChange={handleChange}
              >
                {['Hot', 'Warm', 'Cold'].map((ele: any) => {
                  return (
                    <MenuItem key={ele} value={ele}>
                      {ele}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id='standard-basic'
                name='sector'
                value={formik.values.sector ?? ''}
                onChange={formik.handleChange}
                onKeyUp={handleChange}
                label='Sector'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id='standard-basic'
                name='industry'
                value={formik.values.industry ?? ''}
                onChange={formik.handleChange}
                onKeyUp={handleChange}
                label='Industry'
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                Lead Source Type
              </InputLabel>
              <Select
                labelId="lead-source-type-label"
                label="Lead Source Type"
                name="leadSourceType"
                value={state.prospectManagementForm.leadSourceType ?? ""}
                onChange={handleChange}
              >
                {["FRIEND", "INHOUSE"].map((ele) => (
                  <MenuItem key={ele} value={ele}>
                    {ele.charAt(0).toUpperCase() + ele.slice(1).toLowerCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id='standard-basic'
                name='leadSourceName'
                value={formik.values.leadSourceName ?? ''}
                onChange={formik.handleChange}
                onKeyUp={handleChange}
                label='Lead Source Name'
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button color='secondary' style={{ marginRight: '5px' }} type='submit' disabled={otpState.status !== "verified"}>
              Save
            </Button>
            <Button color='primary' onClick={handleClose} className='p-button-text'>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}
