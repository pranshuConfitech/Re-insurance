import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Updated Row type to match the image columns for the main table
type FundRow = {
    month: string;
    details: string;
    fees: string;
    totalCount: string;
    dr: string;
    cr: string;
    bal: string;
    creditLimit: string;
};

// Hardcoded dummy data for the main table based on the first image
const dummyFundData: FundRow[] = [
    {
        month: 'Dec - 2022',
        details: 'BALANCE B/F',
        fees: '',
        totalCount: '',
        dr: '',
        cr: '',
        bal: '0.00',
        creditLimit: '0.00',
    },
    {
        month: 'May - 2024',
        details: 'FUND PAYMENTS',
        fees: '',
        totalCount: '',
        dr: '',
        cr: '500,000.00',
        bal: '500,000.00',
        creditLimit: '0.00',
    },
    {
        month: 'Jun - 2024',
        details: 'CLAIMS',
        fees: '',
        totalCount: '',
        dr: '22,000.00',
        cr: '',
        bal: '478,000.00',
        creditLimit: '0.00',
    },
    {
        month: 'May - 2025',
        details: 'CLOSING BALANCE',
        fees: '',
        totalCount: '',
        dr: '',
        cr: '',
        bal: '478,000.00',
        creditLimit: '0.00',
    },
];

// Define type for the data in the CR dialog table (Receipt Details)
type ReceiptRow = {
    id: number;
    sl: number;
    receiptNo: string;
    receiptDate: string;
    receiptAmount: string;
    transactionMode: string;
    instNo: string;
    status: string;
};

// Hardcoded dummy data for the CR dialog table based on the second image
const dummyReceiptData: ReceiptRow[] = [
    {
        id: 1,
        sl: 1,
        receiptNo: 'GAIKE/05/24/SFR-1000002',
        receiptDate: '13 May 2024',
        receiptAmount: '500,000.00 [KES]',
        transactionMode: 'CHEQUE',
        instNo: '6765675',
        status: 'APPLIED',
    },
];

// Define types for the data in the DR dialog table (Claim Details)
type BillItem = {
    service: string;
    amount: string;
};

type ClaimRow = {
    id: number; // Unique ID for the row
    sl: number;
    claimNo: string;
    memberDetail: {
        membershipNo: string;
        name: string;
        age: number;
        relationship: string;
    };
    providerDetail: {
        type: string;
        name: string;
        invoiceNo: string;
        invoiceDate: string;
    };
    billItems: BillItem[]; // Array to hold multiple service/amount pairs
    utilization: string;
};

// Hardcoded dummy data for the DR dialog table based on the third image
const dummyClaimData: ClaimRow[] = [
    {
        id: 1,
        sl: 1,
        claimNo: 'DP2406030031',
        memberDetail: {
            membershipNo: 'GK02899002',
            name: 'MR G T',
            age: 35,
            relationship: 'SON',
        },
        providerDetail: {
            type: 'HOSPITAL',
            name: 'NAIROBI HOSPITAL',
            invoiceNo: 'INV0362024103220',
            invoiceDate: '10 Jun 2024',
        },
        billItems: [
            { service: 'CONSULTANT', amount: '300.00' },
            { service: 'INVESTIGATION', amount: '500.00' },
            { service: 'DENTAL', amount: '2,200.00' },
        ],
        utilization: '3,000.00',
    },
    {
        id: 2,
        sl: 2,
        claimNo: 'DP2406030032', // Dummy claim number for the second row
        memberDetail: {
            membershipNo: 'GK02898901',
            name: 'MRS A B', // Dummy name
            age: 40, // Dummy age
            relationship: 'SPOUSE', // Dummy relationship
        },
        providerDetail: {
            type: 'HOSPITAL',
            name: 'NAIROBI HOSPITAL',
            invoiceNo: 'INV0362024103221', // Dummy invoice no
            invoiceDate: '10 Jun 2024', // Dummy invoice date
        },
        billItems: [
            { service: 'CONSULTANT', amount: '300.00' },
        ],
        utilization: '300.00', // Dummy utilization
    }
];

// Modify the component to handle dialogs and display the hardcoded tables
export default function FundStatementTable({ data }: any) {
    const [openCrDialog, setOpenCrDialog] = React.useState(false);
    const [openDrDialog, setOpenDrDialog] = React.useState(false);
    console.log("Data:", data);
    const handleCrClick = (rowData: FundRow) => {
        if (rowData.cr) {
            setOpenCrDialog(true);
        }
    };

    const handleCloseCrDialog = () => {
        setOpenCrDialog(false);
    };

    const handleDrClick = (rowData: FundRow) => {
        if (rowData.dr) { // Only open dialog if there is a DR value
            setOpenDrDialog(true);
        }
    };

    const handleCloseDrDialog = () => {
        setOpenDrDialog(false);
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* <TableCell>MONTH</TableCell>
                            <TableCell>DETAILS</TableCell>
                            <TableCell>FEES</TableCell>
                            <TableCell>TOTAL COUNT</TableCell>
                            <TableCell>DR</TableCell>
                            <TableCell>CR</TableCell>
                            <TableCell>BAL</TableCell>
                            <TableCell>CREDIT LIMIT</TableCell> */}
                            <TableCell>Description</TableCell>
                            <TableCell>Source</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Dr</TableCell>
                            <TableCell>Cr</TableCell>
                            <TableCell>Balance</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data[0]?.fundTransactions?.map((row: any, idx: number) => {
                            console.log("Row Data:", row);
                            return (
                                <TableRow key={row.id}>
                                    {/* <TableCell>{row.month}</TableCell> */}
                                    <TableCell>{row.description}</TableCell>
                                    <TableCell>{row.sourceType}</TableCell>
                                    <TableCell>
                                        {new Date(row.rowCreatedDate).toLocaleDateString('en-GB')}
                                    </TableCell>
                                    <TableCell>
                                        {row.transactionType == "DEBIT" ? (
                                            row.amount
                                        ) : (
                                            ''
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {row.transactionType == "CREDIT" ? (
                                            row.amount
                                        ) : (
                                            ''
                                        )}
                                    </TableCell>
                                    <TableCell>{row.balance}</TableCell>
                                    {/* <TableCell>{row.creditLimit}</TableCell> */}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* The Dialog Component for CR */}
            <Dialog open={openCrDialog} onClose={handleCloseCrDialog} maxWidth="lg" fullWidth>
                <DialogTitle>Receipt Details</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>SL#</TableCell>
                                    <TableCell>RECEIPT NO</TableCell>
                                    <TableCell>RECEIPT DATE</TableCell>
                                    <TableCell>RECEIPT AMOUNT</TableCell>
                                    <TableCell>TRANSACTION MODE</TableCell>
                                    <TableCell>INST NO</TableCell>
                                    <TableCell>STATUS</TableCell>
                                    <TableCell>ACTION</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dummyReceiptData.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.sl}</TableCell>
                                        <TableCell>{row.receiptNo}</TableCell>
                                        <TableCell>{row.receiptDate}</TableCell>
                                        <TableCell>{row.receiptAmount}</TableCell>
                                        <TableCell>{row.transactionMode}</TableCell>
                                        <TableCell>{row.instNo}</TableCell>
                                        <TableCell>{row.status}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" color="primary" size="small" style={{ marginRight: 8 }}>
                                                PRINT
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button variant="contained" color="secondary" onClick={handleCloseCrDialog}>
                            CLOSE
                        </Button>
                    </Box>

                </DialogContent>
            </Dialog>

            {/* The Dialog Component for DR */}
            <Dialog open={openDrDialog} onClose={handleCloseDrDialog} maxWidth="lg" fullWidth>
                <DialogTitle>Claim Details</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell rowSpan={2}>SL#</TableCell>
                                    <TableCell rowSpan={2}>CLAIM NO</TableCell>
                                    <TableCell rowSpan={2}>MEMBER DETAIL</TableCell>
                                    <TableCell rowSpan={2}>PROVIDER DETAIL</TableCell>
                                    <TableCell colSpan={2} style={{ textAlign: 'center' }}>BILL ITEM</TableCell>
                                    <TableCell rowSpan={2}>UTILIZATION</TableCell>
                                </TableRow>
                                <TableRow>
                                    {/* Sub-headers for BILL ITEM */}
                                    <TableCell>SERVICE</TableCell>
                                    <TableCell>AMOUNT</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dummyClaimData.map((row: ClaimRow) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.sl}</TableCell>
                                        <TableCell>{row.claimNo}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2">Membership No: {row.memberDetail.membershipNo}</Typography>
                                            <Typography variant="body2">Name: {row.memberDetail.name}</Typography>
                                            <Typography variant="body2">Age: {row.memberDetail.age}</Typography>
                                            <Typography variant="body2">Relationship: {row.memberDetail.relationship}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">Type: {row.providerDetail.type}</Typography>
                                            <Typography variant="body2">Name: {row.providerDetail.name}</Typography>
                                            <Typography variant="body2">Invoice No: {row.providerDetail.invoiceNo}</Typography>
                                            <Typography variant="body2">Invoice Date: {row.providerDetail.invoiceDate}</Typography>
                                        </TableCell>
                                        {/* Bill Items */}
                                        <TableCell>
                                            {row.billItems.map((item, itemIdx) => (
                                                <div key={itemIdx}>{item.service}</div>
                                            ))}
                                        </TableCell>
                                        <TableCell>
                                            {row.billItems.map((item, itemIdx) => (
                                                <div key={itemIdx}>{item.amount}</div>
                                            ))}
                                        </TableCell>
                                        <TableCell>{row.utilization}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button variant="contained" color="secondary" onClick={handleCloseDrDialog}>
                            CLOSE
                        </Button>
                    </Box>

                </DialogContent>
            </Dialog>
        </>
    );
} 
