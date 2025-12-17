import * as React from 'react'
import { useEffect } from 'react'

import { Snackbar } from '@mui/material'
import { Button } from 'primereact/button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'
import MuiAlert from '@mui/lab/Alert'

import 'date-fns'

import { HierarchyService } from '@/services/remote-api/api/hierarchy-services/hierarchy.services'
import { UsersService } from '@/services/remote-api/api/user-management-service/users.service'

const orgtypeservice = new HierarchyService()

function Alert(props: any) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

const usersService = new UsersService()
const usersService$ = usersService.getUsers()

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
  formControl: {
    minWidth: 182
  }
}))

export default function EmployeeAddModal(props: any) {
  const classes = useStyles()
  const [remarks, setRemarks]: any = React.useState()
  const [fullWidth, setFullWidth] = React.useState(true)
  const [maxWidth, setMaxWidth] = React.useState<any>('sm')
  const [employeeList, setEmployeelist] = React.useState([])
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  const [snackbarMessage, setSnackbarMessage] = React.useState('')

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  useEffect(() => {
    if (props.selectedNode?.user?.userId) {
      props.userList.forEach((usr: any) => {
        if (usr.id === props.selectedNode?.user?.userId) {
          setRemarks(usr)
        }
      })
    }
  }, [props.userList])

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        result.content.forEach((r: any, i: any) => {
          r['id'] = i
          r['name'] = r.userName
        })

        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(usersService$, setEmployeelist)

  const handleClose = () => {
    props.closeEmployeeModal()
  }

  const handleModalSubmit = () => {
    if (props.selectedNode && remarks !== '' && remarks !== null) {
      const payload = {
        id: props.selectedNode.id ? props.selectedNode.id : null,
        userId: remarks.username,
        userType: remarks.type
      }
      orgtypeservice.addUser(payload, props.selectedNode.id ? props.selectedNode.id : null).subscribe(res => {
        setRemarks('')
        props.submitEmployeeModal()
      })
    }

    if (!props.selectedNode) {
      setSnackbarMessage('Position not selected')
      setSnackbarOpen(true)
    }

    if (remarks === null || remarks === '') {
      setSnackbarMessage('Please choose a user/agent')
      setSnackbarOpen(true)
    }

    // invoiceservice.revertInvoice(remarks,props.selectedInvoiceForReversal).subscribe(ele=> {
    //     props.closeEmployeeModal();
    // })
  }

  const handleChange = (e: any) => {
    setRemarks(e.target.value)
  }

  return (
    <Dialog
      open={props.employeeModal}
      onClose={handleClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      aria-labelledby='form-dialog-title'
      disableEnforceFocus
    >
      <DialogTitle id='form-dialog-title'>{props.headerText}</DialogTitle>
      <DialogContent>
        <FormControl className={classes.formControl}>
          <Select
            labelId='demo-simple-select-label'
            name='remarks'
            label='Remarks'
            id='demo-simple-select'
            value={remarks}
            onChange={handleChange}
          >
            {props.userList.map((ele: any) => {
              return (
                <MenuItem value={ele} key={ele.id}>
                  {ele.name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
        <Snackbar
          open={snackbarOpen}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        >
          <Alert onClose={handleSnackbarClose} severity='error'>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary' className='p-button-text'>
          Cancel
        </Button>
        <Button onClick={handleModalSubmit} color='primary'>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}
