'use client'
import React, { useEffect } from 'react'

import { Snackbar } from '@mui/material'
import { Button } from 'primereact/button'
import Grid from '@mui/material/Grid'
import { makeStyles } from '@mui/styles'
import MuiAlert from '@mui/lab/Alert'

import ConfirmationDialogComponent from './modals/confirmation.dialog.component'
import EmployeeAddModal from './modals/employee.add.modal.component'
import EmployeeListModal from './modals/employee.list.modal.component'
import PositionAddModal from './modals/position.add.modal.component'
import { UsersService } from '@/services/remote-api/api/user-management-service/users.service'
import { HierarchyService } from '@/services/remote-api/api/hierarchy-services/hierarchy.services'
import { AgentsService } from '@/services/remote-api/api/agents-services/agents.services'
import { FettleBenefitRuleTreeViewComponent } from '../../shared-component/components/fettle.benefit.rule.treeview'

function Alert(props: any) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

const usersService = new UsersService()
const usersService$ = usersService.getUsers()
const orgtypeservice = new HierarchyService()
const agentsService = new AgentsService()
const ot$ = orgtypeservice.getSampleData()

const useStyles = makeStyles((theme: any) => ({
  root: {
    width: '100%',
    flexGrow: 1,
    minHeight: 100,
    padding: 30
  },
  header: {
    paddingTop: 10,
    paddingBottom: 10,
    color: '#4472C4'
  },
  heading: {
    fontSize: theme?.typography?.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme?.typography?.pxToRem(15),
    color: theme?.palette?.text?.secondary
  }
}))

export default function ClientHierarchyComponent(props: any) {
  const classes = useStyles()

  const [hierarchyData, setHierarchyData] = React.useState([
    // {
    //   id: 455,
    //   name: 'GM',

    //   hirearchy: {
    //     child: [
    //       {
    //         id: 1,
    //         name: 'CM',
    //         child: [
    //           {
    //             id: 10,
    //             name: 'BDM',
    //             child: [
    //               {
    //                 id: 1001,
    //                 name: 'UM',
    //                 child: [
    //                   {
    //                     id: 1010,
    //                     name: 'SA',
    //                     child: [],
    //                     expression: '',
    //                     employeeList: []
    //                   }
    //                 ],
    //                 expression: '',
    //                 employeeList: []
    //               }
    //             ],
    //             expression: '',
    //             employeeList: [
    //               {
    //                 id: 9000,
    //                 name: 'User 1'
    //               }
    //             ]
    //           }
    //         ],
    //         expression: '',
    //         employeeList: []
    //       }
    //     ],
    //     employeeList: [],
    //     expression: ''

    //   }
    // },
    // {
    //   id: 55,
    //   name: 'GM',

    //   hirearchy: {
    //     child: [],
    //     employeeList: [],
    //     expression: ''

    //   }
    // }
  ])

  const [employeeModal, setEmployeeModal] = React.useState(false)
  const [positionModal, setPositionModal] = React.useState(false)
  const [confirmModal, setConfirmModal] = React.useState(false)
  const [employeelistmodal, setEmployeelistmodal] = React.useState(false)
  const [selectedUsersList, setSelectedUsersList] = React.useState([])
  const [selectedEmployee, setSelectedEmployee] = React.useState({})
  const [selectedNode, setSelectedNode] = React.useState({})
  const [orgTypes, setOrgTypes] = React.useState([])
  const [userList, setUsersList] = React.useState([])
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  const [snackbarMessage, setSnackbarMessage] = React.useState('')

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((res: any) => {
        const uList: any = []

        res.content.forEach((usr: any, i: any) => {
          const obj = {
            type: 'USER',
            id: usr.userName,
            username: usr.userName
          }

          uList.push(obj)
        })
        setter(uList)
        orgtypeservice.getHierarchyData('EMPLOYEE').subscribe(result => {
          // const arrval = formatDta(result, uList)
          const arrval = transformPositions(result)

          setHierarchyData(arrval);
        })
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(usersService$, setUsersList)

  useEffect(() => {
    getHierarchy();
  }, [])

  function transformPositions(data: any) {
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      hirearchy: {
        child: transformPositions(item.positionDTOs || []),
      },
      employeeList: [],
      expression: ''
    }));
  }

  // useObservable(ot$, setOrgTypes);
  const formatDta = (data: any, userArray: any) => {
    data &&
      data.forEach((dt: any) => {
        dt['child'] = dt?.childPositions

        if (dt?.user?.userId) {
          userArray &&
            userArray.forEach((usr: any) => {
              if (usr?.id === dt?.user?.userId) {
                dt['employeeList'] = [{ id: usr?.id, name: usr?.username }]
                dt['expression'] = usr?.username
              }
            })
        }

        if (dt?.positionDTOs?.length !== 0) {
          formatDta(dt?.positionDTOs, userArray)
        }
      })

    return data
  }

  const addParentPosition = () => {
    setSelectedNode({})
    setPositionModal(true)
  }

  const confirmYes = (item: any) => {
    setConfirmModal(false)
    orgtypeservice.deletePosition(item.id).subscribe(res => {
      setTimeout(() => {
        getHierarchy()
      }, 1000)
    })
  }

  const confirmNo = () => {
    setConfirmModal(false)
  }

  const addPosition = (item: any) => {
    if (item !== null) {
      setSelectedNode(item)
      setPositionModal(true)
    }

    if (item === null) {
      setSnackbarMessage(
        'Position not selected properly.Please left click on the desired position name and then right click for action'
      )
      setSnackbarOpen(true)
    }
  }

  const deletePosition = (item: any) => {
    if (item !== null) {
      setSelectedNode(item)

      if (item.childPositions.length === 0) {
        setConfirmModal(true)
      }

      if (item.childPositions.length !== 0) {
        setSnackbarMessage('Cannot be deleted,this position has child positions.Please delete them first')
        setSnackbarOpen(true)
      }
    }

    if (item === null) {
      setSnackbarMessage(
        'Position not selected properly.Please left click on the desired position name and then right click for action'
      )
      setSnackbarOpen(true)
    }
  }

  const addEmployee = (item: any) => {
    if (item !== null) {
      setSelectedNode(item)
      setEmployeeModal(true)
    }

    if (item === null) {
      setSnackbarMessage(
        'Position not selected properly.Please left click on the desired position name and then right click for action'
      )
      setSnackbarOpen(true)
    }
  }

  const closePositionModal = () => {
    setPositionModal(false)
    setSelectedNode({})
  }

  const closeEmployeeModal = () => {
    setEmployeeModal(false)
    setSelectedNode({})
  }

  const getHierarchy = () => {
    orgtypeservice.getHierarchyData('EMPLOYEE').subscribe(result => {
      // const arrval = formatDta(result, userList)
      const arrval = transformPositions(result)

      setHierarchyData(arrval);
    })
  }

  const submitPositionModal = () => {
    setTimeout(() => {
      getHierarchy()
    }, 1000)
    setPositionModal(false)
  }

  const submitEmployeeModal = () => {
    setTimeout(() => {
      getHierarchy()
    }, 1000)
    setEmployeeModal(false)
  }

  const closeEmployeeListModal = () => {
    setEmployeelistmodal(false)
  }

  const showEmployeeList = (empList: any) => {
    setSelectedUsersList(empList)
    setEmployeelistmodal(true)
  }

  const calcPosData = (list: any, selectedData: any, val: any) => {
    if (selectedData) {
      list.forEach((el: any) => {
        if (el.id === selectedData.id) {
          el.child.push(val)

          return list
        } else calcPosData(el.child, selectedData, val)
      })
    }
  }

  const calcEmpData = (list: any, selectedData: any, val: any) => {
    if (selectedData) {
      list.forEach((el: any) => {
        if (el.id === selectedData.id) {
          // el.employeeList.push(val);
          el.employeeList[0] = val
          const arrlen = el.employeeList.length

          el.expression = val?.name

          return list
        } else calcEmpData(el.child, selectedData, val)
      })
    }
  }

  console.log("hierarchyData", hierarchyData)

  return (
    <div>
      <Grid
        item
        xs={12}
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          marginBottom: '20px',
          height: '2em',
          color: '#000',
          fontSize: '18px',
          fontWeight: 600
        }}
      >
        <span
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          Employee Hierarchy
        </span>
      </Grid>
      <Grid
        item
        xs={12}
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '20px'
        }}
      >
        <Button color='secondary' className='p-button-secondary' onClick={addParentPosition}>
          Add parent Position
        </Button>
      </Grid>
      <div style={{ width: '400px' }}>
        <FettleBenefitRuleTreeViewComponent
          deleteAction={true}
          deletePosition={deletePosition}
          hierarchy={hierarchyData}
          addPosition={addPosition}
          addEmployee={addEmployee}
          showListView={showEmployeeList}
          activateRgtClck={true}
        />
      </div>
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
      <PositionAddModal
        closePositionModal={closePositionModal}
        positionModal={positionModal}
        submitPositionModal={submitPositionModal}
        selectedNode={selectedNode}
        type='EMPLOYEE'
      />
      <EmployeeAddModal
        closeEmployeeModal={closeEmployeeModal}
        employeeModal={employeeModal}
        submitEmployeeModal={submitEmployeeModal}
        headerText='Add User'
        selectedNode={selectedNode}
        userList={userList}
      />

      <EmployeeListModal
        employeelistmodal={employeelistmodal}
        closeEmployeeListModal={closeEmployeeListModal}
        selectedUsersList={selectedUsersList}
      />
      <ConfirmationDialogComponent
        confirmNo={confirmNo}
        confirmModal={confirmModal}
        confirmYes={confirmYes}
        headerText='Confirmation'
        selectedNode={selectedNode}
      />
    </div>
  )
}
