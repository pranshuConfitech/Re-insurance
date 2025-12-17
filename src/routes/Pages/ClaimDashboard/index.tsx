/* import Grid from '@mui/material/Grid';
import SidebarButtons from '../../../@jumbo/components/AppLayout/partials/SideBar/SIdebarButtons';
import Divider from '@mui/material/Divider'; */
'use client'
import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';


/* import GridContainer from '../../../@jumbo/components/GridContainer';
import PageContainer from '../../../@jumbo/components/PageComponents/layouts/PageContainer'; */
import { Button, ButtonGroup, Typography } from '@mui/material';

import ChartDialog from './chart.dialog';
import OTPDialogBox from './otp-dialog-box';
import IntlMessages from '@/utils/@jambo-utils/IntlMessages';
import {FettleWidget} from '@/views/apps/shared-component/components/fettle.widget';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const useStyles = makeStyles((theme:any) => ({
  widgetContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 15,
  },
}));

const breadcrumbs = [
  { label: <IntlMessages id={'sidebar.main'} />, link: '/' },
  { label: <IntlMessages id={'pages.samplePage'} />, isActive: true },
];

const STATIC_TIMELINE = [
  {
    timestamp: new Date(2021, 2, 15, 18, 35),
    title: 'Central QC Pending',
    description: 'SBIG Central to Claims Team',
  },
  {
    timestamp: new Date(2021, 2, 15, 18, 28),
    title: 'Under QC Done',
    description: 'SBIG Regional to Regional',
  },
  {
    timestamp: new Date(2021, 2, 15, 18, 18),
    title: 'Assigned to Internal team',
    description: 'SBIG Regional to SBIG Regional',
  },
  {
    timestamp: new Date(2021, 2, 15, 17, 45),
    title: 'Assigned to Regional team',
    description: 'SBIG Central to SBIG Regional',
  },
];

const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const options:any= {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
      text: '',
    },
  },
};

const WidCont = () => {
  const [containedButton, setContainedButton] = useState('Day');

  const handleClick = (buttonName:any) => {
    setContainedButton(buttonName);
  };

  return (
    <Grid container style={{ padding: '16px' }}>
      <Grid item xs={12} container justifyContent="center" alignItems="center">
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
      <Grid container spacing={4} style={{ marginTop: '14px' }}>
        <Grid item xs={12} style={{ border: '1px solid black' }}>
          <Typography style={{ textAlign: 'center', paddingBottom: '4px' }}>Claim Recived</Typography>
          <Typography style={{ textAlign: 'left' }}>80% Cashless</Typography>
          <Typography style={{ textAlign: 'left' }}>20% Reimbursement</Typography>
          <Typography style={{ textAlign: 'left' }}>1800 Total</Typography>
        </Grid>

        <Grid item xs={6} style={{ backgroundColor: '#ffffff99 !important', border: '1px solid black' }}>
          <Typography style={{ textAlign: 'center' }}>1500</Typography>
        </Grid>
        <Grid item xs={6} style={{ backgroundColor: '#ffffff99 !important', border: '1px solid black' }}>
          <Typography style={{ textAlign: 'center' }}>10 Cr</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

const widgetData = [
  { caption: 'C', title: 'Claim', widContent: <WidCont /> },
  { caption: 'C', title: 'Claim', widContent: <WidCont /> },
  { caption: 'C', title: 'Claim', widContent: <WidCont /> },
  { caption: 'A', title: 'Agent', widContent: <Bar options={options} data={data} /> },
  { caption: 'P', title: 'Product', widContent: <Line options={options} data={data} /> },
  { caption: 'B', title: 'Bank', widContent: <Doughnut data={data} /> },
];

class SamplePage extends React.Component<any,any> {
  constructor(props:any) {
    super(props);

    this.state = {
      open: false,
      chartDialogOpen: false,
      activeChart: {},
      widgetList: widgetData,
    };
  }

  handleClickOpen = () => {
    this.setState({
      ...this.state,
      open: true,
    });
  };

  handleClose = () => {
    this.setState({
      ...this.state,
      open: false,
    });
  };
  handleChartDialog = (status:any, widget = {}) => {
    this.setState({
      ...this.state,
      chartDialogOpen: status,
      activeChart: widget,
    });
  };

  handleCloseWidget = (id:any) => {
    const wl = [...this.state.widgetList];

    wl.splice(id, 1);
    this.setState({
      ...this.state,
      widgetList: wl,
    });
  };

  render() {
    const { widgetList, chartDialogOpen, open, activeChart } = this.state;

    return (
      <div>
        <Typography style={{ fontSize: '22px', fontWeight: 700 }} color="primary">
          Claim Dashboard
        </Typography>
        <Grid container spacing={3}>
          {widgetList.map((widget:any, id:any) => (
            <Grid item xs={12} sm={6} md={4} key={id}>
              <FettleWidget
                {...widget}
                handleClose={() => this.handleCloseWidget(id)}
                doFullScreen={this.handleChartDialog}
              />
            </Grid>
          ))}
        </Grid>

        <ChartDialog handleChartDialog={this.handleChartDialog} open={chartDialogOpen} data={activeChart} />

        <OTPDialogBox handleClose={this.handleClose} open={open} />
      </div>
    );
  }
}

export default SamplePage;
