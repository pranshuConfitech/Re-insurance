import React, { useEffect, useState } from 'react';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { PreAuthService } from '@/services/remote-api/api/claims-services';
import SummaryCards from '../../shared-component/components/SummaryCards';

const preAuthService = new PreAuthService();

const PreAuthSummaryCards = () => {
    const [counts, setCounts] = useState({
        total: 0,
        approved: 0,
        rejected: 0,
        requested: 0,
        cancelled: 0,
    });

    useEffect(() => {
        const subscription = preAuthService.getDashboardCount().subscribe((result: any) => {
            if (result?.data) {
                setCounts(result.data);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    const items = [
        { color: '#313C96', icon: <AccountBalanceWalletOutlinedIcon />, label: 'Total', value: counts.total },
        { color: '#01de74', icon: <ThumbUpAltOutlinedIcon />, label: 'Approved', value: counts.approved },
        { color: '#dc3444', icon: <ThumbDownAltOutlinedIcon />, label: 'Rejected', value: counts.rejected },
        { color: '#043b5c', icon: <RateReviewIcon />, label: 'Requested', value: counts.requested },
        { color: '#953037', icon: <CancelOutlinedIcon />, label: 'Cancelled', value: counts.cancelled },
    ];

    return <SummaryCards items={items} />;
};

export default PreAuthSummaryCards;

