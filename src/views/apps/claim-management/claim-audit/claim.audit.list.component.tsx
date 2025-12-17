import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { map } from 'rxjs'

import { ProvidersService } from '@/services/remote-api/api/provider-services'
import { ReimbursementService } from '@/services/remote-api/api/claims-services/claim.reimbursement.services'
import BreakUpComponents from './components/audit.breakup.view.component'
import { getDateElements } from '@/utils/@jambo-utils/dateHelper'
import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Snackbar, TextField } from '@mui/material'

const providerService = new ProvidersService()
const reimbursementService = new ReimbursementService()

const ClaimAudit = (props: any) => {
  const history = useRouter()
  const ps$ = providerService.getProviders({
    page: 0,
    size: 10000,
    summary: true,
    active: true
  })
  const [providerList, setProviderList] = useState<any>([])
  const [reload, setReload] = useState(false)
  const [openRemarks, setOpenRemarks] = useState(false)
  const [decision, setDecision] = useState('')
  const [comment, setComment] = useState('')
  const [id, setId] = useState<any>()
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');

  useEffect(() => {
    const subscription = ps$.subscribe((result: any) => {
      const filteredProviders = result.content.filter((ele: any) => !ele.blackListed)

      setProviderList(filteredProviders)

      return () => subscription.unsubscribe()
    })
  }, [])

  const handleClaimApprove = () => {

    const payload = {
      auditDecision: 'APPROVED',
      comment: comment
    }

    // invoiceservice.saveInvoice(payload).subscribe({
    reimbursementService.auditDecision(id, payload).subscribe({
      next: (res) => {
        setSnackbarMessage('Claim Approved');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setReload(true)
        // Wait for toast to be visible before redirecting
        setTimeout(() => {
          setReload(false)
        }, 1000);
      },
      error: (error) => {
        setSnackbarMessage(error?.response?.data?.message || 'Something went wrong, Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    })

    // reimbursementService.auditDecision(id, payload).subscribe(res => {
    //   setReload(true)
    //   setReload(false)
    // })
    // setTimeout(() => setReload(true), 500)
    // setTimeout(() => setReload(false), 500)
  }

  const handleClaimReject = () => {

    const payload = {
      auditDecision: 'REJECTED',
      comment: comment
    }

    reimbursementService.auditDecision(id, payload).subscribe({
      next: (res) => {
        setSnackbarMessage('Claim Rejected');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setReload(true)
        // Wait for toast to be visible before redirecting
        setTimeout(() => {
          setReload(false)
        }, 1000);
      },
      error: (error) => {
        setSnackbarMessage(error?.response?.data?.message || 'Something went wrong, Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    })
  }

  const handleClaimRevert = () => {

    const payload = {
      auditDecision: 'REVERTED',
      comment: comment,
      revertedBy: 'AUDITOR'
    }

    reimbursementService.auditDecision(id, payload).subscribe({
      next: (res) => {
        setSnackbarMessage('Claim Reverted');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setReload(true)
        // Wait for toast to be visible before redirecting
        setTimeout(() => {
          setReload(false)
        }, 1000);
      },
      error: (error) => {
        setSnackbarMessage(error?.response?.data?.message || 'Something went wrong, Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    })
  }

  const handleClaimClick = (rowData: any, field: any) => {
    if (field === 'membershipNo' || 'claimNo') {
      const membershipNo = rowData.memberShipNo

      history.push(`/claims/claims-to-be-processed/${rowData?.id}?mode=viewonly`)
    }
  }

  const parentcolumnsDefinations: any = [
    {
      field: 'id',
      headerName: 'Claim No.',
      style: { width: '120px' },
      body: (rowData: any) => (
        <span
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => handleClaimClick(rowData, 'claimNo')}
        >
          {rowData.id}
        </span>
      ),
    },
    {
      field: 'memberShipNo',
      headerName: 'Membership No.',
      style: { width: '150px' }
    },
    {
      field: 'memberName',
      headerName: 'Name',
      style: { width: '200px' }
    },
    {
      field: 'claimSubType',
      headerName: 'Claim sub-type',
      style: { width: '150px' }
    },
    {
      field: 'barcode',
      headerName: 'Bar code',
      style: { width: '120px' }
    },
    // {
    //   field: 'breakUpDetails',
    //   headerName: 'Breakup Details',
    //   expand: true,
    //   style: { width: '150px' },
    //   body: (rowData: any, data: any) => (
    //     <BreakUpComponents key={rowData.id} rowData={rowData} data={data} providerList={providerList} />
    //   )
    // }
  ]

  const xlsColumns = ['claimDetails', 'breakUpDetails']

  const handleApproveClick = (rowData: any) => {
    setId(rowData.id)
    setOpenRemarks(true);
    setDecision('Approve');
  }
  const handleRejectClick = (rowData: any) => {
    setId(rowData.id)
    setOpenRemarks(true);
    setDecision("Reject");
  }
  const handleRevertClick = (rowData: any) => {
    setId(rowData.id)
    setOpenRemarks(true);
    setDecision("Revert");
  }

  const parentConfiguration = {
    enableSelection: false,
    scrollHeight: 'calc(100vh - 400px)',
    pageSize: 10,
    rowExpand: true,
    actionButtons: [
      {
        icon: 'pi pi-check-circle',
        tooltip: 'Approve',
        severity: 'primary',
        onClick: handleApproveClick,
        refreshTable: true,
        style: { marginRight: '8px' }
      },
      {
        icon: 'pi pi-times-circle',
        tooltip: 'Reject',
        severity: 'danger',
        onClick: handleRejectClick,
        refreshTable: true,
        style: { marginRight: '8px' }
      },
      {
        icon: 'pi pi-replay',
        tooltip: 'Revert',
        severity: 'info',
        onClick: handleRevertClick,
        style: { marginRight: '8px' }
      }
    ],
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      text: 'Claims Audit Details',
      enableGlobalSearch: true,
      searchText: 'Search by Claim number',
      style: {
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0'
      }
    },
    style: {
      '& .p-datatable-wrapper': {
        border: '1px solid #e0e0e0',
        borderRadius: '4px'
      },
      '& .p-datatable-header': {
        padding: '16px'
      },
      '& .p-datatable-thead > tr > th': {
        backgroundColor: '#f5f5f5',
        padding: '12px',
        fontWeight: 600
      },
      '& .p-datatable-tbody > tr > td': {
        padding: '12px'
      },
      '& .p-datatable-row-expansion': {
        padding: '0 !important'
      },
      '& .p-datatable-row-expansion-content': {
        padding: '0 !important'
      }
    }
  }

  const { startDate, endDate } = props?.searchDate

  useEffect(() => {
    if (props.searchDate.startDate && props.searchDate.endDate) {
      setReload(true)

      setTimeout(() => setReload(false), 500)
    }
  }, [props.searchDate])

  const parentdataSource$ = (
    pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true
    }
  ) => {
    pageRequest.sort = ['rowCreatedDate dsc']

    // pageRequest.claimStatus = ['APPROVED'];
    if (startDate && endDate) {
      pageRequest.startDate = startDate.getTime()
      pageRequest.endDate = endDate.getTime()
    }

    return reimbursementService.getAllAuditReimbursements(pageRequest).pipe(
      map(data => {
        const content = data.content

        const records = content.map((item: any) => {
          const providerNames = item.providers
            ?.map((providerId: any) => providerList.find((provider: any) => provider.id === providerId)?.name)
            .filter((name: any) => name !== undefined || name !== '')

          const totalEstimatedCost = item.benefitsWithCost.reduce((accumulator: any, currentValue: any) => {
            return accumulator + currentValue.estimatedCost
          }, 0)

          const invoicesAmount = item.invoices.reduce((accumulator: any, currentValue: any) => {
            return accumulator + currentValue.invoiceAmount
          }, 0)

          item['createdDate'] = `${getDateElements(item.createdDate).date.numerical}`
          item['expectedDOA'] = `${getDateElements(item.expectedDOA).date.numerical}`
          item['expectedDOD'] = `${getDateElements(item.expectedDOD).date.numerical}`
          item['providerName'] = providerNames
          item['claimedAmount'] = totalEstimatedCost
          item['billAmount'] = invoicesAmount

          return item
        })

        data.content = records

        return data
      })
    )
  }

  const handleClose = () => {
    setOpenRemarks(false);
    setDecision('');
  }

  const handleModalSubmit = () => {
    console.log("aaa", decision)
    if (decision == "Approve") {
      handleClaimApprove()
    } else if (decision == "Reject") {
      handleClaimReject()
    } else if (decision == "Revert") {
      handleClaimRevert()
    }
    handleClose();
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <FettleDataGrid
        $datasource={parentdataSource$}
        columnsdefination={parentcolumnsDefinations}
        config={parentConfiguration}
        reloadtable={reload}
      />
      <Dialog open={openRemarks} onClose={handleClose} aria-labelledby="form-dialog-title" disableEnforceFocus style={{ width: "100%", height: "400px" }} maxWidth="md">
        <DialogTitle id="form-dialog-title">{decision} remark</DialogTitle>
        <DialogContent>
          <TextField
            required
            label="Add Remark"
            multiline
            fullWidth
            minRows={4}
            variant="filled"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleModalSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2800}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ClaimAudit
