import * as React from 'react'
import { useEffect } from 'react'

import { useParams } from 'next/navigation'

import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Snackbar from '@mui/material/Snackbar'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Alert from '@mui/lab/Alert'
import 'date-fns'
import { Formik } from 'formik'

import * as yup from 'yup'

import { ClientService } from '@/services/remote-api/api/client-services'
import { AddressService } from '@/services/remote-api/api/master-services'

const clientService = new ClientService()

const schemaObject: any = {
  mobileNo: yup.string()['min'](10, 'Must be exactly 10 digit')['max'](10, 'Must be exactly 10 digit'),

  // .matches(new RegExp('[0-9]{10}'),'Contact number is not valid'),
  emailId: yup.string().email('Enter a valid email')

  // alternateMobileNo: yup
  //   .string("Enter your Contact Number")
  //   .test('len', 'Must be exactly 10 digit', val => val.length === 10),
  // .matches(new RegExp('[0-9]{10}'),'Contact number is not valid'),
  // alternateEmailId: yup
  //   .string('Enter your email')
  //   .email('Enter a valid email'),
}

let validationSchema = yup.object(schemaObject)

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
    margin: theme.spacing ? theme.spacing(1) : '8px',
    width: '90%'
  },
  formControl1: {
    margin: theme.spacing ? theme.spacing(1) : '8px',
    minWidth: 120,
    maxWidth: 300
  }
}))

const initialValues = {
  addressData: {}
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

const addressservice = new AddressService()

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

export default function AddressDetailsStepComponent(props: any) {
  const { clientDetail } = props
  const classes = useStyles()
  const [prefixes, setPrefixes] = React.useState([])
  const [suffixes, setSuffixes] = React.useState([])
  const params = useParams()
  const id: any = params.id
  const [directorList, setDirectorList] = React.useState([{ name: '', identificationType: '', identificationNo: '' }])
  const [identificationTypes, setIdentificationTypes] = React.useState([])
  const [formObj, setFormObj]: any = React.useState({})
  const [agentAddressForm, setAgentAddressForm] = React.useState({ ...initialValues })
  const [addressConfig, setAddressConfig] = React.useState([])
  const [checkContact, setCheckContact] = React.useState(false)
  const [checkDuplicateContact, setCheckDuplicateContact] = React.useState(false)

  type FormikProps = {
    errors: any
    touched: any
    handleSubmit: (event: any) => void
    values: any
    handleChange: (e: any) => void
    setValues: (values: any) => void
    setFieldValue: (field: string, value: any) => void
  }
  useEffect(() => {
    if (props.addressConfig.length !== 0) {
      setAddressConfig(props.addressConfig)
      const frmObj: any = {}

      // let frmLst = {};
      props.addressConfig.forEach(
        (
          prop: {
            addressConfigurationFieldMappings: {
              fieldName: string | number
              defaultValue: any
              dependsOn: string
              type: string
              modifyApiURL: any
            }[]
          },
          i: string | number
        ) => {
          prop.addressConfigurationFieldMappings.map(
            (
              field: {
                fieldName: string | number
                defaultValue: any
                dependsOn: string
                type: string
                modifyApiURL: any
              },
              j: string | number
            ) => {
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
            }
          )
        }
      )
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

      props.addressConfig.forEach((prop: { addressConfigurationFieldMappings: any[] }, i: any) => {
        prop.addressConfigurationFieldMappings.map((field, j) => {
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

      /* props.addressConfig.forEach((prop, i) => {
          prop.addressConfigurationFieldMappings.map((field, j) => {
            
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

  const handleClientChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target

    const setClientDetail = (e: any) => {
      props.setClientDetail(e)
    }

    setClientDetail({
      ...clientDetail,
      contactPerson: {
        ...clientDetail.contactPerson,
        [name]: value
      }
    })
  }

  useEffect(() => {
    setPrefixes(props.prefixes)
  }, [props.prefixes])
  useEffect(() => {
    setSuffixes(props.suffixes)
  }, [props.suffixes])
  useEffect(() => {
    setIdentificationTypes(props.identificationTypes)
  }, [props.identificationTypes])
  useEffect(() => {
    setDirectorList(props.directorList)
  }, [props.directorList])

  const handleSubmitTwo = (values: { addressData: any }) => {
    const stepTwoContactPerson = clientDetail.contactPerson

    if (
      (stepTwoContactPerson.mobileNo && stepTwoContactPerson.mobileNo.length !== 10) ||
      (stepTwoContactPerson.alternateMobileNo && stepTwoContactPerson.alternateMobileNo.length !== 10) ||
      (stepTwoContactPerson.emailId &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(stepTwoContactPerson.emailId)) ||
      (stepTwoContactPerson.alternateEmailId &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(stepTwoContactPerson.alternateEmailId))
    ) {
      setCheckContact(true)

      return
    } else if (
      (stepTwoContactPerson.mobileNo && stepTwoContactPerson.mobileNo === stepTwoContactPerson.alternateMobileNo) ||
      (stepTwoContactPerson.emailId && stepTwoContactPerson.emailId === stepTwoContactPerson.alternateEmailId)
    ) {
      setCheckDuplicateContact(true)

      return
    }

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

    const payloadTwo = {
      clientAddress: {
        // addresses: [{
        //     addressDetails: {
        //         addressLine: "address"
        //     },
        //     addressType: "CURRENT_ADDRESS"
        // }, {
        //     addressDetails: {
        //         country: "IND"
        //     },
        //     addressType: "CURRENT_ADDRESS"
        // }, {
        //     addressDetails: {
        //         state: "WB"
        //     },
        //     addressType: "CURRENT_ADDRESS"
        // }],

        addresses: addrArr,
        contactPerson: clientDetail.contactPerson,
        directorDetails: directorList
      }
    }

    // clientService.editCient(payloadTwo,id,"2").subscribe(res => {

    // })
    props.handleSubmitStepTwo(payloadTwo)
  }

  //Director List functions
  const handleInputChange = (e: any, index: number) => {
    const { name, value } = e.target
    const list: any = [...directorList]

    list[index][name] = value
    setDirectorList(list)
  }

  const handleRemoveClick = (index: number) => {
    const list = [...directorList]

    list.splice(index, 1)
    setDirectorList(list)
  }

  const handleAddClick = () => {
    setDirectorList([...directorList, { name: '', identificationType: '', identificationNo: '' }])
  }

  const handleClose = (e: any) => {
    props.handleClose(e)
  }

  const populateData = () => {
    if (id) {
      let frmOb = {}

      clientService.getClientDetails(id).subscribe(val => {
        if (props.addressConfig && props.addressConfig.length !== 0) {
          val.clientAddress.addresses.forEach(addr => {
            frmOb = { ...frmOb, ...addr.addressDetails }
          })
          setFormObj(frmOb)

          // setAgentAddressForm({
          //   ...agentAddressForm,
          //   addressData: {
          //     ...agentAddressForm.addressData,
          //     ...frmOb
          //   }
          // });
          /* formik.setValues({
                  ...formik.values,
                  addressData: {
                    ...formik.values.addressData,
                    ...frmOb
                  }
                }) */

          val.clientAddress.addresses.forEach((item: any) => {
            props.addressConfig.forEach((prop: { addressConfigurationFieldMappings: any[] }, i: any) => {
              prop.addressConfigurationFieldMappings.forEach((field, j) => {
                if (Object.keys(item.addressDetails)[0] === field.fieldName) {
                  field['value'] = item.addressDetails[field.fieldName]
                }
              })
            })
          })

          props.addressConfig.forEach(
            (prop: { addressConfigurationFieldMappings: any[]; dependOnfields: null }, i: string | number) => {
              prop.addressConfigurationFieldMappings.map((field, j) => {
                if (field.type == 'dropdown' && prop.dependOnfields !== null) {
                  const arr: any = []
                  const dArr = callAPiFunc(field, prop, arr)
                  const word = '{code}'
                  let apiURL = field.modifyApiURL

                  dArr.forEach((cd: any) => {
                    apiURL =
                      apiURL.slice(apiURL.lastIndexOf(word)) +
                      apiURL.slice(apiURL.lastIndexOf(word)).replace(word, cd)
                  })

                  addressservice.getSourceList(apiURL).subscribe((res: any) => {
                    const list: any = [...props.addressConfig]

                    list[i].addressConfigurationFieldMappings[j].sourceList = res.content
                    setAddressConfig(list)
                  })
                }
              })
            }
          )
        }

        setAgentAddressForm({
          ...agentAddressForm,
          addressData: frmOb
        })
      })
    }
  }

  const callAPiFunc = (
    field: any,
    prop: { addressConfigurationFieldMappings?: any[]; dependOnfields: any },
    resultarr: any[]
  ) => {
    if (props.addressConfig && props.addressConfig.length !== 0) {
      props.addressConfig.forEach((pr: { addressConfigurationFieldMappings: any; dependOnfields: any }, i: any) => {
        pr.addressConfigurationFieldMappings.forEach((fi: { fieldName: any; value: any }, j: any) => {
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

  const handleContactCheckClose = () => {
    setCheckContact(false)
  }

  const handleDuplicateContactCheckClose = () => {
    setCheckDuplicateContact(false)
  }

  return (
    <Paper elevation={0}>
      <Snackbar open={checkContact} autoHideDuration={6000} onClose={handleContactCheckClose}>
        <Alert onClose={handleContactCheckClose} severity='error' variant='filled'>
          Please enter valid contact number/Email id
        </Alert>
      </Snackbar>
      <Snackbar open={checkDuplicateContact} autoHideDuration={6000} onClose={handleDuplicateContactCheckClose}>
        <Alert onClose={handleDuplicateContactCheckClose} severity='error' variant='filled'>
          Alternate contact/Email can not be same with the priamry contact/email
        </Alert>
      </Snackbar>
      <Box p={3} my={2}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...agentAddressForm
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            handleSubmitTwo(values)
          }}
        >
          {({ errors, touched, handleSubmit, values, handleChange, setValues, setFieldValue }: FormikProps) => {
            const handleDynamicAddressChange = (
              e:
                | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                | (Event & { target: { value: any; name: string } }),
              field: { type: string; fieldName: any },
              prop?: any
            ) => {
              const { name, value } = e.target

              if (props.addressConfig && props.addressConfig.length !== 0) {
                if (name) {
                  setFormObj({
                    ...formObj,
                    [name]: value
                  })

                  props.addressConfig.forEach(
                    (p: { addressConfigurationFieldMappings: any; dependOnfields: any }, i: string | number) => {
                      p.addressConfigurationFieldMappings.map((f: { modifyApiURL: any }, j: string | number) => {
                        if (field.type == 'dropdown' && p.dependOnfields !== null) {
                          if (p.dependOnfields[0] === field.fieldName) {
                            const word = '{code}'
                            const arr: any = []
                            const dArr = callAPiFunc(f, p, arr)
                            let apiURL = f.modifyApiURL

                            dArr.forEach(cd => {
                              apiURL =
                                apiURL.slice(apiURL.lastIndexOf(word)) +
                                apiURL.slice(apiURL.lastIndexOf(word)).replace(word, cd)
                            })
                            addressservice.getSourceList(apiURL).subscribe((res: any) => {
                              const list: any = [...addressConfig]

                              list[i].addressConfigurationFieldMappings[j].sourceList = res.content
                              setAddressConfig(list)
                            })

                            // if (prop.dependOnfields !== null) {

                            //     let apiURL = f.modifyApiURL;
                            //     let u = prop.dependOnfields[0];
                            //     let pcode = formObj[u];
                            //     apiURL = apiURL.slice(0, apiURL.lastIndexOf(word)) + apiURL.slice(apiURL.lastIndexOf(word)).replace(word, value);
                            //     apiURL = apiURL.slice(0, apiURL.lastIndexOf(word)) + apiURL.slice(apiURL.lastIndexOf(word)).replace(word, pcode);
                            //     addressservice.getSourceList(apiURL).subscribe(res => {
                            //         const list = [...addressConfig];
                            //         list[i].addressConfigurationFieldMappings[j].sourceList = res;
                            //         setAddressConfig(list);
                            //     })
                            // }
                            // if (prop.dependOnfields === null) {
                            //     let url = f.modifyApiURL.replace('{code}', value);
                            //     addressservice.getSourceList(url).subscribe(res => {
                            //         const list = [...addressConfig];
                            //         list[i].addressConfigurationFieldMappings[j].sourceList = res;
                            //         setAddressConfig(list);
                            //     })
                            // }
                          }
                        }
                      })
                    }
                  )
                }

                props.addressConfig.forEach((p: { addressConfigurationFieldMappings: any[] }, i: any) => {
                  p.addressConfigurationFieldMappings.map((f, j) => {
                    if (f.fieldName === name) {
                      f['value'] = value
                    }
                  })
                })

                props.addressConfig.forEach(
                  (p: { addressConfigurationFieldMappings: any; dependOnfields: any }, i: string | number) => {
                    p.addressConfigurationFieldMappings.map((f: { modifyApiURL: any }, j: string | number) => {
                      if (field.type == 'dropdown' && p.dependOnfields !== null) {
                        if (p.dependOnfields[0] === field.fieldName) {
                          const word = '{code}'
                          const arr: any = []
                          const dArr = callAPiFunc(f, p, arr)
                          let apiURL = f.modifyApiURL

                          dArr.forEach(cd => {
                            apiURL =
                              apiURL.slice(apiURL.lastIndexOf(word)) +
                              apiURL.slice(apiURL.lastIndexOf(word)).replace(word, cd)
                          })
                          addressservice.getSourceList(apiURL).subscribe((res: any) => {
                            const list: any = [...addressConfig]

                            list[i].addressConfigurationFieldMappings[j].sourceList = res.content
                            setAddressConfig(list)
                          })

                          // if (prop.dependOnfields !== null) {

                          //     let apiURL = f.modifyApiURL;
                          //     let u = prop.dependOnfields[0];
                          //     let pcode = formObj[u];
                          //     apiURL = apiURL.slice(0, apiURL.lastIndexOf(word)) + apiURL.slice(apiURL.lastIndexOf(word)).replace(word, value);
                          //     apiURL = apiURL.slice(0, apiURL.lastIndexOf(word)) + apiURL.slice(apiURL.lastIndexOf(word)).replace(word, pcode);
                          //     addressservice.getSourceList(apiURL).subscribe(res => {
                          //         const list = [...addressConfig];
                          //         list[i].addressConfigurationFieldMappings[j].sourceList = res;
                          //         setAddressConfig(list);
                          //     })
                          // }
                          // if (prop.dependOnfields === null) {
                          //     let url = f.modifyApiURL.replace('{code}', value);
                          //     addressservice.getSourceList(url).subscribe(res => {
                          //         const list = [...addressConfig];
                          //         list[i].addressConfigurationFieldMappings[j].sourceList = res;
                          //         setAddressConfig(list);
                          //     })
                          // }
                        }
                      }
                    })
                  }
                )
              }
            }

            const errorTxtFnc = (parentField: PropertyKey, field: string | number) => {
              return (
                touched.hasOwnProperty(parentField) &&
                touched[parentField][field] &&
                Boolean(errors.hasOwnProperty(parentField) && errors[parentField][field])
              )
            }

            const helperTextFnc = (parentField: string, field: string | number) => {
              return (
                !formObj[field] &&
                touched.hasOwnProperty(parentField) &&
                touched[parentField][field] &&
                errors.hasOwnProperty(parentField) &&
                errors[parentField][field]
              )
            }

            return (
              <form onSubmit={handleSubmit} noValidate>
                {props.addressConfig && props.addressConfig.length !== 0 && (
                  <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                    {addressConfig.map((prop: any, i: number) => {
                      return prop.addressConfigurationFieldMappings.length !== 1 ? (
                        <Grid item xs={6}>
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
                              <div key={`addressConfigurationFieldMappings-${j}`}>
                                {field.type === 'dropdown' && !field.readOnly && (
                                  <FormControl className={classes.formControl}>
                                    <Select
                                      labelId='demo-simple-select-label'
                                      name={field.fieldName}
                                      id='demo-simple-select'
                                      // required={field.required === 'true' ? true : false}
                                      // error={errorTxtFnc('addressData', field.fieldName)}
                                      value={formObj[field.fieldName] ? formObj[field.fieldName] : ''}
                                      onChange={e => {
                                        handleDynamicAddressChange(e, field)
                                        setFieldValue(`addressData[${field.fieldName}]`, e.target.value)
                                        handleChange(e)
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
                                    {!formObj[field.fieldName] &&
                                      touched.addressData &&
                                      touched?.addressData[field.fieldName] &&
                                      errors.addressData &&
                                      errors.addressData[field.fieldName] && (
                                        <FormHelperText style={{ color: 'red' }}>
                                          {touched.addressData &&
                                            touched?.addressData[field.fieldName] &&
                                            errors.addressData &&
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
                                    required={field.required === 'true' ? true : false}
                                    error={errorTxtFnc('addressData', field.fieldName)}
                                    helperText={helperTextFnc('addressData', field.fieldName)}
                                    value={formObj[field.fieldName] ? formObj[field.fieldName] : ''}
                                    onChange={e => {
                                      handleDynamicAddressChange(e, field)
                                      setFieldValue(`addressData[${field.fieldName}]`, e.target.value)
                                      handleChange(e)
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
                                      setFieldValue(`addressData[${field.fieldName}]`, e.target.value)
                                      handleChange(e)
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
                                    style={{ marginTop: '10px', marginRight: '8px', width: '15%' }}
                                    size='small'
                                  />
                                )}
                              </div>
                            )
                          })}
                        </Grid>
                      ) : (
                        <Grid item xs={12} sm={6} md={3}>
                          {prop.addressConfigurationFieldMappings.map(
                            (
                              field: {
                                type: any
                                readOnly?: any
                                fieldName: any
                                required?: any
                                customValuePresent?: any
                                sourceList?: any
                                dataType?: any
                                lengthValidation?: any
                                defaultValue?: any
                              },
                              j: any
                            ) => {
                              return (
                                <div key={`addressConfigurationFieldMappings2-${j}`}>
                                  {field.type === 'dropdown' && !field.readOnly && (
                                    <FormControl className={classes.formControl}>
                                      <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                        {prop.levelName}
                                      </InputLabel>
                                      <Select
                                        labelId='demo-simple-select-label'
                                        label={prop.levelName}
                                        name={field.fieldName}
                                        required={field.required === 'true' ? true : false}
                                        id='demo-simple-select'
                                        value={formObj[field.fieldName] ? formObj[field.fieldName] : ''}
                                        // error={errorTxtFnc('addressData', field.fieldName)}
                                        onChange={e => {
                                          handleChange(e)
                                          setFieldValue(`addressData[${field.fieldName}]`, e.target.value)
                                          handleDynamicAddressChange(e, field, prop)
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
                                          field.sourceList &&
                                          field.sourceList.length !== 0 &&
                                          field.sourceList.map((ele: any) => {
                                            return (
                                              <MenuItem key={ele.code} value={ele.code}>
                                                {ele.name}
                                              </MenuItem>
                                            )
                                          })}
                                      </Select>
                                      {!formObj[field.fieldName] &&
                                        touched.addressData &&
                                        touched?.addressData[field.fieldName] &&
                                        errors.addressData &&
                                        errors.addressData[field.fieldName] && (
                                          <FormHelperText style={{ color: 'red' }}>
                                            {touched.addressData &&
                                              touched?.addressData[field.fieldName] &&
                                              errors.addressData &&
                                              errors.addressData[field.fieldName]}
                                          </FormHelperText>
                                        )}
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
                                        onInput={(e: any) => {
                                          handleDynamicAddressChange(e, field)
                                          setFieldValue(`addressData[${field.fieldName}]`, e.target.value)
                                          handleChange(e)
                                        }}
                                        // error={errorTxtFnc('addressData', field.fieldName)}
                                        helperText={helperTextFnc('addressData', field.fieldName)}
                                        label={prop.levelName}
                                      />
                                    </FormControl>
                                  )}

                                  {field.type === 'textarea' && !field.readOnly && (
                                    <FormControl className={classes.formControl}>
                                      <TextField
                                        id='standard-multiline-flexible'
                                        required={field.required === 'true' ? true : false}
                                        multiline
                                        name={field.fieldName}
                                        maxRows={field.lengthValidation ? Number(prop.size) : 5}
                                        value={
                                          values.addressData[field.fieldName] ? values.addressData[field.fieldName] : ''
                                        }
                                        onChange={e => {
                                          handleDynamicAddressChange(e, field)
                                          setFieldValue(`addressData[${field.fieldName}]`, e.target.value)
                                          handleChange(e)
                                        }}
                                        // error={errorTxtFnc('addressData', field.fieldName)}
                                        helperText={helperTextFnc('addressData', field.fieldName)}
                                        label={prop.levelName}
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
                                      <InfoOutlinedIcon
                                        style={{ fontSize: 'medium', marginTop: '23px', marginLeft: '-23px' }}
                                      />
                                    </Tooltip>
                                  )}
                                </div>
                              )
                            }
                          )}
                        </Grid>
                      )
                    })}
                    <Divider />
                  </Grid>
                )}

                <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                  <Grid item xs={6} style={{ marginBottom: '5px' }}>
                    <span style={{ color: '#4472C4' }}>Contact Person Details</span>
                  </Grid>
                </Grid>
                <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id='standard-basic'
                        onInput={(e: any) => {
                          e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')
                        }}
                        value={clientDetail.contactPerson.name}
                        onChange={handleClientChange}
                        name='name'
                        label='Name'
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id='standard-basic'
                        type='text'
                        onKeyPress={event => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault()
                          }
                        }}
                        value={clientDetail.contactPerson.mobileNo}
                        onChange={handleClientChange}
                        name='mobileNo'
                        label='Contact No'
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id='standard-basic'
                        type='text'
                        onKeyPress={event => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault()
                          }
                        }}
                        value={clientDetail.contactPerson.alternateMobileNo}
                        onChange={handleClientChange}
                        name='alternateMobileNo'
                        label='Alt. Contact No'
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id='standard-basic'
                        value={clientDetail.contactPerson.emailId}
                        onChange={handleClientChange}
                        name='emailId'
                        label='Email id'
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id='standard-basic'
                        value={clientDetail.contactPerson.alternateEmailId}
                        onChange={handleClientChange}
                        name='alternateEmailId'
                        label='Alt. Email id'
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                  <Grid item xs={6} style={{ marginBottom: '5px', marginTop: '30px' }}>
                    <span style={{ color: '#4472C4' }}>Director Details</span>
                  </Grid>
                </Grid>
                {directorList.map((x, i) => {
                  return (
                    <div key={`directorList-${i}`}>
                      <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                        <Grid item xs={12} sm={6} md={3}>
                          <FormControl className={classes.formControl}>
                            <TextField
                              id='standard-basic'
                              name='name'
                              value={x.name}
                              onInput={(e: any) => {
                                e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')
                              }}
                              onChange={e => handleInputChange(e, i)}
                              label='Director Name'
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <FormControl className={classes.formControl}>
                            <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                              Identification type
                            </InputLabel>
                            <Select
                              labelId='demo-simple-select-label'
                              id='demo-simple-select'
                              label='Identification type'
                              name='identificationType'
                              value={x.identificationType}
                              onChange={e => handleInputChange(e, i)}
                            >
                              {identificationTypes.map((ele: any) => {
                                return (
                                  <MenuItem key={ele.code} value={ele.code}>
                                    {ele.name}
                                  </MenuItem>
                                )
                              })}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                          <FormControl className={classes.formControl}>
                            <TextField
                              id='standard-basic'
                              name='identificationNo'
                              value={x.identificationNo}
                              onChange={e => handleInputChange(e, i)}
                              label='Identification No'
                            />
                          </FormControl>
                          {directorList.length !== 1 && (
                            <Button
                              className='mr10 p-button-danger'
                              onClick={() => handleRemoveClick(i)}
                              style={{ marginLeft: '15px' }}
                              color='secondary'
                            >
                              <DeleteIcon />
                            </Button>
                          )}
                          {directorList.length - 1 === i && (
                            <Button color='primary' style={{ marginLeft: '10px' }} onClick={handleAddClick}>
                              <AddIcon />
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                      <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                        <Grid item xs={4}></Grid>
                      </Grid>
                    </div>
                  )
                })}
                <Grid container spacing={3} style={{ marginTop: '20px' }}>
                  <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button color='secondary' style={{ marginRight: '5px' }} type='submit'>
                      Save and Next
                    </Button>
                    <Button color='primary' className='p-button-text' onClick={handleClose}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )
          }}
        </Formik>
      </Box>
    </Paper>
  )
}
