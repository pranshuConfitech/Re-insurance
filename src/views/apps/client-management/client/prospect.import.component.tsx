import * as React from 'react'

import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Paper from '@mui/material/Paper'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { makeStyles } from '@mui/styles'
import GetAppIcon from '@mui/icons-material/GetApp'

import { ClientService, ProspectService } from '@/services/remote-api/api/client-services'
import { FettleMultiFieldSearch } from '../../shared-component/components/fettle.multi.field.search'

const useStyles = makeStyles(theme => ({
  tableBg: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  },
  prospectImportOuterContainer: {
    padding: 20
  },
  prospectImportRadioGroup: {
    flexWrap: 'nowrap',
    '& label': {
      flexDirection: 'row'
    }
  }
}))

const prospectService = new ProspectService()
const clientService = new ClientService()

export default function ProspectImportComponent(props: any) {
  const classes = useStyles()

  const [state, setState] = React.useState({
    showSearch: false,
    showProspectTable: false,
    selectedCode: '',
    selectedMobile: '',
    selectedDisplayName: '',
    rows: [],
    selectedChoice: ''
  })

  const columns = [
    { field: 'code', headerName: 'Prospect Code', width: 200 },
    { field: 'firstName', headerName: 'Prospect Name', width: 200 },

    // { field: "clientType", headerName: "Client Type", width: 300 },
    {
      field: 'displayName',
      headerName: 'Name',

      // type: 'number',
      width: 200
    },
    {
      field: 'mobileNo',
      headerName: 'Contact Number',

      // type: 'number',
      width: 200
    },
    {
      field: 'Action',
      headerName: 'Action',
      width: 200,
      renderCell: (params: any) => {
        const onClickImport = () => {
          handleImport(params.row)
        }

        return (
          <div>
            <GetAppIcon style={{ cursor: 'pointer', color: '#626BDA' }} onClick={onClickImport} />
          </div>
        )
      }
    }
  ]

  const dataSource$ = (fields: { [x: string]: any }, pageRequest = { page: 0, size: 10 }) => {
    const pagerequestquery: any = {
      page: pageRequest.page,
      size: pageRequest.size,
      summary: false
    }

    Object.keys(fields)
      .filter(key => !!fields[key])
      .forEach(key => (pagerequestquery[key] = fields[key]))

    return prospectService.importProspectData(pagerequestquery)
  }

  const fields = [
    { label: 'Code', propertyName: 'code' },
    { label: 'Name', propertyName: 'displayName' },
    { label: 'Contact', propertyName: 'mobileNo' }
  ]

  const columnsDefinations = [
    { field: 'code', headerName: 'Prospect Code' },
    { field: 'firstName', headerName: 'Prospect Name' },
    { field: 'clientType', headerName: 'Client Type' },
    { field: 'displayName', headerName: 'Name' },
    { field: 'mobileNo', headerName: 'Contact Number' }
  ]

  const handleImport = (e: any) => {
    props.handleProspectImport(e)
  }

  const getProspects = () => {
    const pgequery: any = {
      page: 0,
      size: 10,
      summary: false

      // active: true,
      // sort: [
      //   string
      // ],
    }

    if (state.selectedCode) {
      pgequery['code'] = state.selectedCode
    }

    if (state.selectedDisplayName) {
      pgequery['displayName'] = state.selectedDisplayName
    }

    if (state.selectedMobile) {
      pgequery['mobileNo'] = state.selectedMobile
    }

    prospectService.importProspectData(pgequery).subscribe((res: any) => {
      setState({
        ...state,
        rows: res.content,
        showProspectTable: true
      })
    })
  }

  const handleCancel = () => {
    setState({
      ...state,
      showProspectTable: false,
      selectedChoice: '',
      selectedCode: '',
      selectedMobile: '',
      selectedDisplayName: ''
    })
    props.closeProspectimport()
  }

  const handleChange = (e: { target: { name: string; value: string } }) => {
    if (e.target.name === 'prosimport') {
      setState({
        ...state,
        selectedChoice: e.target.value
      })

      if (e.target.value === 'No') {
        handleCancel()
      }
    }

    if (e.target.name === 'selectedCode') {
      setState({
        ...state,
        selectedCode: e.target.value
      })
    }

    if (e.target.name === 'selectedDisplayName') {
      setState({
        ...state,
        selectedDisplayName: e.target.value
      })
    }

    if (e.target.name === 'selectedMobile') {
      setState({
        ...state,
        selectedMobile: e.target.value
      })
    }
  }

  return (
    <div>
      <Paper elevation={0} className={classes.prospectImportOuterContainer}>
        <FormControl component='fieldset'>
          <FormLabel component='legend'>Do you want to import data from Prospect</FormLabel>
          <RadioGroup
            aria-label='prosimport'
            name='prosimport'
            value={state.selectedChoice}
            onChange={handleChange}
            row
            className={classes.prospectImportRadioGroup}
          >
            <FormControlLabel value='Yes' control={<Radio />} label='Yes' />
            <FormControlLabel value='No' control={<Radio />} label='No' />
          </RadioGroup>
        </FormControl>
      </Paper>

      {state.selectedChoice === 'Yes' ? (
        <div>
          {/* <Paper elevation='none'>
                        <Box p={3} my={2}>
                            <Grid container spacing={3} style={{ marginBottom: "20px" }}>
                                <Grid item xs={3}>
                                    <TextField size="small"
                                        id="standard-basic"
                                        name="selectedCode"
                                        value={state.selectedCode}
                                        onChange={handleChange}
                                        label="Prospect Code"
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField size="small"
                                        id="standard-basic"
                                        name="selectedDisplayName"
                                        value={state.selectedDisplayName}
                                        onChange={handleChange}
                                        label="Display Name"
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField size="small"
                                        id="standard-basic"
                                        name="selectedMobile"
                                        value={state.selectedMobile}
                                        onChange={handleChange}
                                        label="Mobile"
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={getProspects}
                                        startIcon={<SearchIcon />}
                                    >
                                        Search
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                    {state.showProspectTable ? (
                        
                            <DataGrid
                                rows={state.rows}
                                columns={columns}
                                pageSize={5}
                            />
                        </div>
                    ) : null} */}
          <Paper elevation={0}>
            <Box p={3} my={2}>
              <FettleMultiFieldSearch
                $datasource={dataSource$}
                fields={fields}
                onSelect={(item: any) => {
                  handleImport(item)
                }}
                columnsDefinations={columnsDefinations}
                dataGridPageSize={10}
                dataGridScrollHeight='400px'
              />
            </Box>
          </Paper>
        </div>
      ) : null}
    </div>
  )
}
