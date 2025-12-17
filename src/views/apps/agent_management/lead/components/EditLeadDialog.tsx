import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment
} from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme: any) => ({
  content: {
    padding: theme?.spacing ? theme.spacing(2) : '16px'
  },
  field: {
    marginBottom: theme?.spacing ? theme.spacing(2) : '16px'
  }
}))

const statusOptions = ['Hot', 'Warm', 'Cold']

const EditLeadDialog = ({ open, onClose, lead, onSave }: { open: any; onClose: any; lead: any; onSave: any }) => {
  const classes = useStyles()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: '',
    forecast: '',
    assignedTo: ''
  })

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        email: lead.contact?.email || '',
        phone: lead.contact?.phone || '',
        status: lead.status || '',
        forecast: lead.forecast?.replace('%', '') || '',
        assignedTo: lead.assignedTo || ''
      })
    }
  }, [lead])

  const handleChange = (event: any) => {
    const { name, value } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = () => {
    const updatedLead = {
      ...lead,
      name: formData.name,
      contact: {
        email: formData.email,
        phone: formData.phone
      },
      status: formData.status,
      forecast: `${formData.forecast}%`,
      assignedTo: formData.assignedTo,
      lastUpdated: new Date().toISOString()
    }
    onSave(updatedLead)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Edit Lead</DialogTitle>
      <DialogContent className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Lead Name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className={classes.field}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Email'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
              className={classes.field}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Phone'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              className={classes.field}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth className={classes.field}>
              <InputLabel>Status</InputLabel>
              <Select name='status' value={formData.status} onChange={handleChange}>
                {statusOptions.map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Forecast'
              name='forecast'
              type='number'
              value={formData.forecast}
              onChange={handleChange}
              className={classes.field}
              InputProps={{
                endAdornment: <InputAdornment position='end'>%</InputAdornment>
              }}
              inputProps={{
                min: 0,
                max: 100
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Assigned To'
              name='assignedTo'
              value={formData.assignedTo}
              onChange={handleChange}
              className={classes.field}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color='primary' variant='contained'>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditLeadDialog
