import React from 'react';
import { makeStyles } from '@mui/styles'
import { Paper, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const useStyles = makeStyles((theme: any) => ({
  root: {
    padding: theme?.spacing ? theme.spacing(2) : '16px',
    height: '400px',
  },
  title: {
    marginBottom: theme?.spacing ? theme.spacing(2) : '16px',
  },
}));

// Sample data - replace with actual data from your API
const data = [
  { month: 'Jan', leads: 120, converted: 45 },
  { month: 'Feb', leads: 150, converted: 60 },
  { month: 'Mar', leads: 180, converted: 75 },
  { month: 'Apr', leads: 200, converted: 90 },
  { month: 'May', leads: 220, converted: 100 },
  { month: 'Jun', leads: 190, converted: 85 },
];

const LeadConversionChart = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" className={classes.title}>
        Lead Conversion Rate
      </Typography>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="leads" fill="#8884d8" name="Total Leads" />
          <Bar dataKey="converted" fill="#82ca9d" name="Converted" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default LeadConversionChart; 
