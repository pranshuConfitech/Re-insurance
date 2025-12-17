"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Grid from '@mui/material/Grid';
import ReinstateTreatyListComponent from '@/views/apps/reinsurance/reinstate-treaty/reinstate-treaty.list.component';
import ReinstateTreatyFormComponent from '@/views/apps/reinsurance/reinstate-treaty/reinstate-treaty.form.component';

export default function ReinstateTreatyManagementComponent() {
    const query = useSearchParams();
    const router = useRouter();

    React.useEffect(() => {
        if (!query.get('mode')) {
            router.replace('/reinsurance/reinstate-treaty?mode=viewList');
        }
    }, [query, router]);

    return (
        <div>
            {/* Optional: Add a header based on the mode if needed */}
            {query.get('mode') === 'create' ? (
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px', height: '2em', color: 'inherit', fontSize: '18px' }}>
                    <span style={{ fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        Register Reinstate Treaty
                    </span>
                </Grid>
            ) : null}

            {(() => {
                switch (query.get('mode')) {
                    case 'viewList':
                        return <ReinstateTreatyListComponent />;
                    case 'create':
                        return <ReinstateTreatyFormComponent />;
                    default:
                        return null; // Or a 404 component
                }
            })()}
        </div>
    );
} 
