"use client";
import { use } from 'react';
import TreatyConfig4CreateComponent from '@/views/apps/reinsurance/treaty-config-4/treaty-config-4-create.component';

interface EditPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function TreatyConfig4EditPage({ params }: EditPageProps) {
    const { id } = use(params);
    console.log('Edit page loaded with ID:', id);
    return <TreatyConfig4CreateComponent editId={id} />;
}
