import * as React from 'react'
import { useEffect } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { Divider, Grid, TextField } from '@mui/material'
import { Button } from 'primereact/button'

import 'date-fns'

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

import { forkJoin } from 'rxjs'

import claimsReviewModel, { REIM_STATUS_MSG_MAP } from './shared'
import { MemberService } from '@/services/remote-api/api/member-services'
import { BenefitService, ProvidersService, ServiceTypeService } from '@/services/remote-api/fettle-remote-api'

import { ReimbursementService } from '@/services/remote-api/api/claims-services/claim.reimbursement.services'

import downloadFileResponseExecution from '@/utils/file.util'

export default function ClaimReview(props: any) {
  const [claimReimDetails, setclaimReimDetails] = React.useState<any>(claimsReviewModel())
  const id: any = useParams().id
  const history = useRouter()
  const [fullWidth, setFullWidth] = React.useState(true)
  const [comment, setComment] = React.useState(null)
  const [cnfText, setCnfText] = React.useState(null)
  const [disableCalculateButton, setDisableCalculateButton] = React.useState(true)

  const handleClose = () => {
    props.onClose()
  }

  const reimService = new ReimbursementService()
  const memberservice = new MemberService()
  const benefitService = new BenefitService()
  const providerService = new ProvidersService()
  const serviceDiagnosis = new ServiceTypeService()

  useEffect(() => {
    if (id) {
      populateReimbursement()
    }
  }, [id])

  const populateReimbursement = () => {
    const serviceAll$ = forkJoin(
      serviceDiagnosis.getServicesbyId('867854950947827712', {
        page: 0,
        size: 1000,
        summary: true,
        active: true,
        nonGroupedServices: false
      }),
      serviceDiagnosis.getServicesbyId('867855014529282048', {
        page: 0,
        size: 1000,
        summary: true,
        active: true,
        nonGroupedServices: false
      }),
      serviceDiagnosis.getServicesbyId('867855088575524864', {
        page: 0,
        size: 1000,
        summary: true,
        active: true,
        nonGroupedServices: false
      }),
      serviceDiagnosis.getServicesbyId('867855148155613184', {
        page: 0,
        size: 1000,
        summary: true,
        active: true,
        nonGroupedServices: false
      })
    )

    const frk$ = forkJoin({
      providers: providerService.getProviders({
        page: 0,
        size: 10000,
        summary: true,
        active: true
      }),
      bts: benefitService.getAllBenefit({ page: 0, size: 1000, summary: true }),
      reimDetails: reimService.getReimbursementById(id),
      services: serviceAll$
    })

    frk$.subscribe((data: any) => {
      if (data.reimDetails.invoices && data.reimDetails.invoices.length !== 0) {
        data.providers.content.forEach((proAll: any) => {
          data.reimDetails.invoices.forEach((pr: any) => {
            if (proAll.id === pr.provideId) {
              pr['providerName'] = proAll.providerBasicDetails?.name
            }
          })
        })
      }

      data.bts.content.forEach((benall: any) => {
        data.reimDetails.benefitsWithCost.forEach((benefit: any) => {
          if (benefit.benefitId === benall.id) {
            benefit['benefitName'] = benall.name
          }
        })
      })
      const serviceList = []

      data.services.forEach((ser: any) => {
        ser.content.forEach((sr: any) => {
          serviceList.push(sr)
        })
      })

      // serviceList.forEach(ser => {
      //   data.preAuth.services.forEach(service => {
      //     if(service.serviceId === ser.id){
      //       service['serviceName'] = ser.name;
      //     }
      //   })
      // })
      const pageRequest = {
        page: 0,
        size: 10,
        summary: true,
        active: true,
        key: 'MEMBERSHIP_NO',
        value: data.reimDetails.memberShipNo,
        key1: 'policyNumber',
        value1: data.reimDetails.policyNumber
      }

      memberservice.getMember(pageRequest).subscribe(res => {
        if (res.content?.length > 0) {
          const member = res.content[0]

          const obj = {
            member: member,
            reim: data.reimDetails
          }

          setclaimReimDetails(obj)
        }
      })
    })

    // preAuthService.getPreAuthById(id).subscribe(preAuth => {
    //     let pageRequest = {
    //         page: 0,
    //         size: 10,
    //         summary: true,
    //         active: true,
    //         key:'MEMBERSHIP_NO',
    //         value:preAuth.memberShipNo,
    //         key1:'policyNumber',
    //         value1:preAuth.policyNumber
    //       }
    //       memberservice.getMember(pageRequest).subscribe(res=>{
    //         if(res.content?.length > 0){
    //           const member= res.content[0];
    //           setclaimReimDetails({member,preAuth});
    //         }
    //       });

    // });
  }

  const handleModalSubmit = () => { }

  const buildBenefitWithCostView = (bwc: any) => {
    return (
      <Grid container>
        <Grid item xs={3}>
          {bwc.benefitName}
        </Grid>
        <Grid item xs={3}>
          {bwc.maxApprovedCost}
        </Grid>
        <Grid item xs={3}>
          {bwc.copayAmount}
        </Grid>
      </Grid>
    )
  }

  const downloadDoc = (doc: any) => {
    reimService.downloadDoc(id, doc.documentName).subscribe(res => downloadFileResponseExecution(res))
  }

  const buildInvoicesView = (provider: any) => {
    return (
      <Grid container>
        <Grid item xs={3}>
          {provider.providerName}
        </Grid>
        <Grid item xs={3}>
          {provider.invoiceAmount}
        </Grid>
        <Grid item xs={3}>
          {provider.invoiceNo}
        </Grid>
        <Grid item xs={3}>
          {provider.transactionNo}
        </Grid>
      </Grid>
    )
  }

  const buildServiceWithCostView = (service: any) => {
    return (
      <Grid container>
        <Grid item xs={4}>
          {service.serviceName}
        </Grid>
        <Grid item xs={8}>
          {service.estimatedCost}
        </Grid>
      </Grid>
    )
  }

  const buildDocumentView = (doc: any) => {
    return (
      <Grid container>
        <Grid item xs={3}>
          {doc.documentType}
        </Grid>
        <Grid item xs={7}>
          {doc.documentOriginalName}
        </Grid>
        <Grid item xs={2}>
          <ArrowDownwardIcon style={{ cursor: 'pointer' }} onClick={() => downloadDoc(doc)}></ArrowDownwardIcon>
        </Grid>
      </Grid>
    )
  }

  const requestForCalculate = () => {
    reimService.editReimbursement({}, id, 'calculate').subscribe(r => {
      // let model = { ...claimsReviewModel };
      // model.preAuth = { ...model.preAuth, calculationStatus: 'INPROGRESS' };
      // props.setState(model)
      populateReimbursement()
    })
  }

  const requestForStartReview = () => {
    reimService.editReimbursement({}, id, 'evs').subscribe(r => {
      populateReimbursement()
    })
  }

  const showCalculateButton = () => {
    return (
      claimReimDetails.reim.reimbursementStatus == 'EVALUATION_INPROGRESS' && (
        <Button onClick={requestForCalculate} disabled={claimReimDetails.reim.calculationStatus == 'INPROGRESS'}>
          {claimReimDetails.reim.calculationStatus == 'INPROGRESS' ? 'Calculating...' : 'Calculate'}
        </Button>
      )
    )
  }

  const showReviewStartButton = () => {
    return (
      claimReimDetails.reim.reimbursementStatus == 'REQUESTED' && (
        <Button onClick={requestForStartReview}>Start Review</Button>
      )
    )
  }

  const onDecission = (decission: any) => {
    if ((decission == 'APPROVED' && cnfText === 'approve') || (decission == 'REJECTED' && cnfText === 'reject')) {
      reimService.editReimbursement({ decission: decission, comment: comment }, id, 'decission').subscribe(r => {
        // window.location.reload();
        history.push('/claims/claims-reimbursement?mode=viewList')
      })
    }
  }

  const showApprovedAndRejectButtons = () => {
    if (
      claimReimDetails.reim.reimbursementStatus == 'EVALUATION_INPROGRESS' ||
      claimReimDetails.reim.reimbursementStatus == 'APPROVED_FAILED'
    ) {
      return (
        <React.Fragment>
          <Button
            disabled={claimReimDetails.reim.calculationStatus != 'COMPLETED'}
            onClick={() => onDecission('APPROVED')}
          >
            Approve
          </Button>
          <Button onClick={() => onDecission('REJECTED')}>Reject</Button>
        </React.Fragment>
      )
    } else {
      return null
    }
  }

  const showReviewerComment = () => {
    if (
      claimReimDetails.reim.reimbursementStatus == 'APPROVED' ||
      claimReimDetails.reim.reimbursementStatus == 'REJECTED'
    ) {
      return (
        <div style={{ padding: '5px' }}>
          <strong>Reviewer comment</strong>
          <Divider />
          <Grid container>
            <Grid item xs={12}>
              <p>{claimReimDetails.reim.comment}</p>
            </Grid>
          </Grid>
        </div>
      )
    } else {
      return null
    }
  }

  const handleChangeOfDecitionText = (event: any) => {
    setCnfText(event.target.value)
  }

  const handleChangeOfCommentText = (event: any) => {
    setComment(event.target.value)
  }

  const showCommentBox = () => {
    if (
      claimReimDetails.reim.reimbursementStatus == 'EVALUATION_INPROGRESS' ||
      claimReimDetails.reim.reimbursementStatus == 'APPROVED_FAILED'
    ) {
      return (
        <div style={{ padding: '5px' }}>
          <strong>Reviewer input</strong>
          <Divider />
          <Grid container rowSpacing={5}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label='Type approve or reject for respective operation'
                id='fullWidth'
                onChange={handleChangeOfDecitionText}
              />
            </Grid>
            <hr />
            <Grid item xs={12}>
              <TextField
                required
                id='filled-multiline-static'
                label='Add comment'
                multiline
                fullWidth
                rows={4}
                variant='filled'
                onChange={handleChangeOfCommentText}
              />
            </Grid>
          </Grid>
        </div>
      )
    }
  }

  return (
    <>
      <Grid container>
        <Grid item xs={8}>
          Reimbursement : {id}
        </Grid>
        <Grid item xs={4}>
          <span style={{ float: 'right' }}>
            {REIM_STATUS_MSG_MAP[claimReimDetails.reim.reimbursementStatus as keyof typeof REIM_STATUS_MSG_MAP]}
          </span>
        </Grid>
      </Grid>

      <>
        <div style={{ padding: '5px' }}>
          <strong>Member details</strong>
          <Divider />

          <Grid container spacing={0.5}>
            <Grid item xs={3}>
              <span>Membership No: </span>
            </Grid>
            <Grid item xs={9}>
              <span>{claimReimDetails.member.membershipNo}</span>
            </Grid>

            <Grid item xs={3}>
              <span>Name: </span>
            </Grid>
            <Grid item xs={9}>
              <span>{claimReimDetails.member.name}</span>
            </Grid>

            <Grid item xs={3}>
              <span>Age: </span>
            </Grid>
            <Grid item xs={9}>
              <span>{claimReimDetails.member.age}</span>
            </Grid>

            <Grid item xs={3}>
              <span>Relations: </span>
            </Grid>
            <Grid item xs={9}>
              <span>{claimReimDetails.member.relations}</span>
            </Grid>
          </Grid>
        </div>

        {/* <!-- policy details --> */}

        <div style={{ padding: '5px' }}>
          <strong>Policy details</strong>
          <Divider />

          <Grid container spacing={0.5}>
            <Grid item xs={3}>
              <span>Policy No: </span>
            </Grid>
            <Grid item xs={9}>
              <span>{claimReimDetails.member.policyNumber}</span>
            </Grid>

            <Grid item xs={3}>
              <span>Policy start date: </span>
            </Grid>
            <Grid item xs={9}>
              <span>{new Date(claimReimDetails.member.policyStartDate).toLocaleDateString()}</span>
            </Grid>

            <Grid item xs={3}>
              <span>Policy end date: </span>
            </Grid>
            <Grid item xs={9}>
              <span>{new Date(claimReimDetails.member.policyEndDate).toLocaleDateString()}</span>
            </Grid>
          </Grid>
        </div>

        {/* <!-- Other details --> */}

        <div style={{ padding: '5px' }}>
          <strong>Other details</strong>
          <Divider />

          <Grid container spacing={0.5} rowSpacing={1}>
            <Grid item xs={3}>
              <span>Date of admission: </span>
            </Grid>
            <Grid item xs={9}>
              <span>{new Date(claimReimDetails.reim.expectedDOA).toLocaleDateString()}</span>
            </Grid>

            <Grid item xs={3}>
              <span>Date of discharge: </span>
            </Grid>
            <Grid item xs={9}>
              <span>{new Date(claimReimDetails.reim.expectedDOD).toLocaleDateString()}</span>
            </Grid>

            <Grid item xs={3}>
              <span>Contact No1: </span>
            </Grid>
            <Grid item xs={9}>
              <span>{claimReimDetails.reim.contactNoOne}</span>
            </Grid>
            <Grid item xs={3}>
              <span>Contact No2: </span>
            </Grid>
            <Grid item xs={9}>
              <span>{claimReimDetails.reim.contactNoTwo || 'NA'}</span>
            </Grid>

            <Grid item xs={3}>
              <span>Diagnosis: </span>
            </Grid>

            <Grid item xs={9}>
              <ul>{claimReimDetails.reim.diagnosis?.map((d: any, i: number) => <li key={i}>{d}</li>)}</ul>
            </Grid>

            <Grid item xs={12} style={{ marginTop: '1em' }}>
              <span>Benefits: </span>
            </Grid>

            <Grid container>
              <Grid item xs={3}>
                <strong>Name</strong>
              </Grid>
              <Grid item xs={3}>
                <strong>Approved Cost</strong>
              </Grid>
              <Grid item xs={3}>
                <strong>Copay</strong>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {claimReimDetails.reim.benefitsWithCost.map((bwc: any) => buildBenefitWithCostView(bwc))}
            </Grid>

            <Grid item xs={12} style={{ marginTop: '1em' }}>
              <span>Invoices: </span>
            </Grid>

            <Grid container>
              <Grid item xs={3}>
                <strong>Provider Name</strong>
              </Grid>
              <Grid item xs={3}>
                <strong>Invoice Amount</strong>
              </Grid>
              <Grid item xs={3}>
                <strong>Invoice Number</strong>
              </Grid>
              <Grid item xs={3}>
                <strong>Transaction Number</strong>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              {claimReimDetails.reim.invoices &&
                claimReimDetails.reim.invoices.length !== 0 &&
                claimReimDetails.reim.invoices.map((inv: any) => buildInvoicesView(inv))}
            </Grid>

            {/* <Grid item xs={12} style={{ marginTop: '1em' }}>
              <span>Service Details: </span>
            </Grid>

            <Grid container>
              <Grid item xs={4}><strong>Name</strong></Grid>
              <Grid item xs={8}><strong>Estimated cost</strong></Grid>
            </Grid>

            <Grid item xs={12}>
              {
                claimReimDetails.reim.services.map(
                  (s) => buildServiceWithCostView(s))
              }
            </Grid> */}

            <Grid item xs={12} style={{ marginTop: '1em' }}>
              <span>Docs: </span>
            </Grid>

            <Grid container>
              <Grid item xs={3}>
                <strong>Doc type</strong>
              </Grid>
              <Grid item xs={7}>
                <strong>Name</strong>
              </Grid>
              <Grid item xs={2}></Grid>
            </Grid>

            <Grid item xs={12}>
              {claimReimDetails.reim.documents.map((d: any) => buildDocumentView(d))}
            </Grid>
          </Grid>
        </div>
        <Grid container>
          {showCommentBox()}

          {showReviewerComment()}
        </Grid>
      </>

      <Grid container>
        {showReviewStartButton()}
        {showCalculateButton()}
        {showApprovedAndRejectButtons()}
      </Grid>
    </>
  )
}
