
import { BenefitStructureService } from '@/services/remote-api/api/benefit-structure-services'
import { BenefitService } from '@/services/remote-api/api/master-services'
import { ProductService } from '@/services/remote-api/api/product-services'
import Asterisk from '@/views/apps/shared-component/components/red-asterisk'
import { CloseOutlined } from '@mui/icons-material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Alert } from '@mui/lab'
import { Autocomplete, Breadcrumbs, Link, Snackbar, TextField } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import { TabPanel, TabView } from 'primereact/tabview'
import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  clearSelectedRuleFromBenefitInNavPath,
  deleteRule,
  extractRulesForPayloadFromBenefitStructures, getSelectedRuleId,
  hasAnyRuleInBenefitHierarchies,
  setRulesInBenefitStructures
} from '../../util/product-util'
import BenifitDesignRuleTable from './benifit-design-rule-table'
import ConfirmationModel from './confirmation-model'
import RuleDesignModal from './rule-design-modal'
import RuleDesignPreviewModal from './rule-design-preview-modal'









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
  const [selectedBenefitStructure, setSelectedBenefitStructure] = useState<any>(null) //for Autocomplete state only
  const [selectedBenefitStructureIndex, setSelectedBenefitStructureIndex] = React.useState(0)
  const [selectedBenefitIndex, setSelectedBenefitIndex] = React.useState(0)
  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0)
  const [benefitList, setBenefitList]: any = useState([])
  // const [isOpenRuleModal, setIsOpenRuleModal] = useState(false)
  const [modalProps, setModalProps] = useState({
    mode: '',
    editFormValues: null,
    openDialog: false
  })
  const [isOpenRulePreviewModal, setIsOpenRulePreviewModal] = useState(false)
  const selectedBenefitStrucute: any = useRef(null)
  const navPath: any = useRef(null)
  const [openSnackbar, setOpenSnackbar] = React.useState(false)
  const [indexOfEditRule, setIndexOfEditRule] = React.useState(0)
  const [payload, setPayload] = useState([])
  // const [searchKey, setSearchKey] = useState('')
  const [tabHeads, setTabHeads]: any = useState([])
  // const [allBenefitStructures, setAllBenefitStructures] = React.useState([])
  // const [benefitData, setBenefitData] = React.useState([])
  const [parentBenefit, setParentBenefit] = React.useState([])
  const history = useRouter();
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);
  const [showTabCloseDialog, setShowTabCloseDialog] = useState(false);
  const [tabToReplace, setTabToReplace] = useState<{ newObj: any, existingTabName: string } | null>(null);
  const [tabToCloseIndex, setTabToCloseIndex] = useState<number | null>(null);
  const onSetRootBenefit = (rootBenefit: any, index = 0, opBenefitStructures = []) => {
    console.log("Called bsIndex", index);

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
          rootBenefit.parameters = response?.parameters
          rootBenefit.benefitStructureId = response?.benefitStructureId
          setBenefitList([rootBenefit])
          setSelectedBenefitStructureIndex(index)
          setSelectedBenefitIndex(0)
          setSelectedBenefitStructure(selectedBenefitStrucute.current)
        })
    } else {
      setBenefitList([rootBenefit])
      setSelectedBenefitStructureIndex(index)
      setSelectedBenefitIndex(0)
      setSelectedBenefitStructure(selectedBenefitStrucute.current)
    }
  }

  const saveRule = () => {
    // const rules = extractRulesFromBenefitStructures(benefitList);
    console.log(payload);

    const productId: any = localStorage.getItem('productId')
    productservice.saveProductRules(productId, payload).subscribe(() => {
      setOpenSnackbar(true)
      setPayload([]);
      setSelectedTabIndex(0);
      setSelectedBenefitStructureIndex(0);
      setSelectedBenefitIndex(0)
      setSelectedBenefitStructure(null);
      // setBenefitData([]);
      setTimeout(() => {
        props.refetch();
      }, 1000)
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

    if (value) {
      const newObj = { id: value?.hirearchy?.id, name: value?.description, benefitStructureId: value?.id };
      const tabHeadsSelected = tabHeads.filter((item: any) => item.id === newObj.id)[0]?.name;

      if (!tabHeads.some((item: any) => item.id === newObj.id)) {
        setTabHeads((prev: any) => {
          const updated = [...prev, newObj];
          setSelectedTabIndex(updated.length - 1); // select the new tab
          setSelectedBenefitIndex(updated.length - 1); // select the new tab
          return updated;
        });
        const newBenefitStructure = benefitStructures.find((b: any) => b.id === value?.id) || null;
        // setBenefitData(newBenefitStructure);
        setSelectedBenefitStructure(newBenefitStructure);
        const benefitStructureIndex = benefitStructures.findIndex((b: any) => b.id === newBenefitStructure?.id);
        setSelectedBenefitStructureIndex(benefitStructureIndex);
        onSetRootBenefit(newBenefitStructure?.hirearchy, benefitStructureIndex);
      } else {
        if (!tabHeads.some((item: any) => item.name === newObj.name)) {
          setTabToReplace({ newObj, existingTabName: tabHeadsSelected || '' });
          setShowReplaceDialog(true);
        }
        else {
          const index = tabHeads.findIndex((item: any) => item.id === value?.hirearchy?.id);
          setSelectedTabIndex(index);
          setSelectedBenefitIndex(index);
          const newBenefit = benefitStructures.find((b: any) => b.id === value?.id) || null;
          // setBenefitData(newBenefit);
          setSelectedBenefitStructure(newBenefit);
          const benefitStructureIndex = benefitStructures.findIndex((b: any) => b.id === newBenefit?.id);
          setSelectedBenefitStructureIndex(benefitStructureIndex);
          onSetRootBenefit(newBenefit?.hirearchy, benefitStructureIndex);
        }
        // setSelectedTabIndex(tabHeads.findIndex((item: any) => item.id === newObj.id));
      }

      // setSelectedBenefitStructure(value);

      // let index: number = -1;
      // // const index: any = benefitStructures.indexOf(value);
      // benefitStructures.forEach((ele: any, i: number) => {
      //   if (ele.id === value.id) {
      //     index = i;
      //   }
      // })

      // setSelectedBenefitStructureIndex(index);
      // console.log("11111",benefitStructures[index]?.hirearchy)
      // onSetRootBenefit(benefitStructures[index]?.hirearchy, index);
    }

  };
  const handleReplaceConfirm = () => {
    if (tabToReplace) {


      const indexToReplace = tabHeads.findIndex((item: any) => item.id === tabToReplace.newObj.id);

      handleBenefitStructureTabChange(indexToReplace);

      benefitList[0].ruleList = [];
      const updatedTabs = [...tabHeads];
      onRuleDeleteByBSId(updatedTabs[indexToReplace].benefitStructureId);

      updatedTabs[indexToReplace] = tabToReplace.newObj;
      setTabHeads(updatedTabs);
      setSelectedTabIndex(indexToReplace);
      setSelectedBenefitIndex(indexToReplace);

      const newBenefit = benefitStructures.find((b: any) => b.id === tabToReplace.newObj.benefitStructureId) || null;
      // setBenefitData(newBenefit);
      setSelectedBenefitStructure(newBenefit);
      const benefitStructureIndex = benefitStructures.findIndex((b: any) => b.id === newBenefit?.id);
      setSelectedBenefitStructureIndex(benefitStructureIndex);
      onSetRootBenefit(newBenefit?.hirearchy, benefitStructureIndex);

      setShowReplaceDialog(false);
      setTabToReplace(null);
    }
  };
  const getBenefitForTabId = (tabId: string) => {
    const tab = tabHeads.find((t: any) => t.id === tabId);
    if (!tab) return null;

    return benefitStructures.find((b: any) => b.id === tab.benefitStructureId) || null;
  };
  const handleReplaceCancel = () => {
    if (tabToReplace) {
      const existingIndex = tabHeads.findIndex((item: any) => item.id === tabToReplace.newObj.id);
      setSelectedTabIndex(existingIndex);
      setSelectedBenefitIndex(existingIndex);

      const existingBenefit = getBenefitForTabId(tabHeads[existingIndex].id);
      console.log("existingBenefit", existingBenefit);

      // setBenefitData(existingBenefit);
      setSelectedBenefitStructure(existingBenefit);

      const benefitStructureIndex = benefitStructures.findIndex((b: any) => b.id === existingBenefit?.id);
      setSelectedBenefitStructureIndex(benefitStructureIndex);

      onSetRootBenefit(existingBenefit?.hirearchy, benefitStructureIndex);

    }
    setShowReplaceDialog(false);
    setTabToReplace(null);
  };

  const getData = () => {
    console.log(props.productDetails);
    const bts$ = benefitStructureService.getAllBenefitStructures({
      page: 0,
      size: 10000,
      summary: true,
      active: true
    })

    bts$.subscribe((page: any) => {
      setRulesInBenefitStructures(page.content, props?.productDetails?.productRules || [])
      setBenefitStructures(page.content)
      if (props.productDetails?.productRules?.length) {
        let tabElements: any = []
        let exisitngBenefitStructuresInProductRule: any = []
        const uniqueIds = new Set();

        console.log('data ', props.productDetails.productRules, page.content);

        props.productDetails.productRules.forEach((ele: any) => {
          page.content.forEach((item: any, index: number) => {
            if (ele?.benefitStructureId === item?.id && !uniqueIds.has(item.hirearchy.id)) {

              let element = { id: item.hirearchy.id, name: item.description, benefitStructureId: item.id };
              tabElements.push(element);
              exisitngBenefitStructuresInProductRule.push(item);
              uniqueIds.add(item.hirearchy.id);
            }
          })
        })
        navPath.current = tabElements[0] && [tabElements[0]];
        console.log('navPath', navPath.current, tabElements);
        setTabHeads(tabElements)
        setBenefitList(tabElements)
        console.log('setBenefitList', tabElements);



        /*checking any benefit structure available or not */
        if (exisitngBenefitStructuresInProductRule.length > 0) {
          let findIndex = page.content.indexOf(exisitngBenefitStructuresInProductRule[0]);
          setTimeout(() => {
            onSetRootBenefit(exisitngBenefitStructuresInProductRule[0].hirearchy, findIndex, page.content);
          }, 1000)
        }

      }
    })
  }

  useEffect(() => {
    getData()
  }, [props.productDetails])

  const onSelectBenefitFromNavPath = (benefit: any) => {
    const index = navPath.current.indexOf(benefit)

    if (index == 0) {
      console.log("44444")
      onSetRootBenefit(benefit, selectedBenefitStructureIndex)
    } else {
      clearSelectedRuleFromBenefitInNavPath(navPath.current, index)
      const parentBenefit = navPath.current[index - 1]

      navPath.current = navPath.current.slice(0, index + 1)
      setBenefitList(parentBenefit.child)
      setSelectedBenefitIndex(parentBenefit.child.indexOf(benefit))
    }
  }

  const buildBreadcrumb = () => (
    <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />} maxItems={3} aria-label='breadcrumb'>
      {navPath?.current?.map((path: any, index: any) => (
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
  );


  const onRuleCloneSave = (data: any) => {

    const finalData = { ...data };
    delete finalData.id;
    delete finalData.internalId;
    finalData.internalId = uuidv4();

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


    setModalProps({
      mode: 'clone',
      editFormValues: null,
      openDialog: false
    })
  };

  const onRuleAdd = (data: any) => {

    const finalData = { ...data };
    console.log(benefitList);

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
    setModalProps({
      mode: 'add',
      editFormValues: null,
      openDialog: false
    })
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
    const rules = extractRulesForPayloadFromBenefitStructures(copiedBenefitList)

    console.log("onRuleEditSave", editedData, copiedBenefitList);
    setPayload(prevPayload => {
      const newPayload: any = [...prevPayload];

      console.log("newPayload", newPayload, rules);
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

    setIndexOfEditRule(0)
    setModalProps({
      mode: 'edit',
      editFormValues: null,
      openDialog: false
    })
  }

  const onRuleDelete = (row: any, id: any) => {
    const productId: any = localStorage.getItem('productId')
    productservice.deleteProductRule(productId, row.id).subscribe((res: any) => {
      if (res.status == 200) {
        alert('Rule deleted successfully');
        deleteRule(benefitList[selectedBenefitIndex], row.id)
        setBenefitList([...benefitList])
      }
    })

  }
  const onRuleDeleteByBSId = (id: any) => {
    const productId: any = localStorage.getItem('productId')
    productservice.deleteProductRuleByBSID(productId, id).subscribe((res: any) => {
      if (res.status == 200) {
        alert('Rule deleted successfully');
        // setBenefitList([...benefitList])
      }
    })

  }

  const onRuleEdit = (row: any, idx: any) => {
    if (row.coverageExpression.includes('%')) {
      row.coverage = 'coverage with %'
    }
    setIndexOfEditRule(idx)
    setModalProps({
      mode: 'edit',
      editFormValues: row,
      openDialog: true
    })
  }


  const onRuleCloneHandler = (row: any, idx: any) => {
    if (row.coverageExpression.includes('%')) {
      row.coverage = 'coverage with %'
    }
    // setIndexOfEditRule(idx)

    setModalProps({
      mode: 'clone',
      editFormValues: row,
      openDialog: true
    })
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
  console.log("qwertyuio", benefitList)
  const getRuleListForRuleViewTable = () => {
    if (!navPath.current) {
      return []
    }
    if (navPath.current.length == 1) {
      return benefitList[selectedBenefitIndex]?.ruleList
    }

    const parentBenefit = navPath.current[navPath.current.length - 2]
    const selectedRuleId = getSelectedRuleId(parentBenefit)

    return benefitList[selectedBenefitIndex].ruleList.filter((r: any) => r.parentInternalId === selectedRuleId)
  }

  const handleBenefitStructureTabChange = (index: any, tabsList = tabHeads, force = false) => {

    // const rootBenefit: any = benefitStructures.find((ele: any) => tabHeads[index]?.benefitStructureId === ele?.id)

    // // Find the correct benefitStructure index instead of using tab index
    // const benefitStructureIndex = benefitStructures.findIndex((ele: any) => tabHeads[index]?.benefitStructureId === ele?.id)
    // console.log(rootBenefit);

    console.log(tabsList);
    if (!force && index === selectedTabIndex) return;
    const rootBenefit: any = benefitStructures.find(
      (ele: any) => tabsList[index]?.benefitStructureId === ele?.id
    );

    const benefitStructureIndex = benefitStructures.findIndex(
      (ele: any) => tabsList[index]?.benefitStructureId === ele?.id
    );
    console.log(rootBenefit);
    // console.log("55555", rootBenefit, benefitStructureIndex, tabHeads, benefitStructures)
    if (rootBenefit && benefitStructureIndex !== -1) {
      onSetRootBenefit(rootBenefit?.hirearchy, benefitStructureIndex) // Pass correct benefitStructure index
      setSelectedTabIndex(index) // This is the tab index
      setSelectedBenefitIndex(0) // Reset to first benefit in the new structure
      // setBenefitData(rootBenefit);
      setSelectedBenefitStructure(rootBenefit);
      setSelectedBenefitStructureIndex(benefitStructureIndex);
    }
  }

  // const onTabClose = (index: any) => {
  //   setTabHeads((prev: any) => {
  //     const updated = prev.filter((tab: any, i: number) => i !== index);
  //     if (selectedTabIndex === index) {
  //       setSelectedTabIndex(updated.length ? Math.max(0, index - 1) : 0);
  //     } else if (selectedTabIndex > index) {
  //       setSelectedTabIndex(selectedTabIndex - 1);
  //     }
  //     return updated;
  //   });
  // };
  // const onTabClose = (indexToRemove: number) => {
  //   const updatedTabs = tabHeads.filter((_: any, i: number) => i !== indexToRemove);

  //   setTabHeads(updatedTabs);
  //   let newSelectedIndex = selectedTabIndex;

  //   if (selectedTabIndex === indexToRemove) {
  //     newSelectedIndex = updatedTabs.length ? Math.max(0, indexToRemove - 1) : 0;
  //   } else if (selectedTabIndex > indexToRemove) {
  //     newSelectedIndex = selectedTabIndex - 1;
  //   }
  //   setTimeout(() => {
  //     if (updatedTabs.length > 0) {
  //       handleBenefitStructureTabChange(newSelectedIndex, updatedTabs, true);
  //     } else {
  //       // setBenefitData([]);
  //       setSelectedBenefitStructure(null);
  //       setSelectedBenefitStructureIndex(-1);
  //       setSelectedTabIndex(0);
  //       onSetRootBenefit(null, -1);
  //     }
  //   }, 0);
  // };

  const onTabClose = (index: number) => {
    setTabToCloseIndex(index);
    setShowTabCloseDialog(true);
  };

  const handleTabCloseConfirm = () => {
    if (tabToCloseIndex !== null) {


      const updatedTabs = tabHeads.filter((_: any, i: number) => i !== tabToCloseIndex);
      onRuleDeleteByBSId(tabHeads[tabToCloseIndex].benefitStructureId);

      setTimeout(() => {
        setTabHeads(updatedTabs);
        let newSelectedIndex = selectedTabIndex;

        if (selectedTabIndex === tabToCloseIndex) {
          newSelectedIndex = updatedTabs.length ? Math.max(0, tabToCloseIndex - 1) : 0;
        } else if (selectedTabIndex > tabToCloseIndex) {
          newSelectedIndex = selectedTabIndex - 1;
        }
        if (updatedTabs.length > 0) {
          handleBenefitStructureTabChange(newSelectedIndex, updatedTabs, true);
        } else {
          // setBenefitData([]);
          setSelectedBenefitStructure(null);
          setSelectedBenefitStructureIndex(-1);
          setSelectedTabIndex(0);
          onSetRootBenefit(null, -1);
        }
      }, 0);


      setTabToCloseIndex(null);
      setShowTabCloseDialog(false);
    }
  };

  const handleTabCloseCancel = () => {
    setShowTabCloseDialog(false);
    setTabToCloseIndex(null);
  };
  console.log("qwer", tabHeads, benefitList)
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
              <Autocomplete
                options={benefitStructures}
                getOptionLabel={(option: any) => {
                  return option.description;
                }}
                isOptionEqualToValue={(option: any, value: any) => {
                  return option.id === value.id;
                }}
                value={selectedBenefitStructure}
                onChange={handlePChange}
                renderInput={params => (
                  <TextField
                    {...params}
                    label={
                      <span>
                        Benefit Structure <Asterisk />
                      </span>
                    }
                    placeholder='Select benefit structure name'
                    variant='outlined'
                    fullWidth
                  />
                )}
                className={classes.formControl}
              />
              {/* <FettleAutocomplete
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
              /> */}
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
                            setModalProps({
                              mode: 'add',
                              editFormValues: null,
                              openDialog: true
                            })
                          }}
                        >
                          Add Rule
                        </Button>

                        <RuleDesignModal
                          openDialog={modalProps.openDialog}
                          editFormValues={modalProps.editFormValues}
                          mode={modalProps.mode}
                          setOpenDialog={(open: boolean) => setModalProps(prevProps => ({ ...prevProps, openDialog: open }))}
                          forBenefit={benefitList[selectedBenefitIndex]}
                          benefitNav={navPath.current || []}
                          onRuleAdd={onRuleAdd}
                          onRuleEditSave={onRuleEditSave}
                          onRuleCloneSave={onRuleCloneSave}
                          parentBenefit={parentBenefit}
                          productBasicDetails={props?.productDetails?.productBasicDetails}
                        />
                      </Grid>
                    </Grid>
                    {benefitList && benefitList[selectedBenefitIndex] && (
                      <BenifitDesignRuleTable
                        ruleList={getRuleListForRuleViewTable()}
                        onRequestForChildRule={onRuleSelect}
                        hasChild={
                          benefitList[selectedBenefitIndex].child && benefitList[selectedBenefitIndex].child.length > 0
                        }
                        onRuleDelete={onRuleDelete}
                        onRuleEdit={onRuleEdit}
                        onRuleCloneHandler={onRuleCloneHandler}
                      />
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
      <ConfirmationModel
        open={showReplaceDialog}
        onClose={handleReplaceCancel}
        onConfirm={handleReplaceConfirm}
        title="Replace Tab?"
        messageComponent={
          <>
            A tab already exists <strong>{tabToReplace?.existingTabName}</strong> with same root benefit. Do you want to replace it with{' '}
            <strong>{tabToReplace?.newObj?.name}</strong>?
          </>
        }
        confirmLabel="Replace with New"
        cancelLabel="Keep Existing"
      />

      <ConfirmationModel
        open={showTabCloseDialog}
        onClose={handleTabCloseCancel}
        onConfirm={handleTabCloseConfirm}
        title="Close Tab?"
        message="Are you sure you want to close this tab? Rules also be deleted."
        confirmLabel="Yes, Close"
        cancelLabel="Cancel"
      />

    </div>
  )
}
