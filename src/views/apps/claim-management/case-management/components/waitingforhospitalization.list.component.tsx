
import React, { useEffect, useRef, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Toast } from 'primereact/toast'
import { forkJoin } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

import { PreAuthService } from '@/services/remote-api/api/claims-services/claim.preauth.services'
import { MemberService } from '@/services/remote-api/api/member-services'
import { ProvidersService } from '@/services/remote-api/api/provider-services'
import AdmisssionUpdationModal from '../modal/waiting-for-hospitalisation/admission.updation.modal'
import CanellationModal from '../modal/waiting-for-hospitalisation/cancellation.modal'
import HospitalVisitUpdationModal from '../modal/waiting-for-hospitalisation/hospital.visit.updation.modal'
import PreAuthTimeLineModal from '../../claim-preauth/modals/preauth.timeline.modal.component'

import { FettleDataGrid } from '@/views/apps/shared-component/components/fettle.data.grid'

const preAuthService = new PreAuthService()
const providersService = new ProvidersService()
const memberService = new MemberService()

const docTempalte = {
  documentType: '',
  docFormat: '',
  documentName: '',
  documentOriginalName: ''
}

const useStyles = makeStyles(theme => ({
  tableBg: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  },
  agentListButton: {
    marginLeft: '5px'
  },
  header: {
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '10px 10px 0px 0px',
    background: '#0edb8a',
    padding: 20,
    borderBottom: 'none'
  },
  headerText: {
    fontSize: '16px',
    fontWeight: 'Bold',
    color: '#002776'
  }
}))

function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()

    return <Component {...props} router={router} />
  }
}

const PatientListCompoent = () => {
  const [admissionUpdationModal, setAdmissionUpdationModal] = React.useState(false)
  const [hospitaVisitUpdation, setHospitaVisitUpdation] = React.useState(false)
  const [cancellationModal, setCancellationModal] = React.useState(false)
  const [preAuthId, setPreAuthId] = React.useState<any>()
  const [memberShipNo, setMemberShipNo] = React.useState()
  const [documentList, setDocumentList] = React.useState([{ ...docTempalte }])
  const [benefitsWithCost, setBenefitSWithCost] = React.useState([])
  const [providers, setProviders] = useState<any>()
  const [selectedPreAuth, setSelectedPreAuth] = React.useState({})
  const [openTimeLineModal, setOpenTimeLineModal] = React.useState(false)

  const classes = useStyles()
  const id: any = useParams().id
  const toast: any = useRef(null)

  useEffect(() => {
    const subscription = providersService
      .getProviders({ page: 0, size: 10000, summary: true, active: true, sort: ['rowCreatedDate dsc'] })
      .subscribe(result => {
        setProviders(result.content)
      })

    return () => subscription.unsubscribe()
  }, [])

  const handleAdmissionUpdate = (rowData: any) => {
    const { id, memberShipNo } = rowData
    const benefitsWCost = rowData.benefitsWithCost

    setBenefitSWithCost(benefitsWCost)
    setAdmissionUpdationModal(true)
    setPreAuthId(id)
    setMemberShipNo(memberShipNo)
  }

  const handleCloseAdmissionModal = () => {
    setAdmissionUpdationModal(false)
  }

  const handleHospitalVisitUpdate = (rowData: any) => {
    const benefitsWCost = rowData.benefitsWithCost
    const { id, memberShipNo } = rowData

    setHospitaVisitUpdation(true)
    setPreAuthId(id)
    setMemberShipNo(memberShipNo)
    setBenefitSWithCost(benefitsWCost)
  }

  const handleCloseHospitalVisitUpdate = () => {
    setHospitaVisitUpdation(false)
  }

  const handleCancellationModal = (rowData: any) => {
    const benefitsWCost = rowData.benefitsWithCost
    const { id, memberShipNo } = rowData

    setCancellationModal(true)
    setPreAuthId(id)
    setMemberShipNo(memberShipNo)
    setBenefitSWithCost(benefitsWCost)
  }

  const handleCloseCancellationModal = () => {
    setCancellationModal(false)
  }

  const statusApi: any = {
    today: 'TODAY',
    thisweek: 'THIS_WEEK',
    thismonth: 'THIS_MONTH',
    thisyear: 'THIS_YEAR'
  }

  const dataSource$: any = (
    pageRequest: any = {
      page: 0,
      size: 10
    }
  ) => {
    pageRequest.sort = ['rowCreatedDate dsc']
    pageRequest['hospitalizationStatus'] = 'WAITING_FOR_HOSPITALIZATION'
    pageRequest['durationType'] = statusApi[id]

    // Fetch the provider list first
    return providersService.getProviders().pipe(
      switchMap(providerResponse => {
        return preAuthService.getCaseStatusList(pageRequest).pipe(
          switchMap(data => {
            const detailObservables = data?.content?.map(item => {
              const { memberShipNo, providers } = item

              const providerName = (id: any) =>
                providerResponse?.content.find(prov => prov.id == id)?.providerBasicDetails.name || ''

              item['providers'] = providers?.map((item: any) => ({
                ...item,
                providerName: providerName(item.providerId)
              }))

              const pageRequest = {
                page: 0,
                size: 10,
                summary: true,
                active: true,
                key: 'MEMBERSHIP_NO',
                value: memberShipNo
              }

              const memberDetails$ = memberService.getMember(pageRequest)

              return forkJoin({ memberDetails$ }).pipe(
                map(({ memberDetails$ }) => {
                  return {
                    memberShipName: memberDetails$?.content[0]?.name || 'Not available'
                  }
                })
              )
            })

            return forkJoin(detailObservables).pipe(
              map(details => {
                // data.content = data?.content.map((item, index) => {
                //   console.log('item', item);
                //   return {
                //     ['serial']: index + 1,
                //     ['memberDetails']: (
                //       <MemberDetails
                //         preAuthId={item.id}
                //         memberShipNo={item.memberShipNo}
                //         memberShipName={details[index].memberShipName}
                //         doa={item.expectedDOA}
                //         dod={item.expectedDOD}
                //         providers={item.providers
                //           ?.map((item, index) =>
                //             item.providerName ? `${index + 1}. ${item.providerName}` : 'Not Available',
                //           )
                //           .join('<br>')}
                //       />
                //     ),
                //     ['accounts']: <AccountGrid benefitsWithCost={item.benefitsWithCost} />,
                //     ['diagnosis']: (
                //       <DiagnosisGrid
                //         diagnosis={'CARCINOMA IN SITU OF ORAL CAVITY AND STOMACH[$42.33]'}
                //         procedure={'MEDICAL NUTRITION THERAPY'}
                //       />
                //     ),
                //   };
                // });
                return data
              })
            )
          })
        )
      })
    )
  }

  const openTimeLine = (preAuth: any) => {
    setSelectedPreAuth(preAuth)
    setOpenTimeLineModal(true)
  }

  const handleCloseTimeLineModal = () => {
    setOpenTimeLineModal(false)
  }

  const xlsColumns = [
    'id',
    'memberShipNo',
    'memberName',
    'policyNumber',
    'admissionDate',
    'dischargeDate',
    'benefitWithCost'
  ]

  const userType = localStorage.getItem('userType')

  const configuration: any = {
    enableSelection: false,
    scrollHeight: '500px',
    pageSize: 10,
    rowExpand: true,
    actionButtons:
      userType === 'TPA'
        ? ''
        : [
          {
            icon: 'pi pi-check-circle',
            className: 'ui-button-warning',
            tooltip: 'Admitted',
            onClick: handleAdmissionUpdate
          },
          {
            icon: 'pi pi-ban',
            className: classes.agentListButton,
            tooltip: 'Not Admitted',
            onClick: handleHospitalVisitUpdate
          },
          {
            icon: 'pi pi-times-circle',
            className: classes.agentListButton,
            tooltip: 'Cancel',
            onClick: handleCancellationModal
          },
          {
            key: 'timeleine_preauth',
            icon: 'pi pi-calendar-times',
            onClick: openTimeLine,
            tooltip: 'Timeline'
          }
        ],
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      enableGlobalSearch: false,
      selectionMenuButtonText: 'Action'
    }
  }

  const renderBenefitWithCost = (rowData: any) => {
    const length = rowData?.benefitsWithCost?.length

    const totalAmount = rowData.benefitsWithCost.reduce((acc: any, curr: any) => acc + curr.estimatedCost, 0)

    const benefitsWithCost = rowData.benefitsWithCost?.map((ben: any, index: number) => {
      const provider = providers?.find((p: any) => p?.id === ben?.providerId)

      return (
        <li key={`${ben?.providerId}-${ben?.benefitId}-${index}`}>
          {provider?.providerBasicDetails?.name} | {ben.benefitName} | {ben.iname} | {ben.diagnosisName} :
          <b>{ben.estimatedCost}</b>
        </li>
      )
    })

    return <p>{benefitsWithCost}</p>
  }

  const columnsDefinations = [
    // { field: 'serial', headerName: 'Sl.', style: { width: '4rem' } },
    { field: 'id', headerName: 'Claim No.' },
    { field: 'memberShipNo', headerName: 'Membership No.', expand: true },
    { field: 'memberName', headerName: 'Name' },
    { field: 'policyNumber', headerName: 'Policy No.', expand: true },
    {
      field: 'admissionDate',
      headerName: 'Admission Date',
      expand: true,
      body: (rowData: any) => <p>{new Date(rowData.expectedDOA).toLocaleDateString()}</p>
    },
    {
      field: 'dischargeDate',
      headerName: 'Discharge Date',
      expand: true,
      body: (rowData: any) => <p>{new Date(rowData.expectedDOD).toLocaleDateString()}</p>
    },
    {
      field: 'benefitWithCost',
      headerName: 'Estimated Cost',
      body: (rowData: any) => (
        <p style={{ width: '250px', whiteSpace: 'break-spaces' }}>{renderBenefitWithCost(rowData)}</p>
      )
    }

    // { field: 'memberDetails', headerName: 'MEMBER DETAILS' },
    // { field: 'accounts', headerName: 'ACCOUNTS' },
    // { field: 'diagnosis', headerName: 'DIAGNOSIS' },
  ]

  const status: any = {
    today: 'Today',
    thisweek: 'This Week',
    thismonth: 'This Month',
    thisyear: 'This Year'
  }

  const admissionUpdationModalSubmit = (values: any) => {
    handleCloseAdmissionModal()
    handleCloseHospitalVisitUpdate()
    handleCloseCancellationModal()

    const payload = {
      memberShipNo: memberShipNo,
      preauthId: preAuthId,
      ...values
    }

    preAuthService.admissionUpdate(preAuthId, payload).subscribe(res => {
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Content Updated', life: 2000 })
    })
    const reader = new FileReader()
    const readers = new FileReader()

    readers.onload = function () {
      const list: any = [...documentList]

      list['documentOriginalName'] = payload?.feedbackForm?.name
      setDocumentList(list)
      const formData = new FormData()

      formData.append('docType', 'FEEDBACK_FORM')
      formData.append('filePart', payload?.feedbackForm)
      preAuthService.downloadDischargeDocs(preAuthId, formData).subscribe(response => {
        // list[0]['documentName']=response.get('id');
        // list[1]['docFormat']=response.get('docFormat');
        // setDocumentList(list);
      })
    }

    reader.onload = function () {
      const list: any = [...documentList]

      list['documentOriginalName'] = payload?.dischargeCertificate?.name
      setDocumentList(list)
      const formData = new FormData()

      formData.append('docType', 'DISCHARGE_CERTIFICATE')
      formData.append('filePart', payload?.dischargeCertificate)
      preAuthService.downloadDischargeDocs(preAuthId, formData).subscribe(response => {
        // list[0]['documentName']=response.get('id');
        // list[1]['docFormat']=response.get('docFormat');
        // setDocumentList(list);
      })
    }

    reader.readAsDataURL(payload?.dischargeCertificate)
    readers.readAsDataURL(payload?.feedbackForm)
  }

  return (
    <div style={{ backgroundColor: 'var(--surface-f)' }}>
      <Toast ref={toast} />
      <Typography style={{ fontSize: '16px', padding: '16px' }}>Waiting For Hospitalization {status[id]}</Typography>
      <>
        <AdmisssionUpdationModal
          data={benefitsWithCost}
          admissionUpdationModal={admissionUpdationModal}
          handleCloseClaimModal={handleCloseAdmissionModal}
          admissionUpdationModalSubmit={admissionUpdationModalSubmit}
        />
        <HospitalVisitUpdationModal
          data={benefitsWithCost}
          admissionUpdationModal={hospitaVisitUpdation}
          handleCloseClaimModal={handleCloseHospitalVisitUpdate}
          admissionUpdationModalSubmit={admissionUpdationModalSubmit}
        />
        <CanellationModal
          data={benefitsWithCost}
          admissionUpdationModal={cancellationModal}
          handleCloseClaimModal={handleCloseCancellationModal}
          admissionUpdationModalSubmit={admissionUpdationModalSubmit}
        />
        <FettleDataGrid $datasource={dataSource$} config={configuration} columnsdefination={columnsDefinations} />
      </>
      <PreAuthTimeLineModal preAuth={selectedPreAuth} open={openTimeLineModal} onClose={handleCloseTimeLineModal} />
    </div>
  )
}

export default withRouter(PatientListCompoent)
