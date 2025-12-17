import React from 'react';

import { useRouter } from 'next/navigation';

import { Box, Button, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles((theme:any) => ({
  header: {
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '10px 10px 0px 0px',
    background: '#0edb8a',
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
    height: 144,
    border: '1px solid #002776',
  },
  headerText: {
    fontSize: '16px',
    fontWeight: 'Bold',
    color: '#002776'
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
    alignItems: 'center',
  },
  formControl: {
    minWidth: 182,
  },
  detailsText: {
    fontSize: '12px',
  },
  button: {
    fontSize: '12px',
    textAlign: 'center',
    width: '100%',
  },
  dropdown: {
    marginLeft: theme?.spacing?theme.spacing(2):'16px',
    '&:first-child': {
      marginLeft: 0,
    },

  },
}));

const memberDetails = {
  MEMBER_NAME: "FR ABC ABC",
  CORPORATE_GROUP: "NULL AMIT KUMAR",
  PARTNER_NUMBER: "-",
  FAMILY_MEMBER_CODE: "KE02487600",
  PERIOD: "16 MAR 2023 - 12 SEP 2023",
  DATE_REGISTER: "16 MAR 2023",
  BROKER_AGENT: "MR SAFN LN TEST",
  MEMBER: "SELF",
};


const MembersDetails = () => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <Box>
      <Box className={classes.header}>
        <Typography className={classes.headerText}>Member Details</Typography>
      </Box>
      <Box className={classes.customStyle}>
        <Grid container>

          <Grid item xs={12} sm={3} container justifyContent='center' alignItems='center'>
            <Box className={classes.pictureContainer}>
              {/*  image can go here */}
            </Box>
          </Grid>
          <Grid item xs={12} sm={9} container spacing={2}>
            <Grid item xs={12} >
              <Typography className={classes.detailsText}><b>Member Name:</b> {memberDetails.MEMBER_NAME}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.detailsText}><b>Corporate/Group:</b> {memberDetails.CORPORATE_GROUP}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.detailsText}><b>Partner Number:</b> {memberDetails.PARTNER_NUMBER}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.detailsText}><b>Family/Member Code:</b> {memberDetails.FAMILY_MEMBER_CODE}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.detailsText}><b>Period:</b> {memberDetails.PERIOD}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.detailsText}><b>Date Registered:</b> {memberDetails.DATE_REGISTER}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.detailsText}><b>Broker/Agent:</b> {memberDetails.BROKER_AGENT}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.detailsText}><b>Member:</b> {memberDetails.MEMBER}</Typography>
            </Grid>
            <Grid container spacing={4} >
              <Grid item  xs={6} sm={4} md={3} >
                <Button size="small" onClick={() => router.push('/endorsements?mode=create')}color="secondary" className={classes.button}>
                  ACCOUNT / PREMIUMS
                </Button>
              </Grid>
              <Grid item  xs={6} sm={4} md={3}>
                <Button size="small" onClick={() => router.push('/endorsements?mode=create')} color="secondary" className={classes.button}>
                  BENEFIT STRUCTURE
                </Button>
              </Grid>
              <Grid item onClick={() => router.push('member-details/view-policy-router/2585')}  xs={6} sm={4} md={3}>
                <Button size="small"   color="secondary" className={classes.button}>
                  VIEW POLICY router
                </Button>
              </Grid>
              <Grid item onClick={() => router.push('/endorsements?mode=create')}  xs={6} sm={4} md={3}>
                <Button size="small"   color="secondary" className={classes.button}>
                  PROPOSER
                </Button>
              </Grid>
              <Grid item onClick={() => router.push('/endorsements?mode=create')}  xs={6} sm={4} md={3}>
                <Button size="small"   color="secondary" className={classes.button}>
                  CLAIMS
                </Button>
              </Grid>
              <Grid item onClick={() => router.push('/endorsements?mode=create')}  xs={6} sm={4} md={3}>
                <Button size="small"   color="secondary" className={classes.button}>
                  PREV PRE-AUTH
                </Button>
              </Grid>
              <Grid item onClick={() => router.push('/endorsements?mode=create')}  xs={6} sm={4} md={3}>
                <Button size="small"   color="secondary" className={classes.button}>
                  AUDIT TRAIL
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

    </Box>
  );
}

export default MembersDetails;
