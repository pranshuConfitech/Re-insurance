'use client'
import * as React from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import {
  Accordion,
  Box,
  CircularProgress,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { Observable, map } from 'rxjs'

import moment from 'moment'

import { makeStyles } from '@mui/styles'

import { Button } from 'primereact/button'

import { Toast } from 'primereact/toast'

import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'

import { MemberService } from '@/services/remote-api/api/member-services'
import {
  BenefitService,
  ClientService,
  PolicyService,
  ProspectService,
  ProvidersService,
  ServiceTypeService,
  defaultPageRequest
} from '@/services/remote-api/fettle-remote-api'

import { PreAuthService, ReimbursementService } from '@/services/remote-api/api/claims-services'

import { QuotationService } from '@/services/remote-api/api/quotation-services'

const memberService = new MemberService()
const benefitService = new BenefitService()
const preauthService = new PreAuthService()
const reimbursementService = new ReimbursementService()
const propspectService = new ProspectService()
const policyService = new PolicyService()
const getClients = new ClientService()
const getPlanInfo = new QuotationService()

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
}

const useStyles: any = makeStyles((theme: any) => ({
  header: {
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '10px 10px 0px 0px',
    background: '#F1F1F1',
    color: '#A1A1A1',
    padding: 20,
    borderBottom: 'none'
  },
  customStyle: {
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '0px 0px 10px 10px',
    background: '#ffffff',
    padding: 20,
    borderTop: 'none'
  },
  pictureContainer: {
    width: 200,
    height: 198,
    border: '1px solid #002776'
  },
  headerText: {
    fontSize: '16px',
    fontWeight: 'Bold'

    // color: '#002776'
  },
  subheader: {
    fontSize: '12px',
    fontWeight: 'Bold'
  },
  body: {
    fontSize: '12px',
    fontWeight: 'Bold'
  },
  dropdownsContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  formControl: {
    minWidth: 182
  },
  detailsText: {
    fontSize: '12px',
    color: '#A1A1A1'
  },
  detailsValueText: {
    fontSize: '12px',
    color: '#3C3C3C'
  },
  button: {
    fontSize: '12px',
    textAlign: 'center',
    width: '100%',
    background: '#D80E51',
    color: '#f1f1f1'
  },
  dropdown: {
    marginLeft: theme?.spacing ? theme?.spacing(2) : '8px',
    '&:first-child': {
      marginLeft: 0
    }
  }
}))

const memberDetails: any = {
  MEMBER_NAME: 'FR ABC ABC',
  CORPORATE_GROUP: 'NULL AMIT KUMAR',
  PARTNER_NUMBER: '-',
  FAMILY_MEMBER_CODE: 'KE02487600',
  PERIOD: '16 MAR 2023 - 12 SEP 2023',
  DATE_REGISTER: '16 MAR 2023',
  BROKER_AGENT: 'MR SAFN LN TEST',
  MEMBER: 'SELF'
}

const TypographyStyle2: any = {
  fontSize: '10px',
  fontWeight: '500',
  textTransform: 'capitalize',
  display: 'contents'
}

const TypographyStyle1: any = {
  fontSize: '10px',
  fontWeight: '900',
  textTransform: 'capitalize',
  display: 'contents'
}

const providerService = new ProvidersService()
const serviceDiagnosis = new ServiceTypeService()
const reqParam: any = { pageRequest: defaultPageRequest }
const ps$ = providerService.getProviders({
  page: 0,
  size: 10000,
  summary: true,
  active: true
})

const ad$ = serviceDiagnosis.getServicesbyId('867854874246590464', {
  page: 0,
  size: 1000,
  summary: true,
  active: true,
  nonGroupedServices: false
})

export default function MembersDetails() {
  const router = useRouter()
  const query = useSearchParams()
  const theme = useTheme()
  const [enteredMembershipNo, setEnteredMembershipNo] = React.useState()
  const [showBalanceDetails, setShowBalanceDetails] = React.useState(false)
  const [expanded, setExpanded] = React.useState(true)
  const [tableData, setTableData]: any = React.useState()
  const [claimTableData, setClaimTableData] = React.useState()
  const [memberData, setMemberData]: any = React.useState()
  const [benefitData, setBenefitData]: any = React.useState()
  const [diagnosisList, setDiagnosisList] = React.useState([])
  const [providerList, setProviderList] = React.useState([])
  const [checked, setChecked]: any = React.useState('')
  const [data, setData]: any = React.useState('')
  const [planInfo, setPlanInfo]: any = React.useState('')
  const [preAuthData, setPreAuthData]: any = React.useState('')
  const [accountData, setAccountData]: any = React.useState('')
  const [checkedModal, setCheckedModal]: any = React.useState('')
  const [active, setActive] = React.useState(1)
  const [contactDetails, setContactDetails]: any = React.useState('')
  const [clientBasicDetails, setClientBasicDetails]: any = React.useState('')
  const [imageData, setImageData]: any = React.useState(null)
  const [selectedDocument, setSelectedDocument] = React.useState(null)
  const [selectedImage, setSelectedImage]: any = React.useState({})
  const [loading, setLoading] = React.useState(false)
  const fileInput: any = React.useRef(null)
  const toast: any = React.useRef(null)
  const classes = useStyles()

  const useObservable = (observable: any, setter: any) => {
    React.useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        const arr: any = []

        result.content.forEach((ele: any) => {
          arr.push({ id: ele.id, diagnosisName: ele.name })
        })
        setter(arr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  const useObservable1 = (observable: any, setter: any) => {
    React.useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        const arr: any = []

        result.content.forEach((ele: any) => {
          if (!ele.blackListed) {
            arr.push(ele)
          }
        })
        setter(arr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(ad$, setDiagnosisList)
  useObservable1(ps$, setProviderList)

  React.useEffect(() => {
    benefitService.getAllBenefit(reqParam).subscribe(response => {
      setBenefitData(response.content)
    })
  }, [])

  const handleSearch = () => {
    setLoading(true)
    if (enteredMembershipNo) {
      memberService.getMemberBalance(enteredMembershipNo, memberData.policyNumber).subscribe((res: any) => {
        const temp = res.map((item: any) => {
          const benefit = benefitData.find((ele: any) => ele.id === item.benefit)

          item.benefitId = benefit.id
          item.benefit = benefit.name
          item.consumed = item.maxLimit - item.balance

          return item
        })

        setTableData(temp)
        getMemberDetails()
        setShowBalanceDetails(true)
        setLoading(false)
      })
    } else {
      alert('Enter membership number')
    }
  }

  const getMemberDetails = () => {
    const pageRequest = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      key: 'MEMBERSHIP_NO',
      value: enteredMembershipNo
    }

    memberService.getMember(pageRequest).subscribe((res: any) => {
      setMemberData(res.content[0])
    })
  }

  const configuration = {
    enableSelection: false,
    scrollHeight: '285px',
    pageSize: 10
  }

  const claimData$ = new Observable(subscriber => {
    subscriber.next(claimTableData)
  })

  const claimDataSource$ = () => {
    return claimData$.pipe(
      map((data: any) => {
        data.content = data

        return data
      })
    )
  }

  const clickedTab = (params: any) => {
    setChecked(params)

    if (params === 1 || checked === 1) {
      const pageRequest = {
        policyNumber: memberData.policyNumber
      }

      policyService.getPolicyList(pageRequest).subscribe((res: any) => {
        setAccountData(res)
      })
    }

    if (params === 3 || checked === 3) {
      // Use params directly
      const policyId = memberData?.policyId

      if (policyId && params === 3) {
        const url = `${policyId}`

        memberService.getPolicyHistoryMember(url).subscribe((res: any) => {
          setTableData(res)
          setData(res)
        })
      }
    }

    if (params === 4 || checked === 4) {
      const propspectIds = memberData?.prospectId

      if (propspectIds && params === 4) {
        const urled = `${propspectIds}`

        propspectService.getProspectList(urled).subscribe((res: any) => {
          setData(res)
        })
      }
    }

    if (params === 5 || checked === 5) {
      const pageRequest = {
        page: 0,
        size: 10,
        summary: true,
        active: true,
        memberShipNo: memberData.membershipNo
      }

      reimbursementService.getAllReimbursements(pageRequest).subscribe((res: any) => {
        const result = res?.content

        result &&
          result.map((item: any) => {
            setPreAuthData(item)
          })
      })
    }

    if (params === 6 || checked === 6) {
      const pageRequest = {
        page: 0,
        size: 10,
        summary: true,
        active: true,
        memberShipNo: memberData.membershipNo
      }

      return preauthService.getPreAuthList(pageRequest).subscribe((res: any) => {
        const result = res?.content

        result &&
          result.map((item: any) => {
            setPreAuthData(item)
          })
      })
    }
  }

  const claimHistory = () => {
    setCheckedModal(1)

    const pageRequest = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      memberShipNo: memberData.membershipNo
    }

    return preauthService.getPreAuthList(pageRequest).subscribe((res: any) => {
      const result = res?.content

      result &&
        result.map((item: any) => {
          setPreAuthData(item)
        })
    })
  }

  // make an active button on proposer section
  const makeActive = (select: any) => {
    setActive(select)
    const propspectIds = memberData?.prospectId

    const payload = {
      page: 0,
      size: 1,
      summary: false,
      active: true,
      prospectId: propspectIds
    }

    if (propspectIds && select === 1) {
      policyService.getPolicyGeneralDetails(memberData.policyNumber).subscribe((res: any) => {
        setData(res)
      })
    }

    if (propspectIds && select === 2) {
      getPlanInfo.getPlanInfoDetails(payload).subscribe((res: any) => {
        setPlanInfo(res?.content)
      })
    }

    if (propspectIds && select === 3) {
      getClients.getClientProspect(propspectIds).subscribe((res: any) => {
        setContactDetails(res?.clientAddress)
        setClientBasicDetails(res?.clientBasicDetails)
      })
    }
  }

  React.useEffect(() => {
    if (memberData?.memberId) {
      memberService.getMemberImage(memberData?.memberId).subscribe((res: any) => {
        // Handle array response - get the first profile image
        const profileImage = Array.isArray(res) && res.length > 0 ? res[0] : res
        setImageData(profileImage)
      })
    }
  }, [memberData?.memberId])

  React.useEffect(() => {
    let subscription: any

    if (memberData?.memberId && imageData?.documentName) {
      subscription = memberService.getMemberImageType(memberData.memberId, imageData.documentName).subscribe({
        next: (res: any) => {
          const blob = new Blob([res])
          const url: any = URL.createObjectURL(blob)

          setSelectedDocument(url)
        },
        error: error => {
          console.error('Error fetching image data:', error)
        }
      })
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [memberData?.memberId, imageData?.documentName])

  const handleImage = (e: any) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = () => {
      const formData = new FormData()

      formData.append('docType', selectedImage.documentType)
      formData.append('filePart', file)

      // Assuming memberService and uploadProfile are properly imported
      memberService.uploadProfile(formData, memberData?.memberId).subscribe(response => {
        setSelectedImage((prevState: any) => ({
          ...prevState,
          documentName: response.id,
          docFormat: response.docFormat
        }))
        window.location.reload()
        toast?.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'File Updated Successfully!!',
          life: 3000
        })
      })
    }

    reader.readAsDataURL(file)
  }

  return (
    <>
      <Toast ref={toast} />
      <Paper elevation={0} style={{ padding: 15 }}>
        <Grid container alignItems='flex-end'>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              id='membershipNumber'
              name='membershipNumber'
              label='Search by Membership Number'
              style={{ width: '90%' }}
              value={enteredMembershipNo}
              onChange={(e: any) => setEnteredMembershipNo(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              color='secondary'
              style={{
                background: theme?.palette?.primary?.main || '#D80E51',
                color: '#fff',
                textAlign: 'center',
                minWidth: '68px',
                display: 'flex',
                justifyContent: 'center'
              }}
              onClick={handleSearch}
            >
              {loading ? <CircularProgress style={{ color: 'white', width: '17px', height: '17px' }} /> : 'Search'}
            </Button>
          </Grid>
        </Grid>
        {showBalanceDetails && (
          <>
            <Accordion elevation={0} expanded={expanded} style={{ marginTop: '10px' }}>
              <Box>
                <Box className={classes.header}>
                  <Typography className={classes.headerText}>Member Details</Typography>
                </Box>
                <Box className={classes.customStyle}>
                  <Grid container>
                    <Grid item xs={12} sm={3} container justifyContent='center' alignItems='center'>
                      <Box className={classes.pictureContainer}>
                        {imageData && selectedDocument ? (
                          <>
                            <input
                              type='file'
                              ref={fileInput}
                              onChange={(e: any) => handleImage(e)}
                              accept='image/jpeg, image/png'
                              style={{ display: 'none' }}
                            />
                            <img
                              src={selectedDocument}
                              alt='Profile Image'
                              onClick={() => fileInput.current && fileInput.current.click()}
                              style={{ height: '166px', width: '300px', cursor: 'pointer' }}
                            />
                          </>
                        ) : (
                          <AddAPhotoIcon
                            className={classes.pictureContainer}
                            onClick={() => fileInput.current && fileInput.current.click()}
                            style={{ cursor: 'pointer' }}
                          />
                        )}
                        <input
                          type='file'
                          ref={fileInput}
                          onChange={(e: any) => handleImage(e)}
                          accept='image/jpeg, image/png'
                          style={{ display: 'none' }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={9} container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography className={classes.detailsText}>
                          <b>Member Name:</b> <span className={classes.detailsValueText}>{memberData?.name}</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography className={classes.detailsText}>
                          <b>Corporate/Group:</b>{' '}
                          <span className={classes.detailsValueText}>{memberData?.corporate}</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography className={classes.detailsText}>
                          <b>Partner Number:</b>{' '}
                          <span className={classes.detailsValueText}>{memberDetails.PARTNER_NUMBER}</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography className={classes.detailsText}>
                          <b>Family/Member Code:</b>{' '}
                          <span className={classes.detailsValueText}>{memberDetails.FAMILY_MEMBER_CODE}</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography className={classes.detailsText}>
                          <b>Period:</b>{' '}
                          <span className={classes.detailsValueText}>
                            {' '}
                            {moment(memberData?.policyStartDate).format('DD/MM/YYYY')} -{' '}
                            {moment(memberData?.policyEndDate).format('DD/MM/YYYY')}
                          </span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography className={classes.detailsText}>
                          <b>Date Registered:</b>{' '}
                          <span className={classes.detailsValueText}>
                            {' '}
                            {memberData?.dateOfJoining && moment(memberData?.dateOfJoining).format('DD/MM/YYYY')}
                          </span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography className={classes.detailsText}>
                          <b>Broker/Agent:</b>{' '}
                          <span className={classes.detailsValueText}>{memberDetails.BROKER_AGENT}</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography className={classes.detailsText}>
                          <b>Member:</b> <span className={classes.detailsValueText}>{memberData?.relations}</span>
                        </Typography>
                      </Grid>
                      <Grid container spacing={4}>
                        <Grid item xs={6} sm={4} md={3}>
                          <Button size='small' className={classes.button} onClick={() => clickedTab(1)}>
                            ACCOUNT / PREMIUMS
                          </Button>
                        </Grid>
                        <Grid item xs={6} sm={4} md={3}>
                          <Button size='small' className={classes.button} onClick={() => clickedTab(2)}>
                            BENEFIT STRUCTURE
                          </Button>
                        </Grid>
                        <Grid item xs={6} sm={4} md={3}>
                          <Button size='small' className={classes.button} onClick={() => clickedTab(3)}>
                            VIEW POLICY HISTORY
                          </Button>
                        </Grid>
                        <Grid item xs={6} sm={4} md={3}>
                          <Button size='small' className={classes.button} onClick={() => clickedTab(4)}>
                            PROPOSER
                          </Button>
                        </Grid>
                        <Grid item xs={6} sm={4} md={3}>
                          <Button size='small' className={classes.button} onClick={() => clickedTab(5)}>
                            CLAIMS
                          </Button>
                        </Grid>
                        <Grid item xs={6} sm={4} md={3} onClick={() => clickedTab(6)}>
                          <Button size='small' className={classes.button}>
                            PREV PRE-AUTH
                          </Button>
                        </Grid>
                        <Grid item xs={6} sm={4} md={3} onClick={() => clickedTab(7)}>
                          <Button size='small' className={classes.button}>
                            AUDIT TRAIL
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Accordion>
          </>
        )}
        {checked === 1 && (
          <Paper elevation={0} style={{ padding: 15, marginTop: '10px' }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>DATE</TableCell>
                    <TableCell>TRANSCATION TYPE</TableCell>
                    <TableCell>INVOICE NO</TableCell>
                    <TableCell>RECEIPT NO</TableCell>
                    <TableCell>INVOICE AMOUNT</TableCell>
                    <TableCell>RECEIPT AMOUNT</TableCell>
                    <TableCell>ADJUSTABLE AMOUNT</TableCell>
                    <TableCell>STATUS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{'Not applicable'}</TableCell>
                    <TableCell>{accountData?.sourceType || 'Not applicable'}</TableCell>
                    <TableCell>{accountData?.invoiceNumber || 'Not applicable'}</TableCell>
                    <TableCell>{accountData?.receiptNumber || 'Not applicable'}</TableCell>
                    <TableCell>{accountData?.invoiceAmount || 'Not applicable'}</TableCell>
                    <TableCell>{accountData?.receiptAmount}</TableCell>
                    <TableCell>{'Not applicable'}</TableCell>
                    <TableCell>{accountData?.policyStatus || 'Not applicable'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
        {checked === 2 && (
          <>
            <Paper elevation={0} style={{ padding: 15, marginTop: '10px' }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>POLICY CODE</TableCell>
                      <TableCell>POLICY PERIOD</TableCell>
                      <TableCell>PLAN</TableCell>
                      <TableCell>SCHEME</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{memberData?.policyNumber}</TableCell>
                      <TableCell>
                        {' '}
                        {moment(memberData?.policyStartDate).format('DD/MM/YYYY')} -{' '}
                        {moment(memberData?.policyEndDate).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell>{memberData?.planName}</TableCell>
                      <TableCell>{'Scheme Name'}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            <h5 style={{ backgroundColor: '#D80E51', color: '#ffff', height: '59px', padding: '23px' }}>
              POLICY DETAILS
            </h5>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid container item xs={6}>
                <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                  <Typography style={TypographyStyle1}>PLAN</Typography>&nbsp;
                  <span>:</span>&nbsp;
                  <Typography style={TypographyStyle2}>{memberData?.planName}</Typography>
                </Box>
              </Grid>
              <Grid container item xs={6}>
                <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                  <Typography style={TypographyStyle1}>POLICY CODE </Typography>&nbsp;
                  <span>:</span>&nbsp;
                  <Typography style={TypographyStyle2}>{memberData?.policyNumber}</Typography>
                </Box>
              </Grid>
              <Grid container item xs={6}>
                <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                  <Typography style={TypographyStyle1}>POLICY VALID FROM </Typography>&nbsp;
                  <span>:</span>&nbsp;
                  <Typography style={TypographyStyle2}>
                    {' '}
                    {moment(memberData?.policyStartDate).format('DD/MM/YYYY')} -{' '}
                    {moment(memberData?.policyEndDate).format('DD/MM/YYYY')}
                  </Typography>
                </Box>
              </Grid>
              <Grid container item xs={6}>
                <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                  <Typography style={TypographyStyle1}>SCHEME NAME </Typography>&nbsp;
                  <span>:</span>&nbsp;
                  <Typography style={TypographyStyle2}>{'type'}</Typography>
                </Box>
              </Grid>
              <Grid container item xs={6}>
                <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                  <Typography style={TypographyStyle1}>FIRST ENROLLMENT DATE </Typography>&nbsp;
                  <span>:</span>&nbsp;
                  <Typography style={TypographyStyle2}>{'type'}</Typography>
                </Box>
              </Grid>
              <Grid container item xs={6}>
                <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                  <Typography style={TypographyStyle1}>POLICY VALID UPTO </Typography>&nbsp;
                  <span>:</span>&nbsp;
                  <Typography style={TypographyStyle2}>
                    {' '}
                    {moment(memberData?.policyEndDate).format('DD/MM/YYYY')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </>
        )}
        {checked === 3 && (
          <Paper elevation={0} style={{ padding: 15, marginTop: '10px' }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>POLICY NUMBER</TableCell>
                    <TableCell>POLICY PERIOD</TableCell>
                    <TableCell>PLAN</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                {tableData?.policyNumber && (
                  <TableBody>
                    <TableRow>
                      <TableCell>{tableData?.policyNumber}</TableCell>
                      <TableCell>
                        {' '}
                        {moment(memberData?.policyStartDate).format('DD/MM/YYYY')} -{' '}
                        {moment(memberData?.policyEndDate).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell>{tableData?.planName}</TableCell>
                      <TableCell>
                        <Button onClick={() => claimHistory()}>CLAIM HISTORY</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Paper>
        )}
        {checked === 4 && (
          <>
            <Grid container item xs={12}>
              <Button style={{ margin: '2px' }} onClick={() => makeActive(1)}>
                GENERAL INFORMATION
              </Button>
              <Button style={{ margin: '2px' }} onClick={() => makeActive(2)}>
                PLAN INFO
              </Button>
              <Button style={{ margin: '2px' }} onClick={() => makeActive(3)}>
                CONTACT DETAILS
              </Button>
            </Grid>
            <span></span>&nbsp;
            {active === 1 && (
              <>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>INSURANCE</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>POLICY TYPE</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>POLICY TERM PERIOD</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>FILE BATCH NO</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>TOTAL MEMBER</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>TPA</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>PIN NO</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>CLIENT TYPE</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{data?.clientType || 'Not applicable'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>INVOICE NO</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>INTERMEDIARY</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>INTERMEDIARY</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>BENEFICIARY</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>IPF</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container item xs={12}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ backgroundColor: '#D80E51', color: '#ffff' }}>NAME</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{data?.displayName || 'Not applicable'}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </>
            )}
            {active === 2 && (
              <>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid
                    container
                    item
                    xs={12}
                    style={{
                      backgroundColor: '#D80E51',
                      color: '#ffff',
                      height: '39px',
                      padding: '10px',
                      display: 'flex'
                    }}
                  >
                    <Typography>DETAILS</Typography>
                  </Grid>
                  {planInfo &&
                    planInfo.map((item: any) => (
                      <React.Fragment key={item.id}>
                        {' '}
                        {/* Ensure each mapped element has a unique key */}
                        <Grid container item xs={6}>
                          <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                            <Typography style={TypographyStyle1}>PLAN</Typography>&nbsp;
                            <span>:</span>&nbsp;
                            <Typography style={TypographyStyle2}>{item.planName}</Typography>
                          </Box>
                        </Grid>
                        <Grid container item xs={6}>
                          <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                            <Typography style={TypographyStyle1}>POLICY CODE</Typography>&nbsp;
                            <span>:</span>&nbsp;
                            <Typography style={TypographyStyle2}>{'type'}</Typography>
                          </Box>
                        </Grid>
                        <Grid container item xs={6}>
                          <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                            <Typography style={TypographyStyle1}>POLICY FROM</Typography>&nbsp;
                            <span>:</span>&nbsp;
                            <Typography style={TypographyStyle2}>
                              {moment(item.policyStartDate).format('DD/MM/YYYY') || 'Not applicable'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid container item xs={6}>
                          <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                            <Typography style={TypographyStyle1}>POLICY TO</Typography>&nbsp;
                            <span>:</span>&nbsp;
                            <Typography style={TypographyStyle2}>
                              {moment(item.policyEndDate).format('DD/MM/YYYY') || 'Not applicable'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid container item xs={6}>
                          <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                            <Typography style={TypographyStyle1}>PREVIOUS POLICY CODE</Typography>&nbsp;
                            <span>:</span>&nbsp;
                            <Typography style={TypographyStyle2}>{'type'}</Typography>
                          </Box>
                        </Grid>
                      </React.Fragment>
                    ))}
                </Grid>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid
                    container
                    item
                    xs={12}
                    style={{
                      backgroundColor: '#D80E51',
                      color: '#ffff',
                      height: '39px',
                      padding: '10px',
                      display: 'flex'
                    }}
                  >
                    <Typography>DEPOSIT DETAILS</Typography>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>PLAN</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>GROUP DISCOUNT</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>POLICY HOLDERS COMPENSATION FUND(PHCF)</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>TRINING LEVEY(TL)</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>STAMP DUTY(SD)</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>GROSS AMOUNT</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>MODE OF PAYMENT</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </>
            )}
            {active === 3 && (
              <>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid
                    container
                    item
                    xs={12}
                    style={{
                      backgroundColor: '#D80E51',
                      color: '#ffff',
                      height: '39px',
                      padding: '10px',
                      display: 'flex'
                    }}
                  >
                    <Typography>CONTACT DETAILS</Typography>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>ADDRESS LINE 1</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>
                        {contactDetails && contactDetails?.addresses[0]?.addressDetails?.add}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>ADDRESS LINE 2</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>COUNTRY</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>
                        {contactDetails && contactDetails?.addresses[1]?.addressDetails?.country}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>POSTAL CODE</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>STATE</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>
                        {contactDetails && contactDetails?.addresses[2]?.addressDetails?.state}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>CITY</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>POLICE STATION</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>TELEPHONE</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>MOBILE</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>
                        {(clientBasicDetails && clientBasicDetails?.contactNos[0]?.contactNo) || 'Type'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>EMAIL</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>
                        {(clientBasicDetails && clientBasicDetails.emails[0]?.emailId) || 'Type'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid
                    container
                    item
                    xs={12}
                    style={{
                      backgroundColor: '#D80E51',
                      color: '#ffff',
                      height: '39px',
                      padding: '10px',
                      display: 'flex'
                    }}
                  >
                    <Typography>MAILING ADDRESS</Typography>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>HOUSE NO/ STREET NAME</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>PLACE</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>COUNTRY</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>POSTAL CODE</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>STATE</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>CITY</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>POLICE STATION</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                  <Grid container item xs={6}>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>TELEPHONE</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{'type'}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </>
            )}
            <Paper elevation={0} style={{ padding: 15, marginTop: '10px' }}>
              {/* <FettleDataGrid config={configuration} columnsdefination={proposerType} /> */}
            </Paper>
          </>
        )}
        {checked === 5 && (
          <Paper elevation={0} style={{ padding: 15, marginTop: '10px' }}>
            <Paper elevation={0} style={{ padding: 15, marginTop: '10px' }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>NAME</TableCell>
                      <TableCell>CLAIM NO.</TableCell>
                      <TableCell>CLAIM DATE</TableCell>
                      <TableCell>LOSS DATE</TableCell>
                      <TableCell>DISEASE</TableCell>
                      <TableCell>PROCEDURE</TableCell>
                      <TableCell>BENEFIT</TableCell>
                      <TableCell>CLAIM AMOUNT</TableCell>
                      <TableCell>STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  {preAuthData ? (
                    <TableBody>
                      <TableRow>
                        <TableCell>{preAuthData?.memberName || 'Not applicable'}</TableCell>
                        <TableCell>{preAuthData?.id || 'Not applicable'}</TableCell>
                        <TableCell>
                          {moment(preAuthData?.createdDate).format('DD/MM/YYYY') || 'Not applicable'}
                        </TableCell>
                        <TableCell>
                          {moment(preAuthData?.expectedDOA).format('DD/MM/YYYY') || 'Not applicable'}
                        </TableCell>
                        <TableCell>{preAuthData?.primaryDigonesisId || 'Not applicable'}</TableCell>
                        <TableCell>{'Not applicable'}</TableCell>
                        <TableCell>{'Not applicable'}</TableCell>
                        <TableCell>{preAuthData?.totalApprovedAmount || 'Not applicable'}</TableCell>
                        <TableCell>{preAuthData?.comment || 'Not applicable'}</TableCell>
                      </TableRow>
                    </TableBody>
                  ) : (
                    <p style={{ height: '46px', margin: '14px' }}>No Data Found!!</p>
                  )}
                </Table>
              </TableContainer>
            </Paper>
          </Paper>
        )}
        {checked === 6 && (
          <Paper elevation={0} style={{ padding: 15, marginTop: '10px' }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>NAME</TableCell>
                    <TableCell>CLAIM NO.</TableCell>
                    <TableCell>CLAIM DATE</TableCell>
                    <TableCell>LOSS DATE</TableCell>
                    <TableCell>DISEASE</TableCell>
                    <TableCell>PROCEDURE</TableCell>
                    <TableCell>BENEFIT</TableCell>
                    <TableCell>CLAIM AMOUNT</TableCell>
                    <TableCell>STATUS</TableCell>
                  </TableRow>
                </TableHead>
                {preAuthData ? (
                  <TableBody>
                    <TableRow>
                      <TableCell>{preAuthData?.memberName || 'Not applicable'}</TableCell>
                      <TableCell>{preAuthData?.id || 'Not applicable'}</TableCell>
                      <TableCell>{moment(preAuthData?.createdDate).format('DD/MM/YYYY') || 'Not applicable'}</TableCell>
                      <TableCell>{moment(preAuthData?.expectedDOA).format('DD/MM/YYYY') || 'Not applicable'}</TableCell>
                      <TableCell>{preAuthData?.primaryDigonesisId || 'Not applicable'}</TableCell>
                      <TableCell>{'Not applicable'}</TableCell>
                      <TableCell>{'Not applicable'}</TableCell>
                      <TableCell>{preAuthData?.totalApprovedAmount || 'Not applicable'}</TableCell>
                      <TableCell>{preAuthData?.comment || 'Not applicable'}</TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  <p style={{ height: '46px', margin: '14px' }}>No Data Found!!</p>
                )}
              </Table>
            </TableContainer>
          </Paper>
        )}
        {checked === 7 && (
          <>
            <h1>UNDER DEVELOPMENT</h1>
          </>
        )}
      </Paper>

      {checkedModal === 1 && (
        <Modal
          open={checkedModal}
          onClose={() => {
            setCheckedModal(false)
          }}
        >
          <Box sx={style} style={{ width: '1000px' }}>
            <div style={{ padding: '5px' }}>
              <strong>View Policy History</strong>
              <Grid container rowSpacing={5} style={{ marginTop: '10px' }}>
                <Paper elevation={0} style={{ padding: 15, marginTop: '10px' }}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>NAME</TableCell>
                          <TableCell>CLAIM NO.</TableCell>
                          <TableCell>CLAIM DATE</TableCell>
                          <TableCell>LOSS DATE</TableCell>
                          <TableCell>DISEASE</TableCell>
                          <TableCell>PROCEDURE</TableCell>
                          <TableCell>BENEFIT</TableCell>
                          <TableCell>CLAIM AMOUNT</TableCell>
                          <TableCell>STATUS</TableCell>
                        </TableRow>
                      </TableHead>
                      {preAuthData && (
                        <TableBody>
                          <TableRow>
                            <TableCell>{preAuthData?.memberName || 'Not applicable'}</TableCell>
                            <TableCell>{preAuthData?.id || 'Not applicable'}</TableCell>
                            <TableCell>
                              {moment(preAuthData?.createdDate).format('DD/MM/YYYY') || 'Not applicable'}
                            </TableCell>
                            <TableCell>
                              {moment(preAuthData?.expectedDOA).format('DD/MM/YYYY') || 'Not applicable'}
                            </TableCell>
                            <TableCell>{preAuthData?.primaryDigonesisId || 'Not applicable'}</TableCell>
                            <TableCell>{'Not applicable'}</TableCell>
                            <TableCell>{'Not applicable'}</TableCell>
                            <TableCell>{preAuthData?.totalApprovedAmount || 'Not applicable'}</TableCell>
                            <TableCell>{preAuthData?.comment || 'Not applicable'}</TableCell>
                          </TableRow>
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </div>
            <Box display={'flex'} justifyContent={'end'} marginTop={'15px'}>
              <Button
                color='primary'
                onClick={() => {
                  setCheckedModal(false)
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  )
}
