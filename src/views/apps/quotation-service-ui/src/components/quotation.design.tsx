interface PremiumRule {
  id: string
  name: string
  expression: string
  premiumAmount: number
  headCount: number
  sumOfPremium: number
  coverage?: number
  newCoverage?: number
  premiumPaymentFrequencies: PremiumFrequency[]
}

interface PremiumFrequency {
  premiumPaymentFrequncyId: string
  premiumAmount: number
}

interface CategoryRow {
  categoryId: string
  categoryName: string
  premiumRules: PremiumRule[]
  headCount: number
}

interface Agent {
  name: string
  agentId: string
  commissionType: string
  commission: number
  finalValue: number
}

interface QuotationState {
  selectedProductId: string
  selectedPlan: string
  benefitHierarchy: any[]
  productDetails: any
  planDetails: any
  premiumCurrencyCd: string
  premiumRuleDetails: any
  rows: CategoryRow[]
  discount: number
  loading: number
  totalPremiumAfterLoadingAndDiscount: number
  openSnackbar: boolean
  snackbarMsg: string
  alertType: 'success' | 'warning' | 'error' | 'info'
  premiumFrequncyList: any[]
  selectedFrequencyId: string
  totalPremium: number
  quotationDetails: any
  buttonTxt: string
  agentsList: Agent[]
  members: any[]
  openAgentModal: boolean
  isRetail: boolean
  customCategory: CategoryRow[]
  memberColDefn: any[]
  benefitRuleIdsOfFunded: string[]
  planSchemeEmpty: boolean
  isPlanSchemeSaved: boolean
  dataTable: any[]
  showMemberTable: boolean
  openDecisionModal: boolean
  radioDecision: string
  decision: string
  comment: string
  openModal: boolean
  openTemplate: boolean
  openPreview: boolean
  apiList: any[]
  isAdminFeesApplied?: string[]
  proceed: boolean
  customPrimumData: any[]
  refetchedPremiumRuleDetails: any
  customPayload: any
  taxList: any[]
  triggeredDrop: boolean
  totalAmountWithTax: number
}

const MEMBER_AGE_THRESHOLD = 49
const DEBOUNCE_DELAY = 10000
const SNACKBAR_DURATION = 3000

enum QuotationStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

enum CalculationStatus {
  COMPLETED = 'COMPLETED',
  INPROGRESS = 'INPROGRESS',
  FAILED = 'FAILED'
}

enum MemberUploadStatus {
  COMPLETED = 'COMPLETED',
  INPROGRESS = 'INPROGRESS'
}

const getStorageItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    return null
  }
}

const getStorageJSON = <T,>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    return null
  }
}

const sanitizeNumberInput = (value: string): string => {
  return value.replace(/[^0-9]/g, '')
}

const calculatePercentageAmount = (percentage: number, total: number): number => {
  return (percentage / 100) * total
}

const generateRandomId = (): string => {
  return `_${Math.random().toString(36).substr(2, 9)}`
}

const getRandomNumberWith2to5Digits = (): number => {
  const digitCount = Math.floor(Math.random() * 4) + 2
  const min = Math.pow(10, digitCount - 1)
  const max = Math.pow(10, digitCount) - 1
  return Math.floor(Math.random() * (max - min + 1)) + min
}

import React from 'react'
import { Subscription } from 'rxjs'
import {
  Grid, Paper, Button, TextField, Table, TableBody, TableCell,
  TableHead, TableRow, Accordion, AccordionSummary, AccordionDetails,
  Typography, Divider, Tooltip, IconButton, FormControl, InputLabel,
  Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Box,
  TableContainer,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import { Alert, AlertTitle } from '@mui/lab'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { withStyles, withTheme } from '@mui/styles'
import { useRouter, useSearchParams } from 'next/navigation'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { delay, EMPTY, expand, forkJoin, map, switchMap } from 'rxjs'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'

// Services
import { BenefitStructureService } from '@/services/remote-api/api/benefit-structure-services'
import { PremiumFrequencyService } from '@/services/remote-api/api/master-services'
import { MemberProcessService, MemberService } from '@/services/remote-api/api/member-services'
import { PlanService } from '@/services/remote-api/api/plan-services'
import { ProductService } from '@/services/remote-api/api/product-services'
import { QuotationService } from '@/services/remote-api/api/quotation-services'
import { AgentsService, defaultPageRequest, TaxService } from '@/services/remote-api/fettle-remote-api'
import { replaceAll, toTitleCase } from '@/services/utility'
import { MemberFieldConstants } from '@/views/apps/member-upload-management/MemberFieldConstants'
import {
  FettleAutocomplete,
  FettleBenefitRuleTreeViewComponent,
  FettleDataGrid
} from '@/views/apps/shared-component'

import './css/index.css'
import './css/material-rte.css'
import FileUploadDialogComponent from './file.upload.dialog'
import MemberTemplateModal from './member.template.dialog'
import InvoiceAgentModal from './modals/invoice.agent.modal.component'
import { StatefulTargetBox as TargetBox } from './targetbox'
import { rowsMetaStateInitializer } from '@mui/x-data-grid/internals'
import QuotationDetailsScreen from './preview.dialog'

const styles = (theme: any) => ({
  formControl: {
    margin: theme?.spacing ? theme.spacing(1) : '8px',
    width: '100%'
  },
  ruleContainer: {
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center'
  },
  lineEllipsis: {
    textOverflow: 'ellipsis',
    width: '95%',
    display: 'block',
    overflow: 'hidden'
  },
  AccordionSummary: {
    backgroundColor: theme?.palette?.background.default
  },
  inputRoot: {},
  disabled: {}
})

const HtmlTooltip = withStyles((theme: any) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme?.typography?.pxToRem(12),
    border: '1px solid #dadde9'
  }
}))(Tooltip)
class QuotationHelpers {
  static addRandomEIdToHierarchy(node: any): void {
    node.eId = getRandomNumberWith2to5Digits()

    if (Array.isArray(node.child) && node.child.length > 0) {
      node.child.forEach((childNode: any) => this.addRandomEIdToHierarchy(childNode))
    }
    if (node.hirearchy && Array.isArray(node.hirearchy.child) && node.hirearchy.child.length > 0) {
      node.hirearchy.child.forEach((childNode: any) => this.addRandomEIdToHierarchy(childNode))
    }
  }

  static extractRulesRecursively(element: any): any[] {
    if (!element) return []

    if (element.child && Array.isArray(element.child)) {
      let rules: any[] = []
      for (const item of element.child) {
        rules = [...rules, ...this.extractRulesRecursively(item)]
      }
      return rules
    }

    return [element]
  }

  static findParent(benefitItems: any, ruleObj: any): any {
    if (!benefitItems?.child) return null

    for (const b of benefitItems.child) {
      const elm = b.child?.filter((c: any) => c.id === ruleObj.parentId)
      if (elm && elm.length > 0) {
        return elm[0]
      }

      const parentRule = this.findParent(b, ruleObj)
      if (parentRule) return parentRule
    }

    return null
  }

  static getTotalPremium(rows: CategoryRow[]): number {
    return rows.reduce((acc, currVal) => {
      if (currVal.premiumRules.length > 0) {
        return acc + currVal.premiumRules.reduce((a, c) => a + c.sumOfPremium, 0)
      }
      return acc
    }, 0)
  }
}

class QuotationServiceLayer {
  private productService: ProductService
  private benefitStructureService: BenefitStructureService
  private planService: PlanService
  private premiumFrequencyService: PremiumFrequencyService
  private memberService: MemberService
  private quotationService: QuotationService
  private memberProcessService: MemberProcessService
  private agentService: AgentsService
  private taxservice: TaxService

  constructor() {
    this.productService = new ProductService()
    this.benefitStructureService = new BenefitStructureService()
    this.planService = new PlanService()
    this.premiumFrequencyService = new PremiumFrequencyService()
    this.memberService = new MemberService()
    this.quotationService = new QuotationService()
    this.memberProcessService = new MemberProcessService()
    this.agentService = new AgentsService()
    this.taxservice = new TaxService()
  }

  getDataSourceMember$(pageRequest: any = { page: 0, size: 10, summary: true, active: true }) {
    pageRequest.key = 'sourceType'
    pageRequest.value = 'QUOTATION'
    pageRequest.key2 = 'sourceId'
    pageRequest.value2 = getStorageItem('quotationId')
    return this.memberProcessService.getMemberRequests(pageRequest)
  }

  getProductDetails(productId: string) {
    return this.productService.getProductDetails(productId)
  }

  getPremiumDetails(productId: string) {
    return this.productService.getPremiums(productId)
  }

  getPlanDetails(planId: string) {
    return this.planService.getPlanDetails(planId)
  }

  getAllBenefitStructures() {
    return this.benefitStructureService.getAllBenefitStructures({
      page: 0,
      size: 1000000,
      summary: true
    })
  }

  getPremiumFrequencies() {
    return this.premiumFrequencyService.getPremiumFrequencies()
  }

  getMemberConfiguration() {
    return this.memberService.getMemberConfiguration()
  }

  getSourceDetails(sourceId: string) {
    return this.memberService.getSourceDetails(sourceId)
  }

  savePlanScheme(payload: any, sourceType: string, sourceId: string) {
    return this.memberService.savePlanScheme(payload, sourceType, sourceId)
  }

  addPlanCategory(categories: any[], planId: string) {
    return this.planService.addPlanCategory(categories, planId)
  }

  updateQuotation(pageRequest: any, payload: any, quotationId: string) {
    return this.quotationService.updateQuotation(pageRequest, payload, quotationId)
  }

  uploadDiscountAndLoading(payload: any, quotationId: string) {
    return this.quotationService.uploadDiscountAndLoading(payload, quotationId)
  }

  requestForApproval(quotationId: string) {
    return this.quotationService.requestForApproval(quotationId)
  }

  getQuotationDetailsByID(quotationId: string) {
    return this.quotationService.getQuoationDetailsByID(quotationId)
  }

  uploadMedicalReport(memberId: string, formData: FormData) {
    return this.quotationService.uploadMedicalReport(memberId, formData)
  }

  quotationDecision(payload: any, quotationId: string) {
    return this.quotationService.quotationDecision(payload, quotationId)
  }

  getAgentDetails(agentId: string) {
    return this.agentService.getAgentDetails(agentId)
  }

  importAgentData(pageRequest: any) {
    return this.agentService.importAgentData(pageRequest)
  }

  getPlanFromProduct(productId: string) {
    return this.planService.getPlanFromProduct(productId)
      .pipe(map((res: any) => ({ content: res, totalElements: res.length })))
  }

  getProducts(reqParam: any) {
    return this.productService.getProducts(reqParam)
  }

  getCustomCoveragePremium(payload: any) {
    return this.productService.customCoveragePremium(payload)
  }

  createCustomPremium(id: any, payload: any) {
    return this.productService.customPremiumCreation(id, payload)
  }

  getTaxes(reqParam: any) {
    return this.taxservice.getTaxes(reqParam)
  }
}

function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()
    const query = useSearchParams()
    return <Component {...props} router={router} query={query} />
  }
}
class QuotationDesignComponent extends React.Component<any, QuotationState> {
  private subscriptions: Subscription[] = []
  private services: QuotationServiceLayer
  private query: any
  private mode: string | null
  private memberConfiguration: any

  constructor(props: any) {
    super(props)

    this.services = new QuotationServiceLayer()
    this.query = this.props.query
    this.mode = this.query.get('mode')

    this.state = {
      selectedProductId: '',
      selectedPlan: '',
      benefitHierarchy: [],
      productDetails: {},
      planDetails: {},
      premiumCurrencyCd: '',
      premiumRuleDetails: {},
      rows: [],
      discount: 0,
      loading: 0,
      totalPremiumAfterLoadingAndDiscount: 0,
      openSnackbar: false,
      snackbarMsg: '',
      alertType: 'success',
      premiumFrequncyList: [],
      selectedFrequencyId: '',
      totalPremium: 0,
      quotationDetails: {},
      buttonTxt: 'Calculate Premium',
      agentsList: [],
      members: [],
      openAgentModal: false,
      isRetail: true,
      customCategory: [],
      memberColDefn: [],
      benefitRuleIdsOfFunded: [],
      planSchemeEmpty: false,
      isPlanSchemeSaved: false,
      dataTable: [],
      showMemberTable: false,
      openDecisionModal: false,
      radioDecision: '',
      decision: '',
      comment: '',
      openModal: false,
      openTemplate: false,
      openPreview: false,
      apiList: [],
      proceed: false,
      customPrimumData: [],
      refetchedPremiumRuleDetails: null,
      customPayload: [],
      taxList: [],
      totalAmountWithTax: 0,
      triggeredDrop: false,
    }

    this.memberConfiguration = {
      enableSelection: false,
      scrollHeight: '300px',
      pageSize: 10,
      actionButtons: false,
      onLoadedData: this.onLoadedData,
      editCell: true,
      header: {
        enable: true,
        text: 'Member Management',
        addCreateButton: true,
        createButtonText: 'Save',
        createButtonIcon: 'pi pi-save',
        onCreateButtonClick: this.saveRowEdit
      }
    }

    this.initializeComponent()
  }

  // componentDidMount() {
  //   const { quotationDetails } = this.props
  //   if (quotationDetails.premiumCalculationStatus == "COMPLETED") {
  //     this.setState({ proceed: true })
  //   }
  //   this.loadQuotationAgents(quotationDetails)
  // }

  componentDidMount() {
    // CHANGED: Fetch quotation details from API instead of using props
    this.fetchQuotationDetails()
  }

  // componentDidUpdate(prevProps: any) {
  //   const { quotationDetails } = this.props

  //   if (quotationDetails !== this.state.quotationDetails) {
  //     this.handleQuotationDetailsUpdate(quotationDetails)
  //   }
  // }

  componentDidUpdate(prevProps: any, prevState: any) {
    // CHANGED: Re-fetch if quotationId changes
    const currentQuotationId = getStorageItem('quotationId')
    const prevQuotationId = prevState.quotationDetails?.id

    if (currentQuotationId && currentQuotationId !== prevQuotationId) {
      this.fetchQuotationDetails()
    }
  }

  componentWillUnmount() {
    this.subscriptions.forEach(sub => {
      if (sub && !sub.closed) {
        sub.unsubscribe()
      }
    })
  }

  private initializeComponent = () => {
    this.getPaymentFrequencies()
    this.getMemberConfig()
    this.getMemberConfiguration()
    this.getAgentDetails()
    this.getTaxes()
  }

  private fetchQuotationDetails = () => {
    const quotationId = getStorageItem('quotationId')
    if (!quotationId) {
      this.toggleSnackbar(true, 'error', 'Quotation ID not found')
      return
    }

    const sub = this.services.getQuotationDetailsByID(quotationId).subscribe({
      next: (quotationDetails: any) => {
        if (quotationDetails.premiumCalculationStatus === "COMPLETED") {
          this.setState({ proceed: true })
        }
        this.loadQuotationAgents(quotationDetails)
        this.handleQuotationDetailsUpdate(quotationDetails)
      },
      error: (error) => {
        console.error('Error fetching quotation details:', error)
        this.toggleSnackbar(true, 'error', 'Failed to load quotation details')
      }
    })
    this.subscriptions.push(sub)
  }

  private loadQuotationAgents = (quotationDetails: any) => {
    if (!quotationDetails?.quotationAgents) return

    const temp: Agent[] = []
    quotationDetails.quotationAgents.forEach((el: any) => {
      const sub = this.services.getAgentDetails(el.agentId).subscribe({
        next: (res: any) => {
          const item: Agent = {
            name: res.agentBasicDetails.name,
            agentId: res.id,
            commissionType: el.commissionType,
            commission: el.commissionValue,
            finalValue: Number(el.finalValue)
          }
          temp.push(item)
          this.setState({ agentsList: temp })
        },
        error: (error) => {
          console.error('Error loading agent:', error)
        }
      })
      this.subscriptions.push(sub)
    })
  }

  private handleQuotationDetailsUpdate = (quotationDetails: any) => {
    if (quotationDetails.changeType) {
      this.setState({ quotationDetails })
      return
    }

    this.services.getTaxes({
      page: 0,
      size: 1000,
      summary: true,
      active: true,
    }).subscribe((result: any) => {
      if (result.content && result.content.length > 0) {
        // Create a merged list of taxes
        const mergedList = result.content.map((tx: any) => {
          // find matching tax in quotationDetails
          const match = quotationDetails?.quotationTaxes?.find(
            (inv: any) => inv.taxId === tx.id
          )
          if (tx.mandatory.includes("QUOTATION")) {
            // tx['checked'] = true
            return {
              ...tx,
              checked: true,
              taxVal: match ? match.taxAmount : 0,
            }
          } else {
            return {
              ...tx,
              checked: !!match,
              taxVal: match ? match.taxAmount : 0,
            }

          }
        })

        // Sort based on sortOrder
        mergedList.sort(
          (a: { sortOrder: number }, b: { sortOrder: number }) =>
            a.sortOrder - b.sortOrder
        )

        // ✅ Update state — ensures UI re-renders
        this.calculateTax(mergedList, quotationDetails.totalAfterDicountAndLoadingAmount || quotationDetails.totalPremium || 0)
        this.setState({ taxList: mergedList })
      }
    })

    const pageRequest = {
      page: 0,
      size: 100,
      summary: true,
      active: true
    }

    const temp: Agent[] = []
    quotationDetails.quotationAgents.forEach((el: any) => {
      const sub = this.services.getAgentDetails(el.agentId).subscribe({
        next: (res: any) => {
          const item: Agent = {
            name: res.agentBasicDetails.name,
            agentId: res.id,
            commissionType: el.commissionType,
            commission: el.commissionValue,
            finalValue: Number(el.finalValue)
          }
          temp.push(item)
          this.setState({ agentsList: temp })
        },
        error: (error) => {
          console.error('Error loading agent:', error)
        }
      })
      this.subscriptions.push(sub)
    })


    if (quotationDetails.id) {
      this.setState({
        quotationDetails,
        selectedProductId: quotationDetails.productId,
        selectedPlan: quotationDetails.planId,
        triggeredDrop: Object.keys(quotationDetails.catagoryPremiumRules || {}).length ? true : false,
        discount: quotationDetails.discount || 0,
        loading: quotationDetails.loading || 0,
        totalPremiumAfterLoadingAndDiscount: quotationDetails.totalAfterDicountAndLoadingAmount || quotationDetails.totalPremium || 0,
        totalAmountWithTax: quotationDetails.totalAmountWithTax || quotationDetails.totalAfterDicountAndLoadingAmount || quotationDetails.totalPremium || 0,
      }, () => {
        setTimeout(this.buildPremiumRules, 0)
      })
    }

    if (quotationDetails.memberUploadStatus === MemberUploadStatus.COMPLETED) {
      this.fetchMemberUploads()
    }

    if (quotationDetails.memberUploadStatus === MemberUploadStatus.INPROGRESS) {
      this.checkCalculationStatus()
    }
  }

  private getPaymentFrequencies = () => {
    const sub = this.services.getPremiumFrequencies().subscribe({
      next: (res: any) => {
        const selectedFreq = res.content.filter(
          (f: any) => f.name.toLowerCase() === 'per annum'
        )
        this.setState({
          premiumFrequncyList: res.content,
          selectedFrequencyId: this.state.quotationDetails.paymentFrequency || selectedFreq[0]?.id || ''
        })
      },
      error: (error) => {
        console.error('Error fetching payment frequencies:', error)
      }
    })
    this.subscriptions.push(sub)
  }

  private getMemberConfig = () => {
    const sub = this.services.getMemberConfiguration().subscribe({
      next: (res: any) => {
        res.content[0]?.fields.forEach((el: any) => {
          if (el.sourceApiId) {
            this.getAPIDetails(el.sourceApiId)
          }
        })
      },
      error: (error) => {
        console.error('Error fetching member config:', error)
      }
    })
    this.subscriptions.push(sub)
  }

  private getMemberConfiguration = () => {
    const sub = this.services.getMemberConfiguration().subscribe({
      next: (res: any) => {
        if (res.content && res.content.length > 0) {
          const colDef = this.buildMemberColumns(res.content[0].fields)
          this.setState({ memberColDefn: colDef })
        }
      },
      error: (error) => {
        console.error('Error fetching member configuration:', error)
      }
    })
    this.subscriptions.push(sub)
  }

  private buildMemberColumns = (fields: any[]) => {
    const colDef = fields.map((r: any) => {
      const col: any = {
        field: MemberFieldConstants[r?.name?.toUpperCase() as keyof typeof MemberFieldConstants],
        headerName: toTitleCase(replaceAll(r.name, '_', ' '))
      }

      if (r.name === 'DATE_OF_BIRTH') {
        col.body = (rowData: any) => (
          <span style={{ lineBreak: 'anywhere' }}>
            {new Date(rowData.dateOfBirth).toLocaleDateString()}
          </span>
        )
      }

      if (r.name === 'MEMBERSHIP_NO') {
        col.body = (rowData: any) => (
          <span style={{ lineBreak: 'anywhere' }}>{rowData.membershipNo}</span>
        )
      }

      if (r.name === 'MOBILE_NO') {
        col.body = (rowData: any) => (
          <span style={{ lineBreak: 'anywhere' }}>{rowData.mobileNo}</span>
        )
      }

      if (r.name === 'EMAIL') {
        col.body = (rowData: any) => (
          <span style={{ lineBreak: 'anywhere' }}>{rowData.email}</span>
        )
      }

      if (r.name === 'PLAN_SCHEME') {
        col.body = (rowData: any) => (
          <Tag value={rowData.planScheme} severity='success' />
        )
        col.editor = this.editor
        col.style = { width: '10%', minWidth: '8rem' }
        col.bodyStyle = { cursor: 'pointer' }
        col.onCellEditComplete = this.onCellEditComplete
      }

      return col
    })

    const fieldNamesToRemove = [
      'email',
      'mobileNo',
      'membershipNo',
      'identificationDocType',
      'identificationDocNumber'
    ]

    return colDef.filter((column: any) => !fieldNamesToRemove.includes(column.field))
  }

  private getTaxes = () => {

    const sub = this.services.getTaxes({
      page: 0,
      size: 1000,
      summary: true,
      active: true,
    }).subscribe({
      next: (res: any) => {
        if (res.content && res.content.length > 0) {
          res.content.forEach((ele: any) => {
            if (ele.mandatory.includes("QUOTATION")) {
              ele['checked'] = true
            }
            else { ele['checked'] = false }
            ele['taxVal'] = 0
          })
        }
        res.content.sort((a: { sortOrder: number }, b: { sortOrder: number }) => {
          return a.sortOrder - b.sortOrder
        })
        this.setState({ taxList: res.content })
      },
      error: (error) => {
        console.error('Error fetching agent details:', error)
      }
    })
    this.subscriptions.push(sub)
  }

  private getAgentDetails = () => {
    const userType = getStorageItem('userType')
    const userDetails = getStorageJSON<any>('user_details')

    if (userType !== 'AGENT' || !userDetails) return

    const pageRequest = {
      page: 0,
      size: 10,
      summary: false,
      name: userDetails.name
    }

    const sub = this.services.importAgentData(pageRequest).subscribe({
      next: (res: any) => {
        const content = res.content
        if (!content || content.length === 0) return

        const agent: Agent = {
          name: content[0].agentBasicDetails.name,
          agentId: content[0].id,
          commissionType: 'PERCENTAGE',
          commission: content[0].commission,
          finalValue: 0
        }

        this.setState({ agentsList: [agent] })
      },
      error: (error) => {
        console.error('Error fetching agent details:', error)
      }
    })
    this.subscriptions.push(sub)
  }

  private getAPIDetails = (sourceId: string) => {
    const sub = this.services.getSourceDetails(sourceId).subscribe({
      next: (res: any) => {
        this.setState(prevState => ({
          apiList: [...prevState.apiList, res]
        }))
      },
      error: (error) => {
        console.error('Error fetching API details:', error)
      }
    })
    this.subscriptions.push(sub)
  }

  private fetchMemberUploads = () => {
    const sub = this.services.getDataSourceMember$().subscribe({
      next: (page: any) => {
        const sub2 = this.services.getDataSourceMember$({
          page: 0,
          size: page.totalElements
        }).subscribe({
          next: (res: any) => {
            const membersOver49 = res.content.filter(
              (item: any) => item.age > MEMBER_AGE_THRESHOLD
            )
            const planSchemeEmpty = res.content.some(
              (item: any) => ['', undefined, null].includes(item.planScheme)
            )

            this.setState({
              members: membersOver49,
              showMemberTable: planSchemeEmpty
            })
          },
          error: (error: any) => {
            console.error('Error fetching member uploads:', error)
          }
        })
        this.subscriptions.push(sub2)
      },
      error: (error: any) => {
        console.error('Error fetching member page:', error)
      }
    })
    this.subscriptions.push(sub)
  }

  private buildPremiumRules = () => {
    // const { quotationDetails } = this.props
    const { quotationDetails } = this.state
    if (!quotationDetails.productId) return

    const sub = forkJoin([
      this.services.getProductDetails(quotationDetails.productId),
      this.services.getPremiumDetails(quotationDetails.productId)
    ])
      .pipe(
        switchMap((res: any) => {
          const fundedRuleIds = this.extractFundedRuleIds(res[0].productRules)

          this.setState({
            productDetails: res[0],
            premiumCurrencyCd: res[0].productBasicDetails.premiumCurrencyCd,
            premiumRuleDetails: res[1],
            benefitRuleIdsOfFunded: fundedRuleIds
          })

          this.getAllBenefitStructures()
          return this.services.getPlanDetails(quotationDetails.planId)
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res.id) {
            const rows = this.buildCategoryRows(res, quotationDetails)
            this.setState({
              planDetails: res,
              totalPremium: quotationDetails.totalPremium,
              rows
            })
          }
        },
        error: (error) => {
          this.toggleSnackbar(true, 'error', 'Failed to load premium rules')
        }
      })
    this.subscriptions.push(sub)
  }

  private extractFundedRuleIds = (productRules: any[]): string[] => {
    const fundedIds: string[] = []
    productRules?.forEach((rule: any) => {
      if (rule.fundManagedBy === 'FUNDED') {
        fundedIds.push(...rule.premiumRuleIds)
      }
    })
    return fundedIds
  }

  private buildCategoryRows = (planDetails: any, quotationDetails: any): CategoryRow[] => {
    return planDetails.planCategorys.map((p: any) => {
      const catAmts = quotationDetails.categoryMemberHeadCountPremiumAmounts?.[p.name]
      const categoryRules = quotationDetails.catagoryPremiumRules?.[p.name] || []
      return {
        categoryId: p.id,
        categoryName: p.name,
        premiumRules: categoryRules.map((qpr: any) => {
          const ruleDetails = this.getPremiumRuleDetails(qpr)
          return {
            ...ruleDetails,
            sumOfPremium: catAmts ? catAmts.premiumAmount : 0
          }
        }),
        headCount: catAmts ? catAmts.headCount : 0
      }
    })
  }

  getPremiumRuleDetails = (id: any) => {
    const { premiumRuleDetails } = this.state
    const { quotationDetails } = this.state
    let ruleObj, freqObj

    for (const i in premiumRuleDetails.premiumRules) {
      ruleObj = premiumRuleDetails.premiumRules[i].premiumRules.find((rd: any) => rd.id == id)

      if (ruleObj) {
        freqObj = ruleObj.premiumPaymentFrequencies.find(
          (ppf: any) => ppf.premiumPaymentFrequncyId == quotationDetails.paymentFrequency
        )

        // break;
        return { ...ruleObj, premiumAmount: freqObj?.premiumAmount, coverage: premiumRuleDetails?.premiumRules[i].coverageAmount }
      }
    }
  }

  private getAllBenefitStructures = () => {
    const sub = this.services.getAllBenefitStructures().subscribe({
      next: (res: any) => {
        if (res.content) {
          this.buildPreviewHierarchy(res.content)
        }
      },
      error: (error) => {
        console.error('Error fetching benefit structures:', error)
      }
    })
    this.subscriptions.push(sub)
  }

  private buildPreviewHierarchy = (benefitStructures: any[]) => {
    const previewHierarchy = benefitStructures.map((benefit: any) => ({
      ...benefit,
      hirearchy: { ...benefit.hirearchy, child: [] }
    }))

    this.state.productDetails?.productRules?.forEach((rule: any) => {
      this.addRuleToHierarchy(benefitStructures, previewHierarchy, rule)
    })

    previewHierarchy.forEach((node: any) => {
      QuotationHelpers.addRandomEIdToHierarchy(node)
    })

    const filteredHierarchy = previewHierarchy.filter(
      (node: any) => node.hirearchy.child?.length > 0
    )

    previewHierarchy.forEach((node: any) => {
      node?.hirearchy?.child?.forEach((el: any) => {
        node.coverage = el.coverageAmount
      })
    })

    this.setState({ benefitHierarchy: filteredHierarchy })
  }

  private addRuleToHierarchy = (
    benefitStructures: any[],
    previewHierarchy: any[],
    rule: any
  ) => {
    const mainBenefitIndex = benefitStructures.findIndex(
      (b: any) => b.id === rule.benefitStructureId
    )

    if (mainBenefitIndex === -1) return

    const benefitElm = benefitStructures[mainBenefitIndex].hirearchy

    if (benefitElm.id === rule.benefitId) {
      this.addRuleToMainBenefit(previewHierarchy[mainBenefitIndex].hirearchy, rule)
    } else {
      this.getChildBenefitHierarchy(
        benefitElm,
        rule,
        previewHierarchy,
        mainBenefitIndex
      )
    }
  }

  private addRuleToMainBenefit = (hierarchy: any, rule: any) => {
    const o = hierarchy

    if (!rule.parentId) {
      o.child.push({
        ...rule,
        benefitCode: o.code,
        child: [],
        type: 'rule'
      })
    }

    o.child.push({
      ...rule,
      coverageAmount: rule.coverageAmount
    })

    this.addPremiumRulesToHierarchy(o, rule)
  }

  private addPremiumRulesToHierarchy = (hierarchy: any, rule: any) => {
    const premiumRules = this.state.premiumRuleDetails.premiumRules?.filter(
      (p: any) => p.productRuleId === rule.id
    ) || []

    if (premiumRules.length === 0) return

    const pIdx = hierarchy.child.findIndex((c: any) => c.id === rule.id)
    if (pIdx === -1 || !hierarchy.child[pIdx]) return

    const lastPremiumRule = premiumRules[premiumRules.length - 1]
    const premiumRuleList = lastPremiumRule?.premiumRules || []

    hierarchy.child[pIdx].child = [
      ...(hierarchy.child[pIdx].child || []),
      ...premiumRuleList.map((item: any) => ({
        ...item,
        type: 'premiumRule',
        // cAmount: hierarchy.child[pIdx]?.coverageAmount
      }))
    ]
  }

  private getChildBenefitHierarchy = (
    benefitElm: any,
    rule: any,
    previewHierarchy: any[],
    mainBenefitIndex: number
  ) => {
    if (!benefitElm.child || benefitElm.child.length === 0) return

    const subBenefitIndex = benefitElm.child.findIndex(
      (item: any) => item.id === rule.benefitId
    )

    if (subBenefitIndex > -1) {
      const newBenefitElm = {
        ...benefitElm.child[subBenefitIndex],
        child: [],
        type: 'benefit'
      }

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

  private getChildRuleHierarchy = (
    parentHierarchy: any,
    mainBenefitIndex: number,
    rule: any,
    newBenefitElm: any
  ) => {
    const parentIdx = parentHierarchy?.child?.findIndex(
      (item: any) => item.id === rule.parentId
    )

    if (parentIdx === -1) {
      parentHierarchy?.child?.forEach((item: any) => {
        this.getChildRuleHierarchy(item, mainBenefitIndex, rule, newBenefitElm)
      })
      return
    }

    let benefitIdx = parentHierarchy.child[parentIdx].child.findIndex(
      (benefit: any) => benefit.id === newBenefitElm.id
    )

    if (benefitIdx === -1) {
      parentHierarchy.child[parentIdx].child.push(newBenefitElm)
      benefitIdx = parentHierarchy.child[parentIdx].child.length - 1
    }

    const o = parentHierarchy.child[parentIdx].child[benefitIdx]
    o.child.push({ ...rule, benefitCode: o.code, child: [], type: 'rule' })

    this.addPremiumRulesToChildHierarchy(o, rule)
  }

  private addPremiumRulesToChildHierarchy = (hierarchy: any, rule: any) => {
    const premiumRules = this.state.premiumRuleDetails.premiumRules?.filter(
      (p: any) => p.productRuleId === rule.id
    ) || []

    if (premiumRules.length === 0) return

    const pIdx = hierarchy.child.findIndex((c: any) => c.id === rule.id)
    if (pIdx === -1 || !hierarchy.child[pIdx]) return

    const lastPremiumRule = premiumRules[premiumRules.length - 1]
    const premiumRuleList = lastPremiumRule?.premiumRules || []

    hierarchy.child[pIdx].child = [
      ...(hierarchy.child[pIdx].child || []),
      ...premiumRuleList.map((item: any) => ({
        ...item,
        type: 'premiumRule',
        // cAmount: hierarchy.child[pIdx]?.coverageAmount
      }))
    ]
  }

  private handleProductChange = (name: string, e: any, value: any) => {
    if (value?.id) {
      this.buildProductDetails(name, value.id)
    } else {
      this.setState({ [name]: '' } as any)
    }
  }

  private buildProductDetails = (name: string, id: string) => {
    this.setState({ [name]: id } as any)

    const sub = forkJoin([
      this.services.getProductDetails(id),
      this.services.getPremiumDetails(id)
    ]).subscribe({
      next: (res: any) => {
        const fundedIds = this.extractFundedRuleIds(res[0].productRules)

        this.setState({
          selectedProductId: id,
          productDetails: res[0],
          premiumCurrencyCd: res[0].productBasicDetails.premiumCurrencyCd,
          premiumRuleDetails: res[1],
          benefitRuleIdsOfFunded: fundedIds
        })

        this.getAllBenefitStructures()
      },
      error: (error) => {
        this.toggleSnackbar(true, 'error', 'Failed to load product details')
      }
    })
    this.subscriptions.push(sub)
  }

  private handlePlanChange = (name: string, e: any, value: any) => {
    if (value?.id) {
      this.setState({ [name]: value.id, rows: [] } as any)

      const sub = this.services.getPlanDetails(value.id).subscribe({
        next: (res: any) => {
          if (res.id) {
            const rows = res.planCategorys.map((p: any) => ({
              categoryId: p.id,
              categoryName: p.name,
              premiumRules: []
            }))
            this.setState({ rows })
          }
        },
        error: (error) => {
          this.toggleSnackbar(true, 'error', 'Failed to load plan')
        }
      })
      this.subscriptions.push(sub)
    } else {
      this.setState({ [name]: '', rows: [] } as any)
    }
  }

  private handleFrequency = (e: any) => {
    const { name, value } = e.target
    const updatedRows = [...this.state.rows]

    updatedRows.forEach((row: CategoryRow) => {
      row.premiumRules.forEach((pr: PremiumRule) => {
        const filteredFrequency = pr.premiumPaymentFrequencies?.filter(
          (p: PremiumFrequency) => p.premiumPaymentFrequncyId === value
        )

        const amt = filteredFrequency?.[0]?.premiumAmount || 0
        pr.premiumAmount = amt
        pr.sumOfPremium = amt * row.headCount
      })
    })

    const totalPremium = QuotationHelpers.getTotalPremium(updatedRows)

    this.setState({
      [name]: value,
      rows: updatedRows,
      totalPremium
    } as any)
  }

  private handleHeadCountChange = (e: any, rowIdx: number) => {
    const { name, value } = e.target
    const inputValue = sanitizeNumberInput(value)
    const rows = [...this.state.rows]

    rows[rowIdx] = {
      ...rows[rowIdx],
      [name]: Number(inputValue)
    }

    rows[rowIdx].premiumRules = rows[rowIdx].premiumRules.map((pr: PremiumRule) => ({
      ...pr,
      sumOfPremium: Number(inputValue) * pr.premiumAmount
    }))

    const totalPremium = QuotationHelpers.getTotalPremium(rows)

    this.setState({ rows, totalPremium })
  }

  private handleCoverageChange = (e: any, rowIndex: number, ruleIndex: number, p: any) => {
    const newValue = Number(e.target.value)

    // Update local state immediately
    this.setState((prevState) => {
      const updatedRows = [...prevState.rows]
      const updatedPremiumRules = [...updatedRows[rowIndex].premiumRules]

      updatedPremiumRules[ruleIndex] = {
        ...updatedPremiumRules[ruleIndex],
        newCoverage: newValue
      }

      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        premiumRules: updatedPremiumRules
      }

      return { rows: updatedRows }
    })
  }

  private handleCoverageBlur = (p: any, rowIndex: number, ruleIndex: number) => {
    const newValue = this.state.rows[rowIndex].premiumRules[ruleIndex].coverage
    const payload = {
      coverageAmount: p.coverage,
      premiumAmount: p.premiumAmount,
      modifiedCoverageAmount: p.newCoverage
    }

    this.services.getCustomCoveragePremium(payload).subscribe({
      next: (res: any) => {
        this.setState((prevState) => {
          const updatedRows = [...prevState.rows]
          const updatedPremiumRules = [...updatedRows[rowIndex].premiumRules]

          updatedPremiumRules[ruleIndex] = {
            ...updatedPremiumRules[ruleIndex],
            premiumAmount: res.modifiedPremiumAmount.toFixed(2)
          }

          updatedRows[rowIndex] = {
            ...updatedRows[rowIndex],
            premiumRules: updatedPremiumRules
          }
          return { rows: updatedRows }
        })


        let id;
        this.state.benefitHierarchy.forEach((b: any) => {
          b.hirearchy.child.forEach((child: any) => {
            if (child.premiumRuleIds.includes(p.id)) {
              id = child.id
            }
          })
        })

        let obj = {
          ruleId: id,
          premiumId: p.id,
          coverageAmount: p.newCoverage,
          premiumAmount: res.modifiedPremiumAmount
        }
        this.setState((prevState) => {
          const updatedCustomPrimumData = [...prevState.customPrimumData, obj]
          return { customPrimumData: updatedCustomPrimumData }
        })
      }
    })
  }

  private handleDrop = (row: CategoryRow, ruleObj: any) => {
    const insertIdx = this.state.rows.findIndex(
      (r: CategoryRow) => r.categoryName === row.categoryName
    )

    if (insertIdx === -1) {
      console.error('Category not found:', row.categoryName)
      return
    }

    const rules = QuotationHelpers.extractRulesRecursively(ruleObj)

    this.state.premiumRuleDetails?.premiumRules?.forEach((r: any) => {
      r?.premiumRules?.forEach((pr: any) => {
        rules?.forEach((rule: any) => {
          if (pr.id == rule.id) {
            rule.coverageAmount = r.coverageAmount
          }
        })
      })
    })

    this.setState((prevState) => {
      const updatedRows = [...prevState.rows]
      rules.forEach((rule: any) => {
        this.addRuleToRow(updatedRows, insertIdx, rule)
      })
      return { rows: updatedRows }
    })
    this.setState({ triggeredDrop: true })
  }

  private addRuleToRow = (rows: CategoryRow[], idx: number, ruleObj: any) => {
    const isRuleExist = rows[idx].premiumRules.some(
      (p: PremiumRule) => p.id === ruleObj.id
    )

    if (isRuleExist) return

    const filteredFrequency = this.state.selectedFrequencyId
      ? ruleObj.premiumPaymentFrequencies?.filter(
        (p: PremiumFrequency) =>
          p.premiumPaymentFrequncyId === this.state.selectedFrequencyId
      )
      : []

    const premiumAmount = filteredFrequency?.[0]?.premiumAmount || 0

    const newRule: PremiumRule = {
      name: ruleObj.name,
      coverage: ruleObj.coverageAmount,
      expression: ruleObj.expression,
      id: ruleObj.id,
      premiumPaymentFrequencies: ruleObj.premiumPaymentFrequencies || [],
      premiumAmount,
      headCount: 0,
      sumOfPremium: 0
    }

    rows[idx] = {
      ...rows[idx],
      premiumRules: [...rows[idx].premiumRules, newRule]
    }

    const adminFeesIds: string[] = []
    rows.forEach((row: CategoryRow) => {
      row.premiumRules.forEach((pr: PremiumRule) => {
        if (this.state.benefitRuleIdsOfFunded.includes(pr.id)) {
          adminFeesIds.push(pr.id)
        }
      })
    })

    this.setState({ isAdminFeesApplied: adminFeesIds })
  }

  private handleDropCustom = (row: CategoryRow, ruleObj: any) => {
    const insertIdx = this.state.customCategory.findIndex(
      (r: CategoryRow) => r.categoryId === row.categoryId
    )

    if (insertIdx === -1) return

    const rules = QuotationHelpers.extractRulesRecursively(ruleObj)

    this.setState((prevState) => {
      const updatedCustom = [...prevState.customCategory]
      rules.forEach((rule: any) => {
        this.addRuleToCustomRow(updatedCustom, insertIdx, rule)
      })
      return { customCategory: updatedCustom }
    })
  }

  private addRuleToCustomRow = (rows: CategoryRow[], idx: number, ruleObj: any) => {
    const isRuleExist = rows[idx].premiumRules.some(
      (p: PremiumRule) => p.id === ruleObj.id
    )

    if (isRuleExist) return

    const filteredFrequency = this.state.selectedFrequencyId
      ? ruleObj.premiumPaymentFrequencies?.filter(
        (p: PremiumFrequency) =>
          p.premiumPaymentFrequncyId === this.state.selectedFrequencyId
      )
      : []

    const premiumAmount = filteredFrequency?.[0]?.premiumAmount || 0

    const newRule: PremiumRule = {
      name: ruleObj.name,
      expression: ruleObj.expression,
      id: ruleObj.id,
      premiumPaymentFrequencies: ruleObj.premiumPaymentFrequencies || [],
      premiumAmount,
      headCount: 0,
      sumOfPremium: 0
    }

    rows[idx] = {
      ...rows[idx],
      premiumRules: [...rows[idx].premiumRules, newRule]
    }
  }

  private handleAddCategory = () => {
    this.setState((prevState) => ({
      customCategory: [
        ...prevState.customCategory,
        {
          categoryId: generateRandomId(),
          categoryName: 'Custom',
          premiumRules: [],
          headCount: 0
        }
      ]
    }))
  }

  private handleRemoveCategory = (index: number) => {
    this.setState((prevState) => {
      const list = [...prevState.customCategory]
      list.splice(index, 1)
      return { customCategory: list }
    })
  }

  private handleCategoryNameChange = (event: any, idx: number) => {
    const newName = event.target.value.trim()

    const isDuplicateCustom = this.state.customCategory.some(
      (item: CategoryRow, i: number) =>
        i !== idx && item.categoryName.trim() === newName
    )

    const isDuplicateRows = this.state.rows.some(
      (item: CategoryRow) => item.categoryName.trim() === newName
    )

    if (isDuplicateCustom || isDuplicateRows) {
      this.toggleSnackbar(true, 'error', 'Duplicate category name!')
      return
    }

    this.setState((prevState) => {
      const updatedCustomCategory = [...prevState.customCategory]
      updatedCustomCategory[idx] = {
        ...updatedCustomCategory[idx],
        categoryName: event.target.value
      }
      return { customCategory: updatedCustomCategory }
    })
  }

  private removePremiumRule = (parentId: number, index: number) => {
    this.setState((prevState) => {
      const rows = [...prevState.rows]
      rows[parentId] = {
        ...rows[parentId],
        premiumRules: rows[parentId].premiumRules.filter((_, i) => i !== index)
      }
      return { rows }
    })
  }

  private removePremiumRuleCustom = (parentId: number, index: number) => {
    this.setState((prevState) => {
      const customCategory = [...prevState.customCategory]
      customCategory[parentId] = {
        ...customCategory[parentId],
        premiumRules: customCategory[parentId].premiumRules.filter((_, i) => i !== index)
      }
      return { customCategory }
    })
  }

  private saveRowEdit = () => {
    if (this.state.dataTable.length === 0) {
      this.toggleSnackbar(true, 'warning', 'Select category for all members')
      return
    }

    const payload = this.state.dataTable.map((row: any) => ({
      id: row.id,
      planScheme: row.planScheme
    }))

    const sourceType = 'QUOTATION'
    const sourceId =
      this.state.quotationDetails.id || getStorageItem('quotationId') || ''

    const sub = this.services
      .savePlanScheme(payload, sourceType, sourceId)
      .subscribe({
        next: () => {
          this.toggleSnackbar(true, 'success', 'Saved successfully')
          this.setState({ isPlanSchemeSaved: true })
        },
        error: (error) => {
          this.toggleSnackbar(true, 'error', 'Failed to save')
        }
      })
    this.subscriptions.push(sub)
  }

  private onLoadedData = (data: any[]) => {
    const planSchemeEmpty = data.some((item: any) => !item.planScheme)

    this.setState({
      dataTable: planSchemeEmpty ? [] : data,
      planSchemeEmpty,
      isPlanSchemeSaved: !planSchemeEmpty && this.state.isPlanSchemeSaved
    })
  }

  private onCellEditComplete = (event: any, newData: any) => {
    // Can be extended if needed
  }

  private editor = (options: any) => {
    return (
      <Dropdown
        value={options.value}
        style={{ fontSize: '10px !important' }}
        className='text-xs'
        showOnFocus
        showClear
        options={this.state.rows.map((item: CategoryRow) => item.categoryName)}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder='Category'
        itemTemplate={(option) => (
          <Tag className='text-xs' value={option} severity='success' />
        )}
      />
    )
  }

  private calculatePremium = () => {
    const quotationId = getStorageItem('quotationId')
    if (!quotationId) {
      this.toggleSnackbar(true, 'error', 'Quotation ID not found')
      return
    }

    const sub = this.services.getQuotationDetailsByID(quotationId).subscribe({
      next: (res) => {
        this.setState({ quotationDetails: res })

        if (res.premiumCalculationStatus === CalculationStatus.INPROGRESS) {
          this.toggleSnackbar(
            true,
            'warning',
            'Premium Calculation is Under Processing...'
          )
          return
        }

        if (res.memberUploadStatus !== MemberUploadStatus.COMPLETED) {
          this.toggleSnackbar(
            true,
            'warning',
            'Please Upload Member From Member Tab'
          )
          return
        }

        if (this.state.showMemberTable && !this.state.isPlanSchemeSaved) {
          this.toggleSnackbar(
            true,
            'warning',
            'Please Save Member Management Table Above'
          )
          return
        }

        if (!this.state.productDetails || !this.state.productDetails.id) {
          this.toggleSnackbar(true, 'warning', 'Please Select a product')
          return
        }

        this.performCalculation(quotationId)
      },
      error: (error) => {
        this.toggleSnackbar(true, 'error', 'Failed to check quotation status')
      }
    })
    this.subscriptions.push(sub)
  }

  private performCalculation = (quotationId: string) => {
    const { selectedFrequencyId, selectedProductId, selectedPlan, rows, agentsList, customPayload } = this.state


    const catagoryPremiumRules = rows.map((r: CategoryRow) => ({
      [r.categoryName]: r.premiumRules.map((pr: PremiumRule) => pr.id.toString())
    }))

    const quotationAgents = agentsList.map((ag: Agent) => ({
      agentId: ag.agentId,
      commissionType: ag.commissionType,
      commissionValue: ag.commission,
      finalValue: calculatePercentageAmount(ag.commission, this.state.totalPremium)
    }))

    const payload = {
      paymentFrequency: selectedFrequencyId,
      productId: selectedProductId,
      planId: selectedPlan,
      catagoryPremiumRules: customPayload.length ? Object.assign({}, ...customPayload) : Object.assign({}, ...catagoryPremiumRules),
      quotationAgents
    }

    const pageRequest = { action: 'calculate-premium' }

    const sub = this.services
      .updateQuotation(pageRequest, payload, quotationId)
      .subscribe({
        next: () => {
          this.setState({ buttonTxt: 'In Progress' })
          this.props.updateQuotation(
            {
              ...this.state.quotationDetails,
              premiumCalculationStatus: CalculationStatus.INPROGRESS
            },
            'L'
          )
          setTimeout(this.checkCalculationStatus, 5000)
        },
        error: (error) => {
          this.toggleSnackbar(true, 'error', 'Failed to calculate premium')
          this.setState({ buttonTxt: 'Calculate' })
        }
      })
    this.subscriptions.push(sub)
  }

  private uploadDiscountAndLoading = () => {
    const {
      selectedFrequencyId,
      selectedProductId,
      selectedPlan,
      rows,
      loading,
      discount,
      totalPremiumAfterLoadingAndDiscount,
      agentsList,
      totalAmountWithTax
    } = this.state

    const catagoryPremiumRules = rows.map((r: CategoryRow) => ({
      [r.categoryName]: r.premiumRules.map((pr: PremiumRule) => pr?.id?.toString())
    }))

    const quotationAgents = agentsList.map((ag: Agent) => ({
      agentId: ag.agentId,
      commissionType: ag.commissionType,
      commissionValue: ag.commission,
      finalValue: calculatePercentageAmount(ag.commission, this.state.totalPremium)
    }))

    const payload: any = {
      paymentFrequency: selectedFrequencyId,
      productId: selectedProductId,
      planId: selectedPlan,
      catagoryPremiumRules: Object.assign({}, ...catagoryPremiumRules),
      discount,
      loading,
      totalAfterDicountAndLoadingAmount: totalPremiumAfterLoadingAndDiscount,
      quotationAgents,
      totalAmountWithTax: totalAmountWithTax

    }

    let taxArray: any[] = []
    this.state.taxList.forEach((tax: any) => {
      let obj = {}
      if (tax.checked) {
        obj = {
          taxAmount: tax.taxVal,
          taxId: tax.id,
        }
        taxArray.push(obj)
      }
    })
    payload.quotationTaxes = taxArray

    const quotationId = getStorageItem('quotationId')
    if (!quotationId) return
    const sub = this.services
      .uploadDiscountAndLoading(payload, quotationId)
      .subscribe({
        next: () => {
          this.toggleSnackbar(true, 'success', 'Updated successfully')
        },
        error: (error) => {
          this.toggleSnackbar(true, 'error', 'Failed to update')
        }
      })
    this.subscriptions.push(sub)
  }

  private handleDownloadQuotation = () => {
    const quotationId = getStorageItem('quotationId')
    if (!quotationId) {
      this.toggleSnackbar(true, 'error', 'Quotation ID not found')
      return
    }

    this.toggleSnackbar(true, 'info', 'Downloading quotation...')

    const quotationService = new QuotationService()

    // Step 1: Get the quotation template (Word document)
    const sub = quotationService.getQuotationTemplate()
      .pipe(
        switchMap((templateResponse: { blob: Blob; filename: string }) => {
          // Convert blob to file with proper MIME type for Word documents
          const templateFile = new File([templateResponse.blob], templateResponse.filename, {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          })

          // Step 2: Generate quotation using the template
          return quotationService.generateQuotationTemplate(quotationId, templateFile)
        })
      )
      .subscribe({
        next: (blob: Blob) => {
          // Download the generated quotation
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `quotation_${quotationId}.docx`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)

          this.toggleSnackbar(true, 'success', 'Quotation downloaded successfully')
        },
        error: (error) => {
          console.error('Error downloading quotation:', error)
          this.toggleSnackbar(true, 'error', 'Failed to download quotation')
        }
      })
    this.subscriptions.push(sub)
  }

  private checkCalculationStatus = () => {
    const quotationId = getStorageItem('quotationId')
    if (!quotationId) return

    const sub = this.services
      .getQuotationDetailsByID(quotationId)
      .pipe(
        expand((res: any) => {
          if (res.memberUploadStatus === MemberUploadStatus.INPROGRESS) {
            return this.services
              .getQuotationDetailsByID(quotationId)
              .pipe(delay(DEBOUNCE_DELAY))
          }
          return EMPTY
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res.memberUploadStatus !== MemberUploadStatus.INPROGRESS) {
            this.setState({ buttonTxt: 'Calculate' })
            this.props.updateQuotation(res)
          }
        },
        error: (error) => {
          this.setState({ buttonTxt: 'Calculate' })
        }
      })
    this.subscriptions.push(sub)
  }

  private handleOpenAgentModal = () => {
    this.setState({ openAgentModal: true })
  }

  private handleCloseAgentModal = () => {
    this.setState({ openAgentModal: false })
  }

  private handleAgentModalSubmit = (selectedAgents: Agent[]) => {
    this.setState({
      agentsList: selectedAgents,
      openAgentModal: false
    })
  }

  private changeCommission = (e: any, i: number) => {
    const { name, value } = e.target

    this.setState((prevState) => {
      const agentsList = [...prevState.agentsList]
      agentsList[i] = {
        ...agentsList[i],
        [name]: Number(value),
        finalValue: calculatePercentageAmount(
          Number(value),
          prevState.totalPremium
        )
      }
      return { agentsList }
    })
  }

  private setAgentsList = (newAgentsList: Agent[]) => {
    this.setState({ agentsList: newAgentsList })
  }

  private requestForApproval = () => {
    const quotationId = getStorageItem('quotationId')
    if (!quotationId) return

    const sub = this.services.requestForApproval(quotationId).subscribe({
      next: () => {
        this.toggleSnackbar(true, 'success', 'Requested for evaluation')
        setTimeout(this.checkCalculationStatus, 1500)
      },
      error: (error) => {
        this.toggleSnackbar(true, 'error', 'Failed to request approval')
      }
    })
    this.subscriptions.push(sub)
  }

  private handleDecisionSubmit = () => {
    const quotationId = getStorageItem('quotationId')
    if (!quotationId) return

    const payload = {
      decission: this.state.decision,
      comment: this.state.comment
    }

    const sub = this.services.quotationDecision(payload, quotationId).subscribe({
      next: () => {
        this.toggleSnackbar(
          true,
          'success',
          `Quotation ${this.state.decision.toLowerCase()}`
        )
        this.setState({ openDecisionModal: false })
        this.props.router.push('/quotations?mode=viewList')
      },
      error: (error) => {
        this.toggleSnackbar(true, 'error', 'Failed to submit decision')
      }
    })
    this.subscriptions.push(sub)
  }

  private uploadDocuments = (data: any, e: any) => {
    const id = this.state.quotationDetails.id || getStorageItem('quotationId')
    const file = e.target['files']?.[0]

    if (!file || !id) return

    const reader = new FileReader()
    reader.onload = () => {
      const formData = new FormData()
      formData.append('quotationId', id)
      formData.append('filePart', file)
      formData.append('docType', 'MEDICAL_DOC')

      const sub = this.services.uploadMedicalReport(data.id, formData).subscribe({
        next: () => {
          this.toggleSnackbar(true, 'success', 'Medical Report Uploaded Successfully')
        },
        error: (error) => {
          this.toggleSnackbar(true, 'error', 'Failed to upload medical report')
        }
      })
      this.subscriptions.push(sub)
    }

    reader.readAsDataURL(file)
  }

  private openModal = () => {
    this.setState({ openModal: true })
  }

  private closeModal = () => {
    this.setState({ openModal: false })
  }

  private openTemplateModal = () => {
    this.setState({ openTemplate: true })
  }

  private closeTemplateModal = () => {
    this.setState({ openTemplate: false })
  }

  private handleDialogClose = () => {
    this.setState({ openDecisionModal: false })
  }

  private onComplete = () => {
    this.setState({ openModal: false })
  }

  private toggleSnackbar = (
    status: boolean,
    alertType: 'success' | 'warning' | 'error' | 'info' = 'success',
    snackbarMsg = 'Success'
  ) => {
    this.setState({
      openSnackbar: status,
      alertType,
      snackbarMsg
    })
  }

  private createPlan = () => {
    this.props.router.push('/plans?mode=create')
  }

  private productDataSourceCallback$ = (
    params = {},
    action: any,
    pageRequest = defaultPageRequest
  ) => {
    let reqParam: any = { ...pageRequest, ...params }

    if (action?.searchText && action.searchText.length > 2) {
      reqParam = {
        ...reqParam,
        name: action.searchText
      }
      delete reqParam.active
    }

    return this.services.getProducts(reqParam)
  }

  private planDataSourceCallback$ = (
    params = {},
    action: any,
    pageRequest = defaultPageRequest
  ) => {
    let reqParam: any = { ...pageRequest, ...params }

    if (action?.searchText) {
      reqParam = {
        ...reqParam,
        code: action.searchText,
        name: action.searchText,
        clientType: action.searchText
      }
    }

    return this.services.getPlanFromProduct(this.state.selectedProductId)
  }

  private refetchPremiumDetails = (callback?: () => void) => {
    const { selectedProductId } = this.state

    if (!selectedProductId) {
      return
    }

    const sub = this.services.getPremiumDetails(selectedProductId).subscribe({
      next: (premiumDetails: any) => {
        this.setState({
          refetchedPremiumRuleDetails: premiumDetails
        }, () => {
          // this.toggleSnackbar(true, 'success', 'Premium details refreshed')
          // Call the callback after state is updated
          if (callback) {
            callback();
          }
        })
      },
      error: (error) => {
        this.toggleSnackbar(true, 'error', 'Failed to reload premium details')
      }
    })
    this.subscriptions.push(sub)
  }

  findMatchingRule(productRulesList: any, searchObject: any) {
    // Iterate through all productRules
    for (const productRule of productRulesList.premiumRules) {
      // Check if customRule is true and coverageAmount matches
      if (productRule.customRule && productRule.coverageAmount == searchObject.newCoverage) {
        // Search in the premiumRules array of this productRule
        const matchingRule = productRule.premiumRules.find((rule: any) => {
          return rule.name === searchObject.name;
        });

        // If found, return the rule
        if (matchingRule) {
          return matchingRule;
        }
      }
    }

    // If no match found, return null
    return null;
  }

  proceedWithCustomPremium = () => {
    if (this.state.customPrimumData.length) {
      const customPremiumRequests = this.state.customPrimumData.map((data: any) =>
        this.services.createCustomPremium(this.state.selectedProductId, data)
      )

      // Use forkJoin to wait for all custom premium updates to complete
      forkJoin(customPremiumRequests).subscribe({
        next: (results: any) => {
          this.toggleSnackbar(true, 'success', 'Custom premiums updated successfully')

          // Refetch premium details and execute y operation in callback
          this.refetchPremiumDetails(() => {
            let y = this.state.rows.map((r: CategoryRow) => ({
              [r.categoryName]: r?.premiumRules.map((pr: PremiumRule) => {
                // Check if pr has newCoverage property
                if (pr.newCoverage) {
                  const result = this.findMatchingRule(this.state.refetchedPremiumRuleDetails, pr);
                  return result ? result.id : null;
                } else {
                  // Directly return the id if no newCoverage
                  return pr.id;
                }
              })
            }));

            this.setState({
              customPayload: y,
              proceed: true,
              // customPrimumData: [] // Clear after successful update
            })
          });
        },
        error: (error) => {
          // this.toggleSnackbar(true, 'error', 'Failed to update custom premiums')
        }
      })
    } else {
      // If no custom premium data, just proceed
      this.setState({ proceed: true })
    }
  }

  handleFieldChecked = (e: any, index: number) => {
    const { name, checked } = e.target
    const list: any = [...this.state.taxList]

    list[index][name] = checked
    this.setState({ taxList: list })
    this.calculateTax(list, this.state.totalPremiumAfterLoadingAndDiscount)
  }

  calculateTax = (txlist: any, totalAmountWithoutTax: number) => {
    txlist.forEach((ele: any) => {
      if (ele.checked) {
        if (ele.type === 'PERCENTAGE') {
          ele.taxVal = (Number(ele.value) * Number(totalAmountWithoutTax)) / 100
        }

        if (ele.type === 'FIXED') {
          ele.taxVal = Number(ele.value)
        }
      }
    })
    this.setState({ taxList: txlist })
    let grandTotal = Number(totalAmountWithoutTax)
    let tt = 0

    txlist.forEach((v: any) => {
      if (v.checked) {
        grandTotal = grandTotal + Number(v.taxVal)
        tt = tt + Number(v.taxVal)
      }
    })

    this.setState({ totalAmountWithTax: grandTotal })

    // formik.setFieldValue('totalTaxAmount', tt)
  }

  private getLoadingAmount = (): number => {
    return calculatePercentageAmount(this.state.loading, this.state.totalPremium)
  }

  private getDiscountAmount = (): number => {
    return calculatePercentageAmount(this.state.discount, this.state.totalPremium)
  }

  render() {
    const { classes } = this.props
    const {
      benefitHierarchy,
      selectedProductId,
      selectedPlan,
      rows,
      openSnackbar,
      snackbarMsg,
      alertType,
      selectedFrequencyId,
      premiumFrequncyList,
      totalPremium,
      quotationDetails,
      productDetails,
      buttonTxt,
      isRetail,
      customCategory,
      showMemberTable,
      openDecisionModal,
      comment,
      openAgentModal,
      agentsList,
      openModal,
      openTemplate,
      openPreview,
      apiList,
      memberColDefn,
      loading,
      discount,
      totalPremiumAfterLoadingAndDiscount,
      taxList,
      triggeredDrop,
      totalAmountWithTax
    } = this.state
    console.log("123456", this.state, quotationDetails)
    return (
      <>
        <Dialog
          open={openDecisionModal}
          onClose={this.handleDialogClose}
          aria-labelledby='form-dialog-title'
          disableEnforceFocus
        >
          <DialogTitle id='form-dialog-title'>Quotation Decision</DialogTitle>
          <DialogContent>
            <TextField
              required
              label='Add comment'
              multiline
              fullWidth
              minRows={4}
              variant='filled'
              value={comment}
              onChange={(e) => this.setState({ comment: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color='primary'>
              Cancel
            </Button>
            <Button onClick={this.handleDecisionSubmit} color='secondary'>
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <div className={classes.quotationDesignRoot}>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={SNACKBAR_DURATION}
            onClose={() => this.toggleSnackbar(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              onClose={() => this.toggleSnackbar(false)}
              severity={alertType}
              variant='filled'
            >
              <AlertTitle>{alertType}</AlertTitle>
              {snackbarMsg}
            </Alert>
          </Snackbar>

          <DndProvider backend={HTML5Backend}>
            <Grid container spacing={1}>
              <Grid
                item
                xs={12}
                sm={3}
                style={{ position: 'relative' }}
              >
                <Paper
                  elevation={0}
                  style={{
                    minHeight: 'auto',
                    padding: 4,
                    position: 'sticky',
                    top: '70px'
                  }}
                >
                  <FettleBenefitRuleTreeViewComponent
                    hierarchy={benefitHierarchy}
                    onNodeSelect={() => { }}
                    showAsTooltip={true}
                    hideRightInfo={true}
                    draggable={true}
                  />
                </Paper>
              </Grid>

              <Grid item xs={12} sm={9}>
                <Paper elevation={0} style={{ minHeight: 500, width: '100%', padding: 15 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl className={classes.formControl}>
                        <FettleAutocomplete
                          id='product'
                          name='product'
                          label='Product'
                          displayKey='productBasicDetails.name'
                          $datasource={this.productDataSourceCallback$}
                          changeDetect={true}
                          disabled
                          txtValue={productDetails?.productBasicDetails?.name}
                          value={selectedProductId}
                          onChange={(e: any, newValue: any) =>
                            this.handleProductChange('selectedProductId', e, newValue)
                          }
                        />
                      </FormControl>
                    </Grid>

                    {selectedProductId && (
                      <>
                        <Grid item xs={12} sm={6} md={3}>
                          <FormControl className={classes.formControl}>
                            <FettleAutocomplete
                              id='plan'
                              name='plan'
                              label='Plan'
                              $datasource={this.planDataSourceCallback$}
                              changeDetect={true}
                              txtValue={this.state.planDetails?.name}
                              value={selectedPlan}
                              disabled
                              onChange={(e: any, newValue: any) =>
                                this.handlePlanChange('selectedPlan', e, newValue)
                              }
                            />
                          </FormControl>
                        </Grid>

                        {/* <Grid item xs={12} sm={6} md={3}>
                          <Button
                            color='secondary'
                            className='p-button-secondary'
                            onClick={this.createPlan}
                          >
                            Create Plan
                          </Button>
                        </Grid> */}

                        <Grid item xs={12} sm={6} md={3}>
                          <FormControl className={classes.formControl}>
                            <InputLabel id='select-frequency-label'>
                              Payment Frequency
                            </InputLabel>
                            <Select
                              name='selectedFrequencyId'
                              label='Payment Frequency'
                              displayEmpty
                              value={selectedFrequencyId}
                              onChange={this.handleFrequency}
                            >
                              {premiumFrequncyList.map((freq: any) => (
                                <MenuItem key={freq.code} value={freq.id}>
                                  {freq.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </>
                    )}
                  </Grid>

                  <Grid container spacing={1}>
                    <Grid item xs={12} style={{ minHeight: 500, marginTop: 15 }}>
                      {rows.map((row: CategoryRow, idx: number) => (
                        <TargetBox
                          key={`row${idx}`}
                          onDrop={(data: any) => this.handleDrop(row, data)}
                        >
                          <Accordion elevation={0}>
                            <AccordionSummary
                              className={classes.AccordionSummary}
                              expandIcon={<ExpandMoreIcon color='primary' />}
                            >
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell style={{ width: '15%', padding: '4px' }}>
                                      {row.categoryName}
                                    </TableCell>
                                    <TableCell style={{ width: '25%', padding: '4px' }}>
                                      Premium Rule
                                    </TableCell>
                                    <TableCell style={{ width: '25%', padding: '4px' }}>
                                      Coverage
                                    </TableCell>
                                    <TableCell style={{ width: '20%', padding: '4px' }}>
                                      Premium Amount(Per Member)
                                    </TableCell>
                                    <TableCell style={{ width: '20%', padding: '4px' }}>
                                      Applicable Head Count
                                    </TableCell>
                                    <TableCell style={{ width: '20%', padding: '4px' }} align='right'>
                                      Sum of Premium
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                              </Table>
                            </AccordionSummary>

                            <AccordionDetails>
                              <Table>
                                <TableBody>
                                  {row.premiumRules.map((p: PremiumRule, i: number) => (
                                    <TableRow key={p.id} hover>
                                      {/* Category Name - only show on first rule, vertically centered */}
                                      {i === 0 && (
                                        <TableCell
                                          style={{ width: '15%', padding: '4px', verticalAlign: 'middle' }}
                                          rowSpan={row.premiumRules.length}
                                        >
                                          {row.categoryName}
                                        </TableCell>
                                      )}

                                      {/* Premium Rule */}
                                      <TableCell style={{ width: '25%', padding: '4px', verticalAlign: 'middle' }}>
                                        <HtmlTooltip
                                          title={
                                            <Typography color='inherit'>
                                              {p.expression}
                                            </Typography>
                                          }
                                        >
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                              display: 'inline-block',
                                              minWidth: '100px',
                                              cursor: 'help'
                                            }}>
                                              {p.name}
                                            </span>
                                            <IconButton
                                              color='secondary'
                                              aria-label='remove'
                                              onClick={() => this.removePremiumRule(idx, i)}
                                              size="small"
                                            >
                                              <RemoveCircleIcon style={{ color: '#dc3545', fontSize: '20px' }} />
                                            </IconButton>
                                          </div>
                                        </HtmlTooltip>
                                      </TableCell>

                                      {/* Coverage */}
                                      <TableCell style={{ width: '20%', padding: '4px', verticalAlign: 'middle' }}>
                                        <TextField
                                          type="number"
                                          variant="standard"
                                          size="small"
                                          disabled={quotationDetails.premiumCalculationStatus == "COMPLETED"}
                                          value={p?.newCoverage || p?.coverage?.toFixed() || 0}
                                          onChange={(e) => this.handleCoverageChange(e, idx, i, p)}
                                          onBlur={() => this.handleCoverageBlur(p, idx, i)}
                                          sx={{ width: '100px' }}
                                        />
                                      </TableCell>

                                      {/* Premium Amount */}
                                      <TableCell style={{ width: '20%', padding: '4px', verticalAlign: 'middle' }}>
                                        <span style={{ display: 'inline-block', minWidth: '100px' }}>
                                          {p?.premiumAmount}
                                        </span>
                                      </TableCell>

                                      {/* Head Count - only show on first rule, vertically centered */}
                                      {i === 0 && (
                                        <TableCell
                                          style={{ width: '20%', padding: '4px', verticalAlign: 'middle' }}
                                          rowSpan={row.premiumRules.length}
                                        >
                                          {quotationDetails.memberUploadStatus ? (
                                            <span>{row.headCount}</span>
                                          ) : (
                                            row.premiumRules.length > 0 && (
                                              <TextField
                                                fullWidth
                                                name='headCount'
                                                value={row.headCount}
                                                onChange={(e) => this.handleHeadCountChange(e, idx)}
                                                inputProps={{
                                                  style: { textAlign: 'right' },
                                                  readOnly: true
                                                }}
                                              />
                                            )
                                          )}
                                        </TableCell>
                                      )}

                                      {/* Sum of Premium - only show on first rule, vertically centered */}
                                      {i === 0 && (
                                        <TableCell
                                          style={{ width: '20%', padding: '4px', verticalAlign: 'middle' }}
                                          align='right'
                                          rowSpan={row.premiumRules.length}
                                        >
                                          {row.premiumRules[0]?.sumOfPremium.toFixed(2) || 0}
                                        </TableCell>
                                      )}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </AccordionDetails>
                          </Accordion>
                        </TargetBox>
                      ))}

                      <Divider style={{ margin: '12px 0' }} />
                      {!triggeredDrop && <p style={{ fontSize: "12px", color: "red", textAlign: "right" }}>Kindly drag and drop the premium rules into your desired category. </p>}
                      {triggeredDrop && !this.state.proceed && <><p style={{ fontSize: "12px", color: "red", textAlign: "right" }}>Please proceed once you have thoroughly reviewed and confirmed the coverage amounts.</p>
                        <Grid container justifyContent='flex-end' spacing={2} mt={2}>
                          <Grid item>
                            <Button
                              variant='contained'
                              color='primary'
                              onClick={() => {
                                this.proceedWithCustomPremium()
                                this.calculatePremium()
                              }
                              }
                            >
                              Calculate Premium
                            </Button>
                          </Grid>
                        </Grid></>}

                    </Grid>

                    {this.state.proceed && <>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell align='right' />
                            <TableCell align='center'>
                              <Typography variant='h6'>Total Premium</Typography>
                            </TableCell>
                            <TableCell align='right' />
                            <TableCell align='right' />
                            <TableCell align='right'>
                              <Typography variant='h6'>{totalPremium?.toFixed(2)}</Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>

                      <Divider style={{ marginBottom: '12px' }} />

                      <Grid container spacing={2}>
                        <Grid item xs={3}>
                          <Typography>Discount</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            size='small'
                            type='number'
                            name='discount'
                            defaultValue={quotationDetails.discount}
                            onChange={(e) => {
                              const discountVal = Number(e.target.value)
                              const la = calculatePercentageAmount(loading, totalPremium)
                              const da = calculatePercentageAmount(discountVal, totalPremium)
                              const at = totalPremium + la - da
                              this.setState({
                                discount: discountVal,
                                totalPremiumAfterLoadingAndDiscount: at
                              })
                              this.calculateTax(this.state.taxList, at)
                            }}
                            label='Discount Percentage (%)'
                          />
                        </Grid>
                        <Grid item xs={3} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <Typography>{this.getDiscountAmount().toFixed(2)}</Typography>
                        </Grid>

                        <Grid item xs={3}>
                          <Typography>Loading</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            size='small'
                            type='number'
                            name='loading'
                            defaultValue={quotationDetails.loading}
                            onChange={(e) => {
                              const loadingVal = Number(e.target.value)
                              const da = calculatePercentageAmount(discount, totalPremium)
                              const la = calculatePercentageAmount(loadingVal, totalPremium)
                              const at = totalPremium + la - da
                              this.setState({
                                loading: loadingVal,
                                totalPremiumAfterLoadingAndDiscount: at
                              })
                              this.calculateTax(this.state.taxList, at)
                            }}
                            label='Loading Percentage (%)'
                          />
                        </Grid>
                        <Grid item xs={3} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <Typography>{this.getLoadingAmount().toFixed(2)}</Typography>
                        </Grid>
                      </Grid>

                      <Divider style={{ marginBottom: '12px' }} />

                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell align='right' />
                            <TableCell align='center'>
                              <Typography variant='h6'>Total Premium After Discount</Typography>
                            </TableCell>
                            <TableCell align='right' />
                            <TableCell align='right' />
                            <TableCell align='right'>
                              <Typography variant='h6'>
                                {Number(totalPremiumAfterLoadingAndDiscount ?? quotationDetails?.totalAfterDicountAndLoadingAmount ?? 0).toFixed(2)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>

                      <Divider style={{ marginBottom: '12px' }} />

                      <Grid item xs={6}>
                        <FormGroup row>
                          {taxList.map((row: any, i: number) => (
                            <Tooltip
                              key={i}
                              title={
                                row.mandatory?.includes("QUOTATION")
                                  ? "This tax is mandatory and cannot be changed"
                                  : ""
                              }
                              arrow
                              placement="top"
                            >
                              <span> {/* Tooltip won't work on disabled elements directly, so wrap with span */}
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={row.checked}
                                      onChange={(e) => this.handleFieldChecked(e, i)}
                                      name="checked"
                                      color="primary"
                                      disabled={row.mandatory?.includes("QUOTATION")}
                                    />
                                  }
                                  label={row.name}
                                />
                              </span>
                            </Tooltip>
                          ))}

                        </FormGroup>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      {this.state.taxList?.length ? (
                        <>
                          <Grid item xs={12} style={{ marginTop: '10px' }}>
                            <TableContainer component={Paper} elevation={0} className={classes.AccordionSummary}>
                              <Table size='small' aria-label='a dense table'>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Tax name</TableCell>
                                    <TableCell>Tax value</TableCell>
                                    <TableCell>Tax type</TableCell>
                                    <TableCell align='right'>Tax Amount</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {this.state.taxList.map((row: any, i: number) => {
                                    return (
                                      row.checked && (
                                        <TableRow key={row.id}>
                                          <TableCell>{row.name}</TableCell>
                                          <TableCell>{row.value}</TableCell>
                                          <TableCell>{row.type}</TableCell>
                                          <TableCell align='right'>{row.taxVal.toFixed(2)}</TableCell>
                                        </TableRow>
                                      )
                                    )
                                  })}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Grid>
                          <Divider style={{ marginBottom: '12px' }} />
                        </>
                      ) : null}

                      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <span style={{ fontWeight: 'bold' }}>Grand Total :{Number(this.state.totalAmountWithTax || 0).toFixed(2)}</span>
                      </Grid>

                      {showMemberTable && (
                        <Grid item xs={12}>
                          <FettleDataGrid
                            $datasource={this.services.getDataSourceMember$.bind(this.services)}
                            config={this.memberConfiguration}
                            columnsdefination={memberColDefn}
                          />
                        </Grid>
                      )}

                      <Divider style={{ margin: '12px 0' }} />

                      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {getStorageItem('userType') !== 'AGENT' &&
                          quotationDetails.quotationStatus !== QuotationStatus.PENDING_APPROVAL && <Button
                            className='p-button-secondary'
                            onClick={this.handleOpenAgentModal}
                            sx={{
                              background: 'linear-gradient(135deg, #D80E51 0%, #A00A3D 100%)',
                              color: '#fff',
                              fontWeight: 500,
                              borderRadius: '8px',
                              px: 2.5,
                              '&:hover': {
                                background: 'linear-gradient(135deg, #A00A3D 0%, #D80E51 100%)',
                              },
                            }}
                          >
                            Search Agent
                          </Button>
                        }

                        <InvoiceAgentModal
                          agentsList={agentsList}
                          handleCloseAgentModal={this.handleCloseAgentModal}
                          openAgentModal={openAgentModal}
                          setAgentsList={this.setAgentsList}
                          handleAgentModalSubmit={this.handleAgentModalSubmit}
                          prospectId={quotationDetails.prospectId}
                        />
                      </Grid>

                      <Divider style={{ margin: '8px 0' }} />

                      {agentsList?.length ? <>
                        <Grid item xs={12} style={{ marginTop: '10px' }}>
                          <Table size='small'>
                            <TableHead>
                              <TableRow>
                                <TableCell>Agent Name</TableCell>
                                <TableCell>Commission Value</TableCell>
                                <TableCell align='right'>Final Value</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {agentsList.map((row: Agent, i: number) => (
                                <TableRow key={row.agentId}>
                                  <TableCell>{row.name}</TableCell>
                                  <TableCell>
                                    <TextField
                                      size='small'
                                      type='number'
                                      name='commission'
                                      value={row.commission}
                                      disabled={this.mode === 'view'}
                                      onChange={(e) => this.changeCommission(e, i)}
                                      label='Commission value (%)'
                                    />
                                  </TableCell>
                                  <TableCell align='right'>
                                    {row.finalValue
                                      ? Number(row.finalValue).toFixed(2)
                                      : calculatePercentageAmount(row.commission, totalPremium).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Grid>

                        <Divider style={{ margin: '8px 0' }} />
                      </> : null}

                      {/* Action Buttons */}
                      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        {quotationDetails.quotationStatus !== QuotationStatus.PENDING_APPROVAL && <Button
                          color='primary'
                          onClick={this.calculatePremium}
                          sx={{
                            background: 'linear-gradient(135deg, #D80E51 0%, #A00A3D 100%)',
                            color: '#fff',
                            fontWeight: 500,
                            borderRadius: '8px',
                            px: 2.5,
                            '&:hover': {
                              background: 'linear-gradient(135deg, #A00A3D 0%, #D80E51 100%)',
                            },
                          }}
                        >
                          {buttonTxt}
                        </Button>
                        }

                        <Button color="secondary" onClick={() => this.setState({ openPreview: true })}
                          sx={{
                            background: 'linear-gradient(135deg, #6A1B9A 0%, #8E24AA 100%)',
                            color: '#fff',
                            fontWeight: 500,
                            borderRadius: '8px',
                            px: 2.5,
                            '&:hover': {
                              background: 'linear-gradient(135deg, #8E24AA 0%, #6A1B9A 100%)',
                            },
                          }}
                        >
                          Preview
                        </Button>

                        <Button
                          color="primary"
                          onClick={this.handleDownloadQuotation}
                          sx={{
                            background: 'linear-gradient(135deg, #28a745 0%, #218838 100%)',
                            color: '#fff',
                            fontWeight: 500,
                            borderRadius: '8px',
                            px: 2.5,
                            '&:hover': {
                              background: 'linear-gradient(135deg, #218838 0%, #28a745 100%)',
                            },
                          }}
                        >
                          Download Quotation
                        </Button>

                        {quotationDetails.premiumCalculationStatus === CalculationStatus.COMPLETED &&
                          quotationDetails.quotationStatus !== QuotationStatus.PENDING_APPROVAL &&
                          (
                            <Button color='primary' onClick={this.uploadDiscountAndLoading}
                              sx={{
                                background: 'linear-gradient(135deg, #FB8C00 0%, #EF6C00 100%)',
                                color: '#fff',
                                fontWeight: 500,
                                borderRadius: '8px',
                                px: 2.5,
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #EF6C00 0%, #FB8C00 100%)',
                                },
                              }}
                            >
                              Update Discount and Loading and Tax
                            </Button>
                          )}

                        {quotationDetails.premiumCalculationStatus === CalculationStatus.COMPLETED &&
                          quotationDetails.quotationStatus === QuotationStatus.DRAFT && (
                            <>
                              <Tooltip title={!agentsList?.length ? 'Select Agent First' : ''}>
                                <span>
                                  <Button color='primary' onClick={this.requestForApproval} disabled={!agentsList?.length}
                                    sx={{
                                      background: 'linear-gradient(135deg, #43A047 0%, #2E7D32 100%)',
                                      color: '#fff',
                                      fontWeight: 500,
                                      borderRadius: '8px',
                                      px: 2.5,
                                      '&:hover': {
                                        background: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
                                      },
                                      '&.Mui-disabled': {
                                        background: 'linear-gradient(135deg, #A5D6A7 0%, #C8E6C9 100%)',
                                        color: '#fff',
                                      },
                                    }}
                                  >
                                    Request For Approval
                                  </Button>
                                </span>
                              </Tooltip>
                            </>
                          )}
                      </Grid>

                      {quotationDetails.premiumCalculationStatus === CalculationStatus.COMPLETED &&
                        quotationDetails.quotationStatus === QuotationStatus.PENDING_APPROVAL && (
                          <Grid container justifyContent='flex-end' spacing={2} mt={2}>
                            <Grid item>
                              <Button
                                variant='contained'
                                color='primary'
                                onClick={() => {
                                  this.setState({
                                    openDecisionModal: true,
                                    decision: 'APPROVED'
                                  })
                                }}
                              >
                                Approve
                              </Button>
                            </Grid>
                            <Grid item>
                              <Button
                                color='secondary'
                                className='p-button-danger'
                                onClick={() => {
                                  this.setState({
                                    openDecisionModal: true,
                                    decision: 'REJECTED'
                                  })
                                }}
                              >
                                Reject
                              </Button>
                            </Grid>
                          </Grid>
                        )}
                    </>}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </DndProvider >

          < FileUploadDialogComponent
            open={openModal}
            closeModal={this.closeModal}
            addFile={false}
            changeFileStat={() => { }
            }
            onComplete={this.onComplete}
          />

          {
            openTemplate && (
              <MemberTemplateModal
                closeTemplateModal={this.closeTemplateModal}
                openTemplate={openTemplate}
                apiList={apiList}
                quotationDetails={quotationDetails}
              />
            )
          }
          {
            openPreview && (
              <QuotationDetailsScreen
                closePreview={() => this.setState({ openPreview: false })}
                openPreview={openPreview}
                quotationDetails={quotationDetails}
                premiumRuleDetails={this.state.premiumRuleDetails?.premiumRules}
              />
            )
          }
        </div >
      </>
    )
  }
}

export default withRouter(withTheme(withStyles(styles)(QuotationDesignComponent)))
