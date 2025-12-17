// hooks/useQuotationData.ts
// hooks/usePremiumCalculation.ts


// components/ProductPlanSelector.tsx

// components/PremiumRulesTable.tsx


// components/AgentCommissionTable.tsx


// components/DocumentUpload.tsx


// Main refactored component
import React, { useState, useEffect, useCallback } from 'react'
import { Grid, Paper, Snackbar, Alert, AlertTitle } from '@mui/material'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuotationData } from './components/useQuotationData'
import { usePremiumCalculation } from './components/usePremiumCalculation'
import { ProductPlanSelector } from './components/ProductPlanSelector'
import { PremiumRulesTable } from './components/PremiumRulesTable'
import { AgentCommissionTable } from './components/AgentCommissionTable'
import { DocumentUpload } from './components/DocumentUpload'
import { FettleBenefitRuleTreeViewComponent } from '@/views/apps/shared-component'

interface QuotationDesignComponentProps {
  quotationDetails: any
  updateQuotation: (details: any, type?: string) => void
  classes: any
}

export const QuotationDesignComponent: React.FC<QuotationDesignComponentProps> = ({
  quotationDetails: propQuotationDetails,
  updateQuotation,
  classes
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const quotationId = localStorage.getItem('quotationId') || ''

  // Use custom hooks
  const { quotationDetails, loading: quotationLoading } = useQuotationData(quotationId)
  const { premiumState, updateDiscountAndLoading, updateTotalPremium } = usePremiumCalculation()

  // Local state
  const [selectedProductId, setSelectedProductId] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('')
  const [rows, setRows] = useState<any[]>([])
  const [agentsList, setAgentsList] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'warning'
  })

  // Error boundary and loading states
  const [error, setError] = useState<string | null>(null)

  // Memoized callbacks
  const showSnackbar = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setSnackbar({ open: true, message, type })
  }, [])

  const closeSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }, [])

  const handleProductChange = useCallback((name: string, e: any, value: any) => {
    if (value?.id) {
      setSelectedProductId(value.id)
      // Additional product change logic here
    } else {
      setSelectedProductId('')
    }
  }, [])

  const handlePlanChange = useCallback((name: string, e: any, value: any) => {
    if (value?.id) {
      setSelectedPlan(value.id)
      setRows([]) // Reset rows when plan changes
    } else {
      setSelectedPlan('')
      setRows([])
    }
  }, [])

  const handleCommissionChange = useCallback((e: any, index: number) => {
    const { name, value } = e.target
    setAgentsList(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [name]: value }
      // Recalculate final value
      updated[index].finalValue = (Number(value) * premiumState.totalPremium) / 100
      return updated
    })
  }, [premiumState.totalPremium])

  const handleUploadDocument = useCallback((member: any, event: any) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // Document upload logic here
      showSnackbar('Medical Report Uploaded Successfully')
    } catch (err) {
      showSnackbar('Failed to upload document', 'error')
    }
  }, [showSnackbar])

  // Error handling wrapper
  const withErrorHandling = useCallback((fn: Function) => {
    return async (...args: any[]) => {
      try {
        await fn(...args)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        setError(message)
        showSnackbar(message, 'error')
      }
    }
  }, [showSnackbar])

  // Effect for handling quotation details updates
  useEffect(() => {
    if (propQuotationDetails !== quotationDetails) {
      // Handle quotation updates
      if (propQuotationDetails?.id) {
        setSelectedProductId(propQuotationDetails.productId || '')
        setSelectedPlan(propQuotationDetails.planId || '')
      }
    }
  }, [propQuotationDetails, quotationDetails])

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </div>
    )
  }

  return (
    <div className={classes.quotationDesignRoot}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.type} variant='filled'>
          <AlertTitle>{snackbar.type}</AlertTitle>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <DndProvider backend={HTML5Backend}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={3}>
            <Paper elevation={0} style={{ minHeight: 'auto', padding: 4 }}>
              {/* Benefit hierarchy component would go here */}
              {/* <FettleBenefitRuleTreeViewComponent
                hierarchy={benefitHierarchy}
                onNodeSelect={this.getBenefitParameterDetails}
                showAsTooltip={true}
                hideRightInfo={true}
                draggable={true}
              /> */}
            </Paper>
          </Grid>

          <Grid item xs={12} sm={9}>
            <Paper elevation={0} style={{ minHeight: 500, padding: 15 }}>
              <ProductPlanSelector
                selectedProductId={selectedProductId}
                selectedPlan={selectedPlan}
                productDetails={{}}
                planDetails={{}}
                onProductChange={handleProductChange}
                onPlanChange={handlePlanChange}
                onCreatePlan={() => router.push('/plans?mode=create')}
                productDataSource={null}
                planDataSource={null}
                classes={classes}
              />

              <PremiumRulesTable
                rows={rows}
                quotationDetails={quotationDetails}
                onDrop={() => { }}
                onRemovePremiumRule={() => { }}
                onHeadCountChange={() => { }}
                classes={classes}
              />

              <AgentCommissionTable
                agentsList={agentsList}
                totalPremium={premiumState.totalPremium}
                onCommissionChange={handleCommissionChange}
                onOpenAgentModal={() => { }}
                classes={classes}
              />

              <DocumentUpload
                members={members}
                onUploadDocument={handleUploadDocument}
                classes={classes}
              />
            </Paper>
          </Grid>
        </Grid>
      </DndProvider>
    </div>
  )
}




// ============================================================================
// TYPES & INTERFACES
// ============================================================================

// interface PremiumRule {
//   id: string
//   name: string
//   expression: string
//   premiumAmount: number
//   headCount: number
//   sumOfPremium: number
//   coverage?: number
//   newCoverage?: number
//   premiumPaymentFrequencies: PremiumFrequency[]
// }

// interface PremiumFrequency {
//   premiumPaymentFrequncyId: string
//   premiumAmount: number
// }

// interface CategoryRow {
//   categoryId: string
//   categoryName: string
//   premiumRules: PremiumRule[]
//   headCount: number
// }

// interface Agent {
//   name: string
//   agentId: string
//   commissionType: string
//   commission: number
//   finalValue: number
// }

// interface QuotationState {
//   selectedProductId: string
//   selectedPlan: string
//   benefitHierarchy: any[]
//   productDetails: any
//   planDetails: any
//   premiumCurrencyCd: string
//   premiumRuleDetails: any
//   rows: CategoryRow[]
//   discount: number
//   loading: number
//   totalPremiumAfterLoadingAndDiscount: number
//   openSnackbar: boolean
//   snackbarMsg: string
//   alertType: 'success' | 'warning' | 'error' | 'info'
//   premiumFrequncyList: any[]
//   selectedFrequencyId: string
//   totalPremium: number
//   quotationDetails: any
//   buttonTxt: string
//   agentsList: Agent[]
//   members: any[]
//   openAgentModal: boolean
//   isRetail: boolean
//   customCategory: CategoryRow[]
//   memberColDefn: any[]
//   benefitRuleIdsOfFunded: string[]
//   planSchemeEmpty: boolean
//   isPlanSchemeSaved: boolean
//   dataTable: any[]
//   showMemberTable: boolean
//   openDecisionModal: boolean
//   radioDecision: string
//   decision: string
//   comment: string
//   openModal: boolean
//   openTemplate: boolean
//   apiList: any[]
//   isAdminFeesApplied?: string[] // <-- Added property
//   proceed: boolean
//   customPrimumData: any[]
// }

// // ============================================================================
// // CONSTANTS
// // ============================================================================

// const MEMBER_AGE_THRESHOLD = 49
// const DEBOUNCE_DELAY = 10000
// const SNACKBAR_DURATION = 3000

// enum QuotationStatus {
//   DRAFT = 'DRAFT',
//   PENDING_APPROVAL = 'PENDING_APPROVAL',
//   APPROVED = 'APPROVED',
//   REJECTED = 'REJECTED'
// }

// enum CalculationStatus {
//   COMPLETED = 'COMPLETED',
//   INPROGRESS = 'INPROGRESS',
//   FAILED = 'FAILED'
// }

// enum MemberUploadStatus {
//   COMPLETED = 'COMPLETED',
//   INPROGRESS = 'INPROGRESS'
// }

// const getStorageItem = (key: string): string | null => {
//   try {
//     return localStorage.getItem(key)
//   } catch (error) {
//     console.error(`Error reading localStorage key "${key}":`, error)
//     return null
//   }
// }

// const getStorageJSON = <T,>(key: string): T | null => {
//   try {
//     const item = localStorage.getItem(key)
//     return item ? JSON.parse(item) : null
//   } catch (error) {
//     console.error(`Error parsing localStorage key "${key}":`, error)
//     return null
//   }
// }

// const sanitizeNumberInput = (value: string): string => {
//   return value.replace(/[^0-9]/g, '')
// }

// const calculatePercentageAmount = (percentage: number, total: number): number => {
//   return (percentage / 100) * total
// }

// const generateRandomId = (): string => {
//   return `_${Math.random().toString(36).substr(2, 9)}`
// }

// const getRandomNumberWith2to5Digits = (): number => {
//   const digitCount = Math.floor(Math.random() * 4) + 2
//   const min = Math.pow(10, digitCount - 1)
//   const max = Math.pow(10, digitCount) - 1
//   return Math.floor(Math.random() * (max - min + 1)) + min
// }

// import React from 'react'
// import { Subscription } from 'rxjs'
// import {
//   Grid, Paper, Button, TextField, Table, TableBody, TableCell,
//   TableHead, TableRow, Accordion, AccordionSummary, AccordionDetails,
//   Typography, Divider, Tooltip, IconButton, FormControl, InputLabel,
//   Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
//   Snackbar, Box
// } from '@mui/material'
// import { Alert, AlertTitle } from '@mui/lab'
// import AddIcon from '@mui/icons-material/Add'
// import DeleteIcon from '@mui/icons-material/Delete'
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
// import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
// import { withStyles, withTheme } from '@mui/styles'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { DndProvider } from 'react-dnd'
// import { HTML5Backend } from 'react-dnd-html5-backend'
// import { delay, EMPTY, expand, forkJoin, map, switchMap } from 'rxjs'
// import { Dropdown } from 'primereact/dropdown'
// import { Tag } from 'primereact/tag'

// // Services
// import { BenefitStructureService } from '@/services/remote-api/api/benefit-structure-services'
// import { PremiumFrequencyService } from '@/services/remote-api/api/master-services'
// import { MemberProcessService, MemberService } from '@/services/remote-api/api/member-services'
// import { PlanService } from '@/services/remote-api/api/plan-services'
// import { ProductService } from '@/services/remote-api/api/product-services'
// import { QuotationService } from '@/services/remote-api/api/quotation-services'
// import { AgentsService, defaultPageRequest } from '@/services/remote-api/fettle-remote-api'
// import { replaceAll, toTitleCase } from '@/services/utility'
// import { MemberFieldConstants } from '@/views/apps/member-upload-management/MemberFieldConstants'
// import {
//   FettleAutocomplete,
//   FettleBenefitRuleTreeViewComponent,
//   FettleDataGrid
// } from '@/views/apps/shared-component'

// import './css/index.css'
// import './css/material-rte.css'
// import FileUploadDialogComponent from './file.upload.dialog'
// import MemberTemplateModal from './member.template.dialog'
// import InvoiceAgentModal from './modals/invoice.agent.modal.component'
// import { StatefulTargetBox as TargetBox } from './targetbox'
// import { rowsMetaStateInitializer } from '@mui/x-data-grid/internals'

// const styles = (theme: any) => ({
//   formControl: {
//     margin: theme?.spacing ? theme.spacing(1) : '8px',
//     width: '100%'
//   },
//   ruleContainer: {
//     cursor: 'pointer',
//     display: 'inline-flex',
//     alignItems: 'center'
//   },
//   lineEllipsis: {
//     textOverflow: 'ellipsis',
//     width: '95%',
//     display: 'block',
//     overflow: 'hidden'
//   },
//   AccordionSummary: {
//     backgroundColor: theme?.palette?.background.default
//   },
//   inputRoot: {},
//   disabled: {}
// })

// const HtmlTooltip = withStyles((theme: any) => ({
//   tooltip: {
//     backgroundColor: '#f5f5f9',
//     color: 'rgba(0, 0, 0, 0.87)',
//     maxWidth: 220,
//     fontSize: theme?.typography?.pxToRem(12),
//     border: '1px solid #dadde9'
//   }
// }))(Tooltip)

// // ============================================================================
// // HELPER FUNCTIONS
// // ============================================================================

// class QuotationHelpers {
//   static addRandomEIdToHierarchy(node: any): void {
//     node.eId = getRandomNumberWith2to5Digits()

//     if (Array.isArray(node.child) && node.child.length > 0) {
//       node.child.forEach((childNode: any) => this.addRandomEIdToHierarchy(childNode))
//     }
//     if (node.hirearchy && Array.isArray(node.hirearchy.child) && node.hirearchy.child.length > 0) {
//       node.hirearchy.child.forEach((childNode: any) => this.addRandomEIdToHierarchy(childNode))
//     }
//   }

//   static extractRulesRecursively(element: any): any[] {
//     if (!element) return []

//     if (element.child && Array.isArray(element.child)) {
//       let rules: any[] = []
//       for (const item of element.child) {
//         rules = [...rules, ...this.extractRulesRecursively(item)]
//       }
//       return rules
//     }

//     return [element]
//   }

//   static findParent(benefitItems: any, ruleObj: any): any {
//     if (!benefitItems?.child) return null

//     for (const b of benefitItems.child) {
//       const elm = b.child?.filter((c: any) => c.id === ruleObj.parentId)
//       if (elm && elm.length > 0) {
//         return elm[0]
//       }

//       const parentRule = this.findParent(b, ruleObj)
//       if (parentRule) return parentRule
//     }

//     return null
//   }

//   static getTotalPremium(rows: CategoryRow[]): number {
//     return rows.reduce((acc, currVal) => {
//       if (currVal.premiumRules.length > 0) {
//         return acc + currVal.premiumRules.reduce((a, c) => a + c.sumOfPremium, 0)
//       }
//       return acc
//     }, 0)
//   }
// }

// // ============================================================================
// // SERVICE LAYER
// // ============================================================================

// class QuotationServiceLayer {
//   private productService: ProductService
//   private benefitStructureService: BenefitStructureService
//   private planService: PlanService
//   private premiumFrequencyService: PremiumFrequencyService
//   private memberService: MemberService
//   private quotationService: QuotationService
//   private memberProcessService: MemberProcessService
//   private agentService: AgentsService

//   constructor() {
//     this.productService = new ProductService()
//     this.benefitStructureService = new BenefitStructureService()
//     this.planService = new PlanService()
//     this.premiumFrequencyService = new PremiumFrequencyService()
//     this.memberService = new MemberService()
//     this.quotationService = new QuotationService()
//     this.memberProcessService = new MemberProcessService()
//     this.agentService = new AgentsService()
//   }

//   getDataSourceMember$(pageRequest: any = { page: 0, size: 10, summary: true, active: true }) {
//     pageRequest.key = 'sourceType'
//     pageRequest.value = 'QUOTATION'
//     pageRequest.key2 = 'sourceId'
//     pageRequest.value2 = getStorageItem('quotationId')
//     return this.memberProcessService.getMemberRequests(pageRequest)
//   }

//   getProductDetails(productId: string) {
//     return this.productService.getProductDetails(productId)
//   }

//   getPremiumDetails(productId: string) {
//     return this.productService.getPremiums(productId)
//   }

//   getPlanDetails(planId: string) {
//     return this.planService.getPlanDetails(planId)
//   }

//   getAllBenefitStructures() {
//     return this.benefitStructureService.getAllBenefitStructures({
//       page: 0,
//       size: 1000000,
//       summary: true
//     })
//   }

//   getPremiumFrequencies() {
//     return this.premiumFrequencyService.getPremiumFrequencies()
//   }

//   getMemberConfiguration() {
//     return this.memberService.getMemberConfiguration()
//   }

//   getSourceDetails(sourceId: string) {
//     return this.memberService.getSourceDetails(sourceId)
//   }

//   savePlanScheme(payload: any, sourceType: string, sourceId: string) {
//     return this.memberService.savePlanScheme(payload, sourceType, sourceId)
//   }

//   addPlanCategory(categories: any[], planId: string) {
//     return this.planService.addPlanCategory(categories, planId)
//   }

//   updateQuotation(pageRequest: any, payload: any, quotationId: string) {
//     return this.quotationService.updateQuotation(pageRequest, payload, quotationId)
//   }

//   uploadDiscountAndLoading(payload: any, quotationId: string) {
//     return this.quotationService.uploadDiscountAndLoading(payload, quotationId)
//   }

//   requestForApproval(quotationId: string) {
//     return this.quotationService.requestForApproval(quotationId)
//   }

//   getQuotationDetailsByID(quotationId: string) {
//     return this.quotationService.getQuoationDetailsByID(quotationId)
//   }

//   uploadMedicalReport(memberId: string, formData: FormData) {
//     return this.quotationService.uploadMedicalReport(memberId, formData)
//   }

//   quotationDecision(payload: any, quotationId: string) {
//     return this.quotationService.quotationDecision(payload, quotationId)
//   }

//   getAgentDetails(agentId: string) {
//     return this.agentService.getAgentDetails(agentId)
//   }

//   importAgentData(pageRequest: any) {
//     return this.agentService.importAgentData(pageRequest)
//   }

//   getPlanFromProduct(productId: string) {
//     return this.planService.getPlanFromProduct(productId)
//       .pipe(map((res: any) => ({ content: res, totalElements: res.length })))
//   }

//   getProducts(reqParam: any) {
//     return this.productService.getProducts(reqParam)
//   }

//   getCustomCoveragePremium(payload: any) {
//     return this.productService.customCoveragePremium(payload)
//   }

//   createCustomPremium(id: any, payload: any) {
//     return this.productService.customPremiumCreation(id, payload)
//   }
// }

// // ============================================================================
// // ROUTER WRAPPER
// // ============================================================================

// function withRouter(Component: any) {
//   return function WrappedComponent(props: any) {
//     const router = useRouter()
//     const query = useSearchParams()
//     return <Component {...props} router={router} query={query} />
//   }
// }

// // ============================================================================
// // MAIN COMPONENT CLASS
// // ============================================================================

// class QuotationDesignComponent extends React.Component<any, QuotationState> {
//   private subscriptions: Subscription[] = []
//   private services: QuotationServiceLayer
//   private query: any
//   private mode: string | null
//   private memberConfiguration: any

//   constructor(props: any) {
//     super(props)

//     this.services = new QuotationServiceLayer()
//     this.query = this.props.query
//     this.mode = this.query.get('mode')

//     this.state = {
//       selectedProductId: '',
//       selectedPlan: '',
//       benefitHierarchy: [],
//       productDetails: {},
//       planDetails: {},
//       premiumCurrencyCd: '',
//       premiumRuleDetails: {},
//       rows: [],
//       discount: 0,
//       loading: 0,
//       totalPremiumAfterLoadingAndDiscount: 0,
//       openSnackbar: false,
//       snackbarMsg: '',
//       alertType: 'success',
//       premiumFrequncyList: [],
//       selectedFrequencyId: '',
//       totalPremium: 0,
//       quotationDetails: {},
//       buttonTxt: 'Calculate',
//       agentsList: [],
//       members: [],
//       openAgentModal: false,
//       isRetail: true,
//       customCategory: [],
//       memberColDefn: [],
//       benefitRuleIdsOfFunded: [],
//       planSchemeEmpty: false,
//       isPlanSchemeSaved: false,
//       dataTable: [],
//       showMemberTable: false,
//       openDecisionModal: false,
//       radioDecision: '',
//       decision: '',
//       comment: '',
//       openModal: false,
//       openTemplate: false,
//       apiList: [],
//       proceed: false,
//       customPrimumData: [],
//     }

//     this.memberConfiguration = {
//       enableSelection: false,
//       scrollHeight: '300px',
//       pageSize: 10,
//       actionButtons: false,
//       onLoadedData: this.onLoadedData,
//       editCell: true,
//       header: {
//         enable: true,
//         text: 'Member Management',
//         addCreateButton: true,
//         createButtonText: 'Save',
//         createButtonIcon: 'pi pi-save',
//         onCreateButtonClick: this.saveRowEdit
//       }
//     }

//     this.initializeComponent()
//   }

//   componentDidMount() {
//     const { quotationDetails } = this.props
//     this.loadQuotationAgents(quotationDetails)
//   }

//   componentDidUpdate(prevProps: any) {
//     const { quotationDetails } = this.props

//     if (quotationDetails !== this.state.quotationDetails) {
//       this.handleQuotationDetailsUpdate(quotationDetails)
//     }
//   }

//   componentWillUnmount() {
//     this.subscriptions.forEach(sub => {
//       if (sub && !sub.closed) {
//         sub.unsubscribe()
//       }
//     })
//   }

//   // ============================================================================
//   // INITIALIZATION
//   // ============================================================================

//   private initializeComponent = () => {
//     this.getPaymentFrequencies()
//     this.getMemberConfig()
//     this.getMemberConfiguration()
//     this.getAgentDetails()
//   }

//   private loadQuotationAgents = (quotationDetails: any) => {
//     if (!quotationDetails?.quotationAgents) return

//     const temp: Agent[] = []
//     quotationDetails.quotationAgents.forEach((el: any) => {
//       const sub = this.services.getAgentDetails(el.agentId).subscribe({
//         next: (res: any) => {
//           const item: Agent = {
//             name: res.agentBasicDetails.name,
//             agentId: res.id,
//             commissionType: el.commissionType,
//             commission: el.commissionValue,
//             finalValue: Number(el.finalValue)
//           }
//           temp.push(item)
//           this.setState({ agentsList: temp })
//         },
//         error: (error) => {
//           console.error('Error loading agent:', error)
//         }
//       })
//       this.subscriptions.push(sub)
//     })
//   }

//   private handleQuotationDetailsUpdate = (quotationDetails: any) => {
//     if (quotationDetails.changeType) {
//       this.setState({ quotationDetails })
//       return
//     }

//     if (quotationDetails.id) {
//       this.setState({
//         quotationDetails,
//         selectedProductId: quotationDetails.productId,
//         selectedPlan: quotationDetails.planId
//       }, () => {
//         setTimeout(this.buildPremiumRules, 0)
//       })
//     }

//     if (quotationDetails.memberUploadStatus === MemberUploadStatus.COMPLETED) {
//       this.fetchMemberUploads()
//     }

//     if (quotationDetails.memberUploadStatus === MemberUploadStatus.INPROGRESS) {
//       this.checkCalculationStatus()
//     }
//   }

//   // ============================================================================
//   // DATA FETCHING
//   // ============================================================================

//   private getPaymentFrequencies = () => {
//     const sub = this.services.getPremiumFrequencies().subscribe({
//       next: (res: any) => {
//         const selectedFreq = res.content.filter(
//           (f: any) => f.name.toLowerCase() === 'per annum'
//         )
//         this.setState({
//           premiumFrequncyList: res.content,
//           selectedFrequencyId: this.props.quotationDetails.paymentFrequency || selectedFreq[0]?.id || ''
//         })
//       },
//       error: (error) => {
//         console.error('Error fetching payment frequencies:', error)
//         this.toggleSnackbar(true, 'error', 'Failed to load payment frequencies')
//       }
//     })
//     this.subscriptions.push(sub)
//   }

//   private getMemberConfig = () => {
//     const sub = this.services.getMemberConfiguration().subscribe({
//       next: (res: any) => {
//         res.content[0]?.fields.forEach((el: any) => {
//           if (el.sourceApiId) {
//             this.getAPIDetails(el.sourceApiId)
//           }
//         })
//       },
//       error: (error) => {
//         console.error('Error fetching member config:', error)
//       }
//     })
//     this.subscriptions.push(sub)
//   }

//   private getMemberConfiguration = () => {
//     const sub = this.services.getMemberConfiguration().subscribe({
//       next: (res: any) => {
//         if (res.content && res.content.length > 0) {
//           const colDef = this.buildMemberColumns(res.content[0].fields)
//           this.setState({ memberColDefn: colDef })
//         }
//       },
//       error: (error) => {
//         console.error('Error fetching member configuration:', error)
//       }
//     })
//     this.subscriptions.push(sub)
//   }

//   private buildMemberColumns = (fields: any[]) => {
//     const colDef = fields.map((r: any) => {
//       const col: any = {
//         field: MemberFieldConstants[r?.name?.toUpperCase() as keyof typeof MemberFieldConstants],
//         headerName: toTitleCase(replaceAll(r.name, '_', ' '))
//       }

//       if (r.name === 'DATE_OF_BIRTH') {
//         col.body = (rowData: any) => (
//           <span style={{ lineBreak: 'anywhere' }}>
//             {new Date(rowData.dateOfBirth).toLocaleDateString()}
//           </span>
//         )
//       }

//       if (r.name === 'MEMBERSHIP_NO') {
//         col.body = (rowData: any) => (
//           <span style={{ lineBreak: 'anywhere' }}>{rowData.membershipNo}</span>
//         )
//       }

//       if (r.name === 'MOBILE_NO') {
//         col.body = (rowData: any) => (
//           <span style={{ lineBreak: 'anywhere' }}>{rowData.mobileNo}</span>
//         )
//       }

//       if (r.name === 'EMAIL') {
//         col.body = (rowData: any) => (
//           <span style={{ lineBreak: 'anywhere' }}>{rowData.email}</span>
//         )
//       }

//       if (r.name === 'PLAN_SCHEME') {
//         col.body = (rowData: any) => (
//           <Tag value={rowData.planScheme} severity='success' />
//         )
//         col.editor = this.editor
//         col.style = { width: '10%', minWidth: '8rem' }
//         col.bodyStyle = { cursor: 'pointer' }
//         col.onCellEditComplete = this.onCellEditComplete
//       }

//       return col
//     })

//     const fieldNamesToRemove = [
//       'email',
//       'mobileNo',
//       'membershipNo',
//       'identificationDocType',
//       'identificationDocNumber'
//     ]

//     return colDef.filter((column: any) => !fieldNamesToRemove.includes(column.field))
//   }

//   private getAgentDetails = () => {
//     const userType = getStorageItem('userType')
//     const userDetails = getStorageJSON<any>('user_details')

//     if (userType !== 'AGENT' || !userDetails) return

//     const pageRequest = {
//       page: 0,
//       size: 10,
//       summary: false,
//       name: userDetails.name
//     }

//     const sub = this.services.importAgentData(pageRequest).subscribe({
//       next: (res: any) => {
//         const content = res.content
//         if (!content || content.length === 0) return

//         const agent: Agent = {
//           name: content[0].agentBasicDetails.name,
//           agentId: content[0].id,
//           commissionType: 'PERCENTAGE',
//           commission: content[0].commission,
//           finalValue: 0
//         }

//         this.setState({ agentsList: [agent] })
//       },
//       error: (error) => {
//         console.error('Error fetching agent details:', error)
//       }
//     })
//     this.subscriptions.push(sub)
//   }

//   private getAPIDetails = (sourceId: string) => {
//     const sub = this.services.getSourceDetails(sourceId).subscribe({
//       next: (res: any) => {
//         this.setState(prevState => ({
//           apiList: [...prevState.apiList, res]
//         }))
//       },
//       error: (error) => {
//         console.error('Error fetching API details:', error)
//       }
//     })
//     this.subscriptions.push(sub)
//   }

//   private fetchMemberUploads = () => {
//     const sub = this.services.getDataSourceMember$().subscribe({
//       next: (page: any) => {
//         const sub2 = this.services.getDataSourceMember$({
//           page: 0,
//           size: page.totalElements
//         }).subscribe({
//           next: (res: any) => {
//             const membersOver49 = res.content.filter(
//               (item: any) => item.age > MEMBER_AGE_THRESHOLD
//             )
//             const planSchemeEmpty = res.content.some(
//               (item: any) => ['', undefined, null].includes(item.planScheme)
//             )

//             this.setState({
//               members: membersOver49,
//               showMemberTable: planSchemeEmpty
//             })
//           },
//           error: (error: any) => {
//             console.error('Error fetching member uploads:', error)
//           }
//         })
//         this.subscriptions.push(sub2)
//       },
//       error: (error: any) => {
//         console.error('Error fetching member page:', error)
//       }
//     })
//     this.subscriptions.push(sub)
//   }

//   // ============================================================================
//   // PREMIUM RULES
//   // ============================================================================

//   private buildPremiumRules = () => {
//     const { quotationDetails } = this.props
//     if (!quotationDetails.productId) return

//     const sub = forkJoin([
//       this.services.getProductDetails(quotationDetails.productId),
//       this.services.getPremiumDetails(quotationDetails.productId)
//     ])
//       .pipe(
//         switchMap((res: any) => {
//           const fundedRuleIds = this.extractFundedRuleIds(res[0].productRules)

//           this.setState({
//             productDetails: res[0],
//             premiumCurrencyCd: res[0].productBasicDetails.premiumCurrencyCd,
//             premiumRuleDetails: res[1],
//             benefitRuleIdsOfFunded: fundedRuleIds
//           })

//           this.getAllBenefitStructures()
//           return this.services.getPlanDetails(quotationDetails.planId)
//         })
//       )
//       .subscribe({
//         next: (res: any) => {
//           console.log("1234567890987654321", res)
//           if (res.id) {
//             const rows = this.buildCategoryRows(res, quotationDetails)
//             // console.log('Plan details fetched:', rows)
//             this.setState({
//               planDetails: res,
//               totalPremium: quotationDetails.totalPremium,
//               rows
//             })
//           }
//         },
//         error: (error) => {
//           console.error('Error building premium rules:', error)
//           this.toggleSnackbar(true, 'error', 'Failed to load premium rules')
//         }
//       })
//     this.subscriptions.push(sub)
//   }

//   private extractFundedRuleIds = (productRules: any[]): string[] => {
//     const fundedIds: string[] = []
//     productRules?.forEach((rule: any) => {
//       if (rule.fundManagedBy === 'FUNDED') {
//         fundedIds.push(...rule.premiumRuleIds)
//       }
//     })
//     return fundedIds
//   }

//   private buildCategoryRows = (planDetails: any, quotationDetails: any): CategoryRow[] => {
//     return planDetails.planCategorys.map((p: any) => {
//       const catAmts = quotationDetails.categoryMemberHeadCountPremiumAmounts?.[p.name]
//       const categoryRules = quotationDetails.catagoryPremiumRules?.[p.name] || []
//       // console.log("1234567890", planDetails, quotationDetails)
//       return {
//         categoryId: p.id,
//         categoryName: p.name,
//         premiumRules: categoryRules.map((qpr: any) => {
//           const ruleDetails = this.getPremiumRuleDetails(qpr)
//           return {
//             ...ruleDetails,
//             sumOfPremium: catAmts ? catAmts.premiumAmount : 0
//           }
//         }),
//         headCount: catAmts ? catAmts.headCount : 0
//       }
//     })
//   }

//   getPremiumRuleDetails = (id: any) => {
//     const { premiumRuleDetails } = this.state
//     const { quotationDetails } = this.props
//     let ruleObj, freqObj

//     for (const i in premiumRuleDetails.premiumRules) {
//       ruleObj = premiumRuleDetails.premiumRules[i].premiumRules.find((rd: any) => rd.id == id)

//       if (ruleObj) {
//         freqObj = ruleObj.premiumPaymentFrequencies.find(
//           (ppf: any) => ppf.premiumPaymentFrequncyId == quotationDetails.paymentFrequency
//         )

//         // break;
//         return { ...ruleObj, premiumAmount: freqObj.premiumAmount, coverage: premiumRuleDetails.premiumRules[i].coverageAmount }
//       }
//     }

//     // return { ...ruleObj, premiumAmount: freqObj.premiumAmount };
//   }

//   // private getPremiumRuleDetails = (id: string): any => {
//   //   const { premiumRuleDetails } = this.state
//   //   const { quotationDetails } = this.props

//   //   for (const rule of premiumRuleDetails.premiumRules || []) {
//   //     const ruleObj = rule.premiumRules.find((rd: any) => rd.id === id)
//   //     if (ruleObj) {
//   //       const freqObj = ruleObj.premiumPaymentFrequencies.find(
//   //         (ppf: any) => ppf.premiumPaymentFrequncyId === quotationDetails.paymentFrequency
//   //       )
//   //       return { ...ruleObj, premiumAmount: freqObj?.premiumAmount || 0 }
//   //     }
//   //   }
//   //   return {}
//   // }

//   private getAllBenefitStructures = () => {
//     const sub = this.services.getAllBenefitStructures().subscribe({
//       next: (res: any) => {
//         if (res.content) {
//           this.buildPreviewHierarchy(res.content)
//         }
//       },
//       error: (error) => {
//         console.error('Error fetching benefit structures:', error)
//       }
//     })
//     this.subscriptions.push(sub)
//   }

//   private buildPreviewHierarchy = (benefitStructures: any[]) => {
//     const previewHierarchy = benefitStructures.map((benefit: any) => ({
//       ...benefit,
//       hirearchy: { ...benefit.hirearchy, child: [] }
//     }))

//     this.state.productDetails?.productRules?.forEach((rule: any) => {
//       this.addRuleToHierarchy(benefitStructures, previewHierarchy, rule)
//     })

//     previewHierarchy.forEach((node: any) => {
//       QuotationHelpers.addRandomEIdToHierarchy(node)
//     })

//     const filteredHierarchy = previewHierarchy.filter(
//       (node: any) => node.hirearchy.child?.length > 0
//     )

//     previewHierarchy.forEach((node: any) => {
//       node?.hirearchy?.child?.forEach((el: any) => {
//         node.coverage = el.coverageAmount
//       })
//     })

//     this.setState({ benefitHierarchy: filteredHierarchy })
//   }

//   private addRuleToHierarchy = (
//     benefitStructures: any[],
//     previewHierarchy: any[],
//     rule: any
//   ) => {
//     const mainBenefitIndex = benefitStructures.findIndex(
//       (b: any) => b.id === rule.benefitStructureId
//     )

//     if (mainBenefitIndex === -1) return

//     const benefitElm = benefitStructures[mainBenefitIndex].hirearchy

//     if (benefitElm.id === rule.benefitId) {
//       this.addRuleToMainBenefit(previewHierarchy[mainBenefitIndex].hirearchy, rule)
//     } else {
//       this.getChildBenefitHierarchy(
//         benefitElm,
//         rule,
//         previewHierarchy,
//         mainBenefitIndex
//       )
//     }
//   }

//   private addRuleToMainBenefit = (hierarchy: any, rule: any) => {
//     const o = hierarchy

//     if (!rule.parentId) {
//       o.child.push({
//         ...rule,
//         benefitCode: o.code,
//         child: [],
//         type: 'rule'
//       })
//     }

//     o.child.push({
//       ...rule,
//       coverageAmount: rule.coverageAmount
//     })

//     this.addPremiumRulesToHierarchy(o, rule)
//   }

//   private addPremiumRulesToHierarchy = (hierarchy: any, rule: any) => {
//     const premiumRules = this.state.premiumRuleDetails.premiumRules?.filter(
//       (p: any) => p.productRuleId === rule.id
//     ) || []

//     if (premiumRules.length === 0) return

//     const pIdx = hierarchy.child.findIndex((c: any) => c.id === rule.id)
//     if (pIdx === -1 || !hierarchy.child[pIdx]) return

//     const lastPremiumRule = premiumRules[premiumRules.length - 1]
//     const premiumRuleList = lastPremiumRule?.premiumRules || []

//     hierarchy.child[pIdx].child = [
//       ...(hierarchy.child[pIdx].child || []),
//       ...premiumRuleList.map((item: any) => ({
//         ...item,
//         type: 'premiumRule',
//         // cAmount: hierarchy.child[pIdx]?.coverageAmount
//       }))
//     ]
//   }

//   private getChildBenefitHierarchy = (
//     benefitElm: any,
//     rule: any,
//     previewHierarchy: any[],
//     mainBenefitIndex: number
//   ) => {
//     if (!benefitElm.child || benefitElm.child.length === 0) return

//     const subBenefitIndex = benefitElm.child.findIndex(
//       (item: any) => item.id === rule.benefitId
//     )

//     if (subBenefitIndex > -1) {
//       const newBenefitElm = {
//         ...benefitElm.child[subBenefitIndex],
//         child: [],
//         type: 'benefit'
//       }

//       if (rule.parentId) {
//         this.getChildRuleHierarchy(
//           previewHierarchy[mainBenefitIndex].hirearchy,
//           mainBenefitIndex,
//           rule,
//           newBenefitElm
//         )
//       }
//     } else {
//       benefitElm.child.forEach((item: any) => {
//         this.getChildBenefitHierarchy(item, rule, previewHierarchy, mainBenefitIndex)
//       })
//     }
//   }

//   private getChildRuleHierarchy = (
//     parentHierarchy: any,
//     mainBenefitIndex: number,
//     rule: any,
//     newBenefitElm: any
//   ) => {
//     const parentIdx = parentHierarchy?.child?.findIndex(
//       (item: any) => item.id === rule.parentId
//     )

//     if (parentIdx === -1) {
//       parentHierarchy?.child?.forEach((item: any) => {
//         this.getChildRuleHierarchy(item, mainBenefitIndex, rule, newBenefitElm)
//       })
//       return
//     }

//     let benefitIdx = parentHierarchy.child[parentIdx].child.findIndex(
//       (benefit: any) => benefit.id === newBenefitElm.id
//     )

//     if (benefitIdx === -1) {
//       parentHierarchy.child[parentIdx].child.push(newBenefitElm)
//       benefitIdx = parentHierarchy.child[parentIdx].child.length - 1
//     }

//     const o = parentHierarchy.child[parentIdx].child[benefitIdx]
//     o.child.push({ ...rule, benefitCode: o.code, child: [], type: 'rule' })

//     this.addPremiumRulesToChildHierarchy(o, rule)
//   }

//   private addPremiumRulesToChildHierarchy = (hierarchy: any, rule: any) => {
//     const premiumRules = this.state.premiumRuleDetails.premiumRules?.filter(
//       (p: any) => p.productRuleId === rule.id
//     ) || []

//     if (premiumRules.length === 0) return

//     const pIdx = hierarchy.child.findIndex((c: any) => c.id === rule.id)
//     if (pIdx === -1 || !hierarchy.child[pIdx]) return

//     const lastPremiumRule = premiumRules[premiumRules.length - 1]
//     const premiumRuleList = lastPremiumRule?.premiumRules || []

//     hierarchy.child[pIdx].child = [
//       ...(hierarchy.child[pIdx].child || []),
//       ...premiumRuleList.map((item: any) => ({
//         ...item,
//         type: 'premiumRule',
//         // cAmount: hierarchy.child[pIdx]?.coverageAmount
//       }))
//     ]
//   }

//   // ============================================================================
//   // EVENT HANDLERS
//   // ============================================================================

//   private handleProductChange = (name: string, e: any, value: any) => {
//     if (value?.id) {
//       this.buildProductDetails(name, value.id)
//     } else {
//       this.setState({ [name]: '' } as any)
//     }
//   }

//   private buildProductDetails = (name: string, id: string) => {
//     this.setState({ [name]: id } as any)

//     const sub = forkJoin([
//       this.services.getProductDetails(id),
//       this.services.getPremiumDetails(id)
//     ]).subscribe({
//       next: (res: any) => {
//         const fundedIds = this.extractFundedRuleIds(res[0].productRules)

//         this.setState({
//           selectedProductId: id,
//           productDetails: res[0],
//           premiumCurrencyCd: res[0].productBasicDetails.premiumCurrencyCd,
//           premiumRuleDetails: res[1],
//           benefitRuleIdsOfFunded: fundedIds
//         })

//         this.getAllBenefitStructures()
//       },
//       error: (error) => {
//         console.error('Error building product details:', error)
//         this.toggleSnackbar(true, 'error', 'Failed to load product details')
//       }
//     })
//     this.subscriptions.push(sub)
//   }

//   private handlePlanChange = (name: string, e: any, value: any) => {
//     if (value?.id) {
//       this.setState({ [name]: value.id, rows: [] } as any)

//       const sub = this.services.getPlanDetails(value.id).subscribe({
//         next: (res: any) => {
//           if (res.id) {
//             const rows = res.planCategorys.map((p: any) => ({
//               categoryId: p.id,
//               categoryName: p.name,
//               premiumRules: []
//             }))
//             this.setState({ rows })
//           }
//         },
//         error: (error) => {
//           console.error('Error loading plan:', error)
//           this.toggleSnackbar(true, 'error', 'Failed to load plan')
//         }
//       })
//       this.subscriptions.push(sub)
//     } else {
//       this.setState({ [name]: '', rows: [] } as any)
//     }
//   }

//   private handleFrequency = (e: any) => {
//     const { name, value } = e.target
//     const updatedRows = [...this.state.rows]

//     updatedRows.forEach((row: CategoryRow) => {
//       row.premiumRules.forEach((pr: PremiumRule) => {
//         const filteredFrequency = pr.premiumPaymentFrequencies?.filter(
//           (p: PremiumFrequency) => p.premiumPaymentFrequncyId === value
//         )

//         const amt = filteredFrequency?.[0]?.premiumAmount || 0
//         pr.premiumAmount = amt
//         pr.sumOfPremium = amt * row.headCount
//       })
//     })

//     const totalPremium = QuotationHelpers.getTotalPremium(updatedRows)

//     this.setState({
//       [name]: value,
//       rows: updatedRows,
//       totalPremium
//     } as any)
//   }

//   private handleHeadCountChange = (e: any, rowIdx: number) => {
//     const { name, value } = e.target
//     const inputValue = sanitizeNumberInput(value)
//     const rows = [...this.state.rows]

//     rows[rowIdx] = {
//       ...rows[rowIdx],
//       [name]: Number(inputValue)
//     }

//     rows[rowIdx].premiumRules = rows[rowIdx].premiumRules.map((pr: PremiumRule) => ({
//       ...pr,
//       sumOfPremium: Number(inputValue) * pr.premiumAmount
//     }))

//     const totalPremium = QuotationHelpers.getTotalPremium(rows)

//     this.setState({ rows, totalPremium })
//   }

//   private handleCoverageChange = (e: any, rowIndex: number, ruleIndex: number, p: any) => {
//     const newValue = Number(e.target.value)
//     console.log("1234567890", newValue, rowIndex, ruleIndex)

//     // Update local state immediately
//     this.setState((prevState) => {
//       const updatedRows = [...prevState.rows]
//       const updatedPremiumRules = [...updatedRows[rowIndex].premiumRules]

//       updatedPremiumRules[ruleIndex] = {
//         ...updatedPremiumRules[ruleIndex],
//         newCoverage: newValue
//       }

//       updatedRows[rowIndex] = {
//         ...updatedRows[rowIndex],
//         premiumRules: updatedPremiumRules
//       }

//       return { rows: updatedRows }
//     })
//   }

//   // 👇 API call only when user leaves the input
//   private handleCoverageBlur = (p: any, rowIndex: number, ruleIndex: number) => {
//     const newValue = this.state.rows[rowIndex].premiumRules[ruleIndex].coverage
//     const payload = {
//       coverageAmount: p.coverage,
//       premiumAmount: p.premiumAmount,
//       modifiedCoverageAmount: p.newCoverage
//     }

//     this.services.getCustomCoveragePremium(payload).subscribe({
//       next: (res: any) => {
//         this.setState((prevState) => {
//           const updatedRows = [...prevState.rows]
//           const updatedPremiumRules = [...updatedRows[rowIndex].premiumRules]

//           updatedPremiumRules[ruleIndex] = {
//             ...updatedPremiumRules[ruleIndex],
//             premiumAmount: res.modifiedPremiumAmount
//           }

//           updatedRows[rowIndex] = {
//             ...updatedRows[rowIndex],
//             premiumRules: updatedPremiumRules
//           }
//           return { rows: updatedRows }
//         })


//         let id;
//         this.state.benefitHierarchy.forEach((b: any) => {
//           b.hirearchy.child.forEach((child: any) => {
//             if (child.premiumRuleIds.includes(p.id)) {
//               id = child.id
//             }
//           })
//         })
//         console.log("oooooooooo", id)
//         let obj = {
//           ruleId: id,
//           premiumId: p.id,
//           coverageAmount: p.newCoverage,
//           premiumAmount: res.modifiedPremiumAmount
//         }
//         this.setState((prevState) => {
//           const updatedCustomPrimumData = [...prevState.customPrimumData, obj]
//           return { customPrimumData: updatedCustomPrimumData }
//         })
//       }
//     })
//   }



//   // ============================================================================
//   // DRAG AND DROP
//   // ============================================================================

//   private handleDrop = (row: CategoryRow, ruleObj: any) => {
//     const insertIdx = this.state.rows.findIndex(
//       (r: CategoryRow) => r.categoryName === row.categoryName
//     )

//     if (insertIdx === -1) {
//       console.error('Category not found:', row.categoryName)
//       return
//     }

//     const rules = QuotationHelpers.extractRulesRecursively(ruleObj)

//     this.state.premiumRuleDetails?.premiumRules?.forEach((r: any) => {
//       r?.premiumRules?.forEach((pr: any) => {
//         rules?.forEach((rule: any) => {
//           if (pr.id == rule.id) {
//             rule.coverageAmount = r.coverageAmount
//           }
//         })
//       })
//     })
//     console.log("ppppp", rules, this.state.premiumRuleDetails)

//     this.setState((prevState) => {
//       const updatedRows = [...prevState.rows]
//       rules.forEach((rule: any) => {
//         this.addRuleToRow(updatedRows, insertIdx, rule)
//       })
//       return { rows: updatedRows }
//     })
//   }

//   private addRuleToRow = (rows: CategoryRow[], idx: number, ruleObj: any) => {
//     console.log("rrrrr", ruleObj)
//     const isRuleExist = rows[idx].premiumRules.some(
//       (p: PremiumRule) => p.id === ruleObj.id
//     )

//     if (isRuleExist) return

//     const filteredFrequency = this.state.selectedFrequencyId
//       ? ruleObj.premiumPaymentFrequencies?.filter(
//         (p: PremiumFrequency) =>
//           p.premiumPaymentFrequncyId === this.state.selectedFrequencyId
//       )
//       : []

//     const premiumAmount = filteredFrequency?.[0]?.premiumAmount || 0

//     const newRule: PremiumRule = {
//       name: ruleObj.name,
//       coverage: ruleObj.coverageAmount,
//       expression: ruleObj.expression,
//       id: ruleObj.id,
//       premiumPaymentFrequencies: ruleObj.premiumPaymentFrequencies || [],
//       premiumAmount,
//       headCount: 0,
//       sumOfPremium: 0
//     }

//     rows[idx] = {
//       ...rows[idx],
//       premiumRules: [...rows[idx].premiumRules, newRule]
//     }

//     // Update admin fees applied
//     const adminFeesIds: string[] = []
//     rows.forEach((row: CategoryRow) => {
//       row.premiumRules.forEach((pr: PremiumRule) => {
//         if (this.state.benefitRuleIdsOfFunded.includes(pr.id)) {
//           adminFeesIds.push(pr.id)
//         }
//       })
//     })

//     this.setState({ isAdminFeesApplied: adminFeesIds })
//   }

//   private handleDropCustom = (row: CategoryRow, ruleObj: any) => {
//     const insertIdx = this.state.customCategory.findIndex(
//       (r: CategoryRow) => r.categoryId === row.categoryId
//     )

//     if (insertIdx === -1) return

//     const rules = QuotationHelpers.extractRulesRecursively(ruleObj)

//     this.setState((prevState) => {
//       const updatedCustom = [...prevState.customCategory]
//       rules.forEach((rule: any) => {
//         this.addRuleToCustomRow(updatedCustom, insertIdx, rule)
//       })
//       return { customCategory: updatedCustom }
//     })
//   }

//   private addRuleToCustomRow = (rows: CategoryRow[], idx: number, ruleObj: any) => {
//     const isRuleExist = rows[idx].premiumRules.some(
//       (p: PremiumRule) => p.id === ruleObj.id
//     )

//     if (isRuleExist) return

//     const filteredFrequency = this.state.selectedFrequencyId
//       ? ruleObj.premiumPaymentFrequencies?.filter(
//         (p: PremiumFrequency) =>
//           p.premiumPaymentFrequncyId === this.state.selectedFrequencyId
//       )
//       : []

//     const premiumAmount = filteredFrequency?.[0]?.premiumAmount || 0

//     const newRule: PremiumRule = {
//       name: ruleObj.name,
//       expression: ruleObj.expression,
//       id: ruleObj.id,
//       premiumPaymentFrequencies: ruleObj.premiumPaymentFrequencies || [],
//       premiumAmount,
//       headCount: 0,
//       sumOfPremium: 0
//     }

//     rows[idx] = {
//       ...rows[idx],
//       premiumRules: [...rows[idx].premiumRules, newRule]
//     }
//   }

//   // ============================================================================
//   // CUSTOM CATEGORIES
//   // ============================================================================

//   private handleAddCategory = () => {
//     this.setState((prevState) => ({
//       customCategory: [
//         ...prevState.customCategory,
//         {
//           categoryId: generateRandomId(),
//           categoryName: 'Custom',
//           premiumRules: [],
//           headCount: 0
//         }
//       ]
//     }))
//   }

//   private handleRemoveCategory = (index: number) => {
//     this.setState((prevState) => {
//       const list = [...prevState.customCategory]
//       list.splice(index, 1)
//       return { customCategory: list }
//     })
//   }

//   private handleCategoryNameChange = (event: any, idx: number) => {
//     const newName = event.target.value.trim()

//     const isDuplicateCustom = this.state.customCategory.some(
//       (item: CategoryRow, i: number) =>
//         i !== idx && item.categoryName.trim() === newName
//     )

//     const isDuplicateRows = this.state.rows.some(
//       (item: CategoryRow) => item.categoryName.trim() === newName
//     )

//     if (isDuplicateCustom || isDuplicateRows) {
//       this.toggleSnackbar(true, 'error', 'Duplicate category name!')
//       return
//     }

//     this.setState((prevState) => {
//       const updatedCustomCategory = [...prevState.customCategory]
//       updatedCustomCategory[idx] = {
//         ...updatedCustomCategory[idx],
//         categoryName: event.target.value
//       }
//       return { customCategory: updatedCustomCategory }
//     })
//   }

//   private handleSaveCustomCategory = () => {
//     const customCategories = this.state.customCategory.map((category: CategoryRow) => ({
//       name: category.categoryName,
//       description: ''
//     }))

//     if (!this.state.selectedPlan || customCategories.length === 0) {
//       this.toggleSnackbar(true, 'warning', 'No categories to save')
//       return
//     }

//     const sub = this.services
//       .addPlanCategory(customCategories, this.state.selectedPlan)
//       .subscribe({
//         next: (res: any) => {
//           const updatedCustomCategory = this.state.customCategory.map(
//             (category: CategoryRow) => {
//               const matchingResItem = res.find(
//                 (resItem: any) => resItem.name === category.categoryName
//               )
//               return matchingResItem
//                 ? { ...category, categoryId: matchingResItem.id }
//                 : category
//             }
//           )

//           this.setState((prevState) => ({
//             rows: [...prevState.rows, ...updatedCustomCategory],
//             customCategory: []
//           }))

//           this.toggleSnackbar(true, 'success', 'Categories saved successfully')
//         },
//         error: (error) => {
//           console.error('Error saving categories:', error)
//           this.toggleSnackbar(true, 'error', 'Failed to save categories')
//         }
//       })
//     this.subscriptions.push(sub)
//   }

//   // ============================================================================
//   // PREMIUM RULE MANAGEMENT
//   // ============================================================================

//   private removePremiumRule = (parentId: number, index: number) => {
//     this.setState((prevState) => {
//       const rows = [...prevState.rows]
//       rows[parentId] = {
//         ...rows[parentId],
//         premiumRules: rows[parentId].premiumRules.filter((_, i) => i !== index)
//       }
//       return { rows }
//     })
//   }

//   private removePremiumRuleCustom = (parentId: number, index: number) => {
//     this.setState((prevState) => {
//       const customCategory = [...prevState.customCategory]
//       customCategory[parentId] = {
//         ...customCategory[parentId],
//         premiumRules: customCategory[parentId].premiumRules.filter((_, i) => i !== index)
//       }
//       return { customCategory }
//     })
//   }

//   // ============================================================================
//   // MEMBER MANAGEMENT
//   // ============================================================================

//   private saveRowEdit = () => {
//     if (this.state.dataTable.length === 0) {
//       this.toggleSnackbar(true, 'warning', 'Select category for all members')
//       return
//     }

//     const payload = this.state.dataTable.map((row: any) => ({
//       id: row.id,
//       planScheme: row.planScheme
//     }))

//     const sourceType = 'QUOTATION'
//     const sourceId =
//       this.state.quotationDetails.id || getStorageItem('quotationId') || ''

//     const sub = this.services
//       .savePlanScheme(payload, sourceType, sourceId)
//       .subscribe({
//         next: () => {
//           this.toggleSnackbar(true, 'success', 'Saved successfully')
//           this.setState({ isPlanSchemeSaved: true })
//         },
//         error: (error) => {
//           console.error('Error saving plan scheme:', error)
//           this.toggleSnackbar(true, 'error', 'Failed to save')
//         }
//       })
//     this.subscriptions.push(sub)
//   }

//   private onLoadedData = (data: any[]) => {
//     const planSchemeEmpty = data.some((item: any) => !item.planScheme)

//     this.setState({
//       dataTable: planSchemeEmpty ? [] : data,
//       planSchemeEmpty,
//       isPlanSchemeSaved: !planSchemeEmpty && this.state.isPlanSchemeSaved
//     })
//   }

//   private onCellEditComplete = (event: any, newData: any) => {
//     // Can be extended if needed
//   }

//   private editor = (options: any) => {
//     return (
//       <Dropdown
//         value={options.value}
//         style={{ fontSize: '10px !important' }}
//         className='text-xs'
//         showOnFocus
//         showClear
//         options={this.state.rows.map((item: CategoryRow) => item.categoryName)}
//         onChange={(e) => options.editorCallback(e.value)}
//         placeholder='Category'
//         itemTemplate={(option) => (
//           <Tag className='text-xs' value={option} severity='success' />
//         )}
//       />
//     )
//   }

//   // ============================================================================
//   // CALCULATIONS
//   // ============================================================================

//   private calculatePremium = () => {
//     const quotationId = getStorageItem('quotationId')
//     if (!quotationId) {
//       this.toggleSnackbar(true, 'error', 'Quotation ID not found')
//       return
//     }

//     const sub = this.services.getQuotationDetailsByID(quotationId).subscribe({
//       next: (res) => {
//         this.setState({ quotationDetails: res })

//         if (res.premiumCalculationStatus === CalculationStatus.INPROGRESS) {
//           this.toggleSnackbar(
//             true,
//             'warning',
//             'Premium Calculation is Under Processing...'
//           )
//           return
//         }

//         if (res.memberUploadStatus !== MemberUploadStatus.COMPLETED) {
//           this.toggleSnackbar(
//             true,
//             'warning',
//             'Please Upload Member From Member Tab'
//           )
//           return
//         }

//         if (this.state.showMemberTable && !this.state.isPlanSchemeSaved) {
//           this.toggleSnackbar(
//             true,
//             'warning',
//             'Please Save Member Management Table Above'
//           )
//           return
//         }

//         if (!this.state.productDetails || !this.state.productDetails.id) {
//           this.toggleSnackbar(true, 'warning', 'Please Select a product')
//           return
//         }

//         this.performCalculation(quotationId)
//       },
//       error: (error) => {
//         console.error('Error checking quotation status:', error)
//         this.toggleSnackbar(true, 'error', 'Failed to check quotation status')
//       }
//     })
//     this.subscriptions.push(sub)
//   }

//   private performCalculation = (quotationId: string) => {
//     const { selectedFrequencyId, selectedProductId, selectedPlan, rows, agentsList } = this.state

//     const catagoryPremiumRules = rows.map((r: CategoryRow) => ({
//       [r.categoryName]: r.premiumRules.map((pr: PremiumRule) => pr.id.toString())
//     }))

//     const quotationAgents = agentsList.map((ag: Agent) => ({
//       agentId: ag.agentId,
//       commissionType: ag.commissionType,
//       commissionValue: ag.commission,
//       finalValue: calculatePercentageAmount(ag.commission, this.state.totalPremium)
//     }))

//     const payload = {
//       paymentFrequency: selectedFrequencyId,
//       productId: selectedProductId,
//       planId: selectedPlan,
//       catagoryPremiumRules: Object.assign({}, ...catagoryPremiumRules),
//       quotationAgents
//     }

//     const pageRequest = { action: 'calculate-premium' }

//     const sub = this.services
//       .updateQuotation(pageRequest, payload, quotationId)
//       .subscribe({
//         next: () => {
//           this.setState({ buttonTxt: 'In Progress' })
//           this.props.updateQuotation(
//             {
//               ...this.state.quotationDetails,
//               premiumCalculationStatus: CalculationStatus.INPROGRESS
//             },
//             'L'
//           )
//           setTimeout(this.checkCalculationStatus, 5000)
//         },
//         error: (error) => {
//           console.error('Error calculating premium:', error)
//           this.toggleSnackbar(true, 'error', 'Failed to calculate premium')
//           this.setState({ buttonTxt: 'Calculate' })
//         }
//       })
//     this.subscriptions.push(sub)
//   }

//   private uploadDiscountAndLoading = () => {
//     const {
//       selectedFrequencyId,
//       selectedProductId,
//       selectedPlan,
//       rows,
//       loading,
//       discount,
//       totalPremiumAfterLoadingAndDiscount,
//       agentsList
//     } = this.state

//     const catagoryPremiumRules = rows.map((r: CategoryRow) => ({
//       [r.categoryName]: r.premiumRules.map((pr: PremiumRule) => pr.id.toString())
//     }))

//     const quotationAgents = agentsList.map((ag: Agent) => ({
//       agentId: ag.agentId,
//       commissionType: ag.commissionType,
//       commissionValue: ag.commission,
//       finalValue: calculatePercentageAmount(ag.commission, this.state.totalPremium)
//     }))

//     const payload = {
//       paymentFrequency: selectedFrequencyId,
//       productId: selectedProductId,
//       planId: selectedPlan,
//       catagoryPremiumRules: Object.assign({}, ...catagoryPremiumRules),
//       discount,
//       loading,
//       totalAfterDicountAndLoadingAmount: totalPremiumAfterLoadingAndDiscount,
//       quotationAgents
//     }

//     const quotationId = getStorageItem('quotationId')
//     if (!quotationId) return

//     const sub = this.services
//       .uploadDiscountAndLoading(payload, quotationId)
//       .subscribe({
//         next: () => {
//           this.toggleSnackbar(true, 'success', 'Updated successfully')
//         },
//         error: (error) => {
//           console.error('Error uploading discount and loading:', error)
//           this.toggleSnackbar(true, 'error', 'Failed to update')
//         }
//       })
//     this.subscriptions.push(sub)
//   }

//   private checkCalculationStatus = () => {
//     const quotationId = getStorageItem('quotationId')
//     if (!quotationId) return

//     const sub = this.services
//       .getQuotationDetailsByID(quotationId)
//       .pipe(
//         expand((res: any) => {
//           if (res.memberUploadStatus === MemberUploadStatus.INPROGRESS) {
//             return this.services
//               .getQuotationDetailsByID(quotationId)
//               .pipe(delay(DEBOUNCE_DELAY))
//           }
//           return EMPTY
//         })
//       )
//       .subscribe({
//         next: (res: any) => {
//           if (res.memberUploadStatus !== MemberUploadStatus.INPROGRESS) {
//             this.setState({ buttonTxt: 'Calculate' })
//             this.props.updateQuotation(res)
//           }
//         },
//         error: (error) => {
//           console.error('Error checking calculation status:', error)
//           this.setState({ buttonTxt: 'Calculate' })
//         }
//       })
//     this.subscriptions.push(sub)
//   }

//   // ============================================================================
//   // AGENT MANAGEMENT
//   // ============================================================================

//   private handleOpenAgentModal = () => {
//     this.setState({ openAgentModal: true })
//   }

//   private handleCloseAgentModal = () => {
//     this.setState({ openAgentModal: false })
//   }

//   private handleAgentModalSubmit = (selectedAgents: Agent[]) => {
//     this.setState({
//       agentsList: selectedAgents,
//       openAgentModal: false
//     })
//   }

//   private changeCommission = (e: any, i: number) => {
//     const { name, value } = e.target

//     this.setState((prevState) => {
//       const agentsList = [...prevState.agentsList]
//       agentsList[i] = {
//         ...agentsList[i],
//         [name]: Number(value),
//         finalValue: calculatePercentageAmount(
//           Number(value),
//           prevState.totalPremium
//         )
//       }
//       return { agentsList }
//     })
//   }

//   private setAgentsList = (newAgentsList: Agent[]) => {
//     this.setState({ agentsList: newAgentsList })
//   }

//   // ============================================================================
//   // APPROVAL WORKFLOW
//   // ============================================================================

//   private requestForApproval = () => {
//     const quotationId = getStorageItem('quotationId')
//     if (!quotationId) return

//     const sub = this.services.requestForApproval(quotationId).subscribe({
//       next: () => {
//         this.toggleSnackbar(true, 'success', 'Requested for evaluation')
//         setTimeout(this.checkCalculationStatus, 1500)
//       },
//       error: (error) => {
//         console.error('Error requesting approval:', error)
//         this.toggleSnackbar(true, 'error', 'Failed to request approval')
//       }
//     })
//     this.subscriptions.push(sub)
//   }

//   private handleDecisionSubmit = () => {
//     const quotationId = getStorageItem('quotationId')
//     if (!quotationId) return

//     const payload = {
//       decission: this.state.decision,
//       comment: this.state.comment
//     }

//     const sub = this.services.quotationDecision(payload, quotationId).subscribe({
//       next: () => {
//         this.toggleSnackbar(
//           true,
//           'success',
//           `Quotation ${this.state.decision.toLowerCase()}`
//         )
//         this.setState({ openDecisionModal: false })
//         this.props.router.push('/quotations?mode=viewList')
//       },
//       error: (error) => {
//         console.error('Error submitting decision:', error)
//         this.toggleSnackbar(true, 'error', 'Failed to submit decision')
//       }
//     })
//     this.subscriptions.push(sub)
//   }

//   // ============================================================================
//   // FILE UPLOAD
//   // ============================================================================

//   private uploadDocuments = (data: any, e: any) => {
//     const id = this.state.quotationDetails.id || getStorageItem('quotationId')
//     const file = e.target['files']?.[0]

//     if (!file || !id) return

//     const reader = new FileReader()
//     reader.onload = () => {
//       const formData = new FormData()
//       formData.append('quotationId', id)
//       formData.append('filePart', file)
//       formData.append('docType', 'MEDICAL_DOC')

//       const sub = this.services.uploadMedicalReport(data.id, formData).subscribe({
//         next: () => {
//           this.toggleSnackbar(true, 'success', 'Medical Report Uploaded Successfully')
//         },
//         error: (error) => {
//           console.error('Error uploading medical report:', error)
//           this.toggleSnackbar(true, 'error', 'Failed to upload medical report')
//         }
//       })
//       this.subscriptions.push(sub)
//     }

//     reader.readAsDataURL(file)
//   }

//   // ============================================================================
//   // MODAL HANDLERS
//   // ============================================================================

//   private openModal = () => {
//     this.setState({ openModal: true })
//   }

//   private closeModal = () => {
//     this.setState({ openModal: false })
//   }

//   private openTemplateModal = () => {
//     this.setState({ openTemplate: true })
//   }

//   private closeTemplateModal = () => {
//     this.setState({ openTemplate: false })
//   }

//   private handleDialogClose = () => {
//     this.setState({ openDecisionModal: false })
//   }

//   private onComplete = () => {
//     this.setState({ openModal: false })
//   }

//   // ============================================================================
//   // UTILITY METHODS
//   // ============================================================================

//   private toggleSnackbar = (
//     status: boolean,
//     alertType: 'success' | 'warning' | 'error' | 'info' = 'success',
//     snackbarMsg = 'Success'
//   ) => {
//     this.setState({
//       openSnackbar: status,
//       alertType,
//       snackbarMsg
//     })
//   }

//   private createPlan = () => {
//     this.props.router.push('/plans?mode=create')
//   }

//   private productDataSourceCallback$ = (
//     params = {},
//     action: any,
//     pageRequest = defaultPageRequest
//   ) => {
//     let reqParam: any = { ...pageRequest, ...params }

//     if (action?.searchText && action.searchText.length > 2) {
//       reqParam = {
//         ...reqParam,
//         name: action.searchText
//       }
//       delete reqParam.active
//     }

//     return this.services.getProducts(reqParam)
//   }

//   private planDataSourceCallback$ = (
//     params = {},
//     action: any,
//     pageRequest = defaultPageRequest
//   ) => {
//     let reqParam: any = { ...pageRequest, ...params }

//     if (action?.searchText) {
//       reqParam = {
//         ...reqParam,
//         code: action.searchText,
//         name: action.searchText,
//         clientType: action.searchText
//       }
//     }

//     return this.services.getPlanFromProduct(this.state.selectedProductId)
//   }

//   proceedWithCustomPremium = () => {
//     if (this.state.customPrimumData.length) {
//       this.state.customPrimumData.forEach((data: any) => {
//         this.services.createCustomPremium(this.state.selectedProductId, data).subscribe({
//           next: (res: any) => {
//             // this.toggleSnackbar(true, 'success', 'Custom Premium Updated Successfully')
//           }
//         })
//       })
//     }
//     this.setState({
//       proceed: true
//     })
//   }

//   // ============================================================================
//   // RENDER
//   // ============================================================================

//   render() {
//     const { classes } = this.props
//     const {
//       benefitHierarchy,
//       selectedProductId,
//       selectedPlan,
//       rows,
//       openSnackbar,
//       snackbarMsg,
//       alertType,
//       selectedFrequencyId,
//       premiumFrequncyList,
//       totalPremium,
//       quotationDetails,
//       productDetails,
//       buttonTxt,
//       isRetail,
//       customCategory,
//       showMemberTable,
//       openDecisionModal,
//       comment,
//       openAgentModal,
//       agentsList,
//       openModal,
//       openTemplate,
//       apiList,
//       memberColDefn,
//       loading,
//       discount,
//       totalPremiumAfterLoadingAndDiscount
//     } = this.state
//     console.log("Qwertyui", this.state.customPrimumData)
//     return (
//       <>
//         {/* Decision Modal */}
//         <Dialog
//           open={openDecisionModal}
//           onClose={this.handleDialogClose}
//           aria-labelledby='form-dialog-title'
//           disableEnforceFocus
//         >
//           <DialogTitle id='form-dialog-title'>Quotation Decision</DialogTitle>
//           <DialogContent>
//             <TextField
//               required
//               label='Add comment'
//               multiline
//               fullWidth
//               minRows={4}
//               variant='filled'
//               value={comment}
//               onChange={(e) => this.setState({ comment: e.target.value })}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={this.handleDialogClose} color='primary'>
//               Cancel
//             </Button>
//             <Button onClick={this.handleDecisionSubmit} color='secondary'>
//               Submit
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Main Content */}
//         <div className={classes.quotationDesignRoot}>
//           <Snackbar
//             open={openSnackbar}
//             autoHideDuration={SNACKBAR_DURATION}
//             onClose={() => this.toggleSnackbar(false)}
//             anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//           >
//             <Alert
//               onClose={() => this.toggleSnackbar(false)}
//               severity={alertType}
//               variant='filled'
//             >
//               <AlertTitle>{alertType}</AlertTitle>
//               {snackbarMsg}
//             </Alert>
//           </Snackbar>

//           <DndProvider backend={HTML5Backend}>
//             <Grid container spacing={1}>
//               {/* Left Panel - Benefit Hierarchy */}
//               <Grid
//                 item
//                 xs={12}
//                 sm={3}
//                 style={{ position: 'relative' }}
//               >
//                 <Paper
//                   elevation={0}
//                   style={{
//                     minHeight: 'auto',
//                     padding: 4,
//                     position: 'sticky',
//                     top: '70px'
//                   }}
//                 >
//                   <FettleBenefitRuleTreeViewComponent
//                     hierarchy={benefitHierarchy}
//                     onNodeSelect={() => { }}
//                     showAsTooltip={true}
//                     hideRightInfo={true}
//                     draggable={true}
//                   />
//                 </Paper>
//               </Grid>

//               {/* Right Panel - Main Content */}
//               <Grid item xs={12} sm={9}>
//                 <Paper elevation={0} style={{ minHeight: 500, width: '100%', padding: 15 }}>
//                   {/* Product and Plan Selection */}
//                   <Grid container spacing={1}>
//                     <Grid item xs={12} sm={6} md={3}>
//                       <FormControl className={classes.formControl}>
//                         <FettleAutocomplete
//                           id='product'
//                           name='product'
//                           label='Product'
//                           displayKey='productBasicDetails.name'
//                           $datasource={this.productDataSourceCallback$}
//                           changeDetect={true}
//                           txtValue={productDetails?.productBasicDetails?.name}
//                           value={selectedProductId}
//                           onChange={(e: any, newValue: any) =>
//                             this.handleProductChange('selectedProductId', e, newValue)
//                           }
//                         />
//                       </FormControl>
//                     </Grid>

//                     {selectedProductId && (
//                       <>
//                         <Grid item xs={12} sm={6} md={3}>
//                           <FormControl className={classes.formControl}>
//                             <FettleAutocomplete
//                               id='plan'
//                               name='plan'
//                               label='Plan'
//                               $datasource={this.planDataSourceCallback$}
//                               changeDetect={true}
//                               txtValue={this.state.planDetails?.name}
//                               value={selectedPlan}
//                               onChange={(e: any, newValue: any) =>
//                                 this.handlePlanChange('selectedPlan', e, newValue)
//                               }
//                             />
//                           </FormControl>
//                         </Grid>

//                         <Grid item xs={12} sm={6} md={3}>
//                           <Button
//                             color='secondary'
//                             className='p-button-secondary'
//                             onClick={this.createPlan}
//                           >
//                             Create Plan
//                           </Button>
//                         </Grid>

//                         <Grid item xs={12} sm={6} md={3}>
//                           <FormControl className={classes.formControl}>
//                             <InputLabel id='select-frequency-label'>
//                               Payment Frequency
//                             </InputLabel>
//                             <Select
//                               name='selectedFrequencyId'
//                               label='Payment Frequency'
//                               displayEmpty
//                               value={selectedFrequencyId}
//                               onChange={this.handleFrequency}
//                             >
//                               {premiumFrequncyList.map((freq: any) => (
//                                 <MenuItem key={freq.code} value={freq.id}>
//                                   {freq.name}
//                                 </MenuItem>
//                               ))}
//                             </Select>
//                           </FormControl>
//                         </Grid>
//                       </>
//                     )}
//                   </Grid>

//                   {/* Category Rows */}
//                   <Grid container spacing={1}>
//                     <Grid item xs={12} style={{ minHeight: 500, marginTop: 15 }}>
//                       {rows.map((row: CategoryRow, idx: number) => (
//                         <TargetBox
//                           key={`row${idx}`}
//                           onDrop={(data: any) => this.handleDrop(row, data)}
//                         >
//                           <Accordion elevation={0}>
//                             <AccordionSummary
//                               className={classes.AccordionSummary}
//                               expandIcon={<ExpandMoreIcon color='primary' />}
//                             >
//                               <Table>
//                                 <TableHead>
//                                   <TableRow>
//                                     <TableCell style={{ width: '15%', padding: '4px' }}>
//                                       {row.categoryName}
//                                     </TableCell>
//                                     <TableCell style={{ width: '25%', padding: '4px' }}>
//                                       Premium Rule
//                                     </TableCell>
//                                     <TableCell style={{ width: '25%', padding: '4px' }}>
//                                       Coverage
//                                     </TableCell>
//                                     <TableCell style={{ width: '20%', padding: '4px' }}>
//                                       Premium Amount(Per Member)
//                                     </TableCell>
//                                     <TableCell style={{ width: '20%', padding: '4px' }}>
//                                       Applicable Head Count
//                                     </TableCell>
//                                     <TableCell style={{ width: '20%', padding: '4px' }} align='right'>
//                                       Sum of Premium
//                                     </TableCell>
//                                   </TableRow>
//                                 </TableHead>
//                               </Table>
//                             </AccordionSummary>

//                             <AccordionDetails>
//                               <Table>
//                                 <TableBody>
//                                   <TableRow hover>
//                                     <TableCell style={{ width: '15%', padding: '4px' }}>
//                                       {row.categoryName}
//                                     </TableCell>

//                                     <TableCell style={{ width: '25%', padding: '4px' }}>
//                                       {row.premiumRules.map((p: PremiumRule, i: number) => (
//                                         <div>
//                                           <HtmlTooltip
//                                             key={p.id}
//                                             title={
//                                               <Typography color='inherit'>
//                                                 {p.expression}
//                                               </Typography>
//                                             }
//                                           >
//                                             <div className={classes.ruleContainer}>
//                                               {/* <span className={classes.lineEllipsis}>
//                                                 {p.name}
//                                               </span> */}
//                                               <TextField
//                                                 key={p.id}
//                                                 variant="standard"
//                                                 size="small"
//                                                 value={p.name}
//                                                 inputProps={{ readOnly: true }}
//                                                 sx={{ width: '100px', marginBottom: '8px' }}
//                                               />
//                                               <IconButton
//                                                 color='secondary'
//                                                 aria-label='remove'
//                                                 onClick={() => this.removePremiumRule(idx, i)}
//                                               >
//                                                 <RemoveCircleIcon style={{ color: '#dc3545' }} />
//                                               </IconButton>
//                                             </div>
//                                           </HtmlTooltip>
//                                         </div>
//                                       ))}
//                                     </TableCell>

//                                     <TableCell style={{ width: '20%', padding: '4px' }}>
//                                       {row.premiumRules.map((p: PremiumRule, i: number) => (
//                                         <TextField
//                                           key={p.id}
//                                           type="number"
//                                           variant="standard"
//                                           size="small"
//                                           value={p?.newCoverage || p?.coverage || 0}
//                                           onChange={(e) => this.handleCoverageChange(e, idx, i, p)}
//                                           onBlur={() => this.handleCoverageBlur(p, idx, i)} // 👈 new handler
//                                           sx={{ width: '100px', marginBottom: '8px' }}
//                                         />
//                                       ))}
//                                     </TableCell>

//                                     <TableCell style={{ width: '20%', padding: '4px' }}>
//                                       {row.premiumRules.map((p: PremiumRule) => (
//                                         // <Typography key={p.id}>{p.premiumAmount}</Typography>
//                                         <TextField
//                                           key={p.id}
//                                           type="number"
//                                           variant="standard"
//                                           size="small"
//                                           value={p?.premiumAmount}
//                                           inputProps={{ readOnly: true }}
//                                           sx={{ width: '100px', marginBottom: '8px' }}
//                                         />
//                                       ))}
//                                     </TableCell>

//                                     <TableCell style={{ width: '20%', padding: '4px' }}>
//                                       {quotationDetails.memberUploadStatus ? (
//                                         <span>{row.headCount}</span>
//                                       ) : (
//                                         row.premiumRules.length > 0 && (
//                                           <TextField
//                                             fullWidth
//                                             name='headCount'
//                                             value={row.headCount}
//                                             onChange={(e) => this.handleHeadCountChange(e, idx)}
//                                             inputProps={{
//                                               style: { textAlign: 'right' },
//                                               readOnly: true
//                                             }}
//                                           />
//                                         )
//                                       )}
//                                     </TableCell>

//                                     <TableCell style={{ width: '20%', padding: '4px' }} align='right'>
//                                       {row.premiumRules[0]?.sumOfPremium.toFixed(2) || 0}
//                                     </TableCell>
//                                   </TableRow>
//                                 </TableBody>
//                               </Table>
//                             </AccordionDetails>
//                           </Accordion>
//                         </TargetBox>
//                       ))}

//                       {/* <Divider style={{ margin: '12px 0' }} /> */}

//                       {/* Custom Category Add Button */}
//                       {/* {customCategory.length === 0 && isRetail && selectedPlan && (
//                         <Grid container justifyContent='flex-end'>
//                           <Grid item>
//                             <Tooltip title='Add a custom category'>
//                               <Button color='primary' onClick={this.handleAddCategory}>
//                                 <AddIcon />
//                               </Button>
//                             </Tooltip>
//                           </Grid>
//                         </Grid>
//                       )}

//                       {isRetail &&
//                         customCategory.map((row: CategoryRow, idx: number) => (
//                           <Box
//                             key={`custom${idx}`}
//                             style={{
//                               border: '1px solid rgba(0, 0, 0, 0.1)',
//                               margin: '4px 0',
//                               borderRadius: '4px'
//                             }}
//                           >
//                             <TargetBox onDrop={(data: any) => this.handleDropCustom(row, data)}>
//                               <Grid container justifyContent='flex-end' alignItems='flex-end'>
//                                 <Grid item>
//                                   <TextField
//                                     label='Category Name'
//                                     variant='standard'
//                                     style={{ marginRight: '5px' }}
//                                     value={customCategory[idx].categoryName}
//                                     onChange={(event) => this.handleCategoryNameChange(event, idx)}
//                                   />
//                                 </Grid>
//                                 <Grid item>
//                                   <Tooltip title='Delete'>
//                                     <Button
//                                       onClick={() => this.handleRemoveCategory(idx)}
//                                       color='secondary'
//                                       style={{ marginRight: '5px' }}
//                                     >
//                                       <DeleteIcon style={{ color: '#dc3545' }} />
//                                     </Button>
//                                   </Tooltip>

//                                   {customCategory.length - 1 === idx && (
//                                     <Tooltip
//                                       title={
//                                         ['Custom', ''].includes(customCategory[idx].categoryName.trim())
//                                           ? 'Change Custom Name'
//                                           : 'Add a custom Category'
//                                       }
//                                       arrow
//                                     >
//                                       <span>
//                                         <Button
//                                           color='primary'
//                                           onClick={this.handleAddCategory}
//                                           disabled={['Custom', ''].includes(
//                                             customCategory[idx].categoryName.trim()
//                                           )}
//                                         >
//                                           <AddIcon />
//                                         </Button>
//                                       </span>
//                                     </Tooltip>
//                                   )}
//                                 </Grid>
//                               </Grid>

//                               <Accordion elevation={0}>
//                                 <AccordionSummary
//                                   className={classes.AccordionSummary}
//                                   expandIcon={<ExpandMoreIcon color='primary' />}
//                                 >
//                                   <Table>
//                                     <TableHead>
//                                       <TableRow>
//                                         <TableCell style={{ width: '15%', padding: '4px' }}>
//                                           {row.categoryName}
//                                         </TableCell>
//                                         <TableCell style={{ width: '25%', padding: '4px' }}>
//                                           Premium Rule
//                                         </TableCell>
//                                         <TableCell style={{ width: '20%', padding: '4px' }}>
//                                           Premium Amount
//                                         </TableCell>
//                                         <TableCell style={{ width: '20%', padding: '4px' }}>
//                                           Head Count
//                                         </TableCell>
//                                         <TableCell style={{ width: '20%', padding: '4px' }} align='right'>
//                                           Sum of Premium
//                                         </TableCell>
//                                       </TableRow>
//                                     </TableHead>
//                                   </Table>
//                                 </AccordionSummary>

//                                 <AccordionDetails>
//                                   <Table>
//                                     <TableBody>
//                                       <TableRow hover>
//                                         <TableCell style={{ width: '15%', padding: '4px' }}>
//                                           {row.categoryName}
//                                         </TableCell>

//                                         <TableCell style={{ width: '25%', padding: '4px' }}>
//                                           {row.premiumRules.map((p: PremiumRule, i: number) => (
//                                             <HtmlTooltip
//                                               key={p.id}
//                                               title={
//                                                 <Typography color='inherit'>
//                                                   {p.expression}
//                                                 </Typography>
//                                               }
//                                             >
//                                               <div className={classes.ruleContainer}>
//                                                 <span className={classes.lineEllipsis}>
//                                                   {p.name}
//                                                 </span>
//                                                 <IconButton
//                                                   color='secondary'
//                                                   onClick={() => this.removePremiumRuleCustom(idx, i)}
//                                                 >
//                                                   <RemoveCircleIcon />
//                                                 </IconButton>
//                                               </div>
//                                             </HtmlTooltip>
//                                           ))}
//                                         </TableCell>

//                                         <TableCell style={{ width: '20%', padding: '4px' }}>
//                                           {row.premiumRules.map((p: PremiumRule) => (
//                                             <Typography key={p.id}>{p.premiumAmount}</Typography>
//                                           ))}
//                                         </TableCell>

//                                         <TableCell style={{ width: '20%', padding: '4px' }}>
//                                           {quotationDetails.memberUploadStatus && (
//                                             <span>{row.headCount}</span>
//                                           )}
//                                         </TableCell>

//                                         <TableCell style={{ width: '20%', padding: '4px' }} align='right'>
//                                           {row.premiumRules[0]?.sumOfPremium || 0}
//                                         </TableCell>
//                                       </TableRow>
//                                     </TableBody>
//                                   </Table>
//                                 </AccordionDetails>
//                               </Accordion>
//                             </TargetBox>
//                           </Box>
//                         ))} */}

//                       <Divider style={{ margin: '12px 0' }} />

//                       {/* Save Custom Category Button */}
//                       {/* {customCategory.length > 0 && isRetail && (
//                         <Grid container justifyContent='flex-end'>
//                           <Grid item>
//                             <Button
//                               color='secondary'
//                               onClick={this.handleSaveCustomCategory}
//                               disabled={
//                                 !selectedPlan ||
//                                 customCategory.length < 1 ||
//                                 customCategory.some((item: CategoryRow) =>
//                                   ['Custom', ''].includes(item.categoryName.trim())
//                                 )
//                               }
//                             >
//                               Save Category
//                             </Button>
//                           </Grid>
//                         </Grid>
//                       )}

//                       <Divider style={{ margin: '12px 0' }} /> */}
//                       <p style={{ fontSize: "12px", color: "red", textAlign: "right" }}>Please proceed once you have thoroughly reviewed and confirmed the coverage amounts.</p>
//                       <Grid container justifyContent='flex-end' spacing={2} mt={2}>
//                         <Grid item>
//                           <Button
//                             variant='contained'
//                             color='primary'
//                             onClick={this.proceedWithCustomPremium}
//                           >
//                             Proceed
//                           </Button>
//                         </Grid>
//                       </Grid>

//                     </Grid>
//                     {/* Total Premium */}
//                     {this.state.proceed && <>
//                       <Table>
//                         <TableBody>
//                           <TableRow>
//                             <TableCell align='right' />
//                             <TableCell align='center'>
//                               <Typography variant='h6'>Total Premium</Typography>
//                             </TableCell>
//                             <TableCell align='right' />
//                             <TableCell align='right' />
//                             <TableCell align='right'>
//                               <Typography variant='h6'>{totalPremium.toFixed(2)}</Typography>
//                             </TableCell>
//                           </TableRow>
//                         </TableBody>
//                       </Table>

//                       <Divider style={{ marginBottom: '12px' }} />

//                       {/* Discount and Loading */}
//                       <Grid container spacing={2}>
//                         <Grid item xs={3}>
//                           <Typography>Discount</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <TextField
//                             size='small'
//                             type='number'
//                             name='discount'
//                             defaultValue={quotationDetails.discount}
//                             onChange={(e) => {
//                               const discountVal = Number(e.target.value)
//                               const la = calculatePercentageAmount(loading, totalPremium)
//                               const da = calculatePercentageAmount(discountVal, totalPremium)
//                               const at = totalPremium + la - da
//                               this.setState({
//                                 discount: discountVal,
//                                 totalPremiumAfterLoadingAndDiscount: at
//                               })
//                             }}
//                             label='Discount Percentage (%)'
//                           />
//                         </Grid>
//                         <Grid item xs={3} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
//                           <Typography>{calculatePercentageAmount(discount, totalPremium).toFixed(2)}</Typography>
//                         </Grid>

//                         <Grid item xs={3}>
//                           <Typography>Loading</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <TextField
//                             size='small'
//                             type='number'
//                             name='loading'
//                             defaultValue={quotationDetails.loading}
//                             onChange={(e) => {
//                               const loadingVal = Number(e.target.value)
//                               const da = calculatePercentageAmount(discount, totalPremium)
//                               const la = calculatePercentageAmount(loadingVal, totalPremium)
//                               const at = totalPremium + la - da
//                               this.setState({
//                                 loading: loadingVal,
//                                 totalPremiumAfterLoadingAndDiscount: at
//                               })
//                             }}
//                             label='Loading Percentage (%)'
//                           />
//                         </Grid>
//                         <Grid item xs={3} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
//                           <Typography>{calculatePercentageAmount(loading, totalPremium).toFixed(2)}</Typography>
//                         </Grid>
//                       </Grid>

//                       <Divider style={{ marginBottom: '12px' }} />

//                       {/* Total After Discount */}
//                       <Table>
//                         <TableBody>
//                           <TableRow>
//                             <TableCell align='right' />
//                             <TableCell align='center'>
//                               <Typography variant='h6'>Total Premium After Discount</Typography>
//                             </TableCell>
//                             <TableCell align='right' />
//                             <TableCell align='right' />
//                             <TableCell align='right'>
//                               <Typography variant='h6'>
//                                 {(
//                                   totalPremiumAfterLoadingAndDiscount ||
//                                   quotationDetails.totalAfterDicountAndLoadingAmount ||
//                                   0
//                                 ).toFixed(2)}
//                               </Typography>
//                             </TableCell>
//                           </TableRow>
//                         </TableBody>
//                       </Table>

//                       <Divider style={{ marginBottom: '12px' }} />

//                       {/* Member Table */}
//                       {showMemberTable && (
//                         <Grid item xs={12}>
//                           <FettleDataGrid
//                             $datasource={this.services.getDataSourceMember$.bind(this.services)}
//                             config={this.memberConfiguration}
//                             columnsdefination={memberColDefn}
//                           />
//                         </Grid>
//                       )}

//                       <Divider style={{ margin: '12px 0' }} />

//                       {/* Agent Management */}
//                       <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
//                         {getStorageItem('userType') !== 'AGENT' && (
//                           <Button
//                             className='p-button-secondary'
//                             onClick={this.handleOpenAgentModal}
//                           >
//                             Search Agent
//                           </Button>
//                         )}

//                         <InvoiceAgentModal
//                           agentsList={agentsList}
//                           handleCloseAgentModal={this.handleCloseAgentModal}
//                           openAgentModal={openAgentModal}
//                           setAgentsList={this.setAgentsList}
//                           handleAgentModalSubmit={this.handleAgentModalSubmit}
//                           prospectId={quotationDetails.prospectId}
//                         />
//                       </Grid>

//                       <Divider style={{ margin: '8px 0' }} />

//                       {/* Agent Table */}
//                       <Grid item xs={12} style={{ marginTop: '10px' }}>
//                         <Table size='small'>
//                           <TableHead>
//                             <TableRow>
//                               <TableCell>Agent Name</TableCell>
//                               <TableCell>Commission Value</TableCell>
//                               <TableCell align='right'>Final Value</TableCell>
//                             </TableRow>
//                           </TableHead>
//                           <TableBody>
//                             {agentsList.map((row: Agent, i: number) => (
//                               <TableRow key={row.agentId}>
//                                 <TableCell>{row.name}</TableCell>
//                                 <TableCell>
//                                   <TextField
//                                     size='small'
//                                     type='number'
//                                     name='commission'
//                                     value={row.commission}
//                                     disabled={this.mode === 'view'}
//                                     onChange={(e) => this.changeCommission(e, i)}
//                                     label='Commission value (%)'
//                                   />
//                                 </TableCell>
//                                 <TableCell align='right'>
//                                   {row.finalValue
//                                     ? Number(row.finalValue).toFixed(2)
//                                     : calculatePercentageAmount(row.commission, totalPremium).toFixed(2)}
//                                 </TableCell>
//                               </TableRow>
//                             ))}
//                           </TableBody>
//                         </Table>
//                       </Grid>

//                       <Divider style={{ margin: '8px 0' }} />

//                       {/* Action Buttons */}
//                       <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
//                         <Tooltip title={!agentsList?.length ? 'Select Agent First' : ''}>
//                           <span>
//                             <Button
//                               color='primary'
//                               onClick={this.calculatePremium}
//                               disabled={!agentsList?.length}
//                             >
//                               {buttonTxt}
//                             </Button>
//                           </span>
//                         </Tooltip>

//                         {quotationDetails.premiumCalculationStatus === CalculationStatus.COMPLETED &&
//                           quotationDetails.quotationStatus === QuotationStatus.PENDING_APPROVAL && (
//                             <Button color='primary' onClick={this.uploadDiscountAndLoading}>
//                               Update Discount and Loading
//                             </Button>
//                           )}

//                         {quotationDetails.premiumCalculationStatus === CalculationStatus.COMPLETED &&
//                           quotationDetails.quotationStatus === QuotationStatus.DRAFT && (
//                             <Button color='primary' onClick={this.requestForApproval}>
//                               Request For Approval
//                             </Button>
//                           )}
//                       </Grid>

//                       {/* Approval Buttons */}
//                       {quotationDetails.premiumCalculationStatus === CalculationStatus.COMPLETED &&
//                         quotationDetails.quotationStatus === QuotationStatus.PENDING_APPROVAL && (
//                           <Grid container justifyContent='flex-end' spacing={2} mt={2}>
//                             <Grid item>
//                               <Button
//                                 variant='contained'
//                                 color='primary'
//                                 onClick={() => {
//                                   this.setState({
//                                     openDecisionModal: true,
//                                     decision: 'APPROVED'
//                                   })
//                                 }}
//                               >
//                                 Approve
//                               </Button>
//                             </Grid>
//                             <Grid item>
//                               <Button
//                                 color='secondary'
//                                 className='p-button-danger'
//                                 onClick={() => {
//                                   this.setState({
//                                     openDecisionModal: true,
//                                     decision: 'REJECTED'
//                                   })
//                                 }}
//                               >
//                                 Reject
//                               </Button>
//                             </Grid>
//                           </Grid>
//                         )}
//                     </>}
//                   </Grid>
//                 </Paper>
//               </Grid>
//             </Grid>
//           </DndProvider >

//           {/* File Upload Dialog */}
//           < FileUploadDialogComponent
//             open={openModal}
//             closeModal={this.closeModal}
//             addFile={false}
//             changeFileStat={() => { }
//             }
//             onComplete={this.onComplete}
//           />

//           {/* Template Modal */}
//           {
//             openTemplate && (
//               <MemberTemplateModal
//                 closeTemplateModal={this.closeTemplateModal}
//                 openTemplate={openTemplate}
//                 apiList={apiList}
//                 quotationDetails={quotationDetails}
//               />
//             )
//           }
//         </div >
//       </>
//     )
//   }
// }

// export default withRouter(withTheme(withStyles(styles)(QuotationDesignComponent)))
