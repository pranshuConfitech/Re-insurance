
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

import PdfReview from './component/pdf.preview'
import { PreAuthService } from '@/services/remote-api/api/claims-services/claim.preauth.services'

import { config } from '@/services/remote-api/api/configuration'

const preAuthService = new PreAuthService()

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
  },
  buttonPrimary: {
    backgroundColor: '#D80E51',
    color: '#f1f1f1'
  },
  buttonSecondary: {
    backgroundColor: '#01de74',
    color: '#f1f1f1'
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

  const query2 = useSearchParams()
  const classes = useStyles()
  const history = useRouter()
  const id: any = useParams().id

  const [uploadSuccess, setUploadSuccess] = React.useState(false)
  const [preAuthDetails, setPreAuthDetails] = React.useState<any>({})

  const [documentList, setDocumentList] = React.useState([{ ...docTempalte }])
  const [localPreauthId, setLocalPreauthId] = React.useState<any>(null);
  const preauthid = id ? id : localPreauthId
  const baseDocumentURL = `${config.rootUrl}claim-query-service/v1/preauths/${preauthid}/docs/`

  const handleClose = () => {
    localStorage.removeItem('preauthid')
    history.push('/claims/claims-preauth?mode=viewList')

    // window.location.reload();
  }
  React.useEffect(() => {
    if (localStorage.getItem('preauthid')) {
      setLocalPreauthId(localStorage.getItem('preauthid'));
      populateStepTwo(localStorage.getItem('preauthid'))

    }
  }, [localStorage.getItem('preauthid')])

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
    let preID: any = localStorage.getItem('preauthid')

    if (id) {
      preID = id
    }

    const action = preAuthDetails.preAuthStatus === 'APPROVED' ? 'enhancement' : 'requested'

    if (preAuthDetails.preAuthStatus == 'ADD_DOC_REQUESTED') {
      preAuthService.addDocAfterReviw(preID, null).subscribe(response => {
        history.push('/claims/claims-preauth?mode=viewList')
      })
    } else {
      preAuthService.editPreAuth({}, preID, action).subscribe(res => {
        history.push('/claims/claims-preauth?mode=viewList')

        // window.location.reload();
      })
    }
  }

  const handleAddDoc = (e: any, index: number) => {
    let preID = localStorage.getItem('preauthid')

    if (id) {
      preID = id
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

      if (preID) {
        preAuthService.addDoc(preID, formData).subscribe((response: any) => {
          preAuthService.getPreAuthById(preID).subscribe((response: any) => {
            setPreAuthDetails(response)
          })
          list[index]['documentName'] = response.id
          list[index]['docFormat'] = response.docFormat
          setDocumentList(list)
          setUploadSuccess(true)

          // populateStepTwo(id);
        })
      }
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



  const populateStepTwo = (id: any) => {
    preAuthService.getPreAuthById(id).subscribe((res: any) => {
      setPreAuthDetails(res)

      if (res.documents && res.documents.length !== 0) {
        setDocumentList(res.documents)
      }
    })
  }

  const RenderPreview = (x: any) => {
    const { docFormat, documentName } = x

    // const [img, setImg] = React.useState();
    const [img, setImg] = React.useState<any>()
    const completeURL = `${baseDocumentURL}${documentName.replace(/ /g, '%20')}`

    React.useEffect(() => {
      const fetchImg = async () => {
        try {
          const res = await fetch(completeURL, {
            headers: {
              Authorization: `Bearer ${(window as any).getToken?.()}`
            }
          })

          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }

          const file = await res.blob()

          setImg(URL.createObjectURL(file))
        } catch (error) {
          alert('Failed to fetch the image')

          // Handle the error (e.g., display a fallback image or show an error message)
        }
      }

      fetchImg()
    }, [])

    return (
      <>
        {docFormat.split('/')[0] === 'image' ? (
          <img
            src={img} // Complete URL for images
            alt='Document Thumbnail'
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              borderRadius: '8px',
              objectFit: 'cover'
            }}
          />
        ) : docFormat === 'application/pdf' ? (
          <PdfReview url={completeURL} onClick={undefined} />
        ) : null}
      </>
    )
  }

  return (
    <Paper elevation={0}>
      <Box p={3} my={2}>
        {documentList.map((x, i) => {
          const { docFormat, documentName } = x

          return (
            <Grid container spacing={3} key={i} style={{ marginBottom: '15px' }}>
              <Snackbar open={uploadSuccess} autoHideDuration={3000} onClose={handleFileUploadMsgClose}>
                <Alert onClose={handleFileUploadMsgClose} severity='success'>
                  File uploaded successfully
                </Alert>
              </Snackbar>
              <Grid item xs={3}>
                <FormControl className={classes.formControl}>
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Document type
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    label='Document type'
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
              <Grid item xs={3}>
                <TextField
                  id='standard-basic'
                  name='documentName'
                  value={x.documentOriginalName}
                  disabled
                  label='Document name'
                />
              </Grid>

              <Grid item xs={2}>
                <RenderPreview x={x} />
              </Grid>

              {query2.get('mode') !== 'viewOnly' && (
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
                      color='primary'
                      type='button'
                      className={classes.buttonPrimary}
                      style={!!x.documentName ? { backgroundColor: '#C9DEFF' } : {}}
                    >
                      <AddAPhotoIcon />
                    </Button>
                  </label>

                  {/* </label> */}
                </Grid>
              )}

              {query2.get('mode') !== 'viewOnly' && (
                <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                  {documentList.length !== 1 && (
                    <Button
                      className={`mr10 p-button-danger ${classes.buttonSecondary}`}
                      onClick={() => handleRemoveDocumentList(i)}
                      variant='contained'
                      color='secondary'
                      style={{ marginLeft: '5px' }}
                    >
                      <DeleteIcon />
                    </Button>
                  )}
                  {documentList.length - 1 === i && (
                    <Button
                      variant='contained'
                      color='primary'
                      className={classes.buttonPrimary}
                      style={{ marginLeft: '5px' }}
                      onClick={handleAddDocumentList}
                    >
                      <AddIcon />
                    </Button>
                  )}
                </Grid>
              )}
            </Grid>
          )
        })}
      </Box>

      <hr />
      {query2.get('mode') !== 'viewOnly' && (
        <Box p={3} my={2}>
          <Grid item xs={12} style={{ display: 'flex', alignItems: 'end' }}>
            <Button
              className={`mr10 ${classes.buttonPrimary}`}
              variant='contained'
              color='primary'
              onClick={onRequestForReview}
              disabled={
                !preAuthDetails.preAuthStatus ||
                (preAuthDetails.preAuthStatus == 'DRAFT' && preAuthDetails?.subStatus != 'DOCUMENT_UPLOADED')
              }
            >
              {preAuthDetails.preAuthStatus === 'APPROVED' ? 'Request Enhancement' : 'Request'}
            </Button>
          </Grid>
        </Box>
      )}
    </Paper>
  )
}
