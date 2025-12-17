'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, CircularProgress, Divider, Grid, Typography, Button, TextField, Alert, Dialog, DialogContent, IconButton, DialogTitle, DialogActions, MenuItem } from '@mui/material';
import { TabPanel, TabView } from 'primereact/tabview';
import { ProvidersService } from '@/services/remote-api/api/provider-services/provider.services';
import { ProviderTypeService } from '@/services/remote-api/api/master-services/provider.type.service';
import { IdentificationTypeService } from '@/services/remote-api/api/master-services/identification.type.service';
import { catchError, of } from 'rxjs';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { HierarchyService } from '@/services/remote-api/api/hierarchy-services/hierarchy.services';

const providerService = new ProvidersService();
const hierarchyService = new HierarchyService();
const providerTypeService = new ProviderTypeService();
const identificationTypeService = new IdentificationTypeService();

// 🔹 Custom Hook for fetching provider data
const useProviderData = (id: string) => {
    const [providerDetails, setProviderDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProviderDetails = useCallback(() => {
        if (!id) return;
        setLoading(true);
        setError(null);

        providerService
            .getProviderDetails(id)
            .pipe(
                catchError((err: any) => {
                    console.error('Error fetching provider details:', err);
                    setError('Failed to fetch provider details');
                    setLoading(false);
                    return of(null);
                })
            )
            .subscribe((res: any) => {
                if (res) {
                    setProviderDetails(res);
                }
                setLoading(false);
            });
    }, [id]);

    return { providerDetails, loading, error, fetchProviderDetails };
};

// 🔹 Helper for Status Color
const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'active':
        case 'approved':
            return '#28a745';
        case 'inactive':
            return '#6c757d';
        case 'blacklisted':
            return '#dc3545';
        default:
            return '#6c757d';
    }
};

// 🔹 Main Component
const ProviderViewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { providerDetails, loading, error, fetchProviderDetails } = useProviderData(id);
    const [activeIndex, setActiveIndex] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [dialogComment, setDialogComment] = useState('');
    const [providerTypeMap, setProviderTypeMap] = useState<{ [key: string]: string }>({});
    const [contractTypeMap, setContractTypeMap] = useState<{ [key: string]: string }>({});
    const [nationalSchemeContractTypeMap, setNationalSchemeContractTypeMap] = useState<{ [key: string]: string }>({});
    const [identificationTypeMap, setIdentificationTypeMap] = useState<{ [key: string]: string }>({});
    const [ownerTypeMap, setOwnerTypeMap] = useState<{ [key: string]: string }>({});
    const [approvalStatus, setApprovalStatus] = useState<any>(null);
    const [statusLoading, setStatusLoading] = useState(false);
    const [statusError, setStatusError] = useState<string | null>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [documentImages, setDocumentImages] = useState<{ [key: string]: string }>({});
    const [loadingDocuments, setLoadingDocuments] = useState(false);
    const imageLoadCounterRef = useRef({ count: 0, total: 0 });
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState<string | null>(null);
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<'APPROVED' | 'REJECTED' | 'REVERT' | null>(null);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [startDate, setStartDate] = useState<string>('');
    const [regions, setRegions] = useState<Array<{ value: string; label: string }>>([]);
    const [branches, setBranches] = useState<Array<{ value: string; label: string }>>([]);
    const [units, setUnits] = useState<Array<{ value: string; label: string }>>([]);
    const [dropdownLoading, setDropdownLoading] = useState({ regions: false, branches: false, units: false });

    useEffect(() => {
        fetchProviderDetails();
    }, [fetchProviderDetails]);

    // Fetch provider types and create code-to-name mapping
    useEffect(() => {
        const subscription = providerTypeService.getProviderTypes({ page: 0, size: 1000, summary: true }).subscribe({
            next: (response: any) => {
                const mapping: { [key: string]: string } = {};
                (response?.content || []).forEach((type: any) => {
                    if (type?.code && type?.name) {
                        mapping[type.code] = type.name;
                    }
                });
                setProviderTypeMap(mapping);
            },
            error: (err: any) => {
                console.error('Error fetching provider types:', err);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    // Fetch contract types and create code-to-name mapping
    useEffect(() => {
        const subscription = providerTypeService.getContractTypes({ page: 0, size: 1000, summary: true }).subscribe({
            next: (response: any) => {
                const mapping: { [key: string]: string } = {};
                (response?.content || []).forEach((type: any) => {
                    if (type?.code && type?.name) {
                        mapping[type.code] = type.name;
                    }
                });
                setContractTypeMap(mapping);
            },
            error: (err: any) => {
                console.error('Error fetching contract types:', err);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    // Fetch national scheme contract types and create code-to-name mapping
    useEffect(() => {
        const subscription = providerTypeService.getNationalSchemeContractTypes({ page: 0, size: 1000, summary: true }).subscribe({
            next: (response: any) => {
                const mapping: { [key: string]: string } = {};
                (response?.content || []).forEach((type: any) => {
                    if (type?.code && type?.name) {
                        mapping[type.code] = type.name;
                    }
                });
                setNationalSchemeContractTypeMap(mapping);
            },
            error: (err: any) => {
                console.error('Error fetching national scheme contract types:', err);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    // Fetch identification types and create code-to-name mapping
    useEffect(() => {
        const subscription = identificationTypeService.getIdentificationTypes({ page: 0, size: 1000, summary: true }).subscribe({
            next: (response: any) => {
                const mapping: { [key: string]: string } = {};
                (response?.content || []).forEach((type: any) => {
                    if (type?.code && type?.name) {
                        mapping[type.code] = type.name;
                    }
                });
                setIdentificationTypeMap(mapping);
            },
            error: (err: any) => {
                console.error('Error fetching identification types:', err);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    // Fetch owner types and create code-to-name mapping
    useEffect(() => {
        const subscription = providerTypeService.getProviderOwnerTypes({ page: 0, size: 1000, summary: true }).subscribe({
            next: (response: any) => {
                const mapping: { [key: string]: string } = {};
                (response?.content || []).forEach((type: any) => {
                    if (type?.code && type?.name) {
                        mapping[type.code] = type.name;
                    }
                });
                setOwnerTypeMap(mapping);
            },
            error: (err: any) => {
                console.error('Error fetching owner types:', err);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    // Fetch document image with callback to track completion
    const fetchDocumentImage = useCallback((documentId: string, documentType: string, onComplete: () => void) => {
        // Skip if already fetched
        if (!documentId) {
            onComplete();
            return;
        }
        
        providerService.getDocumentById(documentId).subscribe({
            next: (blob: Blob) => {
                if (blob && blob.size > 0) {
                    const imageUrl = URL.createObjectURL(blob);
                    setDocumentImages(prev => {
                        // Only update if not already set to avoid overwriting
                        if (!prev[documentId]) {
                            return { ...prev, [documentId]: imageUrl };
                        }
                        return prev;
                    });
                } else {
                    console.warn(`Empty blob received for document ${documentId} (${documentType})`);
                }
                onComplete();
            },
            error: (error) => {
                console.error(`Failed to fetch image for document ${documentId} (${documentType}):`, error);
                // Still call onComplete even on error so loading can finish
                onComplete();
            }
        });
    }, []);

    // Fetch documents when provider ID is available
    const fetchDocuments = useCallback(() => {
        if (!id) return;
        setLoadingDocuments(true);
        providerService.getProviderDocuments(id).subscribe({
            next: (response: any) => {
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

                setDocuments(documentsArray);

                // Get all documents that need images
                const documentsToFetch = documentsArray.filter((doc: any) => {
                    const documentId = doc.id || doc.documentId;
                    return !!documentId;
                });

                // If no documents to fetch, stop loading immediately
                if (documentsToFetch.length === 0) {
                    setLoadingDocuments(false);
                    return;
                }

                // Reset and track completed image fetches using ref to avoid closure issues
                imageLoadCounterRef.current = { count: 0, total: documentsToFetch.length };

                // Fetch images for each document
                documentsToFetch.forEach((doc: any) => {
                    const documentId = doc.id || doc.documentId;
                    const docIdString = String(documentId);
                    const documentType = doc.documentType || doc.docType || 'Unknown';
                    
                    console.log(`Fetching image for document ${docIdString} (${documentType})`);
                    
                    fetchDocumentImage(docIdString, documentType, () => {
                        imageLoadCounterRef.current.count++;
                        console.log(`Image fetch completed: ${imageLoadCounterRef.current.count}/${imageLoadCounterRef.current.total}`);
                        // Only stop loading when all images are fetched (success or error)
                        if (imageLoadCounterRef.current.count >= imageLoadCounterRef.current.total) {
                            console.log('All images fetched, stopping loader');
                            setLoadingDocuments(false);
                        }
                    });
                });
            },
            error: (error) => {
                console.error('Failed to fetch documents:', error);
                setLoadingDocuments(false);
            }
        });
    }, [id, fetchDocumentImage]);

    useEffect(() => {
        if (id) {
            fetchDocuments();
        }
    }, [id, fetchDocuments]);

    // Debug: Log when documentImages change
    useEffect(() => {
        console.log('documentImages state updated:', Object.keys(documentImages).length, 'images');
        console.log('Document IDs with images:', Object.keys(documentImages));
    }, [documentImages]);

    const handlePreviewImage = (imageUrl: string) => {
        if (!imageUrl) {
            setPreviewError('Image URL is not available');
            setPreviewOpen(true);
            return;
        }
        
        setPreviewLoading(true);
        setPreviewError(null);
        setPreviewImage(imageUrl);
        setPreviewOpen(true);
        
        // Check if image loads successfully
        const img = new Image();
        img.onload = () => {
            setPreviewLoading(false);
            setPreviewError(null);
        };
        img.onerror = () => {
            setPreviewLoading(false);
            setPreviewError('Failed to load image. Please try again.');
        };
        img.src = imageUrl;
    };

    const handleClosePreview = () => {
        setPreviewOpen(false);
        setPreviewImage(null);
        setPreviewLoading(false);
        setPreviewError(null);
    };

    // Cleanup blob URLs on unmount
    useEffect(() => {
        return () => {
            Object.values(documentImages).forEach((url) => {
                if (url && url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [documentImages]);

    const openApproveDialog = () => {
        setActionType('APPROVED');
        setDialogComment('Provider approved');
        setActionDialogOpen(true);
    };

    const openRevertDialog = () => {
        setActionType('REVERT');
        setDialogComment('Need KYC Document');
        setActionDialogOpen(true);
    };

    const openRejectDialog = () => {
        setActionType('REJECTED');
        setDialogComment('Provider rejected');
        setActionDialogOpen(true);
    };

    const closeActionDialog = () => {
        if (processing) return;
        setActionDialogOpen(false);
        setActionType(null);
        setDialogComment('');
    };

    const handleActionSubmit = () => {
        if (!id || !actionType) return;

        setProcessing(true);
        const payload: any = {
            action: actionType,
            comment: dialogComment?.trim() || ''
        };

        providerService.approveProvider(id, payload).subscribe({
            next: () => {
                setProcessing(false);
                setActionDialogOpen(false);
                setActionType(null);
                setDialogComment('');
                alert('Action submitted successfully');
                router.push('/provider?mode=viewList');
            },
            error: (err) => {
                console.error('Error submitting action:', err);
                setProcessing(false);
                alert('Failed to submit action');
            }
        });
    };

    const loadRegions = useCallback(() => {
        setDropdownLoading(prev => ({ ...prev, regions: true }));
        const pageRequest = { page: 0, size: 1000, summary: true, active: true };
        hierarchyService.getRegion(pageRequest).subscribe({
            next: (response: any) => {
                const list = (response?.content || []).map((item: any) => ({
                    value: item.id,
                    label: item.name || item.regionName || item.code || 'Region'
                }));
                setRegions(list);
                setDropdownLoading(prev => ({ ...prev, regions: false }));
            },
            error: (err) => {
                console.error('Failed to load regions:', err);
                setRegions([]);
                setDropdownLoading(prev => ({ ...prev, regions: false }));
            }
        });
    }, []);

    const loadBranches = useCallback((regionId: string) => {
        if (!regionId) {
            setBranches([]);
            return;
        }
        setDropdownLoading(prev => ({ ...prev, branches: true }));
        hierarchyService.getBranchesFromRegion(regionId).subscribe({
            next: (response: any) => {
                const list = (response?.branches || []).map((branch: any) => ({
                    value: branch.id,
                    label: branch.centerName || branch.name || branch.code || 'Branch'
                }));
                setBranches(list);
                setDropdownLoading(prev => ({ ...prev, branches: false }));
            },
            error: (err) => {
                console.error('Failed to load branches:', err);
                setBranches([]);
                setDropdownLoading(prev => ({ ...prev, branches: false }));
            }
        });
    }, []);

    const loadUnits = useCallback((branchId: string) => {
        if (!branchId) {
            setUnits([]);
            return;
        }
        setDropdownLoading(prev => ({ ...prev, units: true }));
        hierarchyService.getUnitsFromBranch(branchId).subscribe({
            next: (response: any) => {
                const list = (response?.units || []).map((unit: any) => ({
                    value: unit.id,
                    label: unit.name || unit.unitName || unit.code || 'Unit'
                }));
                setUnits(list);
                setDropdownLoading(prev => ({ ...prev, units: false }));
            },
            error: (err) => {
                console.error('Failed to load units:', err);
                setUnits([]);
                setDropdownLoading(prev => ({ ...prev, units: false }));
            }
        });
    }, []);


    // ✅ Loading UI
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress sx={{ color: '#D80E51' }} />
            </Box>
        );
    }

    // ✅ Error / Not found UI
    if (error || !providerDetails) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <Typography color="error" variant="h6">
                    {error || 'Provider not found'}
                </Typography>
            </Box>
        );
    }

    // ✅ Render Sections
    const renderBasicDetails = () => (
        <Box p={2}>
            <Typography sx={{ fontWeight: 'bold', color: '#D80E51', mb: 1 }}>Basic Details</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
                {[
                    ['Provider Name', providerDetails?.providerBasicDetails?.name],
                    ['Provider Code', providerDetails?.providerBasicDetails?.code],
                    ['Provider Type', providerDetails?.providerType?.name || (providerDetails?.providerBasicDetails?.type && providerTypeMap[providerDetails.providerBasicDetails.type]) || providerDetails?.providerBasicDetails?.type || 'N/A'],
                    ['Organization Type', providerDetails?.providerBasicDetails?.orgType?.name],
                    ['Partner ID', providerDetails?.providerBasicDetails?.partnerId],
                    ['Combination Partner ID', providerDetails?.providerBasicDetails?.combinationPartnerId],
                    ['PIN / TIN', providerDetails?.providerBasicDetails?.taxPinNumber],
                    ['Abbreviation', providerDetails?.providerBasicDetails?.abbreviation],
                    ['Contract Type', (providerDetails?.providerBasicDetails?.contractType && contractTypeMap[providerDetails.providerBasicDetails.contractType]) || providerDetails?.providerBasicDetails?.contractType || 'N/A'],
                    ['National Scheme Cont. Type', (providerDetails?.providerBasicDetails?.nationalSchemeContractType && nationalSchemeContractTypeMap[providerDetails.providerBasicDetails.nationalSchemeContractType]) || providerDetails?.providerBasicDetails?.nationalSchemeContractType || 'N/A'],
                    ['Owner Type', (providerDetails?.providerBasicDetails?.ownerType && ownerTypeMap[providerDetails.providerBasicDetails.ownerType]) || (providerDetails?.providerBasicDetails?.ownershipType && ownerTypeMap[providerDetails.providerBasicDetails.ownershipType]) || providerDetails?.providerBasicDetails?.ownerType || providerDetails?.providerBasicDetails?.ownershipType || 'N/A'],
                    // ['Status', providerDetails?.status],
                    ['Parent Provider', providerDetails?.providerBasicDetails?.parentProvider?.name],
                ].map(([label, value]) => (
                    <Grid item xs={12} sm={6} key={label}>
                        <Grid container>
                            <Grid item xs={4} sx={{ fontWeight: 'bold', color: '#3C3C3C', fontSize: 13, whiteSpace: 'nowrap' }}>
                                {label}:
                            </Grid>
                            <Grid item xs={8} sx={{ color: '#A1A1A1', fontSize: 13, display: 'flex', alignItems: 'center', gap: 1 }}>
                                {label === 'Status' ? (
                                    <>
                                        <Box
                                            sx={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: '50%',
                                                backgroundColor: getStatusColor(value as string)
                                            }}
                                        />
                                        {value}
                                    </>
                                ) : (
                                    value || 'N/A'
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                ))}
            </Grid>

            {/* Identification Details Section (from removed tab) */}
            {renderIdentificationDetails()}
        </Box>
    );

    const renderContactDetails = () => {
        const primaryContact = providerDetails?.providerBasicDetails?.contactNos?.find((c: any) => c.contactType === 'PRIMARY')?.contactNo;
        const alternateContacts = providerDetails?.providerBasicDetails?.contactNos?.filter((c: any) => c.contactType === 'ALTERNATE') || [];
        const primaryEmail = providerDetails?.providerBasicDetails?.emails?.find((e: any) => e.contactType === 'PRIMARY')?.emailId;
        const alternateEmails = providerDetails?.providerBasicDetails?.emails?.filter((e: any) => e.contactType === 'ALTERNATE') || [];

        return (
            <Box p={2}>
                <Typography sx={{ fontWeight: 'bold', color: '#D80E51', mb: 1 }}>Contact Details</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Grid container>
                            <Grid item xs={4} sx={{ fontWeight: 'bold', color: '#3C3C3C', fontSize: 13 }}>
                                Primary Contact:
                            </Grid>
                            <Grid item xs={8} sx={{ color: '#A1A1A1', fontSize: 13 }}>
                                {primaryContact || 'N/A'}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Grid container>
                            <Grid item xs={4} sx={{ fontWeight: 'bold', color: '#3C3C3C', fontSize: 13 }}>
                                Primary Email:
                            </Grid>
                            <Grid item xs={8} sx={{ color: '#A1A1A1', fontSize: 13 }}>
                                {primaryEmail || 'N/A'}
                            </Grid>
                        </Grid>
                    </Grid>
                    {alternateContacts.length > 0 && alternateContacts.map((contact: any, idx: number) => (
                        <React.Fragment key={`alt-contact-${idx}`}>
                            <Grid item xs={12} sm={6}>
                                <Grid container>
                                    <Grid item xs={4} sx={{ fontWeight: 'bold', color: '#3C3C3C', fontSize: 13 }}>
                                        Alternate Contact {idx + 1}:
                                    </Grid>
                                    <Grid item xs={8} sx={{ color: '#A1A1A1', fontSize: 13 }}>
                                        {contact?.contactNo || 'N/A'}
                                    </Grid>
                                </Grid>
                            </Grid>
                            {alternateEmails[idx] && (
                                <Grid item xs={12} sm={6}>
                                    <Grid container>
                                        <Grid item xs={4} sx={{ fontWeight: 'bold', color: '#3C3C3C', fontSize: 13 }}>
                                            Alternate Email {idx + 1}:
                                        </Grid>
                                        <Grid item xs={8} sx={{ color: '#A1A1A1', fontSize: 13 }}>
                                            {alternateEmails[idx]?.emailId || 'N/A'}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )}
                        </React.Fragment>
                    ))}
                </Grid>
            </Box>
        );
    };

    const renderAddressDetails = () => {
        const formatAddressLine = (mergedAddressDetails: any) => {
            if (!mergedAddressDetails || typeof mergedAddressDetails !== 'object') return 'N/A';

            // Define the order of address fields (case-insensitive matching)
            const addressFieldOrder = ['add', 'add2', 'city', 'state', 'country', 'pinCode', 'zipCode'];

            // Create a case-insensitive lookup map
            const fieldMap: { [key: string]: string } = {};
            Object.keys(mergedAddressDetails).forEach(key => {
                const lowerKey = key.toLowerCase();
                if (addressFieldOrder.includes(lowerKey)) {
                    fieldMap[lowerKey] = key; // Store original key
                }
            });

            // Build address parts in order
            const addressParts: string[] = [];
            addressFieldOrder.forEach(field => {
                const originalKey = fieldMap[field];
                if (originalKey) {
                    const value = mergedAddressDetails[originalKey];
                    if (value && value !== 'N/A' && value !== '' && String(value).trim() !== '') {
                        addressParts.push(String(value).trim());
                    }
                }
            });

            // Also include any other fields that might exist (not in the ordered list)
            Object.entries(mergedAddressDetails).forEach(([key, value]: [string, any]) => {
                const lowerKey = key.toLowerCase();
                if (!addressFieldOrder.includes(lowerKey) && value && value !== 'N/A' && value !== '' && String(value).trim() !== '') {
                    addressParts.push(String(value).trim());
                }
            });

            return addressParts.length > 0 ? addressParts.join(', ') : 'N/A';
        };

        // Merge all address objects into one
        const mergeAllAddresses = (addresses: any[]) => {
            if (!addresses || addresses.length === 0) return {};

            const merged: any = {};
            addresses.forEach((addr: any) => {
                if (addr.addressDetails && typeof addr.addressDetails === 'object') {
                    Object.assign(merged, addr.addressDetails);
                }
            });

            return merged;
        };

        return (
            <Box p={2}>
                <Typography sx={{ fontWeight: 'bold', color: '#D80E51', mb: 1 }}>Address Details</Typography>
                <Divider sx={{ mb: 2 }} />
                {providerDetails?.providerAddresses?.addresses?.length > 0 ? (
                    <Box sx={{
                        p: 2,
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        backgroundColor: '#f9f9f9'
                    }}>
                        <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Address</Typography>
                        <Typography sx={{ color: '#3C3C3C', fontSize: 14, lineHeight: 1.6 }}>
                            {formatAddressLine(mergeAllAddresses(providerDetails.providerAddresses.addresses))}
                        </Typography>
                    </Box>
                ) : (
                    <Typography variant="body2" color="textSecondary">
                        No address details available.
                    </Typography>
                )}
            </Box>
        );
    };

    const renderIdentificationDetails = () => (
        <Box p={2}>
            <Typography sx={{ fontWeight: 'bold', color: '#D80E51', mb: 1 }}>Identification Details</Typography>
            <Divider sx={{ mb: 2 }} />
            {providerDetails?.providerBasicDetails?.identifications?.length > 0 ? (
                <Grid container spacing={2}>
                    {providerDetails.providerBasicDetails.identifications.map((id: any, index: number) => (
                        <Grid item xs={12} key={`identification-${index}`}>
                            <Box sx={{
                                p: 2,
                                mb: 2,
                                border: '1px solid #e0e0e0',
                                borderRadius: 1,
                                backgroundColor: '#f9f9f9'
                            }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Grid container>
                                            <Grid item xs={4} sx={{ fontWeight: 'bold', color: '#3C3C3C', fontSize: 13 }}>
                                                Type:
                                            </Grid>
                                            <Grid item xs={8} sx={{ color: '#A1A1A1', fontSize: 13 }}>
                                                {(id.identificationType && identificationTypeMap[id.identificationType]) || id.identificationType || 'N/A'}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Grid container>
                                            <Grid item xs={4} sx={{ fontWeight: 'bold', color: '#3C3C3C', fontSize: 13 }}>
                                                Number:
                                            </Grid>
                                            <Grid item xs={8} sx={{ color: '#A1A1A1', fontSize: 13 }}>
                                                {id.identificationNo || 'N/A'}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body2" color="textSecondary">
                    No identification details available.
                </Typography>
            )}
        </Box>
    );

    const renderSpecializations = () => (
        <Box p={2}>
            <Typography sx={{ fontWeight: 'bold', color: '#D80E51', mb: 1 }}>Specializations</Typography>
            <Divider sx={{ mb: 2 }} />
            {providerDetails?.providerBasicDetails?.specializations?.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {providerDetails.providerBasicDetails.specializations.map((spec: any, index: number) => (
                        <Box
                            key={`spec-${index}`}
                            sx={{
                                px: 2,
                                py: 1,
                                backgroundColor: '#e3f2fd',
                                borderRadius: 2,
                                color: '#1976d2',
                                fontWeight: 500
                            }}
                        >
                            {spec.name || spec}
                        </Box>
                    ))}
                </Box>
            ) : (
                <Typography variant="body2" color="textSecondary">
                    No specializations available.
                </Typography>
            )}
        </Box>
    );

    const renderCategoryDetails = () => (
        <Box p={2}>
            <Typography sx={{ fontWeight: 'bold', color: '#D80E51', mb: 1 }}>Category Details</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Grid container>
                        <Grid item xs={4} sx={{ fontWeight: 'bold', color: '#3C3C3C', fontSize: 13 }}>
                            Category:
                        </Grid>
                        <Grid item xs={8} sx={{ color: '#A1A1A1', fontSize: 13 }}>
                            {providerDetails?.category || providerDetails?.providerCategoryHistorys?.[0]?.categoryName || 'N/A'}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );

    const renderHistory = () => (
        <Box p={2}>
            <Typography sx={{ fontWeight: 'bold', color: '#D80E51', mb: 1 }}>History</Typography>
            <Divider sx={{ mb: 2 }} />
            {providerDetails?.providerCategoryHistorys?.length > 0 ? (
                providerDetails.providerCategoryHistorys.map((history: any, index: number) => (
                    <Box
                        key={index}
                        sx={{
                            p: 2,
                            mb: 1,
                            borderRadius: 1,
                            border: '1px solid #e0e0e0',
                            backgroundColor: '#f9f9f9'
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography sx={{ fontWeight: 'bold' }}>{history.categoryName}</Typography>
                            <Typography variant="caption" sx={{ color: '#888' }}>
                                {history.createdAt ? new Date(history.createdAt).toLocaleDateString() : 'N/A'}
                            </Typography>
                        </Box>
                        <Typography sx={{ color: '#555', fontSize: 13 }}>
                            {history.description || 'No description'}
                        </Typography>
                    </Box>
                ))
            ) : (
                <Typography variant="body2" color="textSecondary">
                    No history available.
                </Typography>
            )}
        </Box>
    );

    const renderDocuments = () => {
        // Filter documents to only show those with images
        const documentsWithImages = documents.filter((doc: any) => {
            const documentId = doc.id || doc.documentId;
            const docIdString = documentId ? String(documentId) : null;
            return docIdString && !!documentImages[docIdString];
        });

        return (
            <Box p={2}>
                <Typography sx={{ fontWeight: 'bold', color: '#D80E51', mb: 1 }}>Documents</Typography>
                <Divider sx={{ mb: 2 }} />
                {loadingDocuments ? (
                    <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                        <CircularProgress sx={{ color: '#D80E51' }} />
                    </Box>
                ) : documentsWithImages.length > 0 ? (
                    <Grid container spacing={3}>
                        {documentsWithImages.map((doc: any, index: number) => {
                            const documentId = doc.id || doc.documentId;
                            const docIdString = documentId ? String(documentId) : '';
                            const documentType = doc.documentType || doc.docType || `Document ${index + 1}`;
                            const imageUrl = documentImages[docIdString];

                        return (
                            <Grid item xs={12} sm={6} md={4} key={documentId || index}>
                                <Box
                                    sx={{
                                        p: 2,
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 1,
                                        backgroundColor: '#f9f9f9',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1,
                                        alignItems: 'center'
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 'bold', fontSize: 14, color: '#3C3C3C', textAlign: 'center' }}>
                                        {documentType}
                                    </Typography>
                                    {doc.documentNo && (
                                        <Typography sx={{ fontSize: 12, color: '#888', textAlign: 'center' }}>
                                            Certificate No: {doc.documentNo}
                                        </Typography>
                                    )}
                                    <Button
                                        variant="contained"
                                        startIcon={<VisibilityIcon />}
                                        onClick={() => {
                                            if (imageUrl) {
                                                handlePreviewImage(imageUrl);
                                            } else {
                                                // Image not available - show error
                                                handlePreviewImage('');
                                            }
                                        }}
                                        sx={{
                                            mt: 1,
                                            backgroundColor: '#D80E51',
                                            '&:hover': {
                                                backgroundColor: '#b8073f'
                                            }
                                        }}
                                    >
                                        Preview Image
                                    </Button>
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>
            ) : (
                <Typography variant="body2" color="textSecondary">
                    No documents available.
                </Typography>
            )}
        </Box>
        );
    };

    // ✅ Main Render
    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, px: 1 }}>
                <Box>
                    <Box component="span" sx={{ color: '#D80E51', fontWeight: 'bold' }}>
                        Provider:
                    </Box>{' '}
                    {providerDetails?.providerBasicDetails?.name || 'N/A'}
                </Box>
                <Box>
                    <Box component="span" sx={{ color: '#D80E51', fontWeight: 'bold' }}>
                        Status:
                    </Box>{' '}
                    {providerDetails?.status || 'Active'}
                </Box>
            </Box>

            {/* TabView */}
            <TabView scrollable activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel
                    header={
                        <>
                            <span className="pi pi-user mr-2" style={{ color: "#28a745" }}></span>
                            Basic Details
                        </>
                    }
                >
                    {renderBasicDetails()}
                </TabPanel>

                <TabPanel
                    header={
                        <>
                            <span className="pi pi-map-marker mr-2" style={{ color: "#d81152" }}></span>
                            Contact & Address Details
                        </>
                    }
                >
                    <Box>
                        {renderContactDetails()}
                        {renderAddressDetails()}
                    </Box>
                </TabPanel>

                {/* Remove Identification Tab - do not render TabPanel for Identification */}

                <TabPanel
                    header={
                        <>
                            <span className="pi pi-briefcase mr-2" style={{ color: "#28a745" }}></span>
                            Specializations & Category Details
                        </>
                    }
                >
                    <Box>
                        {renderSpecializations()}
                        {renderCategoryDetails()}
                    </Box>
                </TabPanel>

                <TabPanel
                    header={
                        <>
                            <span className="pi pi-history mr-2" style={{ color: "#fc862b" }}></span>
                            History
                        </>
                    }
                >
                    {renderHistory()}
                </TabPanel>

                <TabPanel
                    header={
                        <>
                            <span className="pi pi-file mr-2" style={{ color: "#1976d2" }}></span>
                            Documents
                        </>
                    }
                >
                    {renderDocuments()}
                </TabPanel>
            </TabView>

            <Dialog open={actionDialogOpen} onClose={closeActionDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {actionType === 'APPROVED' ? 'Approve Provider' : actionType === 'REJECTED' ? 'Reject Provider' : actionType === 'REVERT' ? 'Revert Provider' : 'Provider Action'}
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                    <TextField
                        label="Comment"
                        placeholder="Enter comment"
                        value={dialogComment}
                        onChange={(e) => setDialogComment(e.target.value)}
                        fullWidth
                        multiline
                        minRows={3}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeActionDialog} disabled={processing}>
                        Cancel
                    </Button>
                    <Button onClick={handleActionSubmit} disabled={processing} variant="contained" color="primary">
                        {processing ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Image Preview Dialog */}
            <Dialog
                open={previewOpen}
                onClose={handleClosePreview}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        maxHeight: '90vh'
                    }
                }}
            >
                <DialogContent sx={{ p: 0, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <IconButton
                        onClick={handleClosePreview}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            zIndex: 1,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.3)'
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {previewLoading && (
                        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                            <CircularProgress sx={{ color: '#fff' }} />
                            <Typography sx={{ color: '#fff' }}>Loading image...</Typography>
                        </Box>
                    )}
                    {previewError && !previewLoading && (
                        <Box display="flex" flexDirection="column" alignItems="center" gap={2} p={4}>
                            <Typography sx={{ color: '#ff6b6b', fontSize: 18, fontWeight: 'bold' }}>
                                {previewError}
                            </Typography>
                            <Typography sx={{ color: '#fff', fontSize: 14 }}>
                                The image may not be available or may have failed to load.
                            </Typography>
                        </Box>
                    )}
                    {previewImage && !previewLoading && !previewError && (
                        <img
                            src={previewImage}
                            alt="Document Preview"
                            onLoad={() => setPreviewLoading(false)}
                            onError={() => {
                                setPreviewLoading(false);
                                setPreviewError('Failed to load image');
                            }}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '90vh',
                                objectFit: 'contain'
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Approve, Revert, and Reject Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3, mb: 2, px: 1 }}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={openApproveDialog}
                    disabled={processing}
                    sx={{
                        minWidth: '120px',
                        backgroundColor: '#28a745',
                        '&:hover': { backgroundColor: '#218838' }
                    }}
                >
                    {processing ? <CircularProgress size={20} /> : 'Approve'}
                </Button>
                {providerDetails?.providerBasicDetails?.sourceType !== 'CORE_PORTAL' && (
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={openRevertDialog}
                        disabled={processing}
                        sx={{
                            minWidth: '120px',
                            backgroundColor: '#ffc107',
                            color: '#000',
                            '&:hover': { backgroundColor: '#e0a800' }
                        }}
                    >
                        {processing ? <CircularProgress size={20} /> : 'Revert'}
                    </Button>
                )}
                <Button
                    variant="contained"
                    color="error"
                    onClick={openRejectDialog}
                    disabled={processing}
                    sx={{
                        minWidth: '120px',
                        backgroundColor: '#dc3545',
                        '&:hover': { backgroundColor: '#c82333' }
                    }}
                >
                    {processing ? <CircularProgress size={20} /> : 'Reject'}
                </Button>
            </Box>
        </Box>
    );
};

export default ProviderViewPage;
