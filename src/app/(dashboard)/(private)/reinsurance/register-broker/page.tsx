'use client'

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Grid from '@mui/material/Grid';
import BrokerListComponent from '@/views/apps/reinsurance/register-broker/broker.list.component';
import RegisterBrokerForm from '@/views/apps/reinsurance/register-broker/register-broker.form';

export default function RegisterBrokerManagementComponent() {
    const query = useSearchParams();
    const router = useRouter();

    React.useEffect(() => {
        if (!query.get('mode')) {
            router.replace('/reinsurance/register-broker?mode=viewList');
        }
    }, [query, router]);

    return (
        <div>
            {query.get('mode') === 'create' ? (
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px', height: '2em', color: 'inherit', fontSize: '18px' }}>
                    <span style={{ fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        Register Re-insurer Broker
                    </span>
                </Grid>
            ) : null}

            {(() => {
                switch (query.get('mode')) {
                    case 'viewList':
                        return <BrokerListComponent />;
                    case 'create':
                        return <RegisterBrokerForm />;
                    default:
                        return null;
                }
            })()}
        </div>
    );
} 
