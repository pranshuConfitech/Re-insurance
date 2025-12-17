import React from 'react';

import { FormControl, TextField } from '@mui/material';
import { Autocomplete } from '@mui/lab';

const Interventions = ({ x, classes, getServices, handleChangeIntervention, i }: {
  x: any;
  classes: any;
  getServices: any;
  handleChangeIntervention: any;
  i: number;
}) => {
  const [intervention, setIntervention] = React.useState<any>([]);


  return (
    <FormControl className={classes.formControl} fullWidth>
      <Autocomplete
        value={
          x.interventionCode
            ? intervention.find((item: any) => item.value === x.interventionCode) || null
            : null
        }
        onChange={(e, val) => {
          getServices(val);
          handleChangeIntervention(val, i);
        }}
        id="checkboxes-tags-demo"
        options={intervention}
        getOptionLabel={(option: any) => option?.label || ""}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Intervention"
            variant="standard"
            InputProps={{
              ...params.InputProps,
              endAdornment: null, // This removes the clear icon
            }}
          />
        )}
      />
    </FormControl>
  );
};

export default Interventions;
