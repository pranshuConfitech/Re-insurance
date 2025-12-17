
// MUI Imports
import Grid from '@mui/material/Grid'

// Components Imports
import Award from '@views/dashboards/crm/Award'
import CardStatVertical from '@components/card-statistics/Vertical'
import StackedBarChart from '@views/dashboards/crm/StackedBarChart'
import DonutChart from '@views/dashboards/crm/DonutChart'
import OrganicSessions from '@views/dashboards/crm/OrganicSessions'
import ProjectTimeline from '@views/dashboards/crm/ProjectTimeline'
import WeeklyOverview from '@views/dashboards/crm/WeeklyOverview'
import SocialNetworkVisits from '@views/dashboards/crm/SocialNetworkVisits'
import MonthlyBudget from '@views/dashboards/crm/MonthlyBudget'
import MeetingSchedule from '@views/dashboards/crm/MeetingSchedule'
import ExternalLinks from '@views/dashboards/crm/ExternalLinks'
import PaymentHistory from '@views/dashboards/crm/PaymentHistory'
import SalesInCountries from '@views/dashboards/crm/SalesInCountries'
import UserTable from '@views/dashboards/crm/UserTable'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

// Data Imports
import { getUserData } from '@/app/server/actions'

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/apps/user-list` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */

/* const getUserData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/apps/user-list`)

  if (!res.ok) {
    throw new Error('Failed to fetch userData')
  }

  return res.json()
} */

const topClaims = [
  {
    claimNo: 'PA-1382010870735134720',
    claimDate: '6/11/2025',
    memberName: 'Madhuri Dixit',
    claimAmount: 3000000
  },
  {
    claimNo: 'PA-1382010323151970304',
    claimDate: '6/11/2025',
    memberName: 'Madhuri Dixit',
    claimAmount: 2200000
  },
  {
    claimNo: 'PA-1382009457154023424',
    claimDate: '6/11/2025',
    memberName: 'Anil Kapoor',
    claimAmount: 1500000
  },
  {
    claimNo: 'PA-1382009211271340032',
    claimDate: '6/11/2025',
    memberName: 'Anil Kapoor',
    claimAmount: 1000000
  },
  {
    claimNo: 'PA-1359792531807434324',
    claimDate: '4/10/2025',
    memberName: 'Pranshu Sharma',
    claimAmount: 500000
  }
]

const topPolicies = [
  {
    policyName: 'PN332752000',
    policyDate: '10/6/2025',
    proposerName: 'Kaguta Museveni',
    premiumAmount: 229411
  },
  {
    policyName: 'PN332752657',
    policyDate: '6/4/2025',
    proposerName: 'Kenya Airways',
    premiumAmount: 400000
  },
  {
    policyName: 'PN335657890',
    policyDate: '10/4/2025',
    proposerName: 'Safaricom',
    premiumAmount: 340000
  },
  {
    policyName: 'PN332656786',
    policyDate: '03-22-2025',
    proposerName: 'East African Breweries',
    premiumAmount: 500000
  },
  {
    policyName: 'PN332756750',
    policyDate: '01-15-2025',
    proposerName: 'Britam Holdings PLC',
    premiumAmount: 270000
  }
];

const DashboardCRM = async () => {
  // Vars
  const data = await getUserData()
  const serverMode = await getServerMode()

  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12} md={4}>
        <Award />
      </Grid> */}
      <Grid item xs={12} sm={4} md={3}>
        <CardStatVertical
          stats='155k'
          title='Sales Growth YTD'
          trendNumber='22%'
          chipText="vs previous year's growth"
          avatarColor='success'
          avatarIcon='ri-arrow-up-double-fill'
          avatarSkin='light'
          chipColor='secondary'
        />
      </Grid>
      <Grid item xs={12} sm={4} md={3}>
        <CardStatVertical
          stats='$13.4k'
          title='Renewals Q1 Growth'
          trendNumber='38%'
          chipText=''
          avatarColor='success'
          avatarIcon='ri-arrow-up-double-fill'
          avatarSkin='light'
          chipColor='secondary'
        />
      </Grid>
      <Grid item xs={12} sm={3} md={6}>
        <TableContainer component={Paper}>
          <Typography variant="subtitle1" sx={{ p: 2, fontWeight: 600 }}>
            Top 5 claims
          </Typography>
          <Table size="small" sx={{ minWidth: 400 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Claim no</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Claim Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Member name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Claim Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topClaims.map(row => (
                <TableRow key={row.claimNo}>
                  <TableCell >{row.claimNo}</TableCell>
                  <TableCell >{row.claimDate}</TableCell>
                  <TableCell >{row.memberName}</TableCell>
                  <TableCell >{row.claimAmount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12} md={4}>
        {/* <OrganicSessions /> */}
      </Grid>
      <Grid item xs={12} md={8}>
        {/* <ProjectTimeline /> */}
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <WeeklyOverview />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <TableContainer component={Paper}>
          <Typography variant="subtitle1" sx={{ p: 2, fontWeight: 600 }}>
            Top 5 policies
          </Typography>
          <Table size="small" sx={{ minWidth: 400 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Policy name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Policy Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Proposer name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Premium Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topPolicies.map(row => (
                <TableRow key={row.policyName}>
                  <TableCell>{row.policyName}</TableCell>
                  <TableCell>{row.policyDate}</TableCell>
                  <TableCell>{row.proposerName}</TableCell>
                  <TableCell>{row.premiumAmount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {/* <Grid item xs={12} sm={6} md={4}>
        <MonthlyBudget />
      </Grid> */}
      <Grid item xs={12} sm={6} md={4}>
        {/* <MeetingSchedule /> */}
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        {/* <ExternalLinks /> */}
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        {/* <PaymentHistory serverMode={serverMode} /> */}
      </Grid>
      <Grid item xs={12} md={4}>
        {/* <SalesInCountries /> */}
      </Grid>
      <Grid item xs={12} md={8}>
        {/* <UserTable tableData={data} /> */}
      </Grid>
    </Grid>
  )
}

export default DashboardCRM
