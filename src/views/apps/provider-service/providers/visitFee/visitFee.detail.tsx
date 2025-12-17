import React, { useState } from 'react'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Grid,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
// import DateFnsUtils from '@date-io/date-fns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { makeStyles } from '@mui/styles'
import { Button } from 'primereact/button'

const useStyles = makeStyles((theme: any) => ({
  AccordionSummary: {
    backgroundColor: theme?.palette?.background?.default
  }
}))

const searchByOptions = [
  {
    value: 1,
    label: 'CLAIM RECEIVE DATE'
  },
  {
    value: 2,
    label: 'BATCH NUMBER'
  },
  {
    value: 3,
    label: 'MEMBERSHIP NO'
  },
  {
    value: 4,
    label: 'PROVIDER'
  }
]

const claimCategoryOptions = [
  {
    value: 1,
    label: 'ALL'
  },
  {
    value: 2,
    label: 'REGULAR'
  },
  {
    value: 3,
    label: 'E_CLAIM'
  }
]

const auditTypeOptions = [
  {
    value: 1,
    label: 'NORMAL'
  },
  {
    value: 2,
    label: 'INDEMNITY'
  }
]

const auditStatusOptions = [
  {
    value: 1,
    label: 'NEW'
  },
  {
    value: 2,
    label: 'FAILED'
  }
]

const payeeOptions = [
  {
    value: 1,
    label: 'PROVIDER'
  },
  {
    value: 2,
    label: 'MEMBER'
  },
  {
    value: 3,
    label: 'NOMINEE'
  },
  {
    value: 4,
    label: 'CORPORATE'
  },
  {
    value: 5,
    label: 'BROKER'
  },
  {
    value: 6,
    label: 'INSURER'
  }
]

const TypographyStyle2: any = {
  fontSize: '13px',
  fontWeight: '500',
  alignItems: 'end',
  display: 'flex',
  textTransform: 'capitalize',
  width: '150px',
  marginLeft: '10px',
  opacity: '0.65'
}

const TypographyStyle1: any = {
  fontSize: '16px',
  fontWeight: '700',
  textTransform: 'capitalize',
  opacity: '0.75'
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder'
]

const VisitFeeForm = () => {
  const [expanded, setExpanded]: any = useState(false)
  const [searchBy, setSearchBy] = useState()
  const [claimCategory, setClaimCategory] = useState()
  const [auditType, setAuditType]: any = useState([])
  const [auditStatus, setAuditStatus] = useState()
  const [payee, setPayee] = useState()
  const [claimDateFrom, setClaimDateFrom] = useState()
  const [claimDateTo, setClaimDateTo] = useState()
  const theme = useTheme()
  const [personName, setPersonName] = React.useState([])
  const classes = useStyles()

  const handleChange1 = (event: any) => {
    const {
      target: { value }
    } = event

    setAuditType(

      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    )
  }

  const handleChange = (panel: any) => (event: any, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <>
      <Accordion
        style={{ margin: '10px 0', borderRadius: '10px' }}
        expanded={expanded === 'panel1' || !expanded}

        // onChange={handleChange('panel1')}
      >
        <AccordionSummary
          className={classes.AccordionSummary}
          expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
          aria-controls='panel1bh-content'
          id='panel1bh-header'
          onClick={() => {
            setExpanded(!expanded)
          }}
          style={{ borderRadius: '10px 10px 0 0' }}
        >
          <Typography>Visit Fee</Typography>
        </AccordionSummary>
        <AccordionDetails style={{ display: 'block' }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box display={'flex'} marginY={'10px'} marginX={'3%'}>
                <Typography style={TypographyStyle1}>Corporate</Typography>&nbsp;
                <span>:</span>&nbsp;
                <Select
                  label='Corporate'
                  name='corporate'
                  value={searchBy}
                  onChange={(e: any) => {
                    setSearchBy(e.target.value)
                  }}
                  inputProps={{ 'aria-label': 'Without label' }}
                  style={TypographyStyle2}
                >
                  {searchByOptions.map(ele => {
                    return <MenuItem key={ele.value} value={ele.value}>{ele.label}</MenuItem>
                  })}
                </Select>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display={'flex'} marginY={'10px'} marginX={'3%'}>
                <Typography style={TypographyStyle1}>Provider</Typography>&nbsp;
                <span>:</span>&nbsp;
                <Select
                  labelId='demo-multiple-checkbox-label'
                  label='Provider'
                  id='demo-multiple-checkbox'
                  multiple
                  value={auditType}
                  onChange={handleChange1}

                  // input={<OutlinedInput label="Tag" />}
                  renderValue={selected => selected.join(', ')}
                  MenuProps={MenuProps}
                  style={{ width: '200px' }}
                >
                  {payeeOptions.map((ele: any) => (
                    <MenuItem key={ele.label} value={ele.label}>
                      <Checkbox checked={auditType.indexOf(ele.label) > -1} />
                      <ListItemText primary={ele.label} />
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display={'flex'} marginY={'10px'} marginX={'3%'}>
                <Typography style={TypographyStyle1}>Provider Category</Typography>&nbsp;
                <span>:</span>&nbsp;
                <Select
                  name='providerCategory'
                  label='Provider Category'
                  value={claimCategory}
                  onChange={(e: any) => {
                    setClaimCategory(e.target.value)
                  }}
                  inputProps={{ 'aria-label': 'Without label' }}
                  style={TypographyStyle2}
                >
                  {claimCategoryOptions.map(ele => {
                    return <MenuItem key={ele.value} value={ele.value}>{ele.label}</MenuItem>
                  })}
                </Select>
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box display={'flex'} marginY={'10px'} marginX={'3%'}>
                <Typography
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '16px',
                    fontWeight: '700',
                    textTransform: 'capitalize',
                    opacity: '0.75'
                  }}
                >
                  Valid From
                </Typography>
                &nbsp;
                <span style={{ display: 'flex', alignItems: 'center' }}>:</span>&nbsp;
                <Box style={{ marginBottom: '10px', opacity: '0.65' }}>
                  {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      views={['year', 'month', 'date']}
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      autoOk={true}
                      id="date-picker-inline"
                      // value={selectedEnumerationdate}
                      // onChange={handleEnumerationDateChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change ing date',
                      }}
                    />
                  </MuiPickersUtilsProvider> */}
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      views={['year', 'month', 'day']}

                      // value={selectedEnumerationdate}
                      // onChange={handleEnumerationDateChange}
                      renderInput={params => (
                        <TextField {...params} margin='normal' style={{ width: '75%' }} variant='outlined' />
                      )}
                      onChange={function (value: unknown, keyboardInputValue?: string | undefined): void {
                        throw new Error('Function not implemented.')
                      }}
                      value={undefined}
                    />
                  </LocalizationProvider>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display={'flex'} marginY={'10px'} marginX={'3%'}>
                <Typography
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '16px',
                    fontWeight: '700',
                    textTransform: 'capitalize',
                    opacity: '0.75'
                  }}
                >
                  Valid To
                </Typography>
                &nbsp;
                <span style={{ display: 'flex', alignItems: 'center' }}>:</span>&nbsp;
                <Box style={{ marginBottom: '10px', opacity: '0.65' }}>
                  {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      views={['year', 'month', 'date']}
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      autoOk={true}
                      id="date-picker-inline"
                      // value={selectedEnumerationdate}
                      // onChange={handleEnumerationDateChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change ing date',
                      }}
                    />
                  </MuiPickersUtilsProvider> */}
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      views={['year', 'month', 'day']}

                      // value={selectedEnumerationdate}
                      // onChange={handleEnumerationDateChange}
                      renderInput={params => (
                        <TextField {...params} margin='normal' style={{ width: '75%' }} variant='outlined' />
                      )}
                      onChange={function (value: unknown, keyboardInputValue?: string | undefined): void {
                        throw new Error('Function not implemented.')
                      }}
                      value={undefined}
                    />
                  </LocalizationProvider>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box display={'flex'} marginY={'10px'} marginX={'3%'}>
                <Typography style={TypographyStyle1}>Category</Typography>&nbsp;
                <span>:</span>&nbsp;
                <Select
                  name='category'
                  label='Category'
                  value={payee}
                  onChange={(e: any) => {
                    setPayee(e.target.value)
                  }}
                  inputProps={{ 'aria-label': 'Without label' }}
                  style={TypographyStyle2}
                >
                  {payeeOptions.map(ele => {
                    return <MenuItem key={ele.value} value={ele.value}>{ele.label}</MenuItem>
                  })}
                </Select>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display={'flex'} marginY={'10px'} marginX={'3%'}>
                <Typography
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    textTransform: 'capitalize',
                    display: 'flex',
                    alignItems: 'flex-end',
                    opacity: '0.75'
                  }}
                >
                  Visit Fee
                </Typography>
                &nbsp;
                <span style={{ display: 'flex', alignItems: 'flex-end' }}>:</span>&nbsp;
                <TextField id='membership-no' name='visitFee' onChange={() => {}} label='' style={TypographyStyle2} />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display={'flex'} marginY={'10px'} marginX={'3%'}>
                <Typography style={TypographyStyle1}>Product</Typography>&nbsp;
                <span>:</span>&nbsp;
                <Select
                  name='product'
                  label='Product'
                  value={auditStatus}
                  onChange={(e: any) => {
                    setAuditStatus(e.target.value)
                  }}
                  inputProps={{ 'aria-label': 'Without label' }}
                  style={TypographyStyle2}
                >
                  {auditStatusOptions.map(ele => {
                    return <MenuItem key={ele.value} value={ele.value}>{ele.label}</MenuItem>
                  })}
                </Select>
              </Box>
            </Grid>
          </Grid>
          <Box marginY={'3%'} marginX={'1%'}>
            <Button
              style={{ background: theme?.palette?.primary?.main || '#D80E51', color: theme.palette.common.white }}
              onClick={() => {
                setExpanded(false)
              }}
            >
              Submit
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  )
}

export default VisitFeeForm
