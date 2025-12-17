import * as React from 'react'

import { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import { useFormik } from 'formik'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import * as yup from 'yup'

import { Divider, Tooltip } from '@mui/material'

import { AddressService, PrefixTypeService } from '@/services/remote-api/api/master-services'
import { HierarchyService } from '@/services/remote-api/api/hierarchy-services'

import Asterisk from '../../shared-component/components/red-asterisk'

const addressservice = new AddressService()
const branchService = new HierarchyService()
const prefixservice = new PrefixTypeService()

const addr$ = addressservice.getAddressConfig()
const prefx$ = prefixservice.getPrefixTypes()

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
  formControl: {
    minWidth: '90%'
  }
}))

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

const schemaObject = {
  mobileNo: yup.string()['min'](10, 'Must be exactly 10 digit')['max'](10, 'Must be exactly 10 digit').nullable(),

  // .matches(new RegExp('[0-9]{10}'),'Contact number is not valid'),
  alternateMobileNo: yup
    .string()
  ['min'](10, 'Must be exactly 10 digit')
  ['max'](10, 'Must be exactly 10 digit')
    .nullable(),
  emailId: yup.string().email('Enter a valid email').nullable(),
  alternateEmailId: yup.string().email('Enter a valid email').nullable(),
  addressData: yup.object().shape({})
}

let validationSchema = yup.object(schemaObject)

interface AddressData {
  [key: string]: string // Ensures TypeScript recognizes it as an object with string keys
}

const initialValues = {
  addressData: {} as AddressData,
  centerAddressLine1: '',
  centerAddressLine2: '',
  centerCountry: '',
  centerCounty: '',
  centerCity: '',
  centerPostalCode: '',
  centerPoliceStation: '',
  centerPObox: '',
  personDetailPrefix: '',
  personDetailFirstName: '',
  personDetailMiddleName: '',
  personDetailLastName: '',
  personDetailPhoneNo: '',
  personDetailMobile: '',
  personDetailMailId: '',
  regionId: ''
}

export default function BranchAddressDetailsComponent(props: any) {
  const classes = useStyles()
  const query2 = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const id: any = params.id
  const [addressConfiguration, setAddressConfiguration] = React.useState([])
  const [addressConfig, setAddressConfig] = React.useState([])
  const [prefixes, setPrefixes] = React.useState([])
  const [formObj, setFormObj]: any = React.useState({})
  const [branchForm, setBranchForm] = React.useState({ ...initialValues })

  const formik = useFormik({
    initialValues: {
      ...initialValues
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      handleSubmitPlan()
    }
  })

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(prefx$, setPrefixes)

  const handleSubmitPlan = () => {
    const addrArr = []

    if (formik.values.addressData) {
      for (const [key, value] of Object.entries(formik.values.addressData)) {
        const objAddr = {
          addressDetails: {
            [key]: value
          },
          addressType: 'CURRENT_ADDRESS'
        }

        addrArr.push(objAddr)
      }
    }

    const payload = {
      branchAddressDetails: {
        addresses: addrArr
      }
    }

    if (query2.get('mode') === 'create') {
      branchService.SaveBranchOtherDetails(formik.values.regionId, payload, props.branchId, 1).subscribe(res => {
        props.handleNext()
      })
    }

    if (query2.get('mode') === 'edit') {
      branchService.SaveBranchOtherDetails(formik.values.regionId, payload, id, 1).subscribe(res => {
        props.handleNext()
      })
    }
  }

  React.useEffect(() => {
    if (id) {
      populateData(id)
    } else {
      populateData(props.branchId)
    }
  }, [id])

  const populateData = (id: any) => {
    branchService.getBranchDetails(id).subscribe(value => {
      formik.setValues({
        ...value
      })
    })
  }

  console.log("1234567890", formik.values)

  const handleClose = (event: any) => {
    router.push(`/branch?mode=viewList`)

    // window.location.reload();
  }

  useEffect(() => {
    const subscription = addr$.subscribe((result: any) => {
      if (result.length !== 0) {
        result.forEach((prop: any, i: any) => {
          prop.addressConfigurationFieldMappings.forEach((field: any, j: number) => {
            // let fname = "field"+i+j;
            // field['fieldName'] = fname;
            field['value'] = ''

            if (field.sourceId !== null && field.sourceId !== '') {
              field['sourceList'] = []
            }

            if (field.type === 'dropdown' && field.sourceId === null) {
              if (field.addressConfigurationFieldCustomValueMappings.length !== 0) {
                field['sourceList'] = field.addressConfigurationFieldCustomValueMappings
              }

              if (field.type === 'dropdown' && field.sourceId === null) {
                if (field.addressConfigurationFieldCustomValueMappings.length !== 0) {
                  field['sourceList'] = field.addressConfigurationFieldCustomValueMappings
                }

                // if(field.addressConfigurationFieldCustomValueMappings.length === 0 || field.addressConfigurationFieldCustomValueMappings === null){
                //   field['sourceList'] = [];
                // }
              }
            }
          })
        })
        setAddressConfiguration(result)
      }
    })

    return () => subscription.unsubscribe()
  }, [addr$, setAddressConfiguration])

  useEffect(() => {
    if (addressConfiguration && addressConfiguration.length !== 0) {
      setAddressConfig(addressConfiguration)
      const frmObj: any = {}

      // let frmLst = {};
      addressConfiguration.forEach((prop: any, i: number) => {
        prop.addressConfigurationFieldMappings.map((field: any, j: number) => {
          frmObj[field.fieldName] = field.defaultValue

          if (field.dependsOn == '' && field.type == 'dropdown' && field.modifyApiURL) {
            addressservice.getSourceList(field.modifyApiURL).subscribe((res: any) => {
              // field.sourceList =res.content;
              const list: any = [...addressConfiguration]

              list[i].addressConfigurationFieldMappings[j].sourceList = res.content
              setAddressConfig(list)

              // frmLst[field.fieldName] = res.content;
            })
          }
        })
      })
      setFormObj(frmObj)

      setBranchForm({
        ...branchForm,
        addressData: frmObj
      })

      let newSchema = {
        ...schemaObject
      }
      let addressDataSchemaObject = {}
      const regex = /^[\w&., \-]*$/

      addressConfiguration.forEach((prop: any, i) => {
        prop.addressConfigurationFieldMappings.map((field: any, j: number) => {
          const validationsArr = []

          if (field.required === 'true') {
            validationsArr.push({ type: 'required', params: ['This field is required'] })
          }

          if (
            field.lengthValidation === 'true' &&
            field.size !== '' &&
            field.size !== null &&
            field.dataType !== 'numeric'
          ) {
            const msg = 'length must be' + ' ' + field.size + ' ' + 'digits'

            validationsArr.push({ type: 'min', params: [Number(field.size), msg] })
            validationsArr.push({ type: 'max', params: [Number(field.size), msg] })
          }

          if (
            field.lengthValidation === 'true' &&
            field.size !== '' &&
            field.size !== null &&
            field.dataType === 'numeric'
          ) {
            const msg = 'length must be' + ' ' + field.size + ' ' + 'digits'

            validationsArr.push({
              type: 'test',
              params: ['len', msg, (val: any) => val && val.toString().length === Number(field.size)]
            })
          }

          if (field.spacialCharacterValidation === 'true' && field.dataType !== 'numeric') {
            const msg = 'No special character allowed'

            validationsArr.push({ type: 'matches', params: [regex, msg] })
          }

          if (validationsArr.length > 0) {
            let v: any

            if (field.dataType === 'numeric') {
              v = yup.number()
            } else {
              v = yup.string()
            }

            validationsArr.forEach(item => {
              v = v[item.type](...item.params)
            })
            addressDataSchemaObject = { ...addressDataSchemaObject, [field.fieldName]: v }
          }
        })
      })

      const addressDataSchema = yup.object(addressDataSchemaObject)

      newSchema = { ...newSchema, addressData: addressDataSchema }
      validationSchema = yup.object(newSchema)
    }

    // populateData();
  }, [addressConfiguration])

  const handleDynamicAddressChange = (e: any, field: any) => {
    const { name, value } = e.target

    if (addressConfiguration && addressConfiguration.length !== 0) {
      if (name) {
        setFormObj({
          ...formObj,
          [name]: value
        })

        formik.setValues({
          ...formik.values,
          addressData: {
            ...formik.values.addressData,
            [name]: value
          }
        })
      }

      addressConfiguration.forEach((p: any, i: any) => {
        p.addressConfigurationFieldMappings.map((f: any, j: any) => {
          if (f.fieldName === name) {
            f['value'] = value
          }
        })
      })

      addressConfiguration.forEach((p: any, i: any) => {
        p.addressConfigurationFieldMappings.map((f: any, j: any) => {
          if (field.type == 'dropdown' && p.dependOnfields !== null) {
            if (p.dependOnfields[0] === field.fieldName) {
              const word = '{code}'
              const arr = []

              // let dArr = callAPiFunc(f, p, arr);
              const apiURL = f.modifyApiURL

              // dArr.forEach(cd => {
              //   apiURL =
              //     apiURL.slice(0, apiURL.lastIndexOf(word)) + apiURL.slice(apiURL.lastIndexOf(word)).replace(word, cd);
              // });
              addressservice.getSourceList(apiURL).subscribe((res: any) => {
                const list: any = [...addressConfig]

                list[i].addressConfigurationFieldMappings[j].sourceList = res.content
                setAddressConfig(list)
              })
            }
          }
        })
      })
    }
  }

  return (
    <Paper elevation={0}>
      <Box p={3} my={2}>
        <form onSubmit={formik.handleSubmit} noValidate>
          {addressConfiguration && addressConfiguration.length !== 0 && (
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              {addressConfig.map((prop: any, i: any) => {
                return prop.addressConfigurationFieldMappings.length !== 1 ? (
                  <Grid item xs={6} key={`add-${i}`}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                        {prop.levelName}
                      </InputLabel>
                      {prop.iButtonRequired === 'true' && (
                        <Tooltip title={prop.iButtonMessage} placement='top'>
                          <InfoOutlinedIcon style={{ fontSize: 'medium' }} />
                        </Tooltip>
                      )}
                    </div>
                    {prop.addressConfigurationFieldMappings.map((field: any, j: any) => {
                      return (
                        <div key={`addConfig-${j}`}>
                          {field.type === 'dropdown' && !field.readOnly && (
                            <FormControl className={classes.formControl}>
                              <Select
                                labelId='demo-simple-select-label'
                                name={field.fieldName}
                                id='demo-simple-select'
                                required={field.required === 'true' ? true : false}
                                // error={errorTxtFnc('addressData', field.fieldName)}
                                value={formObj[field.fieldName] ? formObj[field.fieldName] : ''}
                                onChange={e => {
                                  handleDynamicAddressChange(e, field)
                                }}
                                style={{ marginRight: '8px' }}
                              >
                                {field.sourceList.map((ele: any) => {
                                  return (
                                    <MenuItem key={ele.code} value={ele.code}>
                                      {ele.name}
                                    </MenuItem>
                                  )
                                })}
                              </Select>
                            </FormControl>
                          )}
                          {field.type === 'textbox' && !field.readOnly && (
                            <TextField
                              id='standard-basic'
                              name={field.fieldName}
                              type={field.dataType === 'numeric' ? 'number' : 'text'}
                              required={field.required === 'true' ? true : false}
                              // error={errorTxtFnc('addressData', field.fieldName)}
                              // helperText={helperTextFnc('addressData', field.fieldName)}
                              value={formObj[field.fieldName] ? formObj[field.fieldName] : ''}
                              onChange={e => {
                                handleDynamicAddressChange(e, field)
                              }}
                              style={{ marginTop: '8px' }}
                            />
                          )}

                          {field.type === 'textarea' && !field.readOnly && (
                            <TextField
                              required={field.required === 'true' ? true : false}
                              id='standard-multiline-flexible'
                              multiline
                              name={field.fieldName}
                              maxRows={field.lengthValidation ? Number(prop.size) : 5}
                              value={formObj[field.fieldName] ? formObj[field.fieldName] : ''}
                              onChange={e => {
                                handleDynamicAddressChange(e, field)
                              }}

                            // error={errorTxtFnc('addressData', field.fieldName)}
                            // helperText={helperTextFnc('addressData', field.fieldName)}
                            />
                          )}
                          {field.readOnly && (
                            <TextField
                              id='standard-basic'
                              name={field.fieldName}
                              value={field.defaultValue}
                              defaultValue={field.defaultValue}
                              InputProps={{ readOnly: true }}
                              style={{ marginTop: '10px', marginRight: '8px', width: '15%' }}
                              size='small'
                            />
                          )}
                        </div>
                      )
                    })}
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={6} md={4}>
                    {prop.addressConfigurationFieldMappings.map((field: any, j: number) => {
                      return (
                        <div key={`addConfigMap-${j}`}>
                          {field.type === 'dropdown' && !field.readOnly && (
                            <FormControl className={classes.formControl}>
                              <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                {prop.levelName}
                              </InputLabel>
                              <Select
                                labelId='demo-simple-select-label'
                                label={field.fieldName}
                                name={field.fieldName}
                                required={field.required === 'true' ? true : false}
                                id='demo-simple-select'
                                value={formObj[field.fieldName] ? formObj[field.fieldName] : ''}
                                // error={errorTxtFnc('addressData', field.fieldName)}
                                onChange={e => {
                                  handleDynamicAddressChange(e, field)
                                }}
                              >
                                {field.customValuePresent === 'CUSTOM' &&
                                  field.sourceList.map((ele: any) => {
                                    return (
                                      <MenuItem key={ele.id} value={ele.id}>
                                        {ele.value}
                                      </MenuItem>
                                    )
                                  })}
                                {field.customValuePresent === 'DYNAMIC' &&
                                  field.sourceList.map((ele: any) => {
                                    return (
                                      <MenuItem key={ele.id} value={ele.code}>
                                        {ele.name}
                                      </MenuItem>
                                    )
                                  })}
                              </Select>
                            </FormControl>
                          )}

                          {field.type === 'textbox' && !field.readOnly && (
                            <FormControl className={classes.formControl}>
                              <TextField
                                required={field.required === 'true' ? true : false}
                                id='standard-basic'
                                name={field.fieldName}
                                type={field.dataType === 'numeric' ? 'number' : 'text'}
                                value={formObj[field.fieldName] ? formObj[field.fieldName] : ''}
                                onChange={e => {
                                  handleDynamicAddressChange(e, field)
                                }}
                                label={prop.levelName}
                              />
                            </FormControl>
                          )}

                          {field.type === 'textarea' && !field.readOnly && (
                            <FormControl className={classes.formControl}>
                              <TextField
                                id='standard-multiline-flexible'
                                // required={field.required === 'true' ? true : false}
                                multiline
                                name={field.fieldName}
                                maxRows={field.lengthValidation ? Number(prop.size) : 5}
                                value={
                                  formik.values.addressData[field.fieldName]
                                    ? formik.values.addressData[field.fieldName]
                                    : ''
                                }
                                onChange={e => {
                                  handleDynamicAddressChange(e, field)
                                }}
                                // error={errorTxtFnc('addressData', field.fieldName)}
                                // helperText={helperTextFnc('addressData', field.fieldName)}
                                label={
                                  field.required === 'true' ? (
                                    <span>
                                      {prop.levelName} <Asterisk />
                                    </span>
                                  ) : (
                                    prop.levelName
                                  )
                                }
                              />
                            </FormControl>
                          )}
                          {field.readOnly && (
                            <FormControl className={classes.formControl}>
                              <TextField
                                id='standard-basic'
                                name={field.fieldName}
                                value={field.defaultValue}
                                label={prop.levelName}
                                defaultValue={field.defaultValue}
                                disabled={true}
                              />
                            </FormControl>
                          )}
                          {prop.iButtonRequired === 'true' && (
                            <Tooltip title={prop.iButtonMessage} placement='top'>
                              <InfoOutlinedIcon style={{ fontSize: 'medium', marginTop: '23px' }} />
                            </Tooltip>
                          )}
                        </div>
                      )
                    })}
                  </Grid>
                )
              })}
              <Divider />
            </Grid>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button color='secondary' style={{ marginRight: '5px' }} type='submit'>
                Save
              </Button>
              <Button color='primary' onClick={handleClose} className='p-button-text'>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Paper>
  )
}
