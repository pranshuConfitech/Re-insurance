'use client';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SurplusParticipantListComponent from '@/views/apps/reinsurance/surplus-participant/surplus-participant.list.component';
import SurplusParticipantFormComponent from '@/views/apps/reinsurance/surplus-participant/surplus-participant.form.component';

export default function SurplusParticipantPage() {
    const router = useRouter();
    const query = useSearchParams();

    React.useEffect(() => {
        if (!query.get('mode')) {
            router.replace('/reinsurance/surplus-participant?mode=viewList');
        }
    }, [query, router]);

    const mode = query.get('mode');

    if (mode === 'create' || mode === 'edit') {
        return <SurplusParticipantFormComponent />;
    }

    return <SurplusParticipantListComponent />;
}
