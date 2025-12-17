"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import UploadIcon from "@mui/icons-material/Upload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { ProvidersService } from "@/services/remote-api/api/provider-services/provider.services";
import { GridDeleteIcon } from "@mui/x-data-grid";
const providerservice = new ProvidersService();

interface ProviderDocumentsProps {
  handleClose: (event: any) => void;
  providerID: string;
  handleNext: () => void;
  addressConfig: any[];
}

interface DocumentWithCertificate {
  documentType: string;
  certificateNo: string;
  thumbnail: File | null;
  thumbnailName: string;
  documentBase64: string;
  documentFileFormat: string;
  documentId: string | null;
  isExisting: boolean;
}

interface DocumentWithoutCertificate {
  documentType: string;
  thumbnail: File | null;
  thumbnailName: string;
  documentBase64: string;
  documentFileFormat: string;
  documentId: string | null;
  isExisting: boolean;
}

interface CancelledChequeDocument {
  documentType: string;
  bankName: string;
  branchCode: string;
  accountNo: string;
  thumbnail: File | null;
  thumbnailName: string;
  documentBase64: string;
  documentFileFormat: string;
  documentId: string | null;
  isExisting: boolean;
}

const useStyles = makeStyles({
  formControl: {
    width: "100%"
  },
  textField: {
    height: "56px",
    "& .MuiInputBase-root": {
      height: "56px"
    }
  },
  thumbnailContainer: {
    width: "120px",
    height: "80px",
    border: "2px dashed #ccc",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
    cursor: "pointer",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden"
  },
  thumbnailText: {
    color: "#616161",
    fontSize: "15px",
    textAlign: "center",
    padding: "6px"
  },
  sectionTitle: {
    color: "#1976d2",
    fontWeight: 600,
    marginBottom: "16px",
    marginTop: "20px"
  }
});

function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64String = result.replace("data:", "").replace(/^.+,/, "");
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProviderDocumentsComponent({
  handleClose,
  providerID,
  handleNext,
  addressConfig
}: ProviderDocumentsProps) {
  const classes = useStyles();
  const [localPreviewUrls, setLocalPreviewUrls] = useState<{ [key: string]: string }>({});

  // Get provider ID from localStorage if not passed as prop, or from URL params in edit mode
  const getProviderID = () => {
    if (providerID) return providerID;
    if (typeof window !== 'undefined') {
      const fromStorage = localStorage.getItem("providerId");
      if (fromStorage) return fromStorage;
    }
    // In edit mode, try to get from URL params
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id') || window.location.pathname.split('/').pop();
      if (id && id !== 'create') return id;
    }
    return null;
  };

  const actualProviderID = getProviderID();

  const [uploadingStates, setUploadingStates] = useState<{ [key: string]: boolean }>({});
  const [uploadedStates, setUploadedStates] = useState<{ [key: string]: boolean }>({});
  const [uploadGetDocuments, setUploadGetDocuments] = useState<any>(null);
  const [previewDialog, setPreviewDialog] = useState<{ open: boolean; imageUrl: string | null }>({
    open: false,
    imageUrl: null
  });


  const validationSchema = yup.object({});

  const formik = useFormik({
    initialValues: {
      directorsDetails: {
        documentType: "List of Directors Details",
        thumbnail: null,
        thumbnailName: "",
        documentBase64: "",
        documentFileFormat: "",
        documentId: null,
        isExisting: false
      } as DocumentWithoutCertificate,
      incorporationCertificate: {
        documentType: "Certificate of Incorporation/Partnership deed",
        certificateNo: "",
        thumbnail: null,
        thumbnailName: "",
        documentBase64: "",
        documentFileFormat: "",
        documentId: null,
        isExisting: false
      } as DocumentWithCertificate,
      tradingCertificate: {
        documentType: "Trading Certificate",
        certificateNo: "",
        thumbnail: null,
        thumbnailName: "",
        documentBase64: "",
        documentFileFormat: "",
        documentId: null,
        isExisting: false
      } as DocumentWithCertificate,
      taxPinCertificate: {
        documentType: "TAX PIN Certificate",
        certificateNo: "",
        thumbnail: null,
        thumbnailName: "",
        documentBase64: "",
        documentFileFormat: "",
        documentId: null,
        isExisting: false
      } as DocumentWithCertificate,
      cr12: {
        documentType: "CR12",
        thumbnail: null,
        thumbnailName: "",
        documentBase64: "",
        documentFileFormat: "",
        documentId: null,
        isExisting: false
      } as DocumentWithoutCertificate,
      relevantAuthoritiesCertificate: {
        documentType: "Certificate/Licenses from relevant authorities",
        certificateNo: "",
        thumbnail: null,
        thumbnailName: "",
        documentBase64: "",
        documentFileFormat: "",
        documentId: null,
        isExisting: false
      } as DocumentWithCertificate,
      vatCertificate: {
        documentType: "VAT Certificate",
        certificateNo: "",
        thumbnail: null,
        thumbnailName: "",
        documentBase64: "",
        documentFileFormat: "",
        documentId: null,
        isExisting: false
      } as DocumentWithCertificate,
      taxComplianceCertificate: {
        documentType: "Tax Compliance certificate",
        certificateNo: "",
        thumbnail: null,
        thumbnailName: "",
        documentBase64: "",
        documentFileFormat: "",
        documentId: null,
        isExisting: false
      } as DocumentWithCertificate,
      cancelledCheque: {
        documentType: "Scanned copy of a cancelled Cheque",
        bankName: "",
        branchCode: "",
        accountNo: "",
        thumbnail: null,
        thumbnailName: "",
        documentBase64: "",
        documentFileFormat: "",
        documentId: null,
        isExisting: false
      } as CancelledChequeDocument
    },
    validationSchema,
    onSubmit: () => {
      // Commented API call:
      // providerservice.saveProviderDocuments({ providerID, ...formik.values });
      handleNext();
    }
  });

  useEffect(() => {
    const previews: { [key: string]: string } = {};
    const urlsToRevoke: string[] = [];

    // Create preview URLs for newly uploaded files (these will replace existing ones)
    if (formik.values.directorsDetails.thumbnail) {
      const url = URL.createObjectURL(formik.values.directorsDetails.thumbnail);
      previews["directorsDetails"] = url;
      urlsToRevoke.push(url);
    }
    if (formik.values.incorporationCertificate.thumbnail) {
      const url = URL.createObjectURL(formik.values.incorporationCertificate.thumbnail);
      previews["incorporationCertificate"] = url;
      urlsToRevoke.push(url);
    }
    if (formik.values.tradingCertificate.thumbnail) {
      const url = URL.createObjectURL(formik.values.tradingCertificate.thumbnail);
      previews["tradingCertificate"] = url;
      urlsToRevoke.push(url);
    }
    if (formik.values.taxPinCertificate.thumbnail) {
      const url = URL.createObjectURL(formik.values.taxPinCertificate.thumbnail);
      previews["taxPinCertificate"] = url;
      urlsToRevoke.push(url);
    }
    if (formik.values.cr12.thumbnail) {
      const url = URL.createObjectURL(formik.values.cr12.thumbnail);
      previews["cr12"] = url;
      urlsToRevoke.push(url);
    }
    if (formik.values.relevantAuthoritiesCertificate.thumbnail) {
      const url = URL.createObjectURL(formik.values.relevantAuthoritiesCertificate.thumbnail);
      previews["relevantAuthoritiesCertificate"] = url;
      urlsToRevoke.push(url);
    }
    if (formik.values.vatCertificate.thumbnail) {
      const url = URL.createObjectURL(formik.values.vatCertificate.thumbnail);
      previews["vatCertificate"] = url;
      urlsToRevoke.push(url);
    }
    if (formik.values.taxComplianceCertificate.thumbnail) {
      const url = URL.createObjectURL(formik.values.taxComplianceCertificate.thumbnail);
      previews["taxComplianceCertificate"] = url;
      urlsToRevoke.push(url);
    }
    if (formik.values.cancelledCheque.thumbnail) {
      const url = URL.createObjectURL(formik.values.cancelledCheque.thumbnail);
      previews["cancelledCheque"] = url;
      urlsToRevoke.push(url);
    }

    // Merge with existing preview URLs (from API) - only update fields that have new uploads
    setLocalPreviewUrls((prev) => ({
      ...prev,
      ...previews
    }));

    return () => {
      urlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [
    formik.values.directorsDetails.thumbnail,
    formik.values.incorporationCertificate.thumbnail,
    formik.values.tradingCertificate.thumbnail,
    formik.values.taxPinCertificate.thumbnail,
    formik.values.cr12.thumbnail,
    formik.values.relevantAuthoritiesCertificate.thumbnail,
    formik.values.vatCertificate.thumbnail,
    formik.values.taxComplianceCertificate.thumbnail,
    formik.values.cancelledCheque.thumbnail
  ]);

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64String = await convertToBase64(file);
      formik.setFieldValue(`${fieldName}.thumbnail`, file);
      formik.setFieldValue(`${fieldName}.thumbnailName`, file.name);
      formik.setFieldValue(`${fieldName}.documentBase64`, base64String);
      formik.setFieldValue(`${fieldName}.documentFileFormat`, file.type);
      formik.setFieldValue(`${fieldName}.isExisting`, false);
    }
  };


  // Map API documentType to formik field names
  const mapDocumentTypeToField = (documentType: string): string | null => {
    const mapping: { [key: string]: string } = {
      'DIRECTOR_DETAILS': 'directorsDetails',
      'INCORPORATION_CERTIFICATE': 'incorporationCertificate',
      'TRADING_CERTIFICATE': 'tradingCertificate',
      'TAX_PIN_CERTIFICATE': 'taxPinCertificate',
      'LICENSES': 'relevantAuthoritiesCertificate',
      'VAT_CERTIFICATE': 'vatCertificate',
      'TAX_COMPLIANCE_CERTIFICATE': 'taxComplianceCertificate',
      'CANCELLED_CHEQUE': 'cancelledCheque'
    };
    return mapping[documentType] || null;
  };

  // Fetch document image by ID and create preview URL
  const fetchDocumentImage = async (documentId: string, fieldName: string, docFormat: string) => {
    try {
      providerservice.getDocumentById(documentId).subscribe({
        next: (blob: Blob) => {
          const imageUrl = URL.createObjectURL(blob);
          setLocalPreviewUrls((prev) => ({
            ...prev,
            [fieldName]: imageUrl
          }));
        },
        error: (error) => {
          console.error(`Failed to fetch document ${documentId}:`, error);
        }
      });
    } catch (error) {
      console.error(`Error fetching document ${documentId}:`, error);
    }
  };

  const getUploadDocuments = () => {
    if (!actualProviderID) {
      console.log("Provider ID not available");
      return;
    }

    providerservice.getProviderDocuments(actualProviderID).subscribe({
      next: (response: any) => {
        console.log("Documents response:", response);
        
        // Handle both array and Map responses
        let documentsArray: any[] = [];
        if (Array.isArray(response)) {
          documentsArray = response;
        } else if (response instanceof Map) {
          documentsArray = Array.from(response.values());
        } else if (response?.data && Array.isArray(response.data)) {
          documentsArray = response.data;
        } else if (response?.content && Array.isArray(response.content)) {
          documentsArray = response.content;
        } else if (response?.docs && Array.isArray(response.docs)) {
          documentsArray = response.docs;
        } else if (response?.value && Array.isArray(response.value)) {
          documentsArray = response.value;
        }

        // Process each document
        documentsArray.forEach((doc: any) => {
          const fieldName = mapDocumentTypeToField(doc.documentType);
          if (fieldName) {
            // Update formik values with document info
            formik.setFieldValue(`${fieldName}.documentId`, doc.id);
            formik.setFieldValue(`${fieldName}.isExisting`, true);
            formik.setFieldValue(`${fieldName}.documentFileFormat`, doc.docFormat || 'image/png');
            formik.setFieldValue(`${fieldName}.thumbnailName`, doc.documentOriginalName || doc.documentName || '');
            
            // Set certificate number if available
            if (doc.documentNo && (fieldName === 'incorporationCertificate' || 
                fieldName === 'tradingCertificate' || 
                fieldName === 'taxPinCertificate' || 
                fieldName === 'relevantAuthoritiesCertificate' || 
                fieldName === 'vatCertificate' || 
                fieldName === 'taxComplianceCertificate')) {
              formik.setFieldValue(`${fieldName}.certificateNo`, doc.documentNo);
            }

            // Fetch and display the image
            if (doc.id) {
              fetchDocumentImage(doc.id, fieldName, doc.docFormat || 'image/png');
            }
          }
        });

        setUploadGetDocuments(response);
      },
      error: (error) => {
        console.error("Failed to fetch documents:", error);
      }
    });
  }

  useEffect(() => {
    if (actualProviderID) {
      getUploadDocuments();
    }
  }, [actualProviderID])

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(localPreviewUrls).forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [])

  const handleUploadDocument = (fieldName: string, docType: string, docNo?: string) => {
    const fileData = formik.values[fieldName as keyof typeof formik.values] as any;

    if (!fileData.thumbnail) {
      alert("Please select a file first");
      return;
    }

    // Add this console log to check providerID
    console.log("Provider ID:", actualProviderID);

    if (!actualProviderID) {
      alert("Provider ID is missing");
      return;
    }

    setUploadingStates(prev => ({ ...prev, [fieldName]: true }));

    const formData = new FormData();
    formData.append('docType', docType);
    if (docNo) formData.append('docNo', docNo);
    formData.append('filePart', fileData.thumbnail);

    providerservice.saveProviderDocuments(actualProviderID, formData).subscribe({
      next: (response) => {
        console.log("Upload successful:", response);
        setUploadingStates(prev => ({ ...prev, [fieldName]: false }));
        setUploadedStates(prev => ({ ...prev, [fieldName]: true }));
        alert("Document uploaded successfully!");
      },
      error: (error) => {
        console.error("Upload failed:", error);
        setUploadingStates(prev => ({ ...prev, [fieldName]: false }));
        alert("Failed to upload document. Please try again.");
      }
    });
  };



  const handleDeleteDocument = (fieldName: string) => {
    console.log("Delete document clicked for field:", fieldName);
    
    const fieldData = formik.values[fieldName as keyof typeof formik.values] as any;
    const documentId = fieldData?.documentId;
    const isExisting = fieldData?.isExisting;

    console.log("Delete - fieldData:", fieldData);
    console.log("Delete - documentId:", documentId);
    console.log("Delete - isExisting:", isExisting);
    console.log("Delete - actualProviderID:", actualProviderID);

    // If it's an existing document with a documentId, call the delete API
    if (isExisting && documentId && actualProviderID) {
      console.log("Calling delete API with providerID:", actualProviderID, "documentId:", documentId);
      providerservice.deleteProviderDocument(actualProviderID, documentId).subscribe({
        next: (response) => {
          console.log("Document deleted successfully:", response);
          // Clear the preview URL
          const currentUrl = localPreviewUrls[fieldName];
          if (currentUrl && currentUrl.startsWith("blob:")) {
            URL.revokeObjectURL(currentUrl);
          }
          
          setLocalPreviewUrls((prev) => {
            const updated = { ...prev };
            delete updated[fieldName];
            return updated;
          });

          // Clear formik values
          formik.setFieldValue(`${fieldName}.thumbnail`, null);
          formik.setFieldValue(`${fieldName}.thumbnailName`, "");
          formik.setFieldValue(`${fieldName}.documentBase64`, "");
          formik.setFieldValue(`${fieldName}.documentFileFormat`, "");
          formik.setFieldValue(`${fieldName}.isExisting`, false);
          formik.setFieldValue(`${fieldName}.documentId`, null);
        },
        error: (error) => {
          console.error("Failed to delete document:", error);
          alert("Failed to delete document. Please try again.");
        }
      });
    } else {
      console.log("Clearing local state only (not an existing document or missing data)");
      // For newly uploaded documents (not yet saved), just clear local state
      const currentUrl = localPreviewUrls[fieldName];
      if (currentUrl && currentUrl.startsWith("blob:")) {
        URL.revokeObjectURL(currentUrl);
      }
      
      setLocalPreviewUrls((prev) => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });

      // Clear formik values
      formik.setFieldValue(`${fieldName}.thumbnail`, null);
      formik.setFieldValue(`${fieldName}.thumbnailName`, "");
      formik.setFieldValue(`${fieldName}.documentBase64`, "");
      formik.setFieldValue(`${fieldName}.documentFileFormat`, "");
      formik.setFieldValue(`${fieldName}.isExisting`, false);
      formik.setFieldValue(`${fieldName}.documentId`, null);
    }
  };

  const handleDeleteImage = (fieldName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    handleDeleteDocument(fieldName);
  };

  const handlePreviewImage = (imageUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setPreviewDialog({ open: true, imageUrl });
  };

  const renderThumbnail = (fieldName: string) => {
    const inputId = `${fieldName}-thumbnail`;
    const localPreviewUrl = localPreviewUrls[fieldName];

    return (
      <Box className={classes.thumbnailContainer} position="relative">
        <input
          accept="*/*"
          id={inputId}
          type="file"
          style={{ display: "none" }}
          onChange={(e) => handleThumbnailUpload(e, fieldName)}
        />
        {!localPreviewUrl ? (
          <label htmlFor={inputId} style={{ width: "100%", height: "100%", cursor: "pointer", display: "block" }}>
            <Box display="flex" alignItems="center" justifyContent="center" height="100%">
              <span className={classes.thumbnailText}>Choose an image</span>
            </Box>
          </label>
        ) : (
          <Box position="relative" height="100%" width="100%">
            <label 
              htmlFor={inputId} 
              style={{ 
                width: "100%", 
                height: "100%", 
                cursor: "pointer", 
                display: "block",
                position: "relative",
                zIndex: 1
              }}
            >
              <img
                src={localPreviewUrl}
                alt="preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                  pointerEvents: "none"
                }}
              />
            </label>
            {/* Preview and Delete buttons overlay - Completely separate from label */}
            <Box
              position="absolute"
              top={4}
              right={4}
              display="flex"
              gap={0.5}
              sx={{
                pointerEvents: "auto",
                zIndex: 1000
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <IconButton
                type="button"
                size="small"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  console.log("Preview button clicked");
                  handlePreviewImage(localPreviewUrl, e);
                }}
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.8)"
                  },
                  width: "28px",
                  height: "28px",
                  padding: "4px",
                  zIndex: 1001,
                  pointerEvents: "auto"
                }}
              >
                <VisibilityIcon sx={{ fontSize: "16px" }} />
              </IconButton>
              <IconButton
                type="button"
                size="small"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  console.log("Delete button mousedown for:", fieldName);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  console.log("Delete button clicked for:", fieldName);
                  handleDeleteImage(fieldName, e);
                }}
                sx={{
                  backgroundColor: "rgba(220, 53, 69, 0.8)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(220, 53, 69, 1)"
                  },
                  width: "28px",
                  height: "28px",
                  padding: "4px",
                  zIndex: 1001,
                  pointerEvents: "auto"
                }}
              >
                <DeleteIcon sx={{ fontSize: "16px" }} />
              </IconButton>
            </Box>
            <Box
              position="absolute"
              bottom={6}
              right={6}
              bgcolor="#ffd966"
              color="#000"
              px={1.5}
              py={0.5}
              borderRadius={2}
              fontSize="14px"
              fontWeight={600}
              boxShadow={1}
              style={{ pointerEvents: "none", zIndex: 5 }}
            >
              READY
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Paper elevation={0}>
      <Box p={3} my={2}>
        <form onSubmit={formik.handleSubmit}>
          {/* 1. List of Directors Details */}
          <Typography variant="h6" className={classes.sectionTitle}>
            List of Directors Details
          </Typography>
          <Grid container spacing={3} style={{ marginBottom: "20px" }} alignItems="center">
            <Grid item xs={12} sm={6} md={8}>
              <Box sx={{ height: "56px" }}></Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              {renderThumbnail("directorsDetails")}
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <Button
                  style={{ minWidth: "40px", minHeight: "40px" }}
                  type="button"
                  onClick={() => handleUploadDocument("directorsDetails", "DIRECTOR_DETAILS")}
                  disabled={uploadingStates["directorsDetails"] || !formik.values.directorsDetails.thumbnail}
                >
                  {uploadingStates["directorsDetails"] ? (
                    <CircularProgress size={24} />
                  ) : uploadedStates["directorsDetails"] ? (
                    <CheckCircleIcon style={{ color: "#4caf50" }} />
                  ) : (
                    <UploadIcon />
                  )}
                </Button>
                <Button
                  style={{ minWidth: "40px", minHeight: "40px" }}
                  type="button"
                  color="error"
                  onClick={() => handleDeleteDocument("directorsDetails")}
                  disabled={!formik.values.directorsDetails.documentId && !localPreviewUrls["directorsDetails"]}
                >
                  <GridDeleteIcon />
                </Button>
              </Box>
            </Grid>
          </Grid>


          {/* 2. Certificate of Incorporation/Partnership deed */}
          <Typography variant="h6" className={classes.sectionTitle}>
            Certificate of Incorporation/Partnership deed
          </Typography>
          <Grid container spacing={3} style={{ marginBottom: "20px" }} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="certificateNo"
                value={formik.values.incorporationCertificate.certificateNo}
                onChange={(e) => formik.setFieldValue("incorporationCertificate.certificateNo", e.target.value)}
                label="Certificate Number"
                variant="outlined"
                className={classes.textField}
                fullWidth
                error={
                  formik.touched.incorporationCertificate?.certificateNo &&
                  Boolean(formik.errors.incorporationCertificate?.certificateNo)
                }
                helperText={
                  formik.touched.incorporationCertificate?.certificateNo &&
                  formik.errors.incorporationCertificate?.certificateNo
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ height: "56px" }}></Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              {renderThumbnail("incorporationCertificate")}
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <Button
                  style={{ minWidth: "40px", minHeight: "40px" }}
                  type="button"
                  onClick={() => handleUploadDocument("incorporationCertificate", "INCORPORATION_CERTIFICATE", formik.values.incorporationCertificate.certificateNo)}
                  disabled={uploadingStates["incorporationCertificate"] || !formik.values.incorporationCertificate.thumbnail || !formik.values.incorporationCertificate.certificateNo}
                >
                  {uploadingStates["incorporationCertificate"] ? (
                    <CircularProgress size={24} />
                  ) : uploadedStates["incorporationCertificate"] ? (
                    <CheckCircleIcon style={{ color: "#4caf50" }} />
                  ) : (
                    <UploadIcon />
                  )}
                </Button>
                <Button
                  style={{ minWidth: "40px", minHeight: "40px" }}
                  type="button"
                  color="error"
                  onClick={() => handleDeleteDocument("incorporationCertificate")}
                  disabled={!formik.values.incorporationCertificate.documentId && !localPreviewUrls["incorporationCertificate"]}
                >
                  <GridDeleteIcon />
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* 3. Trading Certificate */}
          <Typography variant="h6" className={classes.sectionTitle}>
            Trading Certificate
          </Typography>
          <Grid container spacing={3} style={{ marginBottom: "20px" }} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="certificateNo"
                value={formik.values.tradingCertificate.certificateNo}
                onChange={(e) => formik.setFieldValue("tradingCertificate.certificateNo", e.target.value)}
                label="Certificate Number"
                variant="outlined"
                className={classes.textField}
                fullWidth
                error={
                  formik.touched.tradingCertificate?.certificateNo &&
                  Boolean(formik.errors.tradingCertificate?.certificateNo)
                }
                helperText={
                  formik.touched.tradingCertificate?.certificateNo &&
                  formik.errors.tradingCertificate?.certificateNo
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ height: "56px" }}></Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              {renderThumbnail("tradingCertificate")}
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <Button
                  style={{ minWidth: "40px", minHeight: "40px" }}
                  type="button"
                  onClick={() => handleUploadDocument("tradingCertificate", "TRADING_CERTIFICATE", formik.values.tradingCertificate.certificateNo)}
                  disabled={uploadingStates["tradingCertificate"] || !formik.values.tradingCertificate.thumbnail || !formik.values.tradingCertificate.certificateNo}
                >
                  {uploadingStates["tradingCertificate"] ? (
                    <CircularProgress size={24} />
                  ) : uploadedStates["tradingCertificate"] ? (
                    <CheckCircleIcon style={{ color: "#4caf50" }} />
                  ) : (
                    <UploadIcon />
                  )}
                </Button>
                <Button
                  style={{ minWidth: "40px", minHeight: "40px" }}
                  type="button"
                  color="error"
                  onClick={() => handleDeleteDocument("tradingCertificate")}
                  disabled={!formik.values.tradingCertificate.documentId && !localPreviewUrls["tradingCertificate"]}
                >
                  <GridDeleteIcon />
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* 4. TAX PIN Certificate */}
          <Typography variant="h6" className={classes.sectionTitle}>
            TAX PIN Certificate
          </Typography>
          <Grid container spacing={3} style={{ marginBottom: "20px" }} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="certificateNo"
                value={formik.values.taxPinCertificate.certificateNo}
                onChange={(e) => formik.setFieldValue("taxPinCertificate.certificateNo", e.target.value)}
                label="Certificate Number"
                variant="outlined"
                className={classes.textField}
                fullWidth
                error={
                  formik.touched.taxPinCertificate?.certificateNo &&
                  Boolean(formik.errors.taxPinCertificate?.certificateNo)
                }
                helperText={
                  formik.touched.taxPinCertificate?.certificateNo &&
                  formik.errors.taxPinCertificate?.certificateNo
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ height: "56px" }}></Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              {renderThumbnail("taxPinCertificate")}
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <Button
                  style={{ minWidth: "40px", minHeight: "40px" }}
                  type="button"
                  onClick={() => handleUploadDocument("taxPinCertificate", "TAX_PIN_CERTIFICATE", formik.values.taxPinCertificate.certificateNo)}
                  disabled={uploadingStates["taxPinCertificate"] || !formik.values.taxPinCertificate.thumbnail || !formik.values.taxPinCertificate.certificateNo}
                >
                  {uploadingStates["taxPinCertificate"] ? (
                    <CircularProgress size={24} />
                  ) : uploadedStates["taxPinCertificate"] ? (
                    <CheckCircleIcon style={{ color: "#4caf50" }} />
                  ) : (
                    <UploadIcon />
                  )}
                </Button>
                <Button
                  style={{ minWidth: "40px", minHeight: "40px" }}
                  type="button"
                  color="error"
                  onClick={() => handleDeleteDocument("taxPinCertificate")}
                  disabled={!formik.values.taxPinCertificate.documentId && !localPreviewUrls["taxPinCertificate"]}
                >
                  <GridDeleteIcon />
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* 5. CR12 */}
          <Typography variant="h6" className={classes.sectionTitle}>
            CR12
          </Typography>
          <Grid container spacing={3} style={{ marginBottom: "20px" }} alignItems="center">
            <Grid item xs={12} sm={6} md={8}>
              <Box sx={{ height: "56px" }}></Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              {renderThumbnail("cr12")}
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <Button
                  style={{ minWidth: "40px", minHeight: "40px" }}
                  type="button"
                >
                  <UploadIcon />
                </Button>
                <Button
                  style={{ minWidth: "40px", minHeight: "40px" }}
                  type="button"
                  color="error"
                  onClick={() => handleDeleteDocument("cr12")}
                  disabled={!formik.values.cr12.documentId && !localPreviewUrls["cr12"]}
                >
                  <GridDeleteIcon />
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* 6. Certificate/Licenses from relevant authorities */}
          <Typography variant="h6" className={classes.sectionTitle}>
            Certificate/Licenses from relevant authorities
          </Typography>
          <Grid container spacing={3} style={{ marginBottom: "20px" }} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="certificateNo"
                value={formik.values.relevantAuthoritiesCertificate.certificateNo}
                onChange={(e) => formik.setFieldValue("relevantAuthoritiesCertificate.certificateNo", e.target.value)}
                label="Certificate Number"
                variant="outlined"
                className={classes.textField}
                fullWidth
                error={
                  formik.touched.relevantAuthoritiesCertificate?.certificateNo &&
                  Boolean(formik.errors.relevantAuthoritiesCertificate?.certificateNo)
                }
                helperText={
                  formik.touched.relevantAuthoritiesCertificate?.certificateNo &&
                  formik.errors.relevantAuthoritiesCertificate?.certificateNo
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ height: "56px" }}></Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              {renderThumbnail("relevantAuthoritiesCertificate")}
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <Button
                  style={{ minWidth: "40px", minHeight: "40px" }}
                  type="button"
                  onClick={() => handleUploadDocument("relevantAuthoritiesCertificate", "LICENSES", formik.values.relevantAuthoritiesCertificate.certificateNo)}
                  disabled={uploadingStates["relevantAuthoritiesCertificate"] || !formik.values.relevantAuthoritiesCertificate.thumbnail || !formik.values.relevantAuthoritiesCertificate.certificateNo}
                >
                  {uploadingStates["relevantAuthoritiesCertificate"] ? (
                    <CircularProgress size={24} />
                  ) : uploadedStates["relevantAuthoritiesCertificate"] ? (
                    <CheckCircleIcon style={{ color: "#4caf50" }} />
                  ) : (
                    <UploadIcon />
                  )}
                </Button>
                <Button
                  style={{ minWidth: "40px", minHeight: "40px" }}
                  type="button"
                  color="error"
                  onClick={() => handleDeleteDocument("relevantAuthoritiesCertificate")}
                  disabled={!formik.values.relevantAuthoritiesCertificate.documentId && !localPreviewUrls["relevantAuthoritiesCertificate"]}
                >
                  <GridDeleteIcon />
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* 7. VAT Certificate */}
          <Typography variant="h6" className={classes.sectionTitle}>
            VAT Certificate
          </Typography>
          <Grid container spacing={3} style={{ marginBottom: "20px" }} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="certificateNo"
                value={formik.values.vatCertificate.certificateNo}
                onChange={(e) => formik.setFieldValue("vatCertificate.certificateNo", e.target.value)}
                label="Certificate Number"
                variant="outlined"
                className={classes.textField}
                fullWidth
                error={
                  formik.touched.vatCertificate?.certificateNo &&
                  Boolean(formik.errors.vatCertificate?.certificateNo)
                }
                helperText={
                  formik.touched.vatCertificate?.certificateNo &&
                  formik.errors.vatCertificate?.certificateNo
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ height: "56px" }}></Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              {renderThumbnail("vatCertificate")}
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <Button
                  style={{ minWidth: "40px", minHeight: "40px" }}
                  type="button"
                  onClick={() => handleUploadDocument("vatCertificate", "VAT_CERTIFICATE", formik.values.vatCertificate.certificateNo)}
                  disabled={uploadingStates["vatCertificate"] || !formik.values.vatCertificate.thumbnail || !formik.values.vatCertificate.certificateNo}
                >
                  {uploadingStates["vatCertificate"] ? (
                    <CircularProgress size={24} />
                  ) : uploadedStates["vatCertificate"] ? (
                    <CheckCircleIcon style={{ color: "#4caf50" }} />
                  ) : (
                    <UploadIcon />
                  )}
                </Button>
                <Button
                  style={{ minWidth: "40px", minHeight: "40px" }}
                  type="button"
                  color="error"
                  onClick={() => handleDeleteDocument("vatCertificate")}
                  disabled={!formik.values.vatCertificate.documentId && !localPreviewUrls["vatCertificate"]}
                >
                  <GridDeleteIcon />
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* 8. Tax Compliance certificate */}
          <Typography variant="h6" className={classes.sectionTitle}>
            Tax Compliance certificate
          </Typography>
          <Grid container spacing={3} style={{ marginBottom: "20px" }} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="certificateNo"
                value={formik.values.taxComplianceCertificate.certificateNo}
                onChange={(e) => formik.setFieldValue("taxComplianceCertificate.certificateNo", e.target.value)}
                label="Certificate Number"
                variant="outlined"
                className={classes.textField}
                fullWidth
                error={
                  formik.touched.taxComplianceCertificate?.certificateNo &&
                  Boolean(formik.errors.taxComplianceCertificate?.certificateNo)
                }
                helperText={
                  formik.touched.taxComplianceCertificate?.certificateNo &&
                  formik.errors.taxComplianceCertificate?.certificateNo
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ height: "56px" }}></Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              {renderThumbnail("taxComplianceCertificate")}
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <Button
                  style={{ minWidth: "40px", minHeight: "40px" }}
                  type="button"
                  onClick={() => handleUploadDocument("taxComplianceCertificate", "TAX_COMPLIANCE_CERTIFICATE", formik.values.taxComplianceCertificate.certificateNo)}
                  disabled={uploadingStates["taxComplianceCertificate"] || !formik.values.taxComplianceCertificate.thumbnail || !formik.values.taxComplianceCertificate.certificateNo}
                >
                  {uploadingStates["taxComplianceCertificate"] ? (
                    <CircularProgress size={24} />
                  ) : uploadedStates["taxComplianceCertificate"] ? (
                    <CheckCircleIcon style={{ color: "#4caf50" }} />
                  ) : (
                    <UploadIcon />
                  )}
                </Button>
                <Button
                  style={{ minWidth: "40px", minHeight: "40px" }}
                  type="button"
                  color="error"
                  onClick={() => handleDeleteDocument("taxComplianceCertificate")}
                  disabled={!formik.values.taxComplianceCertificate.documentId && !localPreviewUrls["taxComplianceCertificate"]}
                >
                  <GridDeleteIcon />
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* 9. Scanned copy of a cancelled Cheque */}
          <Typography variant="h6" className={classes.sectionTitle}>
            Scanned copy of a cancelled Cheque
          </Typography>
          <Grid container spacing={3} style={{ marginBottom: "20px" }} alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Bank Name"
                name="bankName"
                value={formik.values.cancelledCheque.bankName}
                onChange={(e) => formik.setFieldValue("cancelledCheque.bankName", e.target.value)}
                variant="outlined"
                className={classes.textField}
                fullWidth
                error={
                  formik.touched.cancelledCheque?.bankName &&
                  Boolean(formik.errors.cancelledCheque?.bankName)
                }
                helperText={
                  formik.touched.cancelledCheque?.bankName &&
                  formik.errors.cancelledCheque?.bankName
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Branch Code"
                name="branchCode"
                value={formik.values.cancelledCheque.branchCode}
                onChange={(e) => formik.setFieldValue("cancelledCheque.branchCode", e.target.value)}
                variant="outlined"
                className={classes.textField}
                fullWidth
                error={
                  formik.touched.cancelledCheque?.branchCode &&
                  Boolean(formik.errors.cancelledCheque?.branchCode)
                }
                helperText={
                  formik.touched.cancelledCheque?.branchCode &&
                  formik.errors.cancelledCheque?.branchCode
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Account No"
                name="accountNo"
                value={formik.values.cancelledCheque.accountNo}
                onChange={(e) => formik.setFieldValue("cancelledCheque.accountNo", e.target.value)}
                variant="outlined"
                className={classes.textField}
                fullWidth
                error={
                  formik.touched.cancelledCheque?.accountNo &&
                  Boolean(formik.errors.cancelledCheque?.accountNo)
                }
                helperText={
                  formik.touched.cancelledCheque?.accountNo &&
                  formik.errors.cancelledCheque?.accountNo
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ height: "56px" }}></Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              {renderThumbnail("cancelledCheque")}
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <Button
                  style={{ minWidth: "40px", minHeight: "40px" }}
                  type="button"
                  onClick={() => handleUploadDocument("cancelledCheque", "CANCELLED_CHEQUE")}
                  disabled={uploadingStates["cancelledCheque"] || !formik.values.cancelledCheque.thumbnail}
                >
                  {uploadingStates["cancelledCheque"] ? (
                    <CircularProgress size={24} />
                  ) : uploadedStates["cancelledCheque"] ? (
                    <CheckCircleIcon style={{ color: "#4caf50" }} />
                  ) : (
                    <UploadIcon />
                  )}
                </Button>
                <Button
                  style={{ minWidth: "40px", minHeight: "40px" }}
                  type="button"
                  color="error"
                  onClick={() => handleDeleteDocument("cancelledCheque")}
                  disabled={!formik.values.cancelledCheque.documentId && !localPreviewUrls["cancelledCheque"]}
                >
                  <GridDeleteIcon />
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Footer: Navigation Buttons */}
          <Grid container spacing={3} justifyContent="flex-end">
            <Grid item>
              <Button
                style={{
                  background: "#d72b56",
                  color: "#fff",
                  minWidth: "80px",
                  marginRight: "5px"
                }}
                type="submit"
              >
                Finish
              </Button>
              <Button
                color="primary"
                onClick={handleClose}
                className="p-button-text"
                type="button"
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
      
      {/* Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={() => setPreviewDialog({ open: false, imageUrl: null })}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: "relative" }}>
          {previewDialog.imageUrl && (
            <Box
              component="img"
              src={previewDialog.imageUrl}
              alt="Preview"
              sx={{
                width: "100%",
                height: "auto",
                display: "block"
              }}
            />
          )}
          <IconButton
            onClick={() => setPreviewDialog({ open: false, imageUrl: null })}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.8)"
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
