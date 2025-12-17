// import * as React from "react";
// import * as yup from "yup";
import * as React from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

import 'date-fns'

import { DenominationService } from '@/services/remote-api/api/master-services/denomination.service'

const useStyles = makeStyles(theme => ({
  input1: {
    width: '50%'
  },
  clientTypeRadioGroup: {
    flexWrap: 'nowrap',
    '& label': {
      flexDirection: 'row'
    }
  },
  formControl: {
    minWidth: 182
  }
}))

// function useQuery1() {
//     return new URLSearchParams(useLocation().search);
// }
const denoService = new DenominationService()

export default function DenominationsAddComponent(props: any) {
  const query2 = useSearchParams()

  // const { id } = useParams();
  const history = useRouter()
  const classes = useStyles()

  const [denominationList, setDenominationList]: any = React.useState([
    {
      currencyType: '',
      currencyValue: ''
    }
  ])

  const [denominationTypes, setDenominationTypes] = React.useState([
    {
      id: '1111',
      name: 'Note'
    },
    {
      id: '2222',
      name: 'Metal Coin'
    }
  ])

  const handleInputChangeIndentification = (e: any, index: number) => {
    const { name, value } = e.target
    const list: any = [...denominationList]

    list[index][name] = value
    setDenominationList(list)
  }

  const handleRemoveClickIndentification = (index: number) => {
    const list = [...denominationList]

    list.splice(index, 1)
    setDenominationList(list)
  }

  const handleAddClickIndentification = () => {
    setDenominationList([...denominationList, { currencyType: '', currencyValue: '' }])
  }

  const handleSubmit = () => {
    denominationList.forEach((ele: any) => {
      if (
        ele.currencyType === '' ||
        ele.currencyValue === '' ||
        ele.currencyType === null ||
        ele.currencyValue === null
      ) {
        return
      }
    })
    denoService.saveDenomination(denominationList).subscribe(ele => {
      history.push(`/masters/denominations?mode=viewList`)

      // window.location.reload();
    })
  }

  const handleClose = () => {
    history.push(`/masters/denominations?mode=viewList`)

    // window.location.reload();
  }

  return (
    <Paper elevation={0}>
      <Box p={3} my={2}>
        {/* <form onSubmit={formik.handleSubmit}> */}
        {denominationList.map((x: any, i: number) => {
          return (
            <Grid container spacing={3} key={`denominationListData-${i}`}>
              <Grid item xs={4}>
                <FormControl className={classes.formControl}>
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Denomination type
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    label='Denomination type'
                    name='currencyType'
                    value={x.currencyType}
                    onChange={e => handleInputChangeIndentification(e, i)}
                    error={x.currencyType === null || x.currencyType === ''}

                    // helperText={x.currencyType === '' ? 'required field' : ' '}
                  >
                    {denominationTypes.map(ele => {
                      return (
                        <MenuItem key={ele.id} value={ele.name}>
                          {ele.name}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id='standard-basic'
                  name='currencyValue'
                  type='number'
                  required
                  value={x.currencyValue}
                  onChange={e => handleInputChangeIndentification(e, i)}
                  label='Denomination value'
                  error={x.currencyValue === null || x.currencyValue === ''}
                  helperText={x.currencyValue === '' ? 'required field' : ' '}
                />
              </Grid>

              <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                {denominationList.length !== 1 && (
                  <Button
                    className='mr10'
                    onClick={() => handleRemoveClickIndentification(i)}
                    variant='contained'
                    color='secondary'
                    style={{ marginLeft: '5px' }}
                  >
                    <DeleteIcon />
                  </Button>
                )}
                {denominationList.length - 1 === i && (
                  <Button
                    variant='contained'
                    color='primary'
                    style={{ marginLeft: '5px' }}
                    onClick={handleAddClickIndentification}
                  >
                    <AddIcon />
                  </Button>
                )}
              </Grid>
            </Grid>
          )
        })}
        <Grid container spacing={3}>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant='contained' color='primary' style={{ marginRight: '5px' }} onClick={handleSubmit}>
              Save
            </Button>
            <Button variant='contained' onClick={handleClose}>
              Cancel
            </Button>
          </Grid>
        </Grid>
        {/* </form> */}
      </Box>
    </Paper>
  )
}
