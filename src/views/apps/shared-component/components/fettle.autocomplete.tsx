
import React, { useEffect } from 'react'

import Checkbox from '@mui/material/Checkbox' // Updated import for Material-UI (MUI v5+)
import CircularProgress from '@mui/material/CircularProgress' // Updated import
import TextField from '@mui/material/TextField' // Updated import
import CheckBoxIcon from '@mui/icons-material/CheckBox' // Updated import
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank' // Updated import
import Autocomplete from '@mui/material/Autocomplete' // Updated import

// const useStyles = makeStyles(theme => ({}));

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' />

let searchId = ''

export function FettleAutocomplete(props: any) {
  // const classes = useStyles();
  const [options, setOptions]: any = React.useState({})
  const [defaultOptions, setDefaultOptions] = React.useState({})
  const [value, setValue]: any[] = React.useState(props.multiple ? [] : null)
  const [currentPage, setCurrentPage] = React.useState(0)
  const [searchText, setSearchText] = React.useState('')
  const [displayKey, setdisplayKey] = React.useState('name')
  const loading = false

  useEffect(() => {
    if (props.txtValue) {
      if (props.displayKey) {
        const obj = props.displayKey.split('.') // {a:{b:{c:{}}}

        obj.reverse()

        const nestedObject = obj.reduce(
          (prev: any, current: any) => ({ [current]: (typeof prev == 'string' && prev) || { ...prev } }),
          props.txtValue
        )

        setValue({ ...nestedObject })
      } else {
        setValue({ name: props.txtValue })
      }
    }
  }, [props.txtValue])

  useEffect(() => {
    if (props.changeDetect) {
      props.$datasource().subscribe((resp: { content: any; totalElements: any }) => {
        setOptions({ values: resp.content, totalCount: resp.totalElements })
        setDefaultOptions({ values: resp.content, totalCount: resp.totalElements })

        if (!props.txtValue) {
          changeValue({ values: resp.content, totalCount: resp.totalElements })
        }
      })
    }
  }, [props.changeDetect])
  useEffect(() => {
    if (!props.txtValue) {
      searchId = props.value
      changeValue()
    }
  }, [props.value])

  const getDisplayValue = (option: any) => {
    if (props.displayKey && option) {
      return props.displayKey.split('.').reduce((a: { [x: string]: any }, prop: string | number) => a[prop], option)
    }

    return option.name || ''
  }

  const changeValue = (list?: any) => {
    if (!list) {
      list = options
    }

    if (JSON.stringify(searchId) != JSON.stringify(value) && list.values?.length > 0) {
      const valueObject = getValueById(searchId, list)

      setValue(valueObject)
    }
  }

  const loadMore = () => {
    if (options?.values.length < options?.totalCount) {
      setCurrentPage(currentPage + 1)

      props.$datasource({ page: currentPage + 1 }, { type: 'load', searchText }).subscribe((resp: { content: any }) => {
        setOptions({ ...options, values: [...options.values, ...resp.content] })

        if (!searchText) {
          setDefaultOptions({ ...options, values: [...options.values, ...resp.content] })
        }
      })
    }
  }

  const searchData = (searchText: React.SetStateAction<string>) => {
    setSearchText(searchText)
    setCurrentPage(0)

    props
      .$datasource({ page: 0 }, { type: 'search', searchText })
      .subscribe((resp: { content: any; totalElements: any }) => {
        setOptions({ values: resp.content, totalCount: resp.totalElements })
      })
  }

  const handleChange = (e: any, newValue: any) => {
    setValue(newValue || '')
    props.onChange(e, newValue)
  }

  const onClose = () => {
    // if (!value) {
    setOptions(defaultOptions)
    setCurrentPage(0)
    setSearchText('')

    // }
  }

  const autocompleteFilterChange = (options: any, state: any) => {
    return [...options]
  }

  const getValueById = (value: any, list: any) => {
    if (list.values && list.values.length > 0 && value) {
      if (!props.multiple) {
        return list.values.find((opt: { id: any }) => opt.id === value.id)
      } else {
        if (value.length > 0) {
          return list.values.filter((opt: { id: any }) => value.indexOf(opt.id) > -1)
        } else {
          return []
        }
      }
    } else {
      const obj = { id: '', name: '' }

      if (props.multiple) return []

      if (props.displayKey) {
        const keys = props.displayKey.split('.')
        const lastKey = keys.pop()
        const lastObj = keys.reduce((obj: any, key: any) => (obj[key] = obj[key] || {}), obj)

        lastObj[lastKey] = ''
      } else {
        obj.name = ''
      }

      return obj
    }
  }

  return (
    <Autocomplete
      ListboxProps={{
        onScroll: event => {
          const listboxNode = event.currentTarget

          if (listboxNode.scrollTop + listboxNode.clientHeight === listboxNode.scrollHeight) {
            loadMore()
          }
        }
      }}
      multiple={props.multiple || false}
      id={props.id}

      // name={props.name}
      value={value ?? (props.multiple ? [] : null)}
      onChange={handleChange}
      onClose={onClose}
      loading={loading}
      options={options.values ?? []}
      getOptionLabel={(option: any) => getDisplayValue(option)}
      filterOptions={autocompleteFilterChange}
      isOptionEqualToValue={(option: any, value: any) => option.id === value?.id}
      renderOption={(prop: any, option, { selected }: { selected: any }) => {
        if (props.multiple) {
          const { key, ...restProps } = prop
          const allSelected = false
          const selectedOpt = (option.id === 'selectall' && allSelected) || selected

          return (
            <li key={option.id} {...restProps}>
              <div style={{ fontSize: '12px' }}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8, color: '#3a7cff' }}
                  checked={selectedOpt}
                />
                {getDisplayValue(option)}
              </div>
            </li>
          )
        } else {
          const { key, ...restProps } = prop
          return <li key={option.id} {...restProps}><div style={{ fontSize: '12px' }}>{getDisplayValue(option)}</div></li>
        }
      }}
      disabled={props.disabled}
      renderInput={params => (
        <TextField
          {...params}
          error={props.error}
          helperText={props.helperText}
          required={props.required}
          onChange={ev => {
            // dont fire API if the user delete or not entered anything
            if ((ev.target.value !== '' || ev.target.value !== null) && ev.target.value.length > 2) {
              searchData(ev.target.value)
            }
          }}
          label={props.label}
          ref={props.ref}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color='inherit' size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  )
}
