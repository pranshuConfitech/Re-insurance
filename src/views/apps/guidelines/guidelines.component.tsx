'use client'
import React, { useState, useEffect } from 'react'

import Box from '@mui/material/Box'
import { Button } from 'primereact/button'

// import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'

import AddIcon from '@mui/icons-material/Add'

import { map, of } from 'rxjs'

import AgeModal from './modals/age.modal'
import { GuidlineService } from '@/services/remote-api/api/master-services/guidline.service'
import { FettleDataGrid } from '../shared-component/components/fettle.data.grid'
import type { Page } from '@/services/remote-api/models/page'
import { Dialog, DialogTitle } from '@mui/material'
import OccupationModal from './modals/occupation.modal'

const guidelinesService = new GuidlineService()

const dataSource1$: any = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true
  }
) => {
  pageRequest.sort = ['rowLastUpdatedDate dsc']

  if (!pageRequest.searchKey) {
    return guidelinesService.getAgeGuidlineList(pageRequest).pipe(
      map((data: Page<any>) => {
        return data
      })
    )
  }
}

const dataSource2$: any = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true
  }
) => {
  pageRequest.sort = ['rowLastUpdatedDate dsc']

  if (!pageRequest.searchKey) {
    return guidelinesService.getGenderGuidlineList(pageRequest).pipe(
      map((data: Page<any>) => {
        // Each gender is its own row
        const mappedContent = (data?.content || []).map(item => ({
          id: item.id, // Include the item id for unique row keys
          gender: "Gender",
          value: item.underwritingGender
        }));
        const result = { ...data, content: mappedContent };
        // console.log('Mapped Gender Content for Table:', mappedContent); // Debugging log
        return result;
      })
    )
  }
}

const columnsDefinations3 = [
  { field: 'relationship', headerName: '' },
  {
    field: 'value',
    headerName: 'Value',
    renderCell: (params: any) => Array.isArray(params.row.value) ? params.row.value.join(', ') : params.row.value
  }
]

const dataSource3$: any = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true
  }
) => {
  pageRequest.sort = ['rowLastUpdatedDate dsc']

  if (!pageRequest.searchKey) {
    return guidelinesService.getRelationshipGuidlineList(pageRequest).pipe(

      map((data: Page<any>) => {
        // Each relationship is its own row
        const mappedContent = (data?.content || []).map(item => {
          // console.log('--- Debugging Relationship Mapping ---');
          // console.log('Current item:', item);
          // console.log('Type of item:', typeof item);
          // console.log('Does item have underwritingRelationShip?', item && 'underwritingRelationShip' in item);
          // console.log('Value of item.underwritingRelationShip:', item?.underwritingRelationShip);
          // console.log('------------------------------------');

          return {
            id: item.id, // Include the item id for unique row keys
            relationship: "Relationship", // Static string for the 'Relationship' column
            value: item.underwritingRelationShip // Put the actual relationship name here
          };
        });
        const result = { ...data, content: mappedContent }; // Ensure returning object with content and other properties
        // console.log('Mapped Relationship Content for Table (Final Check):', result); // Debugging log the final result
        return result;

      })
    )
  }
}

const dataSource4$: any = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true
  }
) => {
  pageRequest.sort = ['rowLastUpdatedDate dsc']

  if (!pageRequest.searchKey) {
    return guidelinesService.getAnnualIncomeGuidlineList(pageRequest).pipe(
      map((data: Page<any>) => {
        return data
      })
    )
  }
}

const dataSource5$: any = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true
  }
) => {
  pageRequest.sort = ['rowLastUpdatedDate dsc']

  if (!pageRequest.searchKey) {
    return guidelinesService.getBmiGuidlineList(pageRequest).pipe(
      map((data: Page<any>) => {
        return data
      })
    )
  }
}

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
  buttonPrimary: {}
}))

const columnsDefinations1 = [
  { field: 'underwritingMinAge', headerName: 'Min Age' },
  { field: 'underwritingMaxAge', headerName: 'Max Age' }
]

const columnsDefinations2 = [
  {
    field: 'gender',
    headerName: '',
  },
  {
    field: 'value',
    headerName: 'Value',
    renderCell: (params: any) => Array.isArray(params.row.value) ? params.row.value.join(', ') : params.row.value
  }
]

// Define columns for Annual Income section
const columnsDefinations4 = [
  { field: 'underwritingMinAnnualIncome', headerName: 'Min Annual Income' }, // Assuming field name for min income
  { field: 'underwritingMaxAnnualIncome', headerName: 'Value' } // Change headerName to 'Value'
];

// Define columns for BMI section
const columnsDefinations5 = [
  { field: 'underwritingMinBMI', headerName: 'Min BMI' }, // Assuming field name for min BMI
  { field: 'underwritingMaxBMI', headerName: 'Value' } // Change headerName to 'Value'
];

// Define columns for the new table (keep these)
const columnsDefinations6 = [
  { field: 'maxAgeLabel', headerName: 'Max Age' },
  { field: 'value', headerName: 'Value' },
  {
    field: 'action',
    headerName: 'Action',
    body: (row: any) => (
      <Button
        icon="pi pi-pencil"
        className="p-button-text"
        onClick={() => { /* Placeholder for future edit functionality */ }}
        tooltip="Edit"
      />
    )
  }
];

// Define columns for Occupation section
const columnsDefinations7 = [
  { field: 'occupation', headerName: 'Occupation Guidelines' },
  { field: 'value', headerName: 'Value' },
  { field: 'loading', headerName: 'Loading' }
];

export default function GuidelinesComponent(props: any) {
  const classes = useStyles()
  const [ageModal, setAgeModal] = useState(false)
  const [type, setType] = useState(0)
  const [ageData, setAgeData] = useState<any[]>([])
  const [genderData, setGenderData] = useState<any[]>([])
  const [relationshipData, setRelationshipData] = useState<any[]>([])
  const [annualIncomeData, setAnnualIncomeData] = useState<any[]>([])
  const [bmiData, setBmiData] = useState<any[]>([])
  // Add state for Occupation data
  const [occupationData, setOccupationData] = useState<any[]>([
    { id: 1, occupation: 'AIRFORCE [ARF]', value: 'forward to Underwriting', loading: '-' }
  ]);
  // Add state for Occupation add modal
  const [occupationModalOpen, setOccupationModalOpen] = useState(false);
  // Add state for Medical Checkup Age data
  const [medicalCheckupAgeData, setMedicalCheckupAgeData] = useState<any[]>([]);
  const [medicalCheckupDialogOpen, setMedicalCheckupDialogOpen] = useState(false);
  const [medicalCheckupAgeInput, setMedicalCheckupAgeInput] = useState('');
  const [medicalCheckupLoading, setMedicalCheckupLoading] = useState(false);
  const [medicalCheckupError, setMedicalCheckupError] = useState('');
  // Add state for pagination for all tables
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const rowsPerPageOptions = [10, 25];
  const handlePaginationModelChange = (model: { page: number; pageSize: number }) => {
    setPaginationModel(model);
  };

  useEffect(() => {
    // Fetch Age Group data on mount and when modal closes
    const subscription = dataSource1$().subscribe((data: any) => {
      setAgeData(data?.content || [])
    })
    return () => subscription.unsubscribe()
  }, [ageModal])

  useEffect(() => {
    // Fetch Gender data on mount and when modal closes
    const subscription = dataSource2$().subscribe((data: any) => {
      setGenderData(data?.content || [])
    })
    return () => subscription.unsubscribe()
  }, [ageModal])

  useEffect(() => {
    // Fetch Relationship data on mount and when modal closes
    const subscription = dataSource3$().subscribe((data: any) => {
      setRelationshipData(data?.content || [])
    })
    return () => subscription.unsubscribe()
  }, [ageModal])

  useEffect(() => {
    // Fetch Annual Income data on mount and when modal closes
    const subscription = dataSource4$().subscribe((data: any) => {
      setAnnualIncomeData(data?.content || [])
    })
    return () => subscription.unsubscribe()
  }, [ageModal])
  useEffect(() => {
    // Fetch BMI data on mount and when modal closes
    const subscription = dataSource5$().subscribe((data: any) => {
      setBmiData(data?.content || [])
    })
    return () => subscription.unsubscribe()
  }, [ageModal])

  const handleClose = () => {
    setAgeModal(false)
    setType(0)
    // Close other modals here if added later
    setOccupationModalOpen(false); // Close Occupation modal
  }

  const configuration1: any = {
    enableSelection: false,
    scrollHeight: '300px',
    pageSize: 10,

    // actionButtons: actionBtnList,
    // header: {
    //   enable: true,

    //   // enableDownload: true,
    //   // downloadbleColumns: xlsColumns,
    //   // addCreateButton: 'CREATE',
    //   // addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
    //   // onCreateButtonClick: handleOpen,
    //   text: 'Questionnaire Management'

    //   // enableGlobalSearch: true,
    //   // searchText: 'Search by Name,Policy Number',
    //   // selectionMenuButtonText: 'Advance Search',
    // }
  }

  // Create an empty observable data source for the new grid
  const emptyDataSource = of({ content: [], totalElements: 0 });

  // Data source for medical checkup age
  const dataSourceMedicalCheckupAge$ = (
    pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true
    }
  ) => {
    // No sort/search needed, just fetch the value
    return guidelinesService.getMedicalCheckupAgeGuideline(pageRequest).pipe(
      map((data: Page<any>) => {
        // Map to table format if needed
        const content = (data?.content || []).map((item: any) => ({
          id: item.id || 1,
          maxAgeLabel: 'Age',
          value: item.ageValue
        }));
        return { ...data, content };
      })
    );
  };

  // Fetch medical checkup age on mount and after save
  useEffect(() => {
    const subscription = dataSourceMedicalCheckupAge$().subscribe((data: any) => {
      setMedicalCheckupAgeData(data?.content || []);
    });
    return () => subscription.unsubscribe();
  }, [medicalCheckupDialogOpen]);

  // Add handler for opening dialog
  const handleOpenMedicalCheckupDialog = () => {
    setMedicalCheckupDialogOpen(true);
    setMedicalCheckupAgeInput('');
    setMedicalCheckupError('');
  };

  // Add handler for saving age
  const handleSaveMedicalCheckupAge = async () => {
    setMedicalCheckupLoading(true);
    setMedicalCheckupError('');
    try {
      const ageValue = parseInt(medicalCheckupAgeInput, 10);
      if (isNaN(ageValue) || ageValue <= 0) {
        setMedicalCheckupError('Please enter a valid age');
        setMedicalCheckupLoading(false);
        return;
      }
      await guidelinesService.saveMedicalCheckupAge({ ageValue }).toPromise();
      setMedicalCheckupDialogOpen(false);
    } catch (err) {
      setMedicalCheckupError('Failed to save. Please try again.');
    } finally {
      setMedicalCheckupLoading(false);
    }
  };

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
          fontSize: '18px'
        }}
      >
        <span
          style={{
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: '5px'
          }}
        >
          Questionnaire Guidelines
        </span>
      </Grid>
      <Paper
        elevation={0}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '1%'
        }}
      >
        <Box padding={'10px'} display={'flex'} flexDirection={'row'} flexWrap={'wrap'}>
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={6}>
              <Paper elevation={0} sx={{ height: 200, overflow: 'auto' }}>
                <Box display={'flex'} justifyContent={'space-between'}>
                  <Typography align='center' variant='h6'>
                    Age Group
                  </Typography>
                  <Button
                    color='primary'
                    className={classes.buttonPrimary}
                    style={{ marginLeft: '5px' }}
                    onClick={() => { setType(1); setAgeModal(true); }}
                    disabled={ageData.length > 0}
                  >
                    <AddIcon />
                  </ Button>
                </ Box>
                <FettleDataGrid
                  $datasource={dataSource1$}
                  columnsdefination={columnsDefinations1}
                  config={configuration1}
                  paginationModel={paginationModel}
                  rowsPerPageOptions={rowsPerPageOptions}
                  onPaginationModelChange={handlePaginationModelChange}
                />
              </ Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={0} sx={{ height: 200, overflow: 'auto' }}>
                <Box display={'flex'} justifyContent={'space-between'}>
                  <Typography align='center' variant='h6'>
                    Gender
                  </Typography>
                  <Button
                    color='primary'
                    className={classes.buttonPrimary}
                    style={{ marginLeft: '5px' }}
                    onClick={() => {
                      setType(2)
                      setAgeModal(true)
                    }}
                  >
                    <AddIcon />
                  </Button>
                </Box>
                <FettleDataGrid
                  $datasource={dataSource2$}
                  columnsdefination={columnsDefinations2}
                  config={configuration1}
                  paginationModel={paginationModel}
                  rowsPerPageOptions={rowsPerPageOptions}
                  onPaginationModelChange={handlePaginationModelChange}
                />
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={0} sx={{ height: 200, overflow: 'auto' }}>
                <Box display={'flex'} justifyContent={'space-between'}>
                  <Typography align='center' variant='h6'>
                    Relationship
                  </Typography>
                  <Button
                    color='primary'
                    className={classes.buttonPrimary}
                    style={{ marginLeft: '5px' }}
                    onClick={() => {
                      setType(3)
                      setAgeModal(true)
                    }}
                  >
                    <AddIcon />
                  </Button>
                </Box>
                <FettleDataGrid
                  $datasource={dataSource3$}
                  columnsdefination={columnsDefinations3}
                  config={configuration1}
                  paginationModel={paginationModel}
                  rowsPerPageOptions={rowsPerPageOptions}
                  onPaginationModelChange={handlePaginationModelChange}
                />
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={0} sx={{ height: 200, overflow: 'auto' }}>
                <Box display={'flex'} justifyContent={'space-between'}>
                  <Typography align='center' variant='h6'>
                    Annual Income
                  </Typography>
                  <Button
                    color='primary'
                    className={classes.buttonPrimary}
                    style={{ marginLeft: '5px' }}
                    onClick={() => {
                      setType(4)
                      setAgeModal(true)
                    }}
                  >
                    <AddIcon />
                  </Button>
                </Box>
                <FettleDataGrid
                  $datasource={dataSource4$}
                  columnsdefination={columnsDefinations4}
                  config={configuration1}
                  paginationModel={paginationModel}
                  rowsPerPageOptions={rowsPerPageOptions}
                  onPaginationModelChange={handlePaginationModelChange}
                />
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={0} sx={{ height: 200, overflow: 'auto' }}>
                <Box display={'flex'} justifyContent={'space-between'}>
                  <Typography align='center' variant='h6'>
                    BMI
                  </Typography>
                  <Button
                    color='primary'
                    className={classes.buttonPrimary}
                    style={{ marginLeft: '5px' }}
                    onClick={() => {
                      setType(5)
                      setAgeModal(true)
                    }}
                  >
                    <AddIcon />
                  </Button>
                </Box>
                <FettleDataGrid
                  $datasource={dataSource5$}
                  columnsdefination={columnsDefinations5}
                  config={configuration1}
                  paginationModel={paginationModel}
                  rowsPerPageOptions={rowsPerPageOptions}
                  onPaginationModelChange={handlePaginationModelChange}
                />
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={0} sx={{ height: 200, overflow: 'auto' }}>
                <Box display={'flex'} justifyContent={'space-between'}>
                  <Typography align='center' variant='h6'>
                    Age above which medical check up is mandatory
                  </Typography>
                  <Button
                    color='primary'
                    className={classes.buttonPrimary}
                    style={{ marginLeft: '5px' }}
                    onClick={handleOpenMedicalCheckupDialog}
                    disabled={medicalCheckupAgeData.length > 0}
                  >
                    <AddIcon />
                  </Button>
                </Box>
                <FettleDataGrid
                  $datasource={dataSourceMedicalCheckupAge$}
                  columnsdefination={columnsDefinations6}
                  config={configuration1}
                  paginationModel={paginationModel}
                  rowsPerPageOptions={rowsPerPageOptions}
                  onPaginationModelChange={handlePaginationModelChange}
                />
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={0} sx={{ height: 200, overflow: 'auto' }}>
                <Box display={'flex'} justifyContent={'space-between'}>
                  <Typography align='center' variant='h6'>
                    Occupation
                  </Typography>
                  <Button
                    color='primary'
                    className={classes.buttonPrimary}
                    style={{ marginLeft: '5px' }}
                    onClick={() => { setOccupationModalOpen(true); }}
                  >
                    <AddIcon />
                  </Button>
                </Box>
                <FettleDataGrid
                  $datasource={of({ content: occupationData, totalElements: occupationData.length })}
                  columnsdefination={columnsDefinations7}
                  config={configuration1}
                  paginationModel={paginationModel}
                  rowsPerPageOptions={rowsPerPageOptions}
                  onPaginationModelChange={handlePaginationModelChange}
                />
              </Paper>
            </Grid>
          </Grid>

          {/* <Paper
            elevation="10px"
            style={{
              borShadow: '1px 1px 2px 0px rgba(0,0,0,1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '1%',
            }}>
            <Box width={'250px'} height={'300px'} boxShadow={'0 1px 3px 0 rgba(0, 0, 0, 0.15)'} padding={'5px'}>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography align="center" variant="h4">
                  Age Group
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.buttonPrimary}
                  style={{ marginLeft: '5px' }}
                  onClick={() => {
                    setType(1);
                    setAgeModal(true);
                  }}>
                  <AddIcon />
                </Button>
              </Box>
              <FettleDataGrid
                $datasource={dataSource1$}
                columnsdefination={columnsDefinations1}
                // onEdit={openEditSection}
                config={configuration1}
              />
            </Box>
          </Paper>
          <Paper
            elevation="10px"
            style={{
              borShadow: '1px 1px 2px 0px rgba(0,0,0,1)',
              display: 'flex',
              // background: 'wheat',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '1%',
            }}>
            <Box width={'250px'} height={'300px'} boxShadow={'0 1px 3px 0 rgba(0, 0, 0, 0.15)'} padding={'5px'}>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography align="center" variant="h4">
                  Gender
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.buttonPrimary}
                  style={{ marginLeft: '5px' }}
                  onClick={() => {
                    setType(2);
                    setAgeModal(true);
                  }}>
                  <AddIcon />
                </Button>
              </Box>
            </Box>
          </Paper>
          <Paper
            elevation="10px"
            style={{
              borShadow: '1px 1px 2px 0px rgba(0,0,0,1)',
              display: 'flex',
              // background: 'wheat',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '1%',
            }}>
            <Box width={'250px'} height={'300px'} boxShadow={'0 1px 3px 0 rgba(0, 0, 0, 0.15)'} padding={'5px'}>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography align="center" variant="h4">
                  Relationship
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.buttonPrimary}
                  style={{ marginLeft: '5px' }}
                  onClick={() => {
                    setType(3);
                    setAgeModal(true);
                  }}>
                  <AddIcon />
                </Button>
              </Box>
            </Box>
          </Paper>
          <Paper
            elevation="10px"
            style={{
              borShadow: '1px 1px 2px 0px rgba(0,0,0,1)',
              display: 'flex',
              // background: 'wheat',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '1%',
            }}>
            <Box width={'250px'} height={'300px'} boxShadow={'0 1px 3px 0 rgba(0, 0, 0, 0.15)'} padding={'5px'}>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography align="center" variant="h4">
                  Anual Income
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.buttonPrimary}
                  style={{ marginLeft: '5px' }}
                  onClick={() => {
                    setType(4);
                    setAgeModal(true);
                  }}>
                  <AddIcon />
                </Button>
              </Box>
            </Box>
          </Paper>
          <Paper
            elevation="10px"
            style={{
              borShadow: '1px 1px 2px 0px rgba(0,0,0,1)',
              display: 'flex',
              // background: 'wheat',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '1%',
            }}>
            <Box width={'250px'} height={'300px'} boxShadow={'0 1px 3px 0 rgba(0, 0, 0, 0.15)'} padding={'5px'}>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography align="center" variant="h4">
                  BMI
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.buttonPrimary}
                  style={{ marginLeft: '5px' }}
                  onClick={() => {
                    setType(5);
                    setAgeModal(true);
                  }}>
                  <AddIcon />
                </Button>
              </Box>
            </Box>
          </Paper> */}
        </Box>
      </Paper>

      <AgeModal open={ageModal} setOpen={setAgeModal} handleClose={handleClose} type={type} />

      <OccupationModal open={occupationModalOpen} onClose={() => setOccupationModalOpen(false)} />

      {/* Medical Checkup Age Dialog */}
      <Dialog open={medicalCheckupDialogOpen} onClose={() => setMedicalCheckupDialogOpen(false)}>
        <DialogTitle>Set Age above which medical check up is mandatory</DialogTitle>
        <Box p={2} display="flex" flexDirection="column" gap={2}>
          <input
            type="number"
            placeholder="Enter age value"
            value={medicalCheckupAgeInput}
            onChange={e => setMedicalCheckupAgeInput(e.target.value)}
            min={1}
            style={{ padding: 8, fontSize: 16 }}
          />
          {medicalCheckupError && <Typography color="error">{medicalCheckupError}</Typography>}
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button
              label="Cancel"
              onClick={() => setMedicalCheckupDialogOpen(false)}
              className="p-button-text"
              disabled={medicalCheckupLoading}
            />
            <Button
              label={medicalCheckupLoading ? 'Saving...' : 'Save'}
              onClick={handleSaveMedicalCheckupAge}
              disabled={medicalCheckupLoading}
            />
          </Box>
        </Box>
      </Dialog>

    </div>
  )
}
