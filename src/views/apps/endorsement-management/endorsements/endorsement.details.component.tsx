
import React, { useEffect, useState } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import MuiAlert from '@mui/lab/Alert'
import Snackbar from '@mui/material/Snackbar'
import type { AlertColor } from '@mui/material/Alert'

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import { map, switchMap } from 'rxjs/operators'

import { saveAs } from 'file-saver'

import { Observable } from 'rxjs'

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import FileUploadDialogComponent from '../../quotation-service-ui/src/components/file.upload.dialog'
import MemberTemplateModal from '../../quotation-service-ui/src/components/member.template.dialog'
import { ClientService } from '@/services/remote-api/api/client-services'
import { EndorsementService } from '@/services/remote-api/api/endorsement-services'
import { MemberProcessService, MemberService } from '@/services/remote-api/api/member-services'
import { PolicyService } from '@/services/remote-api/api/policy-services'
import { QuotationService } from '@/services/remote-api/api/quotation-services'

import sampleData from '../../claim-management/claim-to-be-processed/claim.sample.data'
import { InvoiceService } from '@/services/remote-api/api/invoice-services/invoice.services'
import { ProductService } from '@/services/remote-api/api/product-services/product.service'

import { replaceAll, toTitleCase } from '@/services/utility'
import { MemberFieldConstants } from '../../member-upload-management/MemberFieldConstants'
import { FettleMultiFieldSearch } from '../../shared-component/components/fettle.multi.field.search'
import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const clientService = new ClientService()

const memberservice = new MemberService()
const proposerservice = new PolicyService()
const endorsementservice = new EndorsementService()
const invoiceservice = new InvoiceService()
const productService = new ProductService()
const quotationService = new QuotationService()
const memberProcessService = new MemberProcessService()

const dataSource$ = (fields: any, pageRequest = { page: 0, size: 10 }) => {
  const pagerequestquery: any = {
    page: pageRequest.page,
    size: pageRequest.size,
    summary: true,
    active: true,
    sort: ['rowLastUpdatedDate dsc']
  }

  const pagerequestquery3: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true,
    sort: ['rowLastUpdatedDate dsc']
  }

  Object.keys(fields)
    .filter(key => !!fields[key])
    .forEach(key => {
      if (key === 'policyNo') {
        pagerequestquery['policyNo'] = fields[key]
      }
    })
  Object.keys(fields)
    .filter(key => !!fields[key])
    .forEach(key => {
      if (key === 'name') {
        pagerequestquery['clientName'] = fields[key]
        pagerequestquery3['name'] = fields[key]
      }
    })

  return clientService
    .getClients(pagerequestquery3)
    .pipe(
      map(cdata => {
        return cdata
      })
    )
    .pipe(
      switchMap(cdata => {
        return proposerservice.getPolicy(pagerequestquery).pipe(
          map(data => {
            console.log("12345678", cdata, data)
            cdata.content.forEach(cl => {
              data.content.forEach((pl: any) => {
                if (cl.id === pl.clientId) {
                  pl['proposerName'] = cl.clientBasicDetails.displayName
                }
              })
            })
            const content = data.content
            const arr: any = []
            if (pagerequestquery['policyNo']) {
              data.content.forEach((po: any) => {
                // po.policyDetails.forEach(pd => {
                if (po.policyNumber === pagerequestquery['policyNo']) {
                  const obj = {
                    policyNo: po.policyNumber,
                    anniversary: po.anniversary,
                    policyDate: new Date(po.policyStartDate).toLocaleDateString(),
                    proposerName: po.proposerName,
                    proposerId: po.id,
                    policyId: po.id,
                    invoiceId: po?.refSrcId
                  }

                  arr.push(obj)
                }

                // })
              })
            }

            if (pagerequestquery3['name']) {
              if (arr.length === 0) {
                cdata.content.forEach(cl => {
                  data.content.forEach((po: any) => {
                    if (cl.id === po.clientId) {
                      // po.policyDetails.forEach(pd => {
                      const obj = {
                        policyNo: po.policyNumber,
                        anniversary: po.anniversary,
                        policyDate: new Date(po.policyStartDate).toLocaleDateString(),
                        proposerName: po.proposerName,
                        proposerId: po.id,
                        policyId: po.id,
                        invoiceId: po?.refSrcId
                      }

                      arr.push(obj)

                      // })
                    }
                  })
                })
              }
            }

            data.content = arr

            // }
            // let content = data.content;
            // let records = content.map((item:any) =>{

            //   return item;
            // });
            // data.content = records;
            console.log("dataa", data)
            return data
          })
        )
      })
    )
}

const fields = [
  { label: 'Policy Code', propertyName: 'policyNo' },
  { label: 'Proposer/Client Name', propertyName: 'name' }
]

const columnsDefinations = [
  { field: 'policyNo', headerName: 'Policy Code' },
  { field: 'anniversary', headerName: 'Anniversary' },
  { field: 'proposerName', headerName: 'Proposer Name' },
  { field: 'policyDate', headerName: 'Policy Date' },
  { field: 'policyId', headerName: 'Policy ID' }
]

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

const useStyles = makeStyles(theme => ({
  formBg: {
    padding: '20px 0',
    backgroundColor: '#fff',

    // boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px',
    '& .MuiFormLabel-asterisk.MuiInputLabel-asterisk': {
      color: 'red'
    }
  },
  formControl: {
    minWidth: 182
  }
}))

const memberActionOptions = [
  {
    value: 'ADDITION',
    label: 'Addition of members'
  },
  {
    value: 'DELETION',
    label: 'Deletion of Members'
  },
  {
    value: 'NIL',
    label: 'Nil Endorsement'
  },
  {
    value: 'CHANGE_IN_DOB',
    label: 'Change in DOB'
  },
  {
    value: 'CHANGE_IN_GENDER',
    label: 'Change in Gender'
  },
  {
    value: 'CHANGE_IN_RELATIONSHIP',
    label: 'Change in Relationship'
  },
  {
    value: 'UPDATE_BASIC_DETAILS',
    label: 'Update Basic Details'
  },
  {
    value: 'SUSPENTION',
    label: 'Suspension of member'
  },
  {
    value: 'REINSTATEMENT',
    label: 'Reinstatement of deleted member'
  },
  {
    value: 'CATEGORY_CHANGE',
    label: 'Plan category change'
  },
  {
    value: 'SUM_INSURED_CHANGED',
    label: 'Sum Insured change'
  },
  {
    value: 'SUSPENSION_OF_POLICY',
    label: 'Suspension of policy'
  },
  {
    value: 'REINSTATEMENT_OF_POLICY',
    label: 'Reinstatement of policy'
  },
  {
    value: 'SUSPENSION_OF_BENEFIT',
    label: 'Suspension of benefit'
  },
  {
    value: 'REINSTATEMENT_OF_BENEFIT',
    label: 'Reinstatement of benefit'
  },
  {
    value: 'POLICY_EXTENSION',
    label: 'Policy extension'
  },
  {
    value: 'CARD_TYPE_CHANGE',
    label: 'Card type change'
  },
  {
    value: 'AML_RISK_CATEGORY',
    label: 'AML risk category'
  },
  {
    value: 'CHANGE_EMPLOYEE_CODE',
    label: 'Change in Employee code'
  }
]

export default function EndorsementDetails(props: any) {
  const history = useRouter()
  const query = useSearchParams()
  const classes = useStyles()
  const [memberIds, setMemberIds] = React.useState([])
  const [groupTypes, setGroupTypes] = React.useState([])
  const [prefixes, setPrefixes] = React.useState([])
  const [suffixes, setSuffixes] = React.useState([])
  const [showDeleteBtn, setShowDeleteBtn] = React.useState(false)
  const [openRequired, setOpenRequired] = React.useState(false)
  const [firstLoad, setFIrstLoad] = React.useState(true)
  const [reloadTable, setReloadTable] = React.useState(true)
  const [apiList, setApiList] = React.useState<any>([])
  const [memberColDefn, setMemberColDefn] = React.useState([])
  const [calculatePremeiumPayload, setCalculatePremeiumPayload] = useState()

  const [policyDetails, setPolicyDetails] = React.useState({
    proposerName: '',
    policyNo: '',
    anniversary: '',
    policyDate: '',
    policyId: '',
    invoice: ''
  })

  const [invoiceId, setInvoiceId] = useState<any>()

  const id: any = useParams().id
  const [selectedEndorsementDate, setSelectedEndorsementDate] = React.useState(new Date())
  const [openMemberUpload, setOpenMemberUpload] = React.useState(false)
  const [memberUpload, setMemberUpload] = React.useState(false)
  const [status, setStatus] = React.useState()

  const [state, setState] = React.useState({
    endorsementForm: {
      endorsementType: 'Bulk Endorsment',
      endorsementAction: '',
      endorsementDate: '',
      code: '',
      proposerId: '',
      policyNo: '',
      invoice: ''
    },

    // selectedEndorsementDate: new Date(),
    openTemplate: false,
    addFile: false

    // memberUpload: false,
  })

  const [openSnackbar, setOpenSnackbar] = React.useState(false)
  const [snackbarMessage, setSnackbarMessage] = React.useState('')
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<AlertColor>('success')

  useEffect(() => {
    localStorage.removeItem('endorsementId')
  }, [])

  const handleImport = (item: any) => {
    setState({
      ...state,
      endorsementForm: {
        ...state.endorsementForm,
        proposerId: item.proposerId,
        policyNo: item.policyNo,
        invoice: item.invoiceId
      }
    })
    setInvoiceId(item?.invoiceId)
    setPolicyDetails({
      proposerName: item.proposerName,
      policyNo: item.policyNo,
      policyId: item.policyId,
      anniversary: item.anniversary,
      policyDate: item.policyDate,
      invoice: item.refSrcId
    })

    // props.handleProspectImport(e);
  }

  React.useEffect(() => {
    if (id) {
      populateData(id)
    }
  }, [id])

  const populateData = (id: any) => {
    endorsementservice.getEndorsementDetail(id).subscribe(res => {
      setState({
        ...state,
        endorsementForm: {
          endorsementType: res.endorsementType,
          endorsementAction: res.action,
          endorsementDate: res.endorsementDate,
          code: res.code,
          proposerId: res.policyEndorsements && res.policyEndorsements[0]?.proposerId,
          policyNo: res.policyEndorsements && res.policyEndorsements[0]?.policyCode,
          invoice: ''
        },

        // selectedEndorsementDate: new Date(res.endorsementDate),
        openTemplate: false,
        addFile: false

        // memberUpload: false,
      })
      setStatus(res?.status)
      setMemberIds(res?.members)
      setOpenMemberUpload(false)
      setMemberUpload(false)
      setSelectedEndorsementDate(new Date(res.endorsementDate))

      proposerservice.getPolicyDetails(res.policyId).subscribe((pd: any) => {
        // pd.policyDetails.forEach(po => {
        // if (po.policyNo === res.policyEndorsements[0].policyCode) {
        clientService.getClientDetails(pd.clientId).subscribe((cl: any) => {
          setPolicyDetails({
            ...policyDetails,
            proposerName: cl.clientBasicDetails.displayName,
            policyNo: res.policyEndorsements && res.policyEndorsements[0].policyCode,
            anniversary: pd.anniversary,
            policyDate: new Date(pd?.policyEndDate).toLocaleDateString(),

            // policyDate: new Date(pd?.rennewalDate).toLocaleDateString(),
            invoice: pd?.refSrcId
          })

          // setInvoiceId(po.refSrcId);
          setInvoiceId(pd.invoiceId)
          setMemberUpload(true)

          // setState({
          //   ...state,
          //   memberUpload: true,
          // });
        })

        // }
        // });
      })
    })
  }

  const handleEndorsementDate = (date: any) => {
    const timestamp: any = new Date(date).getTime()

    setState({
      ...state,
      endorsementForm: {
        ...state.endorsementForm,
        endorsementDate: timestamp
      }

      // selectedEndorsementDate: date
    })
    setSelectedEndorsementDate(date)
  }

  const getMemberConfig = () => {
    return memberservice.getMemberConfiguration().subscribe((res: any) => {
      if (res.content && res.content.length > 0) {
        const colDef = res.content[0].fields.map((r: any) => {
          const obj: any = {
            field: MemberFieldConstants[r.name.toUpperCase() as keyof typeof MemberFieldConstants],
            headerName: toTitleCase(replaceAll(r.name, '_', ' '))
          }

          if (r.name == 'DATE_OF_BIRTH') {
            obj.body = (rowData: any) => {
              return <span style={{ lineBreak: 'anywhere' }}>{new Date(rowData.dateOfBirth).toLocaleDateString()}</span>
            }
          }

          if (r.name == 'MEMBERSHIP_NO') {
            obj.body = (rowData: any) => {
              return <span style={{ lineBreak: 'anywhere' }}>{rowData.membershipNo}</span>
            }
          }

          if (r.name == 'MOBILE_NO') {
            obj.body = (rowData: any) => {
              return <span style={{ lineBreak: 'anywhere' }}>{rowData.mobileNo}</span>
            }
          }

          if (r.name == 'EMAIL') {
            obj.body = (rowData: any) => {
              return <span style={{ lineBreak: 'anywhere' }}>{rowData.email}</span>
            }
          }

          return obj
        })

        setMemberColDefn(colDef)
        res.content[0].fields.forEach((el: any) => {
          if (el.sourceApiId) {
            getAPIDetails(el.sourceApiId)
          }
        })
      }
    })
  }

  const getAPIDetails = (sourceid: any) => {
    return memberservice.getSourceDetails(sourceid).subscribe((res: any) => {
      console.log("qwefg", res)
      setApiList([...apiList, res])
    })
  }

  function Alert(props: any) {
    return <MuiAlert elevation={6} variant='filled' {...props} />
  }

  // const useObservable = (observable, setter) => {
  //   useEffect(() => {
  //     let subscription = observable.subscribe(result => {
  //       setter(result.content);
  //     });
  //     return () => subscription.unsubscribe();
  //   }, [observable, setter]);
  // };
  // const useObservable1 = () => {
  useEffect(() => {
    getMemberConfig()
  }, [])

  // };

  // useObservable1();

  // const populateDetails = id => { };

  const handleSubmit = (event: any) => {
    // let payload = {
    //   //   endorsementDate: new Date(selectedEndorsementDate).getTime(),
    //   //   endorsementType: state.endorsementForm.endorsementType,
    //   //   policyEndorsements: [{ proposerId: state.endorsementForm.proposerId, policyCode: state.endorsementForm.policyNo }],
    //   policyId: state.endorsementForm.proposerId,
    //   action: state.endorsementForm.endorsementAction
    // };
    const endId = localStorage.getItem('endorsementId')

    endorsementservice.calculatePremium({}, id || endId, '').subscribe(res => {
      alert('SuccessFull')
      populateData(endId)
    })

    // endorsementservice.saveEndorsements(payload).subscribe(res => {
    //   // handleClose();
    //   // alert('Successfull');
    //   // setShowDeleteBtn(true);
    // });
  }

  const handleChange = (event: any) => {
    const { name, value } = event.target

    setState(prevState => ({
      ...prevState,
      endorsementForm: {
        ...prevState.endorsementForm,
        [name]: value
      }
    }))
  }

  const handleClose = () => {
    history.push('/endorsements?mode=viewList')

    // window.location.reload();
  }

  // const handleSnackClose = (event, reason) => {
  //   setOpenRequired(false);
  // };

  const openTemplateModal = () => {
    if (state.endorsementForm.endorsementAction === 'DELETE') {
      const filePath = '/sheets/memberSheet.xlsx'

      saveAs(filePath, 'memberDetails.xlsx')
    } else {
      setState({
        ...state,
        openTemplate: true
      })
    }
  }

  const closeTemplateModal = () => {
    setState({
      ...state,
      openTemplate: false
    })
  }

  const openMemberUploadModal = () => {
    setOpenMemberUpload(true)
  }

  const closeModal = () => {
    setOpenMemberUpload(false)

    // let endId = localStorage.getItem('endorsementId');
    // populateData(id || endId);
  }

  const changeFileStat = () => {
    setState({
      ...state,
      addFile: true
    })
  }

  // const getPolicyDetails = () => {
  //   invoiceservice.getInvoiceDetails(invoiceId).subscribe(res => {
  //     quotationService.getQuoationDetailsByID(res?.quotationId).subscribe(quo => {
  //       let payload: any = {
  //         id: 'id_703d3add4717',
  //         prospectId: quo?.prospectId,

  //         paymentFrequency: quo?.paymentFrequency,
  //         productId: quo?.productId,
  //         policyId: policyDetails?.policyId,
  //         planId: quo?.planId,
  //         policyStartDate: quo?.policyStartDate,
  //         policyEndDate: quo?.policyEndDate,
  //         catagoryPremiumRules: quo?.catagoryPremiumRules
  //       }
  //       setCalculatePremeiumPayload(payload)
  //     })
  //   })
  // }

  const onComplete = () => {
    setMemberUpload(true)

    // setState({
    //   ...state,
    //   memberUpload: true,
    // });
    // getPolicyDetails()
  }

  const handleCancel = () => { }

  const handleDelete = () => {
    const payload = {}

    endorsementservice.deleteMember(payload, '').subscribe(res => {
      handleClose()
    })
  }

  // const columnsDefinations = [
  //   { field: 'NAME', headerName: 'Name' },
  //   { field: 'EMPLOYEE_ID', headerName: 'Employee ID' },

  //   { field: 'RELATIONS', headerName: 'Policy Id' },
  //   { field: 'DATE_OF_BIRTH', headerName: 'Date of Birth' },
  //   { field: 'GENDER', headerName: 'Gender' },
  //   { field: 'EMAIL', headerName: 'Email' },
  //   { field: 'MOBILE_NO', headerName: 'Mobile' },
  //   { field: 'PLAN_SCHEME', headerName: 'Plan Scheme' },
  //   { field: 'IDENTIFICATION_DOC_TYPE', headerName: 'Identification Doc Type' },
  //   { field: 'IDENTIFICATION_DOC_NUMBER', headerName: 'Identification Doc no' },
  //   { field: 'EFFECTIVE_DATE', headerName: 'Effective Date' },
  // ];

  const configuration: any = {
    scrollHeight: '300px',
    pageSize: 10,
    header: {
      enable: true,

      // text: 'Endorsement Management',
      text: `${state.endorsementForm.endorsementAction}`,

      // enableGlobalSearch: true,
      // searchText: 'Search by Endorsement number',
      selectionMenuButtonText: 'Action'
    }
  }

  const data$ = new Observable(subscriber => {
    subscriber.next(sampleData)
  })

  const dataSourceMember$: any = (
    pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      // policyStatus: 'ACTIVE'
    }
  ) => {
    if (memberIds.length) {
      const memberIdList = memberIds?.map((el: any) => el?.memberId)

      pageRequest.memberids = memberIdList

      return memberProcessService.getMemberFromIds(pageRequest)
    } else {
      pageRequest.key = 'sourceType'
      pageRequest.value = 'ENDORSEMENT'
      pageRequest.key2 = 'sourceId'
      pageRequest.value2 = localStorage.getItem('endorsementId') || id

      return memberProcessService.getMemberRequests(pageRequest)
    }
  }

  // const dataSourceMember$ = () => {
  //   return data$.pipe(
  //     map(data => {
  //       data.content = data;
  //       return data;
  //     })
  //   );
  // };

  const handleDownloadTemplateClick = () => {
    if (openTemplateModal) openTemplateModal()
  }
  const handleMemberUploadClick = () => {
    if (openMemberUploadModal) openMemberUploadModal()
  }

  return (
    <div className={classes.formBg}>
      <div>
        {query.get('mode') === 'edit' ? (
          <Grid
            item
            xs={12}
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '20px',
              height: '2em',
              color: '#000',
              fontSize: '18px',
              padding: '0 2rem',
            }}
          >
            <span
              style={{
                fontWeight: '600',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // marginLeft: '15px'
              }}
            >
              Endorsement Management
            </span>
          </Grid>
        ) : null}
      </div>
      {state.openTemplate && (
        <MemberTemplateModal
          closeTemplateModal={closeTemplateModal}
          openTemplate={state.openTemplate}
          apiList={apiList.length !== 0 ? apiList : []}
          action={state.endorsementForm.endorsementAction}
          onDownloadComplete={() => {
            setSnackbarMessage('Template downloaded successfully!')
            setSnackbarSeverity('success')
            setOpenSnackbar(true)
          }}
        // handleModalSubmit={handleModalSubmit}
        />
      )}
      <FileUploadDialogComponent
        open={openMemberUpload}
        closeModal={closeModal}
        addFile={state.addFile}
        changeFileStat={changeFileStat}
        onComplete={onComplete}
        action={state.endorsementForm.endorsementAction}
        policyCode={policyDetails.policyNo}
        policyId={policyDetails.policyId}
        endorsementDate={selectedEndorsementDate}
        isEndorsement={true}
        id={localStorage.getItem('endorsementId') || id}
        onUploadComplete={() => {
          setSnackbarMessage('Member uploaded successfully!')
          setSnackbarSeverity('success')
          setOpenSnackbar(true)
        }}
      />
      {/* <FormControl component="fieldset">
        <FormLabel component="legend">Endorsement Type</FormLabel>
        <RadioGroup
          row
          aria-label="endorsementType"
          name="endorsementType"
          value={state.endorsementForm.endorsementType}
          onChange={handleChange}>
          <FormControlLabel
            value="Individual Endorsement"
            control={<Radio color="primary" />}
            label="Individual Endorsement"
          />
          <FormControlLabel value="Bulk Endorsement" control={<Radio color="primary" />} label="Bulk Endorsement" />
        </RadioGroup>
      </FormControl> */}
      {state.endorsementForm.endorsementType !== '' && state.endorsementForm.endorsementType !== null && (
        <>
          {!id && (
            <Paper elevation={0}>
              <Box p={3} my={2}>
                <FettleMultiFieldSearch
                  $datasource={dataSource$}
                  fields={fields}
                  onSelect={(item: any) => {
                    handleImport(item)
                  }}
                  columnsDefinations={columnsDefinations}
                  dataGridPageSize={10}
                  dataGridScrollHeight='200px'
                />
              </Box>
            </Paper>
          )}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              marginTop: '20px',
              padding: '0.2rem 2rem'
            }}
          >
            {[
              { label: 'Addition of Member', value: 'ADDITION' },
              { label: 'Deletion of Member', value: 'DELETION' },
              { label: 'Update Endorsement', value: 'UPDATE_BASIC_DETAILS' },
              { label: 'Plan Category Change', value: 'CATEGORY_CHANGE' },
              { label: 'Sum Insured Change', value: 'SUM_INSURED_CHANGED' },
              { label: 'Suspension of Member', value: 'SUSPENTION' },
              { label: 'Reinstatement of Member', value: 'REINSTATEMENT' },
              { label: 'Suspension of Policy', value: 'SUSPENSION_OF_POLICY' },
              { label: 'Reinstatement of Policy', value: 'REINSTATEMENT_OF_POLICY' },
              { label: 'Suspension of Benefit', value: 'SUSPENSION_OF_BENEFIT' },
              { label: 'Reinstatement of Benefit', value: 'REINSTATEMENT_OF_BENEFIT' }
            ].map((action, index) => {
              const isSelected = state.endorsementForm.endorsementAction === action.value
              return (
                <Box
                  key={index}
                  onClick={() =>
                    setState(prev => ({
                      ...prev,
                      endorsementForm: {
                        ...prev.endorsementForm,
                        endorsementAction: action.value
                      }
                    }))
                  }
                  sx={{
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #d80f51' : '1px solid gray',
                    backgroundColor: isSelected ? '#d80f51' : 'white',
                    cursor: 'pointer',
                    minWidth: '200px',
                    height: '100%',
                    color: isSelected ? 'white' : 'gray',
                    fontWeight: isSelected ? 600 : 400,
                    opacity: 0.9,
                    fontSize: { xs: '11px', sm: '12px', md: '13px' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                    padding: '6px 10px',
                    marginRight: '8px',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: '#d80f51',
                      backgroundColor: 'white',
                      color: '#d80f51'
                    }
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {action.label}
                  </span>
                </Box>
              )
            })}
          </div>
          <Grid container spacing={3} style={{ marginTop: '15px', padding: '2rem' }}>
            <Grid
              container
              spacing={3}
              sx={{
                // border: '1px solid #ccc',
                p: '0.5rem',
                backgroundColor: '#fff',
                boxShadow: '0px 3px 3px -2px white',
                borderRadius: '4px',
                alignItems: 'center',
              }}
            >
              {[
                { label: 'Proposer Name', name: 'proposerName', value: policyDetails.proposerName },
                { label: 'Policy Code', name: 'policyNo', value: policyDetails.policyNo },
                { label: 'Anniversary', name: 'anniversary', value: policyDetails.anniversary },
                { label: 'Policy Date', name: 'policyDate', value: policyDetails.policyDate },
              ].map((item, index) => (
                <Grid item xs={3} key={index}>
                  <TextField
                    fullWidth
                    disabled
                    id={item.name}
                    name={item.name}
                    label={item.label}
                    value={item.value || ''}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              ))}

              {/* <Grid item xs={3}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="member-action-label">Member Action</InputLabel>
                  <Select
                    labelId="member-action-label"
                    id="member-action"
                    name="endorsementAction"
                    label="Member Action"
                    value={state.endorsementForm.endorsementAction}
                    onChange={handleChange}
                  >
                    {memberActionOptions.map(ele => (
                      <MenuItem value={ele.value} key={ele.value}>
                        {ele.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid> */}

              <Grid item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Endorsement Date"
                    value={selectedEndorsementDate}
                    onChange={handleEndorsementDate}
                    renderInput={params => (
                      <TextField
                        {...params}
                        fullWidth
                        size="small"
                        variant="outlined"
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={3}>
                {state.endorsementForm.endorsementAction && (
                  <Button color="primary" onClick={handleDownloadTemplateClick}>
                    Download Template
                  </Button>
                )}
              </Grid>

              <Grid item xs={3}>
                {state.endorsementForm.endorsementAction && (
                  <Button color="primary" onClick={handleMemberUploadClick}>
                    Member Upload
                  </Button>
                )}
              </Grid>
            </Grid>

            {memberUpload && (
              <>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'end' }}>
                  <Button
                    onClick={() => {
                      populateData(localStorage.getItem('endorsementId'))
                      setTimeout(() => {
                        setReloadTable(true)
                      }, 500)
                      setTimeout(() => {
                        setReloadTable(false)
                      }, 1500)
                    }}
                  >
                    Reload Table
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <FettleDataGrid
                    $datasource={dataSourceMember$}
                    columnsdefination={memberColDefn}
                    // columnsdefination={state.endorsementForm.endorsementAction === "ADDITION" ? Addition : Deletion}
                    // onEdit={openEditSection}
                    config={configuration}
                    reloadtable={reloadTable}
                  />
                </Grid>
              </>
            )}
            {showDeleteBtn ? (
              <Button className='p-button-danger' color='primary' onClick={handleDelete}>
                Delete
              </Button>
            ) : (
              <Grid container spacing={3} style={{ marginTop: '50px', display: 'flex', justifyContent: 'flex-end' }}>
                {(id || memberUpload) && status !== 'APPROVED' && (
                  <Button color='primary' onClick={handleSubmit}>
                    Calculate Premuim
                  </Button>
                )}
                <Button
                  color='primary'
                  className={!id ? 'p-button-text' : 'p-button'}
                  style={{ marginLeft: '10px' }}
                  onClick={handleClose}
                >
                  Cancel
                  {/* {!id ? 'Cancel' : 'OK'} */}
                </Button>
              </Grid>
            )}
          </Grid>
          {/* )} */}
        </>
      )
      }
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
        <MuiAlert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} elevation={6} variant='filled'>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div >
  )
}
