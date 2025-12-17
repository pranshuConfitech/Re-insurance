// import DateFnsUtils from '@date-io/date-fns';
// import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
// import { makeStyles } from '@material-ui/styles';
// import 'date-fns';
// import { useFormik } from 'formik';
// import React, { useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import * as Yup from 'yup';
// import { ProvidersService } from '../../remote-api/api/provider-services';
// import { FettleDataGrid } from '../../shared-components';
// import sampleData from './claim.sample.data';

// const data$ = new Observable(subscriber => {
//   subscriber.next(sampleData);
// });

// const dataSource$ = () => {
//   return data$.pipe(
//     map(data => {
//       data.content = data;
//       return data;
//     })
//   );
// };

// const useStyles = makeStyles((theme) => ({
//   header: {
//     border: '1px solid rgba(0, 0, 0, 0.1)',
//     borderRadius: '10px 10px 0px 0px',
//     background: '#0edb8a',
//     padding: 20,
//     borderBottom: 'none'
//   },
//   customStyle: {
//     border: '1px solid rgba(0, 0, 0, 0.1)',
//     borderRadius: '0px 0px 10px 10px',
//     background: '#ffffff',
//     padding: 20,
//     borderTop: 'none'
//   },

//   headerText: {
//     fontSize: '16px',
//     fontWeight: 'Bold',
//     color: '#002776'
//   },
//   subheader: {
//     fontSize: '12px',
//     fontWeight: 'Bold'
//   },
//   body: {
//     fontSize: '12px',
//     fontWeight: 'Bold'
//   },
//   dropdownsContainer: {
//     display: 'flex',
//     alignItems: 'center',
//   },
//   formControl: {
//     minWidth: 182,
//   },
//   dropdown: {
//     marginLeft: theme.spacing(2),
//     '&:first-child': {
//       marginLeft: 0,
//     },
//   },
// }));

// const validationSchema = Yup.object().shape({
//   selectedDate: Yup.date().nullable().required('Date is required'),
//   selectedProvider: Yup.string().required('Provider is required'),
// });

// const ViewPolicyHistory = (props) => {
//   const classes = useStyles();
//   const history = useHistory();
//   const providerService = new ProvidersService();

//   const [providerList, setProviderList] = useState([]);
//   const [showDataGrid, setShowDataGrid] = useState(false);

//   const formik = useFormik({
//     initialValues: {
//       selectedDate: new Date(),
//       selectedProvider: 'p1'
//     },
//     validationSchema: validationSchema,
//     onSubmit: values => {
//       submitHandler(values);
//     },
//   });

//   const handleMembershipClick = (rowData, field) => {

//     if (field === 'membershipNo' || 'claimNo') {
//       const membershipNo = rowData.membershipNo;
//       history.push(`/claims/claims-to-be-processed/${membershipNo}`);
//     }
//   };

//   const columnsDefinations = [
//     { field: 'serial', headerName: 'SL#', style: { width: '4rem' } },
//     {
//       field: 'membershipNo',
//       headerName: 'MEMBERSHIP NO',
//       body: (rowData) => (
//         <span
//           style={{ cursor: 'pointer', textDecoration: 'underline' }}
//           onClick={() => handleMembershipClick(rowData, 'membershipNo')}
//         >
//           {rowData.membershipNo}
//         </span>
//       ),

//     },
//     {
//       field: 'claimNo',
//       headerName: 'CLAIM NO.',
//       body: (rowData) => (
//         <span
//           style={{ cursor: 'pointer', textDecoration: 'underline' }}
//           onClick={() => handleMembershipClick(rowData, 'claimNo')}
//         >
//           {rowData.membershipNo}
//         </span>
//       ),
//     },
//     { field: 'claimDateVal', headerName: 'CLAIM DATE' },
//     { field: 'admissionDateVal', headerName: 'ADMISSION DATE' },
//     { field: 'dischargeDateVal', headerName: 'DISCHARGE DATE' },
//     { field: 'claimedAmount', headerName: 'CLAIMED AMOUNT' },
//     { field: 'providerName', headerName: 'PROVIDER NAME' },
//     { field: 'billAmount', headerName: 'BILL AMOUNT' },
//   ];

//   let ps$ = providerService.getProviders();

//   const submitHandler = (values) => {
//     setShowDataGrid(true);
//   }

//   useEffect(() => {
//     const subscription = ps$.subscribe(result => {
//       const filteredProviders = result.content.filter(ele => !ele.blackListed);
//       setProviderList(filteredProviders);
//       return () => subscription.unsubscribe();
//     });
//   }, [])

//   const openEditSection = provider => {
//     history.push(`/endorsements/${provider.id}?mode=edit`);
//   };
//   const handleOpen = () => {
//     history.push('/endorsements?mode=create');
//   };
//   const handleSelectedRows = selectedClaim => {
//   }

//   const configuration = {
//     // enableSelection: true,
//     scrollHeight: '300px',
//     pageSize: 10,
//     header: {
//       enable: true,
//       text: 'CLAIMS READY TO PROCESS',
//       enableGlobalSearch: true,
//       searchText: 'Search by Claim number',
//       // onSelectionChange: handleSelectedRows,
//     },
//   };

//   return (
//     <Box>
//       <Box className={classes.header}>
//         <Typography className={classes.headerText}>VIew Policy History</Typography>
//       </Box>
//       <Box className={classes.customStyle}>
//         <form onSubmit={formik.handleSubmit}>
//           <Grid container alignItems='center' justifyContent="space-around" >
//             <Grid item>
//               <MuiPickersUtilsProvider utils={DateFnsUtils}>
//                 <KeyboardDatePicker
//                   disableToolbar
//                   variant="inline"
//                   format="MMMM/yyyy"
//                   margin="normal"
//                   id="selectedDate"
//                   label="Claims inwarded in"
//                   value={formik.values.selectedDate}
//                   name="selectedDate"
//                   onChange={date => {
//                     formik.setFieldValue('selectedDate', date);
//                   }}
//                   KeyboardButtonProps={{
//                     'aria-label': 'change date',
//                   }}
//                   views={['year', 'month']}
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                   maxDate={new Date()}
//                 />
//               </MuiPickersUtilsProvider>
//             </Grid>
//             <Grid item>
//               <FormControl className={classes.formControl}>
//                 <InputLabel id="demo-simple-select-label" >Provider</InputLabel>
//                 <Select
//                   labelId="demo-simple-select-label"
//                   id="selectedProvider"
//                   name="selectedProvider"
//                   value={formik.values.selectedProvider}
//                   onChange={e => {
//                     formik.handleChange(e)
//                   }}
//                 >
//                   {providerList.map(ele => {
//                     return (
//                       <MenuItem key={ele.id} value={ele.id}>
//                         {ele.providerBasicDetails.name}
//                       </MenuItem>
//                     );
//                   })}
//                   <MenuItem value={'p1'}>
//                     p1
//                   </MenuItem>
//                   <MenuItem value={'p2'}>
//                     p2
//                   </MenuItem>
//                 </Select>
//                 <FormHelperText>
//                   {formik.touched.selectedProvider && formik.errors.selectedProvider}
//                 </FormHelperText>
//               </FormControl>
//             </Grid>
//             <Grid item>
//               <Button variant='contained' type='submit'>Go</Button>
//             </Grid>
//           </Grid>
//         </form>

//       </Box>
//       {showDataGrid && (
//         <Grid>
//           <FettleDataGrid
//             $datasource={dataSource$}
//             columnsdefination={columnsDefinations}
//             onEdit={openEditSection}
//             config={configuration}
//           />
//         </Grid>
//       )}
//     </Box>
//   );
// };

// export default ViewPolicyHistory;
