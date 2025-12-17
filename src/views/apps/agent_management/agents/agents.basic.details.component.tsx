'use client'

import React from 'react'
import { Grid, Typography, Paper, Box, Chip } from '@mui/material'

interface AgentBasicDetailsProps {
  agentData: any
}

const AgentBasicDetails: React.FC<AgentBasicDetailsProps> = ({ agentData }) => {
  const formatDate = (timestamp: number) => {
    return timestamp ? new Date(timestamp).toLocaleDateString() : 'N/A'
  }

  return (
    <Paper elevation={1} sx={{ padding: 3, margin: 2 }}>
      <Typography variant="h6" gutterBottom>
        Basic Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Agent Name:
            </Typography>
            <Typography variant="body1">
              {agentData?.agentBasicDetails?.name || 'N/A'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Agent Code:
            </Typography>
            <Typography variant="body1">
              {agentData?.agentBasicDetails?.code || 'N/A'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Agent Type:
            </Typography>
            <Typography variant="body1">
              {agentData?.agentBasicDetails?.type || 'N/A'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Primary Contact:
            </Typography>
            <Typography variant="body1">
              {agentData?.agentBasicDetails?.contactNos?.find((contact: any) => contact.contactType === 'PRIMARY')?.contactNo || 'N/A'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Primary Email:
            </Typography>
            <Typography variant="body1">
              {agentData?.agentBasicDetails?.emails?.find((email: any) => email.contactType === 'PRIMARY')?.emailId || 'N/A'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Status:
            </Typography>
            <Chip 
              label={agentData?.agentBasicDetails?.status ? 'Active' : 'Inactive'} 
              color={agentData?.agentBasicDetails?.status ? 'success' : 'error'}
              size="small"
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Joining Date:
            </Typography>
            <Typography variant="body1">
              {formatDate(agentData?.agentBasicDetails?.joiningDate)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Date of Birth:
            </Typography>
            <Typography variant="body1">
              {formatDate(agentData?.agentBasicDetails?.dob)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              PAN Number:
            </Typography>
            <Typography variant="body1">
              {agentData?.agentBasicDetails?.taxPinNumber || 'N/A'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Approval Status:
            </Typography>
            <Chip 
              label={agentData?.agentBasicDetails?.approvalProgressStatus || 'N/A'} 
              color={agentData?.agentBasicDetails?.approvalProgressStatus === 'APPROVED' ? 'success' : 'warning'}
              size="small"
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Partner ID:
            </Typography>
            <Typography variant="body1">
              {agentData?.agentBasicDetails?.partnerId || 'N/A'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Tax Exempted:
            </Typography>
            <Chip 
              label={agentData?.agentBasicDetails?.taxExempted ? 'Yes' : 'No'} 
              color={agentData?.agentBasicDetails?.taxExempted ? 'success' : 'default'}
              size="small"
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default AgentBasicDetails
