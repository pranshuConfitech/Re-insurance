'use client'
import React from 'react';

import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import LaunchIcon from '@mui/icons-material/Launch';


const useStyles = makeStyles((theme:any) => ({
  input1: {
    width: '50%',
  },
  clientTypeRadioGroup: {
    flexWrap: 'nowrap',
    '& label': {
      flexDirection: 'row',
    },
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  formControl: {
    minWidth: 182,
  },
  formControl1: {
    minWidth: 300,
  },
  heading: {
    fontSize: theme?.typography?.pxToRem(15),

    // flexBasis: '33.33%',
    flexShrink: 0,
    fontWeight: 700,
  },
  secondaryHeading: {
    fontSize: theme?.typography?.pxToRem(15),
    color: theme?.palette?.text?.secondary,
  },
}));

export default function UnderwritingsReportComponent(props:any) {
  const classes = useStyles();
  const router = useRouter();

  return (
    <div>
      <Grid
        item
        xs={12}
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          marginBottom: '20px',
          height: '2em',
          fontSize: '18px',
        }}>
        <span
          style={{
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: '5px',
          }}>
          Report - Underwritings
        </span>
      </Grid>
      <Paper
        elevation={0}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '1%',
        }}>
        <Box padding={'10px'} display={'flex'} flexDirection={'row'} flexWrap={'wrap'} gap={'10px'} >
          <Paper
            elevation={10}
            style={{
              boxShadow: '1px 1px 2px 0px rgba(0,0,0,1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '1%',
            }}>
            <Box width={'250px'} boxShadow={'0 1px 3px 0 rgba(0, 0, 0, 0.15)'} padding={'5px'}>
              <Box display={'flex'} justifyContent={'space-between'} onClick={()=>{router.push('/report/underwritings/1');}}>
                <Typography align="center" variant="h5">
                  Member Statement
                </Typography>
                <LaunchIcon />
              </Box>
            </Box>
          </Paper>
          <Paper
            elevation={10}
            style={{
              boxShadow: '1px 1px 2px 0px rgba(0,0,0,1)',
              display: 'flex',

              // background: 'wheat',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '1%',
            }}>
            <Box width={'250px'} boxShadow={'0 1px 3px 0 rgba(0, 0, 0, 0.15)'} padding={'5px'}>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography align="center" variant="h5">
                  Report-2
                </Typography>
                <LaunchIcon />
              </Box>
            </Box>
          </Paper>
          <Paper
            elevation={10}
            style={{
              boxShadow: '1px 1px 2px 0px rgba(0,0,0,1)',
              display: 'flex',

              // background: 'wheat',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '1%',
            }}>
            <Box width={'250px'} boxShadow={'0 1px 3px 0 rgba(0, 0, 0, 0.15)'} padding={'5px'}>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography align="center" variant="h5">
                  Report-3
                </Typography>
                <LaunchIcon />
              </Box>
            </Box>
          </Paper>
          <Paper
            elevation={10}
            style={{
              boxShadow: '1px 1px 2px 0px rgba(0,0,0,1)',
              display: 'flex',

              // background: 'wheat',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '1%',
            }}>
            <Box width={'250px'} boxShadow={'0 1px 3px 0 rgba(0, 0, 0, 0.15)'} padding={'5px'}>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography align="center" variant="h5">
                  Report-4
                </Typography>
                <LaunchIcon />
              </Box>
            </Box>
          </Paper>
        </Box>
      </Paper>
    </div>
  );
}
