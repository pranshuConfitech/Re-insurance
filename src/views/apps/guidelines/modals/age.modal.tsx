import React from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'

import { useFormik } from 'formik'

import { GuidlineService } from '@/services/remote-api/api/master-services/guidline.service'

const initialValues = {
  underwritingMaxAge: '',
  underwritingMinAge: '',
  underwritingGender: '',
  underwritingGuideLinesIncome: '',
  underwritingRelationShip: '',
  underwritingGuidelinesMaxBmi: '',
  underwritingGuidelinesMaxDeclaration: ''
}

const guidelinesService = new GuidlineService()

const AgeModal = ({
  open,
  setOpen,
  handleClose,
  type
}: {
  open: boolean
  setOpen: any
  handleClose: any
  type: any
}) => {
  const formik = useFormik({
    initialValues: {
      ...initialValues
    },

    // validationSchema: validationSchema,
    onSubmit: values => {
      handleSubmit()
    }
  })

  const handleSubmit = () => {
    const payload: any = {}

    if (type === 1) {
      payload.underwritingMinAge = formik.values.underwritingMinAge
      payload.underwritingMaxAge = formik.values.underwritingMaxAge

      guidelinesService.saveAgeGuidline(payload).subscribe(res => {
        handleClose()
      })
    }

    if (type === 2) {
      payload.underwritingGender = formik.values.underwritingGender

      guidelinesService.saveGenderGuidline(payload).subscribe(res => {
        handleClose()
      })
    }

    if (type === 3) {
      payload.underwritingRelationShip = formik.values.underwritingRelationShip

      guidelinesService.saveRelationshipGuidline(payload).subscribe(res => {
        handleClose()
      })
    }

    if (type === 4) {
      payload.underwritingGuideLinesIncome = formik.values.underwritingGuideLinesIncome

      guidelinesService.saveAnnualIncomeGuidline(payload).subscribe(res => {
        handleClose()
      })
    }

    if (type === 5) {
      payload.underwritingGuidelinesMaxBmi = formik.values.underwritingGuidelinesMaxBmi
      payload.underwritingGuidelinesMaxDeclaration = formik.values.underwritingGuidelinesMaxDeclaration

      guidelinesService.saveBMIGuidline(payload).subscribe(res => {
        handleClose()
      })
    }
  }

  const title = ['Age Details', 'Gender', 'Relationship', 'Annual Income', 'BMI']

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='form-dialog-title'
      fullWidth
      maxWidth={'sm'}
      disableEnforceFocus
    >
      <DialogTitle id='form-dialog-title'>{title[type - 1]}</DialogTitle>
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogContent>
          {type === 1 && (
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12}>
                <TextField
                  id='standard-multiline-flexible'
                  name='underwritingMinAge'
                  value={formik.values.underwritingMinAge}
                  onChange={formik.handleChange}
                  label='Min Age'
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id='standard-multiline-flexible'
                  name='underwritingMaxAge'
                  value={formik.values.underwritingMaxAge}
                  onChange={formik.handleChange}
                  label='Max Age'
                  fullWidth
                />
              </Grid>
            </Grid>
          )}
          {type === 2 && (
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12}>
                <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                  Gender
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  label='Gender'
                  name='underwritingGender'
                  fullWidth
                  value={formik.values.underwritingGender}
                  onChange={formik.handleChange}
                >
                  <MenuItem value='Male'>Male</MenuItem>
                  <MenuItem value='Female'>Female</MenuItem>
                </Select>
              </Grid>
            </Grid>
          )}
          {type === 3 && (
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12}>
                <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                  Relationship
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  label='Relationship'
                  name='underwritingRelationShip'
                  fullWidth
                  value={formik.values.underwritingRelationShip}
                  onChange={formik.handleChange}
                >
                  <MenuItem value='Self'>Self</MenuItem>
                  <MenuItem value='Spouse'>Spouse</MenuItem>
                  <MenuItem value='Mother'>Mother</MenuItem>
                  <MenuItem value='Father'>Father</MenuItem>
                  <MenuItem value='Child1'>Child1</MenuItem>
                  <MenuItem value='Child2'>Child2</MenuItem>
                  <MenuItem value='Child3'>Child3</MenuItem>
                  <MenuItem value='Child4'>Child4</MenuItem>
                </Select>
              </Grid>
            </Grid>
          )}
          {type === 4 && (
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12}>
                <TextField
                  id='standard-multiline-flexible'
                  name='underwritingGuideLinesIncome'
                  value={formik.values.underwritingGuideLinesIncome}
                  onChange={formik.handleChange}
                  label='Min Age'
                  fullWidth
                />
              </Grid>
            </Grid>
          )}
          {type === 5 && (
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12}>
                <TextField
                  id='standard-multiline-flexible'
                  name='underwritingGuidelinesMaxBmi'
                  value={formik.values.underwritingGuidelinesMaxBmi}
                  onChange={formik.handleChange}
                  label='Max BMI'
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id='standard-multiline-flexible'
                  name='underwritingGuidelinesMaxDeclaration'
                  value={formik.values.underwritingGuidelinesMaxDeclaration}
                  onChange={formik.handleChange}
                  label='Max Declaration'
                  fullWidth
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button color='primary' variant='contained' type='submit'>
            Submit
          </Button>
          <Button variant='text' onClick={handleClose} type='button' color='primary'>
            Close
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AgeModal
