'use client'
import React, { useEffect, useState } from 'react'

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { lastValueFrom } from 'rxjs'

import { BenefitStructureService } from '@/services/remote-api/fettle-remote-api'

const claimtypeService = new BenefitStructureService()

const BenefitAddressComponent = () => {
  const [benefitData, setBenefitData] = useState([])
  const [benefitDataChild, setBenefitDataChild]: any = useState([])

  const [handleParam, setHandleParam] = useState({
    paramMain: '',
    paramSub: ''
  })

  const [open, setOpen] = React.useState(false)
  const [dialogData, setDialogData]: any = useState([])
  const [loading, setLoading] = useState(true)
  const [handleParamInter, setHandlePramaInter] = useState('')

  // --------------------filterData-------------------------------
  const [mainBenefit, setMainBenefit] = useState([])
  const [subBenefit, setSubBenefit]: any = useState([])
  const [mainBenefitIntervention, setMainBenefitIntervention]: any = useState([])

  const [filteredIntervention, setFilteredIntervention] = useState([])
  const [mainData, setMainData] = useState([])
  const [mainAccess, setMainAccess] = useState(false)

  useEffect(() => {
    if (dialogData.length > 0) {
      setFilteredIntervention(dialogData?.interventionCount?.listOfBenefitInterventionCodeNameDto)
    }
  }, [dialogData])

  useEffect(() => {
    claimtypeService.getBenefitStructure().subscribe((res: any) => {
      setBenefitData(res?.content)
      setMainBenefit(res?.content)
    })
  }, [])

  const handleSelect = (value: any) => {
    setHandleParam({ ...handleParam, ['paramMain']: value?.target?.value, ['paramSub']: '' })

    const filterMainBenefit = benefitData.filter((item: any) => {
      return item?.name == value?.target?.value && item
    })

    setMainBenefit(filterMainBenefit)
  }

  const handleChange = (value: any) => {
    setHandleParam({ ...handleParam, ['paramSub']: value.target.value })
    const subBenefitFilter: any = benefitDataChild[0]?.filter((item: any) =>
      item.name.includes(value.target.value.toUpperCase())
    )

    setSubBenefit([subBenefitFilter])
  }

  const handleReset = () => {
    setHandleParam({
      paramMain: '',
      paramSub: ''
    })
    claimtypeService.getBenefitStructure().subscribe((res: any) => {
      setBenefitData(res?.content)
      setMainBenefit(res?.content)
    })
  }

  function callingInSerial(id: any) {
    return lastValueFrom(claimtypeService.getBenefitStructureChild(id))
  }

  async function fetchBenefitData() {
    const observables = mainBenefit.map((item: any) => {
      return callingInSerial(item.id)
    })

    try {
      const results = await Promise.all(observables)

      setLoading(true)

      setBenefitDataChild(results)
      setSubBenefit(results)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  function callingInSerialMain(id: any) {
    return lastValueFrom(claimtypeService.getBenefitStructureIntervention(id))
  }

  async function fetchMainBenefitDataIntervention() {
    const observables = mainBenefit.map((item: any) => {
      return callingInSerialMain(item.id)
    })

    try {
      const results: any = await Promise.all(observables)

      setLoading(true)
      setMainBenefitIntervention(results)

      // setBenefitDataChild(results);
      // setSubBenefit(results);
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchBenefitData()
    fetchMainBenefitDataIntervention()
  }, [mainBenefit])

  const handleSetFilteredIntervention = (data: any) => {
    setFilteredIntervention(prevData => {
      return data
    })

    return
  }

  return !loading ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  ) : (
    <Box>
      <h2>Benefit Config</h2>
      <Box sx={{ margin: '20px 0px', display: 'flex', alignItems: 'center' }}>
        <FormControl variant='outlined' sx={{ width: '300px', margin: '0px 0px' }}>
          <InputLabel id='demo-simple-select-label'> Select main benefit</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            label='Select main benefit'
            value={handleParam?.paramMain}
            onChange={handleSelect}
            style={{ width: '300px', margin: '0px 0px' }}
          >
            {benefitData?.map((item: any) => (
              <MenuItem key={item.name} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          style={{ width: '300px', margin: '0px 10px' }}
          id='outlined-basic'
          value={handleParam?.paramSub}
          label='Search sub benefit...'
          variant='outlined'
          onChange={handleChange}
          disabled={handleParam.paramMain.length > 0 ? false : true}
        />
        <Button
          style={{ backgroundColor: '#D80E51', color: 'white', marginLeft: '10px', padding: '15px 20px' }}
          onClick={handleReset}
        >
          Reset
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Main Benefit</TableCell>
              <TableCell align='center'>No. of Main Benefit Intervention</TableCell>
              <TableCell>Sub Benefit</TableCell>
              <TableCell align='center'>No. of Intervention</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mainBenefit?.map((item: any, index: number) => (
              <React.Fragment key={`main-row-${index}`}>
                {subBenefit[index] == null || subBenefit[index].length < 1 ? (
                  <TableRow>
                    <TableCell>{item.name}</TableCell>
                    <TableCell
                      rowSpan={1}
                      style={{ textAlign: 'center', cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => {
                        setDialogData([])
                        setMainData(mainBenefitIntervention[index])
                        setFilteredIntervention(mainBenefitIntervention[index])
                        setOpen(true)
                        setMainAccess(true)

                        // setHandlePramaInter('');
                      }}
                    >
                      {mainBenefitIntervention[index]?.length}
                    </TableCell>
                  </TableRow>
                ) : (
                  subBenefit[index]?.filter(Boolean).map((data: any, i: number) => (
                    <TableRow key={i}>
                      {i === 0 && (
                        <>
                          <TableCell rowSpan={subBenefit[index].length}>{item.name}</TableCell>
                          <TableCell
                            rowSpan={subBenefit[index].length}
                            style={{ textAlign: 'center', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => {
                              setDialogData([])
                              setMainData(mainBenefitIntervention[index])
                              setFilteredIntervention(mainBenefitIntervention[index])
                              setOpen(true)
                              setMainAccess(true)

                              // setHandlePramaInter('');
                            }}
                          >
                            {mainBenefitIntervention[index]?.length}
                          </TableCell>
                        </>
                      )}
                      <TableCell>{data?.name || 'NA'}</TableCell>

                      <TableCell align='center'>
                        <span
                          onClick={() => {
                            setDialogData(data)
                            setFilteredIntervention(data?.interventionCount?.listOfBenefitInterventionCodeNameDto)
                            setOpen(true)
                            setMainAccess(false)

                            // setHandlePramaInter('');
                          }}
                          style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          {data?.interventionCount?.noOfIntervention || 'NA'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ResponsiveDialog
        open={open}
        setOpen={setOpen}
        data={dialogData}
        filteredIntervention={filteredIntervention}
        handleSetFilteredIntervention={handleSetFilteredIntervention}
        handleParamInter={handleParamInter}
        setHandlePramaInter={setHandlePramaInter}
        mainData={mainData}
        mainAccess={mainAccess}
      />
    </Box>
  )
}

export default BenefitAddressComponent
type ResponsiveDialogProps = {
  open: boolean
  setOpen: (value: boolean) => void
  data: any
  filteredIntervention: any
  handleSetFilteredIntervention: (value: any) => void
  handleParamInter: any
  setHandlePramaInter: (value: any) => void
  mainAccess: any
  mainData: any
}

function ResponsiveDialog({
  open,
  setOpen,
  data,
  filteredIntervention,
  handleSetFilteredIntervention,
  handleParamInter,
  setHandlePramaInter,
  mainAccess,
  mainData
}: ResponsiveDialogProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [flipDialog, setFlipDialog] = useState('I')
  const [diagnosisData, setDiagnosisData] = useState([])
  const [diagnosisFilteredData, setDiagnosisFilteredData] = useState([])
  const [handleParam, setHandleParam] = useState('')
  const [handleFlow, setHandleFlow] = useState(0)
  const [handleFlowDiag, setHandleFlowDiag] = useState(0)

  const handleChangeParam = (e: any) => {
    // setHandleParam(e.target.value);
    setHandlePramaInter(e.target.value)

    if (data?.interventionCount?.listOfBenefitInterventionCodeNameDto.length > 0) {
      setHandleFlow(1)

      const filterInterventionData = data?.interventionCount?.listOfBenefitInterventionCodeNameDto.filter(
        (item: any) => {
          return (
            item.name.toUpperCase().includes(e.target.value.toUpperCase()) ||
            (item.code.toUpperCase().includes(e.target.value.toUpperCase()) && item)
          )
        }
      )

      // setFilteredIntervention(filterInterventionData);
      handleSetFilteredIntervention(filterInterventionData)
    } else {
      const filterInterventionData = mainData.filter((item: any) => {
        return (
          item.name.toUpperCase().includes(e.target.value.toUpperCase()) ||
          (item.code.toUpperCase().includes(e.target.value.toUpperCase()) && item)
        )
      })

      // setFilteredIntervention(filterInterventionData);
      handleSetFilteredIntervention(filterInterventionData)
    }
  }

  const handleChangeDiagnosisParam = (e: any) => {
    // setHandleParam(e.target.value);
    setHandleParam(e.target.value)

    // setHandleFlowDiag(1);
    const filterDiagnosisData = diagnosisData?.filter((item: any) => {
      return (
        item.name.toUpperCase().includes(e.target.value.toUpperCase()) ||
        (item.code.toUpperCase().includes(e.target.value.toUpperCase()) && item)
      )
    })

    setDiagnosisFilteredData(filterDiagnosisData)
  }

  // useEffect(()=>{
  //   setHandleIntervention(data?.interventionCount?.listOfBenefitInterventionCodeNameDto)
  //   setFilteredIntervention(data?.interventionCount?.listOfBenefitInterventionCodeNameDto)
  // },[])

  const handleClose = () => {
    setHandlePramaInter('')
    setOpen(false)
    setTimeout(() => {
      setFlipDialog('I')
    }, 1000)
  }

  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby='responsive-dialog-title'
        PaperProps={{ style: { minWidth: 900 } }} // Add this line to set the minimum width
      >
        <DialogContent>
          <>
            {flipDialog === 'I' ? (
              <TableContainer component={Paper}>
                <h2 style={{ margin: '5px' }}>Intervention</h2>
                <Box>
                  <TextField
                    id='outlined-basic'
                    style={{ width: '350px', margin: '0px 10px' }}
                    value={handleParamInter}
                    label='Search Name or Code...'
                    variant='outlined'
                    onChange={e => handleChangeParam(e)}

                    // disabled = {handleParam.paramMain.length>0 ? false : true}
                  />

                  {/* <Button style={{ backgroundColor: '#D80E51', color: 'white', marginLeft: '10px', padding: '15px 20px' }}>
                    Reset
                  </Button> */}
                </Box>
                <Table aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align='center'>Code</TableCell>
                      <TableCell align='center'>Intervention ID</TableCell>
                      <TableCell align='right' style={!mainAccess ? { display: 'block' } : { display: 'none' }}>
                        No. of Diagnosis
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {handleFlow || mainAccess
                      ? filteredIntervention?.map((row: any, i: number) => (
                          <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component='th' scope='row'>
                              {row?.name}
                            </TableCell>
                            <TableCell align='right'>{row?.code}</TableCell>
                            <TableCell align='right'>{row?.interventionId}</TableCell>
                            <TableCell align='center' style={!mainAccess ? { display: 'block' } : { display: 'none' }}>
                              <span
                                onClick={() => {
                                  setFlipDialog('D')
                                  setDiagnosisData(data?.diagnosisCount[i]?.listOfbenefitServiceNameCodeDto)
                                  setDiagnosisFilteredData(data?.diagnosisCount[i]?.listOfbenefitServiceNameCodeDto)
                                }}
                                style={{ cursor: 'pointer' }}
                              >
                                {data.length ? data?.diagnosisCount[i]?.noOfDiagnosis : 'NA'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      : data?.interventionCount?.listOfBenefitInterventionCodeNameDto.map((row: any, i: number) => (
                          <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component='th' scope='row'>
                              {row.name}
                            </TableCell>
                            <TableCell align='right'>{row.code}</TableCell>
                            <TableCell align='right'>{row.interventionId}</TableCell>
                            <TableCell align='center'>
                              <span
                                onClick={() => {
                                  setFlipDialog('D')
                                  setDiagnosisData(data?.diagnosisCount[i]?.listOfbenefitServiceNameCodeDto)
                                  setDiagnosisFilteredData(data?.diagnosisCount[i]?.listOfbenefitServiceNameCodeDto)
                                }}
                                style={{ cursor: 'pointer' }}
                              >
                                {data?.diagnosisCount[i]?.noOfDiagnosis || 'NA'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableContainer component={Paper}>
                <h2 style={{ margin: '5px' }}>Diagnosis</h2>
                <Box>
                  <TextField
                    id='outlined-basic'
                    style={{ width: '350px', margin: '0px 10px' }}
                    value={handleParam}
                    label='Search Name or Code...'
                    variant='outlined'
                    onChange={e => handleChangeDiagnosisParam(e)}

                    // disabled = {handleParam.paramMain.length>0 ? false : true}
                  />

                  {/* <Button style={{ backgroundColor: '#D80E51', color: 'white', marginLeft: '10px', padding: '15px 20px' }}>
               Reset
             </Button> */}
                </Box>
                <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align='right'>Code</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {diagnosisFilteredData?.map((row: any, i: number) => (
                      <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component='th' scope='row'>
                          {row.name}
                        </TableCell>
                        <TableCell align='right'>{row.code}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        </DialogContent>
        <DialogActions>
          {flipDialog != 'I' && (
            <Button
              onClick={() => {
                setFlipDialog('I')
                setHandleParam('')
              }}
              style={{ backgroundColor: '#D80E51', color: 'white' }}
            >
              Back
            </Button>
          )}
          <Button onClick={handleClose} style={{ backgroundColor: '#D80E51', color: 'white' }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
