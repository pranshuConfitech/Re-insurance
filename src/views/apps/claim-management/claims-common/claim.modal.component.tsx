'use client'
import * as React from 'react'

import { useEffect } from 'react'

import { useParams } from 'next/navigation'

import { Button } from 'primereact/button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'

import { TabPanel, TabView } from 'primereact/tabview'

import { withStyles } from '@mui/styles'

import { MemberService } from '@/services/remote-api/api/member-services'
import { PreAuthService } from '@/services/remote-api/api/claims-services'

import ClaimReimHistory from './claim.reim.history'
import PreAuthHistory from './preauth.history'

const StyledTableCellHeader = withStyles(theme => ({
  head: {
    backgroundColor: '#F1F1F1',
    color: '#A1A1A1',
    padding: '8px'
  },
  body: {
    fontSize: 14
  }
}))(TableCell)

const StyledTableCellRow = withStyles(theme => ({
  head: {
    padding: '8px'
  },
  body: {
    padding: '8px',
    backgroundColor: '#FFF',
    color: '#3C3C3C !important',
    fontSize: 12
  }
}))(TableCell)

const StyledTableRow = withStyles((theme: any) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme?.palette?.action?.hover
    }
  }
}))(TableRow)

const valueStyle = {
  fontWeight: '500',
  fontSize: '13px',
  color: '#A1A1A1'
}

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export default function ClaimModal(props: any) {
  const [state, setState] = React.useState({
    insuranceCompany: '',
    corporateName: '',
    membershipNo: '',
    memberName: '',
    gender: '',
    age: '',
    policyCode: '',
    policyType: '',
    policyPeriod: '',
    enrolmentDate: ''
  })

  const [fullWidth, setFullWidth] = React.useState(true)
  const [maxWidth, setMaxWidth] = React.useState<any>('xl')
  const [memberData, setMemberData] = React.useState([])
  const [membeQuestionnairerData, setMemberQuestionnaireData] = React.useState([])
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [historyActiveIndex, setHistoryActiveIndex] = React.useState(0)

  const handleClose = () => {
    props.handleCloseClaimModal()
  }

  const handleModalSubmit = () => { }
  const id: any = useParams().id
  const memberService = new MemberService()
  const preAuthService = new PreAuthService()
  const policyStartDate = new Date(props.memberBasic.enrolmentFromDate)
  const policyEndDate = new Date(props.memberBasic.enrolentToDate)
  const timeDifference = policyEndDate.getTime() - policyStartDate.getTime()

  const periodInDays = Math.floor(timeDifference / (24 * 60 * 60 * 1000))

  useEffect(() => {
    if (props?.memberBasic?.membershipNo) {
      memberService.getMemberQuestionnaire(props?.memberBasic?.memberId).subscribe((res: any) => {
        setMemberQuestionnaireData(res)
      })
      memberService.getMemberBalance(props?.memberBasic?.membershipNo, props.memberBasic.policyNumber).subscribe((res: any) => {
        setMemberData(res)
      })


      const pageRequest: any = {
        membershipNo: props?.memberBasic?.membershipNo
      }

      if (id) pageRequest.preauthId = id
      preAuthService.getClaimHistory(pageRequest).subscribe((res: any) => {
        setMemberQuestionnaireData(res)
      })
    }
  }, [props?.memberBasic?.membershipNo])

  const PolicyAndMemberDetails = () => {
    return (
      <Grid container spacing={3} style={{ marginBottom: '20px' }}>
        <Grid item xs={12} style={{ marginTop: '20px' }}>
          <TableContainer component={Paper}>
            <Table size='small' aria-label='a dense table'>
              <TableHead>
                <TableRow>
                  <TableCell>Policy Code</TableCell>
                  <TableCell>Plan Name</TableCell>
                  <TableCell>Scheme Category</TableCell>
                  <TableCell>Policy Period</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{props.memberBasic.policyNumber}</TableCell>
                  <TableCell>{props.memberBasic.planName}</TableCell>
                  <TableCell>{props.memberBasic.planScheme}</TableCell>
                  <TableCell>{periodInDays} days</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {/* <Grid item xs={6}>
            <TextField
              id="standard-multiline-flexible"
              name="insuranceCompany"
              value={props.memberBasic.insuranceCompany}
              label="Insurance Company"
              InputProps={{readOnly:true}} 
            />
          </Grid> */}

        <Grid item xs={6}>
          <TextField
            id='standard-multiline-flexible'
            name='membershipNo'
            value={props.memberBasic.membershipNo}
            label='Membership No'
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id='standard-multiline-flexible'
            name='corporateName'
            value={props.memberBasic.clientType + ' ' + 'POLICY'}
            label={props.memberBasic.clientType ? 'Client Type ' : 'Corporate Policy'}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id='standard-multiline-flexible'
            InputProps={{ readOnly: true }}
            name='memberName'
            value={props.memberBasic.name}
            label='Member Name'
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id='standard-multiline-flexible'
            InputProps={{ readOnly: true }}
            name='gender'
            value={props.memberBasic.gender}
            label='Gender'
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id='standard-multiline-flexible'
            InputProps={{ readOnly: true }}
            name='age'
            value={props.memberBasic.age}
            label='Age'
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id='standard-multiline-flexible'
            InputProps={{ readOnly: true }}
            name='policyCode'
            value={props.memberBasic.policyNumber}
            label='Policy Code'
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id='standard-multiline-flexible'
            InputProps={{ readOnly: true }}
            name='policyType'
            value={props.memberBasic.policyType}
            label='Policy type'
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id='standard-multiline-flexible'
            name='enrolmentDate'
            value={props.memberBasic.enrolmentDate}
            label='First Enrollment date'
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id='standard-multiline-flexible'
            name='policyPeriod'
            value={periodInDays}
            label='Policy Period'
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} style={{ marginTop: '20px' }}>
          <span style={{ color: '#4472C4', fontWeight: 'bold' }}>Policy Conditions(Benefits/Coverage)</span>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table size='small' aria-label='a dense table'>
              <TableHead>
                <TableRow>
                  <TableCell>Benefit</TableCell>
                  <TableCell>Waiting Period</TableCell>
                  <TableCell>Max Limit(KSH)</TableCell>
                  <TableCell>Consumed(KSH)</TableCell>
                  <TableCell>Balance(KSH)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {memberData?.map &&
                  memberData.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item?.benefitName}</TableCell>
                      <TableCell>{item?.waitingPeriod}</TableCell>
                      <TableCell>{item?.maxLimit}</TableCell>
                      <TableCell>{item?.consumed}</TableCell>
                      <TableCell>{item?.balance}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    )
  }

  const MemberDeclaration = () => {
    return (
      <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
        <Table aria-label='simple table'>
          <TableHead>
            <StyledTableRow>
              <StyledTableCellHeader>Question</StyledTableCellHeader>
              <StyledTableCellHeader>Answer</StyledTableCellHeader>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {membeQuestionnairerData?.length
              ? membeQuestionnairerData?.map((row: any) => {
                return (
                  <StyledTableRow key={row?.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <StyledTableCellRow component='th' scope='row' style={valueStyle}>
                      {row?.question}
                    </StyledTableCellRow>
                    <StyledTableCellRow component='th' scope='row' style={valueStyle}>
                      {typeof row?.answer === 'boolean' ? (row.answer ? 'Yes' : 'No') : row?.answer}
                    </StyledTableCellRow>
                  </StyledTableRow>
                )
              })
              : 'no data found'}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  const ClaimsHistory = () => {
    return (
      <TabView
        scrollable
        style={{ fontSize: '14px', marginTop: '10px', borderRadius: '8px 8px 0 0' }}
        activeIndex={historyActiveIndex}
        onTabChange={e => setHistoryActiveIndex(e.index)}
      >
        <TabPanel leftIcon='pi pi-user mr-2' header='PreAuth'>
          <PreAuthHistory membershipNo={props?.memberBasic?.membershipNo} />
        </TabPanel>
        <TabPanel leftIcon='pi pi-money-bill mr-2' header='Reimbursement'>
          <ClaimReimHistory membershipNo={props?.memberBasic?.membershipNo} />
        </TabPanel>
      </TabView>
    )
  }

  return (
    <Dialog
      open={props.claimModal}
      onClose={handleClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      aria-labelledby='form-dialog-title'
      disableEnforceFocus
    >
      {/* <DialogTitle id="form-dialog-title">Claim Member Details</DialogTitle> */}
      <DialogContent>
        <TabView
          scrollable
          style={{ fontSize: '14px', marginTop: '10px', borderRadius: '8px 8px 0 0' }}
          activeIndex={activeIndex}
          onTabChange={e => setActiveIndex(e.index)}
        >
          <TabPanel leftIcon='pi pi-user mr-2' header='Policy & Member Details'>
            <PolicyAndMemberDetails />
          </TabPanel>
          <TabPanel leftIcon='pi pi-user-minus mr-2' header='Member Declaration'>
            <MemberDeclaration />
          </TabPanel>
          <TabPanel leftIcon='pi pi-money-bill mr-2' header='Claim History'>
            <ClaimsHistory />
          </TabPanel>
        </TabView>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}
