import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Button, Card, Grid, Step, StepLabel, Stepper, TextField, Typography, MenuItem, StepConnector, CircularProgress, Alert, styled } from '@mui/material';
import { withStyles, makeStyles } from '@mui/styles';
import clsx from 'clsx';
import { http } from '../../../../services/remote-api/http.client';
import { map } from 'rxjs/operators';
import type { AxiosError } from 'axios';
import { Image, Edit } from '@mui/icons-material';

const ColorlibConnector = withStyles((theme: any) => ({
    alternativeLabel: {
        top: 22
    },
    active: {
        '& $line': {
            backgroundColor: '#D80E51'
        }
    },
    completed: {
        '& $line': {
            backgroundColor: '#D80E51'
        }
    },
    line: {
        height: 3,
        border: 0,
        backgroundColor: '#eaeaf0',
        borderRadius: 1
    }
}))(StepConnector);

const useColorlibStepIconStyles = makeStyles(() => ({
    iconRoot: {
        backgroundColor: '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    active: {
        backgroundColor: '#D80E51',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        color: '#fff'
    },
    completed: {
        backgroundColor: '#D80E51',
        border: '2px solid #D80E51',
        color: 'rgba(255,255,255,.7)'
    }
}));

function ColorlibStepIcon(props: any) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;

    return (
        <div
            className={clsx(classes.iconRoot, {
                [classes.active]: active,
                [classes.completed]: completed
            })}
        >
            <strong>{props.icon}</strong>
        </div>
    );
}

const steps = ['Basic Details', 'Address & Contact Details'];

const initialForm: {
    brokerCode: string;
    brokerName: string;
    phoneNo: string;
    faxNo: string;
    email: string;
    address1: string;
    country: string;
    city: string;
    policeStation: string;
    panNo: string;
    altPhoneNo: string;
    altFaxNo: string;
    altEmail: string;
    address2: string;
    county: string;
    pinCode: string;
    poBox: string;
    logo: File | null;
    prefix: string;
    firstName: string;
    middleName: string;
    lastName: string;
    contactPhoneNo: string;
    contactMobileNo: string;
    contactEmail: string;
} = {
    brokerCode: '',
    brokerName: '',
    phoneNo: '',
    faxNo: '',
    email: '',
    address1: '',
    country: '',
    city: '',
    policeStation: '',
    panNo: '',
    altPhoneNo: '',
    altFaxNo: '',
    altEmail: '',
    address2: '',
    county: '',
    pinCode: '',
    poBox: '',
    logo: null,
    // Contact Person
    prefix: '',
    firstName: '',
    middleName: '',
    lastName: '',
    contactPhoneNo: '',
    contactMobileNo: '',
    contactEmail: '',
};

const countryOptions = ['India', 'USA', 'UK']; // Example options
const cityOptions = ['Delhi', 'New York', 'London']; // Example options
const prefixOptions = ['Mr', 'Mrs', 'Ms', 'Dr', 'Brig'];

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
});

const useStyles = makeStyles((theme: any) => ({
    root: {
        flexDirection: 'column'
    },
    backButton: {
        marginRight: theme?.spacing ? theme?.spacing(1) : '8px'
    },
    button: {
        marginRight: theme?.spacing ? theme?.spacing(1) : '8px'
    },
    instructions: {
        marginTop: theme?.spacing ? theme?.spacing(1) : '8px',
        marginBottom: theme?.spacing ? theme?.spacing(1) : '8px'
    },
    stepText: {
        '& span': {
            fontSize: '16px'
        }
    },
    uploadBox: {
        width: '100%',
        height: '200px',
        border: '1px dashed #ccc',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        cursor: 'pointer',
        '&:hover': {
            borderColor: '#D80E51',
            backgroundColor: 'rgba(216, 14, 81, 0.05)'
        }
    },
    uploadImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain'
    },
    uploadLabel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        padding: '4px',
        textAlign: 'center'
    }
}));

interface ContactNo {
    contactNo: string;
    contactType: 'PRIMARY' | 'SECONDARY';
}

interface Email {
    emailId: string;
    contactType: 'PRIMARY' | 'SECONDARY';
}

interface Fax {
    faxNo: string;
    faxType: 'PRIMARY' | 'SECONDARY';
}

interface BrokerPayload {
    brokerCode: string;
    brokerName: string;
    panNumber: string;
    policeStation: string;
    poBox: string;
    contactNos: ContactNo[];
    emails: Email[];
    faxs: Fax[];
}

interface ErrorResponse {
    message: string;
}

interface FormErrors {
    brokerCode?: string;
    brokerName?: string;
    panNo?: string;
    phoneNo?: string;
    email?: string;
    address1?: string;
    country?: string;
    city?: string;
    pinCode?: string;
    // Contact person fields
    prefix?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    contactMobileNo?: string;
    contactPhoneNo?: string;
    contactEmail?: string;
}

export default function RegisterBrokerForm() {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [brokerIdState, setBrokerIdState] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode'); // 'create' or 'edit'
    const brokerId = searchParams.get('id'); // ID if in edit mode

    useEffect(() => {
        console.log("useEffect: mode=", mode, "brokerId=", brokerId);
        if (mode === 'edit' && brokerId) {
            setLoading(true);
            http.get<any>(`/reinsurance-query-service/v1/reinsurance-broker/${brokerId}`)
                .pipe(map(response => response.data))
                .subscribe({
                    next: (data) => {
                        console.log("API data fetched:", data);
                        setForm(prev => ({
                            ...prev,
                            brokerCode: data.brokerCode || '',
                            brokerName: data.brokerName || '',
                            panNo: data.panNumber || '',
                            // Primary Phone No
                            phoneNo: data.contactNos?.find((c: any) => c.contactType === 'PRIMARY')?.contactNo || '',
                            // Alternative Phone No
                            altPhoneNo: data.contactNos?.find((c: any) => c.contactType === 'SECONDARY')?.contactNo || '',
                            // Primary Fax No
                            faxNo: data.faxs?.find((f: any) => f.faxType === 'PRIMARY')?.faxNo || '',
                            // Alternative Fax No
                            altFaxNo: data.faxs?.find((f: any) => f.faxType === 'SECONDARY')?.faxNo || '',
                            // Primary Email
                            email: data.emails?.find((e: any) => e.contactType === 'PRIMARY')?.emailId || '',
                            // Alternative Email
                            altEmail: data.emails?.find((e: any) => e.contactType === 'SECONDARY')?.emailId || '',
                            address1: data.address?.address1 || '',
                            address2: data.address?.address2 || '',
                            country: data.address?.country || '',
                            county: data.address?.county || '',
                            city: data.address?.city || '',
                            pinCode: data.address?.pinCode || '',
                            policeStation: data.address?.policeStation || '',
                            poBox: data.address?.poBox || '',
                            prefix: data.contactPerson?.prefix || '',
                            firstName: data.contactPerson?.firstName || '',
                            middleName: data.contactPerson?.middleName || '',
                            lastName: data.contactPerson?.lastName || '',
                            contactPhoneNo: data.contactPerson?.contactPhoneNo || '',
                            contactMobileNo: data.contactPerson?.contactMobileNo || '',
                            contactEmail: data.contactPerson?.contactEmail || '',
                        }));
                        setLoading(false);
                    },
                    error: (err: AxiosError<ErrorResponse>) => {
                        console.error("API fetch error:", err);
                        setError(err.response?.data?.message || 'Failed to fetch broker data.');
                        setLoading(false);
                    }
                });
        } else if (mode === 'create') {
            setForm(initialForm); // Reset form for create mode
        }
    }, [mode, brokerId]);

    const validateStep1 = (): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        // Required fields validation for basic details only
        if (!form.brokerCode?.trim()) {
            newErrors.brokerCode = 'Broker Code is required';
            isValid = false;
        }
        if (!form.brokerName?.trim()) {
            newErrors.brokerName = 'Broker Name is required';
            isValid = false;
        }
        if (!form.panNo?.trim()) {
            newErrors.panNo = 'PAN No is required';
            isValid = false;
        }
        if (!form.phoneNo?.trim()) {
            newErrors.phoneNo = 'Phone No is required';
            isValid = false;
        }
        if (!form.email?.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Invalid email format';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const validateStep2 = (): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        // Required fields validation for address details
        if (!form.address1?.trim()) {
            newErrors.address1 = 'Address Line 1 is required';
            isValid = false;
        }
        if (!form.country?.trim()) {
            newErrors.country = 'Country is required';
            isValid = false;
        }
        if (!form.city?.trim()) {
            newErrors.city = 'City is required';
            isValid = false;
        }
        if (!form.pinCode?.trim()) {
            newErrors.pinCode = 'Pin Code is required';
            isValid = false;
        }

        // Required fields validation for contact person details
        if (!form.prefix?.trim()) {
            newErrors.prefix = 'Prefix is required';
            isValid = false;
        }
        if (!form.firstName?.trim()) {
            newErrors.firstName = 'First Name is required';
            isValid = false;
        }
        if (!form.lastName?.trim()) {
            newErrors.lastName = 'Last Name is required';
            isValid = false;
        }
        if (!form.contactMobileNo?.trim()) {
            newErrors.contactMobileNo = 'Mobile No is required';
            isValid = false;
        }
        if (!form.contactEmail?.trim()) {
            newErrors.contactEmail = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
            newErrors.contactEmail = 'Invalid email format';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'logo') {
            setForm(prev => ({ ...prev, logo: e.target.files?.[0] || null }));
        }
    };

    const handleNext = () => {
        if (activeStep === 0) {
            if (!validateStep1()) {
                return;
            }
            setLoading(true);
            setError(null);

            const payload = {
                brokerCode: form.brokerCode,
                brokerName: form.brokerName,
                panNumber: form.panNo,
                contactNos: [
                    { contactNo: form.phoneNo, contactType: 'PRIMARY' },
                    ...(form.altPhoneNo ? [{ contactNo: form.altPhoneNo, contactType: 'SECONDARY' }] : [])
                ],
                emails: [
                    { emailId: form.email, contactType: 'PRIMARY' },
                    ...(form.altEmail ? [{ emailId: form.altEmail, contactType: 'SECONDARY' }] : [])
                ],
                faxs: [
                    ...(form.faxNo ? [{ faxNo: form.faxNo, faxType: 'PRIMARY' }] : []),
                    ...(form.altFaxNo ? [{ faxNo: form.altFaxNo, faxType: 'SECONDARY' }] : []),
                ],
                policeStation: form.policeStation,
                poBox: form.poBox,
            };

            http.post<Record<string, any>>('/reinsurance-command-service/v1/reinsurance-broker', payload)
                .pipe(map(response => response.data))
                .subscribe({
                    next: (data) => {
                        console.log("Step 1 API response data:", data);
                        const newBrokerId = data.id;
                        console.log("Extracted Broker ID (newBrokerId):", newBrokerId);
                        setBrokerIdState(newBrokerId);
                        setActiveStep(prev => prev + 1);
                        setLoading(false);
                    },
                    error: (err: AxiosError<ErrorResponse>) => {
                        setError(err.response?.data?.message || 'Failed to create broker basic details. Please try again.');
                        setLoading(false);
                    }
                });
            return; // Stop further execution for now
        }

        if (activeStep === 1 && !validateStep2()) {
            return;
        }
        setActiveStep(prev => prev + 1);
    };

    const handleBack = () => setActiveStep(prev => prev - 1);

    const isStepOptional = (step: number) => {
        return false; // No steps are optional for the broker registration form
    };

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const transformFormData = (formData: typeof initialForm): BrokerPayload => {
        const contactNos: ContactNo[] = [];
        const emails: Email[] = [];
        const faxs: Fax[] = [];

        // Add primary contact numbers
        if (formData.phoneNo) {
            contactNos.push({ contactNo: formData.phoneNo, contactType: 'PRIMARY' });
        }
        if (formData.altPhoneNo) {
            contactNos.push({ contactNo: formData.altPhoneNo, contactType: 'SECONDARY' });
        }

        // Add primary emails
        if (formData.email) {
            emails.push({ emailId: formData.email, contactType: 'PRIMARY' });
        }
        if (formData.altEmail) {
            emails.push({ emailId: formData.altEmail, contactType: 'SECONDARY' });
        }

        // Add primary fax numbers
        if (formData.faxNo) {
            faxs.push({ faxNo: formData.faxNo, faxType: 'PRIMARY' });
        }
        if (formData.altFaxNo) {
            faxs.push({ faxNo: formData.altFaxNo, faxType: 'SECONDARY' });
        }

        return {
            brokerCode: formData.brokerCode,
            brokerName: formData.brokerName,
            panNumber: formData.panNo,
            policeStation: formData.policeStation,
            poBox: formData.poBox,
            contactNos,
            emails,
            faxs
        };
    };

    const handleSubmit = () => {
        if (!validateStep2()) {
            return;
        }

        setLoading(true);
        setError(null);

        const payload = {
            brokerAddress: {
                addresses: [
                    {
                        addressDetails: {
                            country: form.country,
                            state: form.county, // Assuming county maps to state for this example
                            city: form.city,
                        },
                        addressType: 'PERMANENT_ADDRESS',
                        id: null, // Placeholder, actual ID will be handled in transform if available
                    }
                ],
                contactPerson: {
                    prefix: form.prefix,
                    firstName: form.firstName,
                    middleName: form.middleName,
                    lastName: form.lastName,
                    emailId: form.contactEmail,
                    mobileNo: form.contactMobileNo,
                    phoneNo: form.contactPhoneNo,
                    alternateEmailId: form.contactEmail, // Assuming alternate email is the same for simplicity
                },
            },
        };

        if (brokerIdState) { // Use brokerIdState for update operation
            http.patch<Record<string, any>>(`/reinsurance-command-service/v1/reinsurance-broker/${brokerIdState}?step=2`, payload)
                .pipe(map(response => response.data))
                .subscribe({
                    next: () => {
                        router.replace('/reinsurance/register-broker?mode=viewList');
                    },
                    error: (err: AxiosError<ErrorResponse>) => {
                        setError(err.response?.data?.message || 'Failed to submit broker data. Please try again.');
                        setLoading(false);
                    },
                    complete: () => {
                        setLoading(false);
                    }
                });
        } else {
            setError('Broker ID not available for update. Please complete Step 1 first.');
            setLoading(false);
        }
    };

    return (
        <Box p={4} sx={{ minHeight: '100vh' }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Stepper activeStep={activeStep} alternativeLabel connector={<ColorlibConnector />} sx={{ mb: 4 }}>
                {steps.map((label, idx) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Card sx={{ p: 4, maxWidth: 1100, mx: 'auto', borderRadius: 1, boxShadow: 1 }}>
                {activeStep === 0 && (
                    <>
                        <Typography variant="h6" mb={4} fontWeight={500}>
                            Broker Basic Details
                        </Typography>
                        <Grid container spacing={6}>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Broker Code"
                                    name="brokerCode"
                                    value={form.brokerCode}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                    error={!!errors.brokerCode}
                                    helperText={errors.brokerCode}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Broker Name"
                                    name="brokerName"
                                    value={form.brokerName}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                    error={!!errors.brokerName}
                                    helperText={errors.brokerName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="PAN No"
                                    name="panNo"
                                    value={form.panNo}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                    error={!!errors.panNo}
                                    helperText={errors.panNo}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Phone No"
                                    name="phoneNo"
                                    value={form.phoneNo}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                    error={!!errors.phoneNo}
                                    helperText={errors.phoneNo}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Alternative Phone No"
                                    name="altPhoneNo"
                                    value={form.altPhoneNo}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Fax No"
                                    name="faxNo"
                                    value={form.faxNo}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Email ID"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                    error={!!errors.email}
                                    helperText={errors.email}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Alternate Email Address"
                                    name="altEmail"
                                    value={form.altEmail}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600, color: 'gray' }}>
                                        Logo
                                    </Typography>
                                    <Box
                                        className={classes.uploadBox}
                                        onClick={() => (document.querySelector('input[name="logo"]') as HTMLInputElement)?.click()}
                                    >
                                        {form.logo ? (
                                            <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                                                <img
                                                    src={URL.createObjectURL(form.logo)}
                                                    alt="Logo"
                                                    className={classes.uploadImage}
                                                />
                                                <Box className={classes.uploadLabel}>
                                                    <Typography variant="body2">Current Logo</Typography>
                                                </Box>
                                            </Box>
                                        ) : (
                                            <>
                                                <Image sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                                                <Typography variant="body2" color="textSecondary">
                                                    Click to upload logo
                                                </Typography>
                                            </>
                                        )}
                                        <Button
                                            component="label"
                                            variant="outlined"
                                            startIcon={<Edit />}
                                            sx={{
                                                position: 'absolute',
                                                bottom: 8,
                                                right: 8,
                                                minWidth: 'auto',
                                                padding: '4px 8px'
                                            }}
                                        >
                                            <VisuallyHiddenInput
                                                type="file"
                                                name="logo"
                                                accept=".jpg, .jpeg, .png"
                                                onChange={handleFileChange}
                                            />
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                        <Box display="flex" justifyContent="flex-end" mt={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNext}
                                disabled={loading}
                                sx={{ minWidth: 140, fontWeight: 600, fontSize: 16, background: '#D80E51', '&:hover': { background: '#b80c43' } }}
                            >
                                {loading && activeStep === 0 ? <CircularProgress size={24} color="inherit" /> : 'Next'}
                            </Button>
                        </Box>
                    </>
                )}
                {activeStep === 1 && (
                    <>
                        <Typography variant="h6" mb={4} fontWeight={500}>
                            Address Details
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Address Line 1"
                                    name="address1"
                                    value={form.address1}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                    error={!!errors.address1}
                                    helperText={errors.address1}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Address Line 2"
                                    name="address2"
                                    value={form.address2}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    select
                                    label="Country"
                                    name="country"
                                    value={form.country}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                    error={!!errors.country}
                                    helperText={errors.country}
                                >
                                    {countryOptions.map(opt => (
                                        <MenuItem key={opt} value={opt}>
                                            {opt}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    select
                                    label="County"
                                    name="county"
                                    value={form.county}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                >
                                    {countryOptions.map(opt => (
                                        <MenuItem key={opt} value={opt}>
                                            {opt}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    select
                                    label="City"
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                    error={!!errors.city}
                                    helperText={errors.city}
                                >
                                    {cityOptions.map(opt => (
                                        <MenuItem key={opt} value={opt}>
                                            {opt}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Pin Code"
                                    name="pinCode"
                                    value={form.pinCode}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                    error={!!errors.pinCode}
                                    helperText={errors.pinCode}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Police Station"
                                    name="policeStation"
                                    value={form.policeStation}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="PO Box"
                                    name="poBox"
                                    value={form.poBox}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                        </Grid>

                        <Typography variant="h6" mb={4} mt={6} fontWeight={500}>
                            Contact Person Details
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={2}>
                                <TextField
                                    select
                                    label="Prefix"
                                    name="prefix"
                                    value={form.prefix}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                    error={!!errors.prefix}
                                    helperText={errors.prefix}
                                >
                                    {prefixOptions.map(opt => (
                                        <MenuItem key={opt} value={opt}>
                                            {opt}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    label="First Name"
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                    error={!!errors.firstName}
                                    helperText={errors.firstName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <TextField
                                    label="Middle Name"
                                    name="middleName"
                                    value={form.middleName}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                    error={!!errors.middleName}
                                    helperText={errors.middleName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    label="Last Name"
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                    error={!!errors.lastName}
                                    helperText={errors.lastName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <TextField
                                    label="Mobile No"
                                    name="contactMobileNo"
                                    value={form.contactMobileNo}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                    error={!!errors.contactMobileNo}
                                    helperText={errors.contactMobileNo}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    label="Phone No"
                                    name="contactPhoneNo"
                                    value={form.contactPhoneNo}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                    error={!!errors.contactPhoneNo}
                                    helperText={errors.contactPhoneNo}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Email ID"
                                    name="contactEmail"
                                    value={form.contactEmail}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                    error={!!errors.contactEmail}
                                    helperText={errors.contactEmail}
                                />
                            </Grid>
                        </Grid>
                        <Box display="flex" justifyContent="flex-end" gap={2} mt={6}>
                            <Button
                                variant="outlined"
                                onClick={handleBack}
                                disabled={loading}
                                sx={{ minWidth: 120, fontWeight: 600, fontSize: 16 }}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={loading}
                                sx={{
                                    minWidth: 120,
                                    fontWeight: 600,
                                    fontSize: 16,
                                    background: '#D80E51',
                                    '&:hover': { background: '#b80c43' }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
                            </Button>
                        </Box>
                    </>
                )}
            </Card>
        </Box>
    );
} 
