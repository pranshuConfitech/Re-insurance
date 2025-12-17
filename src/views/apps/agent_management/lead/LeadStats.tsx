import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Grid, Paper, Typography, Box, ButtonGroup, Button } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TimelineIcon from '@mui/icons-material/Timeline';
import { ReportService } from '@/services/remote-api/api/report-services';

const useStyles = makeStyles((theme: any) => ({
  statsCard: {
    padding: theme?.spacing ? theme.spacing(3) : '24px',
    borderRadius: 12,
    height: '100%',
    width: "100%",
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme?.spacing ? theme.spacing(1) : '8px',
  },
  icon: {
    color: '#fff',
    fontSize: 24,
  },
  value: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: theme?.spacing ? theme.spacing(1) : '8px',
  },
  label: {
    color: theme?.palette?.text?.secondary,
    fontSize: '0.875rem',
  },
  percentageUp: {
    color: theme?.palette?.success?.main,
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme?.spacing ? theme.spacing(1) : '8px',
  },
}));

const StatsCard = ({ icon: Icon, value, label, percentage, color }: {
  icon: any;
  value: any;
  label: string;
  percentage: number;
  color?: string;
}) => {
  const classes = useStyles();

  return (
    <Paper className={classes.statsCard}>
      <Box className={classes.iconBox} style={{ backgroundColor: color }}>
        <Icon className={classes.icon} />
      </Box>
      <Typography variant="h5" className={classes.value}>
        {value}
      </Typography>
      <Typography className={classes.label}>{label}</Typography>
      <Typography className={classes.percentageUp}>
        <TrendingUpIcon fontSize="small" style={{ marginRight: 4 }} />
        {percentage}% increase
      </Typography>
    </Paper>
  );
};

const reportService = new ReportService();

const LeadStats = () => {
  const classes = useStyles();
  const [containedButton, setContainedButton] = useState('Day');
  const [data, setData] = useState<any>();

  const handleClick = (buttonName: any) => {
    setContainedButton(buttonName);
  };

  const getData = async (rangeType = containedButton) => {
    const { startDate, endDate } = getDateRange(rangeType);
    reportService
      .leadReport({
        reportType: "LEAD_OVERVIEW",
        startDate,
        endDate
      })
      .subscribe((result) => {
        setData(result.LEAD_OVERVIEW?.records[0]?.record);
      });
  };

  React.useEffect(() => {
    getData(containedButton);
    // eslint-disable-next-line
  }, [containedButton]);


  const statsData = [
    // {
    //   icon: PeopleIcon,
    //   value: '2,847',
    //   label: 'Total Leads',
    //   percentage: 12.5,
    //   color: '#4CAF50',
    // },
    // {
    //   icon: AttachMoneyIcon,
    //   value: '$94,271',
    //   label: 'Revenue Generated',
    //   percentage: 8.2,
    //   color: '#2196F3',
    // },
    // {
    //   icon: TimelineIcon,
    //   value: '67.5%',
    //   label: 'Conversion Rate',
    //   percentage: 4.7,
    //   color: '#9C27B0',
    // },
    // {
    //   icon: TrendingUpIcon,
    //   value: '1,234',
    //   label: 'Active Campaigns',
    //   percentage: 6.8,
    //   color: '#FF9800',
    // },
  ];

  function getDateRange(type: string) {
    const now = new Date();
    let startDate: Date, endDate: Date;

    if (type === 'Day') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else if (type === 'Week') {
      const day = now.getDay();
      const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(now.setDate(diffToMonday));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else if (type === 'Month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (type === 'Year') {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    } else {
      startDate = now;
      endDate = now;
    }

    return {
      startDate: startDate.getTime(),
      endDate: endDate.getTime()
    };
  }

  return (
    <Grid container spacing={3}>
      <Grid container style={{ padding: '16px' }}>
        <Grid item xs={12} container justifyContent="flex-end" alignItems="center">
          <ButtonGroup color="primary">
            <Button variant={containedButton === 'Day' ? 'contained' : 'outlined'} onClick={() => handleClick('Day')}>
              Day
            </Button>
            <Button variant={containedButton === 'Week' ? 'contained' : 'outlined'} onClick={() => handleClick('Week')}>
              Week
            </Button>
            <Button variant={containedButton === 'Month' ? 'contained' : 'outlined'} onClick={() => handleClick('Month')}>
              Month
            </Button>
            <Button variant={containedButton === 'Year' ? 'contained' : 'outlined'} onClick={() => handleClick('Year')}>
              Year
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      <Box display={"flex"} justifyContent={"space-between"} style={{ width: "100%", gap: "2%" }}>
        <Paper className={classes.statsCard}>
          <Box className={classes.iconBox} style={{ backgroundColor: "#4CAF50" }}>
            <PeopleIcon className={classes.icon} />
          </Box>
          <Typography variant="h5" className={classes.value}>
            {data?.lead_count}
          </Typography>
          <Typography className={classes.label}>Total Leads</Typography>
          {/* <Typography className={classes.percentageUp}>
          <TrendingUpIcon fontSize="small" style={{ marginRight: 4 }} />
          {percentage}% increase
        </Typography> */}
        </Paper>
        <Paper className={classes.statsCard}>
          <Box className={classes.iconBox} style={{ backgroundColor: "#2196F3" }}>
            <AttachMoneyIcon className={classes.icon} />
          </Box>
          <Typography variant="h5" className={classes.value}>
            {`$ ${typeof data?.expected_revenue === 'number' ? data.expected_revenue.toFixed(2) : '0.00'}`}
          </Typography>
          <Typography className={classes.label}>Expected Revenue</Typography>
          {/* <Typography className={classes.percentageUp}>
          <TrendingUpIcon fontSize="small" style={{ marginRight: 4 }} />
          {percentage}% increase
        </Typography> */}
        </Paper>
        <Paper className={classes.statsCard}>
          <Box className={classes.iconBox} style={{ backgroundColor: "#9C27B0" }}>
            <TimelineIcon className={classes.icon} />
          </Box>
          <Typography variant="h5" className={classes.value}>
            {data?.conversion_rate}
          </Typography>
          <Typography className={classes.label}>Conversion Rate</Typography>
          {/* <Typography className={classes.percentageUp}>
          <TrendingUpIcon fontSize="small" style={{ marginRight: 4 }} />
          {percentage}% increase
        </Typography> */}
        </Paper>
      </Box>
      {/* {statsData.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatsCard {...stat} />
        </Grid>
      ))} */}
    </Grid>
  );
};

export default LeadStats;
