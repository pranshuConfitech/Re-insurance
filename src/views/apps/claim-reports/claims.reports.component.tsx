'use client'
import React, { useEffect } from 'react'

import Box from '@mui/material/Box'
import { Button } from '@mui/material'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Autocomplete } from '@mui/lab'
import AddIcon from '@mui/icons-material/Add'
import { Search } from '@mui/icons-material'

import { MemberService } from '@/services/remote-api/api/member-services/member.services'
import { ProvidersService } from '@/services/remote-api/api/provider-services/provider.services'

const memupservice = new MemberService()
const providerservice = new ProvidersService()

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

export default function ClaimsReportComponent(props: any) {
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
  const [selectedFieldlist, setSelectedFieldlist] = React.useState([])
  const [handleLayout, setHandleLayout] = React.useState('')

  // const [fieldOptions, setFieldOptions] = React.useState([]);
  const [expanded, setExpanded] = React.useState('panel1')
  const [memberDetailList, setMemberDetailsList] = React.useState([])
  const [providerDetailList, setProviderDetailList] = React.useState([])
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

  const handleSnackClose = (event: any, reason: any) => {
    setSnack({
      open: false,
      vertical: 'top',
      horizontal: 'right',
      msg: ''
    })
  }

  const handleSnack1Close = (event: any, reason: any) => {
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
    const fields: any = []
    const rules: any = []
    let allOK = true

    fieldList.forEach((val: any, index) => {
      //Validation
      if (val.isDropdown) {
        if (val.sourceType === '') {
          setSnack({
            open: true,
            vertical: 'top',
            horizontal: 'right',
            msg: 'Please choose a source type'
          })
          allOK = false

          return
        }

        if (val.sourceType === 'DYNAMIC' && val.sourceApiId === '') {
          setSnack({
            open: true,
            vertical: 'top',
            horizontal: 'right',
            msg: 'Please choose a source api'
          })
          allOK = false

          return
        }

        if (val.sourceType === 'CUSTOM' && val.customValues.length === 0) {
          setSnack({
            open: true,
            vertical: 'top',
            horizontal: 'right',
            msg: 'Please enter custom datas'
          })
          allOK = false
        }
      }

      if (val.formattingAllowed && !val.format) {
        setSnack({
          open: true,
          vertical: 'top',
          horizontal: 'right',
          msg: 'Please choose a format'
        })
        allOK = false
      }

      //Payload

      const obj: any = {
        name: val['columnName'],
        required: val['isMandatory'],
        dataType: val['dataType'],
        systemGenerated: val['systemGenerated']
      }

      if (val.formattingAllowed) {
        obj['format'] = val['format']
      }

      if (!val.formattingAllowed) {
        obj['format'] = ''
      }

      if (val.sourceType === 'DYNAMIC') {
        obj['sourceApiId'] = val['sourceApiId']
        obj['customValues'] = []
      } else if (val.sourceType === 'CUSTOM') {
        obj['customValues'] = val['customValues']
        obj['sourceApiId'] = ''
      } else {
        obj['sourceApiId'] = ''
        obj['customValues'] = []
      }

      fields.push(obj)

      if (val.isUnique) {
        rules.push({
          rule: '$(member_field_value_not_exist.' + val.columnName + ') == true',
          name: val.columnName,
          errorCode: val.errorCode,
          errorMessage: val.errorMessage
        })
      }
    })

    const payload = {
      fields: fields,
      rules: rules,
      stopIfFirstRuleFail: true,
      headerRowNum: 0,
      startDataRowNum: 1
    }

    if (allOK) {
      memupservice.saveMemberConfigs(payload).subscribe(res => {
        setSnack1({
          open: true,
          vertical: 'top',
          horizontal: 'right',
          msg: 'Member Upload Configuration saved successfully'
        })
      })
    }
  }

  useEffect(() => {
    providerservice.getProvidersList().subscribe((res: any) => {
      console.log(res)
      setProviderDetailList(res)
    })
  }, [handleLayout])

  // const onDragEnd = (data) => {
  //     setFieldList(data);
  // }
  const handleAccordianToggle = (panel: any) => (event: any, isExpanded: any) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleFieldList = (event: any) => {
    setSelectedFieldlist(event.target.value)
  }

  const addFields = (event: any) => {
    setFieldList(selectedFieldlist)
  }

  console.log(providerDetailList)

  const claimsComponent = (status: any) => {
    switch (status) {
      case 'remittance':
        return (
          <Box>
            <h2 style={{ marginBottom: '1rem' }}>Remittance for Provider</h2>
            <Paper
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '5rem'
              }}
            >
              <Box>
                <Autocomplete
                  disablePortal
                  options={providerDetailList}
                  style={{ width: 300 }}
                  getOptionLabel={(option: any) => option.name || ''}
                  renderInput={params => <TextField {...params} label='Providers' variant='outlined' />}
                />
              </Box>

              <Box sx={{ width: '30%', display: 'flex', justifyContent: 'space-around' }}>
                <TextField
                  label='Start Date'
                  variant='outlined'
                  type='date'
                  InputLabelProps={{
                    shrink: true // This will ensure the label doesn't overlap the selected date
                  }}
                />
                <TextField
                  label='End Date'
                  variant='outlined'
                  type='date'
                  InputLabelProps={{
                    shrink: true // Same here to handle date input properly
                  }}
                />
              </Box>
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant='contained'
                // type="submit"
                style={{ backgroundColor: '#ed2264', color: 'white', margin: '2rem' }}

                //   disabled={disable}>
              >
                Generate Reports
                <Search style={{ width: '15px', marginLeft: '5px' }} />
              </Button>
            </Box>
          </Box>
        )
      default:
        return (
          <div>
            <Grid
              item
              xs={12}
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '20px',
                height: '2em',
                fontSize: '18px'
              }}
            >
              <span
                style={{
                  fontWeight: '600',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: '5px'
                }}
              >
                Report -Claim
              </span>
            </Grid>
            <Paper
              elevation={0}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '1%'
              }}
            >
              <Box padding={'10px'} display={'flex'} flexDirection={'row'} flexWrap={'wrap'} gap={'10px'}>
                <Paper
                  elevation={10}
                  style={{
                    boxShadow: '1px 1px 2px 0px rgba(0,0,0,1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '1%'
                  }}
                >
                  <Box width={'250px'} height={'300px'} boxShadow={'0 1px 3px 0 rgba(0, 0, 0, 0.15)'} padding={'5px'}>
                    <Box
                      display={'flex'}
                      justifyContent={'space-between'}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setHandleLayout('remittance')}
                    >
                      <Typography align='left' variant='h4'>
                        Remittance For Provider
                      </Typography>
                      {/* <Button
                    variant="contained"
                    color="primary"
                    className={classes.buttonPrimary}
                    style={{ marginLeft: '5px' }}
                    // onClick={handleAddClaimCost}
                   > */}
                      <AddIcon />
                      {/* </Button> */}
                    </Box>
                  </Box>
                </Paper>
                <Paper
                  elevation={10}
                  style={{
                    boxShadow: '1px 1px 2px 0px rgba(0,0,0,1)',
                    display: 'flex',

                    // background: 'wheat',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '1%'
                  }}
                >
                  <Box width={'250px'} height={'300px'} boxShadow={'0 1px 3px 0 rgba(0, 0, 0, 0.15)'} padding={'5px'}>
                    <Box display={'flex'} justifyContent={'space-between'}>
                      <Typography align='center' variant='h4'>
                        Report-2
                      </Typography>
                      <AddIcon />
                    </Box>
                  </Box>
                </Paper>
                <Paper
                  elevation={10}
                  style={{
                    boxShadow: '1px 1px 2px 0px rgba(0,0,0,1)',
                    display: 'flex',

                    // background: 'wheat',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '1%'
                  }}
                >
                  <Box width={'250px'} height={'300px'} boxShadow={'0 1px 3px 0 rgba(0, 0, 0, 0.15)'} padding={'5px'}>
                    <Box display={'flex'} justifyContent={'space-between'}>
                      <Typography align='center' variant='h4'>
                        Report-3
                      </Typography>
                      <AddIcon />
                    </Box>
                  </Box>
                </Paper>
                <Paper
                  elevation={10}
                  style={{
                    boxShadow: '1px 1px 2px 0px rgba(0,0,0,1)',
                    display: 'flex',

                    // background: 'wheat',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '1%'
                  }}
                >
                  <Box width={'250px'} height={'300px'} boxShadow={'0 1px 3px 0 rgba(0, 0, 0, 0.15)'} padding={'5px'}>
                    <Box display={'flex'} justifyContent={'space-between'}>
                      <Typography align='center' variant='h4'>
                        Report-4
                      </Typography>
                      <AddIcon />
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Paper>
          </div>
        )
    }
  }

  return claimsComponent(handleLayout)
}
