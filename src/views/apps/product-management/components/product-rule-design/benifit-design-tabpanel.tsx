import React from 'react';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button } from 'primereact/button';

import BenifitDesignRuleTable from './benifit-design-rule-table';


import { FettleRulePreviewGraph } from '@/views/apps/shared-component/components/fettle.rule.preview.graph';

const validationSchema = yup.object({
  ruleName: yup.string().required('Rule name is required'),
});

const useStyles = makeStyles((theme: any) => ({
  mainBenifitLabel: {
    fontSize: 14,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '10px 0',
  },
  mainBenifitsContent: {
    backgroundColor: theme?.palette?.primary?.light || '#D80E51' /* "#aceae8" */,
    minHeight: 300,
    padding: 10,
    borderRadius: 14,
  },
  prospectImportRadioGroup: {
    flexWrap: 'nowrap',
    '& label': {
      flexDirection: 'row',
    },
  },
  formControl: {
    margin: theme?.spacing ? theme.spacing(1) : '8px',
    width: '100%',
  },
  rowActionBtn: {
    display: 'flex',
    alignItems: 'center',
  },
  actionBtn: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  selectEmpty: {}
}));

const initRuleObject: any = {
  selectedParameter: '',
  selectedOperator: '',
  ruleValue: '',
  isPercentage: false,
  selectedPercentType: '',
  percentDependsOn: '',
  selectedConnector: '',
  addClicked: false,
  parameterDetails: { paramterComparisonTypes: [] },
};

export default function BenefitDesignTabPanel(props: any) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  const [state, setState] = React.useState({
    rules: [{ ...initRuleObject }],
  });

  const [ruleList, setRuleList] = React.useState(props.ruleDesign);
  const [parameters, setParameters]: any = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [previewHierarchyStructure, setPreviewHierarchyStructure]: any = React.useState(false);

  /* const [selectedRule, setSelectedRule] = React.useState({}); */

  React.useEffect(() => {
    setRuleList(props.ruleDesign);
  }, [props.ruleDesign]);
  React.useEffect(() => {
    setParameters(props.benefitDetails.parameters);
  }, [props.benefitDetails]);

  const handleChange = (idx: any) => (e: any) => {
    const { name, value, checked } = e.target;
    const rules = [...state.rules];

    rules[idx] = {
      ...rules[idx],
      [name]: name === 'isPercentage' ? checked : value,
    };

    if (name === 'selectedConnector') {
      handleAddMore(rules, idx);

      return;
    }

    if (name === 'selectedParameter') {
      const selectedParam = parameters.filter((item: any) => item.id === value);

      rules[idx].parameterDetails = selectedParam[0];
    }

    setState({
      rules,
    });
  };

  const handleAddMore = (ruleList: any, idx: number) => {
    if (idx === state.rules.length - 1) {
      const item = { ...initRuleObject };

      /** When Select Connector changes */
      if (ruleList) {
        item.selectedParameter = state.rules[state.rules.length - 1].selectedParameter;
        item.parameterDetails = state.rules[state.rules.length - 1].parameterDetails;

        setState({
          rules: [...ruleList, item],
        });
      } else {
        /** When Add button click */
        const rules = [...state.rules];

        rules[idx] = {
          ...rules[idx],
          selectedConnector: '&&',
          addClicked: true,
        };

        setState({
          rules: [...rules, item],
        });
      }
    } else {
      setState({
        rules: [...ruleList],
      });
    }
  };

  const handleRemoveRow = (idx: number) => (e: any) => {
    state.rules.splice(idx, 1);
    setState({
      rules: state.rules,
    });
  };

  const setChildElementTableStatus = (benefitItems: any, searchItem: any, idx: number) => {
    if (benefitItems.child && benefitItems.child.length > 0) {
      const itemIndex = benefitItems.child.findIndex((item: any) => item.id === searchItem.id);

      if (itemIndex === -1) {
        benefitItems.child.forEach((item: any) => {
          setChildElementTableStatus(item, searchItem, idx);
        });
      } else {
        benefitItems.child[itemIndex].rules.map((item: any) => (item.selected = false));
        benefitItems.child[itemIndex].rules[idx].selected = true;
      }
    }
  };

  const onRuleCloneHandler = (rule: any, idx: number) => {
    console.log("Cloning rule in Tab panel", rule, idx);
  };

  const onRuleEdit = (rule: any, idx: number) => {
    const leftMenuList = props.leftMenuList.activeLeftMenuList;

    props.selectRule(rule);

    if (props.leftMenuList.activeLeftMenuList.length === 1) {
      props.benefitStructures[value].hirearchy.rules.map((item: any) => (item.selected = false));
      props.benefitStructures[value].hirearchy.rules[idx].selected = true;
    } else if (props.leftMenuList.activeLeftMenuList.length > 1) {
      setChildElementTableStatus(
        props.benefitStructures[value].hirearchy,
        leftMenuList[leftMenuList.length - 1].hirearchy,
        idx,
      );
    }

    props.updateBenefitStructure(props.benefitStructures);
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

        const findElem = state.rules.map(o => o.selectedParameter === item.selectedParameter);
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
            populateRuleText += ` ^`;
          }
        } else if (item.selectedConnector && idx < state.rules.length - 1) {
          populateRuleText += ` ${item.selectedConnector}`;
        }
      }
    });

    return populateRuleText;
  };

  const getChildrenListItemId = (benefitItems: any, searchItem: any) => {
    let hid = benefitItems.id;

    if (benefitItems.child && benefitItems.child.length > 0) {
      const itemIndex = benefitItems.child.findIndex((item: any) => item.id === searchItem.id);

      if (itemIndex === -1) {
        for (let i = 0; i < benefitItems.child.length; i++) {
          const item = benefitItems.child[i];

          hid = getChildrenListItemId(item, searchItem);
          if (hid) break;
        }
      } else {
        hid = benefitItems.child[itemIndex].id;

        return hid + '-item-' + (benefitItems.child[itemIndex].rules || []).length;
      }
    }

    return hid;
  };

  const addToTable = (formikValues: any) => {
    let r, ruleID;
    const leftMenuList = props.leftMenuList.activeLeftMenuList;

    if (leftMenuList.length === 1) {
      const hirearchyId = props.benefitStructures[value].hirearchy.id;

      ruleID = hirearchyId + '-root-' + ruleList.length;
    } else if (leftMenuList.length > 1) {
      ruleID = getChildrenListItemId(
        props.benefitStructures[value].hirearchy,
        leftMenuList[leftMenuList.length - 1].hirearchy,
      );

      // ruleID = hid + "-item-" + ruleList.length;
    }


    /** */
    let coverageExp = '';

    if (formikValues.coverage == 'coverage without %') {
      coverageExp = formikValues.coverageWithoutPercentVal.toString();
    }

    if (formikValues.coverage == 'coverage with %' && formikValues.coveragePercentageType == '% of') {
      coverageExp =
        formikValues.coverageWithPercentVal.toString() + ' ' + '%of' + ' ' + formikValues.coveragePercentDependsOn;
    }

    const parentInternalId =
      (leftMenuList.length - 2 > -1 && leftMenuList[leftMenuList.length - 2].selectedRule.internalId) || null;

    if (!formikValues.ruleTextArea) {
      const populateRuleText = ruleTextstring(formikValues);

      r = [
        {
          ruleTextArea: populateRuleText,
          ruleName: formikValues.ruleName,
          config: state.rules,
          internalId: ruleID,
          parentInternalId,
          coverType: formikValues.coverType,
          coverageExpression: coverageExp,
          waitingPeriod: formikValues.waitingPeriod,
          copayExpression: formikValues.copayExpression.toString() + '%',
          fundManagedBy: formikValues.fundManagedBy,
        },
      ];
    } else {
      r = [
        {
          ...formikValues,
          config: state.rules,
          internalId: ruleID,
          parentInternalId,
          coverType: formikValues.coverType,
          coverageExpression: coverageExp,
          waitingPeriod: formikValues.waitingPeriod,
          copayExpression: formikValues.copayExpression.toString() + '%',
          fundManagedBy: formikValues.fundManagedBy,
        },
      ];
    }

    const latestRules = [...ruleList, ...r];

    setRuleList(latestRules);
    props.updateRuleList(latestRules);
    resetRuleForm();

    if (leftMenuList.length === 1) {
      props.benefitStructures[value].hirearchy.rules = latestRules;
      props.benefitStructures.map((item: any) => (item.hirearchy.selected = false));
      props.benefitStructures[value].hirearchy.selected = true;
    } else if (leftMenuList.length > 1) {
      if (props.benefitStructures[value].hirearchy.child && props.benefitStructures[value].hirearchy.child.length > 0) {
        setBenefitChildren(
          props.benefitStructures[value].hirearchy,
          leftMenuList[leftMenuList.length - 1].hirearchy,
          latestRules,
        );
      }
    }

    props.updateBenefitStructure(props.benefitStructures);
  };

  const setBenefitChildren = (benefitItems: any, searchItem: any, latestRules: any) => {
    if (benefitItems.child && benefitItems.child.length > 0) {
      const itemIndex = benefitItems.child.findIndex((item: any) => item.id === searchItem.id);

      if (itemIndex === -1) {
        benefitItems.child.forEach((item: any) => {
          setBenefitChildren(item, searchItem, latestRules);
        });
      } else {
        // benefitItems.child[itemIndex].rules = [...benefitItems.child[itemIndex].rules || [], ...latestRules];
        benefitItems.child[itemIndex].rules = [...latestRules];
        benefitItems.child.map((item: any) => (item.selected = false));
        benefitItems.child[itemIndex].selected = true;
      }
    }
  };

  const previewRule = () => {
    const populateRuleText = ruleTextstring(formik.values);

    if (populateRuleText) {
      formik.setFieldValue('ruleTextArea', populateRuleText);
    }
  };

  const resetRuleForm = () => {
    setState({
      rules: [{ ...initRuleObject }],
    });

    formik.resetForm();
  };

  const saveRule = () => {
    props.saveRule();
  };

  const applyDeleteReference = (hierarchy: any, internalId: any) => {
    if (hierarchy.child && hierarchy.child.length > 0) {
      hierarchy.child.forEach((childObj: any) => {
        if (childObj.rules && childObj.rules.length > 0) {
          const childRuleIndex = childObj.rules.findIndex((rule: any) => rule.parentInternalId === internalId);

          if (childRuleIndex > -1) {
            applyDeleteReference(childObj, childObj.rules[childRuleIndex].internalId);

            childObj.rules.splice(childRuleIndex, 1);
          }
        }
      });
    }
  };

  const traverseChild = (benefit: any, internalId: any) => {
    if (benefit.rules && benefit.rules.length > 0) {
      const ruleIndex = benefit.rules.findIndex((item: any) => item.internalId === internalId);

      if (ruleIndex > -1) {
        applyDeleteReference(benefit, internalId);
        benefit.rules.splice(ruleIndex, 1);
      } else {
        if (benefit.child && benefit.child.length > 0) {
          benefit.child.forEach((item: any) => {
            traverseChild(item, internalId);
          });
        }
      }
    }
  };

  const deleteTableRuleFnc = (row: any, idx: number) => {
    const benefitHierarchy = props.benefitStructures[value].hirearchy;

    traverseChild(benefitHierarchy, row.internalId);

    props.updateBenefitStructure(props.benefitStructures);
  };

  const getParameterTypeByID = (id: any) => {
    if (!id) return;

    return parameters.filter((item: any) => item.id === id)[0].name;
  };

  const buildMenuForDropdownRange = (paramDetails: any) => {
    const menuList = [];

    for (let idx = paramDetails.start; idx <= paramDetails.end; idx += paramDetails.count) {
      menuList.push(<MenuItem value={idx}>{idx}</MenuItem>);
    }

    return menuList;
  };

  const previewHierarchy = () => {
    const hierarchyObj: any = [];
    const benefitStructure = props.benefitStructures[value];

    buildRuleHierarchy(benefitStructure.hirearchy, hierarchyObj);
    setPreviewHierarchyStructure(hierarchyObj);
    setOpenDialog(true);
  };

  const buildRuleHierarchy = (benefitStructure: any, newHierarchy: any) => {
    if (benefitStructure.rules && benefitStructure.rules.length > 0) {
      benefitStructure.rules.map((item: any, idx: number) => {
        newHierarchy[idx] = item;
        newHierarchy[idx].benefitName = benefitStructure.name;
        newHierarchy[idx].child = [];

        if (benefitStructure.child && benefitStructure.child.length > 0) {
          benefitStructure.child.forEach((childItem: any) => {
            if (childItem.rules && childItem.rules.length > 0) {
              const childRuleList = childItem.rules.filter((rule: any) => rule.parentInternalId === item.internalId);

              if (childRuleList.length > 0) {
                newHierarchy[idx].child.push(...childRuleList);
              }
            }

            buildRuleHierarchy(childItem, []);
          });
        }
      });
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const formik = useFormik({
    initialValues: {
      ruleTextArea: '',
      ruleName: '',
      coverType: '',
      coverage: 'coverage without %',
      coverageWithPercentVal: 1,
      coveragePercentageType: '',
      coveragePercentDependsOn: '',
      coverageWithoutPercentVal: 0,
      waitingPeriod: 0,
      copayExpression: 0,
      fundManagedBy: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      addToTable(values);
    },
  });

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`main-benifit-tabpanel-${index}`}
      aria-labelledby={`main-benifit-tab-${index}`}
      {...other}>
      {value === index && (
        <Box>
          <div className={classes.mainBenifitLabel}>
            <span>
              Benefit Design for <strong>{children}</strong>
            </span>
            <Button onClick={previewHierarchy} color="primary" type="button">
              Preview Hierarchy
            </Button>
          </div>
          <div className={classes.mainBenifitsContent}>
            {state.rules.map((item, idx) => (
              <Grid container spacing={3} key={`grid-${idx}`}>
                <Grid item xs={2}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="select-parameter-label">Select Parameter</InputLabel>
                    <Select label="Select Parameter"
                      name="selectedParameter"
                      value={state.rules[idx].selectedParameter ?? ''}
                      onChange={handleChange(idx)}
                      displayEmpty
                      className={classes.selectEmpty}
                      inputProps={{ 'aria-label': 'Without label' }}>
                      {parameters && parameters.map((item: any) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={1}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="select-operator-label">Operator</InputLabel>
                    <Select label="Operator"
                      name="selectedOperator"
                      value={state.rules[idx].selectedOperator ?? ''}
                      onChange={handleChange(idx)}
                      displayEmpty
                      className={classes.selectEmpty}
                      inputProps={{ 'aria-label': 'Without label' }}>
                      {state.rules[idx].parameterDetails?.paramterComparisonTypes.map((item: any) => (
                        <MenuItem value={item.id} disabled={item.disabled} key={item.id}>
                          {item.symbol}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={2}>
                  {(() => {
                    switch (state.rules[idx].parameterDetails.paramterUiRenderType?.type) {
                      case 'dropdown':
                        return (
                          <FormControl className={classes.formControl}>
                            <InputLabel id="select-value-label">Select Value</InputLabel>
                            <Select label="Select Value"
                              name="ruleValue"
                              value={state.rules[idx].ruleValue ?? ''}
                              onChange={handleChange(idx)}
                              displayEmpty
                              className={classes.selectEmpty}
                              inputProps={{ 'aria-label': 'Without label' }}>
                              {state.rules[idx].parameterDetails.parameterValues.map((item: any) => (
                                <MenuItem key={item} value={item}>{item}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        );
                      case 'dropdown_range':
                        return (
                          <FormControl className={classes.formControl}>
                            <InputLabel id="select-value-label">Select Value</InputLabel>
                            <Select label="Select Value"
                              name="ruleValue"
                              value={state.rules[idx].ruleValue ?? ''}
                              onChange={handleChange(idx)}
                              displayEmpty
                              className={classes.selectEmpty}
                              inputProps={{ 'aria-label': 'Without label' }}>
                              {buildMenuForDropdownRange(state.rules[idx].parameterDetails)}
                            </Select>
                          </FormControl>
                        );
                      default:
                        return (
                          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <FormControl className={classes.formControl}>
                              <TextField
                                type={
                                  state.rules[idx].parameterDetails?.paramterDataType?.type === 'numeric' ? 'number' : 'text'
                                }
                                name="ruleValue"
                                value={state.rules[idx].ruleValue ?? ''}
                                label="Value"
                                onChange={handleChange(idx)}
                              />
                            </FormControl>
                            {getParameterTypeByID(state.rules[idx].selectedParameter) == 'Coverage' && (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={state.rules[idx].isPercentage}
                                    name="isPercentage"
                                    color="primary"
                                    onChange={handleChange(idx)}
                                  />
                                }
                                label="%"
                              />
                            )}
                          </div>
                        );
                    }
                  })()}
                </Grid>

                {state.rules[idx].isPercentage && (
                  <Grid item xs={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="select-percenttype-label">Select</InputLabel>
                      <Select label="Select"
                        name="selectedPercentType"
                        value={state.rules[idx].selectedPercentType ?? ''}
                        onChange={handleChange(idx)}
                        displayEmpty
                        className={classes.selectEmpty}
                        inputProps={{ 'aria-label': 'Without label' }}>
                        <MenuItem value="%">%</MenuItem>
                        {props.leftMenuList.actualLeftMenuList.length > 1 && <MenuItem value="% of ">% of</MenuItem>}
                      </Select>
                    </FormControl>
                    {state.rules[idx].selectedPercentType == '% of ' && (
                      <FormControl className={classes.formControl}>
                        <InputLabel id="select-percenttype-label">Parameter</InputLabel>
                        <Select label="Parameter"
                          name="percentDependsOn"
                          value={state.rules[idx].percentDependsOn ?? ''}
                          onChange={handleChange(idx)}
                          displayEmpty
                          className={classes.selectEmpty}
                          inputProps={{ 'aria-label': 'Without label' }}>
                          {props.leftMenuList.actualLeftMenuList.map((item: any, idx: number) => {
                            if (idx < props.leftMenuList.actualLeftMenuList.length - 1) {
                              return <MenuItem key={item.hirearchy.name} value={item.hirearchy.name}>{item.hirearchy.name}</MenuItem>;
                            }
                          })}
                        </Select>
                      </FormControl>
                    )}
                  </Grid>
                )}

                <Grid item xs={2}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="select-connector-label">Select Connector</InputLabel>
                    <Select label="Select Connector"
                      name="selectedConnector"
                      value={state.rules[idx].selectedConnector ?? ''}
                      onChange={handleChange(idx)}
                      displayEmpty
                      className={classes.selectEmpty}
                      inputProps={{ 'aria-label': 'Without label' }}
                      disabled={state.rules[idx]?.addClicked}>
                      <MenuItem value="&&">AND</MenuItem>
                      <MenuItem value="||">OR</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={2} className={classes.rowActionBtn}>
                  {idx === state.rules.length - 1 && (
                    <Box>
                      <IconButton color="primary" aria-label="add" onClick={() => handleAddMore(null, idx)}>
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </Box>
                  )}
                  {state.rules.length > 1 && (
                    <Box>
                      <IconButton color="secondary" aria-label="delete" onClick={handleRemoveRow(idx)}>
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </Box>
                  )}
                </Grid>
              </Grid>
            ))}

            <form onSubmit={formik.handleSubmit} noValidate>
              <Paper elevation={0}>
                <Box p={3} my={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <FormControl className={classes.formControl}>
                        <TextField name="ruleTextArea" value={formik.values.ruleTextArea} label="Rule Text Area" disabled />
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          required
                          name="ruleName"
                          value={formik.values.ruleName}
                          label="Rule Name"
                          onChange={formik.handleChange}
                          error={formik.touched.ruleName && Boolean(formik.errors.ruleName)}
                          helperText={formik.touched.ruleName && formik.errors.ruleName}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={4}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          type="number"
                          name="waitingPeriod"
                          value={formik.values.waitingPeriod}
                          label="Waiting Period"
                          onChange={formik.handleChange}

                        // error={formik.touched.ruleName && Boolean(formik.errors.ruleName)}
                        // helperText={formik.touched.ruleName && formik.errors.ruleName}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          type="number"
                          name="copayExpression"
                          value={formik.values.copayExpression}
                          label="Co-pay(%)"
                          onChange={formik.handleChange}

                        // error={formik.touched.ruleName && Boolean(formik.errors.ruleName)}
                        // helperText={formik.touched.ruleName && formik.errors.ruleName}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl className={classes.formControl}>
                        <InputLabel id="select-connector-label">Fund Managed</InputLabel>
                        <Select label="Fund Managed"
                          name="fundManagedBy"
                          value={formik.values.fundManagedBy}
                          onChange={formik.handleChange}

                          // className={classes.selectEmpty}
                          inputProps={{ 'aria-label': 'Without label' }}

                        // disabled={state.rules[idx]?.addClicked}
                        >
                          <MenuItem value="INSURED">INSURED</MenuItem>
                          <MenuItem value="FUNDED">FUNDED</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={4}>
                      <FormControl className={classes.formControl}>
                        <InputLabel id="select-connector-label">Cover type</InputLabel>
                        <Select label="Cover type"
                          name="coverType"
                          value={formik.values.coverType}
                          onChange={formik.handleChange}

                          // className={classes.selectEmpty}
                          inputProps={{ 'aria-label': 'Without label' }}

                        // disabled={state.rules[idx]?.addClicked}
                        >
                          <MenuItem value="Per Member">Per Member</MenuItem>
                          <MenuItem value="Per Family">Per Family</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Coverage</FormLabel>
                        <RadioGroup
                          aria-label="clientimport"
                          name="coverage"
                          value={formik.values.coverage}
                          onChange={formik.handleChange}
                          row
                          className={classes.prospectImportRadioGroup}>
                          <FormControlLabel value="coverage without %" control={<Radio />} label="Coverage" />
                          <FormControlLabel
                            disabled={
                              props.leftMenuList.actualLeftMenuList.length == 1 ||
                              props.leftMenuList.actualLeftMenuList.length < 1
                            }
                            value="coverage with %"
                            control={<Radio />}
                            label="Coverage with %"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item xs={3}>
                      {formik.values.coverage == 'coverage without %' && (
                        <FormControl className={classes.formControl}>
                          <TextField
                            type="number"
                            name="coverageWithoutPercentVal"
                            value={formik.values.coverageWithoutPercentVal}
                            label="Coverage amount"
                            onChange={formik.handleChange}

                          // error={formik.touched.ruleName && Boolean(formik.errors.ruleName)}
                          // helperText={formik.touched.ruleName && formik.errors.ruleName}
                          />
                        </FormControl>
                      )}
                      {formik.values.coverage == 'coverage with %' && props.leftMenuList.actualLeftMenuList.length > 1 && (
                        <FormControl className={classes.formControl}>
                          <TextField
                            type="number"
                            name="coverageWithPercentVal"
                            value={formik.values.coverageWithPercentVal}
                            label="Percentage value"
                            InputProps={{ inputProps: { min: 0, max: 10 } }}
                            onChange={formik.handleChange}

                          // error={formik.touched.ruleName && Boolean(formik.errors.ruleName)}
                          // helperText={formik.touched.ruleName && formik.errors.ruleName}
                          />
                        </FormControl>
                      )}
                    </Grid>
                    <Grid item xs={3}>
                      {formik.values.coverage == 'coverage with %' && props.leftMenuList.actualLeftMenuList.length > 1 && (
                        <FormControl className={classes.formControl}>
                          <InputLabel id="select-connector-label">Percentage type*</InputLabel>
                          <Select label="Percentage type"
                            name="coveragePercentageType"
                            value={formik.values.coveragePercentageType}
                            onChange={formik.handleChange}

                          // className={classes.selectEmpty}
                          // inputProps={{ "aria-label": "Without label" }}
                          // disabled={state.rules[idx]?.addClicked}
                          >
                            <MenuItem value="% of">% of</MenuItem>
                            <MenuItem value="%">%</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    </Grid>
                    <Grid item xs={3}>
                      {formik.values.coverage == 'coverage with %' &&
                        props.leftMenuList.actualLeftMenuList.length > 1 &&
                        formik.values.coveragePercentageType == '% of' && (
                          <FormControl className={classes.formControl}>
                            <InputLabel id="select-percenttype-label">Depends on</InputLabel>
                            <Select label="Depends on"
                              name="coveragePercentDependsOn"
                              value={formik.values.coveragePercentDependsOn ?? ''}
                              onChange={formik.handleChange}

                            // inputProps={{ "aria-label": "Without label" }}
                            >
                              {props.leftMenuList.actualLeftMenuList.map((item: any, idx: any) => {
                                if (idx < props.leftMenuList.actualLeftMenuList.length - 1) {
                                  return <MenuItem key={item.hirearchy.id} value={item.hirearchy.id}>{item.hirearchy.name}</MenuItem>;
                                }
                              })}
                            </Select>
                          </FormControl>
                        )}
                    </Grid>
                    <Grid item xs={3} className={classes.actionBtn}>
                      <Box>
                        <Button onClick={previewRule} color="primary" type="button">
                          Preview
                        </Button>
                      </Box>
                      <Box>
                        <Button type="submit" color="primary">
                          Add
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </form>

            {ruleList && ruleList.length > 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <BenifitDesignRuleTable
                    ruleList={ruleList}

                    // selectRule={onRuleEdit}
                    // deleteTableRule={deleteTableRuleFnc}
                    onRuleCloneHandler={onRuleCloneHandler}
                    onRuleEdit={onRuleEdit}
                    onRequestForChildRule={(rule) => console.log("Requesting child rule", rule)}
                    onRuleDelete={deleteTableRuleFnc}
                    hasChild={true}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button onClick={saveRule} color="primary" type="button">
                    Save
                  </Button>
                </Grid>
              </Grid>
            )}
          </div>
        </Box>
      )}

      <Dialog
        fullWidth
        maxWidth="lg"
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <div id="alert-dialog-description">
            {/* {JSON.stringify(props.benefitStructures[value])} */}
            {/* <FettleRulePreviewGraph benefitStructures={previewHierarchyStructure} /> */}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus className="p-button-text" type="button">
            Exit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
