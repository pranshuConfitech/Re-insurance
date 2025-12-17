import React, { useEffect, useState } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Box, TextField, Typography } from '@mui/material';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes'
import { BenefitService } from '@/services/remote-api/fettle-remote-api';

const benefitService = new BenefitService()

const BreakUpComponents = ({ rowData, providerList, data, setInvoiceData }: { rowData: any, providerList: any, data: any, setInvoiceData: any }) => {
  const [expandedRows, setExpandedRows] = useState<any>(null);
  const [invoices, setInvoices] = useState(rowData.invoices);

  useEffect(() => {
    setInvoices(rowData.invoices);
  }, [rowData.invoices]);
  console.log("000000", rowData.invoices, "11111111", invoices);
  const expandAll = () => {
    const _expandedRows: any = {};

    rowData.invoices.forEach((p: any) => (_expandedRows[`${p.id}`] = true));

    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };

  const allowExpansion = (rowData: any) => {
    return rowData?.invoiceItems?.length > 0;
  };

  const header = (
    <Box display={"flex"}>
      <SpeakerNotesIcon color='primary' style={{ color: '#a1a1a1', marginLeft: "1%" }} />
      <Typography >Invoice Details</Typography>
    </Box>
    // <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
    //   <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
    //   <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} text />
    // </Box>
  );

  const handleApprovedAmtChange = (invoiceId: any, itemId: any, value: string) => {
    setInvoices((prev: any) =>
      prev.map((inv: any) =>
        inv.id === invoiceId
          ? {
            ...inv,
            invoiceItems: inv.invoiceItems.map((item: any) => {
              if (item.id === itemId) {
                const newValue = Number(value);
                if (newValue > Number(item.approvedAmount)) {
                  alert('Final Approved Amount cannot be more than approved Amount');
                  return item;
                }
                return { ...item, finalApprovedAmount: value };
              }
              return item;
            }),
          }
          : inv
      )
    );
    setInvoiceData((prev: any) =>
      prev.map((inv: any) =>
        inv.id === invoiceId
          ? {
            ...inv,
            invoiceItems: inv.invoiceItems.map((item: any) => {
              if (item.id === itemId) {
                const newValue = Number(value);
                if (newValue > Number(item.approvedAmount)) {
                  alert('Final Approved Amount cannot be more than approved Amount');
                  return item;
                }
                return { ...item, finalApprovedAmount: value };
              }
              return item;
            }),
          }
          : inv
      )
    );
  };
  const handleReasonChange = (invoiceId: any, itemId: any, value: string) => {
    setInvoices((prev: any) =>
      prev.map((inv: any) =>
        inv.id === invoiceId
          ? {
            ...inv,
            invoiceItems: inv.invoiceItems.map((item: any) => {
              if (item.id === itemId) {
                return { ...item, approverComment: value };
              }
              return item;
            }),
          }
          : inv
      )
    );
    setInvoiceData((prev: any) =>
      prev.map((inv: any) =>
        inv.id === invoiceId
          ? {
            ...inv,
            invoiceItems: inv.invoiceItems.map((item: any) => {
              if (item.id === itemId) {
                return { ...item, finalAapproverCommentpprovedAmount: value };
              }
              return item;
            }),
          }
          : inv
      )
    );
  };

  // const handleReasonChange = (invoiceId: any, itemId: any, value: string) => {
  //   setInvoices((prev: any) =>
  //     prev.map((inv: any) =>
  //       inv.id === invoiceId
  //         ? {
  //           ...inv,
  //           invoiceItems: inv.invoiceItems.map((item: any) =>
  //             item.id === itemId ? { ...item, approverComment: value } : item
  //           ),
  //         }
  //         : inv
  //     )
  //   );
  // };

  const rowExpansionTemplate = (data: any) => {
    const providerName = providerList?.find((provider: any) => data.provideId == provider.id)?.providerBasicDetails.name;
    console.log("1234567890", data)
    return (
      <Box sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#495057' }}>
            Invoices for {providerName}
          </Typography>
          {/* <Button >Calculate</Button> */}
        </Box>
        <DataTable
          // value={data.invoiceItems}
          value={invoices.find((inv: any) => inv.invoiceNo === data.invoiceNo)?.invoiceItems}
          // value={invoices.find((inv: any) => inv.id === data.id)?.invoiceItems}
          className="p-datatable-sm"
          style={{ width: '100%' }}
        >
          <Column
            field="benefitName"
            header="Benefit"
            sortable
            style={{ width: '17%' }}
          />
          <Column
            field="expenseHeadName"
            header="Head"
            sortable
            style={{ width: '18%' }}
          />
          {/* <Column
            field="rateKes"
            header="Rate KSH"
            sortable
            style={{ width: '25%' }}
          />
          <Column
            field="unit"
            header="Unit"
            sortable
            style={{ width: '25%' }}
          /> */}
          <Column
            field="totalKes"
            header="Total KSH"
            sortable
            style={{ width: '10%' }}
          />
          <Column
            field="approvedAmount"
            header="Adm Amt"
            sortable
            style={{ width: '10%' }}
            body={(rowData: any) => (
              <span
                style={{ lineBreak: 'anywhere', textDecoration: 'underline', cursor: 'pointer' }}
              >
                {rowData.approvedAmount}
              </span>
            )}
          />
          <Column
            field="comment"
            header="Reason"
            sortable
            style={{ width: '20%' }}
          />
          <Column
            field="finalApprovedAmount"
            header="Approved Amt"
            sortable
            style={{ width: '10%' }}
            body={(rowData: any) => (
              <TextField
                variant="outlined"
                size="small"
                value={rowData.finalApprovedAmount}
                onChange={e => handleApprovedAmtChange(data.id, rowData.id, e.target.value)}
              />
            )}
          />
          <Column
            field="approverComment"
            header="Comment"
            sortable
            style={{ width: '20%' }}
            body={(rowData: any) => (
              <TextField
                multiline
                variant="outlined"
                size="small"
                value={rowData.approverComment}
                onChange={e => handleReasonChange(data.id, rowData.id, e.target.value)}
              />
            )}
          />
          {/* <Column
            field="decision"
            header="Decision"
            sortable
            style={{ width: '15%' }}
            body={(rowData: any) => (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Button icon="pi pi-check-circle"></Button>
                <Button icon="pi pi-times-circle"></Button>
              </Box>
            )}
          /> */}
        </DataTable>
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <DataTable
        value={rowData.invoices}
        expandedRows={expandedRows}
        onRowToggle={(e: any) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="invoiceNo"
        header={header}
        className="p-datatable-sm"
        style={{ width: '100%' }}
      >
        <Column expander={allowExpansion} style={{ width: '4rem' }} />
        {/* <Column
          field="serial"
          header="SL#"
          body={(rowData, data) => data.rowIndex + 1}
        // style={{ width: '4rem' }}
        /> */}
        <Column
          field="invoiceNo"
          header="Invoice No"
          sortable
          style={{ width: '25%' }}
        />
        <Column
          field="provideId"
          header="Provider"
          sortable
          style={{ width: '30%' }}
          body={rowData => providerList?.find((provider: any) => rowData.provideId == provider.id)?.providerBasicDetails.name}
        />
        <Column
          field="invoiceAmount"
          header="Claim Amt"
          sortable
          style={{ width: '20%' }}
        />
        {/* <Column 
          field="admAmt" 
          header="Adm Amt" 
          sortable 
          style={{ width: '15%' }}
          body={rowData => providerList?.find((provider:any) => rowData.provideId == provider.id)?.providerBasicDetails.name}
        /> */}
        <Column
          field="payee"
          header="Payee"
          sortable
          style={{ width: '20%' }}
        />
        {/* <Column 
          field="reason" 
          header="Reason" 
          sortable 
          style={{ width: '15%' }}
        />
        <Column 
          field="decision" 
          header="Decision" 
          sortable 
          style={{ width: '15%' }}
        /> */}
      </DataTable>
    </Box>
  );
};

export default BreakUpComponents;
