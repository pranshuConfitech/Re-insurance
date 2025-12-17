'use client'
import * as React from 'react'

import { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'

/* import Autocomplete from "@material-ui/lab/Autocomplete"; */
import { useFormik } from 'formik'

import * as yup from 'yup'

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { TextareaAutosize, useTheme } from '@mui/material'
import moment from 'moment'
import { Button } from 'primereact/button'

import { LetterService } from '@/services/remote-api/api/claims-services/letter.services'

import FettleRichTextEditor from '@/views/apps/shared-component/components/fettle-rich-text-editor/fettle.rich.text.editor'
// import dynamic from 'next/dynamic';
// const FettleRichTextEditor = dynamic(() => import('@/views/apps/shared-component/components/fettle-rich-text-editor/fettle.rich.text.editor'), { ssr: false });


const letterService = new LetterService()

const letterTypeOption = [
  {
    value: 'general letter',
    label: 'General Letter'
  },
  {
    value: 'approval letter for ip',
    label: 'Approval Letter For IP'
  },
  {
    value: 'rejection letter',
    label: 'Rejection Letter'
  },
  {
    value: 'degradation',
    label: 'Degradation'
  },
  {
    value: 'upgradation',
    label: 'Upgradation'
  },
  {
    value: '4 hrs #inform nurse in charge of ward #see patient within 30 mins',
    label: '4 hrs #Inform Nurse in charge of ward #See Patient within 30 mins'
  },
  {
    value: '12 hrs/6 hrs',
    label: '12 hrs/6 hrs'
  },
  {
    value: 'add doc letter',
    label: 'Add Doc Letter'
  },
  {
    value: 'approval letter for op',
    label: 'Approval Letter for OP'
  }
]

const parameterOption = [
  {
    value: '{policy_number}',
    label: 'Policy Number'
  },
  {
    value: '{membership_number}',
    label: 'Membership Number'
  },
  {
    value: '{member_name}',
    label: 'Member Name'
  },
  {
    value: '{plan_number}',
    label: 'Plan Number'
  },
  {
    value: '{quotation_number}',
    label: 'Quotation Number'
  },
  {
    value: '{hospital_name}',
    label: 'Hospital Name'
  },
  {
    value: '{estimated_amount}',
    label: 'Estimated Amount'
  },
  {
    value: '{final_approved_amount}',
    label: 'Final Approved Amount'
  },
  {
    value: '{visit_fee}',
    label: 'Visit Fee'
  },
  {
    value: '{co_pay}',
    label: 'Co Pay'
  },
  {
    value: '{doctor_name}',
    label: 'Doctor Name'
  },
  {
    value: '{admission_date}',
    label: 'Admission Date'
  },
  {
    value: '{diagnosis}',
    label: 'Diagnosis'
  },
  {
    value: '{bed_type}',
    label: 'Bed Type'
  },
  {
    value: '{room_charge}',
    label: 'Room Charge'
  },
  {
    value: '{days}',
    label: 'Days'
  }
]

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
  },
  root: {},
  inputRoot: {},
  disabled: {}
}))

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  productId: yup.string().required('Product Name is required')
})

// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }

export default function LetterDetailsComponent(props: any) {
  const classes = useStyles()
  const query = useSearchParams()
  const router = useRouter()
  const id: any = useParams().id
  const theme = useTheme()
  const [date, setDate] = React.useState('')
  const [editorContent, setEditorContent] = React.useState<any>()
  const [isClient, setIsClient] = React.useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  useEffect(() => {
    if (id) populateData()
  }, [])

  const formik = useFormik({
    initialValues: {
      letterType: '',
      formatName: '',
      date: '',
      refNo: '',
      address: '',
      salut: '',
      subject: '',
      body: '',
      closing: '',
      enclosure: '',
      cc: '',
      parameterType: ''
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      saveDetails()
    }
  })

  const content = (
    <p>{`
        <span style="font-weight:700;">Ref</span>: ${formik.values.refNo}
        <br />
        <br />
        ${formik.values.address}
        <br />
        <br />
        ${formik.values.salut}
        <br />
        <br />
        <span style="font-weight:700;">Subject</span>: ${formik.values.subject}
        <br />
        <br />
        ${formik.values.body}
        <br />
        <br />
        ${formik.values.closing}
        <br />
        <br />
        ${formik.values.enclosure}
        <br />
        <br />
        <span style="font-weight:700;">CC</span>: ${formik.values.cc}
        <br/>
        `}</p>
  )

  const populateData = () => {
    letterService.getLetterDetails(id).subscribe((res: any) => {
      setDate(moment(res?.date).format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (Z)'))
      formik.setValues({
        ...formik.values,
        letterType: res?.letterType,
        formatName: res?.formatName,
        refNo: res?.referenceNumber,
        address: res?.address,
        salut: res?.salute,
        subject: res?.subject,
        body: res?.body,
        closing: res?.closing,
        enclosure: res?.enclosure,
        cc: res?.cc
      })
      const temp: any = <p>{res?.editorContent}</p>

      setEditorContent(temp)
    })
  }

  const saveDetails = () => {
    const payload = {
      letterType: formik.values.letterType,
      formatName: formik.values.formatName,
      date: new Date(date).getTime(),
      address: formik.values.address,
      subject: formik.values.subject,
      body: formik.values.body,
      referenceNumber: formik.values.refNo,
      salute: formik.values.salut,
      cc: formik.values.cc,
      closing: formik.values.closing,
      enclosure: formik.values.enclosure,
      editorContent: editorContent?.props?.children || content?.props?.children
    }

    if (query.get('mode') === 'create') {
      letterService.saveLetter(payload).subscribe(res => {
        alert('created!')
        router.push('/claims/letter?mode=viewList')
      })
    } else {
      letterService.editLetter(payload, id).subscribe(res => {
        alert('Updated!')
        router.push('/claims/letter?mode=viewList')
      })
    }
  }

  const ShowParameters = ({ e, index }: { e: any; index: any }) => {
    const selectableContentRef: any = React.useRef()

    const selectContentOnClick = async () => {
      // if (selectableContentRef.current) {
      //   const range = document.createRange()

      //   range.selectNodeContents(selectableContentRef.current)
      //   const selection: any = window.getSelection()

      //   selection.removeAllRanges()
      //   selection.addRange(range)

      //   // Execute the 'copy' command to copy the selected text to the clipboard
      //   document.execCommand('copy')
      // }

      if (selectableContentRef.current && isClient) {
        const text = selectableContentRef.current.innerText

        try {
          await navigator.clipboard.writeText(text)
          console.log('Copied to clipboard!')
        } catch (err) {
          console.error('Failed to copy: ', err)
        }
      }
    }

    return (
      <span
        ref={selectableContentRef}
        onClick={selectContentOnClick}
        style={{ border: '1px solid black', margin: '2px', padding: '1px', borderRadius: '4px', background: '#e0e0e0' }}
      >
        {e.value}
      </span>
    )
  }

  return (
    <>
      <Paper elevation={0}>
        <Box p={3} my={2}>
          <form onSubmit={formik.handleSubmit} noValidate>
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={6}>
                <FormControl className={classes.formControl}>
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Letter Type
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    name='letterType'
                    label='Letter Type'
                    id='demo-simple-select'
                    style={{ width: '100%' }}
                    value={formik.values.letterType}
                    onChange={formik.handleChange}
                  >
                    {letterTypeOption.map(ele => {
                      return (
                        <MenuItem key={ele.value} value={ele.value}>
                          {ele.label}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextareaAutosize
                  maxRows={2}
                  minRows={2}
                  aria-label='Notes'
                  name='address'
                  style={{ background: 'transparent', width: '63%', padding: '1%' }}
                  placeholder='Address'
                  value={formik.values.address}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size='small'
                  id='standard-basic'
                  name='formatName'
                  value={formik.values.formatName}
                  onChange={formik.handleChange}
                  // error={formik.touched.name && Boolean(formik.errors.name)}
                  // helperText={formik.touched.name && formik.errors.name}
                  label='Format Name*'
                />
              </Grid>
              <Grid item xs={6}>
                <TextareaAutosize
                  maxRows={2}
                  minRows={2}
                  aria-label='Notes'
                  name='subject'
                  style={{ background: 'transparent', width: '80%', padding: '1%' }}
                  placeholder='Subject'
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        views={['year', 'month', 'date']}
                                        variant="inline"
                                        format="dd/MM/yyyy"
                                        margin="normal"
                                        id="date-picker-inline"
                                        label="Date"
                                        name="date"
                                        value={date}
                                        onChange={(date:any) => setDate(date)}
                                        InputProps={{
                                            classes: {
                                                root: classes.inputRoot,
                                                disabled: classes.disabled,
                                            },
                                        }}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change ing date',
                                        }}
                                    />
                                </MuiPickersUtilsProvider> */}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label='Date'
                    value={date}
                    onChange={(date: any) => setDate(date)}
                    InputProps={{
                      classes: {
                        root: classes.inputRoot,
                        disabled: classes.disabled
                      }
                    }}
                    renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                <TextareaAutosize
                  maxRows={5}
                  minRows={5}
                  aria-label='Notes'
                  name='body'
                  style={{ background: 'transparent', width: '80%', padding: '1%' }}
                  placeholder='Body'
                  value={formik.values.body}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size='small'
                  id='standard-basic'
                  name='refNo'
                  value={formik.values.refNo}
                  onChange={formik.handleChange}
                  // error={formik.touched.name && Boolean(formik.errors.name)}
                  // helperText={formik.touched.name && formik.errors.name}
                  label='Ref Number'
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size='small'
                  id='standard-basic'
                  name='closing'
                  value={formik.values.closing}
                  onChange={formik.handleChange}
                  // error={formik.touched.name && Boolean(formik.errors.name)}
                  // helperText={formik.touched.name && formik.errors.name}
                  label='Closing'
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size='small'
                  id='standard-basic'
                  name='salut'
                  value={formik.values.salut}
                  onChange={formik.handleChange}
                  // error={formik.touched.name && Boolean(formik.errors.name)}
                  // helperText={formik.touched.name && formik.errors.name}
                  label='Salut'
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size='small'
                  id='standard-basic'
                  name='enclosure'
                  value={formik.values.enclosure ?? ''}
                  onChange={formik.handleChange}
                  // error={formik.touched.name && Boolean(formik.errors.name)}
                  // helperText={formik.touched.name && formik.errors.name}
                  label='Enclosure'
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size='small'
                  id='standard-basic'
                  name='cc'
                  value={formik.values.cc}
                  onChange={formik.handleChange}
                  // error={formik.touched.name && Boolean(formik.errors.name)}
                  // helperText={formik.touched.name && formik.errors.name}
                  label='CC'
                />
              </Grid>
              <Grid item xs={6}>
                {/* <FormControl className={classes.formControl}>
                                    <InputLabel
                                        id="demo-simple-select-label"
                                        style={{ marginBottom: "0px" }}
                                    >
                                        Paramenter Type
                                    </InputLabel> */}

                <span style={{ margin: '2px 0', padding: '1px', borderRadius: '4px' }}>Add parameters to editor</span>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {parameterOption.map((e, index) => {
                    return <ShowParameters key={index} e={e} index={index} />
                  })}
                </div>
                {/* <Select
                                        labelId="demo-simple-select-label"
                                        name="parameterType"
                                        id="demo-simple-select"
                                        style={{ width: "100%" }}
                                        value={formik.values.parameterType}
                                        onChange={formik.handleChange}
                                    >
                                        {parameterOption.map((ele) => {
                                            return <MenuItem value={ele.value}>{ele.label}</MenuItem>;
                                        })}
                                    </Select> */}
                {/* </FormControl> */}
              </Grid>
            </Grid>
            <Box display={'flex'} justifyContent={'end'}>
              <Button
                style={{ background: theme?.palette?.primary?.main || '#D80E51', color: '#fff' }}
                onClick={saveDetails}
              >
                Save
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
      <Paper elevation={0}>
        <FettleRichTextEditor data={editorContent || content} setEditorContent={setEditorContent} />
      </Paper>
    </>
  )
}
