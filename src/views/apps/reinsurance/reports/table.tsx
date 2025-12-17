import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from "@mui/material";

const data = [
    {
        group: "During Allocation",
        entries: [
            { code: "1101", desc: "RI Ceded Premium", debit: 4000, credit: 0, invoicing: "AP", amount: 4000, party: "R1", invoice: "I1", status: "Open" },
            { code: "8000", desc: "Sundry Creditor", debit: 0, credit: 4000 }
        ]
    },
    {
        group: "During Allocation",
        entries: [
            { code: "1201", desc: "RI Ceded Commission", debit: 400, credit: 0, invoicing: "AR", amount: 400, party: "R1", invoice: "I2", status: "Open" },
            { code: "9000", desc: "Sundry Debtor", debit: 400, credit: 0 }
        ]
    },
    {
        group: "During Allocation",
        entries: [
            { code: "1101", desc: "RI Ceded Premium", debit: 3600, credit: 0, invoicing: "AP", amount: 3600, party: "R3", invoice: "I3", status: "Open" },
            { code: "8000", desc: "Sundry Creditor", debit: 0, credit: 3600 }
        ]
    },
    {
        group: "During Allocation",
        entries: [
            { code: "1201", desc: "RI Ceded Commission", debit: 1080, credit: 0, invoicing: "AR", amount: 1080, party: "R3", invoice: "I4", status: "Open" },
            { code: "9000", desc: "Sundry Debtor", debit: 1080, credit: 0 }
        ]
    },
    {
        group: "During Allocation",
        entries: [
            { code: "1101", desc: "RI Ceded Premium", debit: 2400, credit: 0, invoicing: "AP", amount: 3600, party: "R4", invoice: "I5", status: "Open" },
            { code: "8000", desc: "Sundry Creditor", debit: 0, credit: 2400 }
        ]
    },
    {
        group: "During Allocation",
        entries: [
            { code: "1201", desc: "RI Ceded Commission", debit: 720, credit: 0, invoicing: "AR", amount: 1080, party: "R4", invoice: "I6", status: "Open" },
            { code: "9000", desc: "Sundry Debtor", debit: 720, credit: 0 }
        ]
    },
    {
        group: "Actual Payment",
        entries: [
            { code: "8000", desc: "Sundry Creditor", debit: 0, credit: 4000, invoicing: "AP", amount: 4000, party: "R1", invoice: "I1", status: "Closed" },
            { code: "1000", desc: "Cash", debit: 4000, credit: 0 }
        ]
    },
    {
        group: "Actual Collection",
        entries: [
            { code: "9000", desc: "Sundry Debtor", debit: 0, credit: 400, invoicing: "AR", amount: 400, party: "R1", invoice: "I2", status: "Closed" },
            { code: "1100", desc: "Cash", debit: 400, credit: 0 }
        ]
    }
];

const data1 = [
    {
        group: "During Allocation",
        entries: [
            { code: "1101", desc: "RI Ceded Premium", debit: 8000, credit: 0, invoicing: "AP", amount: 8000, party: "R1", invoice: "I1", status: "Open" },
            { code: "8000", desc: "Sundry Creditor", debit: 0, credit: 8000 }
        ]
    },
    {
        group: "During Allocation",
        entries: [
            { code: "1201", desc: "RI Ceded Commission", debit: 800, credit: 0, invoicing: "AR", amount: 800, party: "R1", invoice: "I2", status: "Open" },
            { code: "9000", desc: "Sundry Debtor", debit: 800, credit: 0 }
        ]
    },
    {
        group: "During Allocation",
        entries: [
            { code: "1101", desc: "RI Ceded Premium", debit: 7200, credit: 0, invoicing: "AP", amount: 7200, party: "R3", invoice: "I3", status: "Open" },
            { code: "8000", desc: "Sundry Creditor", debit: 0, credit: 7200 }
        ]
    },
    {
        group: "During Allocation",
        entries: [
            { code: "1201", desc: "RI Ceded Commission", debit: 2160, credit: 0, invoicing: "AR", amount: 2160, party: "R3", invoice: "I4", status: "Open" },
            { code: "9000", desc: "Sundry Debtor", debit: 2160, credit: 0 }
        ]
    },
    {
        group: "During Allocation",
        entries: [
            { code: "1101", desc: "RI Ceded Premium", debit: 4800, credit: 0, invoicing: "AP", amount: 7200, party: "R4", invoice: "I5", status: "Open" },
            { code: "8000", desc: "Sundry Creditor", debit: 0, credit: 4800 }
        ]
    },
    {
        group: "During Allocation",
        entries: [
            { code: "1201", desc: "RI Ceded Commission", debit: 1440, credit: 0, invoicing: "AR", amount: 2160, party: "R4", invoice: "I6", status: "Open" },
            { code: "9000", desc: "Sundry Debtor", debit: 1440, credit: 0 }
        ]
    },
    {
        group: "Actual Payment",
        entries: [
            { code: "8000", desc: "Sundry Creditor", debit: 0, credit: 8000, invoicing: "AP", amount: 8000, party: "R1", invoice: "I1", status: "Closed" },
            { code: "1000", desc: "Cash", debit: 8000, credit: 0 }
        ]
    },
    {
        group: "Actual Collection",
        entries: [
            { code: "9000", desc: "Sundry Debtor", debit: 0, credit: 800, invoicing: "AR", amount: 800, party: "R1", invoice: "I2", status: "Closed" },
            { code: "1100", desc: "Cash", debit: 800, credit: 0 }
        ]
    }
];

export default function AccountingTable({ policy }: any) {
    return (
        <TableContainer component={Paper} sx={{ border: "1px solid #ccc" }}>
            <Typography
                variant="h6"
                sx={{ p: 2, fontWeight: 600, textAlign: "center", backgroundColor: "#f5f5f5" }}
            >
                RI Accounting Details
            </Typography>

            <Table size="small">
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                        <TableCell sx={{ fontWeight: 600 }}>RI Accounting (GL)</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Accounting Code</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Accounting Code Desc</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Debit Amount</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Credit Amount</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Invoicing</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Party</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Invoice No</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Invoice Status</TableCell>
                    </TableRow>
                </TableHead>

                {policy === "Policy 1" ? <TableBody>
                    {data.map((section, i) =>
                        section.entries.map((entry, j) => (
                            <TableRow
                                key={`${section.group}-${j}`}
                                sx={{
                                    backgroundColor:
                                        j === 0 && i % 2 === 0 ? "#fff9c4" : "#ffffff", // light yellow highlight for alternating groups
                                    "&:hover": { backgroundColor: "#f9f9f9" }
                                }}
                            >
                                {j === 0 ? (
                                    <TableCell rowSpan={section.entries.length} sx={{ fontWeight: 600 }}>
                                        {section.group}
                                    </TableCell>
                                ) : null}
                                <TableCell>{entry.code}</TableCell>
                                <TableCell>{entry.desc}</TableCell>
                                <TableCell>{entry.debit || ""}</TableCell>
                                <TableCell>{entry.credit || ""}</TableCell>
                                <TableCell>{entry.invoicing || ""}</TableCell>
                                <TableCell>{entry.amount || ""}</TableCell>
                                <TableCell>{entry.party || ""}</TableCell>
                                <TableCell>{entry.invoice || ""}</TableCell>
                                <TableCell>{entry.status || ""}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody> : policy === "Policy 2" ? <TableBody>
                    {data1.map((section, i) =>
                        section.entries.map((entry, j) => (
                            <TableRow
                                key={`${section.group}-${j}`}
                                sx={{
                                    backgroundColor:
                                        j === 0 && i % 2 === 0 ? "#fff9c4" : "#ffffff", // light yellow highlight for alternating groups
                                    "&:hover": { backgroundColor: "#f9f9f9" }
                                }}
                            >
                                {j === 0 ? (
                                    <TableCell rowSpan={section.entries.length} sx={{ fontWeight: 600 }}>
                                        {section.group}
                                    </TableCell>
                                ) : null}
                                <TableCell>{entry.code}</TableCell>
                                <TableCell>{entry.desc}</TableCell>
                                <TableCell>{entry.debit || ""}</TableCell>
                                <TableCell>{entry.credit || ""}</TableCell>
                                <TableCell>{entry.invoicing || ""}</TableCell>
                                <TableCell>{entry.amount || ""}</TableCell>
                                <TableCell>{entry.party || ""}</TableCell>
                                <TableCell>{entry.invoice || ""}</TableCell>
                                <TableCell>{entry.status || ""}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                    : null}
            </Table>
        </TableContainer>
    );
}
