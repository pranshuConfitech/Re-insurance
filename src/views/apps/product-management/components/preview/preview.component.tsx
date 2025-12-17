import React, { useEffect } from 'react'

import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Grid from '@mui/material/Grid'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import { BenefitStructureService } from '@/services/remote-api/api/benefit-structure-services'
import ServiceDesignTable from '../service-design/service-design-table'
import { FettleBenefitRuleTreeViewComponent } from '@/views/apps/shared-component/components/fettle.benefit.rule.treeview'

const benefitStructureService = new BenefitStructureService()

const benefitStructureService$ = benefitStructureService.getAllBenefitStructures()

const useStyles = makeStyles((theme: any) => ({
  root: {
    width: '100%',
    flexGrow: 1,
    minHeight: 100,
    padding: 30
  },
  header: {
    paddingTop: 10,
    paddingBottom: 10,
    color: '#4472C4'
  },
  heading: {
    fontSize: theme?.typography?.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme?.typography?.pxToRem(15),
    color: theme?.palette?.text?.secondary
  },
  AccordionSummary: {
    backgroundColor: theme?.palette?.background?.default
  }
}))

export default function PreviewComponent(props: any) {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState('panel2')

  const handleAccordianToggle = (panel: any) => (event: any, isExpanded: any) => {
    setExpanded(isExpanded ? panel : false)
  }

  const [benefitStructures, setBenefitStructures] = React.useState([])
  const [previewBenefitHierarchy, setPreviewBenefitHierarchy] = React.useState([])
  const [rows, setRows] = React.useState([])

  useEffect(() => {
    if (props.productDetails && props.productDetails.productServices) {
      setSeviceDesignData()
    }
  }, [props.productDetails])

  const useObservable = (observable: any, setter: any, type: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        setter(result.content)

        if (type === 'benefitStructure') {
          buildPreviewHierarchy(result.content)
        }
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(benefitStructureService$, setBenefitStructures, 'benefitStructure')

  const buildRuleObject = (rule: any) => {
    return {
      ...rule,
      config: JSON.parse(rule.expressionConfiugrationStub),
      ruleName: rule.name,
      ruleTextArea: rule.expression,
      internalId: rule.id,
      parentInternalId: rule.parentId
    }
  }

  const setRulesInParent = (benefit: any, parentId: any, rule: any) => {
    if (benefit.rules) {
      const parentIndex = benefit.rules.findIndex((item: any) => item.id === parentId)

      if (parentIndex === -1) {
        for (let i = 0; i < benefit.child.length; i++) {
          const item = benefit.child[i]

          setRulesInParent(item, parentId, rule)
        }
      } else {
        if (benefit.child && benefit.child.length > 0) {
          const childIndex = benefit.child.findIndex((item: any) => item.id === rule.benefitId)

          if (childIndex > -1) {
            if (!benefit.child[childIndex].rules) {
              benefit.child[childIndex].rules = []
            }

            benefit.child[childIndex].rules.push(buildRuleObject(rule))
          }
        }
      }
    }
  }

  const getChildRuleHierarchy = (parentHierarchy: any, mainBenefitIndex: number, rule: any, newBenefitElm: any) => {
    const parentIdx = parentHierarchy.child.findIndex((item: any) => item.id === rule.parentId)

    if (parentIdx > -1) {
      let benefitIdx = parentHierarchy.child[parentIdx].child.findIndex(
        (benefit: any) => benefit.id === newBenefitElm.id
      )

      if (benefitIdx === -1) {
        parentHierarchy.child[parentIdx].child.push(newBenefitElm)
        benefitIdx = 0
      }

      parentHierarchy.child[parentIdx].child[benefitIdx].child.push({ ...rule, child: [], type: 'rule' })
    } else {
      parentHierarchy.child.forEach((item: any) => {
        getChildRuleHierarchy(item, mainBenefitIndex, rule, newBenefitElm)
      })
    }
  }

  const getChildBenefitHierarchy = (benefitElm: any, rule: any, previewHierarchy: any, mainBenefitIndex: number) => {
    if (benefitElm.child && benefitElm.child.length > 0) {
      const subBenefitIndex = benefitElm.child.findIndex((item: any) => item.id === rule.benefitId)

      if (subBenefitIndex > -1) {
        const newBenefitElm = { ...benefitElm.child[subBenefitIndex], child: [], type: 'benefit' }

        if (rule.parentId) {
          getChildRuleHierarchy(previewHierarchy[mainBenefitIndex].hirearchy, mainBenefitIndex, rule, newBenefitElm)
        }
      } else {
        benefitElm.child.forEach((item: any) => {
          getChildBenefitHierarchy(item, rule, previewHierarchy, mainBenefitIndex)
        })
      }
    }
  }

  const buildPreviewHierarchy = (benefitStructures: any) => {
    const previewHierarchy = benefitStructures.map((benefit: any) => {
      return { ...benefit, hirearchy: { ...benefit.hirearchy, child: [] } }
    })

    if (props.productDetails.productConfigurations) {
      props.productDetails.productConfigurations.rules.forEach((rule: any) => {
        const mainBenefitIndex = benefitStructures.findIndex((b: any) => b.id === rule.benefitStructureId)

        if (mainBenefitIndex > -1) {
          const benefitElm = benefitStructures[mainBenefitIndex].hirearchy

          if (benefitElm.id === rule.benefitId) {
            if (!rule.parentId) {
              previewHierarchy[mainBenefitIndex].hirearchy.child.push({ ...rule, child: [], type: 'rule' })
            }
          } else {
            getChildBenefitHierarchy(benefitElm, rule, previewHierarchy, mainBenefitIndex)
          }
        }
      })
    }
    previewHierarchy.forEach((node: any) => addRandomEIdToHierarchy(node));

    setPreviewBenefitHierarchy(previewHierarchy)
  }

  const addRandomEIdToHierarchy = (node: any) => {
    // Assign a random eId between 10 and 99
    function getRandomNumberWith2to5Digits() {
      const digitCount = Math.floor(Math.random() * 4) + 2; // 2 to 5
      const min = Math.pow(10, digitCount - 1);
      const max = Math.pow(10, digitCount) - 1;
      let d = new Date().getTime();
      return Math.floor(Math.random() * (max - min + 1)) + min, Math.floor(Math.random() * (max - min + 1)) + min + d;
    }

    node.eId = getRandomNumberWith2to5Digits();

    // Recursively assign to children in both possible child arrays
    if (Array.isArray(node.child) && node.child.length > 0) {
      node.child.forEach((childNode: any) => addRandomEIdToHierarchy(childNode));
    }
    if (node.hirearchy && Array.isArray(node.hirearchy.child) && node.hirearchy.child.length > 0) {
      node.hirearchy.child.forEach((childNode: any) => addRandomEIdToHierarchy(childNode));
    }
  };

  const setSeviceDesignData = () => {
    const productDetails = props.productDetails

    if (productDetails && productDetails.productServices) {
      const servicesRows =
        productDetails?.productServices?.services &&
        JSON.parse(JSON.stringify(productDetails?.productServices?.services))

      setRows(servicesRows)
    }
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Grid item xs={3} className={classes.header}>
            <h3>Preview & Save</h3>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Accordion expanded={expanded === 'panel1'} onChange={handleAccordianToggle('panel1')}>
            <AccordionSummary
              className={classes.AccordionSummary}
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1bh-content'
              id='panel1bh-header'
            >
              <Typography className={classes.heading}>Basic Details</Typography>
              <Typography className={classes.secondaryHeading}></Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ width: '100%' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={4}>
                    <label>
                      <strong>Product Type : </strong>
                    </label>
                    <span>{props?.productDetails?.productBasicDetails?.productTypeName}</span>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <label>
                      <strong>Product Name : </strong>
                    </label>
                    <span>{props?.productDetails?.productBasicDetails?.name}</span>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <label>
                      <strong>Product Market : </strong>
                    </label>
                    <span>{props?.productDetails?.productBasicDetails?.productMarketName}</span>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <label>
                      <strong>Description : </strong>
                    </label>
                    <span>{props?.productDetails?.productBasicDetails?.description}</span>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <label>
                      <strong>Client Type : </strong>
                    </label>
                    <span>{props?.productDetails?.productBasicDetails?.clientTypeName}</span>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <label>
                      <strong>Group Type : </strong>
                    </label>
                    <span>{props?.productDetails?.productBasicDetails?.groupTypeName}</span>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <label>
                      <strong>Product Currency : </strong>
                    </label>
                    <span>{props?.productDetails?.productBasicDetails?.productCurrencyCd}</span>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <label>
                      <strong>Valid From : </strong>
                    </label>
                    <span>{props?.productDetails?.productBasicDetails?.validFrom}</span>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <label>
                      <strong>Valid Upto : </strong>
                    </label>
                    <span>{props?.productDetails?.productBasicDetails?.validUpTo}</span>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <label>
                      <strong>Premium Currency : </strong>
                    </label>
                    <span>{props?.productDetails?.productBasicDetails?.premiumCurrencyCd}</span>
                  </Grid>
                </Grid>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel2'} onChange={handleAccordianToggle('panel2')}>
            <AccordionSummary
              className={classes.AccordionSummary}
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel2bh-content'
              id='panel2bh-header'
            >
              <Typography className={classes.heading}>Benefit Design</Typography>
              <Typography className={classes.secondaryHeading}></Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FettleBenefitRuleTreeViewComponent hierarchy={previewBenefitHierarchy} />
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel3'} onChange={handleAccordianToggle('panel3')}>
            <AccordionSummary
              className={classes.AccordionSummary}
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel3bh-content'
              id='panel3bh-header'
            >
              <Typography className={classes.heading}>Service Design</Typography>
              <Typography className={classes.secondaryHeading}></Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ width: '100%' }}>
                <ServiceDesignTable designList={rows} />
              </div>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </div>
  )
}
