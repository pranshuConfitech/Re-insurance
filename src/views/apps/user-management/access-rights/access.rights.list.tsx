import React from 'react'

import { useRouter } from 'next/navigation'

import { Button } from 'primereact/button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import CancelIcon from '@mui/icons-material/Cancel'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import { createStyles, withStyles } from '@mui/styles'
import { DndProvider } from 'react-dnd'

import { HTML5Backend } from 'react-dnd-html5-backend'

import { PermissionsService, RolesService } from '@/services/remote-api/api/user-management-service'
import SidemenuDraggable from './sidemenu.draggable'

const permissionsService = new PermissionsService()
const rolesService = new RolesService()

const rolesService$ = rolesService.getRoles()

const useStyles = (theme: any) =>
  createStyles({
    accessRightsListRoot: {
      padding: 20
    },
    listOuterContainer: {
      padding: 15
    },
    table: {
      minWidth: 650
    },
    headerSection: {
      justifyContent: 'space-between'
    },
    actionBlock: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  })

/* const rolesList = [
    { id: 1, value: 'Front End Developer' },
    { id: 2, value: 'Developer' },
    { id: 3, value: 'Manager' },
    { id: 4, value: 'Ast. Manager' },
    { id: 5, value: 'Sr. Developer' },
    { id: 6, value: 'Jr. Developer' }
];
 */
function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()

    return <Component {...props} router={router} />
  }
}

class AccessRightsList extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.state = {
      rows: [],
      rolesList: [],
      selectedRoleId: '',
      accessTypes: [],
      menuList: []
    }
  }
  componentDidMount() {
    rolesService$.subscribe((response: any) => {
      this.setState({
        ...this.state,
        rolesList: response.map(({ name }: { name: any }) => ({ id: name, value: name }))
      })
    })

    permissionsService.getPermissions().subscribe((res: any) => {
      const menuList = Object.keys(res).map((value, i) => ({
        id: `m${i + 1}`,
        value
      }))

      const accessTypes: any = []

      for (const i in res) {
        res[i].map((r: any) => {
          const col = r.split('_')[0].trim()
          const isExist = accessTypes.some((c: any) => c.name === col)

          if (!isExist) {
            accessTypes.push({ id: accessTypes.length + 1, name: col })
          }
        })
      }

      this.setState({
        ...this.state,
        permissions: res,
        menuList,
        accessTypes
      })
    })
  }

  handleRoleChange = (role: any) => {
    rolesService.getRoleDetails(role.value).subscribe((res: any) => {
      const rows = []

      for (const key in res.permission) {
        const values = res.permission[key]
        const accessList = values.map((v: any) => v.split('_')[0]).reduce((a: any, v: any) => ({ ...a, [v]: true }), {})

        const accessCheckedList = this.state.accessTypes.filter((a: any) =>
          this.state.permissions[key].some((p: any) => p.indexOf(a.name) > -1)
        )

        const fullAccess = accessCheckedList.every(({ name }: { name: any }) => accessList[name])

        rows.push({
          menuCode: key,
          menuName: key,
          access: accessList,
          full: fullAccess
        })
      }

      this.setState({
        ...this.state,
        selectedRoleId: res.name,
        rows
      })
    })
  }

  createAccessRights = () => {
    this.props.router.push('/user-management/access-rights?mode=create')
  }

  editAccessRights = () => {
    this.props.router.push(`/user-management/access-rights/${this.state.selectedRoleId}?mode=edit`)
  }

  render() {
    const { classes } = this.props
    const { rows, selectedRoleId, rolesList, accessTypes } = this.state

    return (
      <div className={classes.accessRightsListRoot}>
        <DndProvider backend={HTML5Backend}>
          <Grid container spacing={7} className={classes.headerSection}>
            <Grid item xs={3}>
              <Typography variant='h6' gutterBottom>
                Access Rights
              </Typography>
            </Grid>
            <Grid item xs={4} className={classes.actionBlock}>
              {selectedRoleId !== '' && (
                <Button color='primary' icon='pi pi-pencil' style={{ marginRight: 5 }} onClick={this.editAccessRights}>
                  Edit Access Rights
                </Button>
              )}
              <Button color='primary' icon='pi pi-plus-circle' onClick={this.createAccessRights}>
                Create New Access Rights
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={7}>
            <Grid item xs={3}>
              <Paper elevation={0} className={classes.listOuterContainer}>
                <SidemenuDraggable
                  data={rolesList}
                  type='role'
                  selectedRoleId={selectedRoleId}
                  handleClick={this.handleRoleChange}
                />
              </Paper>
            </Grid>
            <Grid item xs={9}>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Menu Code</TableCell>
                      <TableCell align='center'>Menu Name</TableCell>
                      {accessTypes.map((acc: any) => (
                        <TableCell key={acc.id} align='center'>
                          {acc.name}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row: any) => (
                      <TableRow key={row.menuCode}>
                        <TableCell component='th' scope='row'>
                          {row.menuCode}
                        </TableCell>
                        <TableCell align='center'>{row.menuName}</TableCell>
                        {accessTypes.map((acc: any) => (
                          <TableCell key={acc.id} align='center'>
                            {(row.access[acc.name] && <VerifiedUserIcon style={{ color: '#4caf50' }} />) || (
                              <CancelIcon style={{ color: 'rgb(220, 0, 78)' }} />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DndProvider>
      </div>
    )
  }
}
export default withRouter(withStyles(useStyles)(AccessRightsList))
