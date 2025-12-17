'use client'
import * as React from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import { styled } from '@mui/system'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Observable, map } from 'rxjs'

import moment from 'moment'

import { makeStyles } from '@mui/styles'

import { Button } from 'primereact/button'

import { MemberService } from '@/services/remote-api/api/member-services'
import {
  BenefitService,
  ProvidersService,
  ServiceTypeService,
  defaultPageRequest
} from '@/services/remote-api/fettle-remote-api'

import { PreAuthService } from '@/services/remote-api/api/claims-services'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const memberService = new MemberService()
const benefitService = new BenefitService()
const preauthService = new PreAuthService()

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

const useStyles = makeStyles((theme: any) => ({
  AccordionSummary: {
    backgroundColor: theme?.palette?.background?.default
  }
}))

const TypographyStyle2: any = {
  fontSize: '12px',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans - serif',
  fontWeight: '400',
  alignItems: 'end',
  display: 'flex',
  textTransform: 'capitalize'
}

const TypographyStyle1: any = {
  fontSize: '13px',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans - serif',
  alignItems: 'end',
  fontWeight: '600',
  display: 'flex',
  textTransform: 'capitalize'
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

const StyledTableCellRow = styled(TableCell)(({ theme }) => ({
  head: {
    padding: '8px'
  },
  body: {
    padding: '8px',
    backgroundColor: '#FFF',
    color: '#3C3C3C !important',
    fontSize: 12
  }
}))

// const StyledTableRow = withStyles((theme:any) => ({
//   root: {
//     '&:nth-of-type(odd)': {
//       backgroundColor: theme?.palette?.action?.hover,
//     },
//   },
// }))(TableRow);
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  }
}))

const StyledTableCellHeader = styled(TableCell)(({ theme }) => ({
  head: {
    backgroundColor: '#F1F1F1',
    color: '#A1A1A1',
    padding: '8px'
  },
  body: {
    fontSize: 14
  }
}))

export default function MemberBalance() {
  const router = useRouter()
  const query = useSearchParams()
  const theme = useTheme()
  const [enteredMembershipNo, setEnteredMembershipNo] = React.useState()
  const [showBalanceDetails, setShowBalanceDetails] = React.useState(false)
  const [expanded, setExpanded] = React.useState(true)
  const [tableData, setTableData]: any = React.useState()
  const [claimTableData, setClaimTableData]: any = React.useState()
  const [memberData, setMemberData]: any = React.useState()
  const [benefitData, setBenefitData]: any = React.useState()
  const [policyList, setPolicyList]: any = React.useState()
  const [selectedPolicy, setSelectedPolicy]: any = React.useState()
  const [showServices, setShowServices] = React.useState(false)
  const [diagnosisList, setDiagnosisList] = React.useState([])
  const [providerList, setProviderList] = React.useState([])
  const [loading, setLoading] = React.useState(false)
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

  const columnsDefinations = [
    { field: 'benefit', headerName: 'Benefit' },
    { field: 'waitingPeriod', headerName: 'Waiting Period' },
    { field: 'maxLimit', headerName: 'Max Limit(KSH)' },
    {
      field: 'consumed',
      headerName: 'Consumed(KSH)',
      body: (rowData: any) => (
        <span
          style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
          onClick={() => {
            setShowServices(false)
            getClaimsByBenefit(rowData?.benefitStructureId)
          }}
        >
          {rowData.consumed}
        </span>
      )
    },
    { field: 'balance', headerName: 'Balance(KSH)' }
  ]

  const claimColumnsDefinations = [
    { field: 'claimNo', headerName: 'Claim No' },
    {
      field: 'lossDate',
      headerName: 'Loss Date',
      body: (rowData: any) => <span>{new Date(rowData?.lossDate).toLocaleDateString('en-GB')}</span>
    },
    {
      field: 'serviceProviders',
      headerName: 'Service Provider',
      body: (rowData: any) => (
        <span>
          {rowData?.serviceProviders?.map((ele: any, idx: number) => {
            return (
              <p key={idx}>
                {idx + 1}. {ele?.providerBasicDetails?.name}
              </p>
            )
          })}
        </span>
      )
    },
    {
      field: 'diagnosis',
      headerName: 'Diagnosis',
      body: (rowData: any) => (
        <span>
          {rowData?.diagnosis.map((ele: any, idx: number) => {
            return (
              <p key={idx}>
                {idx + 1}. {ele?.diagnosisName}
              </p>
            )
          })}
        </span>
      )
    },
    { field: 'relation', headerName: 'Relation' },
    { field: 'claimStatus', headerName: 'Claim Status' },
    { field: 'amount', headerName: 'Amount (KSH)' }
  ]

  React.useEffect(() => {
    benefitService.getAllBenefit({
      page: 0,
      size: 10000,
      summary: true,
      active: true,
    }).subscribe(response => {
      setBenefitData(response.content)
    })
  }, [])

  const getClaimsByBenefit = (id: any) => {
    preauthService.getClaimsByBenefit(id, enteredMembershipNo).subscribe(response => {
      // const temp = response.map(item => {
      //   console.log(item)
      //   // const diagnosis = diagnosisList.filter(ele => item.diagnosis.includes(ele.id));
      //   let provider = [];
      //   providerList.map(ele => {
      //     item.serviceProviders.map(item => {
      //       if (ele.id === item.providerId) provider.push(ele);
      //     });
      //   });
      //   // item.diagnosis = diagnosis;
      //   item.serviceProviders = provider;
      //   return item;
      // });
      setClaimTableData(response)
      setShowServices(true)
    })
  }

  const handleSearch = () => {
    setLoading(true)

    if (enteredMembershipNo) {
      memberService.getMemberPolicies(enteredMembershipNo).subscribe((res: any) => {
        console.log('Member Policies:', res)
        setPolicyList(res);
        setLoading(false)
      })
    } else {
      alert('Enter membership number')
    }
  }

  const getMemberFromPolicy = (policy: any) => {
    memberService.getMemberBalance(enteredMembershipNo, policy).subscribe((res: any) => {
      const temp = res.map((item: any) => {
        const benefit = benefitData && benefitData.find((ele: any) => ele.id === item.benefit)

        item.benefitId = benefit?.id
        item.benefit = benefit?.name
        item.consumed = item?.maxLimit - item?.balance

        return item
      })

      setTableData(temp)
      getMemberDetails()
      setShowBalanceDetails(true)
    })
  }

  const getMemberDetails = () => {
    const pageRequest = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      key: 'MEMBERSHIP_NO',
      value: enteredMembershipNo,
      // policyStatus: 'ACTIVE'
    }

    memberService.getMember(pageRequest).subscribe((res: any) => {
      // if (res.content?.length > 0) {
      setMemberData(res.content[0])

      // }
    })
  }

  const clickHandler = () => {
    setShowBalanceDetails(true)
  }

  const configuration = {
    enableSelection: false,
    scrollHeight: '285px',
    pageSize: 10
  }

  const claimConfiguration = {
    enableSelection: false,
    scrollHeight: '285px',
    pageSize: 10
  }

  const claimData$ = new Observable(subscriber => {
    subscriber.next(claimTableData)
  })

  const data$ = new Observable(subscriber => {
    subscriber.next(tableData)
  })

  const dataSource$ = () => {
    return data$.pipe(
      map((data: any) => {
        data.content = data

        return data
      })
    )
  }

  const claimDataSource$ = () => {
    return claimData$.pipe(
      map((data: any) => {
        data.content = data

        return data
      })
    )
  }

  return (
    <>
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

        <Grid container mt={4}>
          {policyList &&
            <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="policy-select-label">Policies</InputLabel>
              <Select label='Policies' value={selectedPolicy} onChange={(e) => { setSelectedPolicy(e.target.value); getMemberFromPolicy(e.target.value) }}>
                {policyList?.map((policy: any) => {
                  const date = new Date(policy.policyEndDate); // or your timestamp
                  const month = date.getUTCMonth() + 1; // Months are 0-indexed
                  const day = date.getUTCDate();
                  const year = date.getUTCFullYear();
                  let ed = `${month}/${day}/${year}`;
                  return (
                    <MenuItem key={policy.policyNumber} value={policy.policyNumber}>
                      {`${policy.policyNumber} (${new Date(policy.policyStartDate).toLocaleDateString()} - ${ed})`}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          }
        </Grid>

        {showBalanceDetails && (
          <>
            <Accordion elevation={0} expanded={expanded} style={{ marginTop: '10px' }}>
              <AccordionSummary
                className={classes.AccordionSummary}
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1bh-content'
                id='panel1bh-header'
                onClick={() => {
                  setExpanded(!expanded)
                }}
              >
                <Typography component='h6'>Member Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container>
                  <Grid xs={12} sm={6} md={4}>
                    {/* <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>corporate name</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{memberData?.corporate}</Typography>
                    </Box> */}
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>name of the member</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{memberData?.name}</Typography>
                    </Box>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>membership no</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{memberData?.membershipNo}</Typography>
                    </Box>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>gender</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{memberData?.gender}</Typography>
                    </Box>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>policy code</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{memberData?.policyNumber}</Typography>
                    </Box>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>first enrollment date</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>
                        {memberData?.dateOfJoining && moment(memberData?.dateOfJoining).format('DD/MM/YYYY')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid xs={12} sm={6} md={4}>
                    {/* <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>name of the member</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{memberData?.name}</Typography>
                    </Box> */}
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>age</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{memberData?.age}</Typography>
                    </Box>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>type of policy</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>{memberData?.clientType}</Typography>
                    </Box>
                    <Box display={'flex'} marginLeft={'10%'} marginY={'10px'}>
                      <Typography style={TypographyStyle1}>policy period</Typography>&nbsp;
                      <span>:</span>&nbsp;
                      <Typography style={TypographyStyle2}>
                        {moment(memberData?.policyStartDate).format('DD/MM/YYYY')} -{' '}
                        {moment(memberData?.policyEndDate).format('DD/MM/YYYY')}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Paper elevation={0} style={{ padding: 15, marginTop: '10px' }}>
              {/* <FettleDataGrid $datasource={dataSource$} config={configuration} columnsdefination={columnsDefinations} /> */}
              <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
                <Table aria-label='simple table'>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCellHeader>Benefit</StyledTableCellHeader>
                      <StyledTableCellHeader>Waiting Period</StyledTableCellHeader>
                      <StyledTableCellHeader>Max Limit(KSH)</StyledTableCellHeader>
                      <StyledTableCellHeader>Consumed(KSH)</StyledTableCellHeader>
                      <StyledTableCellHeader>Balance(KSH)</StyledTableCellHeader>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {tableData ? (
                      tableData?.map((row: any) => (
                        <StyledTableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <StyledTableCellRow component='th' scope='row'>
                            {row.benefit}
                          </StyledTableCellRow>
                          <StyledTableCellRow>{row.waitingPeriod}</StyledTableCellRow>
                          <StyledTableCellRow>{row.maxLimit}</StyledTableCellRow>
                          <StyledTableCellRow
                            style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                            onClick={() => {
                              setShowServices(false)
                              getClaimsByBenefit(row?.benefitStructureId)
                            }}
                          >
                            {row.consumed}
                          </StyledTableCellRow>
                          <StyledTableCellRow>{row.balance}</StyledTableCellRow>
                        </StyledTableRow>
                      ))
                    ) : (
                      <p style={{ color: '#3c3c3c', padding: '1%' }}>No data</p>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}
      </Paper>

      {showServices && (
        <Paper elevation={0} style={{ padding: '15px 30px', marginTop: '10px' }}>
          <FettleDataGrid
            $datasource={claimDataSource$}
            config={claimConfiguration}
            columnsdefination={claimColumnsDefinations}
          />
        </Paper>
      )}
    </>
  )
}
