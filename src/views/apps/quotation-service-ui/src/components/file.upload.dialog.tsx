
import React from 'react'

import { useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import { DropzoneArea } from 'mui-file-dropzone'
import PropTypes from 'prop-types'

import CloudUploadIcon from '@mui/icons-material/CloudUpload'

import { makeStyles } from '@mui/styles'

import { QuotationService } from '@/services/remote-api/api/quotation-services'
import { EndorsementService } from '@/services/remote-api/api/endorsement-services'

/* import { FettleDataGrid } from '../../../shared-components'; */

const quotationService = new QuotationService()
const endorsementService = new EndorsementService()

function LinearProgressWithLabel(props: any) {
  return (
    <Box display='flex' alignItems='center'>
      <Box width='100%' mr={1}>
        <LinearProgress variant='determinate' {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant='body2' color='textSecondary'>{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  )
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired
}

function TabPanel(props: any) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const useStyles = makeStyles((theme: any) => ({
  previewChip: {
    minWidth: 160,
    maxWidth: 210
  },
  tableBg: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  },
  categoryButton: {
    marginLeft: '5px',
    marginRight: '5px'
  }
}))

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

export default function FileUploadDialogComponent(props: any) {
  const query1 = useSearchParams()

  // console.log(FileDropzone);

  const [selectedFile, setSelectedFile] = React.useState(null)
  const [tabvalue, setTabValue] = React.useState(0)
  const classes = useStyles()

  const handleTabChange = (e: any, newValue: any) => {
    setTabValue(newValue)
  }

  const handleClose = () => {
    props.closeModal()
  }

  const handleChange = (files: any) => {
    setSelectedFile(files[0])
  }

  const doUpload = () => {
    const quotationId = localStorage.getItem('quotationId')

    const pageRequest = {
      isRenewal: query1.get('type') == 'renewal' ? true : false
    }

    if (props.isEndorsement) {
      if (selectedFile) {
        const payload = {
          policyId: props.policyId,
          action: props.action
        }

        // const formData: any = new FormData()

        // formData.append('filePart', selectedFile, { type: 'multipart/form-data' })
        // formData.append('policyId', new Blob([JSON.stringify(props.policyId)]), { type: 'application/json' })
        // formData.append('endorsementDTO', new Blob([JSON.stringify(payload)]), { type: 'application/json' })

        const formData = new FormData();
        formData.append('filePart', selectedFile); // file is fine
        formData.append(
          'endorsementDTO',
          new Blob([JSON.stringify(payload)], { type: 'application/json' })
        )

        // if (props.type === 'ADD') {
        //   endorsementService.uploadTemplateForAddition(formData, props.policyId, props.action).subscribe(res => {
        //     localStorage.setItem('endorsementId', res?.id);
        //     handleClose();
        //     props.onComplete();
        //   });
        // } else {
        if (props.id) {
          endorsementService.editEndorsement(formData, props.id).subscribe(res => {
            handleClose()
            props.onComplete()
            if (props.onUploadComplete) props.onUploadComplete()
          })
        } else {
          endorsementService.uploadTemplate(formData).subscribe(res => {
            localStorage.setItem('endorsementId', res?.id)
            handleClose()
            props.onComplete()
            if (props.onUploadComplete) props.onUploadComplete()
          })
        }

        // }
      }
    } else {
      if (quotationId && selectedFile) {
        const formData = new FormData()

        formData.append('filePart', selectedFile)

        quotationService.uploadTemplate(formData, quotationId, pageRequest).subscribe(res => {
          handleClose()
          props.onComplete()
          if (props.onUploadComplete) props.onUploadComplete()
        })
      }
    }
  }

  return (
    <Dialog
      fullWidth={true}
      maxWidth='xl'
      open={props.open}
      onClose={handleClose}
      aria-labelledby='max-width-dialog-title'
    >
      <DialogTitle id='max-width-dialog-title'>Member Upload</DialogTitle>
      <DialogContent>
        {/* <AppBar position="static">
          <Tabs value={tabvalue} onChange={handleTabChange} aria-label="simple tabs example">
            <Tab textColor='inherit' label="File Upload" {...a11yProps(0)} />
          </Tabs>
        </AppBar>
        <TabPanel value={tabvalue} index={0}> */}
        <DropzoneArea
          // showPreviews={true}
          // showPreviewsInDropzone={false}
          // useChipsForPreview
          // previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
          // previewChipProps={{ classes: { root: classes.previewChip } }}
          previewText='Selected files'
          onChange={handleChange}
          filesLimit={1}
        />
        {/* </TabPanel> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={doUpload} type='button' color='secondary' icon={<CloudUploadIcon />}>
          Upload
        </Button>
        <Button onClick={handleClose} className='p-button-text' color='primary'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
