import React, { useEffect, useRef, useState } from 'react'

import {
  Box,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { Autocomplete } from '@mui/lab'
import { useFormik } from 'formik'
import { Button } from 'primereact/button'
import { v4 as uuidv4 } from 'uuid'
import * as yup from 'yup'

import { BenefitStructureService, FundTypeService } from '@/services/remote-api/fettle-remote-api'

const useStyles = makeStyles((theme: any) => ({
  secondaryColor: {
    color: theme?.palette?.secondary?.main
  },
  flexGrid: {
    display: 'flex',
    alignContent: 'end',
    justifyContent: 'end'
  },
  prospectImportRadioGroup: {},
  selectEmpty: {},
  rowActionBtn: {}
}))

function splitConditions(conditionString: any) {
  const conditions = conditionString.split(/\s*(\|\||&&)\s*/)

  const connectors = conditions
    .map((operator: any, index: number) => {
      if (index % 2 !== 0) {
        return operator
      }

      return null
    })
    .filter(Boolean)

  const splitConditions = conditions
    .map((condition: any) => {
      const parts = condition.match(/\s*([\w']+)\s*([><=!]+)\s*([^\s)]+)/)

      if (parts) {
        return {
          selectedParameter: parts[1],
          selectedOperator: parts[2],
          ruleValue: parts[3]
        }
      }

      return null
    })
    .filter(Boolean)

  return { splitConditions: splitConditions, connectors: connectors }
}

function removeQuotes(value: any) {
  if (typeof value === 'string') {
    return value.replace(/'/g, '')
  }

  return value
}

const initRuleObject = {
  selectedParameter: '',
  selectedOperator: '',
  ruleValue: '',
  isPercentage: false,
  selectedPercentType: '',
  percentDependsOn: '',
  selectedConnector: '',
  parameterDetails: { paramterComparisonTypes: [] }
}

const initRuleSegment = () => ({ rules: [{ ...initRuleObject }], failureMessage: '' })

const validationSchema = yup.object({
  ruleName: yup.string().required('Rule name is required')
})

const benefitstructureservice = new BenefitStructureService()
const fundtypeservice = new FundTypeService()

type RuleDesignModalProps = {
  openDialog: boolean // Whether the modal is open
  setOpenDialog: (open: boolean) => void // Function to update open state
  forBenefit?: boolean // Optional flag for benefit-related logic
  benefitNav?: any // Replace `any` with the actual expected type
  mode: 'add' | 'edit' | 'clone' // 'add' | 'edit' | 'clone'
  onRuleAdd?: () => void // Function for adding rules
  onRuleCloneSave?: (values: any) => void // Function to save cloned rule
  editFormValues?: any // Replace `any` with actual form values type
  onRuleEditSave?: (values: any) => void // Function to save edited rule
  parentBenefit?: any // Replace `any` with actual expected type
}

const RuleDesignModal = ({
  openDialog,
  setOpenDialog,
  forBenefit,
  benefitNav,
  mode,
  onRuleAdd,
  onRuleCloneSave,
  editFormValues /* product rule  */,
  onRuleEditSave,
  parentBenefit,
  productBasicDetails
}: any) => {
  const classes = useStyles()
  const frmRef = useRef(null)
  const [saveButtonEnable, setSaveButtonEnable] = useState(false)
  // Initialize default values
  const getInitialFormValues = () => ({
    ruleTextArea: '',
    ruleName: '',
    coverType: 'Per Member',
    benefitId: '',
    waitingPeriod: 0,
    eventLimit: '',
    noOfDaysPerEvent: '',
    dailyLimit: '',
    coverage: 'coverage without %',
    coverageWithPercentVal: '',
    coveragePercentageType: '',
    onceInCount: '',
    onceInUnit: '',
    onceInFrequency: '',
    copayExpression: '',
    fundManagedBy: 'INSURED',
    coverageWithoutPercentVal: 0,
    fundEntries: [{ id: uuidv4(), code: '', amount: '' }],
    interventionId: '',
    coveragePercentDependsOn: ''
  })

  const getInitialRuleSegments = () => [initRuleSegment()]

  const d = editFormValues?.productRuleSegments?.length > 0 ?
    editFormValues.productRuleSegments.map((r: any) => initRuleSegment())
    : getInitialRuleSegments()

  const [state, setState] = React.useState({
    productRuleSegments: d
  })

  const [benefitInterventions, setBenefitInterventions] = useState([])
  const [selectedInterventionId, setSelectedInterventionId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fundEntries, setFundEntries] = useState([{ id: uuidv4(), code: '', amount: '' }])
  const [fundTypes, setFundTypes] = useState([])

  function rulesFromExpression(expression: string, forBenefit: any) {
    const { splitConditions: conditions, connectors } = splitConditions(expression);

    return conditions.map((condition: any, idx: number) => {
      const param = forBenefit?.parameters?.find((p: any) => p.name === condition.selectedParameter);
      const operator = param?.paramterComparisonTypes?.find(
        (op: any) => op.symbol === condition.selectedOperator
      );
      return {
        selectedParameter: param?.id ?? '',
        selectedOperator: operator?.id ?? '',
        ruleValue: removeQuotes(condition.ruleValue),
        isPercentage: false,
        selectedPercentType: '',
        percentDependsOn: '',
        selectedConnector: connectors[idx] || '',
        parameterDetails: param ?? { paramterComparisonTypes: [] }
      };
    });
  }

  useEffect(() => {
    if (openDialog && editFormValues) {
      formik.setValues({
        ruleTextArea: editFormValues?.expression || '',
        ruleName: editFormValues?.name || '',
        coverType: editFormValues?.coverType || 'Per Member',
        benefitId: editFormValues?.benefitId || '',
        waitingPeriod: editFormValues?.waitingPeriod || 0,
        eventLimit: editFormValues?.eventLimit || '',
        noOfDaysPerEvent: editFormValues?.noOfDaysPerEvent || '',
        dailyLimit: editFormValues?.dailyLimit || '',
        coverage: editFormValues?.coverage || 'coverage without %',
        coverageWithPercentVal: editFormValues?.coverageExpression?.split(' ')[0] || '',
        coveragePercentageType: editFormValues?.coverageExpression?.split(' ')[1] || '',
        onceInCount: editFormValues?.onceInCount || '',
        onceInUnit: editFormValues?.onceInUnit || '',
        onceInFrequency: editFormValues?.onceInFrequency || '',
        copayExpression: editFormValues?.copayExpression?.replace(/%/g, '') || '',
        fundManagedBy: editFormValues?.fundManagedBy || 'INSURED',
        coverageWithoutPercentVal: Number(editFormValues?.coverageExpression) || 0,
        fundEntries: editFormValues?.fundEntries || [{ id: uuidv4(), code: '', amount: '' }],
        interventionId: editFormValues?.interventionId || '',
        coveragePercentDependsOn: ''
      });
      const segmentsWithRules = editFormValues.productRuleSegments.map((segment: any) => {
        const { splitConditions: splitConds, connectors } = splitConditions(segment.expression);
        const rules = splitConds.map((condition: any, idx: number) => {
          const param = forBenefit?.parameters?.find((p: any) => p.name === condition.selectedParameter);
          const operator = param?.paramterComparisonTypes?.find(
            (op: any) => op.symbol === condition.selectedOperator
          );
          return {
            selectedParameter: param?.id ?? '',
            selectedOperator: operator?.id ?? '',
            ruleValue: removeQuotes(condition.ruleValue),
            isPercentage: false,
            selectedPercentType: '',
            percentDependsOn: '',
            selectedConnector: connectors[idx] || '',
            parameterDetails: param ?? { paramterComparisonTypes: [] }
          };
        });
        return {
          ...segment,
          rules
        };
      });

      setState({
        productRuleSegments: segmentsWithRules
      });
    } else if (openDialog && !editFormValues) {
      resetFormState();
      formik.resetForm();
    }
  }, [editFormValues, openDialog]);

  //   useEffect(() => {
  //   if (
  //     openDialog &&
  //     editFormValues?.productRuleSegments &&
  //     editFormValues.productRuleSegments.length > 0
  //   ) {
  //     // Map each segment to add rules array from its expression
  //     const segmentsWithRules = editFormValues.productRuleSegments.map((segment: any) => {
  //       const { splitConditions, connectors } = splitConditions(segment.expression);
  //       const rules = splitConditions.map((condition: any, idx: number) => {
  //         const param = forBenefit?.parameters?.find((p: any) => p.name === condition.selectedParameter);
  //         const operator = param?.paramterComparisonTypes?.find(
  //           (op: any) => op.symbol === condition.selectedOperator
  //         );
  //         return {
  //           selectedParameter: param?.id ?? '',
  //           selectedOperator: operator?.id ?? '',
  //           ruleValue: removeQuotes(condition.ruleValue),
  //           isPercentage: false,
  //           selectedPercentType: '',
  //           percentDependsOn: '',
  //           selectedConnector: connectors[idx] || '',
  //           parameterDetails: param ?? { paramterComparisonTypes: [] }
  //         };
  //       });
  //       return {
  //         ...segment,
  //         rules
  //       };
  //     });

  //     setState({
  //       productRuleSegments: segmentsWithRules
  //     });
  //   }
  // }, [openDialog, editFormValues, forBenefit]);

  // Function to reset all form state
  const resetFormState = () => {
    setSaveButtonEnable(false)
    setSelectedInterventionId(null)
    setState({ productRuleSegments: getInitialRuleSegments() })
    setFundEntries([{ id: uuidv4(), code: '', amount: '' }])
  }

  const getIntervemntions = () => {
    setLoading(true)
    const bts$ = benefitstructureservice.getBenefitInterventions(forBenefit.benefitStructureId)

    bts$.subscribe({
      next: (result: any) => {
        const temp = result.map((el: any) => ({
          ...el,
          label: el.code + ' | ' + el.name
        }))

        setBenefitInterventions(temp)
      },
      error: err => {
        setLoading(false)
      },
      complete: () => setLoading(false)
    })
  }

  const getTypes = () => {
    const fts$ = fundtypeservice.getFundTypes()

    fts$.subscribe({
      next: (result: any) => {
        setFundTypes(result.content)
      },
      error: err => {
        console.log(err)
      }
    })
  }

  useEffect(() => {
    getTypes()
  }, [])

  useEffect(() => {
    if (forBenefit) {
      getIntervemntions()
    }
  }, [])

  const onSubmit = (formikValues: any) => {
    let coverageExp: any = ''
    let coverageAmt: any = ''

    if (formikValues.coverage == 'coverage without %') {
      coverageExp = formikValues.coverageWithoutPercentVal.toString()
      coverageAmt = formikValues.coverageWithoutPercentVal.toString()
    } else if (formikValues.coverage == 'coverage with %' && formikValues.coveragePercentageType == '%of') {
      coverageAmt = parentBenefit.coverageAmount
        ? (parentBenefit?.coverageAmount * formikValues?.coverageWithPercentVal) / 100
        : formikValues.coverageWithPercentVal.toString() + ' ' + '%of' + ' ' + formikValues.coveragePercentDependsOn
      coverageExp =
        formikValues.coverageWithPercentVal.toString() + ' ' + '%of' + ' ' + formikValues.coveragePercentDependsOn
    }

    const finalFundEntries = formik.values.fundEntries.filter((entry: any) => entry.code)

    if (finalFundEntries.length > 0) {
      const totalLimit = finalFundEntries.map((f: any) => f.amount).reduce((t: any, n: any) => t + n, 0)
    }

    const r = buildProductRuleSegmentsAndRuleText(formikValues)
    const data: any = {
      internalId: !!editFormValues ? editFormValues.internalId : uuidv4(),
      interventionId: selectedInterventionId,
      name: formikValues.ruleName,
      expression: r.expression,
      benefitId: !!editFormValues ? editFormValues.benefitId : forBenefit.id,
      benefitStructureId: !!editFormValues ? editFormValues.benefitStructureId : forBenefit.benefitStructureId,
      coverageExpression: coverageExp,
      coverageAmount: coverageAmt.toString(),
      coverage: formik.values.coverage,
      eventLimit: formik.values.eventLimit,
      noOfDaysPerEvent: formik.values.noOfDaysPerEvent,
      dailyLimit: formik.values.dailyLimit,
      onceInCount: formik.values.onceInCount,
      onceInUnit: formik.values.onceInUnit,
      onceInFrequency: formik.values.onceInFrequency,
      coverType: formikValues.coverType,
      waitingPeriod: formikValues.waitingPeriod,
      copayExpression: formikValues.copayExpression && `${formikValues.copayExpression}%`,
      fundManagedBy: formikValues.fundManagedBy,
      fundEntries: finalFundEntries,
      productRuleSegments: r.productRuleSegments
    }

    if (mode === 'edit') {
      onRuleEditSave(data)
    } else if (mode === 'add') {
      onRuleAdd(data)
    } else if (mode === 'clone') {
      onRuleCloneSave(data)
    } else {
      alert("Invalid mode")
    }

    // Reset form after successful submission
    if (!editFormValues) {
      resetFormState()
      formik.resetForm()
    }
  }

  function handleChangeParameter(prsIndex: any, idx: any) {
    return (e: any) => {
      const { name, value, checked } = e.target
      if (idx == null || idx == undefined) {
        setState(prevState => {
          const productRuleSegments = [...prevState.productRuleSegments]

          productRuleSegments[prsIndex] = { ...productRuleSegments[prsIndex], [name]: value }

          return { productRuleSegments: productRuleSegments }
        })
      } else {
        setState(prevState => {
          const productRuleSegments = [...prevState.productRuleSegments]

          if (!productRuleSegments[prsIndex].rules) {
            const obj = { ...initRuleObject }

            productRuleSegments[prsIndex].rules = [obj]
          }

          productRuleSegments[prsIndex].rules[idx] = {
            ...productRuleSegments[prsIndex].rules[idx],
            [name]: name === 'isPercentage' ? checked : value
          }

          if (name === 'selectedConnector') {
            handleAddMoreRule(productRuleSegments, prsIndex, idx, prevState)
          } else if (name === 'selectedParameter') {
            const selectedParam = forBenefit.parameters.find((item: any) => item.id === value)

            productRuleSegments[prsIndex].rules[idx].parameterDetails = selectedParam
          }

          return { productRuleSegments: productRuleSegments }
        })
      }
    }
  }

  function handleAddMoreRule(ruleList: any, prsIndex: any, idx: number, preState: any) {
    const productRuleSegments = preState ? preState.productRuleSegments : state.productRuleSegments

    const prsItem = productRuleSegments[prsIndex]

    if (idx === prsItem.rules.length - 1) {
      const item = { ...initRuleObject }

      /** When Select Connector changes */
      if (ruleList) {
        item.selectedParameter = prsItem.rules[prsItem.rules.length - 1].selectedParameter
        item.parameterDetails = prsItem.rules[prsItem.rules.length - 1].parameterDetails
        prsItem.rules.push(item)
        setState({
          productRuleSegments: [...productRuleSegments]
        })
      } else {
        /** When Add button click */

        const rules = [...prsItem.rules]

        rules[idx] = {
          ...rules[idx],
          selectedConnector: '&&',
          addClicked: true
        }
        prsItem.rules.push(item)
        setState({
          productRuleSegments: [...productRuleSegments]
        })
      }
    } else {
      setState({
        productRuleSegments: [...productRuleSegments]
      })
    }
  }

  function handleAddMoreRuleSegment(prsIndex: number) {
    const productRuleSegments = state.productRuleSegments
    const item = initRuleSegment()

    productRuleSegments.splice(prsIndex + 1, 0, item)
    setState({
      productRuleSegments: [...productRuleSegments]
    })
  }

  function prepopulateRuleForm(prsIndex: any, parsedConditions: any, connectors: any) {
    for (let i = 0; i < parsedConditions.length; i++) {
      const condition = parsedConditions[i]

      handleChangeParameter(
        prsIndex,
        i
      )({
        target: {
          name: 'selectedParameter',
          value: forBenefit?.parameters?.find((item: any) => item.name == condition.selectedParameter)?.id.toString()
        }
      })
      handleChangeParameter(
        prsIndex,
        i
      )({
        target: {
          name: 'selectedOperator',
          value: forBenefit.parameters
            .find((item: any) => item.name == condition.selectedParameter)
            ?.paramterComparisonTypes.find((item: any) => item.symbol == condition.selectedOperator)
            ?.id.toString()
        }
      })
      handleChangeParameter(
        prsIndex,
        i
      )({
        target: {
          name: 'ruleValue',
          value: removeQuotes(condition.ruleValue)
        }
      })

      if (i < connectors.length) {
        handleChangeParameter(
          prsIndex,
          i
        )({
          target: {
            name: 'selectedConnector',
            value: connectors[i]
          }
        })
      }
    }
  }

  useEffect(() => {
    if (editFormValues?.productRuleSegments && editFormValues?.productRuleSegments?.length > 0) {
      editFormValues.productRuleSegments.forEach((prsItem: any, prsIndex: any) => {
        handleChangeParameter(
          prsIndex,
          0
        )({
          target: {
            name: 'failureMessage',
            value: prsItem.failureMessage
          }
        })

        setTimeout(() => {
          const conditions = splitConditions(prsItem.expression)

          prepopulateRuleForm(prsIndex, conditions.splitConditions, conditions.connectors)
        }, 300)
      })
    }
  }, [])

  const editIntialData = {
    ruleTextArea: editFormValues?.expression,
    ruleName: editFormValues?.name,
    coverType: editFormValues?.coverType,
    benefitId: editFormValues?.benefitId,
    waitingPeriod: editFormValues?.waitingPeriod,
    eventLimit: editFormValues?.eventLimit,
    noOfDaysPerEvent: editFormValues?.noOfDaysPerEvent,
    dailyLimit: editFormValues?.dailyLimit,
    coverage: editFormValues?.coverage,
    coverageWithPercentVal: editFormValues?.coverageExpression?.split(' ')[0],
    coveragePercentageType: editFormValues?.coverageExpression?.split(' ')[1],
    onceInCount: editFormValues?.onceInCount,
    onceInUnit: editFormValues?.onceInUnit,
    onceInFrequency: editFormValues?.onceInFrequency,
    copayExpression: editFormValues?.copayExpression?.replace(/%/g, ''),
    fundManagedBy: editFormValues?.fundManagedBy || 'INSURED',
    coverageWithoutPercentVal: Number(editFormValues?.coverageExpression),
    fundEntries: editFormValues?.fundEntries || [{ id: uuidv4(), code: '', amount: '' }],
    interventionId: editFormValues?.interventionId,
    coveragePercentDependsOn: ''
  }

  const mergedEditFormValues = editIntialData || {}

  const formik = useFormik({
    initialValues: editFormValues ? {
      ruleTextArea: editFormValues?.expression || '',
      ruleName: editFormValues?.name || '',
      coverType: editFormValues?.coverType || 'Per Member',
      benefitId: editFormValues?.benefitId || '',
      waitingPeriod: editFormValues?.waitingPeriod || 0,
      eventLimit: editFormValues?.eventLimit || '',
      noOfDaysPerEvent: editFormValues?.noOfDaysPerEvent || '',
      dailyLimit: editFormValues?.dailyLimit || '',
      coverage: editFormValues?.coverage || 'coverage without %',
      coverageWithPercentVal: editFormValues?.coverageExpression?.split(' ')[0] || '',
      coveragePercentageType: editFormValues?.coverageExpression?.split(' ')[1] || '',
      onceInCount: editFormValues?.onceInCount || '',
      onceInUnit: editFormValues?.onceInUnit || '',
      onceInFrequency: editFormValues?.onceInFrequency || '',
      copayExpression: editFormValues?.copayExpression?.replace(/%/g, '') || '',
      fundManagedBy: editFormValues?.fundManagedBy || 'INSURED',
      coverageWithoutPercentVal: Number(editFormValues?.coverageExpression) || 0,
      fundEntries: editFormValues?.fundEntries || [{ id: uuidv4(), code: '', amount: '' }],
      interventionId: editFormValues?.interventionId || '',
      coveragePercentDependsOn: ''
    } : getInitialFormValues(),
    validationSchema: validationSchema,
    onSubmit: values => {
      onSubmit(values)
    }
  })

  const handleClose = () => {
    // Reset form when closing
    resetFormState()
    formik.resetForm()
    setOpenDialog(false)
  }

  const getParameterTypeByID = (id: any) => {
    if (!id) return

    return forBenefit?.parameters?.filter((item: any) => item.id === id)[0].name
  }

  const buildMenuForDropdownRange = (paramDetails: any) => {
    const menuList = []

    for (let idx = paramDetails.start; idx <= paramDetails.end; idx += paramDetails.count) {
      menuList.push(<MenuItem value={idx}>{idx}</MenuItem>)
    }

    return menuList
  }

  const handleRemoveRow = (prsIndex: any, idx: number) => (e: any) => {
    const prsItem = state.productRuleSegments[prsIndex]

    prsItem.rules.splice(idx, 1)
    setState({
      productRuleSegments: [...state.productRuleSegments]
    })
  }

  const handleRemoveRuleSegmentRow = (prsIndex: any) => (e: any) => {
    state.productRuleSegments.splice(prsIndex, 1)
    setState({
      productRuleSegments: [...state.productRuleSegments]
    })
  }

  // const buildProductRuleSegmentsAndRuleText = (formikValues: any) => {
  //   console.log("123456789", state.productRuleSegments)
  //   const productRuleSegments = state.productRuleSegments.map((prsItem: any) => ({
  //     expression: ruleTextstring(prsItem),
  //     ...prsItem
  //   }))

  //   const expression = productRuleSegments
  //     .map((prsItem: any) => prsItem.expression)
  //     .filter((e: any) => !!e)
  //     .join(' && ')

  //   return { expression, productRuleSegments }
  // }

  const ruleTextstring = (prsItem: any) => {
    /** Rule text population */
    let populateRuleText = ''

    prsItem.rules.forEach((item: any, idx: number) => {
      const op = item.parameterDetails.paramterComparisonTypes.filter((o: any) => o.id === item.selectedOperator)

      if (op.length > 0) {
        if (idx > 0 && idx < prsItem.rules.length) {
          populateRuleText += ' '
        }

        const findElem = prsItem.rules.map((o: any) => o.selectedParameter === item.selectedParameter)
        const firstIdx = findElem.indexOf(true)
        const lastIdx = findElem.lastIndexOf(true)

        if (firstIdx !== lastIdx && firstIdx === idx) {
          populateRuleText += '('
        }

        populateRuleText += `${item.parameterDetails.name}${op[0].symbol}`

        if (
          (item.parameterDetails.paramterUiRenderType.type === 'textbox' &&
            item.parameterDetails.paramterDataType.type === 'numeric') ||
          item.parameterDetails.paramterUiRenderType.type === 'dropdown_range'
        ) {
          populateRuleText += parseInt(item.ruleValue)
        } else {
          populateRuleText += `'${item.ruleValue}'`
        }

        if (item.isPercentage) {
          populateRuleText += `${item.selectedPercentType}${item.percentDependsOn}`
        }

        if (firstIdx !== lastIdx && lastIdx === idx) {
          populateRuleText += ')'

          if (item.selectedConnector && idx < prsItem.rules.length - 1) {
            populateRuleText += ` ${item.selectedConnector}`
          }
        } else if (item.selectedConnector && idx < prsItem.rules.length - 1) {
          populateRuleText += ` ${item.selectedConnector}`
        }
      }
    })

    return populateRuleText
  }

  const previewRule = () => {
    // Pass the latest productRuleSegments from state
    const r = buildProductRuleSegmentsAndRuleText(formik.values, state.productRuleSegments);
    
    if (r.expression) {
      formik.setFieldValue('ruleTextArea', r.expression);
      setSaveButtonEnable(true);
    }
  };

  const buildProductRuleSegmentsAndRuleText = (formikValues: any, productRuleSegmentsArg?: any) => {
    let data = [...state.productRuleSegments];
    
    let temp: any = [];
    data.forEach((ele: any) => {
      
      let obj = {
        ...ele,
        expression: ruleTextstring(ele)
      }
      
      temp.push(obj)
    })
    
    const expression = temp
      .map((prsItem: any) => prsItem.expression)
      .filter((e: any) => !!e)
      .join(' && ');

    return { expression, productRuleSegments: temp };
  };

  const addBtnClick = () => {
    formik.handleSubmit()
  }

  const handleInterventionChange = (event: any, value: any) => {
    if (value) {
      setSelectedInterventionId(value.interventionId)
    } else {
      setSelectedInterventionId(null)
    }
  }

  const handleChangeFund = (id: any, event: any) => {
    const { name, value } = event.target
    const newFundEntries = formik.values.fundEntries.map((entry: any) =>
      entry.id === id ? { ...entry, [name]: value } : entry
    )

    formik.setFieldValue('fundEntries', newFundEntries)
  }

  const addNewFundEntry = () => {
    if (formik.values.fundEntries.length === fundTypes.length) {
      return
    }

    const newEntry = [...formik.values.fundEntries, { id: uuidv4(), code: '', amount: '' }]

    formik.setFieldValue('fundEntries', newEntry)
  }

  const removeEntry = (id: any) => {
    const delEntry = [...formik.values.fundEntries.filter((entry: any) => entry.id !== id)]

    formik.setFieldValue('fundEntries', delEntry)
  }

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!openDialog && !editFormValues) {
      // Reset when modal closes and it's not in edit mode
      resetFormState()
      formik.resetForm()
    }
  }, [openDialog])

  return (
    <Dialog
      fullWidth
      maxWidth='lg'
      open={openDialog}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>
        Adding rule for - <span className={classes.secondaryColor}>{forBenefit?.name} </span>
        <span> </span>
        {benefitNav.length > 1 && <span> ({benefitNav?.map((b: any) => b?.name).join(' / ')})</span>}
      </DialogTitle>
      <DialogContent>
        <Box padding={5}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <TextField
                  required
                  name='ruleName'
                  value={formik.values.ruleName}
                  label='Rule Name'
                  onChange={formik.handleChange}
                  error={formik.touched.ruleName && Boolean(formik.errors.ruleName)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <TextField
                  type='number'
                  name='waitingPeriod'
                  value={formik.values.waitingPeriod}
                  label='Waiting Period'
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <TextField
                  type='number'
                  name='copayExpression'
                  value={formik.values.copayExpression}
                  label='Co-pay(%)'
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {productBasicDetails.clientTypeId == 'GROUP'?
              <FormControl fullWidth>
                <InputLabel id='select-connector-label'>Fund Managed</InputLabel>
                <Select
                  label='Fund Managed'
                  name='fundManagedBy'
                  value={formik.values.fundManagedBy}
                  onChange={formik.handleChange}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value='FUNDED'>FUNDED</MenuItem>
                  <MenuItem value='INSURED'>INSURED</MenuItem>
                </Select>
              </FormControl>
              :
              <FormControl fullWidth>
              <TextField
                name='fundManagedBy'
                value={formik.values.fundManagedBy}
                label='Fund Managed'
                onChange={formik.handleChange}
                InputProps={{
                  readOnly: true
                }}
              />
            </FormControl>
              }
            </Grid>
            {/* {formik.values.fundManagedBy === "FUNDED" &&
              <Grid container item xs={12}>
                {formik.values.fundEntries.map((entry: any, rowIndex: any) => (
                  <Grid container key={entry.id} spacing={4}>
                    <Grid item xs={10} sm={6} md={3}>
                      <FormControl fullWidth>
                        <InputLabel id={`fund-select-label-${entry.code}`}>Fund Type</InputLabel>
                        <Select
                          label='Fund Type'
                          labelId={`fund-select-label-${entry.code}`}
                          value={entry.code}
                          onChange={event => handleChangeFund(entry.id, event)}
                          variant='outlined'
                          name='code'
                        >
                          {fundTypes.map((fund: any) => (
                            <MenuItem key={fund.code} value={fund.code}>
                              {fund.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={10} sm={6} md={3}>
                      <TextField
                        label='Percentage'
                        type='number'
                        variant='outlined'
                        name='amount'
                        value={entry.amount}
                        onChange={event => handleChangeFund(entry.id, event)}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={3} container spacing={9}>
                      <Grid item>
                        {formik.values.fundEntries.length > 1 && (
                          <IconButton color='secondary' aria-label='delete' onClick={() => removeEntry(entry.id)}>
                            <RemoveCircleOutlineIcon />
                          </IconButton>
                        )}
                      </Grid>
                      <Grid item>
                        {rowIndex === formik.values.fundEntries.length - 1 && (
                          <IconButton color='primary' aria-label='add' onClick={addNewFundEntry}>
                            <AddCircleOutlineIcon />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>} */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel id='select-connector-label'>Cover type</InputLabel>
                <Select
                  label='Cover type'
                  name='coverType'
                  value={formik.values.coverType}
                  onChange={formik.handleChange}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value='Per Member'>Per Member</MenuItem>
                  <MenuItem value='Per Family'>Per Family</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl component='fieldset'>
                <FormLabel component='legend'>Coverage</FormLabel>
                <RadioGroup
                  aria-label='clientimport'
                  name='coverage'
                  value={formik.values.coverage}
                  onChange={formik.handleChange}
                  row
                  className={classes.prospectImportRadioGroup}
                >
                  <FormControlLabel value='coverage without %' control={<Radio />} label='Coverage' />
                  <FormControlLabel
                    disabled={benefitNav.length == 1 || benefitNav.length < 1}
                    value='coverage with %'
                    control={<Radio />}
                    label='Coverage with %'
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              {formik.values.coverage == 'coverage without %' && (
                <FormControl fullWidth>
                  <TextField
                    type='number'
                    name='coverageWithoutPercentVal'
                    value={formik.values.coverageWithoutPercentVal}
                    label='Coverage amount'
                    onChange={formik.handleChange}
                  />
                </FormControl>
              )}
              {formik.values.coverage == 'coverage with %' && benefitNav.length > 1 && (
                <FormControl fullWidth>
                  <TextField
                    type='number'
                    name='coverageWithPercentVal'
                    value={formik.values.coverageWithPercentVal}
                    label='Percentage value'
                    InputProps={{ inputProps: { min: 0, max: 10 } }}
                    onChange={formik.handleChange}
                  />
                </FormControl>
              )}
            </Grid>

            {formik.values.coverage == 'coverage with %' && benefitNav.length > 1 && (
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel id='select-connector-label'>Percentage type*</InputLabel>
                  <Select
                    label='Percentage type'
                    name='coveragePercentageType'
                    value={formik.values.coveragePercentageType}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value='%of'>% of</MenuItem>
                    <MenuItem value='%'>%</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {formik.values.coverage == 'coverage with %' &&
              benefitNav.length > 1 &&
              formik.values.coveragePercentageType == '%of' && (
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel id='select-percenttype-label'>Depends on</InputLabel>
                    <Select
                      label='Depends on'
                      name='coveragePercentDependsOn'
                      value={formik.values.coveragePercentDependsOn ?? ''}
                      onChange={formik.handleChange}
                    >
                      {benefitNav.map((item: any, idx: number) => {
                        if (idx < benefitNav.length - 1) {
                          return (
                            <MenuItem key={item.id} value={item.id}>
                              {item.name}
                            </MenuItem>
                          )
                        }
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              )}

            <Grid item xs={12} sm={6} md={3}>
              {/* {loading ? (
                <CircularProgress />
              ) : (
                <Autocomplete
                  options={benefitInterventions}
                  getOptionLabel={(option: any) => option.label}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Select Intervention'
                      value={formik.values.interventionId ?? ''}
                      variant='outlined'
                      fullWidth
                    />
                  )}
                  onChange={handleInterventionChange}
                />
              )} */}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <TextField
                  type='number'
                  name='eventLimit'
                  value={formik.values.eventLimit}
                  label='Event Limit'
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <TextField
                  type='number'
                  name='dailyLimit'
                  value={formik.values.dailyLimit}
                  label='Daily Limit'
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <TextField
                  type='number'
                  name='noOfDaysPerEvent'
                  value={formik.values.noOfDaysPerEvent}
                  label='No of Days per Event'
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}></Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <TextField
                  type='number'
                  name='onceInFrequency'
                  value={formik.values.onceInFrequency}
                  label='Once in Frequency'
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <TextField
                  type='number'
                  name='onceInCount'
                  value={formik.values.onceInCount}
                  label='Once in Count'
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel id='select-parameter-label'>Once in Unit</InputLabel>
                <Select
                  label='Once in Unit'
                  name='onceInUnit'
                  value={formik.values.onceInUnit}
                  onChange={formik.handleChange}
                  className={classes.selectEmpty}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value='year'>Year</MenuItem>
                  <MenuItem value='month'>Month</MenuItem>
                  <MenuItem value='week'>Week</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {formik.values.onceInFrequency && formik.values.onceInUnit && formik.values.onceInCount && (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bolder' }}
              >
                {formik.values.onceInFrequency} time in {formik.values.onceInCount} {formik.values.onceInUnit}
              </Grid>
            )}
          </Grid>
        </Box>

        <Box padding={5}>
          <Grid container>
            {state.productRuleSegments.map((prsItem: any, prsIndex: any) => {
              return (
                <Box paddingTop={prsIndex > 0 ? 20 : 0} style={{ width: '100%' }} key={prsIndex}>
                  <Grid xs={12} container spacing={4} alignItems='center' justifyContent='center'>
                    <Grid xs={4}>
                      <h1>Rule Segment: {prsIndex + 1}</h1>
                    </Grid>
                    <Grid xs={8}>
                      <Grid item xs className={classes.rowActionBtn}>
                        {prsIndex === state.productRuleSegments.length - 1 && (
                          <IconButton
                            color='primary'
                            aria-label='add'
                            onClick={handleAddMoreRuleSegment.bind(this, prsIndex)}
                          >
                            <AddCircleOutlineIcon />
                          </IconButton>
                        )}
                        {state.productRuleSegments.length > 1 && (
                          <IconButton
                            color='secondary'
                            aria-label='delete'
                            onClick={handleRemoveRuleSegmentRow(prsIndex)}
                          >
                            <RemoveCircleOutlineIcon />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>

                    <Grid xs={12} container spacing={4} alignItems='center' justifyContent='center'>
                      <Grid item xs={12} style={{ paddingBottom: '35px' }}>
                        <FormControl fullWidth>
                          <TextField
                            type="text"
                            name="failureMessage"
                            value={prsItem.failureMessage ?? ''}
                            label="Failure Message"
                            onChange={(e) => {
                              const { value } = e.target;
                              setState((prevState) => {
                                const productRuleSegments = [...prevState.productRuleSegments];
                                productRuleSegments[prsIndex].failureMessage = value; // Update the failureMessage for the specific segment
                                return { productRuleSegments };
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid xs={12} container spacing={4} alignItems='center' justifyContent='center' key={prsIndex}>
                      {prsItem.rules?.map((item: any, idx: any) => {
                        return (
                          <Grid xs={12} container spacing={4} alignItems='center' justifyContent='center' key={idx}>
                            <Grid key={idx} item xs={12} sm={6} md={3}>
                              <FormControl fullWidth>
                                <InputLabel id='select-parameter-label'>Select Parameter</InputLabel>
                                <Select
                                  label='Select Parameter'
                                  name='selectedParameter'
                                  value={item.selectedParameter ?? ''}
                                  onChange={handleChangeParameter(prsIndex, idx)}
                                  displayEmpty
                                  className={classes.selectEmpty}
                                  inputProps={{ 'aria-label': 'Without label' }}
                                >
                                  {forBenefit?.parameters &&
                                    forBenefit?.parameters.map((pItem: any, index: number) => (
                                      <MenuItem key={index} value={pItem.id}>
                                        {pItem.name}
                                      </MenuItem>
                                    ))}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                              <FormControl fullWidth>
                                <InputLabel id='select-operator-label'>Operator</InputLabel>
                                <Select
                                  label='Operator'
                                  name='selectedOperator'
                                  value={item.selectedOperator ?? ''}
                                  onChange={handleChangeParameter(prsIndex, idx)}
                                  displayEmpty
                                  className={classes.selectEmpty}
                                  inputProps={{ 'aria-label': 'Without label' }}
                                >
                                  {item.parameterDetails?.paramterComparisonTypes.map((pItem: any, index: number) => (
                                    <MenuItem key={index} value={pItem.id} disabled={pItem.disabled}>
                                      {pItem.symbol}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                              {(() => {
                                switch (item?.parameterDetails?.paramterUiRenderType?.type) {
                                  case 'dropdown':
                                    return (
                                      <FormControl fullWidth>
                                        <InputLabel id='select-value-label'>Select Value</InputLabel>
                                        <Select
                                          label='Select Value'
                                          name='ruleValue'
                                          value={item.ruleValue ?? ''}
                                          onChange={handleChangeParameter(prsIndex, idx)}
                                          displayEmpty
                                          className={classes.selectEmpty}
                                          inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                          {item.parameterDetails.parameterValues.map((item: any, index: any) => (
                                            <MenuItem key={index} value={item}>
                                              {item}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>
                                    )
                                  case 'dropdown_range':
                                    return (
                                      <FormControl fullWidth>
                                        <InputLabel id='select-value-label'>Select Value</InputLabel>
                                        <Select
                                          label='Select Value'
                                          name='ruleValue'
                                          value={item.ruleValue ?? ''}
                                          onChange={handleChangeParameter(prsIndex, idx)}
                                          displayEmpty
                                          className={classes.selectEmpty}
                                          inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                          {buildMenuForDropdownRange(item.parameterDetails)}
                                        </Select>
                                      </FormControl>
                                    )
                                  default:
                                    return (
                                      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <FormControl fullWidth>
                                          <TextField
                                            type={
                                              item.parameterDetails?.paramterDataType?.type === 'numeric'
                                                ? 'number'
                                                : 'text'
                                            }
                                            name='ruleValue'
                                            value={item.ruleValue ?? ''}
                                            label='Value'
                                            onChange={handleChangeParameter(prsIndex, idx)}
                                          />
                                        </FormControl>
                                        {getParameterTypeByID(item.selectedParameter) == 'Coverage' && (
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                checked={item.isPercentage}
                                                name='isPercentage'
                                                color='primary'
                                                onChange={handleChangeParameter(prsIndex, idx)}
                                              />
                                            }
                                            label='%'
                                          />
                                        )}
                                      </div>
                                    )
                                }
                              })()}
                            </Grid>

                            {item.isPercentage && (
                              <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth>
                                  <InputLabel id='select-percenttype-label'>Select</InputLabel>
                                  <Select
                                    label='Select'
                                    name='selectedPercentType'
                                    value={item.selectedPercentType ?? ''}
                                    onChange={handleChangeParameter(prsIndex, idx)}
                                    displayEmpty
                                    className={classes.selectEmpty}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                  >
                                    <MenuItem value='%'>%</MenuItem>
                                    {benefitNav && benefitNav.length > 1 && <MenuItem value='%of '>% of</MenuItem>}
                                  </Select>
                                </FormControl>
                                {item.selectedPercentType == '%of ' && (
                                  <FormControl fullWidth>
                                    <InputLabel id='select-percenttype-label'>Parameter</InputLabel>
                                    <Select
                                      label='Parameter'
                                      name='percentDependsOn'
                                      value={item.percentDependsOn ?? ''}
                                      onChange={handleChangeParameter(prsIndex, idx)}
                                      displayEmpty
                                      className={classes.selectEmpty}
                                      inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                      {benefitNav &&
                                        benefitNav.length > 1 &&
                                        benefitNav.map((item: any, index: number) => {
                                          if (index < benefitNav.length.length - 1) {
                                            return (
                                              <MenuItem key={index} value={item.name}>
                                                {item.name}
                                              </MenuItem>
                                            )
                                          }
                                        })}
                                    </Select>
                                  </FormControl>
                                )}
                              </Grid>
                            )}

                            <Grid item xs={12} sm={4} md={2}>
                              <FormControl fullWidth>
                                <InputLabel id='select-connector-label'>Connector</InputLabel>
                                <Select
                                  label='Connector'
                                  name='selectedConnector'
                                  value={item.selectedConnector ?? ''}
                                  onChange={handleChangeParameter(prsIndex, idx)}
                                  displayEmpty
                                  className={classes.selectEmpty}
                                  inputProps={{ 'aria-label': 'Without label' }}
                                  disabled={item?.addClicked}
                                >
                                  <MenuItem value='&&'>AND</MenuItem>
                                  <MenuItem value='||'>OR</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>

                            <Grid item xs className={classes.rowActionBtn}>
                              {idx === prsItem.rules.length - 1 && (
                                <IconButton
                                  color='primary'
                                  aria-label='add'
                                  onClick={handleAddMoreRule.bind(this, null, prsIndex, idx, null)}
                                >
                                  <AddCircleOutlineIcon />
                                </IconButton>
                              )}
                              {prsItem.rules.length > 1 && (
                                <IconButton
                                  color='secondary'
                                  aria-label='delete'
                                  onClick={handleRemoveRow(prsIndex, idx)}
                                >
                                  <RemoveCircleOutlineIcon />
                                </IconButton>
                              )}
                            </Grid>
                          </Grid>
                        )
                      })}
                    </Grid>
                  </Grid>
                </Box>
              )
            })}
          </Grid>
        </Box>

        <Box padding={5}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={9} display='flex' alignItems='center'>
              <FormControl fullWidth>
                <TextField
                  name='ruleTextArea'
                  value={formik.values.ruleTextArea}
                  label='Rule'
                  InputLabelProps={{ shrink: true }}
                  helperText='you must click preview before Save Edit'
                />
              </FormControl>
            </Grid>
            <Grid item>
              <Button onClick={() => previewRule()} color='secondary' className='p-button-outlined'>
                Rule Preview *
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={addBtnClick} color='primary' disabled={!saveButtonEnable}>
          {mode === 'edit' ? 'Save Edit' : mode === 'add' ? 'Add' : mode === 'clone' ? 'Clone' : 'Invalid Mode'}
        </Button>
        <Button onClick={() => handleClose()} color='primary' autoFocus className='p-button-text'>
          Exit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RuleDesignModal



// import {
//   Box,
//   Checkbox,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Divider,
//   FormControl,
//   FormControlLabel,
//   FormLabel,
//   Grid,
//   IconButton,
//   InputLabel,
//   MenuItem,
//   Radio,
//   RadioGroup,
//   Select,
//   TextField,
// } from '@mui/material';
// import { makeStyles } from '@mui/styles'
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
// import { Autocomplete } from '@mui/lab';
// import { useFormik } from 'formik';
// import { Button } from 'primereact/button';
// import React, { useEffect, useRef, useState } from 'react';
// import { v4 as uuidv4 } from 'uuid'
// import * as yup from 'yup';
// import { BenefitStructureService, FundTypeService } from '@/services/remote-api/fettle-remote-api';

// const useStyles = makeStyles((theme: any) => ({
//   secondaryColor: {
//     color: theme?.palette?.secondary?.main,
//   },
//   flexGrid: {
//     display: 'flex',
//     alignContent: 'end',
//     justifyContent: 'end',
//   },
//   selectEmpty: {},
//   rowActionBtn: {},
//   prospectImportRadioGroup: {}
// }));

// function splitConditions(conditionString: any) {
//   const conditions = conditionString.split(/\s*(\|\||&&)\s*/);
//   const connectors = conditions
//     .map((operator: any, index: number) => {
//       if (index % 2 !== 0) {
//         return operator;
//       }
//       return null;
//     })
//     .filter(Boolean);

//   const splitConditions = conditions
//     .map((condition: any) => {
//       // const parts = condition.match(/\s*([\w']+)\s*([><=!]+)\s*([\w'"]+)\s*/);
//       // const parts = condition.match(/\s*([\w']+)\s*([><=!]+)\s*([^\s]+)/);
//       const parts = condition.match(/\s*([\w']+)\s*([><=!]+)\s*([^\s)]+)/);
//       if (parts) {
//         return {
//           selectedParameter: parts[1],
//           selectedOperator: parts[2],
//           ruleValue: parts[3],
//         };
//       }
//       return null;
//     })
//     .filter(Boolean);

//   return { splitConditions: splitConditions, connectors: connectors };
// }

// function removeQuotes(value: any) {
//   if (typeof value === 'string') {
//     return value.replace(/'/g, '');
//   }
//   return value;
// }

// const initRuleObject = {
//   selectedParameter: '',
//   selectedOperator: '',
//   ruleValue: '',
//   isPercentage: false,
//   selectedPercentType: '',
//   percentDependsOn: '',
//   selectedConnector: '',
//   parameterDetails: { paramterComparisonTypes: [] },
// };

// const getInitialFormValues = () => ({
//   ruleTextArea: '',
//   ruleName: '',
//   coverType: 'Per Member',
//   benefitId: '',
//   waitingPeriod: 0,
//   eventLimit: '',
//   noOfDaysPerEvent: '',
//   dailyLimit: '',
//   coverage: 'coverage without %',
//   coverageWithPercentVal: '',
//   coveragePercentageType: '',
//   onceInCount: '',
//   onceInUnit: '',
//   onceInFrequency: '',
//   copayExpression: '',
//   fundManagedBy: 'FUNDED',
//   coverageWithoutPercentVal: 0,
//   fundEntries: [{ id: uuidv4(), code: '', amount: '' }],
//   interventionId: '',
//   coveragePercentDependsOn: ''
// })

// const initRuleSegment = () => ({ rules: [{ ...initRuleObject }], failureMessage: '' });

// const validationSchema = yup.object({
//   ruleName: yup.string().required('Rule name is required'),
//   // code: yup.string('Select Fund Type').required('Fund Type is required'),
//   // coverType: yup.string('Select cover type').required('Cover type is required'),
//   // coverageWithPercentVal: yup.string('Enter Coverrage percentage').required('Coverage Percentage is required'),
//   // coverageWithPercentVal: yup.string('Enter Coverrage amount').required('Coverage amount is required'),
// });

// const benefitstructureservice = new BenefitStructureService();
// const fundtypeservice = new FundTypeService();

// const RuleDesignModal = ({
//   openDialog,
//   setOpenDialog,
//   forBenefit,
//   benefitNav,
//   onAdd,
//   editFormValues /* product rule  */,
//   onRuleEditSave,
//   parentBenefit,
// }: any) => {
//   console.log("1234567", editFormValues)
//   const classes = useStyles();
//   const frmRef = useRef(null);
//   const [saveButtonEnable, setSaveButtonEnable] = useState(false);
//   const d =
//     editFormValues && editFormValues.productRuleSegments && editFormValues.productRuleSegments.length > 0
//       ? editFormValues.productRuleSegments.map((r: any) => initRuleSegment())
//       : [initRuleSegment()];
//   console.log("ddddddddddd", d)
//   const [state, setState] = React.useState({
//     productRuleSegments: d,
//   });
//   const [benefitInterventions, setBenefitInterventions] = useState([]);
//   const [selectedInterventionId, setSelectedInterventionId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [fundEntries, setFundEntries] = useState([{ id: uuidv4(), code: '', amount: '' }]);
//   const [fundTypes, setFundTypes] = useState<any>([]);

//   const getIntervemntions = () => {
//     setLoading(true);
//     const bts$ = benefitstructureservice.getBenefitInterventions(forBenefit.benefitStructureId);
//     bts$.subscribe({
//       next: result => {
//         const temp = result?.map((el: any) => ({
//           ...el,
//           label: el.code + ' | ' + el.name,
//         }));
//         setBenefitInterventions(temp);
//       },
//       error: err => {
//         setLoading(false);
//       },
//       complete: () => setLoading(false),
//     });
//   };

//   const getTypes = () => {
//     const fts$ = fundtypeservice.getFundTypes();
//     fts$.subscribe({
//       next: result => {
//         setFundTypes(result.content);
//       },
//       error: err => {
//         console.log(err);
//       },
//     });
//   };

//   useEffect(() => {
//     getTypes();
//   }, []);

//   useEffect(() => {
//     if (forBenefit) {
//       getIntervemntions();
//     }
//   }, []);

//   const onSubmit = (formikValues: any) => {
//     let coverageExp: any = '';
//     let coverageAmt: any = '';
//     if (formikValues.coverage == 'coverage without %') {
//       coverageExp = formikValues.coverageWithoutPercentVal.toString();
//       coverageAmt = formikValues.coverageWithoutPercentVal.toString();
//     } else if (formikValues.coverage == 'coverage with %' && formikValues.coveragePercentageType == '%of') {
//       coverageAmt = parentBenefit.coverageAmount
//         ? (parentBenefit?.coverageAmount * formikValues?.coverageWithPercentVal) / 100
//         : formikValues.coverageWithPercentVal.toString() + ' ' + '%of' + ' ' + formikValues.coveragePercentDependsOn;
//       coverageExp =
//         formikValues.coverageWithPercentVal.toString() + ' ' + '%of' + ' ' + formikValues.coveragePercentDependsOn;
//     }

//     const finalFundEntries = formik.values.fundEntries.filter((entry: any) => entry.code);

//     if (finalFundEntries.length > 0) {
//       let totalLimit = finalFundEntries.map((f: any) => f.amount).reduce((t: any, n: any) => t + n, 0);
//       // if (totalLimit != 100) {
//       //   //TODO show error message
//       //   return;
//       // }
//     }

//     let r = buildProductRuleSegmentsAndRuleText(formikValues);
//     const data = {
//       internalId: !!editFormValues ? editFormValues.internalId : uuidv4(),
//       interventionId: selectedInterventionId,
//       name: formikValues.ruleName,
//       expression: r.expression,
//       benefitId: !!editFormValues ? editFormValues.benefitId : forBenefit.id,
//       benefitStructureId: !!editFormValues ? editFormValues.benefitStructureId : forBenefit.benefitStructureId,
//       coverageExpression: coverageExp,
//       coverageAmount: coverageAmt.toString(),
//       coverage: formik.values.coverage,
//       eventLimit: formik.values.eventLimit,
//       noOfDaysPerEvent: formik.values.noOfDaysPerEvent,
//       dailyLimit: formik.values.dailyLimit,
//       onceInCount: formik.values.onceInCount,
//       onceInUnit: formik.values.onceInUnit,
//       onceInFrequency: formik.values.onceInFrequency,
//       coverType: formikValues.coverType,
//       waitingPeriod: formikValues.waitingPeriod,
//       copayExpression: formikValues.copayExpression && `${formikValues.copayExpression}%`,
//       fundManagedBy: formikValues.fundManagedBy,
//       fundEntries: finalFundEntries,
//       productRuleSegments: r.productRuleSegments,
//     };

//     !!editFormValues ? onRuleEditSave(data) : onAdd(data);
//   };

//   // const expression = editFormValues?.expression;
//   // const conditions = expression && splitConditions(expression);

//   function handleChangeParameter(prsIndex: any, idx?: any) {
//     return (e: any) => {
//       const { name, value, checked } = e.target;
//       if (idx == null || idx == undefined) {
//         setState(prevState => {
//           const productRuleSegments = [...prevState.productRuleSegments];
//           productRuleSegments[prsIndex] = { ...productRuleSegments[prsIndex], [name]: value };
//           return { productRuleSegments: productRuleSegments };
//         });
//       } else {
//         setState(prevState => {
//           const productRuleSegments = [...prevState.productRuleSegments];

//           if (!productRuleSegments[prsIndex].rules) {
//             let obj = { ...initRuleObject };
//             productRuleSegments[prsIndex].rules = [obj];
//           }

//           productRuleSegments[prsIndex].rules[idx] = {
//             ...productRuleSegments[prsIndex].rules[idx],
//             [name]: name === 'isPercentage' ? checked : value,
//           };

//           if (name === 'selectedConnector') {
//             handleAddMoreRule(productRuleSegments, prsIndex, idx, prevState);
//           } else if (name === 'selectedParameter') {
//             const selectedParam = forBenefit.parameters.find((item: any) => item.id === value);
//             productRuleSegments[prsIndex].rules[idx].parameterDetails = selectedParam;
//           }
//           return { productRuleSegments: productRuleSegments };
//         });
//       }
//     };
//   }

//   function handleAddMoreRule(ruleList: any, prsIndex: any, idx: any, preState: any) {
//     let productRuleSegments = preState ? preState.productRuleSegments : state.productRuleSegments;

//     let prsItem = productRuleSegments[prsIndex];
//     if (idx === prsItem.rules.length - 1) {
//       const item = { ...initRuleObject };

//       /** When Select Connector changes */
//       if (ruleList) {
//         item.selectedParameter = prsItem.rules[prsItem.rules.length - 1].selectedParameter;
//         item.parameterDetails = prsItem.rules[prsItem.rules.length - 1].parameterDetails;
//         prsItem.rules.push(item);
//         setState({
//           productRuleSegments: [...productRuleSegments],
//         });
//       } else {
//         /** When Add button click */

//         const rules = [...prsItem.rules];
//         rules[idx] = {
//           ...rules[idx],
//           selectedConnector: '&&',
//           addClicked: true,
//         };
//         prsItem.rules.push(item);
//         setState({
//           productRuleSegments: [...productRuleSegments],
//         });
//       }
//     } else {
//       setState({
//         productRuleSegments: [...productRuleSegments],
//       });
//     }
//   }

//   function handleAddMoreRuleSegment(prsIndex: any) {
//     let productRuleSegments = state.productRuleSegments;
//     const item = initRuleSegment();
//     productRuleSegments.splice(prsIndex + 1, 0, item);
//     setState({
//       productRuleSegments: [...productRuleSegments],
//     });
//   }

//   function prepopulateRuleForm(prsIndex: any, parsedConditions: any, connectors: any) {
//     for (let i = 0; i < parsedConditions.length; i++) {
//       const condition = parsedConditions[i];

//       handleChangeParameter(
//         prsIndex,
//         i,
//       )({
//         target: {
//           name: 'selectedParameter',
//           value: forBenefit?.parameters?.find((item: any) => item.name == condition.selectedParameter)?.id.toString(),
//         },
//       });
//       handleChangeParameter(
//         prsIndex,
//         i,
//       )({
//         target: {
//           name: 'selectedOperator',
//           value: forBenefit.parameters
//             .find((item: any) => item.name == condition.selectedParameter)
//             ?.paramterComparisonTypes.find((item: any) => item.symbol == condition.selectedOperator)
//             ?.id.toString(),
//         },
//       });
//       handleChangeParameter(
//         prsIndex,
//         i,
//       )({
//         target: {
//           name: 'ruleValue',
//           value: removeQuotes(condition.ruleValue),
//         },
//       });

//       if (i < connectors.length) {
//         handleChangeParameter(
//           prsIndex,
//           i,
//         )({
//           target: {
//             name: 'selectedConnector',
//             value: connectors[i],
//           },
//         });
//       }
//     }
//   }
//   useEffect(() => {
//     if (editFormValues?.productRuleSegments && editFormValues?.productRuleSegments?.length > 0) {
//       editFormValues.productRuleSegments.forEach((prsItem: any, prsIndex: any) => {
//         handleChangeParameter(prsIndex)({
//           target: {
//             name: 'failureMessage',
//             value: prsItem.failureMessage,
//           },
//         });

//         setTimeout(() => {
//           const conditions = splitConditions(prsItem.expression);
//           prepopulateRuleForm(prsIndex, conditions.splitConditions, conditions.connectors);
//         }, 300);
//       });
//     }
//   }, []);

//   const editIntialData = {
//     ruleTextArea: editFormValues?.expression,
//     ruleName: editFormValues?.name,
//     coverType: editFormValues?.coverType,
//     benefitId: editFormValues?.benefitId,
//     waitingPeriod: editFormValues?.waitingPeriod,
//     eventLimit: editFormValues?.eventLimit,
//     noOfDaysPerEvent: editFormValues?.noOfDaysPerEvent,
//     dailyLimit: editFormValues?.dailyLimit,
//     coverage: editFormValues?.coverage,
//     coverageWithPercentVal: editFormValues?.coverageExpression?.split(" ")[0],
//     coveragePercentageType: editFormValues?.coverageExpression?.split(" ")[1],
//     onceInCount: editFormValues?.onceInCount,
//     onceInUnit: editFormValues?.onceInUnit,
//     onceInFrequency: editFormValues?.onceInFrequency,
//     copayExpression: editFormValues?.copayExpression?.replace(/%/g, ''),
//     fundManagedBy: editFormValues?.fundManagedBy || 'FUNDED',
//     coverageWithoutPercentVal: Number(editFormValues?.coverageExpression),
//     fundEntries: editFormValues?.fundEntries || [{ id: uuidv4(), code: '', amount: '' }],
//     interventionId: editFormValues?.interventionId,
//   };
//   const mergedEditFormValues = editIntialData || {};

//   const formik = useFormik({
//     initialValues: editFormValues ? {
//       ruleTextArea: editFormValues?.expression || '',
//       ruleName: editFormValues?.name || '',
//       coverType: editFormValues?.coverType || 'Per Member',
//       benefitId: editFormValues?.benefitId || '',
//       waitingPeriod: editFormValues?.waitingPeriod || 0,
//       eventLimit: editFormValues?.eventLimit || '',
//       noOfDaysPerEvent: editFormValues?.noOfDaysPerEvent || '',
//       dailyLimit: editFormValues?.dailyLimit || '',
//       coverage: editFormValues?.coverage || 'coverage without %',
//       coverageWithPercentVal: editFormValues?.coverageExpression?.split(' ')[0] || '',
//       coveragePercentageType: editFormValues?.coverageExpression?.split(' ')[1] || '',
//       onceInCount: editFormValues?.onceInCount || '',
//       onceInUnit: editFormValues?.onceInUnit || '',
//       onceInFrequency: editFormValues?.onceInFrequency || '',
//       copayExpression: editFormValues?.copayExpression?.replace(/%/g, '') || '',
//       fundManagedBy: editFormValues?.fundManagedBy || 'FUNDED',
//       coverageWithoutPercentVal: Number(editFormValues?.coverageExpression) || 0,
//       fundEntries: editFormValues?.fundEntries || [{ id: uuidv4(), code: '', amount: '' }],
//       interventionId: editFormValues?.interventionId || '',
//       coveragePercentDependsOn: ''
//     } : getInitialFormValues(),
//     validationSchema: validationSchema,
//     onSubmit: values => {
//       onSubmit(values)
//     }
//   })

//   const handleClose = () => {
//     setOpenDialog(false);
//   };

//   const getParameterTypeByID = (id: any) => {
//     if (!id) return;
//     return forBenefit?.parameters?.filter((item: any) => item.id === id)[0].name;
//   };

//   const buildMenuForDropdownRange = (paramDetails: any) => {
//     let menuList = [];
//     for (let idx = paramDetails.start; idx <= paramDetails.end; idx += paramDetails.count) {
//       menuList.push(<MenuItem value={idx}>{idx}</MenuItem>);
//     }

//     return menuList;
//   };

//   const handleRemoveRow = (prsIndex: any, idx: any) => (e: any) => {
//     let prsItem = state.productRuleSegments[prsIndex];
//     prsItem.rules.splice(idx, 1);
//     setState({
//       productRuleSegments: [...state.productRuleSegments],
//     });
//   };

//   const handleRemoveRuleSegmentRow = (prsIndex: any) => (e: any) => {
//     state.productRuleSegments.splice(prsIndex, 1);
//     setState({
//       productRuleSegments: [...state.productRuleSegments],
//     });
//   };

//   const buildProductRuleSegmentsAndRuleText = (formikValues: any) => {
//     let productRuleSegments = state.productRuleSegments.map((prsItem: any) => ({
//       expression: ruleTextstring(prsItem),
//       failureMessage: prsItem.failureMessage,
//     }));

//     let expression = productRuleSegments
//       .map((prsItem: any) => prsItem.expression)
//       .filter((e: any) => !!e)
//       .join(' && ');
//     return { expression, productRuleSegments };
//   };

//   const ruleTextstring = (prsItem: any) => {
//     /** Rule text population */
//     let populateRuleText = '';
//     prsItem.rules.forEach((item: any, idx: any) => {
//       const op = item.parameterDetails.paramterComparisonTypes.filter((o: any) => o.id === item.selectedOperator);
//       if (op.length > 0) {
//         if (idx > 0 && idx < prsItem.rules.length) {
//           populateRuleText += ' ';
//         }

//         const findElem = prsItem.rules.map((o: any) => o.selectedParameter === item.selectedParameter);
//         const firstIdx = findElem.indexOf(true);
//         const lastIdx = findElem.lastIndexOf(true);
//         if (firstIdx !== lastIdx && firstIdx === idx) {
//           populateRuleText += '(';
//         }

//         populateRuleText += `${item.parameterDetails.name}${op[0].symbol}`;

//         if (
//           (item.parameterDetails.paramterUiRenderType.type === 'textbox' &&
//             item.parameterDetails.paramterDataType.type === 'numeric') ||
//           item.parameterDetails.paramterUiRenderType.type === 'dropdown_range'
//         ) {
//           populateRuleText += parseInt(item.ruleValue);
//         } else {
//           populateRuleText += `'${item.ruleValue}'`;
//         }

//         if (item.isPercentage) {
//           populateRuleText += `${item.selectedPercentType}${item.percentDependsOn}`;
//         }

//         if (firstIdx !== lastIdx && lastIdx === idx) {
//           populateRuleText += ')';
//           if (item.selectedConnector && idx < prsItem.rules.length - 1) {
//             populateRuleText += ` ${item.selectedConnector}`;
//           }
//         } else if (item.selectedConnector && idx < prsItem.rules.length - 1) {
//           populateRuleText += ` ${item.selectedConnector}`;
//         }
//       }
//     });
//     return populateRuleText;
//   };
//   const previewRule = () => {
//     const r = buildProductRuleSegmentsAndRuleText(formik.values);
//     if (r.expression) {
//       formik.setFieldValue('ruleTextArea', r.expression);
//       setSaveButtonEnable(true);
//     }
//   };

//   const addBtnClick = () => {
//     formik.handleSubmit();
//   };

//   const handleInterventionChange = (event: any, value: any) => {
//     if (value) {
//       setSelectedInterventionId(value.interventionId);
//     } else {
//       setSelectedInterventionId(null);
//     }
//   };

//   const handleChangeFund = (id: any, event: any) => {
//     const { name, value } = event.target;
//     const newFundEntries = formik.values.fundEntries.map((entry: any) => (entry.id === id ? { ...entry, [name]: value } : entry));
//     formik.setFieldValue('fundEntries', newFundEntries);
//   };

//   const addNewFundEntry = () => {
//     if (formik.values.fundEntries.length === fundTypes.length) {
//       return;
//     }
//     const newEntry = [...formik.values.fundEntries, { id: uuidv4(), code: '', amount: '' }];
//     formik.setFieldValue('fundEntries', newEntry);
//   };

//   const removeEntry = (id: any) => {
//     const delEntry = [...formik.values.fundEntries.filter((entry: any) => entry.id !== id)];
//     formik.setFieldValue('fundEntries', delEntry);
//   };

//   return (
//     <Dialog
//       fullWidth
//       maxWidth="lg"
//       open={openDialog}
//       onClose={handleClose}
//       aria-labelledby="alert-dialog-title"
//       aria-describedby="alert-dialog-description">
//       <DialogTitle id="alert-dialog-title">
//         Adding rule for - <span className={classes.secondaryColor}>{forBenefit?.name} </span>
//         <span> </span>
//         {benefitNav.length > 1 && <span> ({benefitNav.map((b: any) => b.name).join(' / ')})</span>}
//       </DialogTitle>
//       <DialogContent>
//         <Box padding={5}>
//           <Grid container spacing={4}>
//             <Grid item xs={12} sm={6} md={3}>
//               <FormControl fullWidth>
//                 <TextField
//                   required
//                   name="ruleName"
//                   value={formik.values.ruleName}
//                   label="Rule Name"
//                   onChange={formik.handleChange}
//                   error={formik.touched.ruleName && Boolean(formik.errors.ruleName)}
//                 // helperText={formik.touched.ruleName && formik.errors.ruleName}
//                 />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <FormControl fullWidth>
//                 <TextField
//                   type="number"
//                   name="waitingPeriod"
//                   value={formik.values.waitingPeriod}
//                   label="Waiting Period"
//                   onChange={formik.handleChange}
//                 // error={formik.touched.ruleName && Boolean(formik.errors.ruleName)}
//                 // helperText={formik.touched.ruleName && formik.errors.ruleName}
//                 />
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6} md={3}>
//               <FormControl fullWidth>
//                 <TextField
//                   type="number"
//                   name="copayExpression"
//                   value={formik.values.copayExpression}
//                   label="Co-pay(%)"
//                   onChange={formik.handleChange}
//                 // error={formik.touched.ruleName && Boolean(formik.errors.ruleName)}
//                 // helperText={formik.touched.ruleName && formik.errors.ruleName}
//                 />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <FormControl fullWidth>
//                 <InputLabel id="select-connector-label">Fund Managed</InputLabel>
//                 <Select
//                   name="fundManagedBy"
//                   value={formik.values.fundManagedBy}
//                   onChange={formik.handleChange}
//                   // className={classes.selectEmpty}
//                   inputProps={{ 'aria-label': 'Without label' }}
//                 // disabled={item?.addClicked}
//                 >
//                   <MenuItem value="FUNDED">FUNDED</MenuItem>
//                   <MenuItem value="INSURED">INSURED</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid container item xs={12}>
//               {formik.values.fundEntries.map((entry: any, rowIndex: number) => (
//                 <Grid container key={entry.id} spacing={4}>
//                   <Grid item xs={10} sm={6} md={3}>
//                     <FormControl fullWidth>
//                       <InputLabel id={`fund-select-label-${entry.code}`}>Fund Type</InputLabel>
//                       <Select
//                         labelId={`fund-select-label-${entry.code}`}
//                         value={entry.code}
//                         onChange={event => handleChangeFund(entry.id, event)}
//                         variant="standard"
//                         name="code"
//                       // required
//                       // error={formik.touched.code && Boolean(formik.errors.code)}
//                       // helperText={formik.touched.code && formik.errors.code}
//                       >
//                         {fundTypes.map((fund: any) => (
//                           <MenuItem key={fund.code} value={fund.code}>
//                             {fund.name}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Grid>
//                   <Grid item xs={10} sm={6} md={3}>
//                     <TextField
//                       label="Percentage"
//                       type="number"
//                       variant="standard"
//                       name="amount"
//                       value={entry.amount}
//                       onChange={event => handleChangeFund(entry.id, event)}
//                       fullWidth
//                     />
//                   </Grid>

//                   <Grid item xs={3} container spacing={9}>
//                     <Grid item>
//                       {formik.values.fundEntries.length > 1 && (
//                         <IconButton color="secondary" aria-label="delete" onClick={() => removeEntry(entry.id)}>
//                           <RemoveCircleOutlineIcon />
//                         </IconButton>
//                       )}
//                     </Grid>
//                     <Grid item>
//                       {rowIndex === formik.values.fundEntries.length - 1 && (
//                         <IconButton color="primary" aria-label="add" onClick={addNewFundEntry}>
//                           <AddCircleOutlineIcon />
//                         </IconButton>
//                       )}
//                     </Grid>
//                   </Grid>
//                 </Grid>
//               ))}
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <FormControl fullWidth>
//                 <InputLabel id="select-connector-label">Cover type</InputLabel>
//                 <Select
//                   name="coverType"
//                   value={formik.values.coverType}
//                   onChange={formik.handleChange}
//                   // className={classes.selectEmpty}
//                   inputProps={{ 'aria-label': 'Without label' }}
//                 // disabled={item?.addClicked}
//                 // required
//                 // error={formik.touched.coverType && Boolean(formik.errors.coverType)}
//                 // helperText={formik.touched.coverType && formik.errors.coverType}
//                 >
//                   <MenuItem value="Per Member">Per Member</MenuItem>
//                   <MenuItem value="Per Family">Per Family</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <FormControl component="fieldset">
//                 <FormLabel component="legend">Coverage</FormLabel>
//                 <RadioGroup
//                   aria-label="clientimport"
//                   name="coverage"
//                   value={formik.values.coverage}
//                   onChange={formik.handleChange}
//                   row
//                   className={classes.prospectImportRadioGroup}>
//                   <FormControlLabel value="coverage without %" control={<Radio />} label="Coverage" />
//                   <FormControlLabel
//                     disabled={benefitNav.length == 1 || benefitNav.length < 1}
//                     value="coverage with %"
//                     control={<Radio />}
//                     label="Coverage with %"
//                   />
//                 </RadioGroup>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6} md={3}>
//               {formik.values.coverage == 'coverage without %' && (
//                 <FormControl fullWidth>
//                   <TextField
//                     type="number"
//                     name="coverageWithoutPercentVal"
//                     value={formik.values.coverageWithoutPercentVal}
//                     label="Coverage amount"
//                     onChange={formik.handleChange}
//                   // required
//                   // error={formik.touched.coverageWithoutPercentVal && Boolean(formik.errors.coverageWithoutPercentVal)}
//                   // helperText={formik.touched.coverageWithoutPercentVal && formik.errors.coverageWithoutPercentVal}
//                   />
//                 </FormControl>
//               )}
//               {formik.values.coverage == 'coverage with %' && benefitNav.length > 1 && (
//                 <FormControl fullWidth>
//                   <TextField
//                     type="number"
//                     name="coverageWithPercentVal"
//                     value={formik.values.coverageWithPercentVal}
//                     label="Percentage value"
//                     InputProps={{ inputProps: { min: 0, max: 10 } }}
//                     onChange={formik.handleChange}
//                   // required
//                   // error={formik.touched.coverageWithPercentVal && Boolean(formik.errors.coverageWithPercentVal)}
//                   // helperText={formik.touched.coverageWithPercentVal && formik.errors.coverageWithPercentVal}
//                   />
//                 </FormControl>
//               )}
//             </Grid>

//             {formik.values.coverage == 'coverage with %' && benefitNav.length > 1 && (
//               <Grid item xs={12} sm={6} md={3}>
//                 <FormControl fullWidth>
//                   <InputLabel id="select-connector-label">Percentage type*</InputLabel>
//                   <Select
//                     name="coveragePercentageType"
//                     value={formik.values.coveragePercentageType}
//                     onChange={formik.handleChange}
//                   // className={classes.selectEmpty}
//                   // inputProps={{ "aria-label": "Without label" }}
//                   // disabled={item?.addClicked}
//                   >
//                     <MenuItem value="%of">% of</MenuItem>
//                     <MenuItem value="%">%</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//             )}

//             {formik.values.coverage == 'coverage with %' &&
//               benefitNav.length > 1 &&
//               formik.values.coveragePercentageType == '%of' && (
//                 <Grid item xs={12} sm={6} md={3}>
//                   <FormControl fullWidth>
//                     <InputLabel id="select-percenttype-label">Depends on</InputLabel>
//                     <Select
//                       name="coveragePercentDependsOn"
//                       value={formik.values.coveragePercentDependsOn ?? ''}
//                       onChange={formik.handleChange}
//                     // inputProps={{ "aria-label": "Without label" }}
//                     >
//                       {benefitNav.map((item: any, idx: number) => {
//                         if (idx < benefitNav.length - 1) {
//                           return <MenuItem value={item.id}>{item.name}</MenuItem>;
//                         }
//                       })}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//               )}

//             <Grid item xs={12} sm={6} md={3}>
//               {loading ? (
//                 <CircularProgress />
//               ) : (
//                 <Autocomplete
//                   options={benefitInterventions}
//                   getOptionLabel={(option: any) => option.label}
//                   renderInput={params => (
//                     <TextField
//                       {...params}
//                       label="Select Intervention"
//                       value={formik.values.interventionId ?? ''}
//                       variant="standard"
//                       fullWidth
//                     />
//                   )}
//                   onChange={handleInterventionChange}
//                 />
//               )}
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <FormControl fullWidth>
//                 <TextField
//                   type="number"
//                   name="eventLimit"
//                   value={formik.values.eventLimit}
//                   label="Event Limit"
//                   onChange={formik.handleChange}
//                 // error={formik.touched.ruleName && Boolean(formik.errors.ruleName)}
//                 // helperText={formik.touched.ruleName && formik.errors.ruleName}
//                 />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <FormControl fullWidth>
//                 <TextField
//                   type="number"
//                   name="dailyLimit"
//                   value={formik.values.dailyLimit}
//                   label="Daily Limit"
//                   onChange={formik.handleChange}
//                 // error={formik.touched.ruleName && Boolean(formik.errors.ruleName)}
//                 // helperText={formik.touched.ruleName && formik.errors.ruleName}
//                 />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <FormControl fullWidth>
//                 <TextField
//                   type="number"
//                   name="noOfDaysPerEvent"
//                   value={formik.values.noOfDaysPerEvent}
//                   label="No of Days per Event"
//                   onChange={formik.handleChange}
//                 // error={formik.touched.ruleName && Boolean(formik.errors.ruleName)}
//                 // helperText={formik.touched.ruleName && formik.errors.ruleName}
//                 />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}></Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <FormControl fullWidth>
//                 <TextField
//                   type="number"
//                   name="onceInFrequency"
//                   value={formik.values.onceInFrequency}
//                   label="Once in Frequency"
//                   onChange={formik.handleChange}
//                 // error={formik.touched.ruleName && Boolean(formik.errors.ruleName)}
//                 // helperText={formik.touched.ruleName && formik.errors.ruleName}
//                 />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <FormControl fullWidth>
//                 <TextField
//                   type="number"
//                   name="onceInCount"
//                   value={formik.values.onceInCount}
//                   label="Once in Count"
//                   onChange={formik.handleChange}
//                 // error={formik.touched.ruleName && Boolean(formik.errors.ruleName)}
//                 // helperText={formik.touched.ruleName && formik.errors.ruleName}
//                 />
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <FormControl fullWidth>
//                 <InputLabel id="select-parameter-label">Once in Unit</InputLabel>
//                 <Select
//                   name="onceInUnit"
//                   value={formik.values.onceInUnit}
//                   onChange={formik.handleChange}
//                   className={classes.selectEmpty}
//                   inputProps={{ 'aria-label': 'Without label' }}>
//                   <MenuItem value="year">Year</MenuItem>
//                   <MenuItem value="month">Month</MenuItem>
//                   <MenuItem value="week">Week</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             {formik.values.onceInFrequency && formik.values.onceInUnit && formik.values.onceInCount && (
//               <Grid
//                 item
//                 xs={12}
//                 sm={6}
//                 md={3}
//                 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bolder' }}>
//                 {formik.values.onceInFrequency} time in {formik.values.onceInCount} {formik.values.onceInUnit}
//               </Grid>
//             )}
//           </Grid>
//         </Box>

//         <Box padding={5}>
//           <Grid container>
//             {state.productRuleSegments.map((prsItem: any, prsIndex: any) => {
//               return (
//                 <Box paddingTop={prsIndex > 0 ? 20 : 0} style={{ width: '100%' }}>
//                   <Grid xs={12} container spacing={4} alignItems="center" justifyContent="center">
//                     <Grid xs={4}>
//                       <h1>Rule Segment: {prsIndex + 1}</h1>
//                     </Grid>
//                     <Grid xs={8}>
//                       <Grid item xs className={classes.rowActionBtn}>
//                         {prsIndex === state.productRuleSegments.length - 1 && (
//                           <IconButton
//                             color="primary"
//                             aria-label="add"
//                             onClick={handleAddMoreRuleSegment.bind(this, prsIndex)}>
//                             <AddCircleOutlineIcon />
//                           </IconButton>
//                         )}
//                         {state.productRuleSegments.length > 1 && (
//                           <IconButton color="secondary" aria-label="delete" onClick={handleRemoveRuleSegmentRow(prsIndex)}>
//                             <RemoveCircleOutlineIcon />
//                           </IconButton>
//                         )}
//                       </Grid>
//                     </Grid>

//                     <Grid xs={12} container spacing={4} alignItems="center" justifyContent="center">
//                       <Grid item xs={12} style={{ paddingBottom: '35px' }}>
//                         <FormControl fullWidth>
//                           <TextField
//                             type={'text'}
//                             name="failureMessage"
//                             value={prsItem.failureMessage ?? ''}
//                             label="Failure Message"
//                             onChange={handleChangeParameter(prsIndex)}
//                           />
//                         </FormControl>
//                       </Grid>
//                     </Grid>

//                     <Grid xs={12} container spacing={4} alignItems="center" justifyContent="center" key={prsIndex}>
//                       {prsItem.rules?.map((item: any, idx: number) => {
//                         return (
//                           <Grid xs={12} container spacing={4} alignItems="center" justifyContent="center" key={idx}>
//                             <Grid key={idx} item xs={12} sm={6} md={3}>
//                               <FormControl fullWidth>
//                                 <InputLabel id="select-parameter-label">Select Parameter</InputLabel>
//                                 <Select
//                                   name="selectedParameter"
//                                   value={item.selectedParameter ?? ''}
//                                   onChange={handleChangeParameter(prsIndex, idx)}
//                                   displayEmpty
//                                   className={classes.selectEmpty}
//                                   inputProps={{ 'aria-label': 'Without label' }}>
//                                   {forBenefit?.parameters &&
//                                     forBenefit?.parameters.map((pItem: any, index: number) => (
//                                       <MenuItem key={index} value={pItem.id}>
//                                         {pItem.name}
//                                       </MenuItem>
//                                     ))}
//                                 </Select>
//                               </FormControl>
//                             </Grid>
//                             <Grid item xs={12} sm={6} md={3}>
//                               <FormControl fullWidth>
//                                 <InputLabel id="select-operator-label">Operator</InputLabel>
//                                 <Select
//                                   name="selectedOperator"
//                                   value={item.selectedOperator ?? ''}
//                                   onChange={handleChangeParameter(prsIndex, idx)}
//                                   displayEmpty
//                                   className={classes.selectEmpty}
//                                   inputProps={{ 'aria-label': 'Without label' }}>
//                                   {item.parameterDetails?.paramterComparisonTypes.map((pItem: any, index: number) => (
//                                     <MenuItem key={index} value={pItem.id} disabled={pItem.disabled}>
//                                       {pItem.symbol}
//                                     </MenuItem>
//                                   ))}
//                                 </Select>
//                               </FormControl>
//                             </Grid>
//                             <Grid item xs={12} sm={6} md={3}>
//                               {(() => {
//                                 switch (item?.parameterDetails?.paramterUiRenderType?.type) {
//                                   case 'dropdown':
//                                     return (
//                                       <FormControl fullWidth>
//                                         <InputLabel id="select-value-label">Select Value</InputLabel>
//                                         <Select
//                                           name="ruleValue"
//                                           value={item.ruleValue ?? ''}
//                                           onChange={handleChangeParameter(prsIndex, idx)}
//                                           displayEmpty
//                                           className={classes.selectEmpty}
//                                           inputProps={{ 'aria-label': 'Without label' }}>
//                                           {item.parameterDetails.parameterValues.map((item: any, index: number) => (
//                                             <MenuItem key={index} value={item}>
//                                               {item}
//                                             </MenuItem>
//                                           ))}
//                                         </Select>
//                                       </FormControl>
//                                     );
//                                   case 'dropdown_range':
//                                     return (
//                                       <FormControl fullWidth>
//                                         <InputLabel id="select-value-label">Select Value</InputLabel>
//                                         <Select
//                                           name="ruleValue"
//                                           value={item.ruleValue ?? ''}
//                                           onChange={handleChangeParameter(prsIndex, idx)}
//                                           displayEmpty
//                                           className={classes.selectEmpty}
//                                           inputProps={{ 'aria-label': 'Without label' }}>
//                                           {buildMenuForDropdownRange(item.parameterDetails)}
//                                         </Select>
//                                       </FormControl>
//                                     );
//                                   default:
//                                     return (
//                                       <div style={{ display: 'flex', alignItems: 'flex-end' }}>
//                                         <FormControl fullWidth>
//                                           <TextField
//                                             type={
//                                               item.parameterDetails?.paramterDataType?.type === 'numeric' ? 'number' : 'text'
//                                             }
//                                             name="ruleValue"
//                                             value={item.ruleValue ?? ''}
//                                             label="Value"
//                                             onChange={handleChangeParameter(prsIndex, idx)}
//                                           />
//                                         </FormControl>
//                                         {getParameterTypeByID(item.selectedParameter) == 'Coverage' && (
//                                           <FormControlLabel
//                                             control={
//                                               <Checkbox
//                                                 checked={item.isPercentage}
//                                                 name="isPercentage"
//                                                 color="primary"
//                                                 onChange={handleChangeParameter(prsIndex, idx)}
//                                               />
//                                             }
//                                             label="%"
//                                           />
//                                         )}
//                                       </div>
//                                     );
//                                 }
//                               })()}
//                             </Grid>

//                             {item.isPercentage && (
//                               <Grid item xs={12} sm={6} md={3}>
//                                 <FormControl fullWidth>
//                                   <InputLabel id="select-percenttype-label">Select</InputLabel>
//                                   <Select
//                                     name="selectedPercentType"
//                                     value={item.selectedPercentType ?? ''}
//                                     onChange={handleChangeParameter(prsIndex, idx)}
//                                     displayEmpty
//                                     className={classes.selectEmpty}
//                                     inputProps={{ 'aria-label': 'Without label' }}>
//                                     <MenuItem value="%">%</MenuItem>
//                                     {benefitNav && benefitNav.length > 1 && <MenuItem value="%of ">% of</MenuItem>}
//                                   </Select>
//                                 </FormControl>
//                                 {item.selectedPercentType == '%of ' && (
//                                   <FormControl fullWidth>
//                                     <InputLabel id="select-percenttype-label">Parameter</InputLabel>
//                                     <Select
//                                       name="percentDependsOn"
//                                       value={item.percentDependsOn ?? ''}
//                                       onChange={handleChangeParameter(prsIndex, idx)}
//                                       displayEmpty
//                                       className={classes.selectEmpty}
//                                       inputProps={{ 'aria-label': 'Without label' }}>
//                                       {benefitNav &&
//                                         benefitNav.length > 1 &&
//                                         benefitNav.map((item: any, index: number) => {
//                                           if (index < benefitNav.length.length - 1) {
//                                             return (
//                                               <MenuItem key={index} value={item.name}>
//                                                 {item.name}
//                                               </MenuItem>
//                                             );
//                                           }
//                                         })}
//                                     </Select>
//                                   </FormControl>
//                                 )}
//                               </Grid>
//                             )}

//                             <Grid item xs={12} sm={4} md={2}>
//                               <FormControl fullWidth>
//                                 <InputLabel id="select-connector-label">Connector</InputLabel>
//                                 <Select
//                                   name="selectedConnector"
//                                   value={item.selectedConnector ?? ''}
//                                   onChange={handleChangeParameter(prsIndex, idx)}
//                                   displayEmpty
//                                   className={classes.selectEmpty}
//                                   inputProps={{ 'aria-label': 'Without label' }}
//                                   disabled={item?.addClicked}>
//                                   <MenuItem value="&&">AND</MenuItem>
//                                   <MenuItem value="||">OR</MenuItem>
//                                 </Select>
//                               </FormControl>
//                             </Grid>

//                             <Grid item xs className={classes.rowActionBtn}>
//                               {idx === prsItem.rules.length - 1 && (
//                                 <IconButton
//                                   color="primary"
//                                   aria-label="add"
//                                   onClick={handleAddMoreRule.bind(this, null, prsIndex, idx, null)}>
//                                   <AddCircleOutlineIcon />
//                                 </IconButton>
//                               )}
//                               {prsItem.rules.length > 1 && (
//                                 <IconButton color="secondary" aria-label="delete" onClick={handleRemoveRow(prsIndex, idx)}>
//                                   <RemoveCircleOutlineIcon />
//                                 </IconButton>
//                               )}
//                             </Grid>
//                           </Grid>
//                         );
//                       })}
//                     </Grid>
//                   </Grid>
//                 </Box>
//               );
//             })}
//           </Grid>
//         </Box>

//         <Box padding={5}>
//           <Grid container spacing={4}>
//             <Grid item xs={12} md={9} display="flex" alignItems="center">
//               <FormControl fullWidth>
//                 <TextField
//                   name="ruleTextArea"
//                   value={formik.values.ruleTextArea}
//                   label="Rule"
//                   InputLabelProps={{ shrink: true }}
//                   helperText="you must click preview before Save Edit"
//                 />
//               </FormControl>
//             </Grid>
//             <Grid item>
//               <Button onClick={() => previewRule()} color="secondary" className="p-button-outlined">
//                 Rule Preview *
//               </Button>
//             </Grid>
//           </Grid>
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={addBtnClick} color="primary" disabled={!saveButtonEnable}>
//           {!!editFormValues ? 'Save Edit' : 'Add'}
//         </Button>
//         <Button onClick={() => handleClose()} color="primary" autoFocus className="p-button-text">
//           Exit
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default RuleDesignModal;
