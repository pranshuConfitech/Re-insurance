"use client"

import { useSearchParams } from 'next/navigation';
import ProviderDetails from "@/views/apps/provider-service/providers/provider.details.component";
import ProviderViewPage from "@/views/apps/provider-service/providers/provider.view.page";

const ProviderId = ({ params }: { params: any }) => {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');

    // If mode is 'view', show the view page, otherwise show the details component
    if (mode === 'view') {
        return <ProviderViewPage />;
    }

    return <ProviderDetails />;
}

export default ProviderId;
