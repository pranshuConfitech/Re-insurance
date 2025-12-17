import * as React from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { TpaService } from '@/services/remote-api/api/tpa-service'

const tpaService = new TpaService()


const useStyles = makeStyles(theme => ({
  input1: {
    width: '50%'
  },
  clientTypeRadioGroup: {
    flexWrap: 'nowrap',
    '& label': {
      flexDirection: 'row'
    }
  },
  formControl: {
    minWidth: '90%'
  }
}))

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
})


export default function BasicDetailsStepComponent(props: any) {
  const classes = useStyles()
  const query2 = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const id: any = params.id

  const formik = useFormik({
    initialValues: {
      name: '',
      contactNo: '',
      email: '',
      code: ''
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      handleSubmitPlan()
    }
  })

  React.useEffect(() => {
    if (id) {
      populateData(id)
    }
  }, [id])

  const populateData = (id: string) => {
    tpaService.getTpaDetails(id).subscribe((value: any) => {
      formik.setValues({
        name: value.name,
        contactNo: value.contactNo,
        email: value.email,
        code: value.code
      })
    })
  }

  const handleSubmitPlan = () => {
    const payload: any = {
      name: formik.values.name,
      contactNo: formik.values.contactNo,
      email: formik.values.email
    }

    if (query2.get('mode') === 'create') {
      tpaService.saveTpa(payload).subscribe(res => {
        handleClose('close')
      })
    }

    // if (query2.get('mode') === 'edit') {
    //   payload['code'] = formik.values.code
    //   tpaService.saveTpa(payload, id).subscribe(res => {
    //     handleClose('close')
    //   })
    // }
  }

  const handleClose = (event: any) => {
    router.push(`/tpa?mode=viewList`)
  }

  return (
    <Paper elevation={0}>
      <Box p={3} my={2}>
        <form onSubmit={formik.handleSubmit} noValidate>
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <TextField
                  id='standard-basic'
                  name='name'
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  label={
                    <span>
                      Name
                    </span>
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <TextField
                  id='standard-basic'
                  type='number'
                  name='contactNo'
                  value={formik.values.contactNo}
                  onChange={formik.handleChange}
                  label='Contact No*'
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <TextField
                  id='standard-basic'
                  name='email'
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  label='Email id'
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button color='secondary' style={{ marginRight: '5px' }} type='submit'>
                Save
              </Button>
              <Button color='primary' onClick={handleClose} className='p-button-text'>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Paper>
  )
}
