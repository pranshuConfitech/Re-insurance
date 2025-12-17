import * as React from 'react';
import { Card, CardContent, Typography, Grid, Chip, Box, Divider } from '@mui/material';
import {
    Business as BusinessIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    Category as CategoryIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';

export default function ProviderTimelineComponent(props: any) {
    const { provider } = props;

    if (!provider) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography variant="h6" color="textSecondary">
                    No provider data available
                </Typography>
            </Box>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'approved':
                return 'success';
            case 'inactive':
                return 'default';
            case 'blacklisted':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'approved':
                return <CheckCircleIcon color="success" />;
            case 'blacklisted':
                return <CancelIcon color="error" />;
            default:
                return <CheckCircleIcon color="disabled" />;
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            {/* Provider Basic Information */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon color="primary" />
                        Provider Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    Provider Name
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {provider?.providerBasicDetails?.name || provider?.name || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    Provider Code
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {provider?.providerBasicDetails?.code || provider?.code || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    Provider Type
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {provider?.providerType?.name || provider?.providerTypeName || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    Status
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {getStatusIcon(provider?.status || 'active')}
                                    <Chip
                                        label={provider?.status || 'Active'}
                                        color={getStatusColor(provider?.status || 'active')}
                                        size="small"
                                    />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Contact Information */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon color="primary" />
                        Contact Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    Primary Contact
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {provider?.providerBasicDetails?.primaryContact || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    Email
                                </Typography>
                                <Typography variant="body1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EmailIcon fontSize="small" color="action" />
                                    {provider?.providerBasicDetails?.emails?.[0]?.emailId ||
                                        provider?.providerBasicDetails?.primaryEmail ||
                                        provider?.providerBasicDetails?.email || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Category and Additional Information */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CategoryIcon color="primary" />
                        Category & Additional Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    Category
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {provider?.category ||
                                        provider?.providerCategoryHistorys?.[0]?.categoryName || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    Blacklisted
                                </Typography>
                                <Chip
                                    label={provider?.blacklist === 'Yes' || provider?.blackListed ? 'Yes' : 'No'}
                                    color={provider?.blacklist === 'Yes' || provider?.blackListed ? 'error' : 'success'}
                                    size="small"
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Provider History/Timeline */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Provider History
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                        {provider?.providerCategoryHistorys && provider.providerCategoryHistorys.length > 0 ? (
                            provider.providerCategoryHistorys.map((history: any, index: number) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="subtitle2" fontWeight="medium">
                                            {history.categoryName || 'Category Change'}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {history.createdAt ? new Date(history.createdAt).toLocaleDateString() : 'N/A'}
                                        </Typography>
                                    </Box>
                                    {index < provider.providerCategoryHistorys.length - 1 && <Divider />}
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                No history available for this provider.
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

