import React, { useState } from 'react';

import { Box, Divider, Grid, IconButton, Radio } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Button } from 'primereact/button';

import PremiumRuleDesignModal from './premium-rule-design-modal';
import PremiumRuleTable from './premium.rule.table';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  actionBlock: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
});

export default function ProductRuleTableForPremium({
  forBenefit,
  ruleList,
  onRequestForChildRule,
  hasChild = true,
  paymentFrequencies,
  onBenefitChange,
}: any) {
  const classes = useStyles();
  const preventDefault = (event: any) => event.preventDefault();
  const [isOpenRuleModal, setIsOpenRuleModal] = useState(false);
  const [selectedRow, setSelectedRow] = React.useState(0);
  const [editIndex, setEditIndex] = React.useState<any>();
  const [data, setData] = React.useState<any>();

  const isSelected = (rowId: any) => {
    return selectedRow == rowId;
  };

  const handleChange = (event: any) => {
    setSelectedRow(event.target.value);
  };

  // const deleteTableRuleEvent = (row, idx) => e => {
  //   // onRuleDelete(row, idx);
  // };

  const onClickEdit = (idx: any) => {
    setEditIndex(idx);
    setData(ruleList[selectedRow]?.premiumRules)
    setIsOpenRuleModal(true);
  };

  // const onRuleAdd = data => {
  //   // ruleList[selectedRow].premiumRules = ruleList[selectedRow].premiumRules || [];
  //   // ruleList[selectedRow].premiumRules = [...ruleList[selectedRow].premiumRules, data];
  //   console.log('data: ', data);
  //   console.log('ruleLIst: before', ruleList);
  //   const isExistingRuleId = ruleList[selectedRow].premiumRules
  //     ? ruleList[selectedRow].premiumRules.some(rule => rule.id === data.id)
  //     : false;

  //   if (isExistingRuleId) {
  //     // If the rule with the same id already exists, update it
  //     ruleList[selectedRow].premiumRules = ruleList[selectedRow]?.premiumRules?.map((rule, index) =>
  //       index === isExistingRuleId ? { ...rule, ...data } : rule,
  //     );
  //     ruleList[selectedRow].premiumRules = [...ruleList[selectedRow].premiumRules, ...data];
  //     console.log('ruleLIst: isExistingRuleId', ruleList);
  //   } else {
  //     // If the rule with the same id doesn't exist, push the new rule
  //     // let temp = [];
  //     // temp.push(data)
  //     // ruleList[selectedRow].premiumRules = temp;
  //     ruleList[selectedRow].premiumRules = Array.isArray(ruleList[selectedRow].premiumRules)
  //       ? [data, ...ruleList[selectedRow].premiumRules]
  //       : [data];
  //     console.log('ruleLIst: after', ruleList);
  //   }

  //   // const finalData = { ...data, benefitStructureId: selectedBenefitStrucute.current.id }
  //   // benefitList[selectedBenefitIndex].ruleList = [...benefitList[selectedBenefitIndex].ruleList, finalData];

  //   // if (navPath.current && navPath.current.length > 1) {
  //   //     finalData.parentInternalId = getSelectedRuleId(navPath.current[navPath.current.length - 2]);
  //   // }

  //   setIsOpenRuleModal(false);
  //   if (onBenefitChange) {
  //     onBenefitChange(forBenefit);
  //   }
  // };

  const onExitClick = () => { setEditIndex(null) }

  const onRuleAdd = (updatedPremiumRule: any) => {
    if (typeof (ruleList[selectedRow].premiumRules) === 'undefined') {
      ruleList[selectedRow].premiumRules = []
    }


    // let ruleIndex = ruleList[selectedRow]?.premiumRules?.findIndex(rule => rule.id === updatedPremiumRule.id);
    let ruleIndex = -1;
    const premiumRules = ruleList[selectedRow]?.premiumRules;

    if (premiumRules) {
      for (let i = 0; i < premiumRules.length; i++) {
        if (premiumRules[i].id === updatedPremiumRule.id) {
          if (Object.keys(premiumRules[i]).includes('id')) {
            ruleIndex = i;
            break;
          } else if (editIndex != undefined) {
            ruleIndex = editIndex;
          } else {
            ruleIndex = -1;
            break;
          }
        }
      }
    }

    if (ruleIndex !== -1) {
      ruleList[selectedRow].premiumRules[ruleIndex] = updatedPremiumRule;
    } else {
      ruleList[selectedRow].premiumRules.push(updatedPremiumRule);
    }

    setIsOpenRuleModal(false);

    if (onBenefitChange) {
      onBenefitChange(forBenefit);
    }

    ruleIndex = 0;
  };

  let response = null;

  if (ruleList && ruleList.length > 0) {
    response = (
      <>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center"></TableCell>
              <TableCell align="center">Rule Name</TableCell>
              <TableCell align="center">Coverage</TableCell>
              <TableCell align="center">Cover Type</TableCell>
              <TableCell align="center">Rule Definition</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ruleList.map((row: any, idx: number) => {
              const isItemSelected = isSelected(idx);

              return (
                <TableRow key={row?.id}>
                  <TableCell align="center">
                    <Radio
                      checked={isItemSelected}
                      onChange={handleChange}
                      value={idx}
                      name="radio-button-demo"
                      inputProps={{ 'aria-label': row?.ruleName }}
                      style={{ color: "#01de74" }}
                    />
                  </TableCell>
                  <TableCell align="center" component="th" scope="row">
                    {row?.name}
                  </TableCell>
                  <TableCell align="center">{row?.coverageExpression}</TableCell>
                  <TableCell align="center">{row?.coverType}</TableCell>
                  <TableCell align="center">{row?.expression}</TableCell>
                  <TableCell align="center" className={classes.actionBlock}>
                    <IconButton
                      onClick={() => {
                        onRequestForChildRule(row);
                      }}
                      disabled={!hasChild}>
                      <ExpandMoreIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div style={{ position: 'relative', margin: '5px' }}>
          <Divider />
        </div>

        <Grid container>
          <Grid item xs={12}>
            <Button
              style={{ width: "100%", background: "#e0e0e0", color: "#3c3c3c", display: "flex", justifyContent: "center", border: "none" }}
              onClick={() => {
                setEditIndex(null);
                setData(null);
                setIsOpenRuleModal(true);
              }}>
              Add
            </Button>

            <PremiumRuleDesignModal
              openDialog={isOpenRuleModal}
              setOpenDialog={setIsOpenRuleModal}
              forProductRule={ruleList[selectedRow]}
              parameters={forBenefit.parameters}
              paymentFrequencies={paymentFrequencies}
              onAdd={onRuleAdd}

              // data={editIndex && ruleList[selectedRow]?.premiumRules}
              data={data}
              editIndex={editIndex}
              onExitClick={onExitClick}></PremiumRuleDesignModal>
          </Grid>
          <Grid item xs={12}>
            <PremiumRuleTable
              ruleList={ruleList[selectedRow]?.premiumRules}
              onClickEdit={onClickEdit}
              setEditIndex={setEditIndex} forBenefit={undefined} handleEdit={undefined}></PremiumRuleTable>
          </Grid>
        </Grid>
      </>
    );
  } else {
    response = (
      <Box alignItems="center" justifyContent="center" display="flex" width="100%" height="100%">
        <span>No records are available</span>
      </Box>
    );
  }


  return response;
}
