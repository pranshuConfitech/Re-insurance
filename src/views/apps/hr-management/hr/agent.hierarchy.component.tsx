'use client'
import React, { useEffect } from 'react'

import { Snackbar } from '@mui/material'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import { makeStyles } from '@mui/styles'
import MuiAlert from '@mui/lab/Alert'

import { Button } from 'primereact/button'

import ConfirmationDialogComponent from './modals/confirmation.dialog.component'
import EmployeeAddModal from './modals/employee.add.modal.component'
import EmployeeListModal from './modals/employee.list.modal.component'
import PositionAddModal from './modals/position.add.modal.component'

import { TreeViewComponent } from './treeview'
import { UsersService } from '@/services/remote-api/api/user-management-service/users.service'
import { HierarchyService } from '@/services/remote-api/api/hierarchy-services/hierarchy.services'
import { AgentsService } from '@/services/remote-api/api/agents-services/agents.services'
import { FettleBenefitRuleTreeViewComponent } from '../../shared-component'
import { FettleHierarchyTreeViewComponent } from './component/fettle.hierarchy.treeview'

function Alert(props: any) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

const usersService = new UsersService()
const usersService$ = usersService.getAgent('agent-default-role')
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

export default function AgentHierarchyComponent(props: any) {
  const classes = useStyles()
  const [hierarchyData, setHierarchyData] = React.useState([])
  const [confirmModal, setConfirmModal] = React.useState(false)
  const [employeeModal, setEmployeeModal] = React.useState(false)
  const [positionModal, setPositionModal] = React.useState(false)
  const [employeelistmodal, setEmployeelistmodal] = React.useState(false)
  const [selectedUsersList, setSelectedUsersList] = React.useState([])
  const [selectedEmployee, setSelectedEmployee] = React.useState({})
  const [selectedNode, setSelectedNode] = React.useState({})
  const [orgTypes, setOrgTypes] = React.useState([])
  const [userList, setUsersList] = React.useState([])
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  const [snackbarMessage, setSnackbarMessage] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((res: any) => {
        const uList: any = []
        res.forEach((usr: any, i: any) => {
          const fname = usr.firstName ? usr.firstName : ''
          const lname = usr.lastName ? usr.lastName : ''

          const obj = {
            type: usr.userType,
            id: usr.agentId,
            username: usr.userName,
            name: fname + ' ' + lname
          }

          uList.push(obj)
        })

        const pageRequest: any = {
          page: 0,
          size: 10,
          summary: true,
          active: true,
          sort: ['']
        }

        agentsService.getAgents(pageRequest).subscribe(agentlist => {
          const agList: any = []

          agentlist.content.forEach(ag => {
            const obj = {
              type: 'AGENT',
              id: ag.id,
              username: ag.agentBasicDetails.name
            }

            agList.push(obj)
          })

          const arr = [...uList, ...agList]

          setter(arr)
          orgtypeservice.getHierarchyData('AGENT').subscribe(result => {
            // const arrval = formatDta(result, arr)
            const arrval = transformPositions(result)
            enhanceUnitsWithAPIData(arrval[0]);
            addParentIds(arrval[0]); // Start with the root node
            addLevels(arrval[0]);
            setHierarchyData(arrval)
          })
        })
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  // useObservable(usersService$, setUsersList)

  // useObservable(ot$, setOrgTypes);

  useEffect(() => {
    getHierarchyData();
  }, [])

  function transformPositions(data: any) {
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      hirearchy: {
        child: transformPositions(item?.positionDTOs || []),
      },
      employeeList: [],
      expression: '',
      ...item
    }));
  }

  const formatDta = (data: any, userArray: any) => {
    data &&
      data.forEach((dt: any) => {
        dt['child'] = dt.childPositions

        if (dt?.user?.userId) {
          userArray &&
            userArray.forEach((usr: any) => {
              if (usr?.id === dt?.user?.userId) {
                dt['employeeList'] = [{ id: usr?.id, name: usr?.username }]
                dt['expression'] = usr?.username
              }
            })
        }

        if (dt?.childPositions?.length !== 0) {
          formatDta(dt?.childPositions, userArray)
        }
      })

    return data
  }

  const addParentPosition = () => {
    setSelectedNode({})
    setPositionModal(true)
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

  const confirmYes = (item: any) => {
    setConfirmModal(false)

    orgtypeservice.deletePosition(item.id).subscribe(res => {
      setTimeout(() => {
        getHierarchyData()
      }, 1000)
    })
  }

  const confirmNo = () => {
    setConfirmModal(false)
  }

  function addParentIds(node: any, parentId = null) {
    if (!node || typeof node !== 'object') return; // Guard clause

    node.parentId = parentId; // Always set parentId

    if (Array.isArray(node.positionDTOs) && node.positionDTOs.length) {
      node.positionDTOs.forEach((child: any) => {
        addParentIds(child, node.id);
      });
    }
  }

  function addLevels(node: any, level = 1) {
    if (!node || typeof node !== 'object') return; // <-- Fix: guard clause

    node.level = level;

    if (node?.positionDTOs?.length) {
      for (let child of node.positionDTOs) {
        addLevels(child, level + 1);
      }
    }
  }

  async function enhanceUnitsWithAPIData(tree: any) {
    if (tree?.positionType !== "UNIT") {
      if (tree?.positionDTOs && tree?.positionDTOs.length > 0) {
        await Promise.all(tree?.positionDTOs.map((child: any) => enhanceUnitsWithAPIData(child)));
      }
    } else {
      const result = await agentsService.getAgentsFromUnit(tree?.positionId).toPromise(); // <-- Correct way
      let newPositionDTOs: any = [];

      result?.forEach((item: any) => {
        let obj = {
          positionDTOs: [],
          id: item.id,
          name: item?.agentBasicDetails.name,
          type: "AGENT",
          parentPosition: tree.id,
          positionId: tree.id,
          userId: item.id,
          userType: "AGENT",
        };
        newPositionDTOs.push(obj);
      });

      tree.positionDTOs = [...tree.positionDTOs, ...newPositionDTOs];
    }

    return tree;
  }

  const getHierarchyData = () => {
    setLoading(true); // Start loader
    orgtypeservice.getHierarchyData('AGENT').subscribe(async result => {
      const arrval = transformPositions(result);
      await enhanceUnitsWithAPIData(arrval[0]);
      addParentIds(arrval[0]);
      addLevels(arrval[0]);
      setHierarchyData(arrval);
      setLoading(false); // Stop loader after all operations
    }, () => setLoading(false)); // Also stop loader on error
  }

  const submitPositionModal = () => {
    setTimeout(() => {
      getHierarchyData()
    }, 1000)

    // let randomId = Math.random();
    // let posVal = {
    //     id: randomId,
    //     name: item,
    //     expression: "",
    //     child: [],
    //     employeeList: [],
    // }

    // let resultarr = calcPosData(hierarchyData, selectedNode, posVal)

    setPositionModal(false)
  }

  const submitEmployeeModal = () => {
    setTimeout(() => {
      getHierarchyData()
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

  return (
    <div>
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </div>
      )}
      {!loading && (
        <>
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
              Agent Hierarchy
            </span>
          </Grid>
          {!hierarchyData.length && <Grid
            item
            xs={12}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '20px'
            }}
          >
            <Button color='secondary' className='p-button-secondary' onClick={addParentPosition}>
              Add Parent Position
            </Button>
          </Grid>}
          <div>
            {/* <TreeViewComponent
              deleteAction={true}
              deletePosition={deletePosition}
              hierarchy={hierarchyData}
              addPosition={addPosition}
              addEmployee={addEmployee}
              showListView={showEmployeeList}
              activateRgtClck={true}
            /> */}
            <FettleHierarchyTreeViewComponent
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
            type='AGENT'
            hierarchyData={hierarchyData}
          />
          <EmployeeAddModal
            closeEmployeeModal={closeEmployeeModal}
            employeeModal={employeeModal}
            submitEmployeeModal={submitEmployeeModal}
            headerText='Add Agent'
            selectedNode={selectedNode}
            userList={userList}
          />
          <ConfirmationDialogComponent
            confirmNo={confirmNo}
            confirmModal={confirmModal}
            confirmYes={confirmYes}
            headerText='Confirmation'
            selectedNode={selectedNode}
          />

          <EmployeeListModal
            employeelistmodal={employeelistmodal}
            closeEmployeeListModal={closeEmployeeListModal}
            selectedUsersList={selectedUsersList}
          />
        </>
      )}
    </div>
  )
}
