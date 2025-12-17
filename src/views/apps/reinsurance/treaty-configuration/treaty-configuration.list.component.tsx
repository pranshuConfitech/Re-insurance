'use client';
import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FettleDataGrid } from '@/views/apps/shared-component/components/fettle.data.grid';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { map, Observable } from 'rxjs';
import { ReinsuranceService } from '@/services/remote-api/api/reinsurance-services/reinsurance.service';
import { TreatyTypeService } from '@/services/remote-api/api/master-services/treaty.type.service';

const reinsuranceService = new ReinsuranceService();
const treatyTypeService = new TreatyTypeService();

export default function TreatyConfigurationListComponent() {
    const router = useRouter();
    const [reloadTable, setReloadTable] = React.useState(false);
    const [treatyTypesLoaded, setTreatyTypesLoaded] = React.useState(false);
    const isMountedRef = React.useRef(true);
    const treatyTypesMapRef = React.useRef<Map<number, string>>(new Map());
    const isLoadingRef = React.useRef(false);
    const lastRequestRef = React.useRef<string>('');

    // Fetch treaty types on mount
    useEffect(() => {
        isMountedRef.current = true;

        const subscription = treatyTypeService.getAllTreatyTypes({ page: 0, size: 100, summary: true, active: true }).subscribe({
            next: (response: any) => {
                if (!isMountedRef.current) return; // Prevent state update if unmounted
                const typesMap = new Map<number, string>();
                const content = response?.content || [];
                content.forEach((type: any) => {
                    typesMap.set(type.id, type.tretyType);
                });
                treatyTypesMapRef.current = typesMap;
                setTreatyTypesLoaded(true);
                // Trigger reload after types are loaded so grid can fetch with treaty types available
                setReloadTable(prev => !prev);
            },
            error: (error) => {
                if (!isMountedRef.current) return; // Prevent state update if unmounted
                console.error('Error fetching treaty types:', error);
            }
        });

        return () => {
            isMountedRef.current = false;
            subscription.unsubscribe();
        };
    }, []);

    const handleOpen = () => {
        router.push('/reinsurance/treaty-configuration?mode=create');
    };

    const openEditSection = (row: any) => {
        router.push(`/reinsurance/treaty-configuration/${row.id}?mode=edit`);
    };



    const dataSource$ = useCallback((pageRequest: any = {}) => {
        // Don't make API call if component is unmounted or treaty types not loaded yet
        if (!isMountedRef.current || !treatyTypesLoaded) {
            return new Observable(observer => {
                observer.complete();
            });
        }

        pageRequest.page = pageRequest.page || 0;
        pageRequest.size = pageRequest.size || 1000; // Fetch all records since pagination is disabled
        pageRequest.summary = pageRequest.summary ?? true;
        pageRequest.active = true;
        pageRequest.sort = pageRequest.sort || ['rowCreatedDate dsc'];

        // Map unified searchKey into backend multi-field params
        if (pageRequest.searchKey) {
            const q = pageRequest.searchKey;
            pageRequest.treatyConfigurationId = q;
            pageRequest.treatyTypeId = q;
            delete pageRequest.searchKey;
        }

        // Create a unique key for this request to prevent duplicates
        const requestKey = JSON.stringify(pageRequest);

        // If already loading the same request, return empty observable
        if (isLoadingRef.current && lastRequestRef.current === requestKey) {
            return new Observable(observer => {
                observer.complete();
            });
        }

        isLoadingRef.current = true;
        lastRequestRef.current = requestKey;

        return reinsuranceService.getAllTreatyConfigurations(pageRequest).pipe(
            map((data: any) => {
                isLoadingRef.current = false; // Reset loading flag

                if (!isMountedRef.current) return { content: [] }; // Return empty if unmounted

                const content = data?.data?.content || [];

                const records = content.map((item: any) => {
                    // Convert treatyTypeId to number for map lookup
                    const treatyTypeIdNum = typeof item.treatyTypeId === 'string' ? parseInt(item.treatyTypeId, 10) : item.treatyTypeId;
                    // Get treaty type name from the ref (not state) to avoid dependency issues
                    const treatyTypeName = treatyTypesMapRef.current.get(treatyTypeIdNum) || item.treatyType || 'N/A';

                    return {
                        ...item,
                        treatyTypeName: treatyTypeName,
                        asPerTreatyDisplay: item.asPerTreaty ? `${item.asPerTreaty}%` : '-',
                        riCommissionDisplay: item.riCommission ? `${item.riCommission}%` : '-',
                        limitAsPerTreatyDisplay: item.limitAsPerTreaty ? item.limitAsPerTreaty.toFixed(2) : '-',
                    };
                });

                return {
                    ...data?.data,
                    content: records
                };
            })
        );
    }, [treatyTypesLoaded]); // Depend on treatyTypesLoaded to ensure types are available

    const columnsDefinations = [
        { field: 'priorityOrder', headerName: 'Priority Order', align: 'center', sortable: true, flex: 1, minWidth: 120 },
        { field: 'treatyTypeName', headerName: 'Treaty Type', align: 'center', sortable: true, flex: 1.2, minWidth: 150 },
        { field: 'asPerTreatyDisplay', headerName: 'As Per Treaty (%)', align: 'center', sortable: true, flex: 1.1, minWidth: 130 },
        { field: 'limitAsPerTreatyDisplay', headerName: 'Limit As Per Treaty', align: 'center', sortable: true, flex: 1.2, minWidth: 140 },
        { field: 'riCommissionDisplay', headerName: 'RI Commission (%)', align: 'center', sortable: true, flex: 1.3, minWidth: 150 },
        { field: 'basicOfCommission', headerName: 'Basis of Commission', align: 'center', sortable: true, flex: 1.3, minWidth: 150 },
    ];

    const xlsColumns = [
        'treatyConfigurationId',
        'priorityOrder',
        'treatyTypeId',
        'asPerTreaty',
        'limitAsPerTreaty',
        'riCommission',
        'basicOfCommission'
    ];

    // Action buttons removed as per requirement
    const actionBtnList = useMemo(() => [], []);

    const handleAccordionExpand = useCallback((row: any) => {
        console.log('Accordion expanded for treaty config:', row);
        // You can fetch additional details here if needed
    }, []);

    const configuration: any = useMemo(() => ({
        useAccordionMode: true,
        enableSelection: false,
        scrollHeight: '600px',
        pageSize: 10,
        actionButtons: actionBtnList,
        onAccordionExpand: handleAccordionExpand,
        hidePagination: true,
        columnOptions: {
            enableSorting: true,
            enableColumnMenu: true,
            enableFiltering: true,
            enableColumnVisibility: false
        },
        expandableConfig: {
            gridTemplate: '95px 0.8fr 1fr 1fr 1.2fr 1.2fr 1.2fr',
            getStatusColor: () => '#28a745',
            renderExpandedContent: (row: any) => {
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', padding: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Priority Order</span>
                            <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                                {row.priorityOrder || 'N/A'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Treaty Type</span>
                            <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                                {row.treatyTypeName || 'N/A'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>As Per Treaty</span>
                            <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                                {row.asPerTreaty ? `${row.asPerTreaty}%` : 'N/A'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Limit As Per Treaty</span>
                            <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                                {row.limitAsPerTreaty ? row.limitAsPerTreaty.toFixed(2) : 'N/A'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>RI Commission</span>
                            <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                                {row.riCommission ? `${row.riCommission}%` : 'N/A'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Basis of Commission</span>
                            <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                                {row.basicOfCommission || 'N/A'}
                            </span>
                        </div>
                    </div>
                );
            }
        },
        header: {
            enable: true,
            enableDownload: true,
            downloadbleColumns: xlsColumns,
            clientSideSearch: false,
            addCreateButton: false,
            enableGlobalSearch: false,
            searchText: 'Search by configuration ID, treaty type'
        }
    }), [actionBtnList, xlsColumns, handleAccordionExpand]);

    return (
        <>
            {/* Create Button */}
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginBottom: '24px'
            }}>
                <Button
                    variant='contained'
                    size='small'
                    onClick={handleOpen}
                    startIcon={<AddIcon />}
                    sx={{
                        backgroundColor: '#28a745',
                        '&:hover': { backgroundColor: '#218838' }
                    }}
                >
                    Create
                </Button>
            </div>

            {/* Data Grid */}
            <FettleDataGrid
                $datasource={dataSource$}
                columnsdefination={columnsDefinations}
                onEdit={openEditSection}
                config={configuration}
                reloadtable={reloadTable}
            />
        </>
    );
}
