import React from 'react'

import { useRouter } from 'next/navigation'

import { Button } from 'primereact/button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Paper from '@mui/material/Paper'

import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import Visibility from '@mui/icons-material/Visibility'

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { withStyles } from '@mui/styles'

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { BenefitStructureService } from '@/services/remote-api/api/benefit-structure-services'
import { BenefitService, PremiumFrequencyService } from '@/services/remote-api/api/master-services'
import { ProductService } from '@/services/remote-api/api/product-services'
import PremiumRuleTable from './premium.rule.table'
import { defaultPageRequest } from '@/services/remote-api/models/page.request'

const productService = new ProductService()
const benefitStructureService = new BenefitStructureService()
const benefitService = new BenefitService()
const premiumFrequencyService = new PremiumFrequencyService()

const useStyles = (theme: any) => ({
  header: {
    display: 'flex',
    alignItems: 'center'
  },
  customMaxWidth: {
    maxWidth: 'none' // arbitrary value
  },
  formControl: {
    margin: theme?.spacing ? theme.spacing(1) : '8px',
    width: '100%'
  },
  ruleDefinitionSection: {
    padding: 15
  },
  rowActionBtn: {
    display: 'flex',
    alignItems: 'center'
  },
  actionBtn: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  emptyMsg: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 500,
    fontStyle: 'italic'
  }
})

const initRuleObject = {
  selectedParameter: '',
  selectedOperator: '',
  ruleValue: '',
  isPercentage: false,
  selectedPercentType: '',
  percentDependsOn: '',
  selectedConnector: '',
  parameterDetails: ''
}

function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()

    return <Component {...props} router={router} />
  }
}

class RuleAddModal extends React.Component<any, any> {
  premiumRuleDtos: any
  constructor(props: any) {
    super(props)

    this.state = {
      productList: [],
      selectedProduct: '',
      selectedProductId: '',
      productDetails: '',
      premiumCurrencyCd: '',
      benefitHierarchy: [],
      rules: [{ ...initRuleObject }],
      parameters: [],
      expression: '',
      premiumPaymentFrequencies: [{ premiumAmount: '', premiumPaymentFrequncyId: '' }],
      validFrom: null,
      validUpTo: null,
      appliedForAll: false,
      ruleName: '',
      ruleList: [],
      premiumFrequncyList: [],
      selectedNode: {},
      premiumRuleDetails: {},
      coverType: 'PER_MEMBER'
    }
    this.premiumRuleDtos = []
  }

  componentDidMount() {
    const productID = this.props.selectedProductId

    premiumFrequencyService.getPremiumFrequencies().subscribe((res: any) => {
      this.setState({
        ...this.state,
        premiumFrequncyList: res.content
      })
    })

    if (productID) {
    }
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (this.props.selectedProductId !== prevProps.selectedProductId) {
      const productID = this.props.selectedProductId

      if (productID) {
        this.setState({
          ...this.state,
          selectedProductId: productID
        })

        this.getProductDetails(productID)
        this.getPremiumDetails()
      }
    }

    if (this.props.selectedNodeData !== prevProps.selectedNodeData) {
      if (this.props.selectedNodeData) {
        this.getBenefitParameterDetails(this.props.selectedNodeData)
      }
    }
  }

  productDataSourceCallback$ = (params = {}, action: any, pageRequest = defaultPageRequest) => {
    let reqParam: any = { ...pageRequest, ...params }

    if (action.searchText && action.searchText.length > 2) {
      reqParam = {
        ...reqParam,
        name: action.searchText
      }
      delete reqParam.active
    }

    return productService.getProducts(reqParam)
  }

  handleModalSubmit = (e: any) => {}

  handleClose = () => {
    this.props.handleCloseRuleAdd()
  }

  getProductDetails = (productId: any) => {
    productService.getProductDetails(productId).subscribe((res: any) => {
      this.setState({
        ...this.state,
        productDetails: res,
        premiumCurrencyCd: res.productBasicDetails.premiumCurrencyCd
      })
      this.getAllBenefitStructures()
    })
  }

  getAllBenefitStructures = () => {
    benefitStructureService.getAllBenefitStructures().subscribe((res: any) => {
      if (res.content) {
        this.buildPreviewHierarchy(res.content)
      }
    })
  }

  getChildRuleHierarchy = (parentHierarchy: any, mainBenefitIndex: any, rule: any, newBenefitElm: any) => {
    const parentIdx = parentHierarchy.child.findIndex((item: any) => item.id === rule.parentId)

    if (parentIdx > -1) {
      let benefitIdx = parentHierarchy.child[parentIdx].child.findIndex(
        (benefit: any) => benefit.id === newBenefitElm.id
      )

      if (benefitIdx === -1) {
        parentHierarchy.child[parentIdx].child.push(newBenefitElm)
        benefitIdx = 0
      }

      const o = parentHierarchy.child[parentIdx].child[benefitIdx]

      o.child.push({ ...rule, benefitCode: o.code, child: [], type: 'rule' })
    } else {
      parentHierarchy.child.forEach((item: any) => {
        this.getChildRuleHierarchy(item, mainBenefitIndex, rule, newBenefitElm)
      })
    }
  }

  getChildBenefitHierarchy = (benefitElm: any, rule: any, previewHierarchy: any, mainBenefitIndex: any) => {
    if (benefitElm.child && benefitElm.child.length > 0) {
      const subBenefitIndex = benefitElm.child.findIndex((item: any) => item.id === rule.benefitId)

      if (subBenefitIndex > -1) {
        const newBenefitElm = { ...benefitElm.child[subBenefitIndex], child: [], type: 'benefit' }

        if (rule.parentId) {
          this.getChildRuleHierarchy(
            previewHierarchy[mainBenefitIndex].hirearchy,
            mainBenefitIndex,
            rule,
            newBenefitElm
          )
        }
      } else {
        benefitElm.child.forEach((item: any) => {
          this.getChildBenefitHierarchy(item, rule, previewHierarchy, mainBenefitIndex)
        })
      }
    }
  }

  buildPreviewHierarchy = (benefitStructures: any) => {
    const previewHierarchy = benefitStructures.map((benefit: any) => {
      return { ...benefit, hirearchy: { ...benefit.hirearchy, child: [] } }
    })

    this.state.productDetails.productRules.forEach((rule: any) => {
      const mainBenefitIndex = benefitStructures.findIndex((b: any) => b.id === rule.benefitStructureId)

      if (mainBenefitIndex > -1) {
        const benefitElm = benefitStructures[mainBenefitIndex].hirearchy

        if (benefitElm.id === rule.benefitId) {
          if (!rule.parentId) {
            const o = previewHierarchy[mainBenefitIndex].hirearchy

            o.child.push({ ...rule, benefitCode: o.code, child: [], type: 'rule' })
          }
        } else {
          this.getChildBenefitHierarchy(benefitElm, rule, previewHierarchy, mainBenefitIndex)
        }
      }
    })

    this.setState({
      ...this.state,
      benefitHierarchy: previewHierarchy
    })
  }

  handleAutoComplete = (name: any, e: any, value: any) => {
    this.setState({
      ...this.state,
      selectedProduct: value,
      selectedProductId: value.id
    })

    if (value.id) {
      this.getProductDetails(value.id)
    }
  }

  handleChange = (idx: any) => (e: any) => {
    const { name, value, checked } = e.target
    const rules = [...this.state.rules]

    rules[idx] = {
      ...rules[idx],
      [name]: name === 'isPercentage' ? checked : value
    }

    if (name === 'selectedConnector') {
      this.handleAddMore(rules, idx)

      return
    }

    if (name === 'selectedParameter') {
      const selectedParam = this.state.parameters.filter((item: any) => item.id === value)

      rules[idx].parameterDetails = selectedParam[0]
    }

    this.setState({
      ...this.state,
      rules: [...rules]
    })
  }

  findChildRules = (childItem: any, nodeData: any) => {
    if (nodeData) {
      if (childItem.id === nodeData.benefitId) {
        this.premiumRuleDtos = childItem.child.map((o: any) => ({
          productRuleId: o.id,
          premiumRuleDetailsDtos: [],
          parentRuleId: nodeData.parentId
        }))
      } else {
        childItem.child.map((item: any) => {
          this.findChildRules(item, nodeData)
        })
      }
    }
  }

  getBenefitParameterDetails = (nodeData: any) => {
    //
    let ruleList: any = {}

    this.premiumRuleDtos = []

    /**
     * build table from API Response (Edit)
     */
    const ruleDto = this.state.premiumRuleDetails

    if (ruleDto.premiumRuleDtos && ruleDto.premiumRuleDtos.length > 0 && nodeData) {
      const pList = ruleDto.premiumRuleDtos.filter((p: any) => p.productRuleId === nodeData.id)

      ruleList = pList.length > 0 ? pList[pList.length - 1] : {}
    }

    /**
     * build table from create functionality (Create/Update)
     */
    if (this.premiumRuleDtos.length > 0 && nodeData) {
      const pList = this.premiumRuleDtos.filter((p: any) => p.productRuleId === nodeData.id)

      ruleList =
        pList.length > 0
          ? {
              ...ruleList,
              premiumRuleDetailsDtos: [...(ruleList?.premiumRuleDetailsDtos || []), ...pList[0].premiumRuleDetailsDtos]
            }
          : { ...ruleList }
    }

    this.setState({
      ...this.state,
      ruleList: ruleList.premiumRuleDetailsDtos || []
    })

    /**
     * Initially when the premium payload is empty, create the payload object.
     */
    if (this.premiumRuleDtos.length === 0 || (nodeData && this.premiumRuleDtos[0].parentRuleId !== nodeData.parentId)) {
      this.premiumRuleDtos = []

      if (nodeData) {
        this.state.benefitHierarchy.forEach((item: any) => {
          if (item.hirearchy.id === nodeData.benefitId) {
            this.premiumRuleDtos = item.hirearchy.child.map((o: any) => ({
              productRuleId: o.id,
              premiumRuleDetailsDtos: [],
              parentRuleId: nodeData.parentId
            }))
          } else {
            item.hirearchy.child.map((childItem: any) => {
              this.findChildRules(childItem, nodeData)
            })
          }
        })
      }

      //
    }

    if (ruleList.premiumRuleDetailsDtos) {
      ruleList.premiumRuleDetailsDtos.forEach((item: any) => {
        this.buildPayload(item, false, nodeData.id)
      })
    }

    //

    const paramData = (nodeData && nodeData.hirearchy) || nodeData

    if (paramData?.type === 'rule') {
      benefitService.getBenefitParameterDetails(paramData.benefitCode).subscribe((res: any) => {
        const parameters = res.parameters.filter((p: any) => p.isEligibleForPremium)

        this.setState({
          ...this.state,
          parameters,
          selectedNode: nodeData
        })
      })
    }
  }

  getParameterTypeByID = (id: any) => {
    if (!id) return

    return this.state.parameters.filter((item: any) => item.id === id)[0].name
  }

  buildMenuForDropdownRange = (paramDetails: any) => {
    const menuList = []

    for (let idx = paramDetails.start; idx <= paramDetails.end; idx += paramDetails.count) {
      menuList.push(
        <MenuItem key={idx} value={idx}>
          {idx}
        </MenuItem>
      )
    }

    return menuList
  }

  handleAddMore = (ruleList: any, idx: number) => {
    if (idx === this.state.rules.length - 1) {
      const item = { ...initRuleObject }

      /** When Select Connector changes */
      if (ruleList) {
        item.selectedParameter = this.state.rules[this.state.rules.length - 1].selectedParameter
        item.parameterDetails = this.state.rules[this.state.rules.length - 1].parameterDetails

        this.setState({
          ...this.state,
          rules: [...ruleList, item]
        })
      } else {
        /** When Add button click */
        const rules = [...this.state.rules]

        rules[idx] = {
          ...rules[idx],
          selectedConnector: '&&',
          addClicked: true
        }

        this.setState({
          ...this.state,
          rules: [...rules, item]
        })
      }
    } else {
      this.setState({
        ...this.state,
        rules: [...ruleList]
      })
    }
  }

  handleRemoveRow = (idx: any) => (e: any) => {
    this.state.rules.splice(idx, 1)
    this.setState({
      ...this.state,
      rules: this.state.rules
    })
  }

  handleAddPremiumAmt = () => {
    const premiumPaymentFrequencies = [
      ...this.state.premiumPaymentFrequencies,
      { premiumAmount: '', premiumPaymentFrequncyId: '' }
    ]

    this.setState({
      ...this.state,
      premiumPaymentFrequencies
    })
  }

  handleRemovePremiumAmt = (idx: any) => (e: any) => {
    this.state.premiumPaymentFrequencies.splice(idx, 1)
    this.setState({
      ...this.state,
      premiumPaymentFrequencies: this.state.premiumPaymentFrequencies
    })
  }

  goToListPage = () => {
    // this.props.router.push("/premium?mode=viewList");
  }

  handlePremiumInfo = (idx: any, e: any) => {
    // const { name, value } = e.target

    // this.state.premiumPaymentFrequencies[idx][name] = value
    // this.setState({
    //   ...this.state,
    //   premiumPaymentFrequencies: this.state.premiumPaymentFrequencies
    // })
    this.setState((prevState: any) => {
      const { name, value } = e.target
      const updatedFrequencies = [...prevState.premiumPaymentFrequencies]

      updatedFrequencies[idx] = {
        ...updatedFrequencies[idx],
        [name]: value
      }

      return { premiumPaymentFrequencies: updatedFrequencies }
    })
  }

  handleValidFromChange = (date: any) => {
    this.setState({
      ...this.state,
      validFrom: date
    })
  }
  handleValidToChange = (date: any) => {
    this.setState({
      ...this.state,
      validUpTo: date
    })
  }

  ruleTextstring = () => {
    /** Rule text population */
    const state = this.state
    let populateRuleText = ''

    state.rules.map((item: any, idx: number) => {
      if (item.parameterDetails) {
        const op = item.parameterDetails.paramterComparisonTypes.filter((o: any) => o.id === item.selectedOperator)

        if (op.length > 0) {
          if (idx > 0 && idx < state.rules.length) {
            populateRuleText += ' '
          }

          const findElem = state.rules.map((o: any) => o.selectedParameter === item.selectedParameter)
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

            if (item.selectedConnector && idx < state.rules.length - 1) {
              populateRuleText += ` &&`
            }
          } else if (item.selectedConnector && idx < state.rules.length - 1) {
            populateRuleText += ` ${item.selectedConnector}`
          }
        }
      }
    })

    return populateRuleText
  }

  previewRule = () => {
    const populateRuleText = this.ruleTextstring()

    if (populateRuleText) {
      this.setState({
        ...this.state,
        expression: populateRuleText
      })
    }
  }

  buildRuleDto = (newRuleObject: any) => {
    return {
      name: newRuleObject.name,
      expression: newRuleObject.expression,
      expressionConfiugrationStub: newRuleObject.expressionConfiugrationStub || JSON.stringify(newRuleObject.rules),
      premiumPaymentFrequencies: newRuleObject.premiumPaymentFrequencies.map((o: any) => {
        return {
          premiumPaymentFrequncyId: o.premiumPaymentFrequncyId,
          premiumAmount: o.premiumAmount
        }
      }),
      validFrom: newRuleObject.validFrom,
      validUpTo: newRuleObject.validUpTo,
      coverType: newRuleObject.coverType
    }
  }

  buildPayload = (newRuleObject: any, applyForAll: any, selectedNodeId = this.props.selectedNodeData.id) => {
    if (applyForAll) {
      this.premiumRuleDtos = this.premiumRuleDtos.map((ruleDto: any) => {
        if (!ruleDto.premiumRuleDetailsDtos) {
          ruleDto.premiumRuleDetailsDtos = []
        }

        ruleDto.premiumRuleDetailsDtos.push(this.buildRuleDto(newRuleObject))

        return ruleDto
      })
    } else {
      const idx = this.premiumRuleDtos.findIndex((r: any) => r.productRuleId === selectedNodeId)

      if (idx === -1) {
        this.premiumRuleDtos.push({ premiumRuleDetailsDtos: this.buildRuleDto(newRuleObject) })
      } else {
        if (!this.premiumRuleDtos[idx].premiumRuleDetailsDtos) {
          this.premiumRuleDtos[idx].premiumRuleDetailsDtos = []
        }

        this.premiumRuleDtos[idx].premiumRuleDetailsDtos.push(this.buildRuleDto(newRuleObject))
      }
    }
  }

  getFrequencyName = (id: any) => {
    if (!id) return ''

    return this.state.premiumFrequncyList.find((f: any) => f.id === id).name
  }

  addToTable = () => {
    const { rules, premiumPaymentFrequencies, expression, validFrom, validUpTo, appliedForAll, ruleName, coverType } =
      this.state

    const newPremiumAmountInfo = premiumPaymentFrequencies.map((p: any) => ({
      ...p,
      frequencyName: p.premiumPaymentFrequncyId ? this.getFrequencyName(p.premiumPaymentFrequncyId) : ''
    }))

    const newRuleObject = {
      rules,
      premiumPaymentFrequencies: newPremiumAmountInfo,
      expression,
      validFrom: (validFrom && Date.now()) || null,
      validUpTo: (validUpTo && Date.now()) || null,
      name: ruleName,
      coverType
    }

    this.buildPayload(newRuleObject, appliedForAll)

    this.setState({
      ...this.state,
      rules: [{ ...initRuleObject }],
      expression: '',
      premiumPaymentFrequencies: [{ premiumAmount: '', premiumPaymentFrequncyId: '' }],
      validFrom: null,
      validUpTo: null,
      ruleName: '',
      coverType: 'PER_MEMBER',
      appliedForAll: false,
      ruleList: [...this.state.ruleList, newRuleObject]
    })
  }

  handleChangeInfo = (e: any) => {
    const { name, value, checked } = e.target

    this.setState({
      ...this.state,
      [name]: name === 'appliedForAll' ? checked : value
    })
  }

  savePremiums = () => {
    this.premiumRuleDtos.forEach((pr: any) => {
      pr.premiumRuleDetailsDtos.forEach((pd: any) => {
        pd.premiumPaymentFrequencies.map((el: any) => (el.premiumAmount = Number(el.premiumAmount)))
      })
    })

    const payload: any = {
      premiumRuleDtos: this.premiumRuleDtos.filter((p: any) => p.premiumRuleDetailsDtos.length > 0)
    }

    // let payload = this.premiumRuleDtos.filter(( p:any )=> p.premiumRuleDetailsDtos.length > 0)
    productService.savePremiums(payload, this.state.selectedProductId).subscribe((res: any) => {
      this.props.refreshPremiumRules()
    })
  }

  getPremiumDetails = () => {
    productService.getPremiums(this.props.selectedProductId).subscribe((res: any) => {
      this.setState({
        ...this.state,
        premiumRuleDetails: res
      })
    })
  }

  render() {
    const { classes } = this.props

    const {
      selectedProductId,
      premiumCurrencyCd,
      benefitHierarchy,
      parameters,
      rules,
      expression,
      premiumPaymentFrequencies,
      ruleList,
      validFrom,
      validUpTo,
      ruleName,
      premiumFrequncyList,
      appliedForAll,
      coverType
    } = this.state

    return (
      <Dialog
        open={this.props.openRuleAdd}
        onClose={this.handleClose}
        aria-labelledby='form-dialog-title'
        maxWidth='lg'
        disableEnforceFocus
      >
        <DialogTitle id='form-dialog-title'>Add Rule for {this.props.productRuleHeader}</DialogTitle>
        <DialogContent>
          <div className={classes.premiumDesignRoot}>
            {/* <div className={classes.header}>
                    <IconButton aria-label="delete" className={classes.margin} onClick={this.goToListPage}>
                        <ArrowBackIosIcon />
                    </IconButton>
                    <Typography variant="h6" gutterBottom>Premium Management</Typography>
                </div> */}

            <Grid container spacing={1} style={{ marginTop: 15 }}>
              {/* <Grid item xs={4}>
                        <Paper elevation='none' style={{ minHeight: 500 }}>
                            {!selectedProductId &&
                                <Typography variant="h6" gutterBottom className={classes.emptyMsg}>
                                    Please select a product to get hierachy
                                </Typography>
                            }
                            <FettleBenefitRuleTreeViewComponent hierarchy={benefitHierarchy} onNodeSelect={this.getBenefitParameterDetails} />
                        </Paper>
                    </Grid> */}
              <Grid item xs={12}>
                <Paper elevation={0} style={{ minHeight: 500 }}>
                  <div className={classes.ruleDefinitionSection}>
                    {rules.map((rule: any, idx: any) => (
                      <Grid key={idx} container spacing={3}>
                        <Grid item xs={2}>
                          <FormControl className={classes.formControl}>
                            <InputLabel id='select-parameter-label'>Select Parameter</InputLabel>
                            <Select
                              name='selectedParameter'
                              value={rules[idx].selectedParameter ?? ''}
                              onChange={this.handleChange(idx)}
                              displayEmpty
                              className={classes.selectEmpty}
                              inputProps={{ 'aria-label': 'Without label' }}
                            >
                              {parameters &&
                                parameters.map((param: any) => (
                                  <MenuItem key={param.id} value={param.id}>
                                    {param.name}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={2}>
                          <FormControl className={classes.formControl}>
                            <InputLabel id='select-operator-label'>Operator</InputLabel>
                            <Select
                              name='selectedOperator'
                              value={rules[idx].selectedOperator ?? ''}
                              onChange={this.handleChange(idx)}
                              displayEmpty
                              className={classes.selectEmpty}
                              inputProps={{ 'aria-label': 'Without label' }}
                            >
                              {rules[idx].parameterDetails?.paramterComparisonTypes.map((item: any) => (
                                <MenuItem key={item.id} value={item.id} disabled={item.disabled}>
                                  {item.symbol}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={2}>
                          {(() => {
                            switch (rules[idx].parameterDetails?.paramterUiRenderType?.type) {
                              case 'dropdown':
                                return (
                                  <FormControl className={classes.formControl}>
                                    <InputLabel id='select-value-label'>Select Value</InputLabel>
                                    <Select
                                      name='ruleValue'
                                      value={rules[idx].ruleValue ?? ''}
                                      onChange={this.handleChange(idx)}
                                      displayEmpty
                                      className={classes.selectEmpty}
                                      inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                      {rules[idx].parameterDetails.parameterValues.map((item: any) => (
                                        <MenuItem key={item} value={item}>
                                          {item}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                )
                              case 'dropdown_range':
                                return (
                                  <FormControl className={classes.formControl}>
                                    <InputLabel id='select-value-label'>Select Value</InputLabel>
                                    <Select
                                      name='ruleValue'
                                      value={rules[idx].ruleValue ?? ''}
                                      onChange={this.handleChange(idx)}
                                      displayEmpty
                                      className={classes.selectEmpty}
                                      inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                      {this.buildMenuForDropdownRange(rules[idx].parameterDetails)}
                                    </Select>
                                  </FormControl>
                                )
                              default:
                                return (
                                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <FormControl className={classes.formControl}>
                                      <TextField
                                        type={
                                          rules[idx].parameterDetails?.paramterDataType?.type === 'numeric'
                                            ? 'number'
                                            : 'text'
                                        }
                                        name='ruleValue'
                                        value={rules[idx].ruleValue ?? ''}
                                        label='Value'
                                        onChange={this.handleChange(idx)}
                                      />
                                    </FormControl>
                                  </div>
                                )
                            }
                          })()}
                        </Grid>

                        <Grid item xs={2}>
                          <FormControl className={classes.formControl}>
                            <InputLabel id='select-connector-label'>Select Connector</InputLabel>
                            <Select
                              name='selectedConnector'
                              value={rules[idx].selectedConnector ?? ''}
                              onChange={this.handleChange(idx)}
                              displayEmpty
                              className={classes.selectEmpty}
                              inputProps={{ 'aria-label': 'Without label' }}
                              disabled={rules[idx]?.addClicked}
                            >
                              <MenuItem value='&&'>AND</MenuItem>
                              <MenuItem value='||'>OR</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={2} className={classes.rowActionBtn}>
                          {rules.length > 1 && (
                            <Box>
                              <IconButton color='secondary' aria-label='delete' onClick={this.handleRemoveRow(idx)}>
                                <RemoveCircleOutlineIcon />
                              </IconButton>
                            </Box>
                          )}
                          {idx === rules.length - 1 && (
                            <Box>
                              <IconButton
                                color='primary'
                                aria-label='add'
                                onClick={this.handleAddMore.bind(this, null, idx)}
                              >
                                <AddCircleOutlineIcon />
                              </IconButton>
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    ))}

                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <FormControl className={classes.formControl}>
                          <TextField
                            name='ruleTextArea'
                            label='Rule Text Area'
                            value={expression}
                            disabled
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <IconButton aria-label='toggle password visibility' onClick={this.previewRule}>
                                    <Visibility />
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={8}>
                        <FormControl style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <FormLabel style={{ paddingRight: 28, paddingLeft: 5 }}>Cover Type</FormLabel>
                          <RadioGroup
                            row
                            aria-label='coverType'
                            name='coverType'
                            value={coverType}
                            onChange={this.handleChangeInfo}
                          >
                            <FormControlLabel
                              value='PER_MEMBER'
                              control={<Radio color='primary' />}
                              label='Per Member'
                            />
                            <FormControlLabel
                              value='PER_FAMILY'
                              control={<Radio color='primary' />}
                              label='Per Family'
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Grid container spacing={3}>
                          {premiumPaymentFrequencies.map((item: any, id: any) => (
                            <React.Fragment key={id}>
                              <Grid item xs={4}>
                                <FormControl className={classes.formControl}>
                                  <TextField
                                    name='premiumAmount'
                                    label='Premium Amount'
                                    value={item.premiumAmount}
                                    onChange={(e: any) => this.handlePremiumInfo(id, e)}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs={4}>
                                <FormControl className={classes.formControl}>
                                  <InputLabel id='select-search-by-label'>Payment Frequency</InputLabel>
                                  <Select
                                    name='premiumPaymentFrequncyId'
                                    displayEmpty
                                    className={classes.selectEmpty}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    value={item.premiumPaymentFrequncyId}
                                    onChange={(e: any) => this.handlePremiumInfo(id, e)}
                                  >
                                    {premiumFrequncyList.map((freq: any) => (
                                      <MenuItem key={freq.code} value={freq.id}>
                                        {freq.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                                {premiumPaymentFrequencies.length > 1 && (
                                  <Box>
                                    <IconButton
                                      color='primary'
                                      aria-label='add'
                                      onClick={this.handleRemovePremiumAmt(id)}
                                    >
                                      <RemoveCircleIcon />
                                    </IconButton>
                                  </Box>
                                )}
                                {id === premiumPaymentFrequencies.length - 1 && (
                                  <Box>
                                    <IconButton
                                      color='primary'
                                      aria-label='add'
                                      onClick={this.handleAddPremiumAmt.bind(this)}
                                    >
                                      <LibraryAddIcon />
                                    </IconButton>
                                  </Box>
                                )}
                              </Grid>
                            </React.Fragment>
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid item xs={4}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            label='Valid from'
                            value={validFrom}
                            onChange={this.handleValidFromChange}
                            renderInput={params => <TextField {...params} margin='normal' />}
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            label='Valid upto'
                            value={validUpTo}
                            onChange={this.handleValidToChange}
                            renderInput={params => <TextField {...params} margin='normal' />}
                          />
                        </Grid>
                      </LocalizationProvider>
                      {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid item xs={4}>
                          <KeyboardDatePicker
                            views={['year', 'month', 'date']}
                            variant='inline'
                            format='MM/dd/yyyy'
                            margin='normal'
                            id='valid-from'
                            autoOk={true}
                            label='Valid from'
                            name='validFrom'
                            value={validFrom}
                            onChange={this.handleValidFromChange}
                            KeyboardButtonProps={{
                              'aria-label': 'change date'
                            }}
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <KeyboardDatePicker
                            views={['year', 'month', 'date']}
                            variant='inline'
                            format='MM/dd/yyyy'
                            margin='normal'
                            id='valid-upto'
                            autoOk={true}
                            label='Valid upto'
                            name='validUpTo'
                            value={validUpTo}
                            onChange={this.handleValidToChange}
                            KeyboardButtonProps={{
                              'aria-label': 'change date'
                            }}
                          />
                        </Grid>
                      </MuiPickersUtilsProvider> */}
                      <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                        <FormControl className={classes.formControl}>
                          <TextField
                            name='ruleName'
                            value={ruleName}
                            label='Rule Name'
                            onChange={this.handleChangeInfo}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                      <Grid
                        item
                        xs={12}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              name='appliedForAll'
                              checked={appliedForAll}
                              color='primary'
                              onChange={this.handleChangeInfo}
                            />
                          }
                          label='This premium Rule is valid for all rules of the selected benefit'
                        />
                        <Button
                          color='primary'
                          style={{ marginRight: '5px' }}
                          onClick={this.addToTable}
                          disabled={!expression || !ruleName}
                        >
                          Add to table
                        </Button>
                      </Grid>
                    </Grid>
                    {ruleList.length > 0 && (
                      <React.Fragment>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <PremiumRuleTable
                              ruleList={ruleList}
                              forBenefit={undefined}
                              setEditIndex={undefined}
                              handleEdit={undefined}
                              onClickEdit={undefined}
                            />
                          </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                          <Grid
                            item
                            xs={12}
                            style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
                          >
                            {/* <Button
                                                    variant="contained"
                                                    color="primary"
                                                    style={{ marginRight: "5px" }}
                                                    onClick={this.savePremiums}
                                                >
                                                    Save
                                                </Button> */}
                          </Grid>
                        </Grid>
                      </React.Fragment>
                    )}
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color='primary' className='p-button-text'>
            Cancel
          </Button>
          {/* <Button
                                            variant="contained"
                                            color="primary"
                                            style={{ marginRight: "5px" }}
                                            onClick={this.addToTable}
                                            disabled={!expression || !ruleName}
                                        >
                                            Add
                                        </Button> */}
          {ruleList.length > 0 && (
            <Button color='primary' style={{ marginRight: '5px' }} onClick={this.savePremiums}>
              Save
            </Button>
          )}
          {/* <Button onClick={this.handleModalSubmit} color="primary">
                    Submit
                </Button> */}
        </DialogActions>
      </Dialog>
    )
  }
}
export default withRouter(withStyles(useStyles)(RuleAddModal))
