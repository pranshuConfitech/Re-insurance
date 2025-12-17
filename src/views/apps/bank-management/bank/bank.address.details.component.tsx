import * as React from 'react'

import { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Formik } from 'formik'

import * as yup from 'yup'

import { Button } from 'primereact/button'

import { BankService } from '@/services/remote-api/api/banks-services'
import { AddressService } from '@/services/remote-api/api/master-services'

import Asterisk from '../../shared-component/components/red-asterisk'

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const schemaObject = {
  name: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, 'Only alphabets are allowed for this field')
    .required('Name is required'),

  // .required('Name is required'),
  contactNo: yup
    .string()
    ['min'](10, 'Must be exactly 10 digit')
    ['max'](10, 'Must be exactly 10 digit')
    .required('Contact No. is required'),

  // .matches(new RegExp('[0-9]{10}'),'Contact number is not valid'),
  emailId: yup
    .string()
    .matches(/^[\w-\.]+@([\w-]+\.)+(com|in)$/i, 'Email must be a .com or .in domain')
    .email('Enter a valid email')
    .required('Emaili required'),

  // alternateContactNo: yup
  //   .string("Enter your Contact Number")
  //   .test('len', 'Must be exactly 10 digit', val => val.length === 10),
  // .matches(new RegExp('[0-9]{10}'),'Contact number is not valid'),
  alternateEmailId: yup
    .string()
    .matches(/^[\w-\.]+@([\w-]+\.)+(com|in)$/i, 'Email must be a .com or .in domain')
    .email('Enter a valid email'),
  addressData: yup.object().shape({})
}

let validationSchema = yup.object(schemaObject)

const initialValues = {
  name: '',
  emailId: '',
  alternateEmailId: '',
  contactNo: '',
  alternateContactNo: '',
  addressData: {}
}

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
    margin: theme?.spacing ? theme?.spacing(1) : '8px',
    minWidth: 120
  },
  formControl1: {
    margin: theme?.spacing ? theme?.spacing(1) : '8px',
    minWidth: 120,
    maxWidth: 300
  }
}))

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

const bankservice = new BankService()
const addressservice = new AddressService()

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

export default function BankAddressDetailsComponent(props: any) {
  const classes = useStyles()
  const query2 = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const id: any = params.id
  const [formObj, setFormObj]: any = React.useState({})

  // const { fieldOptionList, setFieldOptionList } = React.useState({});
  const [agentAddressForm, setAgentAddressForm] = React.useState({ ...initialValues })

  const [addressConfig, setAddressConfig] = React.useState([])

  useEffect(() => {
    if (props.addressConfig && props.addressConfig.length !== 0) {
      setAddressConfig(props.addressConfig)
      const frmObj: any = {}

      // let frmLst = {};
      props.addressConfig.forEach((prop: any, i: number) => {
        prop.addressConfigurationFieldMappings.map((field: any, j: any) => {
          frmObj[field.fieldName] = field.defaultValue

          if (field.dependsOn == '' && field.type == 'dropdown' && field.modifyApiURL) {
            addressservice.getSourceList(field.modifyApiURL).subscribe((res: any) => {
              // field.sourceList =res.content;
              const list: any = [...props.addressConfig]

              list[i].addressConfigurationFieldMappings[j].sourceList = res.content
              setAddressConfig(list)

              // frmLst[field.fieldName] = res.content;
            })
          }
        })
      })
      setFormObj(frmObj)

      /* formik.setValues({
      ...formik.values,
      addressData: frmObj
    }) */

      setAgentAddressForm({
        ...agentAddressForm,
        addressData: frmObj
      })

      // setFieldOptionList(frmLst);

      // const validationsArr = [
      //   {type: "required", params: ["Enter name"]},
      //   {type: "min", params: [3, "Enter name"]},
      //   {type: "max", params: [3, "Enter name"]},
      // ]

      let newSchema = {
        ...schemaObject
      }
      let addressDataSchemaObject = {}
      const regex = /^[\w&., \-]*$/

      props.addressConfig.forEach((prop: any, i: number) => {
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
      const addressDataSchema: any = yup.object(addressDataSchemaObject)

      newSchema = { ...newSchema, addressData: addressDataSchema }
      validationSchema = yup.object(newSchema)

      /* props.addressConfig.forEach( (prop:any, i:any) => {
      prop.addressConfigurationFieldMappings.map( (field:any, j:any) => {
        
        v = {}
        validationsArr.forEach(item => {
          v= yup[item.type](...item.params)
        });

        newSchema = {
          ...newSchema,
          [field.fieldName]: v
        }
      });
    }); */
    }

    populateData()
  }, [props.addressConfig])

  const populateDynamicAddress = () => {
    if (id) {
      if (props.addressConfig && props.addressConfig.length !== 0) {
        let frmOb: any = {}

        bankservice.getBankDetails(id).subscribe(val => {
          val.bankAddressDetails.addresses.forEach(addr => {
            frmOb = { ...frmOb, ...addr.addressDetails }
          })
          setFormObj(frmOb)

          /* formik.setValues({
          ...formik.values,
          addressData: {
            ...formik.values.addressData,
            ...frmOb
          }
        }) */
          setAgentAddressForm({
            ...agentAddressForm,
            addressData: {
              ...agentAddressForm.addressData,
              ...frmOb
            }
          })

          props.addressConfig.forEach((prop: any, i: any) => {
            prop.addressConfigurationFieldMappings.map((field: any, j: any) => {
              if (field.type == 'dropdown' && prop.dependOnfields !== null) {
                const fn = prop.dependOnfields[0]
                const pcode = frmOb[fn]
                let apiURL = field.modifyApiURL
                const word = '{code}'

                apiURL =
                  apiURL.slice(0, apiURL.lastIndexOf(word)) +
                  apiURL.slice(apiURL.lastIndexOf(word)).replace(word, pcode)
                addressservice.getSourceList(apiURL).subscribe((res: any) => {
                  const list: any = [...props.addressConfig]

                  list[i].addressConfigurationFieldMappings[j].sourceList = res.content
                  setAddressConfig(list)
                })
              }
            })
          })
        })
      }
    }
  }

  //handle second step submit
  const handleFinalSubmit = (values: any) => {
    const addrArr = []

    for (const [key, value] of Object.entries(values.addressData)) {
      const objAddr = {
        addressDetails: {
          [key]: value
        },
        addressType: 'CURRENT_ADDRESS'
      }

      addrArr.push(objAddr)
    }

    const payloadTwo: any = {
      bankAddressDetails: {
        addresses: addrArr,
        bankContactPersonDetails: {
          name: values.name,
          emailId: values.emailId,
          alternateEmailId: values.alternateEmailId,
          contactNo: values.contactNo,
          alternateContactNo: values.alternateContactNo
        }
      }
    }

    if (query2.get('mode') === 'create') {
      bankservice.editBank(payloadTwo, props.bankID, '2').subscribe(res => {
        router.push(`/bank-management/banks?mode=viewList`)

        // window.location.reload();
      })
    }

    if (query2.get('mode') === 'edit') {
      bankservice.editBank(payloadTwo, id, '2').subscribe(res => {
        router.push(`/bank-management/banks?mode=viewList`)

        // window.location.reload();
      })
    }
  }

  // React.useEffect(() => {
  //   if (id) {
  //     populateData(id);
  //   }
  // }, [id]);

  const populateData = () => {
    if (id) {
      let frmOb: any = {}

      bankservice.getBankDetails(id).subscribe((val: any) => {
        if (props.addressConfig && props.addressConfig.length !== 0) {
          val.bankAddressDetails.addresses.forEach((addr: any) => {
            frmOb = { ...frmOb, ...addr.addressDetails }
          })
          setFormObj(frmOb)

          val.bankAddressDetails.addresses.forEach((item: any) => {
            props.addressConfig.forEach((prop: any, i: any) => {
              prop.addressConfigurationFieldMappings.forEach((field: any, j: any) => {
                if (Object.keys(item.addressDetails)[0] === field.fieldName) {
                  field['value'] = item.addressDetails[field.fieldName]
                }
              })
            })
          })

          props.addressConfig.forEach((prop: any, i: any) => {
            prop.addressConfigurationFieldMappings.map((field: any, j: any) => {
              if (field.type == 'dropdown' && prop.dependOnfields !== null) {
                const arr: any = []
                const dArr = callAPiFunc(field, prop, arr)
                const word = '{code}'
                let apiURL = field.modifyApiURL

                dArr.forEach((cd: any) => {
                  apiURL =
                    apiURL.slice(0, apiURL.lastIndexOf(word)) + apiURL.slice(apiURL.lastIndexOf(word)).replace(word, cd)
                })

                addressservice.getSourceList(apiURL).subscribe((res: any) => {
                  const list: any = [...props.addressConfig]

                  list[i].addressConfigurationFieldMappings[j].sourceList = res.content
                  setAddressConfig(list)
                })
              }
            })
          })
        }

        setAgentAddressForm({
          ...agentAddressForm,
          name: val.bankAddressDetails.bankContactPersonDetails.name,
          emailId: val.bankAddressDetails.bankContactPersonDetails.emailId,
          alternateEmailId: val.bankAddressDetails.bankContactPersonDetails.alternateEmailId,
          contactNo: val.bankAddressDetails.bankContactPersonDetails.contactNo,
          alternateContactNo: val.bankAddressDetails.bankContactPersonDetails.alternateContactNo,
          addressData: frmOb
        })
      })
    }
  }

  const callAPiFunc = (field: any, prop: any, resultarr: any) => {
    if (props.addressConfig && props.addressConfig.length !== 0) {
      props.addressConfig.forEach((pr: any, i: number) => {
        pr.addressConfigurationFieldMappings.forEach((fi: any, j: number) => {
          if (fi.fieldName === prop.dependOnfields[0]) {
            // let p = prop.dependOnfields[0];
            // let fb = formObj[p];
            resultarr.push(fi.value)

            if (pr.dependOnfields !== null) {
              callAPiFunc(fi, pr, resultarr)
            }
          }
        })
      })
    }

    return resultarr
  }

  type FormikProps = {
    errors: any
    touched: any
    handleSubmit: (event: any) => void
    values: any
    handleChange: (e: any) => void
    setValues: (values: any) => void
    setFieldValue: (field: string, value: any) => void
  }

  return (
    <Paper elevation={0}>
      <Box p={3} my={2}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...agentAddressForm
          }}
          validationSchema={validationSchema}
          onSubmit={(values: any) => {
            handleFinalSubmit(values)
          }}
        >
          {({ errors, touched, handleSubmit, values, handleChange, setValues, setFieldValue }: FormikProps) => {
            const handleDynamicAddressChange = (e: any, field: any) => {
              const { name, value } = e.target

              if (props.addressConfig && props.addressConfig.length !== 0) {
                if (name) {
                  setFormObj({
                    ...formObj,
                    [name]: value
                  })

                  setValues({
                    ...values,
                    addressData: {
                      ...values.addressData,
                      [name]: value
                    }
                  })
                }

                props.addressConfig.forEach((p: any, i: number) => {
                  p.addressConfigurationFieldMappings.map((f: any, j: number) => {
                    if (f.fieldName === name) {
                      f['value'] = value
                    }
                  })
                })

                props.addressConfig.forEach((p: any, i: number) => {
                  p.addressConfigurationFieldMappings.map((f: any, j: number) => {
                    if (field.type == 'dropdown' && p.dependOnfields !== null) {
                      if (p.dependOnfields[0] === field.fieldName) {
                        const word = '{code}'
                        const arr: any = []
                        const dArr = callAPiFunc(f, p, arr)
                        let apiURL = f.modifyApiURL

                        dArr.forEach((cd: any) => {
                          apiURL =
                            apiURL.slice(0, apiURL.lastIndexOf(word)) +
                            apiURL.slice(apiURL.lastIndexOf(word)).replace(word, cd)
                        })
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

            const handleChangeHolidays = (event: any) => {
              setFieldValue('agentWeeklyHolidays', event.target.value)
            }

            const errorTxtFnc = (parentField: any, field: any) => {
              return (
                touched.hasOwnProperty(parentField) &&
                touched[parentField][field] &&
                Boolean(errors.hasOwnProperty(parentField) && errors[parentField][field])
              )
            }

            const helperTextFnc = (parentField: any, field: any) => {
              return (
                touched.hasOwnProperty(parentField) &&
                touched[parentField][field] &&
                errors.hasOwnProperty(parentField) &&
                errors[parentField][field]
              )
            }

            const handleNameChange = (e: any) => {
              if (e.target.value) {
                const regex = /^[A-Za-z\s]+$/

                if (regex.test(e.target.value)) {
                  handleChange(e)
                }
              } else {
                handleChange(e)
              }
            }

            return (
              <div>
                <span
                  style={{
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '30px 0',
                    color: '#3f51b5',
                    textDecoration: 'underline'
                  }}
                >
                  Conatct Person Details
                </span>
                <form onSubmit={handleSubmit} noValidate>
                  {props.addressConfig && props.addressConfig.length !== 0 && (
                    <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                      {addressConfig.map((prop: any, i: any) => {
                        return prop.addressConfigurationFieldMappings.length !== 1 ? (
                          <Grid item xs={6} key={i}>
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
                                <div key={`bank-${j}`}>
                                  {field.type === 'dropdown' && !field.readOnly && (
                                    <FormControl className={classes.formControl}>
                                      <Select
                                        labelId='demo-simple-select-label'
                                        name={field.fieldName}
                                        id='demo-simple-select'
                                        required={field.required === 'true' ? true : false}
                                        error={errorTxtFnc('addressData', field.fieldName)}
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
                                      {touched.hasOwnProperty('addressData') &&
                                        touched?.addressData[field.fieldName] &&
                                        errors.hasOwnProperty('addressData') &&
                                        errors.addressData[field.fieldName] && (
                                          <FormHelperText style={{ color: 'red' }}>
                                            {touched.hasOwnProperty('addressData') &&
                                              touched?.addressData[field.fieldName] &&
                                              errors.hasOwnProperty('addressData') &&
                                              errors.addressData[field.fieldName]}
                                          </FormHelperText>
                                        )}
                                    </FormControl>
                                  )}
                                  {field.type === 'textbox' && !field.readOnly && (
                                    <TextField
                                      id='standard-basic'
                                      name={field.fieldName}
                                      type={field.dataType === 'numeric' ? 'number' : 'text'}
                                      // required={field.required === 'true' ? true : false}
                                      error={errorTxtFnc('addressData', field.fieldName)}
                                      helperText={helperTextFnc('addressData', field.fieldName)}
                                      value={formObj[field.fieldName] ? formObj[field.fieldName] : ''}
                                      onChange={e => {
                                        handleDynamicAddressChange(e, field)
                                      }}
                                      style={{ marginTop: '8px' }}
                                    />
                                  )}

                                  {field.type === 'textarea' && !field.readOnly && (
                                    <TextField
                                      // required={field.required === 'true' ? true : false}
                                      id='standard-multiline-flexible'
                                      multiline
                                      name={field.fieldName}
                                      maxRows={field.lengthValidation ? Number(prop.size) : 5}
                                      value={formObj[field.fieldName] ? formObj[field.fieldName] : ''}
                                      onChange={e => {
                                        handleDynamicAddressChange(e, field)
                                      }}
                                      error={errorTxtFnc('addressData', field.fieldName)}
                                      helperText={helperTextFnc('addressData', field.fieldName)}
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
                          <Grid item xs={4} key={i + 50}>
                            {/* {prop.addressConfigurationFieldMappings.map( (field:any, j:any) => {
                            return <> */}
                            {prop.addressConfigurationFieldMappings[0].type === 'dropdown' &&
                              !prop.addressConfigurationFieldMappings[0].readOnly && (
                                <FormControl className={classes.formControl}>
                                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                    {prop.levelName}
                                    {prop.addressConfigurationFieldMappings[0].required === 'true' ? <Asterisk /> : ''}
                                  </InputLabel>
                                  <Select
                                    labelId='demo-simple-select-label'
                                    name={prop.addressConfigurationFieldMappings[0].fieldName}
                                    label={prop.levelName}
                                    // key={"select" + i.toString() + j.toString()}
                                    required={
                                      prop.addressConfigurationFieldMappings[0].required === 'true' ? true : false
                                    }
                                    id='demo-simple-select'
                                    value={
                                      formObj[prop.addressConfigurationFieldMappings[0].fieldName]
                                        ? formObj[prop.addressConfigurationFieldMappings[0].fieldName]
                                        : ''
                                    }
                                    error={errorTxtFnc(
                                      'addressData',
                                      prop.addressConfigurationFieldMappings[0].fieldName
                                    )}
                                    onChange={e => {
                                      handleDynamicAddressChange(e, prop.addressConfigurationFieldMappings[0])
                                    }}
                                  >
                                    {prop.addressConfigurationFieldMappings[0].customValuePresent === 'CUSTOM' &&
                                      prop.addressConfigurationFieldMappings[0].sourceList.map((ele: any) => {
                                        return (
                                          <MenuItem key={ele.id} value={ele.id}>
                                            {ele.value}
                                          </MenuItem>
                                        )
                                      })}
                                    {prop.addressConfigurationFieldMappings[0].customValuePresent === 'DYNAMIC' &&
                                      prop.addressConfigurationFieldMappings[0].sourceList.map((ele: any) => {
                                        return (
                                          <MenuItem key={ele.code} value={ele.code}>
                                            {ele.name}
                                          </MenuItem>
                                        )
                                      })}
                                  </Select>
                                  {touched.hasOwnProperty('addressData') &&
                                    touched?.addressData[prop.addressConfigurationFieldMappings[0].fieldName] &&
                                    errors.hasOwnProperty('addressData') &&
                                    errors.addressData[prop.addressConfigurationFieldMappings[0].fieldName] && (
                                      <FormHelperText style={{ color: 'red' }}>
                                        {touched.hasOwnProperty('addressData') &&
                                          touched?.addressData[prop.addressConfigurationFieldMappings[0].fieldName] &&
                                          errors.hasOwnProperty('addressData') &&
                                          errors.addressData[prop.addressConfigurationFieldMappings[0].fieldName]}
                                      </FormHelperText>
                                    )}
                                </FormControl>
                              )}

                            {prop.addressConfigurationFieldMappings[0].type === 'textbox' &&
                              !prop.addressConfigurationFieldMappings[0].readOnly && (
                                <TextField
                                  // required={prop.addressConfigurationFieldMappings[0].required === 'true' ? true : false}
                                  id='standard-basic'
                                  name={prop.addressConfigurationFieldMappings[0].fieldName}
                                  // key={"textfield" + i.toString() + j.toString()}
                                  type={
                                    prop.addressConfigurationFieldMappings[0].dataType === 'numeric' ? 'number' : 'text'
                                  }
                                  value={
                                    formObj[prop.addressConfigurationFieldMappings[0].fieldName]
                                      ? formObj[prop.addressConfigurationFieldMappings[0].fieldName]
                                      : ''
                                  }
                                  onChange={e => {
                                    handleDynamicAddressChange(e, prop.addressConfigurationFieldMappings[0])
                                  }}
                                  error={errorTxtFnc(
                                    'addressData',
                                    prop.addressConfigurationFieldMappings[0].fieldName
                                  )}
                                  helperText={helperTextFnc(
                                    'addressData',
                                    prop.addressConfigurationFieldMappings[0].fieldName
                                  )}
                                  label={
                                    <span>
                                      {prop.levelName}
                                      {prop.addressConfigurationFieldMappings[0].required === 'true' ? (
                                        <Asterisk />
                                      ) : (
                                        ''
                                      )}
                                    </span>
                                  }

                                  // label={prop.levelName}
                                />
                              )}

                            {prop.addressConfigurationFieldMappings[0].type === 'textarea' &&
                              !prop.addressConfigurationFieldMappings[0].readOnly && (
                                <TextField
                                  id='standard-multiline-flexible'
                                  // required={prop.addressConfigurationFieldMappings[0].required === 'true' ? true : false}
                                  multiline
                                  name={prop.addressConfigurationFieldMappings[0].fieldName}
                                  // key={"textarea"+ i.toString() + j.toString()}
                                  maxRows={
                                    prop.addressConfigurationFieldMappings[0].lengthValidation ? Number(prop.size) : 5
                                  }
                                  value={
                                    values.addressData[prop.addressConfigurationFieldMappings[0].fieldName]
                                      ? values.addressData[prop.addressConfigurationFieldMappings[0].fieldName]
                                      : ''
                                  }
                                  onChange={e => {
                                    handleDynamicAddressChange(e, prop.addressConfigurationFieldMappings[0])
                                  }}
                                  error={errorTxtFnc(
                                    'addressData',
                                    prop.addressConfigurationFieldMappings[0].fieldName
                                  )}
                                  helperText={helperTextFnc(
                                    'addressData',
                                    prop.addressConfigurationFieldMappings[0].fieldName
                                  )}
                                  // label={prop.levelName}
                                  label={
                                    <span>
                                      {prop.levelName}
                                      {prop.addressConfigurationFieldMappings[0].required === 'true' ? (
                                        <Asterisk />
                                      ) : (
                                        ''
                                      )}
                                    </span>
                                  }
                                />
                              )}
                            {prop.addressConfigurationFieldMappings[0].readOnly && (
                              <TextField
                                id='standard-basic'
                                name={prop.addressConfigurationFieldMappings[0].fieldName}
                                // key={"disabled"+ i.toString() + j.toString()}
                                value={prop.addressConfigurationFieldMappings[0].defaultValue}
                                // label={prop.levelName}
                                label={
                                  <span>
                                    {prop.levelName}
                                    {prop.addressConfigurationFieldMappings[0].required === 'true' ? <Asterisk /> : ''}
                                  </span>
                                }
                                defaultValue={prop.addressConfigurationFieldMappings[0].defaultValue}
                                disabled={true}
                              />
                            )}
                            {prop.iButtonRequired === 'true' && (
                              <Tooltip title={prop.iButtonMessage} placement='top'>
                                <InfoOutlinedIcon
                                  key={'ico' + i.toString()}
                                  style={{ fontSize: 'medium', marginTop: '23px' }}
                                />
                              </Tooltip>
                            )}
                            {/* </>
                          })} */}
                          </Grid>
                        )
                      })}
                      <Divider />
                    </Grid>
                  )}

                  <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                    <Grid item xs={4}>
                      <TextField
                        id='standard-basic'
                        name='name'
                        value={values.name}
                        // onChange={handleChange}
                        onChange={e => handleNameChange(e)}
                        label={
                          <span>
                            Name
                            <Asterisk />
                          </span>
                        }
                        error={touched.name && Boolean(errors.name)}

                        // helperText={touched.name && errors.name}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        id='standard-basic'
                        name='emailId'
                        value={values.emailId}
                        onChange={handleChange}
                        error={touched.emailId && Boolean(errors.emailId)}
                        // helperText={touched.emailId && errors.emailId}
                        // label="Email"
                        label={
                          <span>
                            Email
                            <Asterisk />
                          </span>
                        }
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        id='standard-basic'
                        name='alternateEmailId'
                        value={values.alternateEmailId}
                        onChange={handleChange}
                        error={touched.alternateEmailId && Boolean(errors.alternateEmailId)}
                        // helperText={touched.alternateEmailId && errors.alternateEmailId}
                        label='Alt. Email'
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={3} style={{ marginBottom: '30px' }}>
                    <Grid item xs={4}>
                      <TextField
                        id='standard-basic'
                        name='contactNo'
                        type='text'
                        onKeyPress={event => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault()
                          }
                        }}
                        value={values.contactNo}
                        onChange={handleChange}
                        error={touched.contactNo && Boolean(errors.contactNo)}
                        // helperText={touched.contactNo && errors.contactNo}
                        label={
                          <span>
                            Contact No.
                            <Asterisk />
                          </span>
                        }
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        id='standard-basic'
                        name='alternateContactNo'
                        type='text'
                        onKeyPress={event => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault()
                          }
                        }}
                        value={values.alternateContactNo}
                        onChange={handleChange}
                        error={touched.alternateContactNo && Boolean(errors.alternateContactNo)}
                        // helperText={touched.alternateContactNo && errors.alternateContactNo}
                        label='Alternate Mobile No.'
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button color='primary' style={{ marginRight: '5px' }} type='submit'>
                        Save and Next
                      </Button>
                      <Button onClick={props.handleClose} className='p-button-text'>
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </div>
            )
          }}
        </Formik>
      </Box>
    </Paper>
  )
}
