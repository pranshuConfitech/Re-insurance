
import React, { useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Breadcrumbs, Link, Snackbar } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import { makeStyles } from '@mui/styles'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Alert } from '@mui/lab'
import { map } from 'rxjs/operators'

import { CloseOutlined } from '@mui/icons-material'

import { Button } from 'primereact/button'

import { TabPanel, TabView } from 'primereact/tabview'

import { BenefitStructureService } from '@/services/remote-api/api/benefit-structure-services'
import { BenefitService } from '@/services/remote-api/api/master-services'
import { ProductService } from '@/services/remote-api/api/product-services'

import {
  clearSelectedRuleFromBenefitInNavPath,
  deleteRule,
  extractRulesForPayloadFromBenefitStructures,
  extractRulesFromBenefitStructures,
  getSelectedRuleId,
  hasAnyRuleInBenefitHierarchies,
  setRulesInBenefitStructures
} from '../../util/product-util'
import BenifitDesignRuleTable from './benifit-design-rule-table'
import RuleDesignModal from './rule-design-modal'
import RuleDesignPreviewModal from './rule-design-preview-modal'

import { FettleAutocomplete } from '@/views/apps/shared-component/components/fettle.autocomplete'
import Asterisk from '@/views/apps/shared-component/components/red-asterisk'

const benefitStructureService = new BenefitStructureService()
const benefitService = new BenefitService()
const productservice = new ProductService()

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
    backgroundColor: theme?.palette?.primary?.light || '#D80E51',
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
    backgroundColor: theme?.palette?.primary?.light || '#D80E51',
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
    minWidth: 182
  }
}))

function a11yProps(index: any, prefix: any) {
  return {
    id: `main-benifit-tab-${index}-${prefix}`,
    'aria-controls': `main-benifit-tabpanel-${index}-${prefix}`
  }
}

export default function BenifitDesignComponent(props: any) {
  const classes = useStyles()
  const [benefitStructures, setBenefitStructures]: any = React.useState([])
  const [selectedBenefitStructure, setSelectedBenefitStructure] = useState() //for Autocomplete state only
  const [selectedBenefitStructureIndex, setSelectedBenefitStructureIndex] = React.useState(0)
  const [selectedBenefitIndex, setSelectedBenefitIndex] = React.useState(0)
  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0)
  const [benefitList, setBenefitList]: any = useState([])
  const [isOpenRuleModal, setIsOpenRuleModal] = useState(false)
  const [isOpenRulePreviewModal, setIsOpenRulePreviewModal] = useState(false)
  const selectedBenefitStrucute: any = useRef(null)
  const navPath: any = useRef(null)
  const [openSnackbar, setOpenSnackbar] = React.useState(false)
  const [editFormValues, setEditFormValues] = React.useState(null)
  const [indexOfEditRule, setIndexOfEditRule] = React.useState(0)
  const [payload, setPayload] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [tabHeads, setTabHeads]: any = useState([])
  const [allBenefitStructures, setAllBenefitStructures] = React.useState([])
  const [benefitData, setBenefitData] = React.useState([])
  const [parentBenefit, setParentBenefit] = React.useState([])
  const history = useRouter()

  const onSetRootBenefit = (rootBenefit: any, index = 0, opBenefitStructures = []) => {
    if (navPath.current) {
      clearSelectedRuleFromBenefitInNavPath(navPath.current, index)
    }

    navPath.current = [rootBenefit]
    selectedBenefitStrucute.current = benefitStructures[index] || opBenefitStructures[index]
    if (rootBenefit) {
      rootBenefit.ruleList = rootBenefit.ruleList || []
    }

    if (!rootBenefit?.parameters) {
      benefitService
        .getBenefitParameterDetails2(rootBenefit?.code, selectedBenefitStrucute?.current?.id)
        .subscribe((response: any) => {
          rootBenefit.parameters = response.parameters
          rootBenefit.benefitStructureId = response.benefitStructureId
          setBenefitList([rootBenefit])
          setSelectedBenefitStructureIndex(index)
          setSelectedBenefitIndex(0)
          setSelectedBenefitStructure(rootBenefit.name)
        })
    } else {
      setBenefitList([rootBenefit])
      setSelectedBenefitStructureIndex(index)
      setSelectedBenefitIndex(0)
      setSelectedBenefitStructure(rootBenefit.name)
    }
  }

  const saveRule = () => {
    // const rules = extractRulesFromBenefitStructures(benefitList);
    const productId: any = localStorage.getItem('productId')

    // let temp = [...payload];
    // if (rules.length) {
    //   rules.map(el => {
    //     let p = temp.find(item => item.internalId === el.internalId);
    //     if (!p) {
    //       temp.push(el);
    //     }
    //   });
    //   setPayload(temp);
    // }
    productservice.saveProductRules(productId, payload).subscribe(() => {
      setOpenSnackbar(true)
      setPayload([]);
      setSelectedTabIndex(0)         // Reset tab index
      setSelectedBenefitIndex(0)
      // window.location.href = `/products/${productId}?mode=edit&step=1`
      history.push(`/products/${productId}?mode=edit&step=1`);

      //  history.push(`/products/${productId}?mode=edit&step=1`);
    })
  }

  const handleBenefitTabChange = (event: any, index: number) => {
    const benefit = benefitList[index]

    navPath.current[navPath.current.length - 1] = benefit
    benefit.ruleList = benefit.ruleList || []

    if (!benefit.parameters) {
      benefitService
        .getBenefitParameterDetails2(benefit.code, selectedBenefitStrucute.current.id)
        .subscribe((response: any) => {
          benefit.parameters = response.parameters
          benefit.benefitStructureId = response.benefitStructureId
          setSelectedBenefitIndex(index)
          // setSelectedTabIndex(index)
        })
    } else {
      setSelectedBenefitIndex(index)
      // setSelectedTabIndex(index)
    }
  }

  const handlePChange = (e: any, value: any) => {
    // setBenefitData(value);

    // if (value) {
    //   const newObj = { id: value?.hirearchy?.id, name: value?.description };

    //   if (!tabHeads.some((item: any) => item.id === newObj.id)) {
    //     setTabHeads((prev: any) => {
    //       const updated = [...prev, newObj];
    //       setSelectedTabIndex(updated.length - 1); // select the new tab
    //       setSelectedBenefitIndex(updated.length - 1); // select the new tab
    //       return updated;
    //     });
    //   } else {
    //     setSelectedTabIndex(tabHeads.findIndex((item: any) => item.id === newObj.id));
    //   }

    //   setSelectedBenefitStructure(value);

    //   const index: any = benefitStructures.indexOf(value);

    //   setSelectedBenefitStructureIndex(index);
    //   onSetRootBenefit(benefitStructures[index]?.hirearchy, index);
    // }
    setBenefitData(value)

    if (value) {
      const newObj = { id: value?.hirearchy?.id, name: value?.description }

      if (!tabHeads.some((item: any) => item.id === newObj.id)) {
        setTabHeads((prev: any) => [...prev, newObj])
        setSelectedTabIndex(tabHeads.length)
      } else {
        setSelectedTabIndex(tabHeads.findIndex((item: any) => item.id === newObj.id))
      }

      setSelectedBenefitStructure(value)

      const index: any = benefitStructures.indexOf(value)

      setSelectedBenefitStructureIndex(index)
      onSetRootBenefit(benefitStructures[index]?.hirearchy, index)
    } else {
      // setSelectedBenefitStructure(selectedBenefitStructure);
    }
  };

  const getData = () => {
    // if (props.productDetails?.productRules?.length) {
    //   onSetRootBenefit(benefitStructures[0].hirearchy, 0, benefitStructures);
    //   const temp = [];
    //   const uniqueIds = new Set();
    //   props.productDetails.productRules.forEach(ele => {
    //     benefitStructures.forEach(item => {
    //       if (ele?.benefitId === item?.hirearchy?.id && !uniqueIds.has(item.hirearchy.id)) {
    //         temp.push({ id: item.hirearchy.id, name: item.description });
    //         uniqueIds.add(item.hirearchy.id);
    //       }
    //     });
    //   });
    //   setTabHeads(temp);
    // }
    const bts$ = benefitStructureService.getAllBenefitStructures({
      page: 0,
      size: 10000,
      summary: true,
      active: true
    })

    bts$.subscribe((page: any) => {
      setRulesInBenefitStructures(page.content, props?.productDetails?.productRules || [])
      setBenefitStructures(page.content)
      onSetRootBenefit(page.content[0].hirearchy, 0, page.content)

      if (props.productDetails?.productRules?.length) {
        const temp: any = []
        const uniqueIds = new Set()

        props.productDetails.productRules.forEach((ele: any) => {
          page.content.forEach((item: any) => {
            if (ele?.benefitId === item?.hirearchy?.id && !uniqueIds.has(item.hirearchy.id)) {
              temp.push({ id: item.hirearchy.id, name: item.description })
              uniqueIds.add(item.hirearchy.id)
            }
          })
        })
        setTabHeads(temp)
      }
    })
  }

  useEffect(() => {
    getData()
  }, [props.productDetails])

  const productDataSourceCallback$ = (
    params: any = {},
    action: any,
    pageRequest = {
      page: 0,
      size: 10000,
      summary: true,
      active: true
    }
  ) => {
    let reqParam = { ...pageRequest, ...params }

    reqParam.size = 10000

    if (action?.searchText && action?.searchText?.length > 2) {
      reqParam = {
        ...reqParam,
        code: action?.searchText,
        description: action?.searchText
      }

      return benefitStructureService.getAllBenefitStructures(reqParam).pipe(
        map((page: any) => {
          setRulesInBenefitStructures(page.content, props?.productDetails?.productRules || [])
          setBenefitStructures(page.content)

          return page
        })
      )
    } else {
      return benefitStructureService
        .getAllBenefitStructures({
          page: 0,
          size: 10000,
          summary: true,
          active: true
        })
        .pipe(
          map((page: any) => {
            setRulesInBenefitStructures(page.content, props?.productDetails?.productRules || [])
            setBenefitStructures(page.content)
            onSetRootBenefit(page.content[0].hirearchy, 0, page.content)

            if (props.productDetails?.productRules?.length) {
              const temp: any = []
              const uniqueIds = new Set()

              props.productDetails.productRules.forEach((ele: any) => {
                page.content.forEach((item: any) => {
                  if (ele?.benefitId === item?.hirearchy?.id && !uniqueIds.has(item.hirearchy.id)) {
                    temp.push({ id: item.hirearchy.id, name: item.description })
                    uniqueIds.add(item.hirearchy.id)
                  }
                })
              })

              setTabHeads(temp)
            }

            return page
          })
        )
    }
  }

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

  // const buildBreadcrumb = () => {
  //   // if (navPath.current && navPath.current.length > 0) {
  //   if (tabHeads && tabHeads?.length > 0) {
  //     return (
  //       <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} maxItems={3} aria-label="breadcrumb">
  //         {navPath.current.map((path, index) => {
  //           if (index === navPath.current.length - 1) return <Typography color="primary">{path.name}</Typography>;
  //           else {
  //             return (
  //               <Link
  //                 underline="hover"
  //                 color="inherit"
  //                 href="#"
  //                 style={{ textDecoration: 'underline' }}
  //                 onClick={e => {
  //                   e.stopPropagation();
  //                   onSelectBenefitFromNavPath(path);
  //                 }}>
  //                 {path.name}
  //               </Link>
  //             );
  //           }
  //         })}
  //         ;
  //       </Breadcrumbs>
  //     );
  //   } else return null;
  // };
  const buildBreadcrumb = () => (
    <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />} maxItems={3} aria-label='breadcrumb'>
      {navPath.current.map((path: any, index: any) => (
        <Link
          key={index}
          underline='hover'
          color={index === navPath.current.length - 1 ? 'primary' : 'inherit'}
          onClick={e => {
            e.preventDefault()
            if (index !== navPath.current.length - 1) onSelectBenefitFromNavPath(path)
          }}
        >
          {path?.name}
        </Link>
      ))}
    </Breadcrumbs>
  )

  const onRuleAdd = (data: any) => {

    const finalData = { ...data };

    // Add the rule to the current benefit
    benefitList[selectedBenefitIndex].ruleList = [...benefitList[selectedBenefitIndex].ruleList, finalData];

    if (navPath.current && navPath.current.length > 1) {
      finalData.parentInternalId = getSelectedRuleId(navPath.current[navPath.current.length - 2]);
    }

    // Extract rules from current benefit structures
    const rules = extractRulesForPayloadFromBenefitStructures(benefitList);
    // Update payload more carefully to avoid duplicates
    setPayload(prevPayload => {
      const newPayload: any = [...prevPayload];

      rules.forEach((rule: any) => {
        // Check if rule already exists in payload
        const existingIndex = newPayload.findIndex((item: any) => item.internalId === rule.internalId);

        if (existingIndex === -1) {
          // Rule doesn't exist, add it
          newPayload.push(rule);
        } else {
          // Rule exists, update it
          newPayload[existingIndex] = rule;
        }
      });
      return newPayload;
    });
    setIsOpenRuleModal(false);
  };

  const onRuleEditSave = (editedData: any) => {
    const copiedBenefitList = [...benefitList]
    const selectedBenefit = copiedBenefitList[selectedBenefitIndex]

    const newRuleList: any = [...selectedBenefit.ruleList]
    const updatedRuleDetails = { ...newRuleList[indexOfEditRule], ...editedData }
    newRuleList[indexOfEditRule] = updatedRuleDetails

    const updatedBenefit = { ...selectedBenefit, ruleList: newRuleList }
    copiedBenefitList[selectedBenefitIndex] = updatedBenefit
    setBenefitList(copiedBenefitList)

    // Extract rules and update payload carefully
    const rules = extractRulesFromBenefitStructures(copiedBenefitList)

    setPayload(prevPayload => {
      const newPayload: any = [...prevPayload];

      rules.forEach((rule: any) => {
        const existingIndex = newPayload.findIndex((item: any) => item.internalId === rule.internalId);

        if (existingIndex === -1) {
          newPayload.push(rule);
        } else {
          newPayload[existingIndex] = rule;
        }
      });

      return newPayload;
    });

    setEditFormValues(null)
    setIndexOfEditRule(0)
    setIsOpenRuleModal(false)
  }

  const onRuleDelete = (row: any, id: any) => {
    // const ruleList=[...benefitList[selectedBenefitIndex].ruleList];
    // ruleList.splice(ruleList.indexOf(row),1);
    // benefitList[selectedBenefitIndex].ruleList= ruleList;
    // setBenefitList([...benefitList]);

    deleteRule(benefitList[selectedBenefitIndex], row)
    setBenefitList([...benefitList])
  }

  const onRuleEdit = (row: any, idx: any) => {
    if (row.coverageExpression.includes('%')) {
      row.coverage = 'coverage with %'
    }

    setEditFormValues(row)
    setIndexOfEditRule(idx)
    setIsOpenRuleModal(true)
  }

  /* request for adding child rule*/
  const onRuleSelect = (rule: any) => {
    setParentBenefit(rule)
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
        benefitService
          .getBenefitParameterDetails2(tobeBenefit?.code, selectedBenefitStrucute?.current?.id)
          .subscribe((response: any) => {
            tobeBenefit.parameters = response?.parameters
            tobeBenefit.benefitStructureId = response?.benefitStructureId
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

  const handleBenefitStructureTabChange = (index: any) => {

    const rootBenefit: any = benefitStructures.find((ele: any) => tabHeads[index]?.id === ele?.hirearchy?.id)

    // Find the correct benefitStructure index instead of using tab index
    const benefitStructureIndex = benefitStructures.findIndex((ele: any) => tabHeads[index]?.id === ele?.hirearchy?.id)

    if (rootBenefit && benefitStructureIndex !== -1) {
      onSetRootBenefit(rootBenefit?.hirearchy, benefitStructureIndex) // Pass correct benefitStructure index
      setSelectedTabIndex(index) // This is the tab index
      setSelectedBenefitIndex(0) // Reset to first benefit in the new structure
    }
  }

  const onTabClose = (index: any) => {
    setTabHeads((prev: any) => {
      const updated = prev.filter((tab: any, i: number) => i !== index);
      if (selectedTabIndex === index) {
        setSelectedTabIndex(updated.length ? Math.max(0, index - 1) : 0);
      } else if (selectedTabIndex > index) {
        setSelectedTabIndex(selectedTabIndex - 1);
      }
      return updated;
    });
  };

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
          <Typography>Benefit Design</Typography>
        </Grid>

        <Grid item container xs={12} spacing={1}>
          {/* <Grid item><h4>Main Benifits</h4></Grid> */}
          <Grid item>
            <FormControl className={classes.formControl}>
              <FettleAutocomplete
                id='benefitId'
                name='benefitId'
                label={
                  <span>
                    Benefit Name <Asterisk />
                  </span>
                }
                displayKey='description'
                $datasource={props.productDetails && productDataSourceCallback$}
                value={benefitData}
                changeDetect={true}
                onChange={handlePChange}

              // required
              />
            </FormControl>
            {tabHeads?.length ? (
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
                        key={indx}
                        label={subBenifit.name}
                        {...a11yProps(indx, 'benefit')}
                        className={classes.subBenifitTab}
                      />
                    )
                  })}
              </Tabs>
            ) : null}
          </Grid>
          <Grid item style={{ flex: 1 }}>
            <TabView
              scrollable
              activeIndex={selectedTabIndex}
              onTabChange={e => handleBenefitStructureTabChange(e.index)}
              key={'tab_item'}
            >
              {tabHeads.map((item: any, index: number) => {
                return (
                  <TabPanel
                    headerClassName='flex align-items-center'
                    headerTemplate={(options: any) => {
                      return (
                        <div
                          className='flex align-items-center gap-2 p-2'
                          style={{ cursor: 'pointer' }}
                          onClick={options.onClick}
                        >
                          <p style={{ fontSize: '12px' }} className=' white-space-nowrap'>
                            {item.name}
                          </p>
                          <CloseOutlined style={{ fontSize: '14px' }} onClick={() => onTabClose(index)} />
                        </div>
                      )
                    }}
                    key={item.id}
                  >
                    <Grid item xs={12} container spacing={4} justifyContent='flex-end' style={{ padding: '16px' }}>
                      <Grid item xs={12}>
                        {buildBreadcrumb()}
                      </Grid>
                      <Grid item>
                        <Button style={{ float: 'right' }} className='p-button-outlined'>
                          Preview
                        </Button>
                        <RuleDesignPreviewModal
                          openDialog={isOpenRulePreviewModal}
                          handleClose={() => setIsOpenRulePreviewModal(false)}
                        ></RuleDesignPreviewModal>
                      </Grid>
                      <Grid item>
                        <Button
                          style={{ float: 'right' }}
                          className='p-button-outlined'
                          onClick={() => {
                            setIsOpenRuleModal(true)
                          }}
                        >
                          Add Rule
                        </Button>

                        <RuleDesignModal
                          openDialog={isOpenRuleModal}
                          setOpenDialog={setIsOpenRuleModal}
                          forBenefit={benefitList[selectedBenefitIndex]}
                          benefitNav={navPath.current || []}
                          onAdd={onRuleAdd}
                          editFormValues={editFormValues}
                          onRuleEditSave={onRuleEditSave}
                          parentBenefit={parentBenefit}
                        />
                      </Grid>
                    </Grid>
                    {benefitList && benefitList[selectedBenefitIndex] && (
                      <BenifitDesignRuleTable
                        ruleList={getRuleListForRuleViewTable()}
                        onRequestForChildRule={onRuleSelect}
                        hasChild={benefitList[selectedBenefitIndex].child && benefitList[selectedBenefitIndex].child.length > 0}
                        onRuleDelete={onRuleDelete}
                        onRuleEdit={onRuleEdit}
                        onRuleCloneHandler={function (rule: any, idx: number): void {
                          throw new Error('Function not implemented.')
                        }} />
                    )}
                  </TabPanel>
                )
              })}
            </TabView>
          </Grid>

          <Grid item container xs={12} spacing={1}>
            <Grid item xs={12} style={{}}>
              <Button
                className='p-button-outlined'
                style={{ float: 'right', marginTop: '16px', marginBottom: '16px' }}
                disabled={!hasAnyRuleInBenefitHierarchies(benefitList) || !tabHeads.length}
                onClick={saveRule}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}
