import * as React from 'react';
import { useEffect } from 'react';

import type { AlertProps} from '@mui/material';
import { FormControl, InputLabel, Select } from '@mui/material';
import Box from '@mui/material/Box';
import { Button } from 'primereact/button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert from '@mui/lab/Alert';
import MenuItem from '@mui/material/MenuItem';
import { makeStyles } from '@mui/styles';

import 'date-fns';

const useStyles = makeStyles((theme:any) => ({
  formControl: {
    margin: theme?.spacing?theme.spacing(1):"8px",
    width: '90%',
  },
}));

export default function AccountDetailsStepCompoent(props:any) {
  const { clientDetail } = props;
  const classes = useStyles();

  const [bankList, setBankList]:any = React.useState([
    {
      bankAccountHolderName: '',
      bankAccountNo: '',
      branchCode: '',
      branchName: '',
      accountNo: '',
    },
  ]);

  const [errorMsg, setErrorMsg] = React.useState(false);

  useEffect(() => {
    setBankList(props.bankList);
  }, [props.bankList]);

  const handleSubmitThree = (event:any) => {
    let allOk = true;

    bankList.forEach((el:any) => {
      if (el.branchCode && !/^[a-zA-Z0-9]+$/i.test(el.branchCode)) {
        setErrorMsg(true);
        allOk = false;
        
return;
      }

      if (el.accountNo && !/^[a-zA-Z0-9]+$/i.test(el.accountNo)) {
        setErrorMsg(true);
        allOk = false;
        
return;
      }

      if (el.bankAccountNo && !/^[a-zA-Z0-9\s]+$/i.test(el.bankAccountNo)) {
        setErrorMsg(true);
        allOk = false;
        
return;
      }

      if (el.branchName && !/^[a-zA-Z0-9\s]+$/i.test(el.branchName)) {
        setErrorMsg(true);
        allOk = false;
        
return;
      }
    });

    if (allOk) {
      const payLoadThree = {
        clientAccount: {
          accountDetails: bankList,
          amlRiskCategory: clientDetail.amlRiskCategory,
        },
      };

      props.handleSubmitStepThree(payLoadThree);
    }
  };

  const handleChange = (event:any) => {
    const { name, value } = event.target;

    const setClientDetail = (e:any) => {
      props.setClientDetail(e);
    };

    setClientDetail({
      ...clientDetail,
      [name]: value,
    });
  };

  // Bank List functions
  const handleInputChangeBank = (e: any, index: number) => {
    const { name, value } = e.target;

    const list = [...bankList];

    list[index][name] = value;
    setBankList(list);
  
  };

  const handleRemoveClickBank = (index: number) => {
    const list = [...bankList];

    list.splice(index, 1);
    setBankList(list);
  };

  const handleAddClickBank = () => {
    setBankList([
      ...bankList,
      {
        bankAccountHolderName: '',
        bankAccountNo: '',
        branchCode: '',
        branchName: '',
        accountNo: '',
      },
    ]);
  };

  const handleClose = (e: any) => {
    props.handleClose(e);
  };

  const handleErrorCheckClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setErrorMsg(false);
  };

  function Alert(props: React.JSX.IntrinsicAttributes & AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  return (
    <Paper elevation={0}>
      <Box p={3} my={2}>
        <Snackbar open={errorMsg} autoHideDuration={3000} onClose={handleErrorCheckClose}>
          <Alert onClose={handleErrorCheckClose} severity="error">
            Please enter a valid bank details (Only alphanumeric allowed)
          </Alert>
        </Snackbar>
        <form onSubmit={handleSubmitThree}>
          {bankList.map((x:any, i:number) => {
            return (
              <Grid key={`bankList-${i}`} container spacing={3} style={{ marginBottom: '20px', marginTop: '30px' }}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      style={{ minWidth: 220 }}
                      id="standard-basic"
                      onInput={(e:any) => {
                        e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      }}
                      name="bankAccountHolderName"
                      value={x.bankAccountHolderName}
                      onChange={e => handleInputChangeBank(e, i)}
                      label="Account Holder Name"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      id="standard-basic"
                      name="bankAccountNo"
                      value={x.bankAccountNo}
                      onInput={(e:any) => {
                        e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      }}
                      onChange={e => handleInputChangeBank(e, i)}
                      label="Bank Name"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      id="standard-basic"
                      name="branchCode"
                      type='number'
                      value={x.branchCode}
                      onChange={e => handleInputChangeBank(e, i)}
                      label="Branch Code"
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      id="standard-basic"
                      name="branchName"
                      onInput={(e:any) => {
                        e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      }}
                      value={x.branchName}
                      onChange={e => handleInputChangeBank(e, i)}
                      label="Branch Name"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      id="standard-basic"
                      name="accountNo"
                      type='number'

                      value={x.accountNo}
                      onChange={e => handleInputChangeBank(e, i)}
                      label="Account No"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                  {bankList.length !== 1 && (
                    <Button
                      className="mr10 p-button-danger"
                      onClick={() => handleRemoveClickBank(i)}
                      color="secondary"
                      style={{ marginRight: '5px' }}>
                      <DeleteIcon />
                    </Button>
                  )}
                  {bankList.length - 1 === i && (
                    <Button  color="primary" onClick={handleAddClickBank}>
                      <AddIcon />
                    </Button>
                  )}
                </Grid>
              </Grid>
            );
          })}

          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label" style={{ marginBottom: '0px' }}>
                  AML Risk Category
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="standard-basic"
                  label="AML Risk Category"
                  value={clientDetail.amlRiskCategory}
                  onChange={handleChange}
                  name="amlRiskCategory">
                  <MenuItem value={'high'}>{'High'}</MenuItem>
                  <MenuItem value={'medium'}>{'Medium'}</MenuItem>
                  <MenuItem value={'low'}>{'Low'}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={3} style={{ marginTop: '20px' }}>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button color="secondary" style={{ marginRight: '5px' }} onClick={handleSubmitThree}>
                Save
              </Button>
              <Button color="primary" onClick={handleClose} className='p-button-text'>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Paper>
  );
}
