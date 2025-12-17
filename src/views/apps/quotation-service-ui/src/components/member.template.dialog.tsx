import * as React from 'react';
import { Button } from 'primereact/button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Box,
  Typography,
  FormControl,
  Divider,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { MemberService } from '@/services/remote-api/api/member-services';
import { FettleAutocomplete } from '@/views/apps/shared-component';
import { defaultPageRequest, PlanService } from '@/services/remote-api/fettle-remote-api';

const memberservice = new MemberService();
const planService = new PlanService();

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1),
    backgroundColor: '#fafafa',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: '#fff',
  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
}));

export default function MemberTemplateModal(props: any) {
  const fullWidth = true;
  const maxWidth = 'sm';

  const [apiValList, setApiValList] = React.useState(
    props.apiList.length !== 0 ? props.apiList : []
  );
  const [noOfRows, setNoOfRows] = React.useState(100);
  const [quotationDetails, setQuotationDetails] = React.useState(
    props.quotationDetails || ''
  );
  const [renewalPolicyId, setRenewalPolicyId] = React.useState(
    props.renewalPolicyId || ''
  );

  React.useEffect(() => {
    handlePlanChange();
  }, []);

  const path = window.location.pathname.split('/');

  const handleClose = () => props.closeTemplateModal();

  const handleQueryParamChange = (e: any, i: any, j: any) => {
    const list = [...apiValList];
    list[i]['queryParameters'][j]['value'] = e.target.value;
    setApiValList(list);
  };

  // const handlePlanChange = (e: any, i: any, j: any) => {
  const handlePlanChange = () => {
    const list = [...apiValList];
    // list[i]['queryParameters'][j]['value'] = e.code;
    list[0]['queryParameters'][0]['value'] = props.selectedPlanCode;
    setApiValList(list);
  };

  const handlePathParamChange = (e: any, i: any, j: any) => {
    const list = [...apiValList];
    list[i]['pathVaraibles'][j]['value'] = e.target.value;
    setApiValList(list);
  };

  const handleRowInput = (e: any) => setNoOfRows(e.target.value);

  const planDataSourceCallback$ = (params = {}, action: any, pageRequest = defaultPageRequest) => {
    let reqParam: any = { ...pageRequest, ...params };
    if (action?.searchText) {
      reqParam = {
        ...reqParam,
        code: action.searchText,
        name: action.searchText,
        clientType: action.searchText,
      };
    }
    return planService.getPlans(reqParam);
  };

  const handleModalSubmit = (e: any) => {
    e.preventDefault();
    let allOk = true
    const hasAPI = true
    const payload = []
    const payload2 = []
    const payload3: any = []
    let url: any = ''

    if (apiValList.length === 0) {
      memberservice.downloadTemplate(JSON.stringify(payload3), noOfRows, false).subscribe((res: any) => {
        const { data, headers } = res
        const fileName = headers['content-disposition'].replace(/\w+; filename=(.*)/, '$1')
        const blob = new Blob([data], { type: headers['content-type'] })
        const dom: any = document.createElement('a')
        const url = window.URL.createObjectURL(blob)

        dom.href = url
        dom.download = decodeURI(fileName)
        dom.style.display = 'none'
        document.body.appendChild(dom)
        dom.click()
        dom?.parentNode?.removeChild(dom)
        window.URL.revokeObjectURL(url)
        handleClose()
        if (props.onDownloadComplete) props.onDownloadComplete()
      })
    }

    if (apiValList.length !== 0) {
      apiValList.forEach((api: any) => {
        const quryParams = []
        const pathParams = []

        const qObj: any = {}
        const pathObj: any = {}

        api.pathVaraibles.forEach((ele: any) => {
          if (ele.value === '') {
            //error message
            allOk = false
          }

          if (ele.value !== '') {
            pathObj[ele.urlPlaceholder] = ele.value
          }
        })

        api.queryParameters.forEach((ele: any) => {
          if (ele.value === '' && ele.required) {
            //error message
            allOk = false
          }

          if (ele.value !== '') {
            qObj[ele.urlPlaceholder] = [ele.value]
          }
        })

        if (quotationDetails && quotationDetails.renewalPolicyId) {
          const policyObj = {
            policyId: [quotationDetails.renewalPolicyId]
          }

          payload3.push({
            apiId: api.id,
            queryParameters: { ...qObj, ...policyObj },
            pathVaraibles: pathObj
          })
        } else if (renewalPolicyId && renewalPolicyId != '') {
          const policyObj = {
            policyId: [renewalPolicyId]
          }

          payload3.push({
            apiId: api.id,
            queryParameters: { ...qObj, ...policyObj },
            pathVaraibles: pathObj
          })
        } else {
          payload3.push({
            apiId: api.id,
            queryParameters: qObj,
            pathVaraibles: pathObj
          })
        }
      })

      if (allOk) {
        if ((quotationDetails && quotationDetails.renewalPolicyId) || (renewalPolicyId && renewalPolicyId != '')) {
          memberservice.downloadTemplate(JSON.stringify(payload3), noOfRows, true).subscribe((res: any) => {
            const { data, headers } = res
            const fileName = headers['content-disposition'].replace(/\w+; filename=(.*)/, '$1')
            const blob = new Blob([data], { type: headers['content-type'] })
            const dom = document.createElement('a')
            const url = window.URL.createObjectURL(blob)

            dom.href = url
            dom.download = decodeURI(fileName)
            dom.style.display = 'none'
            document.body.appendChild(dom)
            dom.click()
            dom.parentNode?.removeChild(dom)
            window.URL.revokeObjectURL(url)
            handleClose()
            if (props.onDownloadComplete) props.onDownloadComplete()
          })
        } else {
          if (path[1] === 'endorsements') {
            url = memberservice.downloadTemplateEndorsement

            // payload3[0].queryParameters[0].action = props.action
          } else {
            url = memberservice.downloadTemplate
          }

          url(JSON.stringify(payload3), noOfRows, false, props.action).subscribe((res: any) => {
            const { data, headers } = res
            const fileName = headers['content-disposition'].replace(/\w+; filename=(.*)/, '$1')
            const blob = new Blob([data], { type: headers['content-type'] })
            const dom = document.createElement('a')
            const url = window.URL.createObjectURL(blob)

            dom.href = url
            dom.download = decodeURI(fileName)
            dom.style.display = 'none'
            document.body.appendChild(dom)
            dom.click()
            dom.parentNode?.removeChild(dom)
            window.URL.revokeObjectURL(url)
            handleClose()
            if (props.onDownloadComplete) props.onDownloadComplete()
          })
        }

        // var blob = new Blob([res], { type: "" });

        //   var blob = new Blob([s2ab(atob(data))],{
        //     type: ''
        // });
      }
    }

    // props.handleBlacklistSubmit(payload);
  }

  return (
    <StyledDialog
      open={props.openTemplate}
      onClose={handleClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      aria-labelledby="form-dialog-title"
      disableEnforceFocus
    >
      <DialogTitle
        id="form-dialog-title"
        sx={{
          fontWeight: 600,
          textAlign: 'center',
          color: '#BD3959',
          borderBottom: '1px solid #eee',
        }}
      >
        Member Template Input
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <StyledPaper>
          <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
            Please provide the required details below to download the member template.
          </Typography>

          <form onSubmit={handleModalSubmit}>
            <Grid container spacing={2}>
              {apiValList.map((x: any, i: number) => (
                <React.Fragment key={`api-${i}`}>
                  {x.pathVaraibles.map((y: any, j: number) => (
                    <Grid item xs={12} sm={6} key={`path-${j}`}>
                      <TextField
                        fullWidth
                        label={y.alias}
                        value={y.value}
                        required
                        onChange={(e) => handlePathParamChange(e, i, j)}
                      />
                    </Grid>
                  ))}

                  {x.queryParameters.map((y: any, j: number) =>
                    y.info === 'Plan Code' ?
                      // (
                      // <Grid item xs={12} sm={6} key={`query-${j}`}>
                      //   <FormControl fullWidth>
                      //     <FettleAutocomplete
                      //       id="plan"
                      //       name={y.urlPlaceholder}
                      //       label="Plan"
                      //       $datasource={planDataSourceCallback$}
                      //       changeDetect={true}
                      //       onChange={(e: any, newValue: any) => handlePlanChange(newValue, i, j)}
                      //     />
                      //   </FormControl>
                      // </Grid>
                      // ) 
                      null
                      : (
                        <Grid item xs={12} sm={6} key={`query-${j}`}>
                          <TextField
                            fullWidth
                            label={y.alias}
                            value={y.value}
                            required={y.required}
                            onChange={(e) => handleQueryParamChange(e, i, j)}
                          />
                        </Grid>
                      )
                  )}
                </React.Fragment>
              ))}

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Number of Rows"
                  type="number"
                  value={noOfRows}
                  onChange={handleRowInput}
                  required
                />
              </Grid>
            </Grid>
          </form>
        </StyledPaper>
      </DialogContent>

      <Divider sx={{ my: 1 }} />

      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button
          label="Cancel"
          severity="secondary"
          onClick={handleClose}
          className="p-button-text"
        />
        <Button
          label="Submit"
          icon="pi pi-check"
          className="p-button-rounded"
          severity="danger"
          onClick={handleModalSubmit}
        />
      </DialogActions>
    </StyledDialog>
  );
}
