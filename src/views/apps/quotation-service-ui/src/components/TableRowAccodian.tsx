import React, { useState } from "react";


import { Accordion, AccordionDetails, AccordionSummary, IconButton, TableCell, Tooltip, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";

import { StatefulTargetBox as TargetBox } from './targetbox';

const TableRowAccordion = ({ row, idx }:{ row:any, idx:any }) => {
  const [expanded, setExpanded] = useState(true);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  function handleDrop(row: any, data: any) {
    
  }

  function removePremuimRule(idx: any, i: any): void {
    throw new Error("Function not implemented.");
  }

  const HtmlTooltip = withStyles((theme:any) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme?.typography?.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);

  return (
    <Accordion expanded={expanded} onChange={handleChange}>
      <AccordionSummary>
        <span>{row.categoryName}</span>
      </AccordionSummary>
      <AccordionDetails>
        <TargetBox
          key={`row${idx}`}
          onDrop={(data:any) => handleDrop(row, data)}
        >
          <TableCell component="th" scope="row">
            {row.categoryName}
          </TableCell>
          <TableCell align="center">
            {row.premiumRules.map((p:any, i:any) => (
              <HtmlTooltip
                key={p.ruleName}
                disableHoverListener={false}
                disableFocusListener
                disableTouchListener
                title={
                  <React.Fragment>
                    <Typography color="inherit">{p.expression}</Typography>
                  </React.Fragment>
                }>
                <div>
                  <div
                    key={p.ruleName}

                    // className={classes.ruleContainer}
                    >
                    <span 

                    // className={classes.lineEllipsis}
                    >{p.expression}</span>
                    <span>
                      <IconButton color="secondary" aria-label="remove" onClick={() => removePremuimRule(idx, i)}>
                        {/* <RemoveCircleIcon style={{color:"#dc3545"}}/> */}
                      </IconButton>
                    </span>
                  </div>
                </div>
              </HtmlTooltip>
            ))}
          </TableCell>
          <TableCell align="right">
            {row.premiumRules.map((p:any) => (
              <div
                key={p.ruleName}
                style={{
                  padding: '5px 0',
                }}>
                {p.premiumAmount}
              </div>
            ))}
          </TableCell>
          {/* <TableCell align="right">
            <div key={row.categoryName}>
              {quotationDetails.memberUploadStatus && <span>{row.headCount}</span>}
              {!quotationDetails.memberUploadStatus && row.premiumRules.length > 0 && !memberUpload &&
                <TextField
                  name="headCount"
                  value={row.headCount}
                  onChange={()=>{}}
                  inputProps={{
                    style: { textAlign: 'right' },
                  }}
                />
              }
            </div>
          </TableCell> */}
          <TableCell align="right">
            <div style={{
              padding: '5px 0',
            }}>
              {row?.premiumRules[0]?.sumOfPremium}
            </div>
          </TableCell>
          <TableCell align="right">
            {row.premiumRules.map((p:any) => (
              <div
                key={p.ruleName}
                style={{
                }}>

              </div>
            ))}
          </TableCell>
        </TargetBox>
      </AccordionDetails>
    </Accordion>
  );
};

export default TableRowAccordion
