'use client'
import React, { useEffect } from 'react'

import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
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

// import ChipInput from "material-ui-chip-input";

import { Button } from 'primereact/button'

import Chip from '@mui/material/Chip'
import Autocomplete from '@mui/lab/Autocomplete'

import { FettleDragNDrop } from '../../shared-component/components/fettle.drag-drop'
import {
  AddressService,
  ParameterDataTypeService,
  ParameterRenderTypeService,
  SourcesService
} from '@/services/remote-api/api/master-services'

const datatypeservice = new ParameterDataTypeService()
const rendertypeservice = new ParameterRenderTypeService()
const sourcetypeservice = new SourcesService()
const addressservice = new AddressService()

const dts$ = datatypeservice.getParameterDataTypes()
const rts$ = rendertypeservice.getParameterRenderTypes()
const addr$ = addressservice.getAddressConfig()
const src$ = sourcetypeservice.getSources()

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
    minWidth: 182
  }
}))

export default function DynamicAddressComponent(props: any) {
  const classes = useStyles()
  const [fieldList, setFieldList]: any = React.useState([])
  const [renderTypeList, setRenderTypeList] = React.useState([])
  const [datatypeList, setDataTypeList] = React.useState([])
  const [sourceList, setSourceList] = React.useState([])
  const [fieldOptions, setFieldOptions] = React.useState([])

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
        const arr: any = []

        if (result.length !== 0) {
          result.forEach((ad: any, i: number) => {
            ad['iButtonRequired'] = ad.iButtonRequired === 'true' ? true : false
            ad['selectedDependsOnField'] = ad.dependOnfields
            ad.addressConfigurationFieldMappings.forEach((acf: any, j: any) => {
              acf['required'] = acf.required === 'true' ? true : false
              acf['spacialCharacterValidation'] = acf.spacialCharacterValidation === 'true' ? true : false
              acf['lengthValidation'] = acf.lengthValidation === 'true' ? true : false
              acf['readonly'] = acf.readonly === 'true' ? true : false
              acf['dependsOnChecked'] = acf.dependsOn !== '' && ad.dependsOn !== null ? true : false
              arr.push({ id: 'item' + i + j, val: acf.fieldName })
            })
          })
        }

        setFieldOptions(arr)
        setter(result)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(dts$, setDataTypeList)
  useObservable(rts$, setRenderTypeList)
  useObservable(src$, setSourceList)
  useObservable1(addr$, setFieldList)

  const addNewField = (e: any) => {
    const field = {
      entityId: 'item' + fieldList.length,
      levelName: '',
      iButtonRequired: false,
      iButtonMessage: '',
      dependOnfields: [],
      selectedDependsOnField: '',
      addressConfigurationFieldMappings: [
        {
          fieldName: '',
          type: '',
          required: false,
          dataType: '',
          customValuePresent: '',
          addressConfigurationFieldCustomValueMappings: [],
          sourceId: '',
          dependsOnChecked: false,
          dependsOn: '',
          size: '',
          spacialCharacterValidation: false,
          lengthValidation: false,
          readonly: false,
          defaultValue: ''
        }
      ]
    }

    setFieldList([...fieldList, field])
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

    list[index][name] = checked

    if (name === 'iButtonRequired' && !checked) {
      list[index]['iButtonMessage'] = ''
    }

    setFieldList(list)
  }

  const handleAddfieldProps = (i: any) => {
    const fieldprop: any = {
      fieldName: '',
      type: '',
      required: false,
      dataType: '',
      customValuePresent: '',
      addressConfigurationFieldCustomValueMappings: [],
      sourceId: '',
      dependsOnChecked: false,
      dependsOn: '',
      size: '',
      spacialCharacterValidation: false,
      lengthValidation: false,
      readonly: false,
      defaultValue: ''
    }

    const fl: any = [...fieldList]

    fl[i].addressConfigurationFieldMappings.push(fieldprop)
    setFieldList(fl)

    // let fieldArr = [...fieldOptions];
    // fieldArr.push({label:fieldName,value:fieldName});
    // setFieldOptions(fieldArr)
  }

  const handleFieldPropChange = (e: any, i: number, j: number) => {
    const { name, value } = e.target
    const list: any = [...fieldList]

    list[i].addressConfigurationFieldMappings[j][name] = value

    // DROPDOWN
    if (name === 'type' && value === 'dropdown') {
      list[i].addressConfigurationFieldMappings[j]['dataType'] = ''
      list[i].addressConfigurationFieldMappings[j]['size'] = ''
      list[i].addressConfigurationFieldMappings[j]['lengthValidation'] = false
      list[i].addressConfigurationFieldMappings[j]['spacialCharacterValidation'] = false
    }

    // TEXTBOX
    if (name === 'type' && value === 'textbox') {
      list[i].addressConfigurationFieldMappings[j]['sourceId'] = ''
      list[i].addressConfigurationFieldMappings[j]['dependsOnChecked'] = false
      list[i].addressConfigurationFieldMappings[j]['dependsOn'] = ''
      list[i].addressConfigurationFieldMappings[j]['customValuePresent'] = ''
      list[i].addressConfigurationFieldMappings[j]['addressConfigurationFieldCustomValueMappings'] = []
      list[i].addressConfigurationFieldMappings[j]['size'] = ''
      list[i].addressConfigurationFieldMappings[j]['lengthValidation'] = false
      list[i].addressConfigurationFieldMappings[j]['spacialCharacterValidation'] = false
    }

    //TEXTAREA
    if (name === 'type' && value === 'textarea') {
      list[i].addressConfigurationFieldMappings[j]['dataType'] = ''
      list[i].addressConfigurationFieldMappings[j]['sourceId'] = ''
      list[i].addressConfigurationFieldMappings[j]['dependsOnChecked'] = false
      list[i].addressConfigurationFieldMappings[j]['dependsOn'] = ''
      list[i].addressConfigurationFieldMappings[j]['customValuePresent'] = ''
      list[i].addressConfigurationFieldMappings[j]['addressConfigurationFieldCustomValueMappings'] = []
      list[i].addressConfigurationFieldMappings[j]['size'] = ''
      list[i].addressConfigurationFieldMappings[j]['lengthValidation'] = false
      list[i].addressConfigurationFieldMappings[j]['spacialCharacterValidation'] = false
    }

    //CUSTOM/DYNAMIC
    if (name === 'customValuePresent') {
      if (value === 'CUSTOM') {
        list[i].addressConfigurationFieldMappings[j]['sourceId'] = ''
        list[i].addressConfigurationFieldMappings[j]['dependsOn'] = ''
        list[i].addressConfigurationFieldMappings[j]['dependsOnChecked'] = false
      } else {
        list[i].addressConfigurationFieldMappings[j]['addressConfigurationFieldCustomValueMappings'] = []
      }
    }

    if (name === 'fieldName') {
      const fieldid = 'field' + i + j
      const fldOps: any = [...fieldOptions]
      const a = fldOps.some((el: any) => el.id === fieldid)

      if (a) {
        fldOps.forEach((ele: any) => {
          if (ele.id === fieldid) {
            ele.val = value
          }
        })
        setFieldOptions(fldOps)
      }

      if (!a) {
        fldOps.push({ id: fieldid, val: value })
        setFieldOptions(fldOps)
      }
    }

    setFieldList(list)
  }

  const handleFieldPropChecked = (e: any, i: number, j: number) => {
    const { name, checked } = e.target
    const list: any = [...fieldList]

    list[i].addressConfigurationFieldMappings[j][name] = checked

    if (name === 'dependsOnChecked' && !checked) {
      list[i].addressConfigurationFieldMappings[j]['dependsOn'] = ''
    }

    if (name === 'lengthValidation' && !checked) {
      list[i].addressConfigurationFieldMappings[j]['size'] = ''
    }

    if (name === 'readOnly' && !checked) {
      list[i].addressConfigurationFieldMappings[j]['defaultValue'] = ''
    }

    setFieldList(list)
  }

  const handleRemoveFieldProp = (i: number, j: number) => {
    const list: any = [...fieldList]

    list[i].addressConfigurationFieldMappings.splice(j, 1)
    setFieldList(list)
  }

  const handleRemoveField = (index: number) => {
    const list = [...fieldList]

    list.splice(index, 1)
    setFieldList(list)
  }

  const handleAddChip = (chip: any, i: number, j: number) => {
    const list: any = [...fieldList]

    list[i].addressConfigurationFieldMappings[j].addressConfigurationFieldCustomValueMappings.push(chip)
    setFieldList(list)
  }

  const handleDeleteChip = (chip: any, index: number, i: number, j: number) => {
    const list: any = [...fieldList]

    list[i].addressConfigurationFieldMappings[j].addressConfigurationFieldCustomValueMappings.splice(index, 1)
    setFieldList(list)
  }

  const saveConfigurations = () => {
    fieldList.forEach((val: any, index: number) => {
      val['order'] = (index + 1).toString()
      val['iButtonRequired'] = val['iButtonRequired'].toString()

      if (val.selectedDependsOnField !== '') {
        if (!val?.selectedDependsOnField || val?.selectedDependsOnField[0] === 'null') {
          val['dependOnfields'] = null
        } else {
          val['dependOnfields'] = [val.selectedDependsOnField]
        }
      }

      // delete val.selectedDependsOnField;
      val.addressConfigurationFieldMappings.forEach((ele: any, j: number) => {
        ele['internalOrder'] = (j + 1).toString()
        ele['dependsOnChecked'] = ele['dependsOnChecked'].toString()
        ele['lengthValidation'] = ele['lengthValidation'].toString()
        ele['readonly'] = ele['readonly'].toString()
        ele['required'] = ele['required'].toString()
        ele['spacialCharacterValidation'] = ele['spacialCharacterValidation'].toString()

        // delete ele.readonly;
        // delete ele.dependsOnChecked;
        if (ele.addressConfigurationFieldCustomValueMappings.length !== 0) {
          const customvalarr = ele.addressConfigurationFieldCustomValueMappings.map((custVal: any) => {
            return { value: custVal }
          })

          ele.addressConfigurationFieldCustomValueMappings = customvalarr
        }
      })
    })
    addressservice.saveAddress(fieldList).subscribe((res: any) => {
      if (res.id) {
        window.location.reload()
      }
    })
  }

  const onDragEnd = (data: any) => {
    setFieldList(data)
  }

  return (
    <Paper elevation={0}>
      <Box p={3} my={2}>
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          <Button color='primary' onClick={addNewField}>
            + Add new field
          </Button>
        </Grid>
        <FettleDragNDrop items={fieldList} onChange={onDragEnd}>
          <div>
            {fieldList.map((x: any, i: number) => {
              return (
                <div key={x.entityId || i} id={x.entityId}>
                  <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                    <Grid item xs={12} container spacing={3} style={{ marginBottom: '20px' }}>
                      <Grid item xs={3}>
                        <TextField
                          id='standard-basic'
                          name='levelName'
                          value={x.levelName || ''}
                          onChange={e => handleField(e, i)}
                          label='Field label'
                        />
                      </Grid>
                      <Grid item xs={3}>
                        {x.iButtonRequired ? (
                          <TextField
                            id='standard-basic'
                            name='iButtonMessage'
                            value={x.iButtonMessage || ''}
                            onChange={e => handleField(e, i)}
                            label='i Button text'
                          />
                        ) : null}

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={x.iButtonRequired}
                              onChange={e => handleFieldChecked(e, i)}
                              name='iButtonRequired'
                              color='primary'
                            />
                          }
                          label='i button required'
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <FormControl className={classes.formControl}>
                          <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                            Depends on Field
                          </InputLabel>
                          <Select
                            labelId='demo-simple-select-label'
                            id='demo-simple-select'
                            label='Depends on Field'
                            name='selectedDependsOnField'
                            value={x.selectedDependsOnField || ''}
                            onChange={e => handleField(e, i)}
                          >
                            {fieldOptions.map((ele: any, index: number) => {
                              return (
                                <MenuItem key={ele.val || index} value={ele.val}>
                                  {ele.val}
                                </MenuItem>
                              )
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={3} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {/* <Button color="secondary" variant="contained" onClick={() => {handleRemoveField(i)}}>Delete field</Button> */}
                        {fieldList.length !== 1 && (
                          <Tooltip title='Delete Field' placement='top'>
                            <span>
                              <Button
                                className='mr10 p-button-danger'
                                onClick={() => handleRemoveField(i)}
                                color='secondary'
                                style={{ marginLeft: '5px', height: '40px' }}
                                disabled={true}
                              >
                                <DeleteIcon />
                              </Button>
                            </span>
                          </Tooltip>
                        )}
                        {fieldList.length - 1 === i && (
                          <Tooltip title='Add Field' placement='top'>
                            <span>
                              <Button
                                color='primary'
                                style={{ marginLeft: '5px', height: '40px' }}
                                onClick={addNewField}
                                disabled={true}
                              >
                                <AddIcon />
                              </Button>
                            </span>
                          </Tooltip>
                        )}
                      </Grid>
                    </Grid>
                    {x.addressConfigurationFieldMappings.map((y: any, j: number) => {
                      return (
                        <Grid key={j} item xs={12} container spacing={3} style={{ marginBottom: '20px' }}>
                          <Grid item xs={2}>
                            <TextField
                              id='standard-basic'
                              name='fieldName'
                              value={y.fieldName || ''}
                              // placeholder="enter a unique name without space"
                              onChange={e => handleFieldPropChange(e, i, j)}
                              label='Field name'
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <FormControl className={classes.formControl}>
                              <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                Field type
                              </InputLabel>
                              <Select
                                labelId='demo-simple-select-label'
                                id='demo-simple-select'
                                label='Field type'
                                name='type'
                                value={y.type || ''}
                                onChange={e => handleFieldPropChange(e, i, j)}
                                style={{ marginRight: '1%', width: '80%' }}
                              >
                                {renderTypeList.map((ele: any) => {
                                  return (
                                    <MenuItem key={ele.type} value={ele.type}>
                                      {ele.name}
                                    </MenuItem>
                                  )
                                })}
                              </Select>
                            </FormControl>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={y.required}
                                  onChange={e => handleFieldPropChecked(e, i, j)}
                                  name='required'
                                  color='primary'
                                />
                              }
                              label='required field'
                            />
                          </Grid>
                          {/* TEXTBOX */}
                          {y.type === 'textbox' && (
                            <Grid item xs={2}>
                              <FormControl className={classes.formControl}>
                                <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                  Data type
                                </InputLabel>
                                <Select
                                  labelId='demo-simple-select-label'
                                  id='demo-simple-select'
                                  name='dataType'
                                  label='Data type'
                                  value={y.dataType || ''}
                                  onChange={e => handleFieldPropChange(e, i, j)}
                                  style={{ marginRight: '1%', width: '80%' }}
                                >
                                  {datatypeList.map((ele: any) => {
                                    return (
                                      <MenuItem key={ele.type} value={ele.type}>
                                        {ele.name}
                                      </MenuItem>
                                    )
                                  })}
                                </Select>
                              </FormControl>
                            </Grid>
                          )}

                          {/* DROPDOWN */}
                          {y.type === 'dropdown' && (
                            <>
                              <Grid item xs={2}>
                                <FormControl className={classes.formControl}>
                                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                    Source type
                                  </InputLabel>
                                  <Select
                                    labelId='demo-simple-select-label'
                                    id='demo-simple-select'
                                    name='customValuePresent'
                                    label='Source type'
                                    value={y.customValuePresent || ''}
                                    onChange={e => handleFieldPropChange(e, i, j)}
                                    style={{ marginRight: '1%', width: '80%' }}
                                  >
                                    {/* {identificationTypes.map((ele) => {
                                            return <MenuItem value={ele.code}>{ele.name}</MenuItem>;
                                        })} */}
                                    <MenuItem value='CUSTOM'>CUSTOM</MenuItem>
                                    <MenuItem value='DYNAMIC'>DYNAMIC</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              {y.customValuePresent === 'DYNAMIC' && (
                                <>
                                  <Grid item xs={2}>
                                    <FormControl className={classes.formControl}>
                                      <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                        Data Source
                                      </InputLabel>
                                      <Select
                                        labelId='demo-simple-select-label'
                                        id='demo-simple-select'
                                        name='sourceId'
                                        label='Data Source'
                                        value={y.sourceId || ''}
                                        onChange={e => handleFieldPropChange(e, i, j)}
                                        style={{ marginRight: '1%', width: '80%' }}
                                      >
                                        {sourceList.map((ele: any) => {
                                          return (
                                            <MenuItem key={ele.id} value={ele.id}>
                                              {ele.name}
                                            </MenuItem>
                                          )
                                        })}
                                      </Select>
                                    </FormControl>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={y.dependsOnChecked}
                                          onChange={e => handleFieldPropChecked(e, i, j)}
                                          name='dependsOnChecked'
                                          color='primary'
                                        />
                                      }
                                      label='depends on'
                                    />
                                  </Grid>

                                  {y.dependsOnChecked && (
                                    <Grid item xs={2}>
                                      <FormControl className={classes.formControl}>
                                        <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                          Depends on
                                        </InputLabel>
                                        <Select
                                          labelId='demo-simple-select-label'
                                          id='demo-simple-select'
                                          name='dependsOn'
                                          label='Depends on'
                                          value={y.dependsOn || ''}
                                          onChange={e => handleFieldPropChange(e, i, j)}
                                          style={{ marginRight: '1%', width: '80%' }}
                                        >
                                          {sourceList.map((ele: any) => {
                                            return (
                                              <MenuItem key={ele.id} value={ele.id}>
                                                {ele.name}
                                              </MenuItem>
                                            )
                                          })}
                                        </Select>
                                      </FormControl>
                                    </Grid>
                                  )}
                                </>
                              )}

                              {y.customValuePresent === 'CUSTOM' && (
                                // <ChipInput
                                //     required
                                //     label="Data Source"
                                //     value={y.addressConfigurationFieldCustomValueMappings}
                                //     onAdd={(chip:any) => handleAddChip(chip, i, j)}
                                //     onDelete={(chip:any, index:number) => handleDeleteChip(chip, index, i, j)}
                                //     style={{ marginRight:"1%", width:"80%" }}
                                // />
                                <Autocomplete
                                  multiple
                                  freeSolo
                                  options={[]}
                                  value={y.addressConfigurationFieldCustomValueMappings || ''}
                                  style={{ marginRight: '1%', width: '80%' }}
                                  onChange={(event, newValue) => {
                                    const list = [...fieldList]

                                    list[i].addressConfigurationFieldMappings[
                                      j
                                    ].addressConfigurationFieldCustomValueMappings = newValue
                                    setFieldList(list)
                                  }}
                                  renderTags={(value, getTagProps) =>
                                    value.map((option: any, index: number) => {
                                      const { key, ...tagProps } = getTagProps({ index }) // Extract key explicitly

                                      return <Chip key={key} label={option} {...tagProps} />
                                    })
                                  }
                                  renderInput={params => <TextField required {...params} label='Data Source' />}
                                />

                                //     <Select
                                //     labelId="Data Source"
                                //     multiple
                                //     required
                                //     value={y.addressConfigurationFieldCustomValueMappings}
                                //     onChange={(event:any) => handleAddChip(event.target.value, i, j)}
                                //     renderValue={(selected) => (
                                //       <div style={{marginRight:"1%", display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                //         {(selected as string[]).map((value,index) => (
                                //           <Chip
                                //             key={value}
                                //             label={value}
                                //             onDelete={() => handleDeleteChip(value,index, i,j)}
                                //           />
                                //         ))}
                                //       </div>
                                //     )}
                                //   >
                                //       {y.addressConfigurationFieldCustomValueMappings.map((value:any, index:number) => (
                                //         <MenuItem key={value} value={value}>
                                //         {value}
                                //         </MenuItem>
                                //         ))}
                                //   </Select>
                              )}
                            </>
                          )}
                          {/* TEXTAREA */}
                          {y.type === 'textarea' || y.type === 'textbox' ? (
                            <>
                              <Grid item xs={2}>
                                {y.lengthValidation && (
                                  <TextField
                                    id='standard-basic'
                                    type='number'
                                    name='size'
                                    value={y.size || ''}
                                    onChange={e => handleFieldPropChange(e, i, j)}
                                    label='Size'
                                    style={{ marginRight: '1%', width: '80%' }}
                                  />
                                )}
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={y.lengthValidation}
                                      onChange={e => handleFieldPropChecked(e, i, j)}
                                      name='lengthValidation'
                                      color='primary'

                                    // style={{ marginRight:"1%"}}
                                    />
                                  }
                                  label='Length validation'
                                />
                              </Grid>
                              <Grid item xs={3}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={y.spacialCharacterValidation}
                                      onChange={e => handleFieldPropChecked(e, i, j)}
                                      name='spacialCharacterValidation'
                                      color='primary'
                                    />
                                  }
                                  label='Special character validation'
                                />
                              </Grid>
                            </>
                          ) : null}

                          <Grid item xs={2}>
                            {y.readOnly && (
                              <FormControl className={classes.formControl}>
                                <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                  Default Value
                                </InputLabel>
                                <Select
                                  labelId='demo-simple-select-label'
                                  id='demo-simple-select'
                                  label='Default Value'
                                  name='defaultValue'
                                  value={y.defaultValue || ''}
                                  onChange={e => handleFieldPropChange(e, i, j)}
                                  style={{ marginRight: '1%', width: '80%' }}
                                >
                                  {/* {renderTypeList.map((ele) => {
                                                                        return <MenuItem value={ele.id}>{ele.name}</MenuItem>;
                                                                    })} */}

                                  <MenuItem value='IND'>Country code</MenuItem>
                                  <MenuItem value='91'>Country mobile code</MenuItem>
                                </Select>
                              </FormControl>
                            )}

                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={y.readOnly}
                                  onChange={e => handleFieldPropChecked(e, i, j)}
                                  name='readOnly'
                                  color='primary'
                                />
                              }
                              label='readonly'
                            />
                          </Grid>

                          <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                            {x.addressConfigurationFieldMappings.length !== 1 && (
                              <Button
                                className='mr10 p-button-danger'
                                onClick={() => handleRemoveFieldProp(i, j)}
                                color='secondary'
                                style={{ marginLeft: '5px' }}
                                // disabled={true}
                                disabled={true}
                              >
                                <DeleteIcon />
                              </Button>
                            )}
                            {x.addressConfigurationFieldMappings.length - 1 === j && (
                              <Button
                                color='primary'
                                style={{ marginLeft: '5px' }}
                                onClick={() => {
                                  handleAddfieldProps(i)
                                }}
                                disabled={true}
                              >
                                <AddIcon />
                              </Button>
                            )}
                          </Grid>
                        </Grid>
                      )
                    })}

                    <Divider style={{ marginBottom: '20px' }} />
                  </Grid>
                </div>
              )
            })}
          </div>
        </FettleDragNDrop>
        <Grid container spacing={3} style={{ marginTop: '20px' }}>
          {fieldList.length !== 0 && (
            <Button color='primary' disabled={false} onClick={saveConfigurations}>
              Save Configurations
            </Button>
          )}
        </Grid>
      </Box>
    </Paper>
  )
}
