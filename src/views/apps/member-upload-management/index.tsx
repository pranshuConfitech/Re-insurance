'use client'
import React, { useEffect } from 'react'

import { Chip, Snackbar } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import Checkbox from '@mui/material/Checkbox'

// import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Alert } from '@mui/lab'
import Autocomplete from '@mui/lab/Autocomplete'

import { MemberService } from '@/services/remote-api/api/member-services'

const memupservice = new MemberService()

// const currencyservice = new CurrencyService();

// let cs$ = currencyservice.getCurrencies();
const md$ = memupservice.getMemberDetails()
const datasrc$ = memupservice.geAPIList()

const useStyles = makeStyles((theme: any) => ({
  input1: {
    width: '50%'
  },
  clientTypeRadioGroup: {
    flexWrap: 'nowrap',
    '& label': {
      flexDirection: 'row'
    }
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  },
  formControl: {
    minWidth: 182
  },
  formControl1: {
    minWidth: 300
  },
  heading: {
    fontSize: theme?.typography?.pxToRem(15),

    // flexBasis: '33.33%',
    flexShrink: 0,
    fontWeight: 700
  },
  secondaryHeading: {
    fontSize: theme?.typography?.pxToRem(15),
    color: theme?.palette?.text?.secondary
  }
}))

export default function MemberUploadComponent(props: any) {
  const classes = useStyles()
  const [fieldList, setFieldList] = React.useState([])

  // const [renderTypeList, setRenderTypeList] = React.useState([]);
  // const [datatypeList, setDataTypeList] = React.useState([]);
  // const [currencyList, setCurrencyList] = React.useState([]);
  // const [AlertMsg, setAlertMsg] = React.useState('');
  const [snack, setSnack] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    msg: ''
  })

  const [snack1, setSnack1] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    msg: ''
  })

  const [sourceList, setSourceList] = React.useState([])
  const [selectedFieldlist, setSelectedFieldlist]: any = React.useState([])

  // const [fieldOptions, setFieldOptions] = React.useState([]);
  const [expanded, setExpanded] = React.useState('panel1')
  const [memberDetailList, setMemberDetailsList] = React.useState([])
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

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  const useObservable1 = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        if (result.content && result.content.length > 0) {
          result.content.forEach((ele: any) => {
            ele['isMandatory'] = false
            ele['isUnique'] = false
            ele['errorCode'] = ''
            ele['errorMessage'] = ''
            ele['customValues'] = []
            ele['sourceApiId'] = ''
            ele['sourceType'] = ''

            if (ele.dataType !== 'CURRENCY' && ele.dataType !== 'DATE') {
              ele['isDropdown'] = true
            }

            if (ele.dataType === 'CURRENCY' || ele.dataType === 'DATE') {
              ele['isDropdown'] = false
            }
          })
        }

        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  // useObservable(cs$, setCurrencyList);
  useObservable1(md$, setMemberDetailsList)
  useObservable(datasrc$, setSourceList)

  const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setSnack({
      open: false,
      vertical: 'top',
      horizontal: 'right',
      msg: ''
    })
  }

  const handleSnack1Close = (event: React.SyntheticEvent | Event, reason?: string) => {
    setSnack1({
      open: false,
      vertical: 'top',
      horizontal: 'right',
      msg: ''
    })
  }

  const handleField = (e: any, index: number) => {
    const { name, value } = e.target

    const list: any = [...fieldList]

    list[index][name] = value

    setFieldList(list)
  }

  const handleFieldChecked = (e: any, index: number) => {
    const { name, checked } = e.target
    const list: any = [...fieldList]

    if (name === 'isDropdown' && !checked) {
      list[index]['sourceType'] = ''
      list[index]['sourceApiId'] = ''
      list[index]['customValues'] = []
    }

    list[index][name] = checked

    setFieldList(list)
  }

  const handleAddChip = (chip: any, i: number) => {
    const list: any = [...fieldList]

    list[i].customValues.push(chip)
    setFieldList(list)
  }

  const handleDeleteChip = (chip: any, index: number, i: number) => {
    const list: any = [...fieldList]

    list[i].customValues.splice(index, 1)
    setFieldList(list)
  }

  const saveConfigurations = () => {
    // const fields: any = []
    // const rules: any = []
    // let allOK = true

    // fieldList.forEach((val: any, index: number) => {
    //   //Validation
    //   if (val.isDropdown) {
    //     if (val.sourceType === '') {
    //       setSnack({
    //         open: true,
    //         vertical: 'top',
    //         horizontal: 'right',
    //         msg: 'Please choose a source type'
    //       })
    //       allOK = false

    //       return
    //     }

    //     if (val.sourceType === 'DYNAMIC' && val.sourceApiId === '') {
    //       setSnack({
    //         open: true,
    //         vertical: 'top',
    //         horizontal: 'right',
    //         msg: 'Please choose a source api'
    //       })
    //       allOK = false

    //       return
    //     }

    //     if (val.sourceType === 'CUSTOM' && val.customValues.length === 0) {
    //       setSnack({
    //         open: true,
    //         vertical: 'top',
    //         horizontal: 'right',
    //         msg: 'Please enter custom datas'
    //       })
    //       allOK = false
    //     }
    //   }

    //   if (val.formattingAllowed && !val.format) {
    //     setSnack({
    //       open: true,
    //       vertical: 'top',
    //       horizontal: 'right',
    //       msg: 'Please choose a format'
    //     })
    //     allOK = false
    //   }

    //   //Payload

    //   const obj: any = {
    //     name: val['columnName'],
    //     required: val['isMandatory'],
    //     dataType: val['dataType'],
    //     systemGenerated: val['systemGenerated']
    //   }

    //   if (val.formattingAllowed) {
    //     obj['format'] = val['format']
    //   }

    //   if (!val.formattingAllowed) {
    //     obj['format'] = ''
    //   }

    //   if (val.sourceType === 'DYNAMIC') {
    //     obj['sourceApiId'] = val['sourceApiId']
    //     obj['customValues'] = []
    //   } else if (val.sourceType === 'CUSTOM') {
    //     obj['customValues'] = val['customValues']
    //     obj['sourceApiId'] = ''
    //   } else {
    //     obj['sourceApiId'] = ''
    //     obj['customValues'] = []
    //   }

    //   fields.push(obj)

    //   if (val.isUnique) {
    //     rules.push({
    //       rule: '$(member_field_value_not_exist.' + val.columnName + ') == true',
    //       name: val.columnName,
    //       errorCode: val.errorCode,
    //       errorMessage: val.errorMessage
    //     })
    //   }
    // })

    // const payload = {
    //   fields: fields,
    //   rules: rules,
    //   stopIfFirstRuleFail: true,
    //   headerRowNum: 0,
    //   startDataRowNum: 1
    // }

    // if (allOK) {
    //   memupservice.saveMemberConfigs(payload).subscribe(res => {
    //     setSnack1({
    //       open: true,
    //       vertical: 'top',
    //       horizontal: 'right',
    //       msg: 'Member Upload Configuration saved successfully'
    //     })
    //   })
    // }
  }

  // const onDragEnd = (data) => {
  //     setFieldList(data);
  // }
  const handleAccordianToggle = (panel: any) => (event: React.SyntheticEvent | Event, isExpanded: any) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleFieldList = (event: any) => {
    setSelectedFieldlist(event.target.value)
  }

  const addFields = (event: any) => {
    setFieldList(selectedFieldlist)
  }

  return (
    <div>
      <Paper
        elevation={0}
        style={{
          height: '50px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <h2 style={{ marginLeft: '13px' }}>Member Upload Configuration</h2>
      </Paper>
      <Snackbar open={snack.open} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity='error'>
          {snack.msg}
        </Alert>
      </Snackbar>
      <Snackbar open={snack1.open} autoHideDuration={6000} onClose={handleSnack1Close}>
        <Alert onClose={handleSnack1Close} severity='success'>
          {snack1.msg}
        </Alert>
      </Snackbar>
      <Paper elevation={0}>
        <Box p={3} my={2}>
          {/* <Grid container spacing={3} style={{ marginBottom: "20px" }}>
                    <Button color="primary" variant="contained" onClick={addNewField}>+ Add New Entry</Button>
                </Grid> */}

          <Grid item xs={12} style={{ marginBottom: '10px' }}>
            <FormControl className={classes.formControl1}>
              <InputLabel id='demo-mutiple-checkbox-label'>Selected Member configurations </InputLabel>
              <Select
                labelId='demo-mutiple-checkbox-label'
                label='Selected Member configurations'
                id='demo-mutiple-checkbox'
                multiple
                name='selectedFieldlist'
                value={selectedFieldlist ? selectedFieldlist : []}
                onChange={handleFieldList}
                input={<Input />}
                renderValue={selected => {
                  const a: any = []

                  selected.forEach((el: any) => {
                    a.push(el.alias + ', ')
                  })

                  // a.join(', ')
                  return a
                }}
                MenuProps={MenuProps}
              >
                {memberDetailList.map((ele: any) => (
                  <MenuItem key={ele.id} value={ele}>
                    <Checkbox color='primary' checked={selectedFieldlist && selectedFieldlist.indexOf(ele) > -1} />
                    <ListItemText primary={ele.alias} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button style={{ marginLeft: '25px' }} color='primary' onClick={addFields}>
              Select
            </Button>
          </Grid>

          <>
            {fieldList.map((x: any, i: number) => {
              return (
                <Accordion
                  key={`Accordian - ${i}`}
                  expanded={expanded === 'panel' + (i + 1).toString()}
                  onChange={handleAccordianToggle('panel' + (i + 1).toString())}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1bh-content'
                    id='panel1bh-header'
                  >
                    <Typography className={classes.heading}>{x.alias}</Typography>
                    <Tooltip title={x.info} placement='top'>
                      <InfoOutlinedIcon
                        style={{
                          fontSize: 'medium',
                          marginTop: '3px',
                          marginLeft: '5px'
                        }}
                      />
                    </Tooltip>
                    <Typography className={classes.secondaryHeading} />
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <div id={x.id}>
                        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                          <Grid item xs={12} container spacing={3} style={{ marginBottom: '20px' }}>
                            {/* DROPDOWN */}
                            {x.isDropdown && (
                              <>
                                <Grid item xs={2}>
                                  <TextField
                                    id='standard-basic'
                                    name='columnName'
                                    value={x.columnName}
                                    onChange={e => handleField(e, i)}
                                    label='Column name'
                                    disabled={true}
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={x.isDropdown}
                                        onChange={e => handleFieldChecked(e, i)}
                                        name='isDropdown'
                                        color='primary'
                                      />
                                    }
                                    label='is Dropdown'
                                  />
                                </Grid>

                                <Grid item xs={2}>
                                  <TextField
                                    id='standard-basic'
                                    name='dataType'
                                    value={x.dataType}
                                    onChange={e => handleField(e, i)}
                                    label='Data Type'
                                    disabled={true}
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={x.isMandatory}
                                        onChange={e => handleFieldChecked(e, i)}
                                        name='isMandatory'
                                        color='primary'
                                      />
                                    }
                                    label='is Mandatory'
                                  />
                                </Grid>

                                <Grid item xs={2}>
                                  <FormControl className={classes.formControl}>
                                    <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                      Source type
                                    </InputLabel>
                                    <Select
                                      labelId='demo-simple-select-label'
                                      label='Source type'
                                      id='demo-simple-select'
                                      name='sourceType'
                                      value={x.sourceType}
                                      onChange={e => handleField(e, i)}
                                    >
                                      {x.dataType === 'STRING' && <MenuItem value='CUSTOM'>CUSTOM</MenuItem>}
                                      <MenuItem value='DYNAMIC'>DYNAMIC</MenuItem>
                                    </Select>
                                  </FormControl>

                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={x.isUnique}
                                        onChange={e => handleFieldChecked(e, i)}
                                        name='isUnique'
                                        color='primary'
                                      />
                                    }
                                    label='Unique Column'
                                  />
                                </Grid>
                                {x.isUnique && (
                                  <>
                                    <Grid item xs={2}>
                                      <TextField
                                        id='standard-basic'
                                        name='errorCode'
                                        value={x.errorCode}
                                        onChange={e => handleField(e, i)}
                                        label='Error Code'
                                      />
                                    </Grid>
                                    <Grid item xs={2}>
                                      <TextField
                                        id='standard-basic'
                                        name='errorMessage'
                                        value={x.errorMessage}
                                        onChange={e => handleField(e, i)}
                                        label='Error Message'
                                      />
                                    </Grid>
                                  </>
                                )}

                                {x.sourceType === 'DYNAMIC' && (
                                  <Grid item xs={2}>
                                    <FormControl className={classes.formControl}>
                                      <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                        Data Source
                                      </InputLabel>
                                      <Select
                                        labelId='demo-simple-select-label'
                                        id='demo-simple-select'
                                        label='Data Source'
                                        name='sourceApiId'
                                        value={x.sourceApiId}
                                        onChange={e => handleField(e, i)}
                                      >
                                        {sourceList.map((ele: any) => {
                                          return (
                                            <MenuItem
                                              key={ele.id}
                                              value={ele.id}
                                              disabled={ele.response.responseType !== x.dataType}
                                            >
                                              {ele.alias}
                                            </MenuItem>
                                          )
                                        })}
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                )}

                                {x.sourceType === 'CUSTOM' && (
                                  // <ChipInput
                                  //   required
                                  //   // error={touched.parameterValues && Boolean(errors.parameterValues)}
                                  //   // helperText={touched.parameterValues && errors.parameterValues}
                                  //   label="Static Data"
                                  //   value={x.customValues}
                                  //   onAdd={(chip:any) => handleAddChip(chip, i)}
                                  //   onDelete={(chip:any, index:number) => handleDeleteChip(chip, index, i)}
                                  // />
                                  <Autocomplete
                                    multiple
                                    freeSolo
                                    options={fieldList}
                                    value={x.customValues}
                                    onChange={(event, newValue) => {
                                      const list: any = [...fieldList]

                                      list[i].customValues = newValue
                                      setFieldList(list)
                                    }}
                                    renderTags={(value, getTagProps) =>
                                      value.map((option: any, index: number) => {
                                        const { key, ...tagProps } = getTagProps({ index }) // Extract key explicitly

                                        return <Chip key={key} label={option} {...tagProps} />
                                      })
                                    }
                                    renderInput={params => <TextField required {...params} label='Static Data' />}
                                  />

                                  // <Select
                                  //   labelId="chip-select-label"
                                  //   multiple
                                  //   value={x.customValues}
                                  //   onChange={(e) => handleAddChip(e.target.value, i)}
                                  //   renderValue={(selected) => (
                                  //     <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                  //       {(selected as string[]).map((value,index) => (
                                  //         <Chip
                                  //           key={value}
                                  //           label={value}
                                  //           onDelete={() => handleDeleteChip(value,index, i)}
                                  //         />
                                  //       ))}
                                  //     </div>
                                  //   )}
                                  // >
                                  //   {x.customValues.map((value:any, index:number) => (
                                  //     <MenuItem key={value} value={value}>
                                  //     {value}
                                  //     </MenuItem>
                                  //     ))}
                                  // </Select>
                                )}
                              </>
                            )}
                            {!x.isDropdown && (
                              <>
                                <Grid item xs={3}>
                                  <TextField
                                    id='standard-basic'
                                    name='columnName'
                                    value={x.columnName}
                                    onChange={e => handleField(e, i)}
                                    label='Column name'
                                    disabled={true}
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={x.isDropdown}
                                        onChange={e => handleFieldChecked(e, i)}
                                        name='isDropdown'
                                        color='primary'
                                      />
                                    }
                                    label='is Dropdown'
                                  />
                                </Grid>

                                <Grid item xs={3}>
                                  <TextField
                                    id='standard-basic'
                                    name='dataType'
                                    value={x.dataType}
                                    onChange={e => handleField(e, i)}
                                    label='Data Type'
                                    disabled={true}
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={x.isMandatory}
                                        onChange={e => handleFieldChecked(e, i)}
                                        name='isMandatory'
                                        color='primary'
                                      />
                                    }
                                    label='is Mandatory'
                                  />
                                </Grid>
                              </>
                            )}

                            {x.formattingAllowed && x.dataType === 'CURRENCY' && (
                              <Grid item xs={2}>
                                <FormControl className={classes.formControl}>
                                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                    Currency format
                                  </InputLabel>
                                  <Select
                                    labelId='demo-simple-select-label'
                                    label='Currency format'
                                    id='demo-simple-select'
                                    name='format'
                                    value={x.format}
                                    onChange={e => handleField(e, i)}
                                  >
                                    <MenuItem value='XX,XX,XXX'>XX,XX,XXX</MenuItem>
                                    <MenuItem value='XXX,XXX,XXX'>XXX,XXX,XXX</MenuItem>
                                    {/* {currencyList.map((ele) => {
                                                                        return <MenuItem value={ele.locale}>{ele.name}</MenuItem>;
                                                                    })} */}
                                  </Select>
                                </FormControl>
                              </Grid>
                            )}
                            {x.formattingAllowed && x.dataType === 'DATE' && (
                              <Grid item xs={2}>
                                <FormControl className={classes.formControl}>
                                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                    Date format
                                  </InputLabel>
                                  <Select
                                    labelId='demo-simple-select-label'
                                    label='Date format'
                                    id='demo-simple-select'
                                    name='format'
                                    value={x.format}
                                    onChange={e => handleField(e, i)}
                                  >
                                    <MenuItem value='dd/mm/yyyy'>dd/mm/yyyy</MenuItem>
                                    <MenuItem value='mm/dd/yyyy'>mm/dd/yyyy</MenuItem>
                                    <MenuItem value='yyyy/mm/dd'>yyyy/mm/dd</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                            )}

                            {!x.isDropdown && (
                              <>
                                {/* {x.sourceType === 'CURRENCY' && (
                                                      <Grid item xs={2}>
                                                      <FormControl className={classes.formControl}>
                                                          <InputLabel
                                                              id="demo-simple-select-label"
                                                              style={{ marginBottom: "0px" }}
                                                          >
                                                              Currency format
                                                          </InputLabel>
                                                          <Select
                                                              labelId="demo-simple-select-label"
                                                              id="demo-simple-select"
                                                              name="currencyFormat"
                                                              value={x.currencyFormat}
                                                              onChange={(e) => handleField(e, i)}
                                                          >
                                                             <MenuItem value="XX,XX,XXX">XX,XX,XXX</MenuItem>
                                                            <MenuItem value="X,XXX,XXX">X,XXX,XXX</MenuItem>
                                                                
                                                          </Select>
                                                      </FormControl>
                                                  </Grid>  
                                                    )} */}
                                {/* {x.dataType === 'Currency' && 
                                                     <Grid item xs={2}>
                                                     <FormControl className={classes.formControl}>
                                                             <InputLabel
                                                                 id="demo-simple-select-label"
                                                                 style={{ marginBottom: "0px" }}
                                                             >
                                                                 Currency format
                                                     </InputLabel>
                                                             <Select
                                                                 labelId="demo-simple-select-label"
                                                                 id="demo-simple-select"
                                                                 name="currformat"
                                                                 value={x.dataType}
                                                                 onChange={(e) => handleField(e, i)}
                                                             >
                                                                
                                                                 <MenuItem value="1">xx,xx,xxx</MenuItem>
                                                             </Select>
                                                         </FormControl>
                                                     </Grid>
                                                    
                                                    } */}

                                {/* <Grid item xs={2}>
                                                                    {x.isMaxLength &&
                                                                        <TextField
                                                                            id="standard-basic"
                                                                            name="maxLength"
                                                                            value={x.maxLength}
                                                                            disabled={x.isFixedLength || x.isFixedValue}
                                                                            onChange={(e) => handleField(e, i)}
                                                                            label="Max Length"
                                                                        />}
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                checked={x.isMaxLength}
                                                                                onChange={(e) => handleFieldChecked(e, i)}
                                                                                name="isMaxLength"
                                                                                disabled={x.isFixedLength || x.isFixedValue}
                                                                                color="primary"
                                                                            />
                                                                        }
                                                                        label="has max length"
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={2}>
                                                                    {x.isFixedLength &&
                                                                        <TextField
                                                                            id="standard-basic"
                                                                            name="fixedLength"
                                                                            value={x.fixedLength}
                                                                            disabled={x.isMaxLength || x.isFixedValue}
                                                                            onChange={(e) => handleField(e, i)}
                                                                            label="Fixed Length"
                                                                        />}
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                checked={x.isFixedLength}
                                                                                onChange={(e) => handleFieldChecked(e, i)}
                                                                                name="isFixedLength"
                                                                                disabled={x.isMaxLength || x.isFixedValue}
                                                                                color="primary"
                                                                            />
                                                                        }
                                                                        label="has fixed length"
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={2}>
                                                                    {x.isFixedValue &&
                                                                        <TextField
                                                                            id="standard-basic"
                                                                            name="fixedValue"
                                                                            value={x.fixedValue}
                                                                            onChange={(e) => handleField(e, i)}
                                                                            label="Fixed Value"
                                                                        />}
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                checked={x.isFixedValue}
                                                                                onChange={(e) => handleFieldChecked(e, i)}
                                                                                name="isFixedValue"
                                                                                color="primary"
                                                                            />
                                                                        }
                                                                        label="has fixed value"
                                                                    />
                                                                </Grid>
                                                                 */}

                                <Grid item xs={3} style={{ marginLeft: '25px' }}>
                                  {x.isUnique && (
                                    <TextField
                                      id='standard-basic'
                                      name='errorCode'
                                      value={x.errorCode}
                                      onChange={e => handleField(e, i)}
                                      label='Error code'
                                    />
                                  )}
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={x.isUnique}
                                        onChange={e => handleFieldChecked(e, i)}
                                        name='isUnique'
                                        color='primary'
                                      />
                                    }
                                    label='Unique Column'
                                  />
                                </Grid>
                                {x.isUnique && (
                                  <Grid item xs={2}>
                                    <TextField
                                      id='standard-basic'
                                      name='errorMessage'
                                      value={x.errorMessage}
                                      onChange={e => handleField(e, i)}
                                      label='Error message'
                                    />
                                  </Grid>
                                )}
                              </>
                            )}
                          </Grid>

                          <Divider style={{ marginBottom: '20px' }} />
                        </Grid>
                      </div>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )
            })}
          </>
          {/* </FettleDragNDrop> */}
          <Grid container spacing={3} style={{ marginTop: '20px' }}>
            {fieldList.length !== 0 && (
              <Button color='primary' onClick={saveConfigurations}>
                Save Configurations
              </Button>
            )}
          </Grid>
        </Box>
      </Paper>
    </div>
  )
}
