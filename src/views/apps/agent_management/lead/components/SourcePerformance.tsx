import React from 'react';
import { makeStyles } from '@mui/styles'
import { Paper, Typography } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const useStyles = makeStyles((theme:any) => ({
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
  { name: 'Website', value: 400 },
  { name: 'Referral', value: 300 },
  { name: 'Social Media', value: 300 },
  { name: 'Direct', value: 200 },
  { name: 'Other', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const SourcePerformance = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" className={classes.title}>
        Lead Sources Distribution
      </Typography>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default SourcePerformance; 
