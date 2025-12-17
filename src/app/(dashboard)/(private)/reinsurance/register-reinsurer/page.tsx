'use client'

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Grid from '@mui/material/Grid';
import ReinsurerListComponent from '@/views/apps/reinsurance/register-reinsurer/reinsurer.list.component';
import RegisterReinsurerForm from '@/views/apps/reinsurance/register-reinsurer/register-reinsurer.form';

export default function RegisterReinsurerManagementComponent() {
    const query = useSearchParams();
    const router = useRouter();

    React.useEffect(() => {
        if (!query.get('mode')) {
            router.replace('/reinsurance/register-reinsurer?mode=viewList');
        }
    }, [query, router]);

    return (
        <div>
            {query.get('mode') === 'create' ? (
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px', height: '2em', color: 'inherit', fontSize: '18px' }}>
                    <span style={{ fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        Register Re-insurer
                    </span>
                </Grid>
            ) : null}

            {(() => {
                switch (query.get('mode')) {
                    case 'viewList':
                        return <ReinsurerListComponent />;
                    case 'create':
                        return <RegisterReinsurerForm />;
                    case 'edit':
                        return <RegisterReinsurerForm />;
                    default:
                        return null;
                }
            })()}
        </div>
    );
} 
