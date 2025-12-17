'use client'

import React from 'react'
import { Grid, Typography, Paper, Box } from '@mui/material'

interface AgentAddressOthersProps {
  agentData: any
}

const AgentAddressOthers: React.FC<AgentAddressOthersProps> = ({ agentData }) => {
  const addresses = agentData?.agentAddresses?.addresses || []
  const contactPerson = agentData?.agentAddresses?.agentContactPersonDetails

  // Group addresses by type and merge all addressDetails
  const groupedAddresses = addresses.reduce((acc: any, addressObj: any) => {
    const type = addressObj.addressType || 'UNKNOWN'
    if (!acc[type]) {
      acc[type] = {}
    }
    Object.assign(acc[type], addressObj.addressDetails || {})
    return acc
  }, {})

  // Define contact person fields for mapping
  const contactPersonFields = [
    { key: 'name', label: 'Contact Person Name' },
    { key: 'emailId', label: 'Email ID' },
    { key: 'alternateEmailId', label: 'Alternate Email ID' },
    { key: 'mobileNo', label: 'Mobile Number' },
    { key: 'alternateMobileNo', label: 'Alternate Mobile Number' },
    // { key: 'openingTime', label: 'Opening Time' },
    // { key: 'closeingTime', label: 'Closing Time' },
    // { key: 'breakStartTime', label: 'Break Start Time' },
    // { key: 'breakEndTime', label: 'Break End Time' }
  ]

  // Define address fields for mapping
  const addressFields = [
    { key: 'add', label: 'Address Line 1' },
    { key: 'add2', label: 'Address Line 2' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'country', label: 'Country' },
    { key: 'pinCode', label: 'Pin Code' },
    { key: 'zipCode', label: 'Zip Code' }
  ]

  return (
    <Paper elevation={1} sx={{ padding: 3, margin: 2 }}>
      <Typography variant="h6" gutterBottom>
        Address and Others
      </Typography>

      {/* Contact Person Details */}
      <Box sx={{ mt: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#626BDA' }}>
          Contact Person Details
        </Typography>
        <Grid container spacing={2}>
          {contactPersonFields.map((field) => (
            <Grid item xs={12} sm={6} key={field.key}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {field.label}:
                </Typography>
                <Typography variant="body1">
                  {contactPerson?.[field.key] || 'N/A'}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Addresses */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#626BDA' }}>
          Addresses
        </Typography>
        {Object.keys(groupedAddresses).length > 0 ? (
          Object.entries(groupedAddresses).map(([type, addressData]: [string, any], index) => {
            // Filter only non-empty address fields
            const filledFields = addressFields.filter(field => 
              addressData[field.key] && addressData[field.key].trim() !== ''
            )

            return (
              <Box 
                key={index} 
                sx={{ 
                  mb: 3, 
                  p: 2, 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 1,
                  backgroundColor: '#fafafa'
                }}
              >
                <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                  {type.replace(/_/g, ' ')}
                </Typography>
                
                {filledFields.length > 0 ? (
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {filledFields.map((field) => (
                      <Grid item xs={12} sm={6} key={field.key}>
                        <Box>
                          <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 500 }}>
                            {field.label}:
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {addressData[field.key]}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    No address details available
                  </Typography>
                )}

                {/* Show all fields including empty ones for debugging */}
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                  <Typography variant="caption" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                    All Fields:
                  </Typography>
                  <Grid container spacing={1} sx={{ mt: 0.5 }}>
                    {addressFields.map((field) => (
                      <Grid item xs={12} sm={6} key={field.key}>
                        <Typography variant="caption" color="textSecondary">
                          {field.label}: {addressData[field.key] || '(empty)'}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            )
          })
        ) : (
          <Typography variant="body1" color="textSecondary">
            No addresses available
          </Typography>
        )}
      </Box>


    </Paper>
  )
}

export default AgentAddressOthers
