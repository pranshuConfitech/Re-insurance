import React, { Fragment, useState } from 'react'

import { makeStyles } from '@mui/styles'
import { Button } from 'primereact/button'
import Grid from '@mui/material/Grid'

import TextField from '@mui/material/TextField'

import { FettleDataGrid } from './fettle.data.grid'

const useStyles = makeStyles((theme: { spacing: (arg0: number) => any }) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    height: 140,
    width: 100
  },
  control: {
    padding: theme.spacing(2)
  }
}))

export const FettleMultiFieldSearch = (props: any) => {
  const [tempValus, setTempValues]: any = useState(null)

  // const classes = useStyles();
  const [showDataGrid, setShowDataGrid] = useState(false)
  const [dataGridKey, setDataGridKey] = useState(1)

  // const [fields, setFields] = useState();

  const configuration = {
    enableSelection: false,
    // scrollHeight: props.dataGridScrollHeight,
    scrollHeight: "200px",
    actionButtons: [
      {
        icon: 'pi pi-clone',
        className: 'ui-button-warning',
        onClick: (item: any) => props.onSelect && props.onSelect(item)
      }
    ],
    header: {
      enable: false,
      text: ''
    },
    pageSize: props.dataGridPageSize,
    disableConfirm: true
  }

  const proxyDataSource$ = (pageRequest: any) => {
    return props.$datasource({ ...tempValus }, pageRequest)
  }

  const handleOnSearchButtonClick = () => {
    const v = props.fields
      .map((field: { propertyName: any; value: any }) => [field.propertyName, field.value])
      .reduce((obj: { [x: string]: any }, item: any[]) => {
        obj[item[0]] = item[1]

        return obj
      }, {})

    setTempValues(v)
    setShowDataGrid(true)
    setDataGridKey(dataGridKey + 1)
  }

  const buildField = (field: any) => {
    switch (field.type) {
      case 'text':
      default:
        return (
          <TextField
            label={field.label}
            fullWidth
            key={field.propertyName}
            onChange={e => (field.value = e.target.value)}
          />
        )
    }
  }

  const buildFieldGrid = (f: any) => {
    return (
      <Grid style={{ minWidth: 130 }} item xs key={`grid_${f.propertyName}`}>
        {buildField(f)}
      </Grid>
    )
  }

  const buildFieldsGrid = () => {
    return (
      <Grid container spacing={1}>
        {props.fields
          .map((field: { type: string; value: string }) => {
            field.type = field.type || 'text'
            field.value = field.value || ''

            return field
          })
          .map(buildFieldGrid)}
        <Grid item xs container alignItems='center' justifyContent='flex-end'>
          <Button color='primary' onClick={handleOnSearchButtonClick}>
            Search
          </Button>
        </Grid>
        {showDataGrid && (
          <Fragment key={dataGridKey}>
            <Grid item xs={12}>
              <FettleDataGrid
                $datasource={proxyDataSource$}
                columnsdefination={props.columnsDefinations}
                config={configuration}
                isMultiFieldSearch={true}
              />
            </Grid>
          </Fragment>
        )}
      </Grid>
    )
  }

  return buildFieldsGrid()
}
