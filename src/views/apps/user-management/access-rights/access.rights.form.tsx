import React from 'react'

import { useParams, useRouter } from 'next/navigation'

import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import { Button } from 'primereact/button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { createStyles, withStyles } from '@mui/styles'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { PermissionsService, RolesService } from '@/services/remote-api/api/user-management-service'
import SidemenuDraggable from './sidemenu.draggable'
import { StatefulTargetBox as TargetBox } from './target.box'

const permissionsService = new PermissionsService()
const rolesService = new RolesService()

const useStyles = (theme: any) =>
  createStyles({
    root: {
      padding: 20
    },
    accordianOuter: {
      padding: '0 15px',
      backgroundColor: '#fafafa !important'
    },
    AccordionSummary: {
      width: '100%',
      backgroundColor: theme?.palette?.background?.default
    },
    accList: {
      flexDirection: 'column',
      padding: '0 0 15px 0 !important'
    },
    accElm: {
      /* padding: '10px 0',
        cursor: 'pointer' */
    },
    headerSection: {
      justifyContent: 'space-between'
    },
    actionBlock: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  })

/* const roleList = [
    { id: 1, value: 'Front End Developer' },
    { id: 2, value: 'Developer' },
    { id: 3, value: 'Manager' },
    { id: 4, value: 'Ast. Manager' },
    { id: 5, value: 'Sr. Developer' },
    { id: 6, value: 'Jr. Developer' }
]; */

/* const menuList = [
    { id: 'm1', value: 'HR Admin' },
    { id: 'm2', value: 'Dashboard' },
    { id: 'm3', value: 'User Details' },
    { id: 'm4', value: 'Organization Details' },
    { id: 'm5', value: 'Role Details' },
    { id: 'm6', value: 'Menu Details' }
]; */

/* const accessTypes = [
    { id: 1, name: 'create' },
    { id: 2, name: 'read' },
    { id: 3, name: 'update' },
    { id: 4, name: 'delete' },
]; */
function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter()
    const params = useParams()

    return <Component {...props} router={router} params={params} />
  }
}

class AccessRightsFormComponent extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.state = {
      expanded: 'panel2',
      rows: [{ roleName: '' }],
      permissions: {},
      menuList: [],
      roleList: [],
      accessTypes: []
    }
  }

  componentDidMount() {
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

    if (this.props.params.roleName) {
      rolesService.getRoleDetails(this.props.params.roleName).subscribe((res: any) => {
        const rl = []

        for (const key in res.permission) {
          const values = res.permission[key]

          const accessList = values
            .map((v: any) => v.split('_')[0])
            .reduce((a: any, v: any) => ({ ...a, [v]: true }), {})

          const accessCheckedList = this.state.accessTypes.filter((a: any) =>
            this.state.permissions[key].some((p: any) => p.indexOf(a.name) > -1)
          )

          const fullAccess = accessCheckedList.every(({ name }: { name: any }) => accessList[name])

          rl.push({
            menuName: key,
            id: key,
            access: accessList,
            full: fullAccess
          })
        }

        this.setState({
          ...this.state,
          rows: [{ roleName: res.name }, ...rl]
        })
      })
    }
  }

  onDrop = (data: any) => {
    if (data.type === 'role') {
      if (this.state.rows.length === 0) {
        this.state.rows.push({})
      }

      // this.state.rows[0] = { roleName: data.name, id: data.id }
      this.setState((prevState: any) => ({
        rows: prevState.rows.map((row: any, index: any) => (index === 0 ? { roleName: data.name, id: data.id } : row))
      }))
    } else {
      const isMenuExist = this.state.rows.some((m: any, i: any) => i > 0 && m.menuName === data.name)

      if (!isMenuExist) {
        // this.state.rows.push({ menuName: data.name, id: data.id, access: {} })
        this.setState((prevState: any) => ({
          rows: [...prevState.rows, { menuName: data.name, id: data.id, access: {} }]
        }))
      }
    }

    this.setState({
      ...this.state,
      rows: [...this.state.rows]
    })
  }

  toggleFullAccess = (e: any, idx: number, row: any) => {
    // this.state.rows[idx].full = e.target.checked

    // const accessCheckedList = this.state.accessTypes.filter((a: any) =>
    //   this.state.permissions[row.menuName].some((p: any) => p.indexOf(a.name) > -1)
    // )

    // accessCheckedList.forEach(({ name }: { name: any }) => {
    //   this.state.rows[idx]['access'][name] = e.target.checked
    // })

    // this.setState({
    //   ...this.state,
    //   rows: [...this.state.rows]
    // })
    this.setState((prevState: any) => {
      const updatedRows = [...prevState.rows]

      updatedRows[idx] = {
        ...updatedRows[idx],
        full: e.target.checked,
        access: { ...updatedRows[idx].access }
      }

      const accessCheckedList = prevState.accessTypes.filter((a: any) =>
        prevState.permissions[updatedRows[idx].menuName].some((p: any) => p.indexOf(a.name) > -1)
      )

      accessCheckedList.forEach(({ name }: { name: any }) => {
        updatedRows[idx].access[name] = e.target.checked
      })

      return { rows: updatedRows }
    })
  }

  // toggleAccess = (e: any, idx: number, accessName: any, row: any) => {
  //   this.state.rows[idx]['access'][accessName] = e.target.checked

  //   if (this.state.rows[idx].full && !e.target.checked) {
  //     this.state.rows[idx].full = false
  //   }

  //   /**
  //    * If all fields `true` then full `true`.
  //    */
  //   if (!this.state.rows[idx].full) {
  //     const accessCheckedList = this.state.accessTypes.filter((a: any) =>
  //       this.state.permissions[row.menuName].some((p: any) => p.indexOf(a.name) > -1)
  //     )

  //     this.state.rows[idx].full = accessCheckedList.every(
  //       ({ name }: { name: any }) => this.state.rows[idx]['access'][name]
  //     )
  //   }

  //   this.setState({
  //     ...this.state,
  //     rows: [...this.state.rows]
  //   })
  // }
  toggleAccess = (e: any, idx: number, accessName: any, row: any) => {
    this.setState((prevState: any) => {
      const updatedRows = [...prevState.rows]

      updatedRows[idx] = {
        ...updatedRows[idx],
        access: { ...updatedRows[idx].access, [accessName]: e.target.checked }
      }

      if (updatedRows[idx].full && !e.target.checked) {
        updatedRows[idx].full = false
      }

      if (!updatedRows[idx].full) {
        const accessCheckedList = prevState.accessTypes.filter((a: any) =>
          prevState.permissions[row.menuName]?.some((p: any) => p.includes(a.name))
        )

        updatedRows[idx].full = accessCheckedList.every(({ name }: { name: any }) => updatedRows[idx].access[name])
      }

      return { rows: updatedRows }
    })
  }

  handleAcordianChange = (panel: any) => {
    this.setState({
      ...this.state,
      expanded: panel
    })
  }

  handleClose = () => {
    this.props.router.push('/user-management/access-rights?mode=viewList')
  }

  isAcessExist = (row: any, accessType: any) => {
    return this.state.permissions[row.menuName].some((o: any) => o.indexOf(accessType.name) > -1)
  }

  handleRoleName = (e: any) => {
    // this.state.rows[0].roleName = e.target.value
    // this.setState({
    //   ...this.state,
    //   rows: this.state.rows
    // })
    this.setState((prevState: any) => {
      const updatedRows = [...prevState.rows]

      updatedRows[0] = {
        ...updatedRows[0],
        roleName: e.target.value
      }

      return { rows: updatedRows }
    })
  }

  createAccessRole = () => {
    const [role, ...menuList] = this.state.rows
    const permission: any = {}

    menuList.map((menu: any) => {
      permission[menu.menuName] = Object.keys(menu.access)
        .filter(key => menu.access[key])
        .map(v => `${v}_${menu.menuName}`)
    })

    const payload = {
      name: role.roleName,
      description: '',
      permission
    }

    if (this.props.params.roleName) {
      rolesService.updateRoles(this.props.params.roleName, payload).subscribe(res => {
        this.handleClose()
      })
    } else {
      rolesService.saveRoles(payload).subscribe(res => {
        this.handleClose()
      })
    }
  }

  render() {
    const { classes } = this.props
    const { expanded, rows, menuList, roleList, accessTypes } = this.state

    return (
      <div className={classes.root}>
        <Grid container spacing={7} className={classes.headerSection}>
          <Grid item xs={3}>
            <Typography variant='h6' gutterBottom>
              Access Rights: {this.props.params.roleName ? 'Edit' : 'Add'}
            </Typography>
          </Grid>
          <Grid item xs={4} className={classes.actionBlock}>
            <Button color='primary' style={{ marginRight: 20 }} onClick={this.handleClose}>
              Cancel
            </Button>
            <Button color='primary' onClick={this.createAccessRole}>
              {this.props.params.roleName ? 'Update' : 'Create'}
            </Button>
          </Grid>
        </Grid>

        <Paper elevation={0} style={{ marginTop: 15 }}>
          <DndProvider backend={HTML5Backend}>
            <div style={{ padding: 20 }}>
              <Grid container spacing={7}>
                <Grid item xs={3}>
                  <Accordion
                    className={classes.accordianOuter}
                    expanded={expanded === 'panel1'}
                    onChange={() => this.handleAcordianChange('panel1')}
                    disabled
                  >
                    <AccordionSummary
                      className={classes.AccordionSummary}
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls='panel1a-content'
                      id='panel1a-header'
                    >
                      <Typography className={classes.heading}>Role</Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.accList}>
                      <SidemenuDraggable data={roleList} type='role' draggable={true} />
                    </AccordionDetails>
                  </Accordion>
                  <Accordion
                    className={classes.accordianOuter}
                    expanded={expanded === 'panel2'}
                    onChange={() => this.handleAcordianChange('panel2')}
                    disabled={rows.length === 0}
                  >
                    <AccordionSummary
                      className={classes.AccordionSummary}
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls='panel2a-content'
                      id='panel2a-header'
                    >
                      <Typography className={classes.heading}>Menu</Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.accList}>
                      <SidemenuDraggable data={menuList} type='menu' draggable={true} />
                    </AccordionDetails>
                  </Accordion>
                </Grid>
                <Grid item xs={9}>
                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label='table drop area'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Role</TableCell>
                          <TableCell align='right'>Menu Name</TableCell>
                          <TableCell align='right'>Full</TableCell>
                          {accessTypes.map((acc: any) => (
                            <TableCell key={acc.id} align='right'>
                              {acc.name}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                    </Table>
                    <div style={{ overflow: 'auto', height: '650px' }}>
                      <Table className={classes.table} aria-label='simple table' style={{ tableLayout: 'fixed' }}>
                        <TableBody>
                          {rows.map((row: any, idx: number) => (
                            <TableRow key={`row-${idx}`}>
                              <TableCell component='th' scope='row'>
                                {this.props.params.roleName && <span>{row.roleName}</span>}
                                {!this.props.params.roleName && idx < 1 && (
                                  <TextField
                                    id='roleName'
                                    value={row.roleName}
                                    placeholder='Type Role Name here...'
                                    onChange={this.handleRoleName}
                                  />
                                )}
                              </TableCell>
                              <TableCell align='right'>{row.menuName}</TableCell>
                              <TableCell align='right'>
                                {idx > 0 && (
                                  <FormControlLabel
                                    label=''
                                    control={
                                      <Checkbox
                                        checked={row.full || false}
                                        value={row.full || ''}
                                        onChange={e => this.toggleFullAccess(e, idx, row)}
                                        name='full'
                                        color='primary'
                                      />
                                    }
                                  />
                                )}
                              </TableCell>
                              {accessTypes.map((acc: any) => (
                                <TableCell key={acc.id} align='right'>
                                  {idx > 0 && this.isAcessExist(row, acc) && (
                                    <FormControlLabel
                                      label=''
                                      control={
                                        <Checkbox
                                          checked={row['access'][acc.name] || false}
                                          value={row['access'][acc.name] || ''}
                                          onChange={e => this.toggleAccess(e, idx, acc.name, row)}
                                          name={acc.name}
                                          color='primary'
                                        />
                                      }
                                    />
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <Table className={classes.table} aria-label='table drop area'>
                      <TableBody>
                        <TableRow key='dropzone'>
                          <TargetBox onDrop={this.onDrop}></TargetBox>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </div>
          </DndProvider>
        </Paper>
      </div>
    )
  }
}
export default withRouter(withStyles(useStyles)(AccessRightsFormComponent))
