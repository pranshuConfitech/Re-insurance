import * as React from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'

import { Button } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Snackbar from '@mui/material/Snackbar'

import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import AddIcon from '@mui/icons-material/Add'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import DeleteIcon from '@mui/icons-material/Delete'
import MuiAlert from '@mui/lab/Alert'

import 'date-fns'
import { Typography } from '@mui/material'

import { PreAuthService } from '@/services/remote-api/api/claims-services'
import PdfReview from './component/pdf.preview'

import { config } from '@/services/remote-api/api/configuration'

const preAuthService = new PreAuthService()

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
    margin: theme?.spacing ? theme.spacing(1) : '8px',
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
  const preauthid = id ? id : localStorage.getItem('preauthid')
  const baseDocumentURL = `${config.rootUrl}/claim-query-service/v1/preauths/${preauthid}/docs/`

  const [uploadSuccess, setUploadSuccess] = React.useState(false)
  const [preAuthDetails, setPreAuthDetails] = React.useState<any>({})
  const [isDisabled, setIsDisabled] = React.useState<boolean>(true)
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');

  const [documentList, setDocumentList] = React.useState([{ ...docTempalte }])

  const handleClose = () => {
    localStorage.removeItem('preauthid')
    history.push('/claims/claims-preauth?mode=viewList')
  }

  const handleInputChangeDocumentType = (e: any, index: number) => {
    const { name, value } = e.target
    const list: any = [...documentList]

    list[index][name] = value
    setDocumentList(list)
  }

  const handleRemoveDocumentList = (index: number) => {
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
      preAuthService.editPreAuth({}, preID, action).subscribe({
        next: (res) => {
          setSnackbarMessage('Pre-auth Requested for Evaluation!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          setTimeout(() => {
            history.push('/claims/claims-preauth?mode=viewList')
          }, 1000);
        },
        error: (error) => {
          console.error("Error saving invoice:", error);
          setSnackbarMessage(error?.response?.data?.message || 'Failed to save invoice. Please try again.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        }
      })
    }
  }

  const handleAddDoc = (e: any, index: any) => {
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
          list[index]['documentName'] = response.id
          list[index]['docFormat'] = response.docFormat
          setDocumentList(list)
          setUploadSuccess(true)
          setIsDisabled(false);
          populateStepTwo(preID)
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
    } else if (localStorage.getItem('preauthid')) {
      populateStepTwo(localStorage.getItem('preauthid'))
    }
  }, [id])

  const populateStepTwo = (id: any) => {
    preAuthService.getPreAuthById(id).subscribe((res: any) => {
      setPreAuthDetails(res)
      if (res.preAuthStatus === 'DRAFT' && res.subStatus === 'DOCUMENT_UPLOADED') {
        setIsDisabled(false);
      }
      // preAuthDetails.preAuthStatus === 'DRAFT' && preAuthDetails?.subStatus !== 'DOCUMENT_UPLOADED'
      if (res.documents && res.documents.length !== 0) {
        setDocumentList(res.documents)
        props.setMembershipNumber(res.memberShipNo)
      }
    })
  }

  const RenderPreview = ({ x }: { x: any }) => {
    const { docFormat, documentName } = x
    const completeURL = `${baseDocumentURL}${documentName?.replace(/ /g, '%20')}`
    const [img, setImg] = React.useState<any>()

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
          setIsDisabled(false);
        } catch (error) {
          // alert('Failed to fetch the image')
        }
      }

      fetchImg()
    }, [])

    return (
      <>
        {docFormat?.split('/')[0] === 'image' ? (
          <img
            src={img}
            alt='Document Thumbnail'
            style={{
              // width: '100%',
              // height: '100%',
              // display: 'block',
              // borderRadius: '8px',
              // objectFit: 'cover'
            }}
          />
        ) : docFormat === 'application/pdf' ? (
          <PdfReview url={completeURL} onClick={undefined} />
        ) : null}
      </>
    )
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
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
                <Grid item xs={3}>
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
                      <MenuItem value='Pre-authorization form'>Pre-authorization form</MenuItem>
                      <MenuItem value='Medical report'>Medical report</MenuItem>
                      <MenuItem value='Discharge summary'>Discharge summary</MenuItem>
                      <MenuItem value='Burial permit'>Burial permit</MenuItem>
                      <MenuItem value='Death certificate'>Death certificate</MenuItem>
                      <MenuItem value='Burial permit'>Burial permit</MenuItem>
                      <MenuItem value='Post mortem report'>Post mortem report</MenuItem>
                      <MenuItem value='Police abstract'>Police abstract</MenuItem>
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
                  {x.documentName && <RenderPreview x={x} />}
                </Grid>

                {query2.get('mode') !== 'viewOnly' && (
                  <Grid
                    item
                    xs={2}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column',
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
                  </Grid>
                )}

                {query2.get('mode') !== 'viewOnly' && (
                  <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                    {documentList.length !== 1 && (
                      <Button
                        className='p-button-danger'
                        onClick={() => handleRemoveDocumentList(i)}
                        color='secondary'
                        style={{ marginLeft: '5px' }}
                      >
                        <DeleteIcon />
                      </Button>
                    )}
                    {documentList.length - 1 === i && (
                      <Button
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
            <Grid container spacing={2} alignItems='center'>
              <Grid item xs={2}>
                <Button
                  className={`mr10 ${classes.buttonPrimary}`}
                  color='primary'
                  onClick={onRequestForReview}
                  // disabled={isDisabled}
                  // disabled={
                  //   !isDisabled ||
                  //   !preAuthDetails.preAuthStatus ||
                  //   (preAuthDetails.preAuthStatus === 'DRAFT' && preAuthDetails?.subStatus !== 'DOCUMENT_UPLOADED')
                  // }
                  style={{
                    backgroundColor:
                      // isDisabled
                      //   ? '#d3d3d3' // Gray background for disabled
                      //   : 
                      '#D80E51', // Original background color
                    color:
                      // isDisabled
                      //   ? '#ffffff' // White text for disabled
                      //   : 
                      '#f1f1f1', // Original text color
                    cursor:
                      // isDisabled
                      //   ? 'not-allowed' // Disabled cursor
                      //   :
                      'pointer', // Default cursor
                  }}
                >
                  {preAuthDetails.preAuthStatus === 'APPROVED' ? 'Request Enhancement' : 'Request'}
                </Button>
              </Grid>
              <Grid item xs={10}>
                <Typography variant='body2' color='textSecondary'>
                  <span style={{ color: 'blue', fontWeight: 'bold' }}>Remark</span>:{' '}
                  <span style={{ color: 'black', fontWeight: 'bold' }}>{preAuthDetails?.addDocRemark}</span>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2800}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
