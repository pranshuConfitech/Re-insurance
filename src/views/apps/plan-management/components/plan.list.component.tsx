import React from 'react'

import { useRouter } from 'next/navigation'

import { Button } from 'primereact/button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import { makeStyles } from '@mui/styles'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { map, switchMap } from 'rxjs/operators'

import RoleService from '@/services/utility/role'
import { ClientTypeService } from '@/services/remote-api/api/master-services'
import { PlanService } from '@/services/remote-api/api/plan-services'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const PAGE_NAME = 'PLAN'
const roleService = new RoleService()
const clienttypeervice = new ClientTypeService()

const useStyles = makeStyles(theme => ({
  tableBg: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  },
  chipInputList: {
    '& .chipItem': {
      color: 'rgba(0, 0, 0, 0.87)',
      border: 'none',
      height: 32,
      display: 'inline-flex',
      outline: 'none',
      padding: 0,
      fontSize: '0.8125rem',
      boxSizing: 'border-box',
      transition:
        'background - color 300ms cubic - bezier(0.4, 0, 0.2, 1) 0ms, box - shadow 300ms cubic - bezier(0.4, 0, 0.2, 1) 0ms',
      alignItems: 'center',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans - serif',
      whiteSpace: 'nowrap',
      borderRadius: 16,
      verticalAlign: 'middle',
      justifyContent: 'center',
      textDecoration: 'none',
      backgroundColor: '#e0e0e0',
      margin: '0 8px 8px 0'
    }
  },
  categoryButton: {
    marginLeft: '5px'
  }
}))

const planservice = new PlanService()

const dataSource$: any = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true
  }
) => {
  pageRequest.sort = ['rowLastUpdatedDate dsc']

  if (pageRequest.searchKey) {
    pageRequest['code'] = pageRequest.searchKey.trim()
    pageRequest['clientType'] = pageRequest.searchKey.trim()
    pageRequest['name'] = pageRequest.searchKey.trim()
  }

  delete pageRequest.searchKey

  return planservice
    .getPlans(pageRequest)
    .pipe(
      map(data => {
        const content = data.content

        const records = content.map((item: any) => {
          const cat: any = []

          if (item.planCategorys.length !== 0) {
            item.planCategorys.forEach((ele: any) => {
              cat.push(ele.name)
            })
          }

          item['category'] = cat

          return item
        })

        data.content = records

        return data
      })
    )
    .pipe(
      switchMap(data => {
        return clienttypeervice.getCleintTypes().pipe(
          map(ct => {
            data.content.forEach((cl: any) => {
              ct.content.forEach(clienttype => {
                if (cl.clientType === clienttype.code || cl.clientType === clienttype.id) {
                  cl['clientTypeName'] = clienttype.name
                }
              })
            })

            return data
          })
        )
      })
    )
}

const columnsDefinations = [
  { field: 'name', headerName: 'Plan Name' },
  { field: 'code', headerName: 'Plan Code' },
  { field: 'clientTypeName', headerName: 'Client Type' },
  {
    field: 'category',
    headerName: 'Category',
    body: (rowData: { category: any[] }) => {
      return (
        <p style={{ display: 'flex', flexWrap: 'wrap' }}>
          {rowData.category.map((e, index) => {
            return (
              <span
                key={index}
                style={{
                  border: '1px solid rgba(49, 60, 150, 1)',
                  margin: '4px',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  background: 'rgba(49, 60, 150, 0.1)'
                }}
              >
                {e}
              </span>
            )
          })}
        </p>
      )
    }
  }
]

export default function PlanListComponent(props: any) {
  const router = useRouter()
  const [rows, setRows] = React.useState(props.rows)
  const [open, setOpen] = React.useState(false)
  const [parameterValues, setParameterValues]: any = React.useState([])
  const [reloadTable, setReloadTable] = React.useState(false)
  const [selectedPlanId, seSelectedPlanId] = React.useState('')
  const [categoryList, setCategoryList] = React.useState([{ name: '', description: '' }])

  const classes = useStyles()

  const handleAddChip = (chip: any) => {
    setParameterValues([...parameterValues, chip])
  }

  const handleDeleteChip = (chip: any, index: number) => {
    const chipValues = [...parameterValues]

    chipValues.splice(index, 1)

    setParameterValues(chipValues)
  }

  const handleAddcategory = () => {
    if (categoryList.length === 0) {
      return
    }

    /* let payloadarr = parameterValues.map(ele => {
      return { name: ele };
    }); */
    planservice.addPlanCategory(categoryList, selectedPlanId).subscribe(res => {
      setOpen(false)

      // window.location.reload();
    })
    setReloadTable(true)
    setTimeout(() => {
      setReloadTable(false)
    }, 5000)
  }

  const handleOpen = () => {
    router.push('/plans?mode=create')
  }

  const handleClickOpen = (plan: { id: React.SetStateAction<string> }) => {
    seSelectedPlanId(plan.id)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setReloadTable(true)
    setTimeout(() => {
      setReloadTable(false)
    }, 5000)
  }

  React.useEffect(() => {
    setRows(props.rows)
  }, [props.rows])

  const openEditSection = (plan: { id: any }) => {
    router.push(`/plans/${plan.id}?mode=edit`)
  }

  const actionBtnList = [
    {
      key: 'update_plan',
      icon: 'pi pi-user-edit',
      className: 'ui-button-warning',
      onClick: openEditSection
    },
    {
      key: 'update_plan',
      icon: 'pi pi-th-large',
      className: classes.categoryButton,
      onClick: handleClickOpen
    }
  ]

  const xlsColumns = ['name', 'code', 'clientTypeName', 'category']

  const configuration = {
    enableSelection: false,
    scrollHeight: '300px',
    pageSize: 10,
    actionButtons: roleService.checkActionPermission(PAGE_NAME, '', () => {}, actionBtnList),
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
      onCreateButtonClick: handleOpen,
      text: 'Plan Management',
      enableGlobalSearch: true,
      searchText: 'Search by code, name, client type'

      //   onSelectionChange: handleSelectedRows,
      //   selectionMenus: [{ icon: "", text: "Blacklist", disabled: selectionBlacklistMenuDisabled, onClick: openBlacklist }],
      //   selectionMenuButtonText: "Action"
    }
  }

  const addCategoryRow = () => {
    setCategoryList([...categoryList, { name: '', description: '' }])
  }

  const removeCategoryRow = (index: number) => {
    const list = [...categoryList]

    list.splice(index, 1)
    setCategoryList(list)
  }

  const handleChange = (e: any, index: number) => {
    const { name, value } = e.target
    const list: any = [...categoryList]

    list[index][name] = value
    setCategoryList(list)
  }

  return (
    <div>
      <FettleDataGrid
        $datasource={dataSource$}
        config={configuration}
        columnsdefination={columnsDefinations}
        onEdit={openEditSection}
        reloadtable={reloadTable}
      />
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title' fullWidth maxWidth='xs'>
        <DialogTitle id='form-dialog-title'>Add Categories</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontSize: 12 }}>Please type, enter and then click Add</DialogContentText>
          {categoryList.map((category, id) => (
            <Grid container spacing={3} key={`row-${id}`}>
              <Grid item xs={5}>
                <TextField
                  id={`cat-name-${id}`}
                  name='name'
                  value={category.name}
                  label='Name'
                  onChange={e => handleChange(e, id)}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  id={`cat-desc-${id}`}
                  name='description'
                  value={category.description}
                  label='Description'
                  onChange={e => handleChange(e, id)}
                />
              </Grid>
              <Grid item xs={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                {categoryList.length !== 1 && (
                  <IconButton aria-label='delete' size='small' onClick={() => removeCategoryRow(id)} color='secondary'>
                    <DeleteIcon fontSize='inherit' style={{ color: '#dc3545' }} />
                  </IconButton>
                )}
                {categoryList.length - 1 === id && (
                  <IconButton aria-label='delete' size='small' onClick={addCategoryRow} color='primary'>
                    <AddIcon fontSize='inherit' style={{ color: '#D80E51' }} />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary' className='p-button-text'>
            Cancel
          </Button>
          <Button onClick={handleAddcategory} color='primary'>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
