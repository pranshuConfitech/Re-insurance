'use client'

import React from 'react'
import { Grid, Typography, Paper, Box, Chip, Divider } from '@mui/material'

interface AgentAccountsOthersProps {
  agentData: any
}

const AgentAccountsOthers: React.FC<AgentAccountsOthersProps> = ({ agentData }) => {
  const formatDate = (timestamp: number | null) => {
    return timestamp ? new Date(timestamp).toLocaleDateString() : 'N/A'
  }

  const otherDetails = agentData?.agentOtherDetails
  const accountDetailsArray = otherDetails?.accountDetails || []

  // Define bank account fields for mapping
  const bankAccountFields = [
    { key: 'bankAccountHolderName', label: 'Account Holder Name' },
    { key: 'bankName', label: 'Bank Name' },
    { key: 'accountNo', label: 'Account Number' },
    { key: 'branchCode', label: 'Branch Code' },
    { key: 'branchName', label: 'Branch Name' }
  ]

  // Define other details fields for mapping
  const otherDetailsFields = [
    // { key: 'licenseCode', label: 'License Code', type: 'text' },
    // { key: 'licenseCountry', label: 'License Country', type: 'text' },
    // { key: 'licenseState', label: 'License State', type: 'text' },
    { key: 'serviceTaxNoOrGstNo', label: 'GST/Service Tax Number', type: 'text' },
    { key: 'taxonomyCode', label: 'Taxonomy Code', type: 'text' },
    { key: 'ein', label: 'EIN', type: 'text' },
    { key: 'inaugurationCountry', label: 'Inauguration Country', type: 'text' },
    { key: 'inaugurationState', label: 'Inauguration State', type: 'text' },
    { key: 'websiteUrl', label: 'Website URL', type: 'text' },
    { key: 'inaugurationDate', label: 'Inauguration Date', type: 'date' },
    { key: 'enumerationDate', label: 'Enumeration Date', type: 'date' },
    { key: 'licenseStatus', label: 'License Status', type: 'boolean' }
  ]

  return (
    <Paper elevation={1} sx={{ padding: 3, margin: 2 }}>
      <Typography variant="h6" gutterBottom>
        Accounts and Others
      </Typography>

      {/* Bank Account Details - Using Map for Array */}
      <Box sx={{ mt: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#626BDA' }}>
          Bank Account Details
        </Typography>
        {accountDetailsArray.length > 0 ? (
          accountDetailsArray.map((account: any, index: number) => (
            <Box
              key={account.id || index}
              sx={{
                mb: 3,
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                backgroundColor: '#fafafa'
              }}
            >
              <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                Account {index + 1}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {bankAccountFields.map((field) => (
                  <Grid item xs={12} sm={6} key={field.key}>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        {field.label}:
                      </Typography>
                      <Typography variant="body1">
                        {account[field.key] || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No bank account details available
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Other Details - Using Map for Fields */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#626BDA' }}>
          Other Details
        </Typography>
        <Grid container spacing={2}>
          {otherDetailsFields.map((field) => (
            <Grid item xs={12} sm={6} key={field.key}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {field.label}:
                </Typography>
                {field.type === 'boolean' ? (
                  <Chip
                    label={otherDetails?.[field.key] ? 'Active' : 'Inactive'}
                    color={otherDetails?.[field.key] ? 'success' : 'error'}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                ) : field.type === 'date' ? (
                  <Typography variant="body1">
                    {formatDate(otherDetails?.[field.key])}
                  </Typography>
                ) : (
                  <Typography variant="body1">
                    {otherDetails?.[field.key] || 'N/A'}
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Commission - Additional field */}
      {/* <Box sx={{ mt: 3 }}>
        <Divider sx={{ my: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Commission:
              </Typography>
              <Typography variant="body1">
                {agentData?.commission || 0}%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box> */}
    </Paper>
  )
}

export default AgentAccountsOthers
