import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme:any) => ({
  root: {
    width: '100%',
    padding: theme?.spacing?theme.spacing(3):'24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme?.spacing?theme.spacing(3):'24px',
  },
  content: {
    padding:theme?.spacing?theme.spacing(2):'16px',
    minHeight: 'calc(100vh - 250px)',
  }
}));
interface CommonDashboardProps {
  statsComponent: React.ElementType;
  chartComponent: React.ElementType;
  activitiesComponent: React.ElementType;
  title: string;
}
const CommonDashboard: React.FC<CommonDashboardProps> = ({ 
  statsComponent: StatsComponent,
  chartComponent: ChartComponent,
  activitiesComponent: ActivitiesComponent,
  title
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper>
        {title && (
          <Box p={2}>
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
          </Box>
        )}
        <Box className={classes.content}>
          <Grid container spacing={3}>
            {StatsComponent && (
              <Grid item xs={12}>
                <StatsComponent />
              </Grid>
            )}
            <Grid container item spacing={3}>
              {ChartComponent && (
                <Grid item xs={12} md={8}>
                  <ChartComponent />
                </Grid>
              )}
              {ActivitiesComponent && (
                <Grid item xs={12} md={4}>
                  <ActivitiesComponent />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </div>
  );
};

export default CommonDashboard; 
