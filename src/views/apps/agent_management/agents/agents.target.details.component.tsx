'use client';
import React, { useEffect, useState } from 'react';
import { Select, MenuItem, TextField, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputLabel, FormControl, CircularProgress, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { HierarchyService } from '@/services/remote-api/api/hierarchy-services';
import { AgentsService } from '@/services/remote-api/fettle-remote-api';

const branchService = new HierarchyService()
const agentsService = new AgentsService()

const TargetComponent = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedUM, setSelectedUM] = useState('');
  const [tableData, setTableData] = useState<any[]>([])
  const [region, setRegion] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // --- Dropdown Handlers ---
  const handleYearChange = (event: any) => {
    setSelectedYear(event.target.value);
  };

  const handleRegionChange = (event: any) => {
    setSelectedRegion(event.target.value);
    setSelectedBranch('');
    setSelectedUM('');
    setBranches([]);
    setUnits([]);
  };

  const handleBranchChange = (event: any) => {
    setSelectedBranch(event.target.value);
    setSelectedUM('');
    setUnits([]);
  };

  const handleUMChange = (event: any) => {
    setSelectedUM(event.target.value);
  };

  // --- Data Fetchers ---
  const populateRegion = () => {
    let pageRequest: any = {
      page: 0,
      size: 1000,
      summary: true,
      active: true
    }
    branchService.getRegion(pageRequest).subscribe(value => {
      let temp: any[] = []
      value.content.map((item: any) => {
        let obj = {
          value: item.id,
          label: item.name
        }
        temp.push(obj);
      })
      setRegion(temp);
    })
  }

  const loadBranches = (regionId: any) => {
    branchService.getBranchesFromRegion(regionId).subscribe({
      next: (response: any) => {
        const branchList = response.branches.map((branch: any) => ({
          value: branch.id,
          label: branch.centerName
        }))
        setBranches(branchList)
      }
    })
  }

  const getUnits = () => {
    branchService.getUnitsFromBranch(selectedBranch).subscribe(value => {
      let temp: any[] = []
      value.units.map((item: any) => {
        let obj = {
          value: item.id,
          label: item.name,
          managerId: item.managerId
        }
        temp.push(obj);
      })
      setUnits(temp);
    })
  }

  // --- Main Data Loader ---
  useEffect(() => {
    populateRegion();
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      loadBranches(selectedRegion);
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedBranch) {
      getUnits();
    }
  }, [selectedBranch]);

  useEffect(() => {
    setLoading(true);
    setAgents([]);
    setTableData([]);

    // 1. If unit is selected, show only that unit's agents
    if (selectedUM) {
      getAgents(selectedUM, true, () => setLoading(false));
      return;
    }

    // 2. If branch is selected, show all agents from all units in that branch
    if (selectedBranch) {
      branchService.getUnitsFromBranch(selectedBranch).subscribe(value => {
        if (!value.units || value.units.length === 0) {
          setLoading(false); // <-- No units, stop loader and show "No data available"
          return;
        }
        if (value.units && value.units.length) {
          let count = value.units.length;
          value.units.forEach((unit: any, idx: number) => {
            getAgents(unit.id, false, () => {
              count--;
              if (count === 0) setLoading(false);
            });
          });
        } else {
          setLoading(false); // <-- No units, stop loader and show "No data available"
        }
      });
      return;
    }

    // 3. If region is selected, show all agents from all units in all branches in that region
    if (selectedRegion) {
      branchService.getBranchesFromRegion(selectedRegion).subscribe({
        next: (response: any) => {
          if (!response.branches || response.branches.length === 0) {
            setLoading(false); // <-- No branches, stop loader and show "No data available"
            return;
          }
          let totalUnits = 0;
          let finishedUnits = 0;
          let allUnits: any[] = [];
          response.branches.forEach((branch: any) => {
            if (!branch.units || branch.units.length === 0) {
              setLoading(false); // <-- No units, stop loader and show "No data available"
              return;
            }
            branchService.getUnitsFromBranch(branch.id).subscribe(unitResp => {
              if (unitResp.units && unitResp.units.length) {
                allUnits.push(...unitResp.units);
                totalUnits += unitResp.units.length;
                unitResp.units.forEach((unit: any) => {
                  getAgents(unit.id, false, () => {
                    finishedUnits++;
                    if (finishedUnits === totalUnits) setLoading(false);
                  });
                });
              } else {
                if (++finishedUnits === totalUnits) setLoading(false);
              }
            });
          });
        }
      });
      return;
    }

    // 4. If nothing selected, show all agents from all units in all branches in all regions
    let pageRequest: any = {
      page: 0,
      size: 1000,
      summary: true,
      active: true
    }
    branchService.getRegion(pageRequest).subscribe(value => {
      let allUnits: any[] = [];
      value.content.forEach((region: any) => {
        region?.branches?.forEach((branch: any) => {
          branch?.units?.forEach((unit: any) => {
            allUnits.push(unit);
          });
        });
      });
      if (allUnits.length === 0) {
        setLoading(false); // <-- No units anywhere, stop loader and show "No data available"
        return;
      }
      let count = allUnits.length;
      allUnits.forEach((unit: any) => {
        getAgents(unit.id, false, () => {
          count--;
          if (count === 0) setLoading(false);
        });
      });
    });
  }, [selectedRegion, selectedBranch, selectedUM, selectedYear]);

  // --- Agent Fetcher ---
  const getAgents = (unitId: any, isSingle: boolean, cb?: () => void) => {
    agentsService.getAgentsFromUnit(unitId).subscribe(value => {
      let tempAgents: any[] = [];
      let tempTableData: any[] = [];
      value.forEach((item: any) => {
        let agentObj = {
          id: item.id,
          name: item.agentBasicDetails.name,
        };
        tempAgents.push(agentObj);
        let targetForYear = Array.isArray(item.agentTargetDetailsDto)
          ? item.agentTargetDetailsDto.find((t: any) => t.year === selectedYear)
          : null;

        const monthsArr = [
          targetForYear?.jan ?? '',
          targetForYear?.feb ?? '',
          targetForYear?.mar ?? '',
          targetForYear?.apr ?? '',
          targetForYear?.may ?? '',
          targetForYear?.jun ?? '',
          targetForYear?.jul ?? '',
          targetForYear?.aug ?? '',
          targetForYear?.sep ?? '',
          targetForYear?.oct ?? '',
          targetForYear?.nov ?? '',
          targetForYear?.dec ?? '',
        ];

        tempTableData.push([
          agentObj.name,
          ...monthsArr
        ]);
      });

      if (isSingle) {
        setAgents(tempAgents);
        setTableData(tempTableData);
      } else {
        setAgents(prev => [...prev, ...tempAgents]);
        setTableData(prev => [...prev, ...tempTableData]);
      }
      if (cb) cb();
    });
  }

  // --- Table Totals ---
  const totals = months.map((_, monthIdx) =>
    tableData.reduce((sum, row) => {
      const val = Number(row[monthIdx + 1]);
      return sum + (isNaN(val) ? 0 : val);
    }, 0)
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Target Details</h2>
      <Grid container spacing={2} style={{ marginBottom: '20px' }}>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id="year-label">Year</InputLabel>
            <Select
              labelId="year-label"
              value={selectedYear}
              onChange={handleYearChange}
              label="Year"
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3} style={{ position: 'relative' }}>
          <FormControl fullWidth>
            <InputLabel id="region-label">Region</InputLabel>
            <Select
              labelId="region-label"
              value={selectedRegion}
              onChange={handleRegionChange}
              label="Region"
            >
              {region.map((region) => (
                <MenuItem key={region.value} value={region.value}>
                  {region.label}
                </MenuItem>
              ))}
            </Select>
            {selectedRegion && (
              <IconButton
                size="small"
                onClick={() => handleRegionChange({ target: { value: '' } })}
                aria-label="clear region"
                style={{
                  position: 'absolute',
                  right: 36, // adjust so it doesn't overlap the dropdown arrow
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  background: 'white'
                }}
                tabIndex={-1}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={3} style={{ position: 'relative' }}>
          <FormControl fullWidth>
            <InputLabel id="branch-label">Branch</InputLabel>
            <Select
              labelId="branch-label"
              value={selectedBranch}
              onChange={handleBranchChange}
              label="Branch"
            >
              {branches.map((branch) => (
                <MenuItem key={branch.value} value={branch.value}>
                  {branch.label}
                </MenuItem>
              ))}
            </Select>
            {selectedBranch && (
              <IconButton
                size="small"
                onClick={() => handleBranchChange({ target: { value: '' } })}
                aria-label="clear branch"
                style={{
                  position: 'absolute',
                  right: 36,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  background: 'white'
                }}
                tabIndex={-1}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={3} style={{ position: 'relative' }}>
          <FormControl fullWidth>
            <InputLabel id="um-label">Unit Manager</InputLabel>
            <Select
              labelId="um-label"
              value={selectedUM}
              onChange={handleUMChange}
              label="Unit Manager"
            >
              {units.map((um) => (
                <MenuItem key={um.value} value={um.value}>
                  {um.label}
                </MenuItem>
              ))}
            </Select>
            {selectedUM && (
              <IconButton
                size="small"
                onClick={() => handleUMChange({ target: { value: '' } })}
                aria-label="clear unit manager"
                style={{
                  position: 'absolute',
                  right: 36,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  background: 'white'
                }}
                tabIndex={-1}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </FormControl>
        </Grid>
      </Grid>

      {/* Loader, No Data, or Table */}
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <CircularProgress />
        </div>
      ) : tableData?.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold', backgroundColor: '#D80E51', color: 'white' }}>Agent Name</TableCell>
                {months.map((month) => (
                  <TableCell key={month} style={{ fontWeight: 'bold', backgroundColor: '#D80E51', color: 'white' }}>
                    {month}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row: any, rowIndex: number) => (
                <TableRow key={rowIndex}>
                  <TableCell style={{ fontWeight: 'bold', backgroundColor: '#e3f2fd' }}>
                    {row[0]}
                  </TableCell>
                  {row.slice(1).map((cell: any, colIndex: number) => (
                    <TableCell key={colIndex}>
                      {cell ? cell : '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                  Total
                </TableCell>
                {totals.map((total, idx) => (
                  <TableCell key={idx} style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    {total > 0 ? total : '-'}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>
          No data available
        </div>
      )}
    </div>
  );
};

export default TargetComponent;
