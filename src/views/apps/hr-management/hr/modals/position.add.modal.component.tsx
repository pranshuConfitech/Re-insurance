import * as React from 'react'

import { FormControl, InputLabel, MenuItem, Select, Snackbar } from '@mui/material'
import { Button } from 'primereact/button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import MuiAlert from '@mui/lab/Alert'
import { firstValueFrom } from 'rxjs'

import 'date-fns'

import { HierarchyService } from '@/services/remote-api/api/hierarchy-services/hierarchy.services'
import Asterisk from '@/views/apps/shared-component/components/red-asterisk'
import { ProviderTypeService } from '@/services/remote-api/fettle-remote-api'

const orgtypeservice = new HierarchyService()
const Providertypeservice = new ProviderTypeService()

function Alert(props: any) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

export default function PositionAddModal(props: any) {
  const [remarks, setRemarks] = React.useState('')
  const [fullWidth, setFullWidth] = React.useState(true)
  const [maxWidth, setMaxWidth] = React.useState<any>('sm')
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  const [snackbarMessage, setSnackbarMessage] = React.useState('')
  const [region, setRegion]: any[] = React.useState<any[]>([])
  const [branches, setBranches] = React.useState<any[]>([])
  const [units, setUnits] = React.useState<any[]>([])
  const [addDisabled, setAddDisabled] = React.useState(false)

  const getRegion = () => {
    let pageRequest: any = {
      page: 0,
      size: 1000,
      summary: true,
      active: true
    }
    orgtypeservice.getRegion(pageRequest).subscribe(value => {
      let temp: any[] = []
      value.content.map((item: any) => {
        let obj = {
          value: item.id,
          label: `${item.regionManager} - ${item.name}`,
          managerId: item.managerId
        }
        temp.push(obj);
      })

      props.hierarchyData[0]?.positionDTOs?.forEach((item: any) => {
        if (item.positionType === 'REGION') {
          temp = temp.filter((obj: any) => obj.value !== item.positionId);
        }
      });
      setRegion(temp);
    })
  }

  const getBranches = () => {
    orgtypeservice.getBranchesFromRegion(props.selectedNode?.positionId).subscribe({
      next: (response: any) => {
        let branchList = response.branches.map((branch: any) => ({
          value: branch.id,
          label: `${branch.branchManager} - ${branch.centerName}`,
          managerId: branch.branchManagerId
        }))
        props.hierarchyData[0]?.positionDTOs?.forEach((item: any) => {
          item.positionDTOs?.forEach((el: any) => {
            if (el.positionType === 'BRANCH') {
              branchList = branchList.filter((obj: any) => obj.value !== el.positionId);
            }
          })
        });
        setBranches(branchList)
      }
    })
  }

  const getUnits = () => {
    let pageRequest: any = {
      page: 0,
      size: 1000,
      summary: true,
      active: true
    }
    orgtypeservice.getUnitsFromBranch(props.selectedNode?.positionId).subscribe(value => {
      let temp: any[] = []
      value.units.map((item: any) => {
        let obj = {
          value: item.id,
          label: `${item.unitManager} - ${item.name}`,
          managerId: item.managerId
        }
        temp.push(obj);
      })
      props.hierarchyData[0]?.positionDTOs?.forEach((item: any) => {
        item.positionDTOs?.forEach((el: any) => {
          el.positionDTOs?.forEach((e: any) => {
            if (e.positionType === 'UNIT') {
              temp = temp.filter((obj: any) => obj.value !== e.positionId);
            }
          })
        })
      });
      setUnits(temp);
    })
  }

  React.useEffect(() => {
    if (props.selectedNode && Object.keys(props.selectedNode).length > 0) {
      getRegion();
      getBranches();
      getUnits();
    }
  }, [props.selectedNode])

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleClose = () => {
    props.closePositionModal()
  }

  const handleModalSubmit = async () => {
    setAddDisabled(true); // Disable the button immediately
    try {
      if (remarks !== null && remarks !== '') {
        const payload: {
          userId: string;
          type: any;
          parentPosition: any;
          positionId?: string;
          positionType: string;
          name?: string;
        } = {
          userId: '', // manager id to be set later
          type:
            props.selectedNode?.level == '1'
              ? 'USER'
              : props.selectedNode?.level == '2'
                ? 'USER'
                : props.selectedNode?.level == '3'
                  ? 'USER'
                  : 'AGENT',
          parentPosition: props.selectedNode?.id ? props.selectedNode.id : null,
          positionId: remarks, // region id
          positionType:
            props.selectedNode?.level == '1'
              ? 'REGION'
              : props.selectedNode?.level == '2'
                ? 'BRANCH'
                : props.selectedNode?.level == '3'
                  ? 'UNIT'
                  : '',
        };

        try {
          // Call getBasicDetail only if hierarchyData is empty
          if (!props.hierarchyData || props.hierarchyData.length === 0) {
            const res: any = await firstValueFrom(Providertypeservice.getBasicDetail());

            if (res[0]?.gmUserId) {
              payload.positionType = 'PARENT_POSITON';
              payload.name = remarks;
              payload.userId = res[0].gmUserId;
              delete payload.positionId;
            } else {
              alert('Please add User in Insurance Config');
              setAddDisabled(false); // Re-enable on error
              return;
            }
          }

          // Continue with further operations regardless of hierarchyData
          if (props.selectedNode?.level == '1') {
            region.map((item: any) => {
              if (item.value === remarks) {
                payload.userId = item.managerId;
              }
            });
          }

          if (props.selectedNode?.level == '2') {
            branches.map((item: any) => {
              if (item.value === remarks) {
                payload.userId = item.managerId;
              }
            });
          }

          if (props.selectedNode?.level == '3') {
            units.map((item: any) => {
              if (item.value === remarks) {
                payload.userId = item.managerId;
              }
            });
          }

          orgtypeservice.addPosition(payload).subscribe(res => {
            props.submitPositionModal();
            setRemarks('');
            setAddDisabled(false); // Re-enable after success
          }, (error: any) => {
            setAddDisabled(false); // Re-enable on error
          });

        } catch (error) {
          console.error('Error fetching basic details:', error);
          setAddDisabled(false); // Re-enable on error
        }
      } else {
        setSnackbarMessage('Please enter position');
        setSnackbarOpen(true);
        setAddDisabled(false); // Re-enable if validation fails
      }
    } catch (err) {
      setAddDisabled(false); // Re-enable on any unexpected error
    }
  }

  const handleChange = (e: any) => {
    setRemarks(e.target.value)
  }

  return (
    <Dialog
      open={props.positionModal}
      onClose={handleClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      aria-labelledby='form-dialog-title'
      disableEnforceFocus
    >
      <DialogTitle id='form-dialog-title'>Add Position</DialogTitle>
      <DialogContent>
        {!props.hierarchyData?.length ? <TextField
          id='standard-multiline-flexible'
          multiline
          name='remarks'
          value={remarks}
          onChange={handleChange}
          label={
            <span>
              Position Name <Asterisk />
            </span>
          }
        />
          : props.selectedNode?.level == "1" ?
            <FormControl style={{ width: "50%" }}
            >
              <InputLabel
                id="demo-simple-select-label"
                style={{ marginBottom: "0px" }}
              >
                Region
              </InputLabel>
              <Select
                label="Region"
                name="region"
                value={remarks}
                variant="outlined"
                onChange={handleChange}
                style={{ fontSize: "14px" }}
              >
                {region.map((item: any) => {
                  return (
                    <MenuItem style={{ fontSize: "14px" }} value={item.value}>{item.label}</MenuItem>
                  )
                })}
              </Select>
            </FormControl> :
            props.selectedNode?.level == "2" ? <FormControl style={{ width: "50%" }}
            >
              <InputLabel
                id="demo-simple-select-label"
                style={{ marginBottom: "0px" }}
              >
                Branch
              </InputLabel>
              <Select
                label="Branch"
                name="branch"
                value={remarks}
                variant="outlined"
                onChange={handleChange}
                style={{ fontSize: "14px" }}
              >
                {branches.map((item: any) => {
                  return (
                    <MenuItem style={{ fontSize: "14px" }} value={item.value}>{item.label}</MenuItem>
                  )
                })}
              </Select>
            </FormControl> : <FormControl style={{ width: "50%" }}
            >
              <InputLabel
                id="demo-simple-select-label"
                style={{ marginBottom: "0px" }}
              >
                Unit
              </InputLabel>
              <Select
                label="Unit"
                name="unit"
                value={remarks}
                variant="outlined"
                onChange={handleChange}
                style={{ fontSize: "14px" }}
              >
                {units.map((item: any) => {
                  return (
                    <MenuItem style={{ fontSize: "14px" }} value={item.value}>{item.label}</MenuItem>
                  )
                })}
              </Select>
            </FormControl>
        }
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
        <Button
          onClick={handleModalSubmit}
          color='primary'
          disabled={addDisabled} // <-- Disable while processing
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}
