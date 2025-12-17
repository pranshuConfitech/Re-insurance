'use client'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import UploadIcon from '@mui/icons-material/Upload'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CircularProgress from '@mui/material/CircularProgress'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { useFormik } from 'formik'
import * as yup from 'yup'
import { AgentsService } from '@/services/remote-api/api/agents-services'
import { Toast } from 'primereact/toast'

const useStyles = makeStyles((theme: any) => ({
    input: {
        width: '90%'
    },
    formControl: {
        minWidth: '90%'
    },
    thumbnailContainer: {
        width: '120px',
        height: '80px',
        border: '2px dashed #ccc',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        cursor: 'pointer',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
            backgroundColor: '#e0e0e0'
        },
        // Add hover effect for the overlay
        '&:hover .thumbnail-overlay': {
            opacity: '1 !important'
        },
        // Add hover effect for action buttons
        '&:hover .action-buttons': {
            opacity: '1 !important'
        }
    },
    uploadedThumbnail: {
        border: '2px solid #bdbdbd',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        '&:hover': {
            border: '2px solid #bdbdbd',
        }
    },
    sectionTitle: {
        color: '#1976d2',
        fontWeight: 600,
        marginBottom: '16px',
        marginTop: '20px'
    },
    modalImage: {
        maxWidth: '100%',
        maxHeight: '80vh',
        objectFit: 'contain'
    },
    actionButtons: {
        position: 'absolute',
        top: '4px',
        right: '4px',
        display: 'flex',
        gap: '4px',
        opacity: 0,
        transition: 'opacity 0.2s',
        zIndex: 10
    },
    actionButton: {
        backgroundColor: 'white',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: '1px solid #ddd',
        '&:hover': {
            transform: 'scale(1.1)'
        }
    }
}))

const agentservice = new AgentsService()

// Define interfaces with document tracking
interface DocumentBase {
    documentType: string
    thumbnail: File | null
    thumbnailName: string
    documentBase64: string
    documentFileFormat: string
    documentId: string | null
    isExisting: boolean
}

interface KycDocument extends DocumentBase {
    documentNo: string
}

interface LicenseDocument extends DocumentBase {
    licenseNo: string
    startDate: Date | null
    expiryDate: Date | null
}

interface CancelledCheque extends DocumentBase {
    bankName: string
    branchCode: string
    accountNo: string
}

interface FormValues {
    kycDocuments: KycDocument[]
    licenseDocument: LicenseDocument
    cancelledCheque: CancelledCheque
}

// Validation schema for documents
const validationSchema = yup.object({
    kycDocuments: yup.array().of(
        yup.object().shape({
            documentType: yup.string().required('Document Type is required'),
            documentNo: yup.string().required('Document No is required'),
            thumbnail: yup.mixed().nullable()
        })
    ).min(1, 'At least one KYC document is required'),

    licenseDocument: yup.object().shape({
        licenseNo: yup.string().required('License No is required'),
        startDate: yup.date().required('Start date is required').nullable(),
        expiryDate: yup.date().required('Expiry date is required').nullable(),
        thumbnail: yup.mixed().nullable()
    }),

    cancelledCheque: yup.object().shape({
        bankName: yup.string().required('Bank name is required'),
        branchCode: yup.string().required('Branch code is required'),
        accountNo: yup.string().required('Account number is required'),
        thumbnail: yup.mixed().nullable()
    })
})

export default function AgentDocumentsComponent(props: any) {
    const classes = useStyles()
    const router = useRouter()
    const toast = React.useRef<Toast>(null)
    const params = useParams()
    const id: any = params.id

    // Upload states for loading indicators
    const [uploadingStates, setUploadingStates] = React.useState<{ [key: string]: boolean }>({})
    // Loading state for document fetching
    const [documentLoading, setDocumentLoading] = React.useState<boolean>(false)

    const [documentModal, setDocumentModal] = React.useState({
        visible: false,
        loading: false,
        document: null as any,
        imageUrl: ''
    })

    const [documentFiles, setDocumentFiles] = React.useState<{
        kyc: (File | null)[];
        license: File | null;
        cheque: File | null;
    }>({
        kyc: [],
        license: null,
        cheque: null,
    });



    const [previewUrls, setPreviewUrls] = React.useState<{ [key: string]: string }>({})
    const [localPreviewUrls, setLocalPreviewUrls] = React.useState<{ [key: string]: string }>({})

    const formik = useFormik<FormValues>({
        initialValues: {
            kycDocuments: [
                {
                    documentType: '',
                    documentNo: '',
                    thumbnail: null,
                    thumbnailName: '',
                    documentBase64: '',
                    documentFileFormat: '',
                    documentId: null,
                    isExisting: false
                }
            ],
            licenseDocument: {
                documentType: 'License',
                licenseNo: '',
                startDate: null,
                expiryDate: null,
                thumbnail: null,
                thumbnailName: '',
                documentBase64: '',
                documentFileFormat: '',
                documentId: null,
                isExisting: false
            },
            cancelledCheque: {
                documentType: 'Cancelled cheque copy',
                bankName: '',
                branchCode: '',
                accountNo: '',
                thumbnail: null,
                thumbnailName: '',
                documentBase64: '',
                documentFileFormat: '',
                documentId: null,
                isExisting: false
            }
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            await handleSubmitStepFour()
        }
    })

    const [licenseStatus, setLicenseStatus] = useState<'Active' | 'Expired' | ''>('')

    const getLicenseStatus = (expiryDate: Date | null): 'Active' | 'Expired' | '' => {
        if (!expiryDate) return ''

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const expiry = new Date(expiryDate)
        expiry.setHours(0, 0, 0, 0)

        return expiry >= today ? 'Active' : 'Expired'
    }

    useEffect(() => {
        const status = getLicenseStatus(formik.values.licenseDocument.expiryDate)
        setLicenseStatus(status)
    }, [formik.values.licenseDocument.expiryDate])

    // Helper function to get document type for API
    const getApiDocumentType = (componentDocType: string, section: 'kyc' | 'license' | 'cheque') => {
        const docTypeMapping: { [key: string]: string } = {
            'National Id': 'NATIONAL_ID',
            'Driving License': 'DRIVING_LICENSE',
            'Passport': 'PASSPORT',
            'License': 'LICENSE',
            'Cancelled cheque copy': 'CANCELED_CHEQUE'
        }
        return docTypeMapping[componentDocType] || componentDocType
    }

    // Helper function to map API document type to component document type
    const getComponentDocumentType = (apiDocType: string) => {
        const reverseDocTypeMapping: { [key: string]: string } = {
            'NATIONAL_ID': 'National Id',
            'DRIVING_LICENSE': 'Driving License',
            'PASSPORT': 'Passport',
            'LICENSE': 'License',
            'CANCELED_CHEQUE': 'Cancelled cheque copy'
        }
        return reverseDocTypeMapping[apiDocType] || apiDocType
    }

    // Helper function to format date for API
    const formatDateForApi = (date: Date | null): string => {
        if (!date) return '';
        return new Date(date).getTime().toString();
    };

    // Get available KYC options (exclude already selected)
    const getAvailableKycOptions = (currentIndex: number) => {
        const allOptions = ['National Id', 'Driving License', 'Passport']
        const selectedOptions = formik.values.kycDocuments
            .map((doc, index) => index !== currentIndex ? doc.documentType : null)
            .filter(Boolean)
        return allOptions.filter(option => !selectedOptions.includes(option))
    }

    // Convert file to base64
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
                const result = reader.result as string
                const base64String = result.replace('data:', '').replace(/^.+,/, '')
                resolve(base64String)
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    // Helper function to get field error safely
    const getFieldError = (field: string, index?: number) => {
        const errors = formik.errors as any
        if (index !== undefined) {
            return errors[field]?.[index] || {}
        }
        return errors[field] || {}
    }

    // Helper function to get field touched safely
    const getFieldTouched = (field: string, index?: number) => {
        const touched = formik.touched as any
        if (index !== undefined) {
            return touched[field]?.[index] || {}
        }
        return touched[field] || {}
    }

    // Helper: Find document in form data for metadata
    const findDocumentInForm = (documentId: string) => {
        const kycDoc = formik.values.kycDocuments.find(doc => doc.documentId === documentId)
        if (kycDoc) return kycDoc

        if (formik.values.licenseDocument.documentId === documentId) {
            return formik.values.licenseDocument
        }

        if (formik.values.cancelledCheque.documentId === documentId) {
            return formik.values.cancelledCheque
        }

        return null
    }

    // View Document in Modal
    const handleViewDocument = async (documentId: string) => {
        if (!documentId) return

        setDocumentModal(prev => ({
            ...prev,
            visible: true,
            loading: true,
            document: null,
            imageUrl: ''
        }))

        try {
            const blob = await agentservice.getDocumentById(documentId).toPromise()
            const imageUrl = URL.createObjectURL(blob!)

            const existingDoc = findDocumentInForm(documentId)

            setDocumentModal(prev => ({
                ...prev,
                loading: false,
                document: existingDoc || { documentOriginalName: 'Document' },
                imageUrl: imageUrl
            }))
        } catch (error) {
            console.error('Error fetching document:', error)
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load document. Please try again.'
            })
            setDocumentModal(prev => ({ ...prev, visible: false, loading: false }))
        }
    }

    // Close Document Modal
    const handleCloseModal = () => {
        if (documentModal.imageUrl && documentModal.imageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(documentModal.imageUrl)
        }

        setDocumentModal({
            visible: false,
            loading: false,
            document: null,
            imageUrl: ''
        })
    }

    // ✅ NEW: Delete document handler
    const handleDeleteDocument = async (documentId: string, fieldName: string, index?: number) => {
        if (!documentId) return;

        try {
            const agentId = localStorage.getItem('agentId') || id;
            if (!agentId) throw new Error('Agent ID not found');

            await agentservice.deleteAgentDocument(agentId, documentId).toPromise();

            // Reset form and clear stored file based on field type
            if (fieldName === 'kyc' && index !== undefined) {
                formik.setFieldValue(`kycDocuments[${index}]`, {
                    documentType: formik.values.kycDocuments[index].documentType,
                    documentNo: formik.values.kycDocuments[index].documentNo,
                    thumbnail: null,
                    thumbnailName: '',
                    documentBase64: '',
                    documentFileFormat: '',
                    documentId: null,
                    isExisting: false
                });

                // Clear stored file
                setDocumentFiles((prev) => {
                    const newKycFiles = [...prev.kyc];
                    newKycFiles[index] = null;
                    return { ...prev, kyc: newKycFiles };
                });

                // Clear preview
                setPreviewUrls((prev) => {
                    const newUrls = { ...prev };
                    delete newUrls[`kyc-${index}`];
                    return newUrls;
                });
                setLocalPreviewUrls((prev) => {
                    const newUrls = { ...prev };
                    delete newUrls[`kyc-${index}`];
                    return newUrls;
                });
            } else if (fieldName === 'license') {
                formik.setFieldValue('licenseDocument', {
                    documentType: 'License',
                    licenseNo: formik.values.licenseDocument.licenseNo,
                    startDate: formik.values.licenseDocument.startDate,
                    expiryDate: formik.values.licenseDocument.expiryDate,
                    thumbnail: null,
                    thumbnailName: '',
                    documentBase64: '',
                    documentFileFormat: '',
                    documentId: null,
                    isExisting: false
                });

                // Clear stored file
                setDocumentFiles((prev) => ({ ...prev, license: null }));

                // Clear preview
                setPreviewUrls((prev) => {
                    const newUrls = { ...prev };
                    delete newUrls.license;
                    return newUrls;
                });
                setLocalPreviewUrls((prev) => {
                    const newUrls = { ...prev };
                    delete newUrls.license;
                    return newUrls;
                });
            } else if (fieldName === 'cheque') {
                formik.setFieldValue('cancelledCheque', {
                    documentType: 'Cancelled cheque copy',
                    bankName: formik.values.cancelledCheque.bankName,
                    branchCode: formik.values.cancelledCheque.branchCode,
                    accountNo: formik.values.cancelledCheque.accountNo,
                    thumbnail: null,
                    thumbnailName: '',
                    documentBase64: '',
                    documentFileFormat: '',
                    documentId: null,
                    isExisting: false
                });

                // Clear stored file
                setDocumentFiles((prev) => ({ ...prev, cheque: null }));

                // Clear preview
                setPreviewUrls((prev) => {
                    const newUrls = { ...prev };
                    delete newUrls.cheque;
                    return newUrls;
                });
                setLocalPreviewUrls((prev) => {
                    const newUrls = { ...prev };
                    delete newUrls.cheque;
                    return newUrls;
                });
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Document Deleted',
                detail: 'Document deleted successfully'
            });

        } catch (error) {
            console.error('Error deleting document:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Delete Failed',
                detail: 'Failed to delete document. Please try again.'
            });
        }
    };


    // Fetch and populate uploaded documents
    const fetchAndPopulateDocuments = async (agentId: string) => {
        setDocumentLoading(true)
        try {
            const documents = await agentservice.getAgentDocuments(agentId).toPromise()

            if (documents && documents.length > 0) {
                const kycDocs: any[] = []
                let licenseDoc: any = null
                let chequeDoc: any = null

                documents.forEach((doc: any) => {
                    switch (doc.documentType) {
                        case 'NATIONAL_ID':
                        case 'DRIVING_LICENSE':
                        case 'PASSPORT':
                            kycDocs.push({
                                documentType: getComponentDocumentType(doc.documentType),
                                documentNo: doc.documentNo || '',
                                thumbnail: null,
                                thumbnailName: doc.documentOriginalName || 'Existing document',
                                documentBase64: '',
                                documentFileFormat: doc.docFormat || '',
                                documentId: doc.id,
                                isExisting: true
                            })
                            break

                        case 'LICENSE':
                            licenseDoc = {
                                documentType: 'License',
                                licenseNo: doc.documentNo || '',
                                startDate: doc.startDate ? new Date(doc.startDate) : null,
                                expiryDate: doc.expiryDate ? new Date(doc.expiryDate) : null,
                                thumbnail: null,
                                thumbnailName: doc.documentOriginalName || 'Existing document',
                                documentBase64: '',
                                documentFileFormat: doc.docFormat || '',
                                documentId: doc.id,
                                isExisting: true
                            }
                            break

                        case 'CANCELED_CHEQUE':
                            chequeDoc = {
                                documentType: 'Cancelled cheque copy',
                                bankName: doc.docBankName || '',
                                branchCode: doc.docBranchCode || '',
                                accountNo: doc.docAccountNo || '',
                                thumbnail: null,
                                thumbnailName: doc.documentOriginalName || 'Existing document',
                                documentBase64: '',
                                documentFileFormat: doc.docFormat || '',
                                documentId: doc.id,
                                isExisting: true
                            }
                            break
                    }
                })

                if (kycDocs.length > 0) {
                    formik.setFieldValue('kycDocuments', kycDocs)
                }

                if (licenseDoc) {
                    formik.setFieldValue('licenseDocument', licenseDoc)
                }

                if (chequeDoc) {
                    formik.setFieldValue('cancelledCheque', chequeDoc)
                }

                toast.current?.show({
                    severity: 'info',
                    summary: 'Documents Loaded',
                    detail: `Found ${documents.length} existing document(s)`
                })
            }
        } catch (error) {
            console.error('Error fetching documents:', error)
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load documents'
            })
        } finally {
            setDocumentLoading(false)
        }
    }

    // KYC Document Handlers
    const handleAddKycDocument = () => {
        const newDoc: KycDocument = {
            documentType: '',
            documentNo: '',
            thumbnail: null,
            thumbnailName: '',
            documentBase64: '',
            documentFileFormat: '',
            documentId: null,
            isExisting: false
        }
        formik.setFieldValue('kycDocuments', [...formik.values.kycDocuments, newDoc])
    }

    const handleRemoveKycDocument = (index: number) => {
        const updatedDocs = formik.values.kycDocuments.filter((_, i) => i !== index)
        formik.setFieldValue('kycDocuments', updatedDocs)
    }

    const handleKycInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const { name, value } = e.target
        formik.setFieldValue(`kycDocuments[${index}].${name}`, value)
    }

    const handleKycThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const base64String = await convertToBase64(file);

            formik.setFieldValue(`kycDocuments[${index}].thumbnail`, file);
            formik.setFieldValue(`kycDocuments[${index}].thumbnailName`, file.name);
            formik.setFieldValue(`kycDocuments[${index}].documentBase64`, base64String);
            formik.setFieldValue(`kycDocuments[${index}].documentFileFormat`, file.type);
            formik.setFieldValue(`kycDocuments[${index}].isExisting`, false);

            // Store file in state for reupload
            setDocumentFiles((prev) => {
                const newKycFiles = [...prev.kyc];
                newKycFiles[index] = file;
                return { ...prev, kyc: newKycFiles };
            });

            // Create local preview
            setLocalPreviewUrls((prev) => ({
                ...prev,
                [`kyc-${index}`]: URL.createObjectURL(file),
            }));
        } catch (error) {
            console.error('Error converting file to base64:', error);
        }
    };


    // License Document Handlers
    const handleLicenseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        formik.setFieldValue(`licenseDocument.${name}`, value)
    }

    const handleLicenseExpiryChange = (date: any) => {
        formik.setFieldValue('licenseDocument.expiryDate', date)
    }

    const handleLicenseThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const base64String = await convertToBase64(file);

            formik.setFieldValue('licenseDocument.thumbnail', file);
            formik.setFieldValue('licenseDocument.thumbnailName', file.name);
            formik.setFieldValue('licenseDocument.documentBase64', base64String);
            formik.setFieldValue('licenseDocument.documentFileFormat', file.type);
            formik.setFieldValue('licenseDocument.isExisting', false);

            // Store file in state for reupload
            setDocumentFiles((prev) => ({ ...prev, license: file }));

            // Create local preview
            setLocalPreviewUrls((prev) => ({
                ...prev,
                license: URL.createObjectURL(file),
            }));
        } catch (error) {
            console.error('Error converting file to base64:', error);
        }
    };


    // Cancelled Cheque Handlers
    const handleChequeThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const base64String = await convertToBase64(file);

            formik.setFieldValue('cancelledCheque.thumbnail', file);
            formik.setFieldValue('cancelledCheque.thumbnailName', file.name);
            formik.setFieldValue('cancelledCheque.documentBase64', base64String);
            formik.setFieldValue('cancelledCheque.documentFileFormat', file.type);
            formik.setFieldValue('cancelledCheque.isExisting', false);

            // Store file in state for reupload
            setDocumentFiles((prev) => ({ ...prev, cheque: file }));

            // Create local preview
            setLocalPreviewUrls((prev) => ({
                ...prev,
                cheque: URL.createObjectURL(file),
            }));
        } catch (error) {
            console.error('Error converting file to base64:', error);
        }
    };


    // Enhanced KYC Upload Handler
    const handleKycUpload = async (index: number) => {
        const kycDocument = formik.values.kycDocuments[index];

        // FIXED: Check if it's an existing document
        const isExistingDocument = kycDocument.isExisting && kycDocument.documentId;
        const fileToUpload = documentFiles.kyc[index] || kycDocument.thumbnail;

        if (!kycDocument.documentType || !kycDocument.documentNo) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please fill all required fields'
            });
            return;
        }

        // FIXED: Only require file if not an existing document
        if (!isExistingDocument && !fileToUpload) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please select a file to upload'
            });
            return;
        }

        setUploadingStates(prev => ({ ...prev, [`kyc_${index}`]: true }));

        try {
            const agentId = localStorage.getItem('agentId') || id;
            if (!agentId) throw new Error('Agent ID not found');

            // FIXED: If existing document and no new file, fetch the original file
            let finalFileToUpload = fileToUpload;

            if (isExistingDocument && !fileToUpload) {
                const blob = await agentservice.getDocumentById(kycDocument.documentId!).toPromise();
                if (blob) {
                    const file = new File([blob], kycDocument.thumbnailName || 'document.jpg', {
                        type: kycDocument.documentFileFormat || 'image/jpeg'
                    });
                    finalFileToUpload = file;
                }
            }

            if (!finalFileToUpload) {
                throw new Error('Unable to get document file');
            }

            const formData = new FormData();
            formData.append('docType', getApiDocumentType(kycDocument.documentType, 'kyc'));
            formData.append('filePart', finalFileToUpload);
            formData.append('docNo', kycDocument.documentNo);
            formData.append('expiryDate', '');

            await agentservice.uploadAgentDocument(agentId, formData).toPromise();
            await fetchAndPopulateDocuments(agentId);

            toast.current?.show({
                severity: 'success',
                summary: 'Upload Successful',
                detail: `${kycDocument.documentType} uploaded successfully`
            });

        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Upload Failed',
                detail: error?.message || 'Failed to upload document'
            });
        } finally {
            setUploadingStates(prev => ({ ...prev, [`kyc_${index}`]: false }));
        }
    };



    // Enhanced License Upload Handler
    const handleLicenseUpload = async () => {
        const licenseDocument = formik.values.licenseDocument;

        if (licenseStatus === 'Expired') {
            toast.current?.show({
                severity: 'error',
                summary: 'Upload Blocked',
                detail: 'Cannot upload document. License has expired. Please select an active expiry date.'
            });
            return;
        }

        // FIXED: Check if it's an existing document being reuploaded
        const isExistingDocument = licenseDocument.isExisting && licenseDocument.documentId;
        const fileToUpload = documentFiles.license || licenseDocument.thumbnail;

        // Validation: For new uploads, require file. For existing, allow update without file
        if (!licenseDocument.documentType || !licenseDocument.licenseNo ||
            !licenseDocument.startDate || !licenseDocument.expiryDate) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please fill all required fields including start date and expiry date'
            });
            return;
        }

        // FIXED: Only require file if not an existing document
        if (!isExistingDocument && !fileToUpload) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please select a file to upload'
            });
            return;
        }

        setUploadingStates(prev => ({ ...prev, license: true }));

        try {
            const agentId = localStorage.getItem('agentId') || id;
            if (!agentId) throw new Error('Agent ID not found');

            // FIXED: If existing document and no new file, fetch the original file
            let finalFileToUpload = fileToUpload;

            if (isExistingDocument && !fileToUpload) {
                // Fetch the existing document as blob and convert to file
                const blob = await agentservice.getDocumentById(licenseDocument.documentId!).toPromise();
                if (blob) {
                    const file = new File([blob], licenseDocument.thumbnailName || 'document.jpg', {
                        type: licenseDocument.documentFileFormat || 'image/jpeg'
                    });
                    finalFileToUpload = file;
                }
            }

            if (!finalFileToUpload) {
                throw new Error('Unable to get document file');
            }

            const formData = new FormData();
            formData.append('docType', getApiDocumentType(licenseDocument.documentType, 'license'));
            formData.append('filePart', finalFileToUpload);
            formData.append('docNo', licenseDocument.licenseNo);
            formData.append('startDate', formatDateForApi(licenseDocument.startDate));
            formData.append('expiryDate', formatDateForApi(licenseDocument.expiryDate));

            await agentservice.uploadAgentDocument(agentId, formData).toPromise();
            await fetchAndPopulateDocuments(agentId);

            toast.current?.show({
                severity: 'success',
                summary: 'Upload Successful',
                detail: 'License uploaded successfully'
            });

        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Upload Failed',
                detail: error?.message || 'Failed to upload license'
            });
        } finally {
            setUploadingStates(prev => ({ ...prev, license: false }));
        }
    };



    // Enhanced Cheque Upload Handler
    const handleChequeUpload = async () => {
        const chequeDocument = formik.values.cancelledCheque;

        // FIXED: Check if it's an existing document
        const isExistingDocument = chequeDocument.isExisting && chequeDocument.documentId;
        const fileToUpload = documentFiles.cheque || chequeDocument.thumbnail;

        if (!chequeDocument.documentType || !chequeDocument.bankName ||
            !chequeDocument.branchCode || !chequeDocument.accountNo) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please fill all required fields'
            });
            return;
        }

        // FIXED: Only require file if not an existing document
        if (!isExistingDocument && !fileToUpload) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please select a file to upload'
            });
            return;
        }

        setUploadingStates(prev => ({ ...prev, cheque: true }));

        try {
            const agentId = localStorage.getItem('agentId') || id;
            if (!agentId) throw new Error('Agent ID not found');

            // FIXED: If existing document and no new file, fetch the original file
            let finalFileToUpload = fileToUpload;

            if (isExistingDocument && !fileToUpload) {
                const blob = await agentservice.getDocumentById(chequeDocument.documentId!).toPromise();
                if (blob) {
                    const file = new File([blob], chequeDocument.thumbnailName || 'document.jpg', {
                        type: chequeDocument.documentFileFormat || 'image/jpeg'
                    });
                    finalFileToUpload = file;
                }
            }

            if (!finalFileToUpload) {
                throw new Error('Unable to get document file');
            }

            const formData = new FormData();
            formData.append('docType', getApiDocumentType(chequeDocument.documentType, 'cheque'));
            formData.append('filePart', finalFileToUpload);
            formData.append('docNo', '');
            formData.append('expiryDate', '');
            formData.append('bankName', chequeDocument.bankName);
            formData.append('branchCode', chequeDocument.branchCode);
            formData.append('accountNo', chequeDocument.accountNo);

            await agentservice.uploadAgentDocument(agentId, formData).toPromise();
            await fetchAndPopulateDocuments(agentId);

            toast.current?.show({
                severity: 'success',
                summary: 'Upload Successful',
                detail: 'Cancelled cheque uploaded successfully'
            });

        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Upload Failed',
                detail: 'Failed to upload cancelled cheque'
            });
        } finally {
            setUploadingStates(prev => ({ ...prev, cheque: false }));
        }
    };



    // Submit agent documents
    const handleSubmitStepFour = async () => {
        try {
            const agentId = id || localStorage.getItem('agentId')

            if (!agentId) {
                return
            }

            const payloadFour: any = {
                agentDocuments: {
                    kycDocuments: formik.values.kycDocuments
                        .filter(doc => doc.documentType && doc.documentNo)
                        .map(doc => ({
                            documentType: doc.documentType,
                            documentNo: doc.documentNo,
                            documentBase64: doc.documentBase64,
                            documentFileFormat: doc.documentFileFormat
                        })),
                    licenseDocument: {
                        documentType: formik.values.licenseDocument.documentType,
                        licenseNo: formik.values.licenseDocument.licenseNo,
                        expiryDate: formik.values.licenseDocument.expiryDate ?
                            new Date(formik.values.licenseDocument.expiryDate).getTime() : null,
                        documentBase64: formik.values.licenseDocument.documentBase64,
                        documentFileFormat: formik.values.licenseDocument.documentFileFormat
                    },
                    cancelledCheque: {
                        documentType: formik.values.cancelledCheque.documentType,
                        documentBase64: formik.values.cancelledCheque.documentBase64,
                        documentFileFormat: formik.values.cancelledCheque.documentFileFormat
                    }
                }
            }

            router.push(`/agents/management?mode=viewList`)

        } catch (error: any) {
            console.error('Function Error:', error)
            toast.current?.show({
                severity: 'error',
                summary: 'Submission Error',
                detail: error?.message || 'Failed to submit documents. Please try again.'
            })
        }
    }

    // Close and move back to list page
    const handleClose = (e: any) => {
        props.handleClose(e)
    }

    React.useEffect(() => {
        const agentId = localStorage.getItem('agentId') || id
        if (agentId) {
            fetchAndPopulateDocuments(agentId)
        } else {
            console.log('No agent ID found - fresh form for new agent')
        }
    }, [id])

    React.useEffect(() => {
        const loadPreviews = async () => {
            const newPreviewUrls: { [key: string]: string } = {}
            const newLocalPreviewUrls: { [key: string]: string } = {}

            // Load KYC document previews
            for (let i = 0; i < formik.values.kycDocuments.length; i++) {
                const doc = formik.values.kycDocuments[i]
                const key = `kyc-${i}`

                if (doc.isExisting && doc.documentId) {
                    try {
                        const blob = await agentservice.getDocumentById(doc.documentId).toPromise()
                        newPreviewUrls[key] = URL.createObjectURL(blob!)
                    } catch (error) {
                        console.error('Error loading preview:', error)
                    }
                } else if (doc.thumbnail && !doc.isExisting) {
                    newLocalPreviewUrls[key] = URL.createObjectURL(doc.thumbnail)
                }
            }

            // Load License document preview
            const licenseDoc = formik.values.licenseDocument
            if (licenseDoc.isExisting && licenseDoc.documentId) {
                try {
                    const blob = await agentservice.getDocumentById(licenseDoc.documentId).toPromise()
                    newPreviewUrls['license'] = URL.createObjectURL(blob!)
                } catch (error) {
                    console.error('Error loading preview:', error)
                }
            } else if (licenseDoc.thumbnail && !licenseDoc.isExisting) {
                newLocalPreviewUrls['license'] = URL.createObjectURL(licenseDoc.thumbnail)
            }

            // Load Cancelled Cheque preview
            const chequeDoc = formik.values.cancelledCheque
            if (chequeDoc.isExisting && chequeDoc.documentId) {
                try {
                    const blob = await agentservice.getDocumentById(chequeDoc.documentId).toPromise()
                    newPreviewUrls['cheque'] = URL.createObjectURL(blob!)
                } catch (error) {
                    console.error('Error loading preview:', error)
                }
            } else if (chequeDoc.thumbnail && !chequeDoc.isExisting) {
                newLocalPreviewUrls['cheque'] = URL.createObjectURL(chequeDoc.thumbnail)
            }

            setPreviewUrls(newPreviewUrls)
            setLocalPreviewUrls(newLocalPreviewUrls)
        }

        loadPreviews()

        return () => {
            Object.values(previewUrls).forEach(url => {
                if (url && url.startsWith('blob:')) {
                    URL.revokeObjectURL(url)
                }
            })
            Object.values(localPreviewUrls).forEach(url => {
                if (url && url.startsWith('blob:')) {
                    URL.revokeObjectURL(url)
                }
            })
        }
    }, [formik.values.kycDocuments, formik.values.licenseDocument, formik.values.cancelledCheque])

    // ✅ UPDATED: Render thumbnail with all 3 changes
    const renderThumbnail = (document: any, fieldName: string, index?: number) => {
        const isUploaded = document.isExisting && document.documentId
        const hasLocalFile = document.thumbnail && !document.isExisting
        const inputId = index !== undefined ? `${fieldName}-thumbnail-${index}` : `${fieldName}-thumbnail`

        const previewKey = index !== undefined ? `${fieldName}-${index}` : fieldName
        const previewUrl = previewUrls[previewKey] || ''
        const localPreviewUrl = localPreviewUrls[previewKey] || ''

        return (
            <Box style={{ position: 'relative' }}>
                {/* File Input - Only show when no document is uploaded */}
                {!isUploaded && (
                    <input
                        accept='image/*'
                        id={inputId}
                        type='file'
                        style={{ display: 'none' }}
                        onChange={fieldName === 'kyc' && index !== undefined ?
                            (e) => handleKycThumbnailUpload(e, index) :
                            fieldName === 'license' ? handleLicenseThumbnailUpload :
                                handleChequeThumbnailUpload
                        }
                    />
                )}

                {/* Thumbnail Box */}
                <label htmlFor={!isUploaded ? inputId : undefined}>
                    <Box
                        className={`${classes.thumbnailContainer} ${isUploaded || localPreviewUrl ? classes.uploadedThumbnail : ''}`}
                        onClick={(e) => {
                            // Change 1: If uploaded, only open modal, don't trigger file selector
                            if (isUploaded) {
                                e.preventDefault()
                                handleViewDocument(document.documentId)
                            }
                        }}
                        style={{
                            overflow: 'hidden',
                            padding: 0,
                            cursor: isUploaded ? 'pointer' : 'pointer'
                        }}
                    >
                        {isUploaded && previewUrl ? (
                            <>
                                <img
                                    src={previewUrl}
                                    alt={document.thumbnailName}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        cursor: 'pointer'
                                    }}
                                />
                                {/* Change 2: Action buttons (eye + delete) on hover */}
                                <Box
                                    className="action-buttons"
                                    style={{
                                        position: 'absolute',
                                        top: '4px',
                                        right: '4px',
                                        display: 'flex',
                                        gap: '4px',
                                        opacity: 0,
                                        transition: 'opacity 0.2s',
                                        zIndex: 10
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Eye icon - View */}
                                    <Box
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handleViewDocument(document.documentId)
                                        }}
                                        style={{
                                            backgroundColor: '#4caf50',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            border: '1px solid white'
                                        }}
                                    >
                                        <VisibilityIcon style={{ color: 'white', fontSize: '14px' }} />
                                    </Box>

                                    {/* Delete icon - Delete */}
                                    <Box
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handleDeleteDocument(document.documentId, fieldName, index)
                                        }}
                                        style={{
                                            backgroundColor: '#f44336',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            border: '1px solid white'
                                        }}
                                    >
                                        <DeleteIcon style={{ color: 'white', fontSize: '14px' }} />
                                    </Box>
                                </Box>
                            </>
                        ) : localPreviewUrl ? (
                            <>
                                <img
                                    src={localPreviewUrl}
                                    alt={document.thumbnailName}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        cursor: 'pointer'
                                    }}
                                />
                                <Box
                                    style={{
                                        position: 'absolute',
                                        bottom: '2px',
                                        right: '2px',
                                        backgroundColor: '#ff9800',
                                        color: 'white',
                                        borderRadius: '3px',
                                        padding: '2px 6px',
                                        fontSize: '10px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Ready
                                </Box>
                            </>
                        ) : (
                            // Change 3: Show original "Choose an image" after deletion
                            <Typography variant="body2" color="textSecondary">
                                Choose an image
                            </Typography>
                        )}
                    </Box>
                </label>
            </Box>
        )
    }

    return (
        <Paper elevation={0}>
            <Toast ref={toast} style={{ zIndex: 9999 }} position="top-right" />

            {/* Document View Modal */}
            <Dialog
                header={documentModal.document ? `${documentModal.document.thumbnailName || 'Document'}` : 'Document Viewer'}
                visible={documentModal.visible}
                style={{ width: '90vw', maxWidth: '800px' }}
                onHide={handleCloseModal}
                maximizable
            >
                {documentModal.loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                        <CircularProgress size={40} />
                        <Typography variant="body1" style={{ marginLeft: 16 }}>
                            Loading document...
                        </Typography>
                    </Box>
                ) : documentModal.imageUrl ? (
                    <Box textAlign="center">
                        <img
                            src={documentModal.imageUrl}
                            alt={documentModal.document?.thumbnailName || 'Document'}
                            className={classes.modalImage}
                        />
                        {documentModal.document && (
                            <Box mt={2}>
                                <Typography variant="body2" color="textSecondary">
                                    Document Type: {documentModal.document.documentType} |
                                    Format: {documentModal.document.documentFileFormat}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Box textAlign="center" p={4}>
                        <Typography variant="body1" color="error">
                            Unable to load document preview
                        </Typography>
                    </Box>
                )}
            </Dialog>

            {/* Document Loading Indicator */}
            {documentLoading && (
                <Box display="flex" justifyContent="center" alignItems="center" p={2}>
                    <CircularProgress size={20} />
                    <Typography variant="body2" style={{ marginLeft: 8 }}>
                        Loading existing documents...
                    </Typography>
                </Box>
            )}

            <Box p={3} my={2}>
                <form onSubmit={formik.handleSubmit}>
                    {/* KYC Section */}
                    <Typography variant="h6" className={classes.sectionTitle}>
                        KYC
                    </Typography>

                    {formik.values.kycDocuments.map((x, i) => {
                        const availableOptions = getAvailableKycOptions(i)
                        const fieldError = getFieldError('kycDocuments', i)
                        const fieldTouched = getFieldTouched('kycDocuments', i)

                        return (
                            <Grid container spacing={3} key={i} style={{ marginBottom: '20px' }} alignItems="center">
                                <Grid item xs={12} sm={6} md={2}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel>Document Type</InputLabel>
                                        <Select
                                            name='documentType'
                                            value={x.documentType}
                                            onChange={(e) => {
                                                formik.setFieldValue(`kycDocuments[${i}].documentType`, e.target.value)
                                            }}
                                            label='Document Type'
                                            error={fieldTouched?.documentType && Boolean(fieldError?.documentType)}
                                        >
                                            {availableOptions.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                            {x.isExisting && x.documentType && (
                                                <MenuItem value={x.documentType}>
                                                    {x.documentType}
                                                </MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={2}>
                                    <FormControl className={classes.formControl}>
                                        <TextField
                                            name='documentNo'
                                            value={x.documentNo}
                                            onChange={(e) => handleKycInputChange(e, i)}
                                            label='Document No'
                                            variant='outlined'
                                            error={fieldTouched?.documentNo && Boolean(fieldError?.documentNo)}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={2}>
                                    <Box sx={{ height: '56px' }}></Box>
                                </Grid>

                                <Grid item xs={12} sm={6} md={2}>
                                    <Box sx={{ height: '56px' }}></Box>
                                </Grid>

                                <Grid item xs={12} sm={6} md={2}>
                                    {renderThumbnail(x, 'kyc', i)}
                                </Grid>

                                <Grid item xs={12} sm={6} md={2}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '100%' }}>
                                        {formik.values.kycDocuments.length !== 1 && (
                                            <Button
                                                className='p-button-danger'
                                                onClick={() => handleRemoveKycDocument(i)}
                                                style={{ minWidth: '40px', minHeight: '40px' }}
                                                type="button"
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        )}
                                        <Button
                                            className='p-button-info'
                                            onClick={() => handleKycUpload(i)}
                                            style={{ minWidth: '40px', minHeight: '40px' }}
                                            type="button"
                                            disabled={uploadingStates[`kyc_${i}`]}
                                        >
                                            {uploadingStates[`kyc_${i}`] ? (
                                                <CircularProgress size={16} color="inherit" />
                                            ) : (
                                                <UploadIcon />
                                            )}
                                        </Button>
                                        {formik.values.kycDocuments.length - 1 === i && formik.values.kycDocuments.length < 3 && (
                                            <Button
                                                color='primary'
                                                onClick={handleAddKycDocument}
                                                style={{ minWidth: '40px', minHeight: '40px' }}
                                                type="button"
                                            >
                                                <AddIcon />
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        )
                    })}

                    {/* License Section */}
                    <Typography variant="h6" className={classes.sectionTitle}>
                        License
                    </Typography>

                    <Grid container spacing={3} style={{ marginBottom: '20px' }} alignItems="center">
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    name="licenseNo"
                                    value={formik.values.licenseDocument.licenseNo}
                                    onChange={handleLicenseInputChange}
                                    label="License No"
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl className={classes.formControl}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Start Date"
                                        value={formik.values.licenseDocument.startDate}
                                        onChange={(date) => formik.setFieldValue('licenseDocument.startDate', date)}
                                        renderInput={(params) => <TextField {...params} variant="outlined" />}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl className={classes.formControl}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Expiry Date"
                                        value={formik.values.licenseDocument.expiryDate}
                                        onChange={handleLicenseExpiryChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            {formik.values.licenseDocument.expiryDate && licenseStatus ? (
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '56px'
                                }}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: licenseStatus === 'Active' ? 'green' : 'red',
                                            fontWeight: 'bold',
                                            padding: '8px 16px',
                                            border: `2px solid ${licenseStatus === 'Active' ? 'green' : 'red'}`,
                                            borderRadius: '4px',
                                            backgroundColor: licenseStatus === 'Active' ? 'rgba(0, 128, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)'
                                        }}
                                    >
                                        {licenseStatus}
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ height: '56px' }}></Box>
                            )}
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            {renderThumbnail(formik.values.licenseDocument, 'license')}
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <Button
                                    className="p-button-info"
                                    onClick={handleLicenseUpload}
                                    style={{ minWidth: '40px', minHeight: '40px' }}
                                    type="button"
                                    disabled={uploadingStates.license}
                                >
                                    {uploadingStates.license ? <CircularProgress size={16} color="inherit" /> : <UploadIcon />}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Cancelled Cheque Section */}
                    <Typography variant="h6" className={classes.sectionTitle}>
                        Cancelled Cheque
                    </Typography>

                    <Grid container spacing={3} style={{ marginBottom: '20px' }} alignItems="center">
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    label="Bank Name"
                                    name="cancelledCheque.bankName"
                                    value={formik.values.cancelledCheque.bankName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[A-Za-z\s]*$/.test(value)) {
                                            formik.setFieldValue('cancelledCheque.bankName', value);
                                        }
                                    }}
                                    variant="outlined"
                                    error={formik.touched.cancelledCheque?.bankName && Boolean(formik.errors.cancelledCheque?.bankName)}
                                    helperText={formik.touched.cancelledCheque?.bankName && formik.errors.cancelledCheque?.bankName}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    label="Branch Code"
                                    name="cancelledCheque.branchCode"
                                    value={formik.values.cancelledCheque.branchCode}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= 14) {
                                            formik.setFieldValue('cancelledCheque.branchCode', value.toUpperCase());
                                        }
                                    }}
                                    variant="outlined"
                                    error={formik.touched.cancelledCheque?.branchCode && Boolean(formik.errors.cancelledCheque?.branchCode)}
                                    helperText={formik.touched.cancelledCheque?.branchCode && formik.errors.cancelledCheque?.branchCode}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    label="Account Number"
                                    name="cancelledCheque.accountNo"
                                    value={formik.values.cancelledCheque.accountNo}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= 40) {
                                            formik.setFieldValue('cancelledCheque.accountNo', value.toUpperCase());
                                        }
                                    }}
                                    variant="outlined"
                                    error={formik.touched.cancelledCheque?.accountNo && Boolean(formik.errors.cancelledCheque?.accountNo)}
                                    helperText={formik.touched.cancelledCheque?.accountNo && formik.errors.cancelledCheque?.accountNo}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <Box sx={{ height: '56px' }}></Box>
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            {renderThumbnail(formik.values.cancelledCheque, 'cheque')}
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <Button
                                    className="p-button-info"
                                    onClick={handleChequeUpload}
                                    style={{ minWidth: '40px', minHeight: '40px' }}
                                    type="button"
                                    disabled={uploadingStates.cheque}
                                >
                                    {uploadingStates.cheque ? <CircularProgress size={16} color="inherit" /> : <UploadIcon />}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} justifyContent='flex-end'>
                        <Grid
                            item
                            container
                            spacing={3}
                            justifyContent='flex-end'
                            xs={12}
                            sm={6}
                            style={{ padding: '16px', paddingTop: '45px' }}
                        >
                            <Button
                                color='secondary'
                                style={{ marginRight: '5px' }}
                                type="button"
                                onClick={handleSubmitStepFour}
                            >
                                Finish
                            </Button>
                            <Button color='primary' onClick={handleClose} className='p-button-text' type="button">
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Paper>
    )
}
