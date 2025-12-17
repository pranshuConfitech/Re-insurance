import * as React from 'react'
import { useEffect } from 'react'

import { useParams, useSearchParams } from 'next/navigation'

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
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import 'date-fns'
import { Formik } from 'formik'

import * as yup from 'yup'

import EditConfirmationModal from './modals/edit.client.modal.component'
import { ClientService } from '@/services/remote-api/api/client-services'
import { AddressService } from '@/services/remote-api/api/master-services'
import { PolicyService } from '@/services/remote-api/api/policy-services'

const clientService = new ClientService()

const schemaObject = {
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

let validationSchema: any = yup.object(schemaObject)

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
    margin: theme?.spacing?theme?.spacing(1):'8px',
    minWidth: 120
  },
  formControl1: {
    margin: theme?.spacing?theme?.spacing(1):'8px',
    minWidth: 120,
    maxWidth: 300
  },
  inputRoot: {
    '&$disabled': {
      color: 'black'
    }
  },
  disabled: {}
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
const proposerservice = new PolicyService()

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

export default function AddressDetailsStepComponent(props: any) {
  const { clientDetail } = props
  const classes = useStyles()
  const query = useSearchParams()
  const [prefixes, setPrefixes] = React.useState([])
  const [suffixes, setSuffixes] = React.useState([])
  const params = useParams()
  const id: any = params.id
  const [directorList, setDirectorList] = React.useState([{ name: '', identificationType: '', identificationNo: '' }])
  const [identificationTypes, setIdentificationTypes] = React.useState([])
  const [formObj, setFormObj]: any = React.useState({})
  const [agentAddressForm, setAgentAddressForm] = React.useState({ ...initialValues })
  const [addressConfig, setAddressConfig] = React.useState([])
  const [disableClientData, setDisableClientData] = React.useState(true)
  const [confirmModal, setConfirmModal] = React.useState(false)

  useEffect(() => {
    if (props.addressConfig && props.addressConfig.length !== 0) {
      setAddressConfig(props.addressConfig)

      const frmObj: any = {}

      // let frmLst = {};
      props.addressConfig.forEach((prop: any, i: number) => {
        prop.addressConfigurationFieldMappings.map((field: any, j: number) => {
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

      let newSchema: any = {
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

      /* props.addressConfig.forEach((prop:any, i:number) => {
          prop.addressConfigurationFieldMappings.map((field:any, j:number) => {
            
            
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

  const openConfirmationModal = () => {
    setConfirmModal(true)
  }

  const closeConfirmationModal = (val: string) => {
    if (val === 'yes') {
      setDisableClientData(false)
    }

    setConfirmModal(false)
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

  // useEffect(() => {
  //     populateData();
  // }, [props.selectedClientID]);

  const handleSubmitTwo = (values: any) => {
    if (!disableClientData) {
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
          addresses: addrArr,
          contactPerson: clientDetail.contactPerson,
          directorDetails: directorList
        }
      }

      // clientService.editCient(payloadTwo,id,"2").subscribe(res => {

      // })
      const cid = query.get('clientid')

      props.handleSubmitStepTwo(payloadTwo, cid)
    }

    if (disableClientData) {
      const cid = query.get('clientid')

      if (query.get('mode') === 'create') {
        if (props.proposerID) {
          const pload: any = { clientId: cid }

          if (query.get('invid')) {
            pload['invoiceNumber'] = query.get('invid')
          }

          if (query.get('refid')) {
            pload['referenceNumber'] = query.get('refid')
          }

          if (query.get('recid')) {
            pload['receiptNumber'] = query.get('recid')
          }

          proposerservice.editPolicy(pload, props.proposerID, '2').subscribe(ele => {
            props.handleNext()
          })
        }
      }

      if (query.get('mode') === 'edit') {
        if (id) {
          const pload: any = { clientId: cid }

          if (query.get('invid')) {
            pload['invoiceNumber'] = query.get('invid')
          }

          if (query.get('refid')) {
            pload['referenceNumber'] = query.get('refid')
          }

          if (query.get('recid')) {
            pload['receiptNumber'] = query.get('recid')
          }

          proposerservice.editPolicy(pload, id, '2').subscribe(ele => {
            props.handleNext()
          })
        }
      }
    }
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
    if (query.get('clientid')) {
      const clientID: any = query.get('clientid')
      let frmOb: any = {}

      clientService.getClientDetails(clientID).subscribe(val => {
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
            props.addressConfig.forEach((prop: any, i: number) => {
              prop.addressConfigurationFieldMappings.forEach((field: any, j: number) => {
                if (Object.keys(item.addressDetails)[0] === field.fieldName) {
                  field['value'] = item.addressDetails[field.fieldName]
                }
              })
            })
          })

          props.addressConfig.forEach((prop: any, i: number) => {
            prop.addressConfigurationFieldMappings.map((field: any, j: number) => {
              if (field.type == 'dropdown' && prop.dependOnfields !== null) {
                const arr: any = []
                // const dArr = callAPiFunc(field, prop, arr)

                const word = '{code}'
                let apiURL = field.modifyApiURL

                // dArr.forEach((cd: any) => {
                //   apiURL =
                //     apiURL.slice(0, apiURL.lastIndexOf(word)) + apiURL.slice(apiURL.lastIndexOf(word)).replace(word, cd)
                // })

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
          addressData: frmOb
        })
      })
    }

    if (props.selectedClientID && props.selectedClientID !== '') {
      let frmOb = {}

      clientService.getClientDetails(props.selectedClientID).subscribe(val => {
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
            props.addressConfig.forEach((prop: any, i: number) => {
              prop.addressConfigurationFieldMappings.forEach((field: any, j: number) => {
                if (Object.keys(item.addressDetails)[0] === field.fieldName) {
                  field['value'] = item.addressDetails[field.fieldName]
                }
              })
            })
          })

          props.addressConfig.forEach((prop: any, i: number) => {
            prop.addressConfigurationFieldMappings.map((field: any, j: number) => {
              if (field.type == 'dropdown' && prop.dependOnfields !== null) {
                const arr: any = []
                // const dArr = callAPiFunc(field, prop, arr)

                const word = '{code}'
                let apiURL = field.modifyApiURL

                // dArr.forEach((cd: any) => {
                //   apiURL =
                //     apiURL.slice(0, apiURL.lastIndexOf(word)) + apiURL.slice(apiURL.lastIndexOf(word)).replace(word, cd)
                // })

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
            //
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
          onSubmit={values => {
            handleSubmitTwo(values)
          }}
        >
          {({ errors, touched, handleSubmit, values, handleChange, setValues, setFieldValue }: FormikProps) => {
            const handleDynamicAddressChange = (e: any, field: any, prop?: any) => {
              const { name, value } = e.target

              if (props.addressConfig && props.addressConfig.length !== 0) {
                if (name && value) {
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
                        // const dArr = callAPiFunc(f, p, arr)

                        let apiURL = f.modifyApiURL

                        // dArr.forEach((cd: any) => {
                        //   apiURL =
                        //     apiURL.slice(0, apiURL.lastIndexOf(word)) +
                        //     apiURL.slice(apiURL.lastIndexOf(word)).replace(word, cd)
                        // })
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
                })
              }
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

            return (
              <form onSubmit={handleSubmit} noValidate>
                {props.addressConfig && props.addressConfig.length !== 0 && (
                  <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                    {addressConfig.map((prop: any, i: number) => {
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
                          {prop.addressConfigurationFieldMappings.map((field: any, j: number) => {
                            return (
                              <>
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
                                        handleDynamicAddressChange(e, field, prop)
                                      }}
                                      style={{ marginRight: '8px' }}
                                      disabled={disableClientData}
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
                                    required={field.required === 'true' ? true : false}
                                    error={errorTxtFnc('addressData', field.fieldName)}
                                    helperText={helperTextFnc('addressData', field.fieldName)}
                                    value={formObj[field.fieldName] ? formObj[field.fieldName] : ''}
                                    onChange={e => {
                                      handleDynamicAddressChange(e, field)
                                    }}
                                    style={{ marginTop: '8px' }}
                                    disabled={disableClientData}
                                    InputProps={{
                                      classes: {
                                        root: classes.inputRoot,
                                        disabled: classes.disabled
                                      }
                                    }}
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
                                    error={errorTxtFnc('addressData', field.fieldName)}
                                    helperText={helperTextFnc('addressData', field.fieldName)}
                                    disabled={disableClientData}
                                    InputProps={{
                                      classes: {
                                        root: classes.inputRoot,
                                        disabled: classes.disabled
                                      }
                                    }}
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
                                    disabled={disableClientData}
                                    InputProps={{
                                      readOnly: true,
                                      classes: {
                                        root: classes.inputRoot,
                                        disabled: classes.disabled
                                      }
                                    }}
                                  />
                                )}
                              </>
                            )
                          })}
                        </Grid>
                      ) : (
                        <Grid item xs={4} key={i + 50}>
                          {prop.addressConfigurationFieldMappings.map((field: any, j: number) => {
                            return (
                              <div key={j + 2}>
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
                                      error={errorTxtFnc('addressData', field.fieldName)}
                                      onChange={e => {
                                        handleDynamicAddressChange(e, field, prop)
                                      }}
                                      disabled={disableClientData}
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
                                    required={field.required === 'true' ? true : false}
                                    id='standard-basic'
                                    name={field.fieldName}
                                    type={field.dataType === 'numeric' ? 'number' : 'text'}
                                    value={formObj[field.fieldName] ? formObj[field.fieldName] : ''}
                                    onChange={e => {
                                      handleDynamicAddressChange(e, field)
                                    }}
                                    error={errorTxtFnc('addressData', field.fieldName)}
                                    helperText={helperTextFnc('addressData', field.fieldName)}
                                    label={prop.levelName}
                                    disabled={disableClientData}
                                    InputProps={{
                                      classes: {
                                        root: classes.inputRoot,
                                        disabled: classes.disabled
                                      }
                                    }}
                                  />
                                )}

                                {field.type === 'textarea' && !field.readOnly && (
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
                                    }}
                                    error={errorTxtFnc('addressData', field.fieldName)}
                                    helperText={helperTextFnc('addressData', field.fieldName)}
                                    label={prop.levelName}
                                    disabled={disableClientData}
                                    InputProps={{
                                      classes: {
                                        root: classes.inputRoot,
                                        disabled: classes.disabled
                                      }
                                    }}
                                  />
                                )}
                                {field.readOnly && (
                                  <TextField
                                    id='standard-basic'
                                    name={field.fieldName}
                                    value={field.defaultValue}
                                    label={prop.levelName}
                                    defaultValue={field.defaultValue}
                                    disabled={true}
                                  />
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

                <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                  <Grid item xs={6} style={{ marginBottom: '5px' }}>
                    <span style={{ color: '#4472C4' }}>Contact Person Details</span>
                  </Grid>
                </Grid>
                <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                  <Grid item xs={4}>
                    <TextField
                      id='standard-basic'
                      value={clientDetail.contactPerson.name ?? ''}
                      onChange={handleClientChange}
                      name='name'
                      label='Name'
                      disabled={disableClientData}
                      InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          disabled: classes.disabled
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      id='standard-basic'
                      value={clientDetail.contactPerson.mobileNo ?? ''}
                      onChange={handleClientChange}
                      name='mobileNo'
                      label='Contact No'
                      disabled={disableClientData}
                      InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          disabled: classes.disabled
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      id='standard-basic'
                      value={clientDetail.contactPerson.alternateMobileNo ?? ''}
                      onChange={handleClientChange}
                      name='alternateMobileNo'
                      label='Alt. Contact No'
                      disabled={disableClientData}
                      InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          disabled: classes.disabled
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                  <Grid item xs={4}>
                    <TextField
                      id='standard-basic'
                      value={clientDetail.contactPerson.emailId ?? ''}
                      onChange={handleClientChange}
                      name='emailId'
                      label='Email id'
                      disabled={disableClientData}
                      InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          disabled: classes.disabled
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      id='standard-basic'
                      value={clientDetail.contactPerson.alternateEmailId ?? ''}
                      onChange={handleClientChange}
                      name='alternateEmailId'
                      label='Alt. Email id'
                      disabled={disableClientData}
                      InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          disabled: classes.disabled
                        }
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                  <Grid item xs={6} style={{ marginBottom: '5px', marginTop: '30px' }}>
                    <span style={{ color: '#4472C4' }}>Director Details</span>
                  </Grid>
                </Grid>
                {directorList.map((x, i) => {
                  return (
                    <div key={i + 2}>
                      <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                        <Grid item xs={3}>
                          <TextField
                            id='standard-basic'
                            name='name'
                            value={x.name}
                            onChange={e => handleInputChange(e, i)}
                            label='Director Name'
                            disabled={disableClientData}
                            InputProps={{
                              classes: {
                                root: classes.inputRoot,
                                disabled: classes.disabled
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <InputLabel id='demo-simple-select-label' style={{ width: '50%', marginBottom: '0px' }}>
                            Identification type
                          </InputLabel>
                          <Select
                            style={{ width: '50%' }}
                            labelId='demo-simple-select-label'
                            label='Identification type'
                            id='demo-simple-select'
                            name='identificationType'
                            value={x.identificationType}
                            onChange={e => handleInputChange(e, i)}
                            disabled={disableClientData}
                          >
                            {identificationTypes.map((ele: any) => {
                              return (
                                <MenuItem key={ele.code} value={ele.code}>
                                  {ele.name}
                                </MenuItem>
                              )
                            })}
                          </Select>
                        </Grid>
                        <Grid item xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                          <TextField
                            id='standard-basic'
                            name='identificationNo'
                            value={x.identificationNo}
                            onChange={e => handleInputChange(e, i)}
                            label='identification No'
                            disabled={disableClientData}
                            InputProps={{
                              classes: {
                                root: classes.inputRoot,
                                disabled: classes.disabled
                              }
                            }}
                          />
                          {directorList.length !== 1 && !disableClientData && (
                            <Button
                              className='mr10'
                              onClick={() => handleRemoveClick(i)}
                              style={{ marginLeft: '15px' }}
                              color='secondary'
                            >
                              <DeleteIcon style={{ color: '#dc3545' }} />
                            </Button>
                          )}
                          {directorList.length - 1 === i && !disableClientData && (
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
                  {/* <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="primary" style={{ marginRight: '5px' }} type="submit">
                      Save and Next
                    </Button>
                    {disableClientData && (
                      <Button variant="contained" color="primary" onClick={openConfirmationModal}>
                        Edit Details
                      </Button>
                    )}
                  </Grid> */}
                  <Grid item xs={12}>
                    <EditConfirmationModal
                      confirmModal={confirmModal}
                      closeConfirmationModal={closeConfirmationModal}
                    />
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
