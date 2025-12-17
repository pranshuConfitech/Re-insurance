
import * as React from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Snackbar from '@mui/material/Snackbar'

// import Snackbar from "@mui/material/Snackbar";
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import AddIcon from '@mui/icons-material/Add'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import DeleteIcon from '@mui/icons-material/Delete'
import MuiAlert from '@mui/lab/Alert'

// import Autocomplete from "@material-ui/lab/Autocomplete";
import 'date-fns'

import { ClaimsIntimationService } from '@/services/remote-api/api/claims-services'

const intimationService = new ClaimsIntimationService()

// const validationSchema = yup.object({
//     name: yup.string("Enter your Name").required("Name is required"),
//     type: yup.string("Choose Agent type").required("Agent Type is required"),
//     contact: yup
//         .string("Enter your Contact Number")
//         .required("Contact number is required")
//         .test('len', 'Must be exactly 10 digit', val => val.length === 10),
//     email: yup
//         .string('Enter your email')
//         .email('Enter a valid email'),
//     natureOfAgent: yup
//         .string("Enter Nature of Agent")
//         .required("Agent Nature is required"),
// });

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
  formControl1: {
    margin: theme.spacing ? theme.spacing(1) : '8px',
    minWidth: 120,
    maxWidth: 300
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  },
  inputRoot: {
    '&$disabled': {
      color: 'black'
    }
  },
  disabled: {},
  actionContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  saveBtn: {
    marginRight: '5px'
  }
}))

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

export default function ClaimsIntimationDocumentComponent(props: any) {
  const docTempalte = {
    documentType: 'Prescription',
    docFormat: '',
    documentName: '',
    documentOriginalName: ''
  }

  const query = useSearchParams()

  const classes = useStyles()
  const history = useRouter()
  const id: any = useParams().id

  // const { memId } = localStorage.getItem('preauthid') ? localStorage.getItem('preauthid') : '';

  const [uploadSuccess, setUploadSuccess] = React.useState(false)
  const [intmationDetails, setIntimationDetails] = React.useState({})

  const [documentList, setDocumentList] = React.useState([{ ...docTempalte }])

  const handleClose = () => {
    localStorage.removeItem('preauthid')
    history.push('/claims/claims-preauth?mode=viewList')

    // window.location.reload();
  }

  // const useObservable = (observable, setter) => {
  //     useEffect(() => {
  //         let subscription = observable.subscribe((result) => {
  //             setter(result.content);
  //         });
  //         return () => subscription.unsubscribe();
  //     }, [observable, setter]);
  // };

  const handleInputChangeDocumentType = (e: any, index: number) => {
    const { name, value } = e.target
    const list: any = [...documentList]

    list[index][name] = value
    setDocumentList(list)
  }

  const handleRemoveDocumentList = (index: number) => {
    const list = [...documentList]

    list.splice(index, 1)
    setDocumentList(list)
  }

  const handleAddDocumentList = () => {
    setDocumentList([
      ...documentList,
      {
        ...docTempalte
      }
    ])
  }

  const handleAddDoc = (e: any, index: number) => {
    const file = e.target['files'][0]

    const reader = new FileReader()

    reader.onload = function () {
      const list = [...documentList]

      list[index]['documentOriginalName'] = file.name

      setDocumentList(list)

      const formData = new FormData()

      formData.append('docType', list[index]['documentType'])
      formData.append('filePart', file)

      intimationService.addDoc(id, formData).subscribe(response => {
        list[index]['documentName'] = response.get('id')
        list[index]['docFormat'] = response.get('docFormat')
        setDocumentList(list)
        setUploadSuccess(true)
      })
    }

    reader.readAsDataURL(file)
  }

  function Alert(props: any) {
    return <MuiAlert elevation={6} variant='filled' {...props} />
  }

  const handleFileUploadMsgClose = (event: any, reason: any) => {
    setUploadSuccess(false)
  }

  React.useEffect(() => {
    if (id) {
      populateStepTwo(id)
    }
  }, [id])

  React.useEffect(() => {
    if (query.get('preId')) {
      populateStepTwo(query.get('preId'))
    }
  }, [query.get('preId')])

  React.useEffect(() => {
    if (localStorage.getItem('preauthid')) {
      populateStepTwo(localStorage.getItem('preauthid'))
    }
  }, [localStorage.getItem('preauthid')])

  const populateStepTwo = (id: any) => {
    intimationService.getIntimationDetails(id).subscribe(res => {
      setIntimationDetails(res)

      if (res.documents && res.documents.length !== 0) {
        setDocumentList(res.documents)
      }
    })
  }

  return (
    <Paper elevation={0}>
      <Box p={3} my={2}>
        {documentList.map((x, i) => {
          return (
            <Grid container spacing={3} key={i} style={{ marginBottom: '15px' }}>
              <Snackbar open={uploadSuccess} autoHideDuration={3000} onClose={handleFileUploadMsgClose}>
                <Alert onClose={handleFileUploadMsgClose} severity='success'>
                  File uploaded successfully
                </Alert>
              </Snackbar>
              <Grid item xs={4}>
                <FormControl className={classes.formControl}>
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Document type
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    label='Document Type'
                    id='demo-simple-select'
                    name='documentType'
                    value={x.documentType}
                    disabled={!!x.documentName}
                    onChange={e => handleInputChangeDocumentType(e, i)}
                  >
                    <MenuItem value='Prescription'>Prescription</MenuItem>
                    <MenuItem value='Bill'>Bill</MenuItem>
                    {/* {identificationTypes.map(ele => {
                                            return <MenuItem value={ele.code}>{ele.name}</MenuItem>
                                        })} */}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id='standard-basic'
                  name='documentName'
                  value={x.documentOriginalName}
                  disabled
                  label='Document name'
                />
              </Grid>

              <Grid
                item
                xs={2}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column'
                }}
              >
                <input
                  className={classes.input1}
                  id={'contained-button-file' + i.toString()}
                  name='document'
                  type='file'
                  disabled={!!x.documentName}
                  onChange={e => handleAddDoc(e, i)}
                  style={{ display: 'none' }}
                />
                <label htmlFor={'contained-button-file' + i.toString()} style={{ width: '50%', marginBottom: 0 }}>
                  <Button color='primary' style={!!x.documentName ? { backgroundColor: '#C9DEFF' } : {}}>
                    <AddAPhotoIcon />
                  </Button>
                </label>

                {/* </label> */}
              </Grid>

              <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                {documentList.length !== 1 && (
                  <Button
                    className='mr10 p-button-danger'
                    onClick={() => handleRemoveDocumentList(i)}
                    color='secondary'
                    style={{ marginLeft: '5px' }}
                  >
                    <DeleteIcon />
                  </Button>
                )}
                {documentList.length - 1 === i && (
                  <Button color='primary' style={{ marginLeft: '5px' }} onClick={handleAddDocumentList}>
                    <AddIcon />
                  </Button>
                )}
              </Grid>
            </Grid>
          )
        })}
      </Box>

      <hr />
    </Paper>
  )
}
