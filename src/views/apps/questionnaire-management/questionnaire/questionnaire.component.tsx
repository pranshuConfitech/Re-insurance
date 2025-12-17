import React from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'
import * as yup from 'yup'
import TextField from '@mui/material/TextField'
import { useFormik } from 'formik'
import { Button, FormHelperText, FormControl } from '@mui/material'
import { Typography } from '@mui/material'
import { Toast } from 'primereact/toast'

import { QuestionnaireService } from '@/services/remote-api/api/master-services/questionnaire.service'

const questionnaireService = new QuestionnaireService()

const useStyles = makeStyles((theme: any) => ({
  input1: {
    width: '50%'
  },
  clientTypeRadioGroup: {
    flexWrap: 'nowrap',
    '& label': {
      flexDirection: 'row'
    }
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  },
  formControl: {
    minWidth: 182
  },
  formControl1: {
    minWidth: 300
  },
  heading: {
    fontSize: theme?.typography?.pxToRem(15),

    // flexBasis: '33.33%',
    flexShrink: 0,
    fontWeight: 700
  },
  secondaryHeading: {
    fontSize: theme?.typography?.pxToRem(15),
    color: theme?.palette?.text?.secondary
  },
  actionContainer: {},
  buttonPrimary: {}
}))

const validationSchema = yup.object({
  question: yup.string().required('Question is required'),
  minimumAge: yup.string().required('Minimum age is required'),
  maximumAge: yup.string().required('Maximum age is required'),
  gender: yup.string().required('Gender is required')
})

const initialValues = {
  question: '',
  minimumAge: '',
  maximumAge: '',
  gender: ''
}

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

export default function QuestionnaireComponent(props: any) {
  const classes = useStyles()
  const query = useSearchParams()
  const history = useRouter()
  const id: any = useParams().id
  const toast = React.useRef<any>(null)

  const formik = useFormik({
    initialValues: {
      ...initialValues
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      handleSubmit()

      // console.log("asasas", values)
    }
  })

  React.useEffect(() => {
    if (id) {
      populateData(id)
    }
  }, [id])

  const populateData = (id: any) => {
    questionnaireService.getQuestionnaireById(id).subscribe((value: any) => {
      formik.setValues({
        question: value.question,
        minimumAge: value.minimumAge,
        maximumAge: value.maximumAge,
        gender: value.gender
      })
    })
  }

  const handleSubmit = () => {
    const payload = { ...formik.values }

    if (query.get('mode') === 'create') {
      questionnaireService.saveQuestionnaire(payload).subscribe({
        next: (res: any) => {
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Questionnaire created successfully',
            life: 2000
          })
          setTimeout(() => history.push('/questionnaire?mode=viewList'), 1000)
        },
        error: (err: any) => {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong',
            life: 2000
          })
        }
      })
    }

    if (query.get('mode') === 'edit') {
      questionnaireService.saveQuestionnaire(payload).subscribe({
        next: (res: any) => {
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Questionnaire updated successfully',
            life: 2000
          })
          setTimeout(() => history.push('/questionnaire?mode=viewList'), 1000)
        },
        error: (err: any) => {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong',
            life: 2000
          })
        }
      })
    }
  }

  const handleClose = () => {
    history.push(`/questionnaire?mode=viewList`)

    // window.location.reload();
  }

  return (
    <div>
      <Toast ref={toast} />
      <Paper
        elevation={0}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 600, color: '#000' }}>
          Questionnaire
        </Typography>
        <form onSubmit={formik.handleSubmit} noValidate>
          <Box>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box>
                  <TextField
                    variant='outlined'
                    name='question'
                    label='Question'
                    fullWidth
                    value={formik.values.question}
                    onChange={formik.handleChange}
                    error={formik.touched.question && Boolean(formik.errors.question)}
                    helperText={formik.touched.question && formik.errors.question}
                  />
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={4} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <Box>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id='gender-label'>Gender</InputLabel>
                    <Select
                      label='Gender'
                      labelId='gender-label'
                      name='gender'
                      fullWidth
                      value={formik.values.gender}
                      onChange={formik.handleChange}
                      error={formik.touched.gender && Boolean(formik.errors.gender)}
                    >
                      <MenuItem value='male'>Male</MenuItem>
                      <MenuItem value='female'>Female</MenuItem>
                      <MenuItem value='both'>Both</MenuItem>
                    </Select>
                    {formik.touched.gender && Boolean(formik.errors.gender) && (
                      <FormHelperText error>{formik.errors.gender}</FormHelperText>
                    )}
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <TextField
                    variant='outlined'
                    name='minimumAge'
                    label='Age From'
                    fullWidth
                    value={formik.values.minimumAge}
                    onChange={formik.handleChange}
                    error={formik.touched.minimumAge && Boolean(formik.errors.minimumAge)}
                    helperText={formik.touched.minimumAge && formik.errors.minimumAge}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <TextField
                    variant='outlined'
                    name='maximumAge'
                    label='Age To'
                    fullWidth
                    value={formik.values.maximumAge}
                    onChange={formik.handleChange}
                    error={formik.touched.maximumAge && Boolean(formik.errors.maximumAge)}
                    helperText={formik.touched.maximumAge && formik.errors.maximumAge}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Grid
            container
            justifyContent="flex-end"
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Grid item>
              <Button 
                variant='outlined' 
                onClick={handleClose}
                sx={{ 
                  minWidth: '120px',
                  mr: 2
                }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant='contained' 
                color='primary' 
                type='submit'
                sx={{ 
                  minWidth: '120px'
                }}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  )
}
