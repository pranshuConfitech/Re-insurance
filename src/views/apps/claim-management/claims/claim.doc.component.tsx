
import * as React from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'

// import { Button } from 'primereact/button';
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

import { Button } from '@mui/material'

import { ReimbursementService } from '@/services/remote-api/api/claims-services/claim.reimbursement.services'

const reimService = new ReimbursementService()

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

export default function ClaimsDocumentComponent(props: any) {
  const docTempalte = {
    documentType: 'Prescription',
    docFormat: '',
    documentName: '',
    documentOriginalName: ''
  }

  const classes = useStyles()
  const history = useRouter()
  const id = useParams().id
  const query = useSearchParams()

  // const { memId } = localStorage.getItem('claimreimid') ? localStorage.getItem('claimreimid') : '';

  const [uploadSuccess, setUploadSuccess] = React.useState(false)
  const [reimDetails, setreimDetails] = React.useState<any>({})

  const [documentList, setDocumentList] = React.useState([{ ...docTempalte }])

  const handleClose = () => {
    localStorage.removeItem('claimreimid')
    history.push('/claims/claims?mode=viewList')

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

  const handleInputChangeDocumentType = (e: any, index: any) => {
    const { name, value } = e.target
    const list: any = [...documentList]

    list[index][name] = value
    setDocumentList(list)
  }

  const handleRemoveDocumentList = (index: any) => {
    const list: any = [...documentList]

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

  const onRequestForReview = () => {
    let reimID: any = localStorage.getItem('claimreimid')

    if (id) {
      reimID = id
    }

    reimService.editReimbursement({}, reimID, 'requested').subscribe((res: any) => {
      history.push('/claims/claims?mode=viewList')

      // window.location.reload();
    })
  }

  const handleAddDoc = (e: any, index: any) => {
    let reimID: any = localStorage.getItem('claimreimid')

    if (!reimID) {
      const claimreimid = `r-${query.get('preId')}`

      reimID = claimreimid
      localStorage.setItem('claimreimid', claimreimid)
    }

    if (id) {
      reimID = id
    }

    const file = e.target['files'][0]

    const reader = new FileReader()

    reader.onload = function () {
      const list: any = [...documentList]

      list[index]['documentOriginalName'] = file.name

      setDocumentList(list)

      const formData = new FormData()

      formData.append('docType', list[index]['documentType'])
      formData.append('filePart', file)

      reimService.addDoc(reimID, formData).subscribe((response: any) => {
        list[index]['documentName'] = response.id
        list[index]['docFormat'] = response.docFormat
        setDocumentList(list)
        setUploadSuccess(true)

        // populateStepTwo(id);
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
    if (localStorage.getItem('claimreimid')) {
      populateStepTwo(localStorage.getItem('claimreimid'))
    }
  }, [localStorage.getItem('claimreimid')])

  const populateStepTwo = (id: any) => {
    reimService.getReimbursementById(id).subscribe((res: any) => {
      setreimDetails(res)

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
                    id='demo-simple-select'
                    label='Document type'
                    name='documentType'
                    value={x.documentType}
                    disabled={!!x.documentName}
                    onChange={e => handleInputChangeDocumentType(e, i)}
                  >
                    <MenuItem value='Prescription'>Prescription</MenuItem>
                    <MenuItem value='Bill'>Bill</MenuItem>
                    <MenuItem value='Medical report'>Medical report</MenuItem>
                    <MenuItem value='Discharge summary'>Discharge summary</MenuItem>
                    <MenuItem value='Burial permit'>Burial permit</MenuItem>
                    <MenuItem value='Death certificate'>Death certificate</MenuItem>
                    <MenuItem value='Burial permit'>Burial permit</MenuItem>
                    <MenuItem value='Reimbursement claim form'>Reimbursement claim form</MenuItem>
                    <MenuItem value='Post mortem report'>Post mortem report</MenuItem>
                    <MenuItem value='Police abstract'>Police abstract</MenuItem>
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

              {query.get('mode') !== 'viewOnly' && (
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
                    <Button
                      variant='contained'
                      color='primary'
                      component='span'
                      style={!!x.documentName ? { backgroundColor: '#C9DEFF' } : {}}
                    >
                      <AddAPhotoIcon />
                    </Button>
                  </label>

                  {/* </label> */}
                </Grid>
              )}

              <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                {query.get('mode') !== 'viewOnly' && documentList.length !== 1 && (
                  <Button
                    className='mr10 p-button-danger'
                    onClick={() => handleRemoveDocumentList(i)}
                    variant='contained'
                    color='secondary'
                    style={{ marginLeft: '5px' }}
                  >
                    <DeleteIcon />
                  </Button>
                )}
                {query.get('mode') !== 'viewOnly' && documentList.length - 1 === i && (
                  <Button
                    variant='contained'
                    color='primary'
                    style={{ marginLeft: '5px' }}
                    onClick={handleAddDocumentList}
                  >
                    <AddIcon />
                  </Button>
                )}
              </Grid>
            </Grid>
          )
        })}
      </Box>

      <hr />
      <Box p={3} my={2}>
        {query.get('mode') !== 'viewOnly' && (
          <Grid item xs={12} style={{ display: 'flex', alignItems: 'end' }}>
            <Button
              className='mr10'
              variant='contained'
              color='primary'
              onClick={onRequestForReview}
            // disabled={reimDetails.reimbursementStatus != 'PENDING_EVALUATION' || reimDetails.reimbursementStatus != "DRAFT"}
            // disabled={reimDetails.reimbursementStatus != 'DRAFT'}
            >
              Request
            </Button>
          </Grid>
        )}
      </Box>
    </Paper>
  )
}
