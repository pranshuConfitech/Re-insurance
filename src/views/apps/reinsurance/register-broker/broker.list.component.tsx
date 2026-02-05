import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FettleDataGrid } from '@/views/apps/shared-component/components/fettle.data.grid';
import { map } from 'rxjs/operators';
import { Button } from '@mui/material';
import { ReinsuranceService } from '@/services/remote-api/api/reinsurance-services/reinsurance.service';

const reinsuranceService = new ReinsuranceService();

export default function BrokerListComponent() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const getColumns = () => [
        { field: 'slNo', headerName: 'SL NO.' },
        { field: 'brokerName', headerName: 'BROKER NAME' },
        { field: 'brokerCode', headerName: 'BROKER CODE' },
        {
            field: 'phoneNo',
            headerName: 'PHONE NO',
            valueGetter: (params: any) => {
                console.log('Row data for phone:', params.row);
                if (!params.row.contactNos || !Array.isArray(params.row.contactNos)) {
                    console.log('No contactNos array found');
                    return '-';
                }
                const primaryContact = params.row.contactNos[0]; // Since we know it's always the first one
                console.log('Primary contact:', primaryContact);
                return primaryContact ? primaryContact.contactNo : '-';
            }
        },
        {
            field: 'email',
            headerName: 'E-MAIL',
            valueGetter: (params: any) => {
                console.log('Row data for email:', params.row);
                if (!params.row.emails || !Array.isArray(params.row.emails)) {
                    console.log('No emails array found');
                    return '-';
                }
                const primaryEmail = params.row.emails[0]; // Since we know it's always the first one
                console.log('Primary email:', primaryEmail);
                return primaryEmail ? primaryEmail.emailId : '-';
            }
        },
        {
            field: 'edit',
            headerName: '',
            width: 100,
            renderCell: (params: any) => (
                <Button
                    variant="contained"
                    size="small"
                    style={{ background: '#D80E51', color: '#fff', fontWeight: 600 }}
                    onClick={() => router.push(`/reinsurance/register-broker?mode=edit&id=${params.row.id}`)}
                >
                    EDIT
                </Button>
            )
        }
    ];

    const config = {
        header: {
            enable: true,
            addCreateButton: true,
            onCreateButtonClick: () => router.push('/reinsurance/register-broker?mode=create'),
            text: 'Register Broker',
            enableGlobalSearch: true,
            searchText: 'Search by Name, Code, Contact Person...'
        },
        actionButtons: [],
        pageSize: 10,
        paginator: true,
        paginationMode: 'server',
    };

    const $datasource = (params?: any) => {
        setError(null);

        // Use the consolidated reinsurance service
        const serviceParams = {
            page: params?.page || 0,
            size: params?.pageSize || 10,
            summary: true,
            active: true,
            searchKey: params?.search || ''
        };

        return reinsuranceService.getBrokers(serviceParams)
            .pipe(
                map(response => {
                    // Transform the response to match the grid's expected format
                    const content = response.content.map((item, index) => ({
                        ...item,
                        slNo: (params?.page || 0) * (params?.pageSize || 10) + index + 1,
                        phoneNo: item.contactNos?.[0]?.contactNo || '-',
                        email: item.emails?.[0]?.emailId || '-'
                    }));

                    return {
                        content,
                        totalElements: response.totalElements,
                        totalPages: response.totalPages,
                        size: response.size,
                        number: response.number
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
