import * as React from "react";
import { Button } from 'primereact/button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Fade from '@mui/material/Fade';
import Skeleton from '@mui/material/Skeleton';
import { AgentsService } from "@/services/remote-api/fettle-remote-api";

const agentsService = new AgentsService()

// Enhanced status color mapping - FIXED VERSION
const getStatusConfig = (status: string) => {
    const configs = {
        'APPROVED': {
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            bgColor: '#ecfdf5',
            borderColor: '#a7f3d0',
            icon: 'pi pi-check-circle',
            label: 'Approved'
        },
        'EVALUATION_IN_PROGRESS': {
            color: '#3b82f6',
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            bgColor: '#eff6ff',
            borderColor: '#bfdbfe',
            icon: 'pi pi-cog pi-spin',
            label: 'Evaluation in Progress'
        },
        'PENDING_APPROVAL': {
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            bgColor: '#fffbeb',
            borderColor: '#fed7aa',
            icon: 'pi pi-clock',
            label: 'Pending Approval'
        },
        'REQUESTED_FOR_EVALUATION': {
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            bgColor: '#f5f3ff',
            borderColor: '#ddd6fe',
            icon: 'pi pi-eye',
            label: 'Requested for Evaluation'
        },
        'REJECTED': {
            color: '#ef4444',
            gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            bgColor: '#fef2f2',
            borderColor: '#fecaca',
            icon: 'pi pi-times-circle',
            label: 'Rejected'
        },
        'PENDING_ACTION_FROM_APPLICANT': {
            color: '#f97316',
            gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            bgColor: '#fff7ed',
            borderColor: '#fed7aa',
            icon: 'pi pi-exclamation-triangle',
            label: 'Pending Action from Applicant'
        },
        'DRAFT': {
            color: '#6b7280',
            gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            bgColor: '#f9fafb',
            borderColor: '#d1d5db',
            icon: 'pi pi-file-edit',
            label: 'Draft'
        }
    };

    return configs[status as keyof typeof configs] || {
        color: '#6366f1',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        bgColor: '#f0f9ff',
        borderColor: '#bfdbfe',
        icon: 'pi pi-info-circle',
        label: status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (letter: string) => letter.toUpperCase())
    };
};

// Helper function to format created by
const formatCreatedBy = (createdBy: string): string => {
    if (createdBy === 'ANONYMOUS') return 'System';
    return createdBy
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
};

export default function AgentTimelineModal(props: any) {
    const [timeline, setTimeline] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (props.agentId && props.openAgentTimelineModal) {
            populateData();
        }
    }, [props.agentId, props.openAgentTimelineModal]);

    const populateData = () => {
        setLoading(true);
        agentsService.getAgentApprovalTimeline(props.agentId).subscribe({
            next: (res: any) => {
                const sortedData = res.sort((a: any, b: any) => b.dateTime - a.dateTime);
                setTimeline(sortedData);
                setLoading(false);
            },
            error: (error: any) => {
                console.error('Error fetching timeline:', error);
                setTimeline([]);
                setLoading(false);
            }
        });
    };

    const handleClose = () => {
        setTimeline([]);
        props.closeTimelineModal();
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        });
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatFullDateTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <Dialog
            open={props.openAgentTimelineModal}
            onClose={handleClose}
            aria-labelledby="timeline-dialog-title"
            disableEnforceFocus
            maxWidth="md"
            fullWidth
            TransitionComponent={Fade}
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                    background: 'white',
                    margin: '24px',
                    width: 'calc(100% - 48px)',
                    maxWidth: '700px',
                    maxHeight: '80vh'
                }
            }}
        >
            <DialogTitle
                id="timeline-dialog-title"
                sx={{
                    background: '#a8334a', // Lighter burgundy to better match agent sidebar
                    color: '#ffffff', // White text
                    borderRadius: '12px 12px 0 0',
                    py: 2,
                    px: 3,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <Box>
                        <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 0.5, color: '#ffffff' }}>
                            Timeline
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 1, fontSize: '0.875rem', color: '#ffffff' }}>
                            Track the complete history and status changes
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>



            <DialogContent sx={{ p: 0, maxHeight: 'calc(80vh - 160px)', overflow: 'hidden' }}>
                <Box sx={{ px: 3, py: 2, height: '100%', overflowY: 'auto' }}>
                    {loading ? (
                        <Box>
                            {[...Array(2)].map((_, index) => (
                                <Box key={index} sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <Skeleton variant="circular" width={48} height={48} />
                                    <Box sx={{ flex: 1 }}>
                                        <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
                                        <Skeleton variant="rectangular" width="50%" height={24} sx={{ mb: 1, borderRadius: 1 }} />
                                        <Skeleton variant="text" width="70%" height={16} />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ) : timeline.length === 0 ? (
                        <Box display="flex" flexDirection="column" alignItems="center" py={4}>
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2
                                }}
                            >
                                <i className="pi pi-info-circle" style={{ fontSize: '32px', color: '#64748b' }}></i>
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#334155', mb: 1 }}>
                                No Timeline Data Available
                            </Typography>
                            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 300 }}>
                                This agent doesn't have any approval timeline information yet.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ position: 'relative', py: 1 }}>
                            {/* Timeline connector */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: '24px',
                                    top: '50px',
                                    bottom: '20px',
                                    width: '2px',
                                    background: 'linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 100%)',
                                    borderRadius: '1px',
                                    zIndex: 0
                                }}
                            />

                            {timeline.map((item: any, index: number) => {
                                const statusConfig = getStatusConfig(item.status);

                                return (
                                    <Fade in={true} timeout={300 + (index * 100)} key={index}>
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                mb: index < timeline.length - 1 ? 3 : 1,
                                                zIndex: 1
                                            }}
                                        >
                                            {/* Timeline icon */}
                                            <Box
                                                sx={{
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '12px',
                                                    background: statusConfig.gradient,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    boxShadow: `0 4px 16px ${statusConfig.color}40, 0 0 0 3px white, 0 0 0 4px ${statusConfig.color}20`,
                                                    zIndex: 2,
                                                    flexShrink: 0
                                                }}
                                            >
                                                <i className={statusConfig.icon} style={{ fontSize: '16px' }}></i>
                                            </Box>

                                            {/* Timeline content */}
                                            <Box
                                                sx={{
                                                    ml: 2.5,
                                                    flex: 1,
                                                    minWidth: 0,
                                                    background: 'white',
                                                    borderRadius: '12px',
                                                    padding: '16px',
                                                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                                                    border: `1px solid ${statusConfig.borderColor}`,
                                                    position: 'relative'
                                                }}
                                            >
                                                {/* Status and date/time header - SWAPPED POSITIONS */}
                                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                                                    <Chip
                                                        label={statusConfig.label}
                                                        size="small"
                                                        sx={{
                                                            background: statusConfig.gradient,
                                                            color: 'white',
                                                            fontWeight: 600,
                                                            fontSize: '0.75rem',
                                                            height: '24px'
                                                        }}
                                                    />
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Typography
                                                            variant="subtitle2"
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: statusConfig.color,
                                                                fontSize: '0.875rem'
                                                            }}
                                                        >
                                                            {formatDate(item.dateTime)}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: '#64748b',
                                                                fontSize: '0.75rem'
                                                            }}
                                                        >
                                                            {formatTime(item.dateTime)}
                                                        </Typography>
                                                    </Box>
                                                </Box>


                                                {/* Status chip */}
                                                {/* <Box mb={item.comment ? 1.5 : 1}>
                                                    <Chip
                                                        label={statusConfig.label}
                                                        size="small"
                                                        sx={{
                                                            background: statusConfig.gradient,
                                                            color: 'white',
                                                            fontWeight: 600,
                                                            fontSize: '0.75rem',
                                                            height: '24px'
                                                        }}
                                                    />
                                                </Box> */}

                                                {/* Comment section - FIXED */}
                                                {item.comment && (
                                                    <Box
                                                        sx={{
                                                            background: `linear-gradient(135deg, ${statusConfig.bgColor} 0%, white 100%)`,
                                                            border: `1px solid ${statusConfig.borderColor}`,
                                                            borderRadius: '8px',
                                                            p: 2,
                                                            mb: 1.5
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: '#374151',
                                                                fontSize: '0.875rem',
                                                                fontStyle: 'italic'
                                                            }}
                                                        >
                                                            {item.comment}
                                                        </Typography>
                                                    </Box>
                                                )}

                                                {/* User attribution */}
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Avatar
                                                        sx={{
                                                            width: 20,
                                                            height: 20,
                                                            background: statusConfig.color,
                                                            fontSize: '0.625rem'
                                                        }}
                                                    >
                                                        {formatCreatedBy(item.createdBy).charAt(0)}
                                                    </Avatar>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: '#64748b',
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        by {formatCreatedBy(item.createdBy)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Fade>
                                );
                            })}
                        </Box>
                    )}
                </Box>
            </DialogContent>



            <DialogActions
                sx={{
                    px: 3,
                    pt: 4,
                    pb: 3,
                    background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                    // borderTop: '1px solid #e2e8f0',
                    borderRadius: '0 0 12px 12px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    position: 'relative',
                    mt: 2// Use Material-UI spacing instead of marginTop
                }}
            >
                <Button
                    label="Close"
                    icon="pi pi-times"
                    onClick={handleClose}
                    className="p-button-rounded p-button-outlined" // Add PrimeReact classes for better styling
                    style={{
                        minWidth: '120px',
                        height: '40px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        borderRadius: '6px',
                        background: '#a8334a',
                        border: 'none',
                        color: 'white',
                        boxShadow: '0 2px 8px rgba(168, 51, 74, 0.2)',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        gap: '8px', // Space between icon and text
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 16px'
                    }}
                    iconPos="left" // Ensure icon is on the left
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(168, 51, 74, 0.3)'
                        e.currentTarget.style.background = '#b83d52'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(168, 51, 74, 0.2)'
                        e.currentTarget.style.background = '#a8334a'
                    }}
                />
            </DialogActions>






        </Dialog>
    );
}
