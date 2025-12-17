import React from 'react'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    TextField,
    Box
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { StatefulTargetBox as TargetBox } from '../targetbox'

interface PremiumRulesTableProps {
    rows: any[]
    quotationDetails: any
    onDrop: (row: any, ruleObj: any) => void
    onRemovePremiumRule: (parentId: number, index: number) => void
    onHeadCountChange: (e: any, rowIdx: number) => void
    classes: any
}

export const PremiumRulesTable: React.FC<PremiumRulesTableProps> = ({
    rows,
    quotationDetails,
    onDrop,
    onRemovePremiumRule,
    onHeadCountChange,
    classes
}) => {
    return (
        <>
            {rows.map((row, idx) => (
                <TargetBox key={`row${idx}`} onDrop={(data: any) => onDrop(row, data)}>
                    <Accordion elevation={0} style={{ width: '100% !important' }}>
                        <AccordionSummary
                            className={classes.AccordionSummary}
                            expandIcon={<ExpandMoreIcon color='primary' />}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: '15%', padding: '4px' }}>{row.categoryName}</TableCell>
                                        <TableCell style={{ width: '25%', padding: '4px' }}>Premium Rule</TableCell>
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
                                    <TableRow hover>
                                        <TableCell style={{ width: '15%', padding: '4px' }}>{row.categoryName}</TableCell>
                                        <TableCell style={{ width: '25%', padding: '4px' }}>
                                            {row.premiumRules.map((p: any, i: number) => (
                                                <div key={p.name} className={classes.ruleContainer}>
                                                    <span className={classes.lineEllipsis}>{p.name}</span>
                                                    <IconButton
                                                        color='secondary'
                                                        aria-label='remove'
                                                        onClick={() => onRemovePremiumRule(idx, i)}
                                                    >
                                                        <RemoveCircleIcon style={{ color: '#dc3545' }} />
                                                    </IconButton>
                                                </div>
                                            ))}
                                        </TableCell>
                                        <TableCell style={{ width: '20%', padding: '4px' }}>
                                            {row.premiumRules.map((p: any) => (
                                                <Typography key={p.name}>{p.premiumAmount}</Typography>
                                            ))}
                                        </TableCell>
                                        <TableCell style={{ width: '20%', padding: '4px' }}>
                                            <Box>
                                                {quotationDetails.memberUploadStatus ? (
                                                    <span>{row.headCount}</span>
                                                ) : row.premiumRules.length > 0 ? (
                                                    <TextField
                                                        fullWidth
                                                        name='headCount'
                                                        value={row.headCount}
                                                        onChange={e => onHeadCountChange(e, idx)}
                                                        inputProps={{
                                                            style: { textAlign: 'right' },
                                                            readOnly: true
                                                        }}
                                                    />
                                                ) : null}
                                            </Box>
                                        </TableCell>
                                        <TableCell style={{ width: '20%', padding: '4px' }} align='right'>
                                            <div>{row?.premiumRules[0]?.sumOfPremium?.toFixed(2) || '0.00'}</div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </AccordionDetails>
                    </Accordion>
                </TargetBox>
            ))}
        </>
    )
}
