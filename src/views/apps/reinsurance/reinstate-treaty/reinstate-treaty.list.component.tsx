import React from 'react';
import { FettleDataGrid } from '@/views/apps/shared-component/components/fettle.data.grid';
import { of } from 'rxjs'; // Import 'of' from 'rxjs'

// Define column definitions based on the image
const columnsDefinations = [
    { field: 'slNo', headerName: 'Sno' },
    { field: 'configName', headerName: 'config name.' },
    { field: 'treatyName', headerName: 'Treaty name.' },
    { field: 'validityPeriod', headerName: 'Validity period.' },
    { field: 'annualAggregateLimit', headerName: 'Annual aggregate limit.' },
    { field: 'reinstate', headerName: 'Reinstate' },
    { field: 'maxNumber', headerName: 'max number' },
    { field: 'reinstatePercentage', headerName: 'reinstate percentage.' },
    { field: 'remainingNumber', headerName: 'Remaining number' },
];

// Dummy data based on the image
const dummyReinstateTreatyData = [
    {
        id: 1, // Unique ID
        slNo: 1,
        configName: 'HIK_XOL_2025',
        treatyName: 'EXCESS OF LOSS(PER RISK).',
        validityPeriod: '25 FEB, 25 - 26 FEB,25.',
        annualAggregateLimit: '10000000.00',
        reinstate: 'YES',
        maxNumber: 3,
        reinstatePercentage: 10.0,
        remainingNumber: 3,
    },
];

export default function ReinstateTreatyListComponent() {

    const config = {
        header: {
            enable: true,
            text: 'Reinstate Treaty List', // Header text for the table
            enableGlobalSearch: true,
            searchText: 'Search...'
        },
        actionButtons: [], // Add action buttons if needed
        pageSize: 10,
        paginator: true,
        paginationMode: 'client', // Client-side pagination
        rowCount: dummyReinstateTreatyData.length, // Total row count
    };

    // Datasource function to return the dummy data
    const $datasource = (params?: any) => {
        console.log('$datasource function called with params:', params);
        // Return an observable of the dummy data wrapped in a Page structure
        return of({
            content: dummyReinstateTreatyData,
            totalElements: dummyReinstateTreatyData.length,
            // Add other necessary Page properties if required by FettleDataGrid
        });
    };

    return (
        <div style={{ padding: 24 }}>
            <FettleDataGrid $datasource={$datasource} config={config} columnsdefination={columnsDefinations} />
        </div>
    );
} 
