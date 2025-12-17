import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FettleDataGrid } from '@/views/apps/shared-component/components/fettle.data.grid';
import { http } from '../../../../services/remote-api/http.client';
import { map } from 'rxjs/operators';
import { Button, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface ContactNo {
    id: string | null;
    contactNo: string;
    contactType: 'PRIMARY' | 'SECONDARY';
}

interface Email {
    id: string | null;
    emailId: string;
    contactType: 'PRIMARY' | 'SECONDARY';
}

interface ReinsurerData {
    id: string;
    reinsurerCode: string;
    reinsurerName: string;
    panNumber: string;
    createdBy: string;
    policeStation: string;
    poBox: string;
    logoFormat: string | null;
    contactNos: ContactNo[];
    emails: Email[];
    faxs: any[];
    logo: string | null;
    contactPerson: string | null;
}

interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: any[];
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
    sort: any[];
}

export default function ReinsurerListComponent() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const openEditSection = (reinsurer: ReinsurerData) => {
        if (!reinsurer || !reinsurer.id) {
            console.error("Attempted to open edit section with invalid reinsurer data:", reinsurer);
            return;
        }
        const reinsurerDataEncoded = encodeURIComponent(JSON.stringify(reinsurer));
        router.push(`/reinsurance/register-reinsurer?mode=edit&id=${reinsurer.id}&reinsurerData=${reinsurerDataEncoded}`);
    };

    const getColumns = () => [
        {
            field: 'slNo',
            headerName: 'SL NO.',
            width: 80,
            flex: 0
        },
        {
            field: 'reinsurerName',
            headerName: 'RE-INSURER NAME',
            flex: 1,
            minWidth: 200
        },
        {
            field: 'reinsurerCode',
            headerName: 'RE-INSURER CODE',
            flex: 1,
            minWidth: 150
        },
        {
            field: 'phoneNo',
            headerName: 'PHONE NO',
            flex: 1,
            minWidth: 150,
            valueGetter: (params: any) => {
                if (!params.row.contactNos || !Array.isArray(params.row.contactNos)) {
                    return '-';
                }
                const primaryContact = params.row.contactNos[0];
                return primaryContact ? primaryContact.contactNo : '-';
            }
        },
        {
            field: 'email',
            headerName: 'E-MAIL',
            flex: 1,
            minWidth: 200,
            valueGetter: (params: any) => {
                if (!params.row.emails || !Array.isArray(params.row.emails)) {
                    return '-';
                }
                const primaryEmail = params.row.emails[0];
                return primaryEmail ? primaryEmail.emailId : '-';
            }
        }
    ];

    const config = {
        header: {
            enable: true,
            addCreateButton: true,
            onCreateButtonClick: () => router.push('/reinsurance/register-reinsurer?mode=create'),
            text: 'Register Re-insurer',
            enableGlobalSearch: true,
            searchText: 'Search by Name, Code, Contact Person...'
        },
        actionButtons: [
            {
                icon: <EditIcon />,
                tooltip: 'Edit',
                className: 'ui-button-warning',
                onClick: (params: any) => {
                    console.log("Full params object in reinsurer.list.component.tsx onClick:", params);
                    console.log("Passing ID to openEditSection:", params.id);
                    openEditSection(params.row);
                },
            },
        ],
        pageSize: 10,
        paginator: true,
        paginationMode: 'server',
        autoHeight: true,
        disableColumnMenu: true,
        disableColumnFilter: true,
        disableColumnSelector: true,
        disableDensitySelector: true
    };

    const $datasource = (params?: any) => {
        setError(null);

        // Construct query parameters
        const queryParams = new URLSearchParams({
            page: params?.page || '0',
            size: params?.pageSize || '10',
            summary: 'true',
            active: 'true'
        });

        // Add search parameter if provided
        if (params?.search) {
            queryParams.append('search', params.search);
        }

        return http.get<PageResponse<ReinsurerData>>(`/reinsurance-query-service/v1/reinsurance?${queryParams.toString()}`)
            .pipe(
                map(response => {
                    // Transform the response to match the grid's expected format
                    const content = response.data.content.map((item, index) => ({
                        ...item,
                        slNo: (params?.page || 0) * (params?.pageSize || 10) + index + 1,
                        phoneNo: item.contactNos?.[0]?.contactNo || '-',
                        email: item.emails?.[0]?.emailId || '-'
                    }));

                    return {
                        content,
                        totalElements: response.data.totalElements,
                        totalPages: response.data.totalPages,
                        size: response.data.size,
                        number: response.data.number
                    };
                })
            );
    };

    return (
        <div style={{ padding: 24, width: '100%' }}>
            {error && (
                <div style={{ color: 'red', marginBottom: 16 }}>
                    {error}
                </div>
            )}
            <div style={{ width: '100%' }}>
                <FettleDataGrid
                    $datasource={$datasource}
                    config={config}
                    columnsdefination={getColumns()}
                />
            </div>
        </div>
    );
}
