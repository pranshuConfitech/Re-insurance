import React, { useEffect, useRef, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { Box, Breadcrumbs, lighten, Link, Snackbar } from '@mui/material'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { makeStyles } from '@mui/styles'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Alert } from '@mui/lab'

import { zip } from 'rxjs'

import { Button } from 'primereact/button'

import {
  clearSelectedRuleFromBenefitInNavPath,
  extractPremiumRulesFromBenefitStructures,
  getSelectedRuleId,
  hasAnyPremiumRuleInBenefitHierarchies,
  setPremiumDetailsInProductRules,
  setRulesInBenefitStructures
} from '../../product-management/util/product-util'

import {
  BenefitService,
  BenefitStructureService,
  PremiumFrequencyService,
  ProductService
} from '@/services/remote-api/fettle-remote-api'
import ProductRuleTableForPremium from './product-rule-table-for-premium'

const benefitStructureService = new BenefitStructureService()
const benefitService = new BenefitService()
const productservice = new ProductService()
const premiumFrequencyService = new PremiumFrequencyService()

const useStyles = makeStyles((theme: any) => ({
  benifitDesignRoot: {
    flexGrow: 1,
    minHeight: 100,
    padding: 30
  },
  header: {
    paddingTop: 10,
    paddingBottom: 10,
    color: '#4472C4'
  },
  mainBenifitAction: {
    borderRadius: 14,
    backgroundColor: lighten(theme?.palette?.primary?.light || '#D80E51', 0.9) /* "#aceae8" */,
    '&.MuiGrid-item': {
      paddingTop: '20px',
      paddingBottom: '20px'
    }
  },
  mainBenifitActionLbl: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainBenifitBtnSection: {
    display: 'flex'

    /* justifyContent: "space-evenly", */
  },
  subBenifitsSection: {
    marginTop: 10
  },
  subBenifitLabel: {
    textAlign: 'center',
    fontSize: 14
  },
  subBenifitsMenuList: {
    backgroundColor: lighten(theme?.palette?.primary?.light || '#D80E51', 0.9) /* "#aceae8" */,
    height: 300,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 14
  },
  subBenifitTabs: {
    flex: 1,
    '& .MuiTabs-flexContainer': {
      display: 'flex',
      alignItems: 'center'
    }
  },
  subBenifitTab: {
    width: '100%',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
  },
  subBenifitsMenu: {
    fontSize: 12
  },
  formControl: {
    margin: theme?.spacing ? theme.spacing(1) : '8px',
    width: '100%'
  }
}))

function a11yProps(index: any, prefix: any) {
  return {
    id: `main-benifit-tab-${index}-${prefix}`,
    'aria-controls': `main-benifit-tabpanel-${index}-${prefix}`
  }
}

function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()

    return <Component {...props} router={router} />
  }
}

const PremiumDesignFormComponent = (props: any) => {
  const classes = useStyles()
  const { productId }: { productId: any } = useParams()
  const [selectedBenefitStructureIndex, setSelectedBenefitStructureIndex] = React.useState(0)
  const [benefitStructures, setBenefitStructures] = React.useState<any>([])
  const [selectedBenefitIndex, setSelectedBenefitIndex] = React.useState(0)
  const [benefitList, setBenefitList] = useState<any>([])
  const [isOpenRulePreviewModal, setIsOpenRulePreviewModal] = useState(false)
  const selectedBenefitStrucute = useRef<any>(null)
  const navPath = useRef<any>(null)
  const [openSnackbar, setOpenSnackbar] = React.useState(false)
  const productDetails = useRef<any>(null)
  const paymentFrequencies = useRef<any>([])
  const [disableSaveButon, setDisableSaveButton] = useState(false)

  const onSetRootBenefit = (rootBenefit: any, index = 0) => {
    if (navPath.current) {
      clearSelectedRuleFromBenefitInNavPath(navPath.current, index)
    }

    navPath.current = [rootBenefit]
    selectedBenefitStrucute.current = rootBenefit
    rootBenefit.ruleList = rootBenefit.ruleList || []

    if (!rootBenefit?.parameters) {
      benefitService.getBenefitParameterDetails(rootBenefit?.code).subscribe((response: any) => {
        rootBenefit.parameters = response?.parameters
        setBenefitList([rootBenefit])
        setSelectedBenefitStructureIndex(index)
        setSelectedBenefitIndex(0)
      })
    } else {
      setBenefitList([rootBenefit])
      setSelectedBenefitStructureIndex(index)
      setSelectedBenefitIndex(0)
    }
  }

  const handleBenefitStructureTabChange = (event: any, index: number) => {
    onSetRootBenefit(benefitStructures[index].hirearchy, index)
  }

  const handleBenefitTabChange = (event: any, index: number) => {
    const benefit = benefitList[index]

    navPath.current[navPath.current.length - 1] = benefit
    benefit.ruleList = benefit.ruleList || []

    if (!benefit.parameters) {
      benefitService.getBenefitParameterDetails(benefit.code).subscribe((response: any) => {
        benefit.parameters = response.parameters
        setSelectedBenefitIndex(index)
      })
    } else {
      setSelectedBenefitIndex(index)
    }
  }

  const getAllBenefitStructures = () => {
    const benefitStructureService$ = benefitStructureService.getAllBenefitStructures({
      page: 0,
      size: 10000,
      summary: true,
      active: true
    })

    return benefitStructureService$
  }

  useEffect(() => {
    const productDetails$ = productservice.getProductDetails(productId)
    const premiumRules$ = productservice.getPremiums(productId)
    const benefitStructures$ = getAllBenefitStructures()
    const freq$ = premiumFrequencyService.getPremiumFrequencies()

    const subscriber = zip(productDetails$, benefitStructures$, premiumRules$, freq$).subscribe((res: any) => {
      const [pd, page, premiums, freq]: any = res

      productDetails.current = pd
      setPremiumDetailsInProductRules(pd, premiums?.premiumRules)
      paymentFrequencies.current = freq.content
      setRulesInBenefitStructures(page.content, productDetails.current.productRules || [])
      console.log("qwertyui", page.content)
      let temp: any = [];
      page.content.map((el: any) => {
        if (el.hirearchy.ruleList.length) {
          temp.push(el)
        }
      })
      setBenefitStructures(temp)
      onSetRootBenefit(temp[0].hirearchy)

      setDisableSaveButton(!hasAnyPremiumRuleInBenefitHierarchies(page.content))
    })

    return () => subscriber.unsubscribe()
  }, [])

  const onSelectBenefitFromNavPath = (benefit: any) => {
    const index = navPath.current.indexOf(benefit)

    if (index == 0) {
      onSetRootBenefit(benefit, selectedBenefitStructureIndex)
    } else {
      clearSelectedRuleFromBenefitInNavPath(navPath.current, index)
      const parentBenefit = navPath.current[index - 1]

      navPath.current = navPath.current.slice(0, index + 1)
      setBenefitList(parentBenefit.child)
      setSelectedBenefitIndex(parentBenefit.child.indexOf(benefit))
    }
  }

  const buildBreadcrumb = () => {
    if (navPath.current && navPath.current.length > 0) {
      return (
        <Breadcrumbs maxItems={2} aria-label='breadcrumb'>
          {navPath.current.map((path: any, index: any) => {
            if (index === navPath.current.length - 1)
              return (
                <Typography color='text.primary' key={index}>
                  {path.name}
                </Typography>
              )
            else {
              return (
                <Link
                  key={index}
                  underline='hover'
                  color='inherit'
                  href='#'
                  onClick={e => {
                    e.stopPropagation()
                    onSelectBenefitFromNavPath(path)
                  }}
                >
                  {path.name}
                </Link>
              )
            }
          })}
          ;
        </Breadcrumbs>
      )
    } else return null
  }

  /* request for adding child rule*/
  const onRuleSelect = (rule: any) => {
    const benefit = benefitList[selectedBenefitIndex]

    if (benefit.child) {
      rule.isSelected = true
      const tobeBenefit = benefit.child[0]

      tobeBenefit.ruleList = tobeBenefit.ruleList || []
      navPath.current = [...navPath.current, tobeBenefit]

      if (tobeBenefit.parameters) {
        setBenefitList(benefit.child)
        setSelectedBenefitIndex(0)
      } else {
        benefitService.getBenefitParameterDetails(tobeBenefit.code).subscribe((response: any) => {
          tobeBenefit.parameters = response.parameters
          setBenefitList(benefit.child)
          setSelectedBenefitIndex(0)
        })
      }
    }
  }

  const getRuleListForRuleViewTable = () => {
    if (!navPath.current) {
      return []
    }

    if (navPath.current.length == 1) {
      return benefitList[selectedBenefitIndex].ruleList
    }

    const parentBenefit = navPath.current[navPath.current.length - 2]
    const selectedRuleId = getSelectedRuleId(parentBenefit)

    return benefitList[selectedBenefitIndex].ruleList.filter((r: any) => r.parentInternalId === selectedRuleId)
  }

  const saveRule = () => {
    const rules = extractPremiumRulesFromBenefitStructures(benefitStructures)

    productservice.savePremiums(productId, rules).subscribe(() => {
      setOpenSnackbar(true)
    })
  }

  const onBenefitChange = (benefit: any) => {
    setDisableSaveButton(!hasAnyPremiumRuleInBenefitHierarchies(benefitStructures))
  }

  return (
    <div style={{ padding: '5px' }}>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity='success' variant='filled'>
          Product updated successfully
        </Alert>
      </Snackbar>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography>
            <span>
              Premium Design for : <strong>{productDetails.current?.productBasicDetails?.name}</strong>{' '}
            </span>
          </Typography>
        </Grid>

        <Grid item container xs={12} spacing={1}>
          <Grid item>{/* <h4>Main Benifits</h4> */}</Grid>
          <Grid item xs={10}>
            <Box>
              <Tabs
                value={selectedBenefitStructureIndex}
                indicatorColor='primary'
                textColor='primary'
                onChange={handleBenefitStructureTabChange}
                variant={benefitStructures.length > 3 ? 'scrollable' : 'standard'}
                centered={benefitStructures.length <= 3}
                scrollButtons='auto'
                aria-label='Main Benefit Tabs'
              >
                {benefitStructures.map((item: any, index: any) => (
                  <Tab
                    style={{ fontSize: '12px' }}
                    label={item.description}
                    {...a11yProps(index, 'benefit-structure')}
                    key={item.id}
                  />
                ))}
              </Tabs>

            </Box>
          </Grid>

          <Grid item container xs={12} spacing={1}>
            {/* sub menu list -- start*/}
            <Grid item xs={3}>
              <TextField id='standard-basic' style={{ padding: '5px 15px' }} fullWidth placeholder='Search benefit' />
              <Tabs
                indicatorColor='primary'
                orientation='vertical'
                variant='scrollable'
                aria-label='Vertical tabs example'
                className={classes.subBenifitTabs}
                value={selectedBenefitIndex}
                onChange={handleBenefitTabChange}
              >
                {benefitList &&
                  benefitList.map((subBenifit: any, indx: any) => {
                    return (
                      <Tab
                        label={subBenifit.name}
                        {...a11yProps(indx, 'benefit')}
                        key={subBenifit.id}
                        className={classes.subBenifitTab}
                      />
                    )
                  })}
              </Tabs>
            </Grid>
            {/* sub menu list -- end*/}

            <Grid item xs={9} container spacing={1}>
              <Grid item xs={12}>
                <Paper variant='outlined' square>
                  {buildBreadcrumb()}
                </Paper>
              </Grid>

              {/* <Grid item xs={4} container spacing={1}>
                                <Grid item xs={6}>
                                   
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant="outlined" style={{ float: "right" }} onClick={() => {
                                        setIsOpenRuleModal(true);
                                    }} >Add Rule</Button>
                                    <RuleDesignModal openDialog={isOpenRuleModal} setOpenDialog={setIsOpenRuleModal}
                                        forBenefit={benefitList[selectedBenefitIndex]} key={isOpenRuleModal}
                                        benefitNav={navPath.current || []} onAdd={onRuleAdd}></RuleDesignModal>
                                </Grid>
                            </Grid> */}

              <Grid item xs={12}>
                <Paper variant='outlined' square>
                  {benefitList && benefitList[selectedBenefitIndex] && (
                    <ProductRuleTableForPremium
                      forBenefit={benefitList[selectedBenefitIndex]}
                      ruleList={getRuleListForRuleViewTable()}
                      onRequestForChildRule={onRuleSelect}
                      hasChild={
                        benefitList[selectedBenefitIndex].child && benefitList[selectedBenefitIndex].child.length > 0
                      }
                      paymentFrequencies={paymentFrequencies.current}
                      onBenefitChange={onBenefitChange}
                    ></ProductRuleTableForPremium>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Button
                  className='p-button-outlined'
                  style={{ float: 'right' }}
                  disabled={disableSaveButon}
                  onClick={saveRule}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default withRouter(PremiumDesignFormComponent)
