"use client";
import { use } from 'react';
import TreatyConfig4ViewComponent from '@/views/apps/reinsurance/treaty-config-4/treaty-config-4-view.component';

type Props = {
    params: Promise<{ id: string }>;
};

export default function TreatyConfig4ViewPage({ params }: Props) {
    const { id } = use(params);
    return <TreatyConfig4ViewComponent viewId={id} />;
}
