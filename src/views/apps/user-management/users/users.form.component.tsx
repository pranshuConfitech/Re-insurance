import React from 'react'

import { useParams, useRouter } from 'next/navigation'

import { Button } from 'primereact/button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import Autocomplete from '@mui/lab/Autocomplete'
import { withStyles } from '@mui/styles'
import { Formik } from 'formik'
import * as Yup from 'yup'

import { RolesService, UsersService } from '@/services/remote-api/api/user-management-service'

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' />

const rolesService = new RolesService()
const usersService = new UsersService()

const rolesService$ = rolesService.getRoles()
const rolesLocation$ = rolesService.getLocation()

const useStyles = (theme: any) => ({
  root: {
    padding: 20,
    '& .MuiFormLabel-asterisk.MuiInputLabel-asterisk': {
      color: 'red'
    }
  },
  formControl: {
    width: '100%',
    marginBottom: 16,
    height: '100%'
  },
  formControlWrapper: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  rowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    marginBottom: 16
  },
  textField: {
    width: '100%'
  },
  autocompleteWrapper: {
    width: '100%',
    height: '100%',
    '& .MuiFormControl-root': {
      width: '100%',
      height: '100%'
    },
    '& .MuiInputBase-root': {
      width: '100%'
    },
    '& .MuiAutocomplete-root': {
      width: '100%'
    }
  },
  gridContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px'
  }
})

const initForm = {
  firstName: '',
  lastName: '',
  userName: '',
  email: '',
  roles: [],
  location: [],
  password: ''
}

const usersSchema = Yup.object().shape({
  userName: Yup.string().required('Username is required'),
  roles: Yup.array().min(1, 'Select atleast one role'),
  location: Yup.array().min(1, 'Select atleast one role')
})

function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()
    const params = useParams()

    return <Component {...props} router={router} params={params} />
  }
}

type FormikProps = {
  errors: any
  touched: any
  handleSubmit: (event: any) => void
  values: any
  handleChange: (e: any) => void
  setFieldValue: (field: string, value: any) => void
}
class UsersFormComponent extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.state = {
      userForm: { ...initForm },
      rolesList: [],
      rolesLocation: []
    }
  }

  componentDidMount() {
    rolesService$.subscribe((response: any) => {
      this.setState({
        ...this.state,
        rolesList: response.map(({ name }: { name: any }) => ({ id: name, name }))
      })
    })
    rolesLocation$.subscribe((response: any) => {
      this.setState({
        ...this.state,
        rolesLocation: response.map(({ id, code, name }: { id: any; code: any; name: any }) => ({ id, code, name }))
      })
    })

    if (this.props.params.userName) {
      usersService.getUserDetails(this.props.params.userName).subscribe((res: any) => {
        this.setState({
          ...this.state,
          userForm: { ...res, roles: res.roles.map((r: any) => ({ id: r, name: r })) }
        })
      })
    }
  }

  handleClose = () => {
    this.props.router.push('/user-management/users')
  }

  render() {
    const { classes } = this.props
    const { rolesList, rolesLocation, userForm } = this.state

    return (
      <div>
        <Typography variant='h6' gutterBottom>
          Users Management: {this.props.params.userName ? 'Edit' : 'Add'}
        </Typography>
        <Paper elevation={0}>
          <div className={classes.root}>
            <Formik
              enableReinitialize={true}
              initialValues={{ ...userForm }}
              validationSchema={usersSchema}
              onSubmit={(values, { resetForm }) => {
                const payload = {
                  ...initForm,
                  ...values,
                  roles: values.roles.map((item: any) => item.name),
                  location: values.location.map((item: any) => item.code)
                }

                if (this.props.params.userName) {
                  usersService.updateUsers(this.props.params.userName, payload).subscribe(res => {
                    if (res.status) {
                      this.handleClose()
                    }
                  })
                } else {
                  usersService.saveUsers(payload).subscribe(res => {
                    if (res.status) {
                      resetForm()
                      this.handleClose()
                    }
                  })
                }
              }}
            >
              {({ touched, errors, handleSubmit, handleChange, values, setFieldValue }: FormikProps) => {
                const allSelected = rolesList.length > 0 && values.roles.length === rolesList.length
                const allSelect = rolesLocation?.length > 0 && values?.location?.length === rolesLocation?.length

                const handleRoleChange = (e: any, val: any) => {
                  let selectedRoles = val
                  const isSelecAll = selectedRoles.some((item: any) => item.id === 'selectall')

                  if (isSelecAll) {
                    if (rolesList.length > 0 && rolesList.length === values.roles.length) {
                      selectedRoles = []
                    } else {
                      selectedRoles = this.state.rolesList
                    }
                  }

                  setFieldValue('roles', selectedRoles)
                }

                const handleRoleChanged = (e: any, val: any) => {
                  let selectedLocation = val
                  const isSelecAll = selectedLocation.some((item: any) => item.id === 'selectall')

                  if (isSelecAll) {
                    if (rolesLocation.length > 0 && rolesLocation.length === values.roles.length) {
                      selectedLocation = []
                    } else {
                      selectedLocation = this.state.rolesLocation
                    }
                  }

                  setFieldValue('location', selectedLocation)
                }

                const autocompleteFilterChange = (options: any, state: any) => {
                  if (state.inputValue) {
                    return options.filter((item: any) => item.name.toLowerCase().indexOf(state.inputValue) > -1)
                  }

                  return [{ id: 'selectall', name: 'Select all' }, ...options]
                }

                return (
                  <form onSubmit={handleSubmit} noValidate>
                    <div className={classes.gridContainer}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3} className={classes.rowContainer}>
                          <div className={classes.formControlWrapper}>
                            <TextField
                              className={classes.textField}
                              name='firstName'
                              label='First Name'
                              value={values.firstName}
                              onChange={handleChange}
                              fullWidth
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} className={classes.rowContainer}>
                          <div className={classes.formControlWrapper}>
                            <TextField 
                              className={classes.textField}
                              name='lastName' 
                              label='Last Name' 
                              value={values.lastName} 
                              onChange={handleChange}
                              fullWidth 
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} className={classes.rowContainer}>
                          <div className={classes.formControlWrapper}>
                            <TextField
                              className={classes.textField}
                              name='userName'
                              label='Username'
                              value={values.userName}
                              onChange={handleChange}
                              required
                              disabled={!!this.props.params.userName}
                              error={touched.userName && Boolean(errors.userName)}
                              fullWidth
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} className={classes.rowContainer}>
                          <div className={classes.formControlWrapper}>
                            <TextField
                              className={classes.textField}
                              name='email'
                              label='Email Id'
                              value={values.email}
                              onChange={handleChange}
                              disabled={!!this.props.params.userName}
                              fullWidth
                            />
                          </div>
                        </Grid>
                      </Grid>

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3} className={classes.rowContainer}>
                          <div className={classes.formControlWrapper}>
                            <FormControl
                              className={classes.formControl}
                              required
                              error={touched.roles && Boolean(errors.roles)}
                            >
                              <Autocomplete
                                className={classes.autocompleteWrapper}
                                multiple
                                value={values.roles}
                                onChange={handleRoleChange}
                                id="checkboxes-tags-role"
                                filterOptions={autocompleteFilterChange}
                                options={rolesList}
                                disableCloseOnSelect
                                getOptionLabel={(option: any) => option?.name || ""}
                                isOptionEqualToValue={(option: any, value: any) => option?.id === value?.id}
                                renderOption={(props: any, option: any, { selected }: { selected: any }) => {
                                  const selectedOpt = (option.id === "selectall" && allSelected) || selected;
                                  return (
                                    <li {...props}>
                                      <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8, color: "#626bda" }}
                                        checked={selectedOpt}
                                      />
                                      {option.name}
                                    </li>
                                  );
                                }}
                                renderInput={(params: any) => (
                                  <TextField {...params} label="Roles" placeholder="Select Roles" required fullWidth />
                                )}
                              />
                              {touched.roles && Boolean(errors.roles) && (
                                <FormHelperText>{touched.roles && errors.roles}</FormHelperText>
                              )}
                            </FormControl>
                          </div>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3} className={classes.rowContainer}>
                          <div className={classes.formControlWrapper}>
                            <FormControl
                              className={classes.formControl}
                              required
                              error={touched.location && Boolean(errors.location)}
                            >
                              <Autocomplete
                                className={classes.autocompleteWrapper}
                                multiple
                                value={values?.location ? values.location : []}
                                onChange={handleRoleChanged}
                                id="checkboxes-tags-location"
                                filterOptions={autocompleteFilterChange}
                                options={rolesLocation}
                                disableCloseOnSelect
                                getOptionLabel={(option: any) => option?.name || ""}
                                isOptionEqualToValue={(option: any, value: any) => option?.id === value?.id}
                                renderOption={(props: any, option: any, { selected }: { selected: any }) => {
                                  const selectedOpt = (option.id === "selectall" && allSelect) || selected;
                                  return (
                                    <li {...props}>
                                      <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8, color: "#626bda" }}
                                        checked={selectedOpt}
                                      />
                                      {option.name}
                                    </li>
                                  );
                                }}
                                renderInput={(params: any) => (
                                  <TextField {...params} label="Location" placeholder="Select Location" required fullWidth />
                                )}
                              />
                              {touched.location && Boolean(errors.location) && (
                                <FormHelperText>{touched.location && errors.location}</FormHelperText>
                              )}
                            </FormControl>
                          </div>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3} className={classes.rowContainer}>
                          <div className={classes.formControlWrapper}>
                            <TextField
                              className={classes.textField}
                              name='password'
                              label='Password'
                              type='password'
                              value={values.password}
                              onChange={handleChange}
                              required
                              disabled={!!this.props.params.password}
                              error={touched.userName && Boolean(errors.password)}
                              fullWidth
                            />
                          </div>
                        </Grid>
                      </Grid>
                    </div>

                    <Grid container spacing={3} style={{ marginTop: 16 }}>
                      <Grid item xs={12} sm={6} md={4}>
                        <Button type='submit' color='primary'>
                          Save
                        </Button>
                        <Button style={{ marginLeft: 15 }} className='p-button-text' onClick={() => this.handleClose()}>
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                )
              }}
            </Formik>
          </div>
        </Paper>
      </div>
    )
  }
}

export default withRouter(withStyles(useStyles)(UsersFormComponent))
