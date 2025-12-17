import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import Alert from '@mui/lab/Alert'
import { withStyles } from '@mui/styles'
import PropTypes from 'prop-types'

import { interval } from 'rxjs'
import { map, switchMap, take } from 'rxjs/operators'

import { TabPanel, TabView } from 'primereact/tabview'

import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import RefreshIcon from '@mui/icons-material/Refresh'
import TextSnippetIcon from '@mui/icons-material/TextSnippet'
import GetAppIcon from '@mui/icons-material/GetApp'

import { MemberProcessService, MemberService } from '@/services/remote-api/api/member-services'
import FileUploadDialogComponent from './file.upload.dialog'
import MemberTemplateModal from './member.template.dialog'

import { replaceAll, toTitleCase } from '@/services/utility'
import { MemberFieldConstants } from '@/views/apps/member-upload-management/MemberFieldConstants'
import { FettleDataGrid } from '@/views/apps/shared-component/components/fettle.data.grid'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ButtonGroup,
  Paper,
  Autocomplete,
  // ADD THESE NEW IMPORTS FOR ACCORDION
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'

// ADD THESE NEW IMPORTS
import { Formik, FieldArray } from 'formik'
import * as Yup from 'yup'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { Toast } from 'primereact/toast'
import { QuotationService } from '@/services/remote-api/api/quotation-services'
import DownloadIcon from '@mui/icons-material/Download';
import { FettleAutocomplete } from '@/views/apps/shared-component'
import { defaultPageRequest, PlanService } from '@/services/remote-api/fettle-remote-api'

const memberservice = new MemberService()
const memberProcessService = new MemberProcessService()
const quotationService = new QuotationService()
const planService = new PlanService();

const getDocumentTypeDisplayName = (docType: any) => {
  switch (docType) {
    case 'PASSPORT':
      return 'Passport';
    case 'NATIONAL_ID_CARD':
      return 'National ID Card';
    case 'VOTER_CARD':
      return 'Voter Card';
    case 'DRIVING_LICENSE':
      return 'Driving License';
    case 'PROFILE_IMAGE':
      return 'Profile Image';
    default:
      return docType || 'Unknown';
  }
};

const BorderLinearProgress = withStyles((theme: any) => ({
  root: {
    height: 10,
    borderRadius: 5
  },
  colorPrimary: {
    backgroundColor: theme?.palette?.grey[theme.palette.type === 'light' ? 200 : 700]
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#1a90ff'
  }
}))(LinearProgress)

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
  value: PropTypes.number.isRequired
}

const useStyles = (theme: any) => ({
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
})

const columnsDefinations = [
  {
    field: 'id',
    headerName: 'Request ID',
    body: (rowData: any) => <span style={{ lineBreak: 'anywhere' }}>{rowData.id}</span>
  },
  {
    field: 'fileName',
    headerName: 'File Name',
    body: (rowData: any) => <span style={{ lineBreak: 'anywhere' }}>{rowData.fileName}</span>
  },
  { field: 'totalRecords', headerName: 'Total Record Count' },
  { field: 'successfullyProcessedRecordCount', headerName: 'Success Record Count' },
  { field: 'unsuccessProcessedRecordCount', headerName: 'Unsuccess Record Count' },
  { field: 'status', headerName: 'Status' }
]

const processStatusReq: any = {
  page: 0,
  size: 10,
  summary: true,
  active: true
}

const memberPageRequest = {
  page: 0,
  size: 10,
  summary: true,
  active: true
}

interface MemberUploadComponentProps {
  classes?: any
  quotationDetails?: any
  getQuoationDetailsByID?: () => void
  onSeniorMembersUpdate?: (members: any[]) => void; // Add this prop
  seniorMembers?: any[]; // Add this prop
}

interface SchemeOption {
  id: string;
  name: string;
  description?: string;
}
interface PlanOption {
  id: string;
  name: string;
  code: string;
  productCode?: string | null;
  productCurrency?: string | null;
  premiumCurrency?: string | null;
  clientType: string;
  groupType?: string | null;
  description?: string | null;
  productId?: string | null;
  sourceType?: string | null;
  planCategorys: SchemeOption[]; // This matches your API response
}

const MemberUploadComponent: React.FC<MemberUploadComponentProps> = ({
  classes,
  quotationDetails,
  getQuoationDetailsByID,
  onSeniorMembersUpdate,
  seniorMembers
}) => {
  const router = useRouter()
  const query = useSearchParams()
  const toast = useRef<Toast>(null);
  // State declarations
  const [openTemplate, setOpenTemplate] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  const [apiList, setApiList] = useState<any[]>([])
  const [addFile, setAddFile] = useState(false)
  const [memberUpload, setMemberUpload] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [memberColDefn, setMemberColDefn] = useState([])
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMsg, setSnackbarMsg] = useState('')
  const [alertType, setAlertType] = useState('success')
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [reloadTable, setReloadTable] = useState(false)
  const [multiDocMemberId, setMultiDocMemberId] = useState(null);
  const [multiDocs, setMultiDocs] = useState([{ docType: '', docName: '', file: null, previewUrl: null, uploaded: false, uploading: false }]);
  const [uploadedDocTypes, setUploadedDocTypes] = useState<any[]>([]);
  const [previousDocs, setPreviousDocs] = useState<any[]>([]);
  const [multiDocOpen, setMultiDocOpen] = useState<boolean>(false);
  const [documentThumbnails, setDocumentThumbnails] = useState(new Map());
  const [documentPreviewOpen, setDocumentPreviewOpen] = useState(false);
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState('');
  const [documentPreviewName, setDocumentPreviewName] = useState('');
  const [documentPreviewMemberId, setDocumentPreviewMemberId] = useState(null);
  const [documentPreviewDocType, setDocumentPreviewDocType] = useState('');
  const [documentPreviewDocumentName, setDocumentPreviewDocumentName] = useState('');
  const [reUploadingDocument, setReUploadingDocument] = useState(false);
  const [uploadMode, setUploadMode] = useState<'bulk' | 'manual'>('bulk')
  const [localSchemeOptions, setLocalSchemeOptions] = useState<SchemeOption[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>();
  const [selectedPlanCode, setSelectedPlanCode] = useState<any>();

  // ADD NEW STATE FOR ACCORDION FUNCTIONALITY
  const [planOptions, setPlanOptions] = useState<PlanOption[]>([]);
  const [schemeOptions, setSchemeOptions] = useState<SchemeOption[]>([]);
  const [planLoading, setPlanLoading] = useState<boolean>(false);
  const [planInputValue, setPlanInputValue] = useState<string>('');
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };
  const useDebounce = (value: string, delay: number): string => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  // Use debounced value for API calls
  const debouncedPlanSearch = useDebounce(planInputValue, 500);

  const fetchPlanOptions = (searchTerm: string): void => {
    if (!searchTerm || searchTerm.length < 2) {
      setPlanOptions([]);
      return;
    }

    setPlanLoading(true);

    // Use the service method with proper PageRequest
    const pageRequest = { page: 0, size: 10 };

    memberservice.searchPlans(searchTerm, pageRequest as any)
      .subscribe({
        next: (data: any) => {
          if (data && data.content && Array.isArray(data.content)) {
            setPlanOptions(data.content);
          } else {
            setPlanOptions([]);
          }
          setPlanLoading(false);
        },
        error: (error: any) => {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch plan options',
            life: 3000
          });
          setPlanLoading(false);
          setPlanOptions([]);
        }
      });
  };

  // Add useEffect to trigger API call when debounced search changes
  useEffect(() => {
    if (debouncedPlanSearch) {
      fetchPlanOptions(debouncedPlanSearch);
    }
  }, [debouncedPlanSearch]);



  // Refs for storing values that don't trigger re-renders
  const subscriberRef = useRef<any>(null)
  const currentDocumentInfoRef = useRef<any>(null);

  // Calculate download string based on query params
  const getDownloadString = () => {
    if (query.get('policyId')) {
      return 'Download Renewal Template'
    } else if (query.get('type') === 'renewal') {
      return 'Download Renewal Template'
    } else {
      return 'Download Template'
    }
  }

  const [dowmloadTemplateString] = useState(getDownloadString())
  const [renewalPolicyId] = useState(query.get('policyId') || '')

  // Action buttons configuration
  const actionBtnList = [
    {
      icon: 'pi pi-download',
      className: 'ui-button-warning',
      onClick: openReportSection
    },
    {
      icon: 'pi pi-file-excel',
      className: 'action-btn',
      onClick: downloadSourceFile
    },
    {
      icon: 'pi pi-align-justify',
      onClick: handleProgressStat
    }
  ]

  const configuration = {
    enableSelection: false,
    scrollHeight: '300px',
    pageSize: 10,
    progressColumn: false,
    autoRefreshInterval: 5000,
    autoRefresh: true,
    actionButtons: actionBtnList,
    header: {
      enable: true,
      text: 'Process List'
    }
  }

  const memberConfiguration = {
    enableSelection: false,
    scrollHeight: '300px',
    pageSize: 10,
    actionButtons: [],
    header: {
      enable: true,
      text: 'Member Management'
    }
  }

  // Data source functions
  const dataSource$ = () => {
    processStatusReq.sort = ['rowCreatedDate dsc']
    processStatusReq.sourceType = 'QUOTATION'
    processStatusReq.sourceId = localStorage.getItem('quotationId')

    const pid = localStorage.getItem('prospectID')

    return memberservice.getProcessStatus(pid, processStatusReq).pipe(
      map((data: any) => {
        const content = data.content

        const records = content.map((item: any) => {
          if (item.status === 'PENDING') {
            item['progressPercentage'] = 0
          }

          if (item.status === 'INPROGRESS') {
            if (item.steps) {
              item.steps.forEach((el: any) => {
                if (el.name === 'LOAD' && el.status === 'INPROGRESS') {
                  item['progressPercentage'] = 0
                }

                if (el.name === 'LOAD' && el.status === 'COMPLETED') {
                  item['progressPercentage'] = 33
                }

                if (el.name === 'VALIDATION' && el.status === 'COMPLETED') {
                  item['progressPercentage'] = 66
                }
              })
            }
          }

          if (item.status === 'COMPLETED') {
            item['progressPercentage'] = 100
          }

          if (item.status === 'FAILED') {
            item['progressPercentage'] = 100
          }

          return item
        })

        data.content = records
        return data
      })
    )
  }

  const dataSourceMember$ = (
    pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true
    }
  ) => {
    pageRequest.key = 'sourceType'
    pageRequest.value = 'QUOTATION'
    pageRequest.key2 = 'sourceId'
    pageRequest.value2 = localStorage.getItem('quotationId')

    return memberProcessService.getMemberRequests(pageRequest)
  }

  // Event handlers
  const handleTabChange = (index: any) => {
    setActiveTabIndex(index)
  }

  const getAPIDetails = (sourceid: any) => {
    return memberservice.getSourceDetails(sourceid).subscribe(res => {
      setApiList((prevApiList: any) => [...prevApiList, res])
    })
  }

  const openTemplateModal = () => {
    setOpenTemplate(true)
  }

  const closeTemplateModal = () => {
    setOpenTemplate(false)
  }

  const doOpenModal = () => {
    setOpenModal(true)
  }

  const doCloseModal = () => {
    setOpenModal(false)
  }

  function openReportSection(val: any) {
    memberservice.downloadReport(val.id, 'report').subscribe(res => {
      const { data, headers } = res
      const fileName = headers['content-disposition'].replace(/\w+; filename=(.*)/, '$1')
      const blob = new Blob([data], { type: headers['content-type'] })
      const dom = document.createElement('a')
      const url = window.URL.createObjectURL(blob)

      dom.href = url
      dom.download = decodeURI(fileName)
      dom.style.display = 'none'
      document.body.appendChild(dom)
      dom.click()
      dom?.parentNode?.removeChild(dom)
      window.URL.revokeObjectURL(url)
    })
  }

  function downloadSourceFile(val: any) {
    memberservice.downloadReport(val.id, 'source_file').subscribe(res => {
      const { data, headers } = res
      const fileName = headers['content-disposition'].replace(/\w+; filename=(.*)/, '$1')
      const blob = new Blob([data], { type: headers['content-type'] })
      const dom = document.createElement('a')
      const url = window.URL.createObjectURL(blob)

      dom.href = url
      dom.download = decodeURI(fileName)
      dom.style.display = 'none'
      document.body.appendChild(dom)
      dom.click()
      dom.parentNode?.removeChild(dom)
      window.URL.revokeObjectURL(url)
    })
  }

  function handleProgressStat(process: any) {
    memberservice.getProcessStat(process.id).subscribe(res => {
      if (res.status === 'INPROGRESS') {
        const subscriber = interval(5000)
          .pipe(
            take(100),
            switchMap(i => memberservice.getProcessStat(process.id))
          )
          .subscribe((el: any) => {
            if (el.status === 'INPROGRESS') {
              const progressvalue = getProgressValue(el)
              setProgressValue(progressvalue)
              setShowProgress(true)
            } else {
              if (el.status === 'COMPLETED') {
                setProgressValue(100)
              }
              subscriber.unsubscribe()
            }
          })

        subscriberRef.current = subscriber
      } else {
        const progressvalue = getProgressValue(res)
        setProgressValue(progressvalue)
        setShowProgress(true)
      }
    })
  }

  const getProgressValue = (item: any) => {
    if (item.status === 'PENDING') {
      return 0
    }

    if (item.status === 'INPROGRESS') {
      if (item.steps) {
        let progressValue = 0
        item.steps.forEach((el: any) => {
          if (el.name === 'LOAD' && el.status === 'INPROGRESS') {
            progressValue = 0
          }

          if (el.name === 'LOAD' && el.status === 'COMPLETED') {
            progressValue = 33
          }

          if (el.name === 'VALIDATION' && el.status === 'COMPLETED') {
            progressValue = 66
          }
        })
        return progressValue
      }
    }

    if (item.status === 'COMPLETED') {
      return 100
    }

    return 0
  }

  const changeFileStat = () => {
    setAddFile(true)
  }

  const onComplete = () => {
    toggleSnackbar(true, 'success', 'File uploaded successfully. Please wait for sometime to process.')
    getQuoationDetailsByID?.()
    setMemberUpload(true as any)
    setTimeout(() => {
      setReloadTable(true)
    }, 3000)
    setTimeout(() => {
      setReloadTable(false)
    }, 1000)
  }

  const fetchDocumentThumbnails = (docs: any, memberId: any) => {
    const newThumbnails = new Map();

    docs.forEach((doc: any) => {
      if (doc.documentName) {

        memberservice.getMemberImageTypeReport(doc.id).subscribe({
          next: (blob) => {
            try {
              const url = URL.createObjectURL(blob);
              newThumbnails.set(doc.documentName, url);
              setDocumentThumbnails(prev => new Map([...prev, ...newThumbnails]));
            } catch (error) {
              console.error('Error creating thumbnail URL:', error);
            }
          },
          error: (error) => {
            console.error('Error fetching document thumbnail:', error);
          }
        });
      }
    });
  };

  const fetchPreviousUploads = (memberId: any) => {
    if (!memberId) return;

    memberservice.getMemberReports(memberId, localStorage.getItem('quotationId')).subscribe((response) => {

      if (response && Array.isArray(response)) {
        const processedDocs = response.map(doc => {
          // Use the correct field name from API response
          const docType = doc.documentType || doc.docType || 'Unknown';

          const processedDoc = {
            ...doc,
            docType: docType,
            docName: doc.documentName || doc.documentOriginalName || 'Unnamed',
            documentName: doc.documentName,
            memberId: memberId
          };

          return processedDoc;
        });

        setPreviousDocs(processedDocs);

        // Update uploaded document types to disable them in dropdown
        const uploadedTypes = processedDocs.map(doc => doc.docType);
        setUploadedDocTypes(uploadedTypes);

        fetchDocumentThumbnails(processedDocs, memberId);
      }
    })
  };

  const openMultiDocDialog = (memberId: any) => {
    setMultiDocMemberId(memberId);
    setMultiDocs([{ docType: '', docName: '', file: null, previewUrl: null, uploaded: false, uploading: false }]);
    setUploadedDocTypes([]);
    setPreviousDocs([]);
    setMultiDocOpen(true);

    // Fetch previous uploads when dialog opens
    fetchPreviousUploads(memberId);
  };

  const getMemberConfiguration = () => {
    memberservice.getMemberConfiguration().subscribe(res => {
      if (res.content && res.content.length > 0) {
        const colDef: any = res.content[0].fields.map((r: any) => {
          const obj: any = {
            field: MemberFieldConstants[r.name.toUpperCase() as keyof typeof MemberFieldConstants],
            headerName: toTitleCase(replaceAll(r.name, '_', ' '))
          }

          if (r.name === 'DATE_OF_BIRTH') {
            obj.body = (rowData: any) => {
              return <span style={{ lineBreak: 'anywhere' }}>{new Date(rowData.dateOfBirth).toLocaleDateString()}</span>
            }
          }

          if (r.name === 'MEMBERSHIP_NO') {
            obj.body = (rowData: any) => {
              return <span style={{ lineBreak: 'anywhere' }}>{rowData.membershipNo}</span>
            }
          }

          if (r.name === 'MOBILE_NO') {
            obj.body = (rowData: any) => {
              return <span style={{ lineBreak: 'anywhere' }}>{rowData.mobileNo}</span>
            }
          }

          if (r.name === 'EMAIL') {
            obj.body = (rowData: any) => {
              return <span style={{ lineBreak: 'anywhere' }}>{rowData.email}</span>
            }
          }

          if (r.name === 'NAME') {
            obj.body = (rowData: any) => {
              return (
                <span style={{ lineBreak: 'anywhere' }}>
                  {rowData.name}
                  {rowData.age >= 50 && (
                    <>
                      <br />
                      <span style={{ lineBreak: 'anywhere', color: 'red', fontWeight: '500', fontSize: "11.5px" }}>
                        {`(Medical check up is required)`}
                      </span>
                    </>
                  )}
                </span>
              )
            }
          }

          return obj
        })

        const obj = {
          field: 'uploadImage',
          headerName: 'Documents',
          body: (rowData: any) => (
            <div>
              <IconButton style={{ cursor: 'pointer' }} onClick={() => openMultiDocDialog(rowData.memberId)}>
                <TextSnippetIcon sx={{ color: '#BD3959' }} />
              </IconButton>
            </div>
          ),
        }

        colDef.push(obj)
        setMemberColDefn(colDef)

        res.content[0].fields.forEach((el: any) => {
          if (el.sourceApiId) {
            getAPIDetails(el.sourceApiId)
          }
        })
      }
    })
  }

  const toggleSnackbar = (
    status: boolean,
    alertTypeParam = alertType || 'success',
    snackbarMsgParam = snackbarMsg || 'Success'
  ) => {
    setOpenSnackbar(status)
    setAlertType(alertTypeParam)
    setSnackbarMsg(snackbarMsgParam)
  }

  const handleReloadTable = () => {
    setReloadTable(true)
    setTimeout(() => {
      setReloadTable(false)
    }, 1000)
  }

  // useEffect for component initialization
  useEffect(() => {
    getMemberConfiguration()
    handleLocalPlanChange()
    // Cleanup function
    return () => {
      if (subscriberRef.current) {
        subscriberRef.current.unsubscribe()
      }
    }
  }, [])

  const triggerMultiDocCameraPicker = (index: any) => {
    const input = document.getElementById(`multi-doc-camera-${index}`);
    if (input) input.click();
  };

  const addMultiDocRow = () => {
    setMultiDocs(prev => [...prev, { docType: '', docName: '', file: null, previewUrl: null, uploaded: false, uploading: false }]);
  };

  const updateMultiDoc = (index: number, key: any, value: any) => {
    setMultiDocs(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const autoUploadDocument = (index: number, file: any, docType: any) => {


    // Set uploading state
    setMultiDocs(prev => {
      const next = [...prev];
      next[index] = { ...next[index], uploading: true };
      return next;
    });

    const formData = new FormData();

    formData.append('quotationId', localStorage.getItem('quotationId')!)
    formData.append('filePart', file)
    formData.append('docType', "MEDICAL_DOC")

    quotationService.uploadMedicalReport(multiDocMemberId!, formData).subscribe((response: any) => {
      toggleSnackbar(true, 'success', 'Medical Report Uploaded Successfully')
    })
  };

  const handleMultiDocFileChange = (index: any, file: any) => {
    if (!file) return;

    updateMultiDoc(index, 'file', file);
    if (file.type && file.type.startsWith('image/')) {
      try {
        const url = URL.createObjectURL(file);
        updateMultiDoc(index, 'previewUrl', url);
        updateMultiDoc(index, 'docName', file.name || '');
      } catch (_) {
        updateMultiDoc(index, 'previewUrl', null);
      }
    } else {
      updateMultiDoc(index, 'previewUrl', null);
      updateMultiDoc(index, 'docName', file ? (file.name || '') : '');
    }

    // Auto-upload the document when file is selected
    if (file && multiDocMemberId) {
      // Check if document type is selected
      const doc = multiDocs[index];
      autoUploadDocument(index, file, doc.docType);
    }
  };

  const openPreviousDocumentPreview = (doc: any) => {
    memberservice.getMemberImageTypeReport(doc.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);

        setDocumentPreviewUrl(url);
        setDocumentPreviewOpen(true);
      },
      error: (error) => {

        let errorMessage = 'Failed to load document preview.';
        if (error.status === 401) {
          errorMessage = 'Authentication failed. Please refresh the page and try again.';
        } else if (error.status === 404) {
          errorMessage = 'Document not found. It may have been deleted or moved.';
        } else if (error.status === 403) {
          errorMessage = 'Access denied. You may not have permission to view this document.';
        } else if (error.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 5000
        });
      }
    });
  };

  const downloadDocument = (memberId: any, documentName: any, docType: any) => {
    if (!memberId || !documentName) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Missing document information for download.',
        life: 3000
      });
      return;
    }

    memberservice.getMemberImageType(memberId, documentName).subscribe({
      next: (blob) => {
        try {
          // Create download link
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${docType}_${documentName}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toast.current?.show({
            severity: 'success',
            summary: 'Download Started',
            detail: 'Document download has started.',
            life: 2000
          });
        } catch (error) {
          toast.current?.show({
            severity: 'error',
            summary: 'Download Failed',
            detail: 'Failed to download document. Please try again.',
            life: 3000
          });
        }
      },
      error: (error) => {
        toast.current?.show({
          severity: 'error',
          summary: 'Download Failed',
          detail: 'Failed to fetch document. Please try again.',
          life: 3000
        });
      }
    });
  };

  const getCurrentlyUsedDocTypes = () => {
    const uploadedTypes = uploadedDocTypes; // Already uploaded to server
    const inProgressTypes = multiDocs
      .filter(doc => doc.docType && (doc.file || doc.uploading)) // Has docType and either file or uploading
      .map(doc => doc.docType);

    return [...new Set([...uploadedTypes, ...inProgressTypes])]; // Remove duplicates
  };

  const openDocumentPreview = (url: any, name: any) => {
    setDocumentPreviewUrl(url);
    setDocumentPreviewName(name);
    setDocumentPreviewOpen(true);
  };

  const relationOptions = [
    { value: 'Self', label: 'Self' },
    { value: 'Spouse', label: 'Spouse' },
    { value: 'Son', label: 'Son' },
    { value: 'Daughter', label: 'Daughter' },
    { value: 'Father', label: 'Father' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Sister', label: 'Sister' }
  ]

  // ADD MEMBER ACCORDION COMPONENT BEFORE RETURN STATEMENT
  const MemberAccordion = ({
    index,
    member,
    values,
    touched,
    errors,
    handleChange,
    setFieldValue,
    onRemove,
    relationOptions,
    localSchemeOptions
  }: any) => {
    const [expanded, setExpanded] = useState<boolean>(index === 0);
    const [localPlanOptions, setLocalPlanOptions] = useState<PlanOption[]>([]);
    // const [localSchemeOptions, setLocalSchemeOptions] = useState<SchemeOption[]>([]);
    const [localPlanLoading, setLocalPlanLoading] = useState<boolean>(false);
    const [localPlanInputValue, setLocalPlanInputValue] = useState<string>('');
    const [localSelectedPlan, setLocalSelectedPlan] = useState<PlanOption | null>(null);

    const localDebouncedSearch = useDebounce(localPlanInputValue, 500);

    const fetchLocalPlanOptions = (searchTerm: string): void => {
      if (!searchTerm || searchTerm.length < 2) {
        setLocalPlanOptions([]);
        return;
      }

      setLocalPlanLoading(true);
      const pageRequest = { page: 0, size: 10 };

      memberservice.searchPlans(searchTerm, pageRequest as any)
        .subscribe({
          next: (data: any) => {
            if (data && data.content && Array.isArray(data.content)) {
              setLocalPlanOptions(data.content);
            } else {
              setLocalPlanOptions([]);
            }
            setLocalPlanLoading(false);
          },
          error: (error: any) => {
            setLocalPlanLoading(false);
            setLocalPlanOptions([]);
          }
        });
    };

    useEffect(() => {
      if (localDebouncedSearch) {
        fetchLocalPlanOptions(localDebouncedSearch);
      }
    }, [localDebouncedSearch]);

    // const handleLocalPlanChange = (
    //   event: React.SyntheticEvent,
    //   newValue: PlanOption | null
    // ): void => {
    //   setLocalSelectedPlan(newValue);
    //   setFieldValue(`members.${index}.plan`, newValue);
    //   setFieldValue(`members.${index}.scheme`, '');

    //   if (newValue && newValue.schemes && Array.isArray(newValue.schemes)) {
    //     setLocalSchemeOptions(newValue.schemes);
    //   } else if (newValue && newValue.id) {
    //     memberservice.getPlanDetails(newValue.id)
    //       .subscribe({
    //         next: (planDetails: any) => {
    //           if (planDetails && planDetails.schemes && Array.isArray(planDetails.schemes)) {
    //             setLocalSchemeOptions(planDetails.schemes);
    //           } else {
    //             setLocalSchemeOptions([]);
    //           }
    //         },
    //         error: (error: any) => {
    //           setLocalSchemeOptions([]);
    //         }
    //       });
    //   } else {
    //     setLocalSchemeOptions([]);
    //   }
    // };



    const memberErrors = errors?.members?.[index] || {};
    const memberTouched = touched?.members?.[index] || {};

    return (
      <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        sx={{
          mb: 2,
          border: '1px solid #e0e0e0',
          boxShadow: expanded ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)',
          '&:before': { display: 'none' }
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: expanded ? '#f5f5f5' : '#fafafa',
            minHeight: 64,
            '& .MuiAccordionSummary-content': {
              alignItems: 'center',
              justifyContent: 'space-between'
            }
          }}
        >
          <Box display="flex" alignItems="center" gap={2} width="100%">
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Member {index + 1}
              {member.name && (
                <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  - {member.name}
                </Typography>
              )}
            </Typography>

            {onRemove && (
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                sx={{ ml: 'auto' }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {/* Relation */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id={`relation-label-${index}`}>Relations</InputLabel>
                <Select
                  labelId={`relation-label-${index}`}
                  name={`members.${index}.relation`}
                  label="Relations"
                  value={member.relation}
                  onChange={handleChange}
                  error={memberTouched.relation && Boolean(memberErrors.relation)}
                >
                  {relationOptions.map((opt: any) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Employee ID */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                name={`members.${index}.employeeId`}
                label="Employee Id"
                value={member.employeeId}
                onChange={handleChange}
                error={memberTouched.employeeId && Boolean(memberErrors.employeeId)}
                helperText={memberTouched.employeeId && memberErrors.employeeId}
              />
            </Grid>

            {/* Name */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                name={`members.${index}.name`}
                label="Name"
                value={member.name}
                onChange={handleChange}
                error={memberTouched.name && Boolean(memberErrors.name)}
                helperText={memberTouched.name && memberErrors.name}
              />
            </Grid>

            {/* Date of Birth */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                type="date"
                name={`members.${index}.dateOfBirth`}
                label="Date Of Birth"
                InputLabelProps={{ shrink: true }}
                value={member.dateOfBirth}
                onChange={handleChange}
                error={memberTouched.dateOfBirth && Boolean(memberErrors.dateOfBirth)}
                helperText={memberTouched.dateOfBirth && memberErrors.dateOfBirth}
              />
            </Grid>

            {/* Gender */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id={`gender-label-${index}`}>Gender</InputLabel>
                <Select
                  labelId={`gender-label-${index}`}
                  name={`members.${index}.gender`}
                  label="Gender"
                  value={member.gender}
                  onChange={handleChange}
                  error={memberTouched.gender && Boolean(memberErrors.gender)}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                name={`members.${index}.email`}
                label="Email"
                value={member.email}
                onChange={handleChange}
                error={memberTouched.email && Boolean(memberErrors.email)}
                helperText={memberTouched.email && memberErrors.email}
              />
            </Grid>

            {/* Mobile No */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                name={`members.${index}.mobileNo`}
                label="Mobile No"
                value={member.mobileNo}
                onChange={handleChange}
                error={memberTouched.mobileNo && Boolean(memberErrors.mobileNo)}
                helperText={memberTouched.mobileNo && memberErrors.mobileNo}
              />
            </Grid>

            {/* Plan */}
            {/* <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                fullWidth
                size="small"
                options={localPlanOptions}
                loading={localPlanLoading}
                value={member.plan}
                onChange={(event: React.SyntheticEvent, newValue: PlanOption | null) =>
                  handleLocalPlanChange(event, newValue)
                }
                inputValue={localPlanInputValue}
                onInputChange={(event: React.SyntheticEvent, newInputValue: string) => {
                  setLocalPlanInputValue(newInputValue);
                }}
                getOptionLabel={(option: PlanOption) => {
                  // Use 'name' instead of 'planName'
                  return option?.name || '';
                }}
                isOptionEqualToValue={(option: PlanOption, value: PlanOption) => {
                  return option?.id === value?.id;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Plan"
                    error={memberTouched.plan && Boolean(memberErrors.plan)}
                    helperText={memberTouched.plan && memberErrors.plan}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {localPlanLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option: PlanOption) => (
                  <Box component="li" {...props} key={option?.id}>
                    <div>
                      <Typography variant="body2" fontWeight={500}>
                        {option?.name || 'Unknown Plan'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option?.code || ''} - {option?.clientType || ''}
                      </Typography>
                    </div>
                  </Box>
                )}
                noOptionsText={
                  localPlanInputValue.length < 2 ?
                    "Type at least 3 characters to search" :
                    "No plans found"
                }
              />
            </Grid> */}


            {/* Scheme */}

            {/* Scheme */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id={`scheme-label-${index}`}>Plan Scheme</InputLabel>
                <Select
                  labelId={`scheme-label-${index}`}
                  name={`members.${index}.scheme`}
                  label="Scheme"
                  value={member.scheme}
                  onChange={handleChange}
                  error={memberTouched.scheme && Boolean(memberErrors.scheme)}
                // disabled={!localSelectedPlan || localSchemeOptions.length === 0}
                >
                  {localSchemeOptions.map((scheme: any) => (
                    <MenuItem key={scheme.id} value={scheme.name}>
                      {scheme.name}
                    </MenuItem>
                  ))}
                </Select>
                {memberTouched.scheme && memberErrors.scheme && (
                  <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
                    {memberErrors.scheme}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Identification Doc Type */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id={`identification-doc-type-label-${index}`}>Identification Doc Type</InputLabel>
                <Select
                  labelId={`identification-doc-type-label-${index}`}
                  name={`members.${index}.identificationDocType`}
                  label="Identification Doc Type"
                  value={member.identificationDocType}
                  onChange={handleChange}
                  error={memberTouched.identificationDocType && Boolean(memberErrors.identificationDocType)}
                >
                  <MenuItem value="National Id">National Id</MenuItem>
                  <MenuItem value="Passport No">Passport No</MenuItem>
                  <MenuItem value="Driving Licence No">Driving Licence No</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Identification Doc Number */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                name={`members.${index}.identificationDocNumber`}
                label="Identification Doc Number"
                value={member.identificationDocNumber}
                onChange={handleChange}
                error={memberTouched.identificationDocNumber && Boolean(memberErrors.identificationDocNumber)}
                helperText={memberTouched.identificationDocNumber && memberErrors.identificationDocNumber}
              />
            </Grid>


          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };

  const planDataSourceCallback$ = (params = {}, action: any, pageRequest = defaultPageRequest) => {
    let reqParam: any = { ...pageRequest, ...params };
    if (action?.searchText) {
      reqParam = {
        ...reqParam,
        code: action.searchText,
        name: action.searchText,
        clientType: action.searchText,
      };
    }
    return planService.getPlans(reqParam);
  };

  const handleLocalPlanChange = (
  ): void => {

    if (quotationDetails.planId) {
      planService.getPlanDetails(quotationDetails.planId).subscribe((res: any) => {
        setLocalSchemeOptions(res.planCategorys);
        setSelectedPlanCode(res.code);
        // this.setState({
        //   planDetails: res
        // })
      })
    } else {
      quotationService.getQuoationDetailsByID(localStorage.getItem('quotationId') || '').subscribe((res: any) => {
        if (res.planId) {
          planService.getPlanDetails(res.planId).subscribe((planRes: any) => {
            setLocalSchemeOptions(planRes.planCategorys);
            setSelectedPlanCode(planRes.code);
            // this.setState({
            //   planDetails: planRes
            // })
          })
        }
      })
    }
    // setSelectedPlan(newValue);

    // // Set scheme options from the selected plan's planCategorys array
    // if (newValue && newValue.planCategorys && Array.isArray(newValue.planCategorys)) {
    // } else {
    //   setLocalSchemeOptions([]);
    // }
  };

  return (
    <div>
      <Toast
        ref={toast}
        style={{ zIndex: 9999 }}
        className="p-toast-top-right"
        position="top-right"
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => toggleSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => toggleSnackbar(false)} severity={alertType as any} variant='filled'>
          {snackbarMsg}
        </Alert>
      </Snackbar>

      <Grid container justifyContent='space-between' alignItems='center' style={{ padding: '10px 0' }}>
        <Grid item>
          <ButtonGroup variant='contained'>
            <Button onClick={() => setUploadMode('manual')} color={uploadMode === 'manual' ? 'primary' : 'inherit'}>
              Manual Upload
            </Button>
            <Button onClick={() => setUploadMode('bulk')} color={uploadMode === 'bulk' ? 'primary' : 'inherit'}>
              Bulk Upload
            </Button>
          </ButtonGroup>
        </Grid>
        {uploadMode === 'bulk' && (
          <Grid item container justifyContent='flex-end'>
            <Button
              className='ml-2 mt-2 p-button-secondary'
              size='small'
              color='secondary'
              variant='contained'
              onClick={openTemplateModal}
              startIcon={<GetAppIcon />}
            >
              {dowmloadTemplateString}
            </Button>
            <Button
              className='ml-2 mt-2'
              size='small'
              color='primary'
              variant='contained'
              onClick={doOpenModal}
              startIcon={<CloudUploadIcon />}
              style={{ marginLeft: 8 }}
            >
              Member Upload
            </Button>
            <Button
              className='ml-2 mt-2'
              size='small'
              color='primary'
              variant='contained'
              onClick={handleReloadTable}
              startIcon={<RefreshIcon />}
              style={{ marginLeft: 8 }}
            >
              Reload Table
            </Button>
          </Grid>
        )}
      </Grid>

      {/* {uploadMode === 'bulk' && (
        <TabView
          activeIndex={activeTabIndex}
          onTabChange={e => handleTabChange(e.index)}
          scrollable
          style={{ fontSize: '14px' }}
        >
          <TabPanel leftIcon='pi pi-user mr-2' header='Process Status'>
            <FettleDataGrid
              $datasource={dataSource$}
              columnsdefination={columnsDefinations}
              onEdit={openReportSection}
              config={configuration}
            />
          </TabPanel>
          <TabPanel leftIcon='pi pi-user-minus mr-2' header='Uploaded Member'>
            <FettleDataGrid
              reloadtable={reloadTable}
              $datasource={dataSourceMember$}
              config={memberConfiguration}
              columnsdefination={memberColDefn}
            />
          </TabPanel>
        </TabView>
      )} */}

      {uploadMode === 'manual' && (
        <Paper elevation={0} style={{ padding: 16, marginTop: 8 }}>
          <Formik
            initialValues={{
              members: [
                {
                  relation: '',
                  employeeId: '',
                  name: '',
                  dateOfBirth: '',
                  gender: '',
                  email: '',
                  mobileNo: '',
                  plan: null,
                  scheme: '',
                  identificationDocNumber: '',
                  identificationDocType: '',
                }
              ]
            }}
            validationSchema={Yup.object().shape({
              members: Yup.array().of(
                Yup.object().shape({
                  relation: Yup.string().required('Relation is required'),
                  employeeId: Yup.string().required('Employee Id is required'),
                  name: Yup.string().required('Name is required'),
                  dateOfBirth: Yup.string().required('Date Of Birth is required'),
                  gender: Yup.string().required('Gender is required'),
                  email: Yup.string().email('Invalid email').required('Email is required'),
                  mobileNo: Yup.string().required('Mobile No is required'),
                  // plan: Yup.object().nullable().required('Plan is required'),
                  scheme: Yup.string().required('Scheme is required'),
                  identificationDocNumber: Yup.string().required('Identification Doc Number is required'),
                  identificationDocType: Yup.string().required('Identification Doc Type is required'),
                })
              ).min(1, 'At least one member is required')
            })}

            onSubmit={(values, { resetForm, setSubmitting }) => {

              setSubmitting(true);


              const membersPayload = values.members.map((member: any) => ({
                relations: member.relation,
                employeeId: member.employeeId,
                employeeName: member.name,
                dateOfBirth: new Date(member.dateOfBirth).getTime(),
                gender: member.gender,
                email: member.email,
                mobileNo: member.mobileNo,
                planScheme: member.scheme,
                identificationDocType: member.identificationDocType,
                identificationDocNumber: member.identificationDocNumber
              }));

              const quotationId = localStorage.getItem('quotationId') || localStorage.getItem('quotationID');
              const prospectId = localStorage.getItem('prospectID') || localStorage.getItem('prospectId');

              if (!quotationId) {
                toast.current?.show({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Quotation ID not found. Please refresh the page and try again.',
                  life: 3000
                });
                setSubmitting(false);
                return;
              }

              if (!prospectId) {
                toast.current?.show({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Prospect ID not found. Please refresh the page and try again.',
                  life: 3000
                });
                setSubmitting(false);
                return;
              }


              memberservice.saveMultipleMembersWithMembershipNumbers(
                membersPayload,
                'retail'
              ).subscribe({
                next: (response: any) => {


                  toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: `${membersPayload.length} member(s) saved successfully .`,
                    life: 4000
                  });


                  if (onSeniorMembersUpdate) {
                    const seniorMembersData = values.members
                      .map((member: any, index: number) => ({
                        ...member,
                        membershipNo: response[index]?.membershipNo,
                        age: calculateAge(member.dateOfBirth)
                      }))
                      .filter((member: any) => member.age >= 50);

                    onSeniorMembersUpdate(seniorMembersData);
                  }


                  if (typeof handleReloadTable === 'function') {
                    handleReloadTable();
                  }

                  resetForm();
                  setSubmitting(false);
                },
                error: (error: any) => {

                  let errorMessage = 'Failed to save members. Please try again.';
                  if (error.status === 400) {
                    errorMessage = 'Invalid member data. Please check all required fields.';
                  } else if (error.status === 401) {
                    errorMessage = 'Authentication failed. Please refresh the page and try again.';
                  } else if (error.status === 500) {
                    errorMessage = 'Server error. Please try again later.';
                  }

                  toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorMessage,
                    life: 5000
                  });

                  setSubmitting(false);
                }
              });
            }}


          >
            {({ values, touched, errors, handleChange, handleSubmit, setFieldValue }: any) => {
              return (
                <>
                  {/* <FormControl size='small' sx={{ minWidth: 300, mb: 2 }}>
                    <FettleAutocomplete
                      id="plan"
                      name="plan"
                      label="Plan"
                      value={selectedPlan}
                      $datasource={planDataSourceCallback$}
                      changeDetect={true}
                      onChange={(e: any, newValue: any) => handleLocalPlanChange(e, newValue)}
                    />
                  </FormControl> */}
                  <form onSubmit={handleSubmit} noValidate>
                    <FieldArray name="members">
                      {({ push, remove }) => (
                        <Box>
                          {/* Header with Add Button */}
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              Member Details
                            </Typography>
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<AddIcon />}
                              onClick={() => push({
                                relation: '',
                                employeeId: '',
                                name: '',
                                dateOfBirth: '',
                                gender: '',
                                email: '',
                                mobileNo: '',
                                plan: null,
                                scheme: '',
                                identificationDocNumber: '',
                                identificationDocType: '',
                              })}
                              sx={{ mb: 1 }}
                            >
                              Add Member
                            </Button>
                          </Box>

                          {/* Accordion List */}
                          {values.members.map((member: any, index: number) => (
                            <MemberAccordion
                              key={index}
                              index={index}
                              member={member}
                              values={values}
                              touched={touched}
                              errors={errors}
                              handleChange={handleChange}
                              setFieldValue={setFieldValue}
                              onRemove={values.members.length > 1 ? () => remove(index) : undefined}
                              relationOptions={relationOptions}
                              localSchemeOptions={localSchemeOptions}
                            />
                          ))}

                          {/* Submit Button */}
                          <Box mt={3} display="flex" justifyContent="center">
                            <Button
                              type="submit"
                              color="primary"
                              variant="contained"
                              size="large"
                              sx={{ minWidth: 200 }}
                            >
                              Save All Members
                            </Button>
                          </Box>
                        </Box>
                      )}
                    </FieldArray>
                  </form>
                </>
              )
            }

            }
          </Formik>
        </Paper>
      )}
      <TabView
        activeIndex={activeTabIndex}
        onTabChange={e => handleTabChange(e.index)}
        scrollable
        style={{ fontSize: '14px' }}
      >
        {uploadMode === 'bulk' && (
          <TabPanel leftIcon='pi pi-user mr-2' header='Process Status'>
            <FettleDataGrid
              $datasource={dataSource$}
              columnsdefination={columnsDefinations}
              onEdit={openReportSection}
              config={configuration}
            />
          </TabPanel>
        )}

        <TabPanel leftIcon='pi pi-user-minus mr-2' header='Uploaded Member'>
          <FettleDataGrid
            reloadtable={reloadTable}
            $datasource={dataSourceMember$}
            config={memberConfiguration}
            columnsdefination={memberColDefn}
          />
        </TabPanel>
      </TabView>


      {/* REPLACED MANUAL UPLOAD WITH ACCORDION FUNCTIONALITY */}


      {uploadMode === 'bulk' && showProgress && (
        <>
          <h5 style={{ marginTop: '10px' }}>Progress Status</h5>
          <LinearProgressWithLabel value={progressValue} />
        </>
      )}

      {uploadMode === 'bulk' && (
        <FileUploadDialogComponent
          open={openModal}
          closeModal={doCloseModal}
          addFile={addFile}
          changeFileStat={changeFileStat}
          onComplete={onComplete}
        />
      )}

      {uploadMode === 'bulk' && openTemplate && (
        <MemberTemplateModal
          closeTemplateModal={closeTemplateModal}
          openTemplate={openTemplate}
          apiList={apiList}
          quotationDetails={quotationDetails}
          renewalPolicyId={renewalPolicyId}
          selectedPlanCode={selectedPlanCode}
        />
      )}

      <Dialog open={documentPreviewOpen} onClose={() => setDocumentPreviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          backgroundColor: '#BD3959',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6">{documentPreviewName}</Typography>
          <IconButton
            aria-label="close"
            onClick={() => setDocumentPreviewOpen(false)}
            sx={{ color: '#ffffff' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Box textAlign="center">
            <img
              src={documentPreviewUrl}
              alt={documentPreviewName}
              style={{
                width: '100%',
                maxHeight: 500,
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setDocumentPreviewOpen(false)}
            variant="contained"
            sx={{
              backgroundColor: '#BD3959',
              '&:hover': { backgroundColor: '#a12f4b' }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={multiDocOpen} onClose={() => setMultiDocOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#BD3959', color: '#ffffff' }}>
          Upload Medical Reports
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{
              fontWeight: 600,
              mb: 2,
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              📁 Previous Uploads
              <Box sx={{
                ml: 'auto',
                backgroundColor: '#f0f0f0',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: '12px',
                fontWeight: 500
              }}>
                {previousDocs.length}
              </Box>
            </Typography>

            {previousDocs.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 3,
                  backgroundColor: '#fafafa',
                  borderRadius: 1,
                  border: '1px dashed #ddd'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No documents uploaded yet
                </Typography>
              </Box>
            ) : (
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 2
              }}>
                {previousDocs.map((doc, i) => {
                  const thumbnailUrl = documentThumbnails.get(doc.documentName);
                  const docTypeColor = "#BD3959";

                  return (
                    <Box
                      key={i}
                      sx={{
                        position: 'relative',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-12px) scale(1.03)',
                          boxShadow: `0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px ${docTypeColor}40`,
                          '& .card-header': {
                            background: `linear-gradient(135deg, ${docTypeColor}20, ${docTypeColor}10)`,
                            '& .type-badge': {
                              background: docTypeColor,
                              color: '#fff',
                              transform: 'scale(1.05)'
                            }
                          },
                          '& .thumbnail-container': {
                            '& .overlay': {
                              opacity: 1
                            },
                            '& img': {
                              transform: 'scale(1.08)'
                            }
                          },
                          '& .floating-actions': {
                            opacity: 1,
                            transform: 'translateY(0)'
                          }
                        }
                      }}
                    >
                      {/* Modern Glass Header */}
                      <Box
                        className="card-header"
                        sx={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(248,250,252,0.6))',
                          backdropFilter: 'blur(10px)',
                          borderBottom: '1px solid rgba(0,0,0,0.05)',
                          px: 3,
                          py: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Box
                          className="type-badge"
                          sx={{
                            background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6))',
                            color: '#fff',
                            px: 2,
                            py: 0.5,
                            borderRadius: '12px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              fontSize: '11px',
                              textTransform: 'uppercase',
                              letterSpacing: '1px'
                            }}
                          >
                            xyz
                          </Typography>
                        </Box>

                        {/* Status Indicator */}
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: `linear-gradient(45deg, ${docTypeColor}, ${docTypeColor}80)`,
                            boxShadow: `0 0 8px ${docTypeColor}60`
                          }}
                        />
                      </Box>

                      {/* Enhanced Thumbnail Section */}
                      <Box sx={{ p: 3 }}>
                        <Box
                          className="thumbnail-container"
                          sx={{
                            position: 'relative',
                            width: '100%',
                            height: '140px',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            border: '1px solid rgba(0,0,0,0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.4s ease',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.04)'
                          }}
                          onClick={() => {

                            openPreviousDocumentPreview(doc)
                          }}
                        >
                          {thumbnailUrl ? (
                            <>
                              <img
                                src={thumbnailUrl}
                                alt={doc.docType}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                              />
                              {/* Hover Overlay */}
                              <Box
                                className="overlay"
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3))',
                                  opacity: 0,
                                  transition: 'opacity 0.3s ease',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: '#fff',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    px: 2
                                  }}
                                >
                                  Click to Preview
                                </Typography>
                              </Box>
                            </>
                          ) : (
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2
                              }}
                            >
                              <CircularProgress
                                size={28}
                                sx={{
                                  color: docTypeColor,
                                  '& .MuiCircularProgress-circle': {
                                    strokeLinecap: 'round'
                                  }
                                }}
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'rgba(0,0,0,0.5)',
                                  fontWeight: 500
                                }}
                              >
                                Loading preview...
                              </Typography>
                            </Box>
                          )}

                          {/* Floating Action Buttons */}
                          <Box
                            className="floating-actions"
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              display: 'flex',
                              gap: 1,
                              opacity: 0,
                              transform: 'translateY(-10px)',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()

                                downloadDocument(doc.memberId, doc.documentName, doc.docType)
                              }}
                              sx={{
                                background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6))',
                                backdropFilter: 'blur(10px)',
                                color: '#fff',
                                width: 36,
                                height: 36,
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,0,0,0.7))',
                                  transform: 'scale(1.1) rotate(5deg)',
                                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                                }
                              }}
                            >
                              <DownloadIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Box>

                          {/* Document Info Overlay */}
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                              color: '#fff',
                              p: 2,
                              transform: 'translateY(100%)',
                              transition: 'transform 0.3s ease',
                              '.thumbnail-container:hover &': {
                                transform: 'translateY(0)'
                              }
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 500,
                                fontSize: '12px',
                                opacity: 0.9
                              }}
                            >
                              {doc.documentName}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Subtle Border Glow */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          borderRadius: '24px',
                          padding: '1px',
                          background: `linear-gradient(135deg, ${docTypeColor}20, transparent, ${docTypeColor}10)`,
                          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          maskComposite: 'exclude',
                          pointerEvents: 'none',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          '.MuiBox-root:hover &': {
                            opacity: 1
                          }
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
          <Divider sx={{ mb: 2 }} />

          {/* Info text about document type restrictions */}
          <Typography variant="caption" sx={{
            color: '#666',
            mb: 2,
            display: 'block',
            fontStyle: 'italic'
          }}>
            💡 Each document type can only be uploaded once. Document types that are already uploaded or in progress will be disabled.
          </Typography>

          {multiDocs.map((doc, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel id={`multi-doc-type-${index}`}>Document type</InputLabel>
                <Select
                  labelId={`multi-doc-type-${index}`}
                  label="Document type"
                  value={doc.docType}
                  onChange={(e) => {
                    const selectedDocType = e.target.value;
                    const currentlyUsedTypes = getCurrentlyUsedDocTypes();

                    // Check if the selected document type is already being used
                    if (currentlyUsedTypes.includes(selectedDocType)) {
                      toast.current?.show({
                        severity: 'warn',
                        summary: 'Document Type Already Used',
                        detail: `${selectedDocType} is already being uploaded or has been uploaded.`,
                        life: 3000
                      });
                      return; // Don't update the document type
                    }

                    updateMultiDoc(index, 'docType', selectedDocType);
                    // Auto-trigger file picker when document type is selected
                    if (selectedDocType && !doc.file) {
                      setTimeout(() => {
                        document.getElementById(`multi-doc-device-${index}`)?.click();
                      }, 100);
                    }
                  }}
                >
                  <MenuItem value={"PASSPORT"} disabled={getCurrentlyUsedDocTypes().includes('PASSPORT')}>
                    {getDocumentTypeDisplayName('PASSPORT')} {getCurrentlyUsedDocTypes().includes('PASSPORT') && ' (Already Used)'}
                  </MenuItem>
                  <MenuItem value={"NATIONAL_ID_CARD"} disabled={getCurrentlyUsedDocTypes().includes('NATIONAL_ID_CARD')}>
                    {getDocumentTypeDisplayName('NATIONAL_ID_CARD')} {getCurrentlyUsedDocTypes().includes('NATIONAL_ID_CARD') && ' (Already Used)'}
                  </MenuItem>
                  <MenuItem value={"VOTER_CARD"} disabled={getCurrentlyUsedDocTypes().includes('VOTER_CARD')}>
                    {getDocumentTypeDisplayName('VOTER_CARD')} {getCurrentlyUsedDocTypes().includes('VOTER_CARD') && ' (Already Used)'}
                  </MenuItem>
                  <MenuItem value={"DRIVING_LICENSE"} disabled={getCurrentlyUsedDocTypes().includes('DRIVING_LICENSE')}>
                    {getDocumentTypeDisplayName('DRIVING_LICENSE')} {getCurrentlyUsedDocTypes().includes('DRIVING_LICENSE') && ' (Already Used)'}
                  </MenuItem>
                </Select>
              </FormControl>
              <TextField
                size="small"
                label="Document name"
                value={doc.docName || ''}
                onChange={(e) => updateMultiDoc(index, 'docName', e.target.value)}
                sx={{ flex: 1 }}
              />
              {doc.previewUrl ? (
                <div style={{ position: 'relative' }}>
                  <img
                    src={doc.previewUrl}
                    alt="preview"
                    style={{
                      width: 48,
                      height: 48,
                      objectFit: 'cover',
                      borderRadius: 4,
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                    }}
                    onClick={() => openDocumentPreview(doc.previewUrl, doc.docName || 'Document')}
                  />
                  {doc.uploading && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CircularProgress size={20} sx={{ color: '#fff' }} />
                    </div>
                  )}
                  {doc.uploaded && (
                    <div style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: '#4caf50',
                      color: '#fff',
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12
                    }}>
                      ✓
                    </div>
                  )}
                </div>
              ) : null}

              <IconButton onClick={() => triggerMultiDocCameraPicker(index)} sx={{ backgroundColor: '#BD3959', color: '#fff' }}>
                <PhotoCameraIcon />
              </IconButton>
              <IconButton onClick={addMultiDocRow} sx={{ backgroundColor: '#BD3959', color: '#fff' }}>
                <AddIcon />
              </IconButton>

              <input id={`multi-doc-device-${index}`} type="file" accept="image/jpeg, image/png,application/pdf" style={{ display: 'none' }} onChange={(e) => handleMultiDocFileChange(index, e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
              <input id={`multi-doc-camera-${index}`} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={(e) => handleMultiDocFileChange(index, e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMultiDocOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default withStyles(useStyles)(MemberUploadComponent)
