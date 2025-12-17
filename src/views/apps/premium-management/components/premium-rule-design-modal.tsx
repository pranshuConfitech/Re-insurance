import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { useFormik } from 'formik';
import moment from 'moment';
import { Button } from 'primereact/button';
import React, { useEffect, useRef } from 'react';
import { isDayExcluded } from 'react-datepicker/dist/date_utils';
// import DateFnsUtils from '@date-io/date-fns';
import * as yup from 'yup';




const useStyles = makeStyles((theme: any) => ({
  secondaryColor: {
    color: theme?.palette?.secondary?.main,
  },
  flexGrid: {
    display: 'flex',
    alignContent: 'end',
    justifyContent: 'end',
  },
  selectEmpty: {},
  rowActionBtn: {},
  formControl: {}
}));

const validationSchema = yup.object({
  ruleName: yup.string().required('Rule name is required'),
});

function removeQuotes(value: any) {
  if (typeof value === 'string') {
    return value.replace(/'/g, '');
  }


  return value;
}

function splitConditions(conditionString: any) {
  const conditions = conditionString.split(/\s*(\|\||&&)\s*/);

  const connectors = conditions
    .map((operator: any, index: number) => {
      if (index % 2 !== 0) {
        return operator;
      }


      return null;
    })
    .filter(Boolean);

  const splitConditions = conditions
    .map((condition: any) => {
      // const parts = condition.match(/\s*([\w']+)\s*([><=!]+)\s*([\w'"]+)\s*/);
      // const parts = condition.match(/\s*([\w']+)\s*([><=!]+)\s*([^\s]+)/);
      const parts = condition.match(/\s*([\w']+)\s*([><=!]+)\s*([^\s)]+)/);

      if (parts) {
        return {
          selectedParameter: parts[1],
          selectedOperator: parts[2],
          ruleValue: parts[3],
        };
      }


      return null;
    })
    .filter(Boolean);

  return { splitConditions: splitConditions, connectors: connectors };
}

type DialogProps = {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  forProductRule: any;
  parameters?: any;
  onAdd: (param: any) => void;
  paymentFrequencies?: any;
  data: any;
  editIndex: number;
  onExitClick: () => void;
};

const PremiumRuleDesignModal = ({
  openDialog,
  setOpenDialog,
  forProductRule,
  parameters = [],
  onAdd,
  paymentFrequencies = [],
  data,
  editIndex,
  onExitClick
}: DialogProps) => {
  const initRuleObject = {
    selectedParameter: '',
    selectedOperator: '',
    ruleValue: '',
    selectedConnector: '',
    parameterDetails: { paramterComparisonTypes: [] },
  };

  const frmRef = useRef(null);

  const initialState: any = {
    rules: [{ ...initRuleObject }],
    premiumPaymentFrequencies: [{ premiumAmount: 0, premiumPaymentFrequncyId: '' }],
  };

  const [state, setState] = React.useState(initialState);

  const classes = useStyles();

  const expression = React.useMemo(() =>
    data ? data[editIndex]?.expression : '',
    [data, editIndex]
  );

  const conditions = React.useMemo(() =>
    expression ? splitConditions(expression) : null,
    [expression]
  );

  // Initialize formik with proper initial values
  const formik = useFormik({
    initialValues: {
      ruleTextArea: '',
      ruleName: data ? data[editIndex]?.name : '',
      coverType: data ? data[editIndex]?.coverType : 'PER_MEMBER',
      validFrom: data && data[editIndex]?.validFrom ? moment.unix(data[editIndex]?.validFrom)?.toLocaleString() : new Date(),
      validUpTo: data && data[editIndex]?.validUpTo ? moment.unix(data[editIndex]?.validUpTo)?.toLocaleString() : null,
    },
    validationSchema: validationSchema,
    onSubmit: (values, formActions) => {
      const expression = ruleTextstring(values);

      if (!expression) {
        return;
      }

      if (!state?.premiumPaymentFrequencies || state?.premiumPaymentFrequencies?.length === 0) {
        return;
      }

      const payload: any = {
        name: values.ruleName,
        expression: expression,
        coverType: values.coverType,
        validFrom: moment(values.validFrom).unix(),
        validUpTo: moment(values.validUpTo).unix(),
        premiumPaymentFrequencies: state.premiumPaymentFrequencies,
      };

      if (data && data[editIndex]?.id) {
        payload.id = data[editIndex]?.id;
      }

      onAdd(payload);
      formActions.resetForm();
    },
  });

  const populateForm = React.useCallback((parsedConditions: any, connectors: any) => {
    if (!parsedConditions || !connectors) return;

    const updatedRules = parsedConditions.map((condition: any, i: number) => {
      const parameter = parameters.find((item: any) => item.name === condition?.selectedParameter);
      const operator = parameter?.paramterComparisonTypes?.find((item: any) => item.symbol === condition?.selectedOperator);

      return {
        ...initRuleObject,
        selectedParameter: parameter?.id || '',
        selectedOperator: operator?.id || '',
        ruleValue: removeQuotes(condition?.ruleValue) || '',
        selectedConnector: connectors[i] || '',
        parameterDetails: parameter || { paramterComparisonTypes: [] }
      };
    });

    setState((prevState: any) => ({
      ...prevState,
      rules: updatedRules
    }));
  }, [parameters]);

  // Use effect to handle initial form population
  useEffect(() => {
    if (conditions) {
      populateForm(conditions.splitConditions, conditions.connectors);
    }
  }, [conditions, populateForm]);

  // Handle data changes
  useEffect(() => {
    if (data && data[editIndex]) {
      const newState = {
        premiumPaymentFrequencies: data[editIndex]?.premiumPaymentFrequencies || [
          { premiumAmount: 0, premiumPaymentFrequncyId: '' }
        ]
      };

      setState((prevState: any) => ({
        ...prevState,
        ...newState
      }));

      formik.setValues({
        ruleTextArea: '',
        ruleName: data[editIndex]?.name || '',
        coverType: data[editIndex]?.coverType || 'PER_MEMBER',
        validFrom: data[editIndex]?.validFrom ? moment.unix(data[editIndex]?.validFrom)?.toLocaleString() : new Date(),
        validUpTo: data[editIndex]?.validUpTo ? moment.unix(data[editIndex]?.validUpTo)?.toLocaleString() : null,
      });
    }
  }, [data, editIndex]);

  const handleChangeParameter = React.useCallback(
    (idx: number) => (e: any) => {
      const { name, value } = e.target;

      setState((prevState: any) => {
        const rules = [...prevState.rules];
        const updatedRule = { ...rules[idx] };

        if (name === "selectedConnector") {
          updatedRule.selectedConnector = value;

          // update current index first
          rules[idx] = updatedRule;

          // Add new rule if it's the last one
          if (idx === prevState.rules.length - 1) {
            const newItem = { ...initRuleObject };
            newItem.selectedParameter = updatedRule.selectedParameter;
            newItem.parameterDetails = updatedRule.parameterDetails;

            return {
              ...prevState,
              rules: [...rules, newItem],
            };
          }
        }
        else if (name === "selectedParameter") {
          const selectedParam = parameters.find((item: any) => item.id === value);
          updatedRule.parameterDetails =
            selectedParam || { paramterComparisonTypes: [] };
          updatedRule.selectedParameter = value;
          updatedRule.selectedOperator = "";
          updatedRule.ruleValue = "";
        } else if (name === "selectedOperator") {
          updatedRule.selectedOperator = value;
        } else if (name === "ruleValue") {
          updatedRule.ruleValue = value;
        }
        console.log("1111", updatedRule, value)
        rules[idx] = updatedRule;
        return { ...prevState, rules };
      });
    },
    [parameters]
  );


  // Memoize the Select components to prevent unnecessary re-renders
  const renderParameterSelect = React.useCallback((item: any, idx: number) => (
    <FormControl fullWidth margin="dense">
      <InputLabel id="select-parameter-label">Select Parameter</InputLabel>
      <Select
        name="selectedParameter"
        value={item.selectedParameter ?? ''}
        onChange={handleChangeParameter(idx)}
        displayEmpty
        className={classes.selectEmpty}
        inputProps={{ 'aria-label': 'Without label' }}
      >
        {parameters?.map((p: { id: string | number; name: string }) => (
          <MenuItem value={p.id} key={p.id}>
            {p.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ), [parameters, handleChangeParameter, classes.selectEmpty]);

  const renderOperatorSelect = React.useCallback((item: any, idx: number) => (
    <FormControl fullWidth margin="dense">
      <InputLabel id="select-operator-label">Operator</InputLabel>
      <Select
        name="selectedOperator"
        value={item.selectedOperator ?? ''}
        onChange={handleChangeParameter(idx)}
        displayEmpty
        className={classes.selectEmpty}
        inputProps={{ 'aria-label': 'Without label' }}
      >
        {item.parameterDetails?.paramterComparisonTypes?.map((p: any) => (
          <MenuItem key={p.id} value={p.id} disabled={p.disabled}>
            {p.symbol}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ), [handleChangeParameter, classes.selectEmpty]);

  const handleClose = () => {
    setState(initialState);
    formik.resetForm();
    onExitClick();
    setOpenDialog(false);
  };

  //   const getParameterTypeByID = id => {
  //     if (!id) return;

  // return parameters?.filter(( item:any )=> item.id === id)[0].name;
  //   };

  const buildMenuForDropdownRange = (paramDetails: any) => {
    const menuList = [];

    for (let idx = paramDetails.start; idx <= paramDetails.end; idx += paramDetails.count) {
      menuList.push(<MenuItem value={idx}>{idx}</MenuItem>);
    }

    return menuList;
  };

  const handleAddMore = (ruleList: any, idx: any, value?: any) => {
    if (idx === state.rules.length - 1) {
      const item = { ...initRuleObject };

      /** When Select Connector changes */
      if (ruleList) {
        // item.selectedParameter = state.rules[state.rules.length - 1].selectedParameter;
        // item.parameterDetails = state.rules[state.rules.length - 1].parameterDetails;
        item.selectedParameter = ruleList[ruleList.length - 1].selectedParameter;
        item.parameterDetails = ruleList[ruleList.length - 1].parameterDetails;
        item.selectedConnector = value;


        console.log("ruleList snapshot", [...ruleList, item]);
        setState({
          ...state,
          rules: [...ruleList, item],
        });
      } else {
        /** When Add button click */
        const rules: any = [...state.rules];

        rules[idx] = {
          ...rules[idx],
          selectedConnector: '&&',
          addClicked: true,
        };

        setState({
          ...state,
          rules: [...rules, item],
        });
      }
    } else {
      setState({
        ...state,
        rules: [...ruleList],
      });
    }
  };

  const handleRemoveRow = (idx: any) => (e: any) => {
    state.rules.splice(idx, 1);
    setState({
      ...state,
      rules: state.rules,
    });
  };

  const handleAddPremiumAmt = () => {
    const premiumPaymentFrequencies = [
      ...state.premiumPaymentFrequencies,
      { premiumAmount: '', premiumPaymentFrequncyId: '' },
    ];

    setState({
      ...state,
      premiumPaymentFrequencies,
    });
  };

  const ruleTextstring = (formikValues: any) => {
    /** Rule text population */
    let populateRuleText = '';

    state.rules.map((item: any, idx: number) => {
      const op = item.parameterDetails.paramterComparisonTypes.filter((o: any) => o.id === item.selectedOperator);

      if (op.length > 0) {
        if (idx > 0 && idx < state.rules.length) {
          populateRuleText += ' ';
        }

        const findElem = state.rules.map((o: any) => o.selectedParameter === item.selectedParameter);
        const firstIdx = findElem.indexOf(true);
        const lastIdx = findElem.lastIndexOf(true);

        if (firstIdx !== lastIdx && firstIdx === idx) {
          populateRuleText += '(';
        }

        populateRuleText += `${item.parameterDetails.name}${op[0].symbol}`;

        if (
          (item.parameterDetails.paramterUiRenderType.type === 'textbox' &&
            item.parameterDetails.paramterDataType.type === 'numeric') ||
          item.parameterDetails.paramterUiRenderType.type === 'dropdown_range'
        ) {
          populateRuleText += parseInt(item.ruleValue);
        } else {
          populateRuleText += `'${item.ruleValue}'`;
        }

        if (item.isPercentage) {
          populateRuleText += `${item.selectedPercentType}${item.percentDependsOn}`;
        }

        if (firstIdx !== lastIdx && lastIdx === idx) {
          populateRuleText += ')';

          if (item.selectedConnector && idx < state.rules.length - 1) {
            populateRuleText += ` &&`;
          }
        } else if (item.selectedConnector && idx < state.rules.length - 1) {
          populateRuleText += ` ${item.selectedConnector}`;
        }
      }
    });

    return populateRuleText;
  };

  const previewRule = () => {
    const populateRuleText = ruleTextstring(formik.values);

    if (populateRuleText) {
      formik.setFieldValue('ruleTextArea', populateRuleText);
    }
  };

  // const addBtnClick = () => {
  //   frmRef.current.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  // };

  const handlePremiumInfo = (idx: any, e: any) => {
    const { name, value } = e.target;

    state.premiumPaymentFrequencies[idx][name] = value;
    setState({
      ...state,
      premiumPaymentFrequencies: state.premiumPaymentFrequencies,
    });
  };

  const handleRemovePremiumAmt = (idx: any) => (e: any) => {
    state.premiumPaymentFrequencies.splice(idx, 1);
    setState({
      ...state,
      premiumPaymentFrequencies: state.premiumPaymentFrequencies,
    });
  };
  console.log("7410", state.rules)
  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={openDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        Adding rules for - <span className={classes.secondaryColor}>{forProductRule?.name} </span>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit} noValidate ref={frmRef}>
          <Box padding={5}>
            <Grid container spacing={2}>
              {state.rules.map((item: any, idx: number) => (
                <Grid container alignItems="center" spacing={2} key={idx}>
                  {/* Select Parameter */}
                  <Grid item xs={12} sm={6} md={3}>
                    {renderParameterSelect(item, idx)}
                  </Grid>

                  {/* Operator */}
                  <Grid item xs={12} sm={6} md={3}>
                    {renderOperatorSelect(item, idx)}
                  </Grid>

                  {/* Value Input (Dynamic by type) */}
                  <Grid item xs={12} sm={6} md={3}>
                    {(() => {
                      switch (item.parameterDetails?.paramterUiRenderType?.type) {
                        case 'dropdown':
                          return (
                            <FormControl fullWidth margin="dense">
                              <InputLabel id="select-value-label">Select Value</InputLabel>
                              <Select
                                name="ruleValue"
                                value={item.ruleValue ?? ''}
                                onChange={handleChangeParameter(idx)}
                                displayEmpty
                                className={classes.selectEmpty}
                                inputProps={{ 'aria-label': 'Without label' }}>
                                {item.parameterDetails.parameterValues.map((p: any) => (
                                  <MenuItem key={p} value={p}>{p}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          );
                        case 'dropdown_range':
                          return (
                            <FormControl fullWidth margin="dense">
                              <InputLabel id="select-value-label">Select Value</InputLabel>
                              <Select
                                name="ruleValue"
                                value={item.ruleValue ?? ''}
                                onChange={handleChangeParameter(idx)}
                                displayEmpty
                                className={classes.selectEmpty}
                                inputProps={{ 'aria-label': 'Without label' }}>
                                {buildMenuForDropdownRange(item.parameterDetails)}
                              </Select>
                            </FormControl>
                          );
                        default:
                          return (
                            <FormControl fullWidth margin="dense">
                              <TextField
                                type={item.parameterDetails?.paramterDataType?.type === 'numeric' ? 'number' : 'text'}
                                name="ruleValue"
                                value={item.ruleValue ?? ''}
                                label="Value"
                                onChange={handleChangeParameter(idx)}
                              />
                            </FormControl>
                          );
                      }
                    })()}
                  </Grid>

                  {/* Connector */}
                  <Grid item xs={2}>
                    <FormControl fullWidth margin="dense">
                      <InputLabel id="select-connector-label">Connector</InputLabel>
                      <Select
                        name="selectedConnector"
                        value={item.selectedConnector ?? ''}
                        onChange={handleChangeParameter(idx)}
                        displayEmpty
                        className={classes.selectEmpty}
                        inputProps={{ 'aria-label': 'Without label' }}
                      // disabled={item?.addClicked}
                      >
                        <MenuItem value="&&">AND</MenuItem>
                        <MenuItem value="||">OR</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Add / Remove Buttons */}
                  <Grid item xs={1} className={classes.rowActionBtn}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {idx === state.rules.length - 1 && (
                        <IconButton color="primary" aria-label="add" onClick={handleAddMore.bind(this, null, idx)}>
                          <AddCircleOutlineIcon style={{ color: "#D80E51" }} />
                        </IconButton>
                      )}
                      {state.rules.length > 1 && (
                        <IconButton color="secondary" aria-label="delete" onClick={handleRemoveRow(idx)}>
                          <RemoveCircleOutlineIcon style={{ color: "rgb(255, 50, 67)" }} />
                        </IconButton>
                      )}
                    </div>
                  </Grid>
                </Grid>
              ))}
            </Grid>

          </Box>

          {/* <form onSubmit={formik.handleSubmit} noValidate ref={frmRef}> */}
          <Box padding={5}>
            <Grid container spacing={1}>
              <Grid item xs={10}>
                <FormControl fullWidth>
                  <TextField name="ruleTextArea" value={formik.values.ruleTextArea} label="Rule" disabled />
                </FormControl>
              </Grid>
              <Grid item xs={2} className={classes.flexGrid}>
                <Button onClick={previewRule} color="primary" className="p-button-outlined">
                  Preview
                </Button>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth style={{ marginTop: '20px', marginBottom: '20px' }}>
                  <TextField
                    required
                    name="ruleName"
                    value={formik.values.ruleName}
                    label="Rule Name"
                    onChange={formik.handleChange}
                    error={formik.touched.ruleName && Boolean(formik.errors.ruleName)}

                  // helperText={formik.touched.ruleName && formik.errors.ruleName}
                  />
                </FormControl>
              </Grid>

              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel id="cover-type-label">Cover type</InputLabel>
                    <Select
                      labelId="cover-type-label"
                      name="coverType"
                      value={formik.values.coverType}
                      onChange={formik.handleChange}
                      label="Cover type"  // <-- This is essential
                      inputProps={{ 'aria-label': 'Cover type' }}
                    >
                      <MenuItem value="PER_MEMBER">Per Member</MenuItem>
                      <MenuItem value="PER_FAMILY">Per Family</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>


                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Grid item xs={4}>
                    <DatePicker
                      views={["year", "month", "day"]}
                      label="Valid from"
                      value={formik.values.validFrom}
                      onChange={(val: any) => formik.setFieldValue('validFrom', val)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          margin="normal"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <DatePicker
                      views={["year", "month", "day"]}
                      label="Valid upto"
                      value={formik.values.validUpTo}
                      onChange={(val) => formik.setFieldValue('validUpTo', val)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          margin="normal"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                </LocalizationProvider>
              </Grid>

              {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid item xs={4}>
                  <KeyboardDatePicker
                    fullWidth
                    views={['year', 'month', 'date']}
                    variant="inline"
                    format="MM/dd/yyyy"
                    id="valid-from"
                    autoOk={true}
                    label="Valid from"
                    name="validFrom"
                    value={formik.values.validFrom}
                    onChange={(val:any) => {
                      formik.setFieldValue('validFrom', val);
                    }}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </Grid>

                <Grid item xs={4}>
                  <KeyboardDatePicker
                    fullWidth
                    views={['year', 'month', 'date']}
                    variant="inline"
                    format="MM/dd/yyyy"
                    id="valid-upto"
                    autoOk={true}
                    label="Valid upto"
                    name="validUpTo"
                    value={formik.values.validUpTo}
                    onChange={val => {
                      formik.setFieldValue('validUpTo', val);
                    }}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider> */}
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '30px' }}>
              <h4>Payment Frequencies</h4>
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '5px', paddingBottom: '20px' }}>
              <Divider variant="fullWidth"></Divider>
            </Grid>

            {state.premiumPaymentFrequencies?.map((item: any, id: any) => (
              <Grid item xs={12} key={id} container spacing={1}>
                <Grid item xs={5}>
                  <FormControl className={classes.formControl} fullWidth>
                    <TextField
                      name="premiumAmount"
                      type={'number'}
                      label="Premium Amount"
                      value={item.premiumAmount}
                      onChange={e => handlePremiumInfo(id, e)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={5}>
                  <FormControl className={classes.formControl} fullWidth>
                    <InputLabel id="select-search-by-label">Payment Frequency</InputLabel>
                    <Select
                      name="premiumPaymentFrequncyId"
                      displayEmpty
                      className={classes.selectEmpty}
                      inputProps={{ 'aria-label': 'Without label' }}
                      value={item.premiumPaymentFrequncyId}
                      onChange={e => handlePremiumInfo(id, e)}>
                      {paymentFrequencies?.map((freq: any) => (
                        <MenuItem key={freq.code} value={freq.id}>
                          {freq.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2} >
                  {state.premiumPaymentFrequencies.length > 1 && (
                    <Box>
                      <IconButton color="primary" aria-label="add" onClick={handleRemovePremiumAmt(id)}>
                        <RemoveCircleIcon style={{ color: "rgb(255, 50, 67)" }} />
                      </IconButton>
                    </Box>
                  )}
                  {id === state.premiumPaymentFrequencies.length - 1 && (
                    <Box>
                      <IconButton color="primary" aria-label="add" onClick={handleAddPremiumAmt}>
                        <LibraryAddIcon style={{ color: "#D80E51" }} />
                      </IconButton>
                    </Box>
                  )}
                </Grid>
              </Grid>
            ))}
          </Box>
          {/* <DialogActions> */}
          <Box display={"flex"} justifyContent={"flex-end"}>
            <Button type="submit" color="primary">
              {/* <Button onClick={onSubmit} color="primary" variant="contained"> */}
              Add
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus className="p-button-text">
              Exit
            </Button>
          </Box>
          {/* </DialogActions> */}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumRuleDesignModal;
