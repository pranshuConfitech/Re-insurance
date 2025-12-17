'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { FettleDataGrid } from '@/views/apps/shared-component/components/fettle.data.grid';
import { Box, Button, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Table, TableBody, TableCell, TableRow, Pagination, Grid, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { map, of } from 'rxjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import TreatyConfigFormComponent from './treaty-config.form.component';
import RoleService from '@/services/utility/role';
import { ReinsuranceService } from '@/services/remote-api/api/reinsurance-services/reinsurance.service';

const columnsDefinations = [
    { field: 'configurationName', headerName: 'Configuration Name' },
    { field: 'treatyName', headerName: 'Treaty Name' },
    { field: 'validFrom', headerName: 'Valid From' },
    { field: 'validTo', headerName: 'Valid To' },
    { field: 'layer', headerName: 'Layer' },
    { field: 'retentionLimit', headerName: 'Retention Limit' },
];

const initialDummyData = [
    {
        id: 1,
        slNo: 1,
        configurationName: 'HIK_XOL_2025',
        layer: '0',
        currency: 'KES',
        annualAggregateLimit: '10000000.00',
        validFrom: "25 FEB, '25",
        validUpto: "26 FEB, '25",
        reinstate: 'YES',
        entryDate: "25 FEB, '25",
    },
    {
        id: 2,
        slNo: 2,
        configurationName: 'ABC_XOL_2026',
        layer: '1',
        currency: 'USD',
        annualAggregateLimit: '5000000.00',
        validFrom: "01 JAN, '26",
        validUpto: "31 DEC, '26",
        reinstate: 'NO',
        entryDate: "01 JAN, '26",
    },
];

// Add these options for selects
const treatyTypes = ['FACULTATIVE', 'PROPORTIONAL', 'NON-PROPORTIONAL'];
const brokerOptions = ['Broker A', 'Broker B'];
const reinsurerOptions = ['Reinsurer X', 'Reinsurer Y'];
const productTypes = ['ALL', 'TYPE1', 'TYPE2'];
const productOptions = ['ALL', 'Product1', 'Product2'];
const benefitOptions = ['ALL', 'Benefit1', 'Benefit2'];

const defaultForm = {
    configurationName: '',
    layer: '',
    treatyType: treatyTypes[0],
    validFrom: '',
    validUpto: '',
    brokerRequired: 'NO',
    broker: '',
    brokerSelect: '',
    reinsurer: '',
    reinsurerSelect: '',
    productType: productTypes[0],
    product: '',
    productSelect: productOptions[0],
    benefit: benefitOptions[0],
    currency: '',
    annualAggregateLimit: '',
    reinstate: '',
    entryDate: '',
};

const PAGE_NAME = 'PLAN'
const roleService = new RoleService()
const reinsuranceService = new ReinsuranceService()

const dataSource$: any = (
    pageRequest: any = {
        page: 0,
        size: 10,
        summary: true,
        active: true,

        // fromExpectedDOA: fromExpectedDOA,
        // toExpectedDOA: fromExpectedDOA,
        // fromExpectedDOD: fromExpectedDOD,
        // toExpectedDOD: toExpectedDOD,
        // fromDate: fromDate,
        // toDate: toDate,
    }
) => {
    pageRequest.sort = ['rowCreatedDate dsc']

    return reinsuranceService.getAllTreaty(pageRequest).pipe(
        map((data: any) => {
            const content = data?.data?.content

            const records = content.map((item: any) => {
                item['validFrom'] = new Date(item.validFrom).toLocaleDateString()
                item['validTo'] = new Date(item.validTo).toLocaleDateString()
                item['layer'] = item.reinsuranceLayers.length
                return item
            })

            data.content = records

            return data?.data
        })
    )
}

export default function TreatyConfigListComponent() {
    const router = useRouter();
    const [searchBy, setSearchBy] = React.useState('CONFIG NAME');
    const [searchValue, setSearchValue] = React.useState('');
    const [data, setData] = React.useState(initialDummyData);
    const [filteredData, setFilteredData] = React.useState(initialDummyData);
    const [page, setPage] = React.useState(1);
    const rowsPerPage = 5;
    const [mode, setMode] = React.useState<'list' | 'create' | 'edit'>('list');
    const [editRow, setEditRow] = React.useState<any>(null);

    // Search logic
    React.useEffect(() => {
        if (!searchValue) {
            setFilteredData(data);
        } else {
            setFilteredData(data.filter(row =>
                row.configurationName.toLowerCase().includes(searchValue.toLowerCase())
            ));
        }
        setPage(1);
    }, [searchValue, data]);

    // Pagination logic
    const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const handleEdit = (row: any) => {
        setEditRow(row);
        setMode('edit');
    };

    const actionProps = {
        onView: (row: any) => { },
        onEdit: handleEdit,
        onDelete: () => { },
        onAddLayer: () => { },
        onSignoff: () => { },
    };

    if (mode === 'create' || mode === 'edit') {
        return <TreatyConfigFormComponent />;
    }

    const handleOpen = () => {
        router.push('/reinsurance/treaty-config?mode=create')
    }

    const openEditSection = (preAuth: any) => {
        router.push(`/reinsurance/treaty-config/${preAuth.id}?mode=edit`)
    }

    const actionButtons = [
        {
            key: 'update_preauth',
            icon: 'pi pi-pencil',
            //   disabled: disableEnhance,
            //   className: classes.categoryButton,
            onClick: openEditSection,
            tooltip: 'Edit'
        },
    ]
    const configuration = {
        enableSelection: false,
        scrollHeight: '300px',
        pageSize: 10,
        actionButtons: actionButtons,
        header: {
            enable: true,
            // enableDownload: true,
            onCreateButtonClick: handleOpen,
            text: 'Treaty Configuration',
            addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
            // enableGlobalSearch: true,
            // searchText: 'Search by code, name, client type'

            //   onSelectionChange: handleSelectedRows,
            //   selectionMenus: [{ icon: "", text: "Blacklist", disabled: selectionBlacklistMenuDisabled, onClick: openBlacklist }],
            //   selectionMenuButtonText: "Action"
        }
    }

    return (
        <Box sx={{ padding: 3 }}>
            {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2, gap: 1 }}>
                <span style={{ fontWeight: 500, color: '#222', marginRight: 8 }}>SEARCH BY</span>
                <TextField
                    select
                    size="small"
                    value={searchBy}
                    onChange={e => setSearchBy(e.target.value)}
                    sx={{ minWidth: 140 }}
                >
                    <MenuItem value="CONFIG NAME">CONFIG NAME</MenuItem>
                </TextField>
                <TextField
                    size="small"
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    sx={{ minWidth: 180 }}
                />
                <Button variant="contained" color="primary" sx={{ minWidth: 60, fontWeight: 600, background: '#D80E51' }} onClick={handleAdd}>ADD</Button>
            </Box> */}
            <FettleDataGrid
                $datasource={dataSource$}
                config={configuration}
                columnsdefination={columnsDefinations}
            />
            {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} color="primary" />
            </Box> */}
        </Box>
    );
} 
